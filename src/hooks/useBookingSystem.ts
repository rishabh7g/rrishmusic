/**
 * Booking System Hook
 * Comprehensive booking management for all services with payment integration and scheduling
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { ServiceType } from '@/types'
import type { PriceEstimate } from '@/utils/pricingEstimation'
import type { PricingCalculation } from '@/utils/pricingCalculator'

export interface BookingDetails {
  id: string
  serviceType: ServiceType
  customerInfo: CustomerInfo
  serviceDetails: ServiceDetails
  pricing: PricingInfo
  appointment?: AppointmentInfo
  payment?: PaymentInfo
  status: BookingStatus
  createdAt: Date
  updatedAt: Date
  notes?: string
  metadata: Record<string, unknown>
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContactMethod: 'email' | 'phone' | 'text'
  timezone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface ServiceDetails {
  // Teaching service details
  lessonType?: 'individual' | 'group' | 'online' | 'in-person'
  sessionCount?: number
  packageType?: 'single' | 'package-4' | 'package-8' | 'package-12'
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'

  // Performance service details
  performanceFormat?: 'solo' | 'band' | 'flexible'
  performanceStyle?: 'acoustic' | 'electric' | 'both'
  eventType?: 'wedding' | 'corporate' | 'venue' | 'private' | 'other'
  eventDate?: string
  duration?: string
  guestCount?: string
  venueAddress?: string

  // Collaboration service details
  projectType?: 'studio' | 'creative' | 'partnership' | 'other'
  projectScope?: 'single-session' | 'short-term' | 'long-term' | 'ongoing'
  timeline?: 'urgent' | 'flexible' | 'specific-date' | 'ongoing'
  experience?: 'first-time' | 'some-experience' | 'experienced' | 'professional'
  creativeVision?: string

  // Common details
  specialRequests?: string
  equipmentNeeds?: string[]
  location?: 'studio' | 'client-location' | 'online' | 'to-be-determined'
}

export interface PricingInfo {
  serviceType: ServiceType
  basePrice: number
  adjustments: {
    name: string
    amount: number
    description: string
  }[]
  totalPrice: number
  currency: string
  estimate?: PriceEstimate
  calculation?: PricingCalculation
  paymentSchedule?: PaymentSchedule[]
  discounts?: {
    code: string
    amount: number
    type: 'percentage' | 'fixed'
    description: string
  }[]
}

export interface PaymentSchedule {
  id: string
  amount: number
  dueDate: Date
  description: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  paymentMethod?: string
  transactionId?: string
}

export interface AppointmentInfo {
  id: string
  scheduledDate: Date
  duration: number // in minutes
  location: string
  locationType: 'studio' | 'client-location' | 'online' | 'venue'
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled'
  remindersSent: string[]
  rescheduleHistory?: {
    originalDate: Date
    newDate: Date
    reason: string
    initiatedBy: 'customer' | 'provider'
    timestamp: Date
  }[]
  meetingLink?: string // For online sessions
  calendarInviteId?: string
}

export interface PaymentInfo {
  id: string
  amount: number
  currency: string
  method: 'card' | 'bank_transfer' | 'paypal' | 'cash' | 'check'
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'refunded'
    | 'cancelled'
  gateway: 'stripe' | 'paypal' | 'square' | 'manual'
  gatewayTransactionId?: string
  gatewayCustomerId?: string
  processedAt?: Date
  failureReason?: string
  refunds?: {
    id: string
    amount: number
    reason: string
    processedAt: Date
  }[]
}

export type BookingStatus =
  | 'draft'
  | 'pending_payment'
  | 'payment_processing'
  | 'confirmed'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'no_show'

export interface BookingValidation {
  isValid: boolean
  errors: Record<string, string>
  warnings: Record<string, string>
  completeness: number // 0-100
}

export interface UseBookingSystemOptions {
  serviceType?: ServiceType
  enableAutosave?: boolean
  autosaveInterval?: number // in milliseconds
  enableNotifications?: boolean
  validateOnChange?: boolean
}

export interface UseBookingSystemReturn {
  // Current booking state
  currentBooking: BookingDetails | null
  bookingHistory: BookingDetails[]

  // UI state
  isLoading: boolean
  isProcessing: boolean
  error: string | null
  validation: BookingValidation

  // Booking management
  createBooking: (
    serviceType: ServiceType,
    initialData?: Partial<BookingDetails>
  ) => string
  updateBooking: (updates: Partial<BookingDetails>) => void
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void
  updateServiceDetails: (details: Partial<ServiceDetails>) => void
  updatePricing: (pricing: Partial<PricingInfo>) => void

  // Payment processing
  processPayment: (
    paymentDetails: PaymentProcessingRequest
  ) => Promise<PaymentResult>
  refundPayment: (
    bookingId: string,
    amount: number,
    reason: string
  ) => Promise<RefundResult>
  updatePaymentMethod: (bookingId: string, method: string) => void

  // Appointment scheduling
  scheduleAppointment: (
    bookingId: string,
    appointment: Partial<AppointmentInfo>
  ) => Promise<AppointmentResult>
  rescheduleAppointment: (
    bookingId: string,
    newDate: Date,
    reason: string
  ) => Promise<AppointmentResult>
  cancelAppointment: (bookingId: string, reason: string) => Promise<void>

  // Booking lifecycle
  confirmBooking: (bookingId: string) => Promise<void>
  cancelBooking: (bookingId: string, reason: string) => Promise<void>
  completeBooking: (bookingId: string) => Promise<void>

  // Utilities
  validateBooking: (booking?: BookingDetails) => BookingValidation
  calculateTotal: (booking?: BookingDetails) => number
  getAvailableTimeSlots: (date: Date, duration: number) => TimeSlot[]
  sendBookingConfirmation: (bookingId: string) => Promise<void>

  // Data management
  saveBooking: () => Promise<void>
  loadBooking: (bookingId: string) => Promise<void>
  clearCurrentBooking: () => void
}

export interface PaymentProcessingRequest {
  bookingId: string
  amount: number
  currency: string
  paymentMethod: {
    type: 'card' | 'bank_transfer' | 'paypal'
    cardToken?: string
    bankAccount?: string
    paypalEmail?: string
  }
  customerInfo: CustomerInfo
  billingAddress?: CustomerInfo['address']
  description: string
  metadata?: Record<string, unknown>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  paymentInfo?: PaymentInfo
}

export interface RefundResult {
  success: boolean
  refundId?: string
  amount: number
  error?: string
}

export interface AppointmentResult {
  success: boolean
  appointment?: AppointmentInfo
  error?: string
  conflictingAppointments?: AppointmentInfo[]
}

export interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
  reason?: string // Why not available
}

/**
 * Main booking system hook
 */
