/**
 * Appointment Scheduling Service
 * Comprehensive scheduling system with availability management, conflict detection, and calendar integration
 */

import type { ServiceType } from '@/types'
import type { AppointmentInfo, CustomerInfo } from '@/hooks/useBookingSystem'

export interface SchedulingConfig {
  businessHours: {
    [key in DayOfWeek]: {
      isOpen: boolean
      openTime: string // HH:MM format
      closeTime: string // HH:MM format
      breaks?: {
        startTime: string
        endTime: string
        title: string
      }[]
    }
  }
  timeZone: string
  appointmentDurations: {
    [key in ServiceType]: {
      default: number // in minutes
      options: number[]
    }
  }
  bufferTime: number // minutes between appointments
  advanceBookingDays: number // how far in advance can appointments be booked
  cancellationPolicyHours: number // minimum hours before appointment for free cancellation
  reminderSettings: {
    email: number[] // hours before appointment
    sms: number[] // hours before appointment
  }
  maxConcurrentAppointments: number
  blockedDates: string[] // ISO date strings
  holidayDates: string[] // ISO date strings
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export interface TimeSlot {
  startTime: Date
  endTime: Date
  duration: number // in minutes
  available: boolean
  reason?: string // why not available
  appointmentId?: string // if occupied by existing appointment
  serviceTypes?: ServiceType[] // which services can use this slot
}

export interface AvailabilityQuery {
  serviceType: ServiceType
  date?: Date // specific date or date range start
  endDate?: Date // for date range queries
  duration?: number // required appointment duration
  preferredTimes?: 'morning' | 'afternoon' | 'evening' | 'any'
  location?: 'studio' | 'client-location' | 'online' | 'any'
  customerId?: string // for personalized availability
}

export interface SchedulingResult {
  success: boolean
  appointment?: AppointmentInfo
  conflicts?: AppointmentInfo[]
  error?: string
  alternatives?: TimeSlot[]
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  attendees: {
    email: string
    name: string
    status: 'pending' | 'accepted' | 'declined'
  }[]
  reminderMinutes: number[]
  recurrenceRule?: string
  calendarId?: string
  meetingUrl?: string
}

export interface ReschedulingOptions {
  allowCustomerReschedule: boolean
  maxReschedulesPerBooking: number
  rescheduleFeeAmount: number // in cents
  rescheduleFeeWaiverHours: number // hours before appointment
  notifyProvider: boolean
  notifyCustomer: boolean
  requireConfirmation: boolean
}

export interface RecurringSchedule {
  id: string
  pattern: 'daily' | 'weekly' | 'monthly'
  frequency: number // every N days/weeks/months
  daysOfWeek?: DayOfWeek[] // for weekly patterns
  monthlyPattern?: 'day_of_month' | 'week_of_month'
  endDate?: Date
  endAfterOccurrences?: number
  exceptions: Date[] // dates to skip
  appointments: AppointmentInfo[]
}

/**
 * Default scheduling configuration
 */
export const DEFAULT_SCHEDULING_CONFIG: SchedulingConfig = {
  businessHours: {
    monday: {
      isOpen: true,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [{ startTime: '12:00', endTime: '13:00', title: 'Lunch Break' }],
    },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
    sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
  },
  timeZone: 'America/New_York',
  appointmentDurations: {
    teaching: { default: 60, options: [30, 45, 60, 90] },
    performance: { default: 120, options: [60, 120, 180, 240] }, // includes setup/breakdown
    collaboration: { default: 90, options: [60, 90, 120, 180] },
  },
  bufferTime: 15, // 15 minutes between appointments
  advanceBookingDays: 60,
  cancellationPolicyHours: 24,
  reminderSettings: {
    email: [24, 2], // 24 hours and 2 hours before
    sms: [2], // 2 hours before
  },
  maxConcurrentAppointments: 3,
  blockedDates: [],
  holidayDates: [],
}

/**
 * Appointment Scheduling Service
 */
export class AppointmentSchedulingService {
  private config: SchedulingConfig
  private appointments: Map<string, AppointmentInfo> = new Map()
  private recurringSchedules: Map<string, RecurringSchedule> = new Map()

  constructor(config: SchedulingConfig = DEFAULT_SCHEDULING_CONFIG) {
    this.config = config
    this.loadStoredAppointments()
  }

  /**
   * Get available time slots for a given query
   */
  getAvailableTimeSlots(query: AvailabilityQuery): TimeSlot[] {
    const {
      serviceType,
      date = new Date(),
      endDate,
      duration = this.config.appointmentDurations[serviceType].default,
      preferredTimes = 'any',
      // location = 'any'
    } = query

    const slots: TimeSlot[] = []
    const startDate = new Date(date)
    const queryEndDate =
      endDate || new Date(date.getTime() + 24 * 60 * 60 * 1000) // Next day if not specified

    // Generate slots for each day in range
    const currentDate = new Date(startDate)
    while (currentDate <= queryEndDate) {
      const daySlots = this.generateSlotsForDay(
        currentDate,
        serviceType,
        duration,
        preferredTimes
      )
      slots.push(...daySlots)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return slots.filter(slot => this.isSlotAvailable(slot, serviceType))
  }

  /**
   * Schedule a new appointment
   */
  async scheduleAppointment(
    customerInfo: CustomerInfo,
    serviceType: ServiceType,
    requestedDate: Date,
    duration: number,
    location: string,
    locationType: AppointmentInfo['locationType'],
    notes?: string
  ): Promise<SchedulingResult> {
    try {
      // Check if requested time slot is available
      const requestedSlot: TimeSlot = {
        startTime: requestedDate,
        endTime: new Date(requestedDate.getTime() + duration * 60000),
        duration,
        available: true,
      }

      if (!this.isSlotAvailable(requestedSlot, serviceType)) {
        // Find alternative slots
        const alternatives = this.getAvailableTimeSlots({
          serviceType,
          date: new Date(requestedDate.getTime() - 7 * 24 * 60 * 60 * 1000), // Week before
          endDate: new Date(requestedDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Week after
          duration,
        }).slice(0, 5) // Show top 5 alternatives

        return {
          success: false,
          error: 'Requested time slot is not available',
          alternatives,
        }
      }

      // Create appointment
      const appointment: AppointmentInfo = {
        id: this.generateAppointmentId(),
        scheduledDate: requestedDate,
        duration,
        // location,
        locationType,
        status: 'scheduled',
        remindersSent: [],
        rescheduleHistory: [],
      }

      // Store appointment
      this.appointments.set(appointment.id, appointment)
      await this.persistAppointments()

      // Create calendar event
      const calendarEvent = await this.createCalendarEvent(
        appointment,
        customerInfo,
        serviceType,
        notes
      )
      appointment.calendarInviteId = calendarEvent.id

      // Schedule reminders
      await this.scheduleReminders(appointment, customerInfo)

      // Generate meeting link for online appointments
      if (locationType === 'online') {
        appointment.meetingLink = await this.generateMeetingLink(appointment)
      }

      return {
        success: true,
        appointment,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to schedule appointment',
      }
    }
  }

  /**
   * Reschedule an existing appointment
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: Date,
    duration?: number,
    reason?: string,
    initiatedBy: 'customer' | 'provider' = 'customer'
  ): Promise<SchedulingResult> {
    const appointment = this.appointments.get(appointmentId)
    if (!appointment) {
      return {
        success: false,
        error: 'Appointment not found',
      }
    }

    const newDuration = duration || appointment.duration
    const newSlot: TimeSlot = {
      startTime: newDate,
      endTime: new Date(newDate.getTime() + newDuration * 60000),
      duration: newDuration,
      available: true,
    }

    // Check availability of new slot (excluding current appointment)
    if (!this.isSlotAvailable(newSlot, 'teaching', appointmentId)) {
      const alternatives = this.getAvailableTimeSlots({
        serviceType: 'teaching', // Would be determined from appointment
        date: newDate,
        duration: newDuration,
      }).slice(0, 3)

      return {
        success: false,
        error: 'New time slot is not available',
        alternatives,
      }
    }

    // Check reschedule policy
    const hoursUntilAppointment =
      (appointment.scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60)
    const reschedulingOptions = this.getReschedulingOptions()

    if (
      hoursUntilAppointment < reschedulingOptions.rescheduleFeeWaiverHours &&
      initiatedBy === 'customer'
    ) {
      // Would charge reschedule fee in real implementation
      console.log(
        `Reschedule fee of ${reschedulingOptions.rescheduleFeeAmount / 100} would apply`
      )
    }

    // Update appointment
    const rescheduleEntry = {
      originalDate: appointment.scheduledDate,
      newDate,
      reason: reason || 'Rescheduled by request',
      // initiatedBy,
      timestamp: new Date(),
    }

    appointment.scheduledDate = newDate
    appointment.duration = newDuration
    appointment.status = 'rescheduled'
    appointment.rescheduleHistory = appointment.rescheduleHistory || []
    appointment.rescheduleHistory.push(rescheduleEntry)

    // Update calendar event
    if (appointment.calendarInviteId) {
      await this.updateCalendarEvent(appointment.calendarInviteId, {
        startDate: newDate,
        endDate: new Date(newDate.getTime() + newDuration * 60000),
      })
    }

    await this.persistAppointments()

    return {
      success: true,
      appointment,
    }
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(
    appointmentId: string,
    reason: string,
    // initiatedBy: 'customer' | 'provider' = 'customer',
    refundAmount?: number
  ): Promise<{ success: boolean; error?: string }> {
    const appointment = this.appointments.get(appointmentId)
    if (!appointment) {
      return { success: false, error: 'Appointment not found' }
    }

    // Check cancellation policy
    const hoursUntilAppointment =
      (appointment.scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60)
    const canCancelFree =
      hoursUntilAppointment >= this.config.cancellationPolicyHours

    // Update appointment status
    appointment.status = 'cancelled'

    // Cancel calendar event
    if (appointment.calendarInviteId) {
      await this.cancelCalendarEvent(appointment.calendarInviteId, reason)
    }

    await this.persistAppointments()

    console.log(`Appointment cancelled. Free cancellation: ${canCancelFree}`)
    if (refundAmount) {
      console.log(`Refund amount: $${refundAmount / 100}`)
    }

    return { success: true }
  }

  /**
   * Get appointments for a date range
   */
  getAppointments(
    startDate: Date,
    endDate: Date,
    serviceType?: ServiceType
  ): AppointmentInfo[] {
    return Array.from(this.appointments.values()).filter(appointment => {
      if (
        appointment.scheduledDate < startDate ||
        appointment.scheduledDate > endDate
      ) {
        return false
      }
      if (serviceType && appointment.locationType) {
        // Would check service type if stored in appointment
        return true
      }
      return true
    })
  }

  /**
   * Create recurring schedule
   */
  createRecurringSchedule(
    customerId: string,
    serviceType: ServiceType,
    pattern: RecurringSchedule['pattern'],
    frequency: number,
    startTime: Date,
    duration: number,
    endDate?: Date,
    endAfterOccurrences?: number,
    daysOfWeek?: DayOfWeek[]
  ): RecurringSchedule {
    const schedule: RecurringSchedule = {
      id: `recurring_${Date.now()}`,
      pattern,
      frequency,
      daysOfWeek,
      endDate,
      endAfterOccurrences,
      exceptions: [],
      appointments: [],
    }

    // Generate recurring appointments
    const occurrences = this.generateRecurringAppointments(
      schedule,
      startTime,
      duration,
      serviceType
    )

    schedule.appointments = occurrences
    this.recurringSchedules.set(schedule.id, schedule)

    return schedule
  }

  /**
   * Send appointment reminders
   */
  async sendReminders(): Promise<void> {
    const now = new Date()
    const reminderWindows = [
      ...this.config.reminderSettings.email,
      ...this.config.reminderSettings.sms,
    ]

    for (const appointment of this.appointments.values()) {
      if (
        appointment.status !== 'scheduled' &&
        appointment.status !== 'confirmed'
      ) {
        continue
      }

      const hoursUntilAppointment =
        (appointment.scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      for (const reminderHours of reminderWindows) {
        const reminderKey = `${reminderHours}h`

        if (
          hoursUntilAppointment <= reminderHours &&
          hoursUntilAppointment > reminderHours - 0.5 && // 30-minute window
          !appointment.remindersSent.includes(reminderKey)
        ) {
          await this.sendReminderNotification(appointment, reminderHours)
          appointment.remindersSent.push(reminderKey)
        }
      }
    }

    await this.persistAppointments()
  }

  /**
   * Generate time slots for a specific day
   */
  private generateSlotsForDay(
    date: Date,
    serviceType: ServiceType,
    duration: number,
    preferredTimes: AvailabilityQuery['preferredTimes']
  ): TimeSlot[] {
    const dayOfWeek = this.getDayOfWeek(date)
    const businessHours = this.config.businessHours[dayOfWeek]

    if (!businessHours.isOpen) {
      return []
    }

    // Check if date is blocked
    const dateString = date.toISOString().split('T')[0]
    if (
      this.config.blockedDates.includes(dateString) ||
      this.config.holidayDates.includes(dateString)
    ) {
      return []
    }

    const slots: TimeSlot[] = []
    const [openHour, openMinute] = businessHours.openTime.split(':').map(Number)
    const [closeHour, closeMinute] = businessHours.closeTime
      .split(':')
      .map(Number)

    const currentTime = new Date(date)
    currentTime.setHours(openHour, openMinute, 0, 0)

    const closeTime = new Date(date)
    closeTime.setHours(closeHour, closeMinute, 0, 0)

    while (currentTime.getTime() + duration * 60000 <= closeTime.getTime()) {
      const endTime = new Date(currentTime.getTime() + duration * 60000)

      // Check if slot conflicts with breaks
      const conflictsWithBreak = businessHours.breaks?.some(breakTime => {
        const [breakStartHour, breakStartMinute] = breakTime.startTime
          .split(':')
          .map(Number)
        const [breakEndHour, breakEndMinute] = breakTime.endTime
          .split(':')
          .map(Number)

        const breakStart = new Date(date)
        breakStart.setHours(breakStartHour, breakStartMinute, 0, 0)

        const breakEnd = new Date(date)
        breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0)

        return currentTime < breakEnd && endTime > breakStart
      })

      if (
        !conflictsWithBreak &&
        this.matchesPreferredTime(currentTime, preferredTimes)
      ) {
        slots.push({
          startTime: new Date(currentTime),
          endTime: new Date(endTime),
          duration,
          available: true,
          serviceTypes: [serviceType],
        })
      }

      // Move to next slot (including buffer time)
      currentTime.setMinutes(
        currentTime.getMinutes() + duration + this.config.bufferTime
      )
    }

    return slots
  }

  /**
   * Check if a time slot is available
   */
  private isSlotAvailable(
    slot: TimeSlot,
    serviceType: ServiceType,
    excludeAppointmentId?: string
  ): boolean {
    // Check if past the advance booking limit
    const maxAdvanceDate = new Date()
    maxAdvanceDate.setDate(
      maxAdvanceDate.getDate() + this.config.advanceBookingDays
    )
    if (slot.startTime > maxAdvanceDate) {
      return false
    }

    // Check for conflicts with existing appointments
    for (const appointment of this.appointments.values()) {
      if (excludeAppointmentId && appointment.id === excludeAppointmentId) {
        continue
      }

      if (appointment.status === 'cancelled') {
        continue
      }

      const appointmentEnd = new Date(
        appointment.scheduledDate.getTime() + appointment.duration * 60000
      )

      // Check for overlap
      if (
        slot.startTime < appointmentEnd &&
        slot.endTime > appointment.scheduledDate
      ) {
        return false
      }
    }

    // Check concurrent appointment limit
    const concurrentCount = Array.from(this.appointments.values()).filter(
      appointment => {
        if (appointment.status === 'cancelled') return false

        const appointmentEnd = new Date(
          appointment.scheduledDate.getTime() + appointment.duration * 60000
        )
        return (
          slot.startTime < appointmentEnd &&
          slot.endTime > appointment.scheduledDate
        )
      }
    ).length

    return concurrentCount < this.config.maxConcurrentAppointments
  }

  /**
   * Generate recurring appointments based on schedule pattern
   */
  private generateRecurringAppointments(
    schedule: RecurringSchedule,
    startTime: Date,
    duration: number
    // serviceType: ServiceType
  ): AppointmentInfo[] {
    const appointments: AppointmentInfo[] = []
    const currentDate = new Date(startTime)
    let occurrenceCount = 0
    const maxOccurrences = schedule.endAfterOccurrences || 52 // Default to 1 year

    while (occurrenceCount < maxOccurrences) {
      if (schedule.endDate && currentDate > schedule.endDate) {
        break
      }

      // Check if date should be included based on pattern
      let shouldInclude = false

      switch (schedule.pattern) {
        case 'daily':
          shouldInclude = true
          break
        case 'weekly': {
          const dayOfWeek = this.getDayOfWeek(currentDate)
          shouldInclude = schedule.daysOfWeek?.includes(dayOfWeek) || false
          break
        }
        case 'monthly':
          shouldInclude = currentDate.getDate() === startTime.getDate()
          break
      }

      if (
        shouldInclude &&
        !schedule.exceptions.some(ex => this.isSameDay(ex, currentDate))
      ) {
        const appointment: AppointmentInfo = {
          id: this.generateAppointmentId(),
          scheduledDate: new Date(currentDate),
          duration,
          location: 'Studio', // Would be configurable
          locationType: 'studio',
          status: 'scheduled',
          remindersSent: [],
        }

        appointments.push(appointment)
        occurrenceCount++
      }

      // Move to next occurrence
      switch (schedule.pattern) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + schedule.frequency)
          break
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7 * schedule.frequency)
          break
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + schedule.frequency)
          break
      }
    }