export function useBookingSystem(
  options: UseBookingSystemOptions = {}
): UseBookingSystemReturn {
  const {
    // serviceType,
    enableAutosave = true,
    autosaveInterval = 30000, // 30 seconds
    enableNotifications = true,
    validateOnChange = true,
  } = options

  // Core state
  const [currentBooking, setCurrentBooking] = useState<BookingDetails | null>(
    null
  )
  const [bookingHistory, setBookingHistory] = useState<BookingDetails[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Create a new booking
   */
  const createBooking = useCallback(
    (
      bookingServiceType: ServiceType,
      initialData?: Partial<BookingDetails>
    ): string => {
      const bookingId = generateBookingId()

      const newBooking: BookingDetails = {
        id: bookingId,
        serviceType: bookingServiceType,
        customerInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          preferredContactMethod: 'email',
        },
        serviceDetails: {},
        pricing: {
          serviceType: bookingServiceType,
          basePrice: 0,
          adjustments: [],
          totalPrice: 0,
          currency: 'USD',
        },
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
        ...initialData,
      }

      setCurrentBooking(newBooking)
      setError(null)

      return bookingId
    },
    []
  )

  /**
   * Update booking with partial data
   */
  const updateBooking = useCallback((updates: Partial<BookingDetails>) => {
    setCurrentBooking(prev =>
      prev
        ? {
            ...prev,
            ...updates,
            updatedAt: new Date(),
          }
        : null
    )
  }, [])

  /**
   * Update customer information
   */
  const updateCustomerInfo = useCallback((info: Partial<CustomerInfo>) => {
    setCurrentBooking(prev =>
      prev
        ? {
            ...prev,
            customerInfo: { ...prev.customerInfo, ...info },
            updatedAt: new Date(),
          }
        : null
    )
  }, [])

  /**
   * Update service details
   */
  const updateServiceDetails = useCallback(
    (details: Partial<ServiceDetails>) => {
      setCurrentBooking(prev =>
        prev
          ? {
              ...prev,
              serviceDetails: { ...prev.serviceDetails, ...details },
              updatedAt: new Date(),
            }
          : null
      )
    },
    []
  )

  /**
   * Update pricing information
   */
  const updatePricing = useCallback((pricing: Partial<PricingInfo>) => {
    setCurrentBooking(prev =>
      prev
        ? {
            ...prev,
            pricing: { ...prev.pricing, ...pricing },
            updatedAt: new Date(),
          }
        : null
    )
  }, [])

  /**
   * Process payment
   */
  const processPayment = useCallback(
    async (request: PaymentProcessingRequest): Promise<PaymentResult> => {
      setIsProcessing(true)
      setError(null)

      try {
        // In a real implementation, this would call actual payment gateway
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

        const paymentInfo: PaymentInfo = {
          id: generatePaymentId(),
          amount: request.amount,
          currency: request.currency,
          method: request.paymentMethod.type,
          status: 'completed',
          gateway: 'stripe', // Would be determined by payment method
          gatewayTransactionId: `tx_${Date.now()}`,
          processedAt: new Date(),
        }

        // Update booking with payment info
        updateBooking({
          payment: paymentInfo,
          status: 'confirmed',
        })

        return {
          success: true,
          transactionId: paymentInfo.gatewayTransactionId,
          paymentInfo,
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Payment processing failed'
        setError(errorMessage)
        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [updateBooking]
  )

  /**
   * Refund payment
   */
  const refundPayment = useCallback(
    async (
      bookingId: string,
      amount: number,
      reason: string
    ): Promise<RefundResult> => {
      setIsProcessing(true)

      try {
        // Simulate refund processing
        await new Promise(resolve => setTimeout(resolve, 1500))

        const refund = {
          id: `ref_${Date.now()}`,
          amount,
          reason,
          processedAt: new Date(),
        }

        // Update booking payment with refund
        setCurrentBooking(prev =>
          prev && prev.id === bookingId
            ? {
                ...prev,
                payment: prev.payment
                  ? {
                      ...prev.payment,
                      refunds: [...(prev.payment.refunds || []), refund],
                      status:
                        amount >= prev.payment.amount
                          ? 'refunded'
                          : 'completed',
                    }
                  : prev.payment,
                status:
                  amount >= (prev.payment?.amount || 0)
                    ? 'refunded'
                    : prev.status,
                updatedAt: new Date(),
              }
            : prev
        )

        return {
          success: true,
          refundId: refund.id,
          amount,
        }
      } catch (error) {
        return {
          success: false,
          amount,
          error:
            error instanceof Error ? error.message : 'Refund processing failed',
        }
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  /**
   * Schedule appointment
   */
  const scheduleAppointment = useCallback(
    async (
      bookingId: string,
      appointment: Partial<AppointmentInfo>
    ): Promise<AppointmentResult> => {
      setIsProcessing(true)

      try {
        // Check for conflicts (simplified)
        const conflictingAppointments = await checkAppointmentConflicts(
          appointment.scheduledDate || new Date(),
          appointment.duration || 60
        )

        if (conflictingAppointments.length > 0) {
          return {
            success: false,
            error: 'Time slot conflicts with existing appointment',
            conflictingAppointments,
          }
        }

        const newAppointment: AppointmentInfo = {
          id: generateAppointmentId(),
          scheduledDate: appointment.scheduledDate || new Date(),
          duration: appointment.duration || 60,
          location: appointment.location || 'TBD',
          locationType: appointment.locationType || 'studio',
          status: 'scheduled',
          remindersSent: [],
          calendarInviteId: `cal_${Date.now()}`,
          ...appointment,
        }

        // Update booking with appointment
        setCurrentBooking(prev =>
          prev && prev.id === bookingId
            ? {
                ...prev,
                appointment: newAppointment,
                status: 'scheduled',
                updatedAt: new Date(),
              }
            : prev
        )

        return {
          success: true,
          appointment: newAppointment,
        }
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Appointment scheduling failed',
        }
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  /**
   * Reschedule appointment
   */
  const rescheduleAppointment = useCallback(
    async (
      bookingId: string,
      newDate: Date,
      reason: string
    ): Promise<AppointmentResult> => {
      setIsProcessing(true)

      try {
        const conflicts = await checkAppointmentConflicts(newDate, 60)

        if (conflicts.length > 0) {
          return {
            success: false,
            error: 'New time slot conflicts with existing appointment',
            conflictingAppointments: conflicts,
          }
        }

        setCurrentBooking(prev => {
          if (!prev || prev.id !== bookingId || !prev.appointment) return prev

          const rescheduleEntry = {
            originalDate: prev.appointment.scheduledDate,
            newDate,
            reason,
            initiatedBy: 'customer' as const,
            timestamp: new Date(),
          }

          return {
            ...prev,
            appointment: {
              ...prev.appointment,
              scheduledDate: newDate,
              status: 'rescheduled',
              rescheduleHistory: [
                ...(prev.appointment.rescheduleHistory || []),
                rescheduleEntry,
              ],
            },
            updatedAt: new Date(),
          }
        })

        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Rescheduling failed',
        }
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  /**
   * Cancel appointment
   */
  const cancelAppointment = useCallback(
    async (bookingId: string, reason: string) => {
      setCurrentBooking(prev =>
        prev && prev.id === bookingId && prev.appointment
          ? {
              ...prev,
              appointment: {
                ...prev.appointment,
                status: 'cancelled',
              },
              status: 'cancelled',
              notes: reason,
              updatedAt: new Date(),
            }
          : prev
      )
    },
    []
  )

  /**
   * Confirm booking
   */
  const confirmBooking = useCallback(
    async (bookingId: string) => {
      updateBooking({ status: 'confirmed' })
      if (enableNotifications) {
        await sendBookingConfirmation(bookingId)
      }
    },
    [updateBooking, enableNotifications, sendBookingConfirmation]
  )

  /**
   * Cancel booking
   */
  const cancelBooking = useCallback(
    async (bookingId: string, reason: string) => {
      updateBooking({
        status: 'cancelled',
        notes: reason,
      })
    },
    [updateBooking]
  )

  /**
   * Complete booking
   */
  const completeBooking = useCallback(async () => {
    updateBooking({ status: 'completed' })
  }, [updateBooking])

  /**
   * Validate booking
   */
  const validateBooking = useCallback(
    (booking?: BookingDetails): BookingValidation => {
      const bookingToValidate = booking || currentBooking
      if (!bookingToValidate) {
        return {
          isValid: false,
          errors: { general: 'No booking data to validate' },
          warnings: {},
          completeness: 0,
        }
      }

      const errors: Record<string, string> = {}
      const warnings: Record<string, string> = {}
      let completedFields = 0
      const totalFields = 10 // Approximate total required fields

      // Validate customer info
      if (!bookingToValidate.customerInfo.firstName) {
        errors.firstName = 'First name is required'
      } else completedFields++

      if (!bookingToValidate.customerInfo.lastName) {
        errors.lastName = 'Last name is required'
      } else completedFields++

      if (!bookingToValidate.customerInfo.email) {
        errors.email = 'Email is required'
      } else if (!isValidEmail(bookingToValidate.customerInfo.email)) {
        errors.email = 'Invalid email format'
      } else completedFields++

      if (!bookingToValidate.customerInfo.phone) {
        warnings.phone = 'Phone number recommended for better communication'
      } else completedFields++

      // Service-specific validation
      if (bookingToValidate.serviceType === 'teaching') {
        if (!bookingToValidate.serviceDetails.lessonType) {
          errors.lessonType = 'Lesson type is required'
        } else completedFields++

        if (!bookingToValidate.serviceDetails.skillLevel) {
          warnings.skillLevel = 'Skill level helps customize the lessons'
        } else completedFields++
      }

      // Pricing validation
      if (bookingToValidate.pricing.totalPrice <= 0) {
        errors.pricing = 'Invalid pricing information'
      } else completedFields++

      const completeness = Math.round((completedFields / totalFields) * 100)
      const isValid = Object.keys(errors).length === 0

      return {
        isValid,
        errors,
        warnings,
        completeness,
      }
    },
    [currentBooking]
  )

  /**
   * Calculate total price
   */
  const calculateTotal = useCallback(
    (booking?: BookingDetails): number => {
      const bookingToCalculate = booking || currentBooking
      if (!bookingToCalculate) return 0

      let total = bookingToCalculate.pricing.basePrice

      // Add adjustments
      bookingToCalculate.pricing.adjustments.forEach(adj => {
        total += adj.amount
      })

      // Apply discounts
      if (bookingToCalculate.pricing.discounts) {
        bookingToCalculate.pricing.discounts.forEach(discount => {
          if (discount.type === 'percentage') {
            total -= (total * discount.amount) / 100
          } else {
            total -= discount.amount
          }
        })
      }

      return Math.max(0, total)
    },
    [currentBooking]
  )

  /**
   * Get available time slots
   */
  const getAvailableTimeSlots = useCallback(
    (date: Date, duration: number): TimeSlot[] => {
      // Mock implementation - in real app, this would check actual availability
      const slots: TimeSlot[] = []
      const businessHours = { start: 9, end: 18 } // 9 AM to 6 PM

      for (
        let hour = businessHours.start;
        hour < businessHours.end;
        hour += 2
      ) {
        const startTime = new Date(date)
        startTime.setHours(hour, 0, 0, 0)

        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + duration)

        slots.push({
          startTime,
          endTime,
          available: Math.random() > 0.3, // 70% chance of being available
        })
      }

      return slots
    },
    []
  )

  /**
   * Send booking confirmation
   */
  const sendBookingConfirmation = useCallback(async (bookingId: string) => {
    // Mock implementation
    console.log(`Sending booking confirmation for ${bookingId}`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }, [])

  /**
   * Update payment method
   */
  const updatePaymentMethod = useCallback(
    (bookingId: string, method: string) => {
      setCurrentBooking(prev =>
        prev && prev.id === bookingId && prev.payment
          ? {
              ...prev,
              payment: {
                ...prev.payment,
                method: method as PaymentInfo['method'],
              },
              updatedAt: new Date(),
            }
          : prev
      )
    },
    []
  )

  /**
   * Save booking to persistent storage
   */
  const saveBooking = useCallback(async () => {
    if (!currentBooking) return

    setIsLoading(true)
    try {
      // Save to localStorage (in production, would save to backend)
      localStorage.setItem(
        `booking_${currentBooking.id}`,
        JSON.stringify(currentBooking)
      )

      // Add to history if not already there
      setBookingHistory(prev => {
        const existingIndex = prev.findIndex(b => b.id === currentBooking.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = currentBooking
          return updated
        }
        return [...prev, currentBooking]
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentBooking])

  /**
   * Load booking from storage
   */
  const loadBooking = useCallback(async (bookingId: string) => {
    setIsLoading(true)
    try {
      const stored = localStorage.getItem(`booking_${bookingId}`)
      if (stored) {
        const booking = JSON.parse(stored)
        // Convert date strings back to Date objects
        booking.createdAt = new Date(booking.createdAt)
        booking.updatedAt = new Date(booking.updatedAt)
        if (booking.appointment?.scheduledDate) {
          booking.appointment.scheduledDate = new Date(
            booking.appointment.scheduledDate
          )
        }
        setCurrentBooking(booking)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Clear current booking
   */
  const clearCurrentBooking = useCallback(() => {
    setCurrentBooking(null)
    setError(null)
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!enableAutosave || !currentBooking) return

    const interval = setInterval(() => {
      saveBooking()
    }, autosaveInterval)

    return () => clearInterval(interval)
  }, [enableAutosave, currentBooking, autosaveInterval, saveBooking])

  // Validation on change
  const validation = useMemo(() => {
    if (!validateOnChange) {
      return { isValid: true, errors: {}, warnings: {}, completeness: 100 }
    }
    return validateBooking()
  }, [validateOnChange, validateBooking])

  // Load booking history on mount
  useEffect(() => {
    // Load recent bookings from localStorage
    const loadHistory = () => {
      const history: BookingDetails[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('booking_')) {
          try {
            const booking = JSON.parse(localStorage.getItem(key) || '')
            booking.createdAt = new Date(booking.createdAt)
            booking.updatedAt = new Date(booking.updatedAt)
            history.push(booking)
          } catch (error) {
            console.warn('Failed to load booking from localStorage:', error)
          }
        }
      }
      setBookingHistory(
        history.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      )
    }

    loadHistory()
  }, [])

  return {
    // Current booking state
    currentBooking,
    bookingHistory,

    // UI state
    isLoading,
    isProcessing,
    error,
    validation,

    // Booking management
    createBooking,
    updateBooking,
    updateCustomerInfo,
    updateServiceDetails,
    updatePricing,

    // Payment processing
    processPayment,
    refundPayment,
    updatePaymentMethod,

    // Appointment scheduling
    scheduleAppointment,
    rescheduleAppointment,
    cancelAppointment,

    // Booking lifecycle
    confirmBooking,
    cancelBooking,
    completeBooking,

    // Utilities
    validateBooking,
    calculateTotal,
    getAvailableTimeSlots,
    sendBookingConfirmation,

    // Data management
    saveBooking,
    loadBooking,
    clearCurrentBooking,
  }
}

/**
 * Helper functions
 */
function generateBookingId(): string {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generatePaymentId(): string {
  return `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateAppointmentId(): string {
  return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function checkAppointmentConflicts(
  date: Date,
  duration: number
): Promise<AppointmentInfo[]> {
  // Mock implementation - in real app, would check against actual appointments
  await new Promise(resolve => setTimeout(resolve, 500))

  // Randomly return conflicts for demo
  if (Math.random() > 0.8) {
    return [
      {
        id: 'conflict_1',
        scheduledDate: date,
        duration,
        location: 'Studio A',
        locationType: 'studio',
        status: 'confirmed',
        remindersSent: [],
      },
    ]
  }

  return []
}

export default useBookingSystem