    return appointments
  }

  /**
   * Helper methods
   */
  private getDayOfWeek(date: Date): DayOfWeek {
    const days: DayOfWeek[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]
    return days[date.getDay()]
  }

  private matchesPreferredTime(
    time: Date,
    preferredTimes: AvailabilityQuery['preferredTimes']
  ): boolean {
    if (preferredTimes === 'any') return true

    const hour = time.getHours()
    switch (preferredTimes) {
      case 'morning':
        return hour >= 6 && hour < 12
      case 'afternoon':
        return hour >= 12 && hour < 17
      case 'evening':
        return hour >= 17 && hour < 21
      default:
        return true
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString()
  }

  private generateAppointmentId(): string {
    return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getReschedulingOptions(): ReschedulingOptions {
    return {
      allowCustomerReschedule: true,
      maxReschedulesPerBooking: 3,
      rescheduleFeeAmount: 1500, // $15.00
      rescheduleFeeWaiverHours: this.config.cancellationPolicyHours,
      notifyProvider: true,
      notifyCustomer: true,
      requireConfirmation: false,
    }
  }

  /**
   * Calendar integration methods (mock implementations)
   */
  private async createCalendarEvent(
    appointment: AppointmentInfo,
    customerInfo: CustomerInfo,
    serviceType: ServiceType,
    notes?: string
  ): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: `cal_${appointment.id}`,
      title: `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Session - ${customerInfo.firstName} ${customerInfo.lastName}`,
      description: notes || `${serviceType} appointment`,
      startDate: appointment.scheduledDate,
      endDate: new Date(
        appointment.scheduledDate.getTime() + appointment.duration * 60000
      ),
      location: appointment.location,
      attendees: [
        {
          email: customerInfo.email,
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          status: 'pending',
        },
      ],
      reminderMinutes: [120, 30], // 2 hours and 30 minutes before
      meetingUrl: appointment.meetingLink,
    }

    // In real implementation, would integrate with Google Calendar, Outlook, etc.
    console.log('Calendar event created:', event)
    return event
  }

  private async updateCalendarEvent(
    eventId: string,
    updates: Partial<CalendarEvent>
  ): Promise<void> {
    console.log(`Updating calendar event ${eventId}:`, updates)
  }

  private async cancelCalendarEvent(
    eventId: string,
    reason: string
  ): Promise<void> {
    console.log(`Cancelling calendar event ${eventId}: ${reason}`)
  }

  private async generateMeetingLink(
    appointment: AppointmentInfo
  ): Promise<string> {
    // In real implementation, would integrate with Zoom, Google Meet, etc.
    return `https://meet.rrishmusic.com/room/${appointment.id}`
  }

  private async scheduleReminders(
    appointment: AppointmentInfo,
    customerInfo: CustomerInfo
  ): Promise<void> {
    console.log(
      `Reminders scheduled for appointment ${appointment.id} to ${customerInfo.email}`
    )
  }

  private async sendReminderNotification(
    appointment: AppointmentInfo,
    hoursBeforeAppointment: number
  ): Promise<void> {
    console.log(
      `Sending ${hoursBeforeAppointment}h reminder for appointment ${appointment.id}`
    )
  }

  /**
   * Data persistence methods
   */
  private loadStoredAppointments(): void {
    try {
      const stored = localStorage.getItem('appointments_data')
      if (stored) {
        const data = JSON.parse(stored)
        this.appointments.clear()

        Object.entries(data.appointments || {}).forEach(([id, appointment]) => {
          const apt = appointment as AppointmentInfo & { scheduledDate: string }
          apt.scheduledDate = new Date(apt.scheduledDate)
          this.appointments.set(id, apt as AppointmentInfo)
        })
      }
    } catch (error) {
      console.warn('Failed to load stored appointments:', error)
    }
  }

  private async persistAppointments(): Promise<void> {
    try {
      const data = {
        appointments: Object.fromEntries(this.appointments),
        recurringSchedules: Object.fromEntries(this.recurringSchedules),
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem('appointments_data', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to persist appointments:', error)
    }
  }
}

/**
 * Create appointment scheduling service instance
 */
export function createAppointmentSchedulingService(
  config?: Partial<SchedulingConfig>
): AppointmentSchedulingService {
  return new AppointmentSchedulingService({
    ...DEFAULT_SCHEDULING_CONFIG,
    ...config,
  })
}

/**
 * Format appointment duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}m`
}

/**
 * Get next available appointment slot
 */
export function getNextAvailableSlot(
  service: AppointmentSchedulingService,
  serviceType: ServiceType,
  duration?: number
): TimeSlot | null {
  const slots = service.getAvailableTimeSlots({
    serviceType,
    date: new Date(),
    duration,
  })

  return slots.length > 0 ? slots[0] : null
}

export default {
  AppointmentSchedulingService,
  createAppointmentSchedulingService,
  formatDuration,
  getNextAvailableSlot,
  DEFAULT_SCHEDULING_CONFIG,
}
