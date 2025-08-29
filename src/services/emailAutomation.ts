/**
 * Email Automation Service - Service-Specific Follow-up System
 *
 * Automated email sequences based on inquiry type to ensure professional
 * and service-appropriate messaging for all service inquiries.
 *
 * Features:
 * - Service-specific email templates
 * - Automated follow-up scheduling
 * - Professional messaging system
 * - Conversion tracking integration
 */

import type { ServiceType } from '@/types/content'

/**
 * Email template types for different stages of follow-up
 */
export type EmailTemplateType =
  | 'immediate_confirmation'
  | 'follow_up_24h'
  | 'follow_up_3days'
  | 'follow_up_1week'
  | 'final_follow_up'

/**
 * Contact form data structure for email automation
 */
export interface ContactFormData {
  name: string
  email: string
  serviceType: ServiceType
  message?: string
  phone?: string
  preferredContact?: 'email' | 'phone' | 'text'
  eventDate?: string
  budget?: string
  experience?: string
  goals?: string
}

/**
 * Email template structure
 */
export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
  delayHours: number
  tags: string[]
}

/**
 * Follow-up sequence configuration
 */
export interface FollowUpSequence {
  serviceType: ServiceType
  templates: Record<EmailTemplateType, EmailTemplate>
  totalDuration: number // days
}

/**
 * Email automation response
 */
export interface EmailAutomationResult {
  success: boolean
  sequenceId?: string
  scheduledEmails: number
  error?: string
}

/**
 * Email data structure for scheduling and sending
 */
interface EmailData {
  to: string
  subject: string
  htmlContent: string
  textContent: string
  sendTime: number
  templateType: EmailTemplateType
  sequenceId: string
  tags: string[]
  metadata: {
    serviceType: ServiceType
    originalSubmissionTime: number
    customerName: string
  }
}

/**
 * Sequence metadata for tracking and analytics
 */
interface SequenceMetadata {
  sequenceId: string
  serviceType: ServiceType
  customerEmail: string
  customerName: string
  startTime: number
  totalDuration: number
  status: string
  emailsScheduled: number
  emailsSent: number
}

/**
 * Debug email data with additional tracking info
 */
interface DebugEmailData extends EmailData {
  id: string
  status: string
  createdAt: number
}

/**
 * Service-specific email templates
 */
const EMAIL_TEMPLATES: Record<ServiceType, FollowUpSequence> = {
  performance: {
    serviceType: 'performance',
    totalDuration: 14,
    templates: {
      immediate_confirmation: {
        subject:
          "Thanks for Your Performance Inquiry - Let's Create Something Amazing!",
        delayHours: 0,
        tags: ['performance', 'confirmation'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>Thank you for reaching out about performance opportunities! I'm excited about the possibility of bringing live music to your event.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">What Happens Next:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>I'll review your event details within 24 hours</li>
                <li>We'll schedule a brief call to discuss your vision</li>
                <li>I'll provide a customized performance proposal</li>
              </ul>
            </div>
            
            <p><strong>Performance Specialties:</strong></p>
            <ul>
              <li>🎸 Solo acoustic performances</li>
              <li>🎤 Full band arrangements</li>
              <li>🎵 Custom setlist curation</li>
              <li>🎭 Interactive audience engagement</li>
            </ul>
            
            <p>In the meantime, feel free to check out my <a href="https://www.rrishmusic.com/performance" style="color: #3b82f6;">performance portfolio</a> to see examples of recent shows.</p>
            
            <p>Looking forward to creating an unforgettable musical experience for your event!</p>
            
            <p>Best regards,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

Thank you for reaching out about performance opportunities! I'm excited about the possibility of bringing live music to your event.

What Happens Next:
- I'll review your event details within 24 hours
- We'll schedule a brief call to discuss your vision
- I'll provide a customized performance proposal

Performance Specialties:
- Solo acoustic performances
- Full band arrangements
- Custom setlist curation
- Interactive audience engagement

In the meantime, feel free to check out my performance portfolio at https://www.rrishmusic.com/performance to see examples of recent shows.

Looking forward to creating an unforgettable musical experience for your event!

Best regards,
Rrish`,
      },
      follow_up_24h: {
        subject: 'Your Performance Inquiry - Next Steps & Availability',
        delayHours: 24,
        tags: ['performance', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I hope you're having a great day! I wanted to follow up on your performance inquiry and share some thoughts about your upcoming event.</p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #065f46;">Quick Availability Update:</h3>
              <p style="margin: 0;">I have availability for your event date and would love to discuss how we can make your vision come to life.</p>
            </div>
            
            <p><strong>To move forward, I'd love to know:</strong></p>
            <ul>
              <li>What type of atmosphere are you hoping to create?</li>
              <li>Any specific songs or genres you'd like included?</li>
              <li>Will this be background music or a featured performance?</li>
              <li>What's your preferred timeline for finalizing details?</li>
            </ul>
            
            <p>Would you prefer a quick 10-minute phone call or would you like me to put together a preliminary proposal based on the details you've shared?</p>
            
            <p>I'm here to make this as easy as possible for you!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I hope you're having a great day! I wanted to follow up on your performance inquiry and share some thoughts about your upcoming event.

Quick Availability Update: I have availability for your event date and would love to discuss how we can make your vision come to life.

To move forward, I'd love to know:
- What type of atmosphere are you hoping to create?
- Any specific songs or genres you'd like included?
- Will this be background music or a featured performance?
- What's your preferred timeline for finalizing details?

Would you prefer a quick 10-minute phone call or would you like me to put together a preliminary proposal based on the details you've shared?

I'm here to make this as easy as possible for you!

Best,
Rrish`,
      },
      follow_up_3days: {
        subject: "Still Interested in Live Music? Let's Make It Happen!",
        delayHours: 72,
        tags: ['performance', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I know you're probably busy planning your event, but I didn't want your inquiry to slip through the cracks!</p>
            
            <p>I'm still very interested in providing live music for your event and wanted to share a quick success story that might resonate:</p>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="font-style: italic; margin: 0;">"Rrish transformed our corporate event from ordinary to extraordinary. His ability to read the room and adjust the music accordingly was impressive. Our guests are still talking about it weeks later!"</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #374151;">- Sarah M., Event Coordinator</p>
            </div>
            
            <p><strong>No pressure at all</strong> - I just want to make sure you have all the information you need to make the best decision for your event.</p>
            
            <p>If timing isn't right for this event, I'd still love to stay connected for future opportunities. Just let me know!</p>
            
            <p>Wishing you a successful event,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I know you're probably busy planning your event, but I didn't want your inquiry to slip through the cracks!

I'm still very interested in providing live music for your event and wanted to share a quick success story that might resonate:

"Rrish transformed our corporate event from ordinary to extraordinary. His ability to read the room and adjust the music accordingly was impressive. Our guests are still talking about it weeks later!" - Sarah M., Event Coordinator

No pressure at all - I just want to make sure you have all the information you need to make the best decision for your event.

If timing isn't right for this event, I'd still love to stay connected for future opportunities. Just let me know!

Wishing you a successful event,
Rrish`,
      },
      follow_up_1week: {
        subject: 'One Last Check-in About Your Event Music',
        delayHours: 168,
        tags: ['performance', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I hope your event planning is going smoothly! This will be my final follow-up regarding live music for your event.</p>
            
            <p>I completely understand if you've decided to go in a different direction or if the timing isn't quite right. Event planning involves so many moving pieces!</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">If you're still considering live music:</h3>
              <p style="margin: 0;">I'm happy to provide a no-obligation quote or answer any questions you might have. Even if it's last-minute, I often have flexibility in my schedule.</p>
            </div>
            
            <p>Regardless, I wish you an absolutely fantastic event. If you ever need live music in the future, don't hesitate to reach out!</p>
            
            <p>All the best,<br>Rrish</p>
            
            <p style="font-size: 12px; color: #6b7280;">P.S. If you'd prefer not to receive future updates, just reply with "unsubscribe" and I'll make sure to remove you from my list.</p>
          </div>
        `,
        textContent: `Hi {{name}},

I hope your event planning is going smoothly! This will be my final follow-up regarding live music for your event.

I completely understand if you've decided to go in a different direction or if the timing isn't quite right. Event planning involves so many moving pieces!

If you're still considering live music: I'm happy to provide a no-obligation quote or answer any questions you might have. Even if it's last-minute, I often have flexibility in my schedule.

Regardless, I wish you an absolutely fantastic event. If you ever need live music in the future, don't hesitate to reach out!

All the best,
Rrish

P.S. If you'd prefer not to receive future updates, just reply with "unsubscribe" and I'll make sure to remove you from my list.`,
      },
      final_follow_up: {
        subject: 'Thank You & Future Opportunities',
        delayHours: 336, // 2 weeks
        tags: ['performance', 'final'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I hope your event was a huge success!</p>
            
            <p>Even though we didn't connect for this particular event, I wanted to say thank you for considering me for your live music needs.</p>
            
            <p>I'm always here if you need live music for future events - whether it's:</p>
            <ul>
              <li>🎉 Annual celebrations</li>
              <li>🏢 Corporate gatherings</li>
              <li>💒 Special occasions</li>
              <li>🎵 Private parties</li>
            </ul>
            
            <p>Wishing you continued success with all your future events!</p>
            
            <p>Best regards,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I hope your event was a huge success!

Even though we didn't connect for this particular event, I wanted to say thank you for considering me for your live music needs.

I'm always here if you need live music for future events - whether it's annual celebrations, corporate gatherings, special occasions, or private parties.

Wishing you continued success with all your future events!

Best regards,
Rrish`,
      },
    },
  },

  teaching: {
    serviceType: 'teaching',
    totalDuration: 21,
    templates: {
      immediate_confirmation: {
        subject: 'Welcome! Your Guitar Learning Journey Starts Here 🎸',
        delayHours: 0,
        tags: ['teaching', 'confirmation'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>Thank you for your interest in guitar lessons! I'm thrilled to help you on your musical journey.</p>
            
            <div style="background: #ddd6fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #5b21b6;">Your Learning Journey:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>I'll review your goals and experience level</li>
                <li>We'll schedule a trial lesson (50% off!)</li>
                <li>I'll create a personalized learning plan</li>
                <li>You'll start making music from day one!</li>
              </ul>
            </div>
            
            <p><strong>My Teaching Approach:</strong></p>
            <ul>
              <li>🎵 Learn songs you actually love</li>
              <li>📚 Structured curriculum with flexibility</li>
              <li>🎯 Goal-oriented lessons</li>
              <li>🏠 In-person and online options</li>
            </ul>
            
            <p>I believe every student can become the guitarist they want to be with the right guidance and practice approach.</p>
            
            <p>I'll be in touch within 24 hours to discuss your goals and schedule your trial lesson!</p>
            
            <p>Excited to make music together,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

Thank you for your interest in guitar lessons! I'm thrilled to help you on your musical journey.

Your Learning Journey:
- I'll review your goals and experience level
- We'll schedule a trial lesson (50% off!)
- I'll create a personalized learning plan
- You'll start making music from day one!

My Teaching Approach:
- Learn songs you actually love
- Structured curriculum with flexibility
- Goal-oriented lessons
- In-person and online options

I believe every student can become the guitarist they want to be with the right guidance and practice approach.

I'll be in touch within 24 hours to discuss your goals and schedule your trial lesson!

Excited to make music together,
Rrish`,
      },
      follow_up_24h: {
        subject: "Let's Schedule Your Guitar Trial Lesson!",
        delayHours: 24,
        tags: ['teaching', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I've been thinking about our conversation and I'm excited about helping you reach your guitar goals!</p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #065f46;">Special Trial Lesson Offer:</h3>
              <p style="margin: 0;">50% off your first lesson so we can see if we're a good fit. No commitment required!</p>
            </div>
            
            <p><strong>Based on your goals, here's what I'm thinking for your first lesson:</strong></p>
            <ul>
              <li>Assessment of your current skill level</li>
              <li>Discussion of your musical interests</li>
              <li>Introduction to proper technique</li>
              <li>Learning your first song (or improving current ones!)</li>
            </ul>
            
            <p>I have availability this week for both in-person and online lessons. What works better for your schedule?</p>
            
            <p>Also, do you currently have a guitar, or would you like recommendations for getting started?</p>
            
            <p>Looking forward to our first lesson!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I've been thinking about our conversation and I'm excited about helping you reach your guitar goals!

Special Trial Lesson Offer: 50% off your first lesson so we can see if we're a good fit. No commitment required!

Based on your goals, here's what I'm thinking for your first lesson:
- Assessment of your current skill level
- Discussion of your musical interests
- Introduction to proper technique
- Learning your first song (or improving current ones!)

I have availability this week for both in-person and online lessons. What works better for your schedule?

Also, do you currently have a guitar, or would you like recommendations for getting started?

Looking forward to our first lesson!

Best,
Rrish`,
      },
      follow_up_3days: {
        subject: "Your Guitar Goals Are Within Reach - Let's Get Started!",
        delayHours: 72,
        tags: ['teaching', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I know life gets busy, but I didn't want you to miss out on taking that first step toward your guitar goals!</p>
            
            <p>Here's what one of my recent students shared:</p>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="font-style: italic; margin: 0;">"I always thought I was 'too old' to learn guitar at 45. Three months later, I'm playing songs I never thought possible. Rrish's patient teaching style made all the difference!"</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #374151;">- Mark T., Adult Student</p>
            </div>
            
            <p><strong>Remember:</strong> Every guitarist started exactly where you are now. The only difference between dreaming about playing and actually playing is taking that first lesson.</p>
            
            <p>My trial lesson offer (50% off) is still available, and I have some spots open this week if you're ready to get started.</p>
            
            <p>What's holding you back? I'd love to address any concerns you might have!</p>
            
            <p>Ready when you are,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I know life gets busy, but I didn't want you to miss out on taking that first step toward your guitar goals!

Here's what one of my recent students shared:

"I always thought I was 'too old' to learn guitar at 45. Three months later, I'm playing songs I never thought possible. Rrish's patient teaching style made all the difference!" - Mark T., Adult Student

Remember: Every guitarist started exactly where you are now. The only difference between dreaming about playing and actually playing is taking that first lesson.

My trial lesson offer (50% off) is still available, and I have some spots open this week if you're ready to get started.

What's holding you back? I'd love to address any concerns you might have!

Ready when you are,
Rrish`,
      },
      follow_up_1week: {
        subject: "Still Want to Learn Guitar? I'm Here to Help!",
        delayHours: 168,
        tags: ['teaching', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I haven't heard back from you, but I wanted to check in one more time about guitar lessons.</p>
            
            <p>Sometimes the biggest barrier to starting isn't skill or time - it's just not knowing what to expect. Let me help with that:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">What Makes My Lessons Different:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>No boring scales or exercises - we learn through songs</li>
                <li>Flexible scheduling that works with your life</li>
                <li>Progress tracking so you can see improvement</li>
                <li>Adult-friendly approach (no pressure, lots of encouragement)</li>
              </ul>
            </div>
            
            <p>Even if you're not ready to commit to regular lessons, I'm happy to answer any questions about getting started with guitar.</p>
            
            <p>The door is always open when you're ready!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I haven't heard back from you, but I wanted to check in one more time about guitar lessons.

Sometimes the biggest barrier to starting isn't skill or time - it's just not knowing what to expect. Let me help with that:

What Makes My Lessons Different:
- No boring scales or exercises - we learn through songs
- Flexible scheduling that works with your life
- Progress tracking so you can see improvement
- Adult-friendly approach (no pressure, lots of encouragement)

Even if you're not ready to commit to regular lessons, I'm happy to answer any questions about getting started with guitar.

The door is always open when you're ready!

Best,
Rrish`,
      },
      final_follow_up: {
        subject: "Your Guitar Journey Awaits (When You're Ready)",
        delayHours: 504, // 3 weeks
        tags: ['teaching', 'final'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>This will be my final message about guitar lessons, but I wanted to leave you with some encouragement.</p>
            
            <p>Your musical dreams are valid, regardless of your age, experience level, or how busy life gets. When you're ready - whether that's next week or next year - I'll be here to help.</p>
            
            <div style="background: #ddd6fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #5b21b6;">Remember:</h3>
              <p style="margin: 0;">The best time to plant a tree was 20 years ago. The second best time is now. The same goes for learning guitar!</p>
            </div>
            
            <p>Feel free to reach out anytime if questions come up or if you decide you're ready to take that first step.</p>
            
            <p>Wishing you all the best on your musical journey (whenever it begins),</p>
            
            <p>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

This will be my final message about guitar lessons, but I wanted to leave you with some encouragement.

Your musical dreams are valid, regardless of your age, experience level, or how busy life gets. When you're ready - whether that's next week or next year - I'll be here to help.

Remember: The best time to plant a tree was 20 years ago. The second best time is now. The same goes for learning guitar!

Feel free to reach out anytime if questions come up or if you decide you're ready to take that first step.

Wishing you all the best on your musical journey (whenever it begins),

Rrish`,
      },
    },
  },

  collaboration: {
    serviceType: 'collaboration',
    totalDuration: 10,
    templates: {
      immediate_confirmation: {
        subject: "Excited About Your Creative Project! Let's Collaborate 🎵",
        delayHours: 0,
        tags: ['collaboration', 'confirmation'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>Thank you for reaching out about collaboration opportunities! Creative partnerships are some of my favorite projects to work on.</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">Next Steps:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>I'll review your project details</li>
                <li>We'll discuss creative vision and goals</li>
                <li>I'll share relevant examples from my portfolio</li>
                <li>We'll outline collaboration timeline and logistics</li>
              </ul>
            </div>
            
            <p><strong>Collaboration Specialties:</strong></p>
            <ul>
              <li>🎸 Guitar arrangements and recording</li>
              <li>🎵 Songwriting and composition</li>
              <li>🎤 Vocal harmonies and backing vocals</li>
              <li>🎧 Production collaboration</li>
              <li>🎭 Live performance partnerships</li>
            </ul>
            
            <p>I love working with artists who bring fresh perspectives and creative energy to projects. Looking forward to learning more about your vision!</p>
            
            <p>I'll be in touch within 24 hours to discuss the details.</p>
            
            <p>Excited to create something amazing together,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

Thank you for reaching out about collaboration opportunities! Creative partnerships are some of my favorite projects to work on.

Next Steps:
- I'll review your project details
- We'll discuss creative vision and goals
- I'll share relevant examples from my portfolio
- We'll outline collaboration timeline and logistics

Collaboration Specialties:
- Guitar arrangements and recording
- Songwriting and composition
- Vocal harmonies and backing vocals
- Production collaboration
- Live performance partnerships

I love working with artists who bring fresh perspectives and creative energy to projects. Looking forward to learning more about your vision!

I'll be in touch within 24 hours to discuss the details.

Excited to create something amazing together,
Rrish`,
      },
      follow_up_24h: {
        subject: "Your Creative Project - Let's Dive Deeper!",
        delayHours: 24,
        tags: ['collaboration', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I've been thinking about your project and I'm genuinely excited about the possibilities!</p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #065f46;">Creative Collaboration Approach:</h3>
              <p style="margin: 0;">I believe the best collaborations happen when artists bring their unique strengths together while staying true to the project's overall vision.</p>
            </div>
            
            <p><strong>To help me prepare for our discussion, I'd love to know:</strong></p>
            <ul>
              <li>What's the overall vibe/genre you're aiming for?</li>
              <li>Are you looking for writing, recording, or performance collaboration?</li>
              <li>What's your timeline for the project?</li>
              <li>Do you have any reference tracks that capture the direction?</li>
            </ul>
            
            <p>Would you prefer to chat over the phone/video call, or would you like to start with email back-and-forth? I'm flexible!</p>
            
            <p>Can't wait to hear more about your creative vision!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I've been thinking about your project and I'm genuinely excited about the possibilities!

Creative Collaboration Approach: I believe the best collaborations happen when artists bring their unique strengths together while staying true to the project's overall vision.

To help me prepare for our discussion, I'd love to know:
- What's the overall vibe/genre you're aiming for?
- Are you looking for writing, recording, or performance collaboration?
- What's your timeline for the project?
- Do you have any reference tracks that capture the direction?

Would you prefer to chat over the phone/video call, or would you like to start with email back-and-forth? I'm flexible!

Can't wait to hear more about your creative vision!

Best,
Rrish`,
      },
      follow_up_3days: {
        subject: "Still Interested in Collaborating? Let's Make Music!",
        delayHours: 72,
        tags: ['collaboration', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I know creative projects often have a lot of moving pieces, but I wanted to check in about our potential collaboration!</p>
            
            <p>Here's a quick example of what creative partnerships can achieve:</p>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="font-style: italic; margin: 0;">"Working with Rrish elevated our song from a simple acoustic demo to a full, rich arrangement. His guitar work added exactly the emotional depth we were looking for. The collaboration process was seamless and inspiring!"</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #374151;">- Maya K., Singer-Songwriter</p>
            </div>
            
            <p>Whether your project is fully formed or still in the early brainstorming phase, I'm here to help bring your vision to life.</p>
            
            <p>Even if timing isn't perfect right now, I'd love to stay connected for future creative opportunities!</p>
            
            <p>Looking forward to hearing from you,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I know creative projects often have a lot of moving pieces, but I wanted to check in about our potential collaboration!

Here's a quick example of what creative partnerships can achieve:

"Working with Rrish elevated our song from a simple acoustic demo to a full, rich arrangement. His guitar work added exactly the emotional depth we were looking for. The collaboration process was seamless and inspiring!" - Maya K., Singer-Songwriter

Whether your project is fully formed or still in the early brainstorming phase, I'm here to help bring your vision to life.

Even if timing isn't perfect right now, I'd love to stay connected for future creative opportunities!

Looking forward to hearing from you,
Rrish`,
      },
      follow_up_1week: {
        subject: 'Final Check-in About Your Creative Project',
        delayHours: 168,
        tags: ['collaboration', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>This will be my last follow-up about collaboration opportunities, but I wanted to leave the door open for future projects.</p>
            
            <p>I completely understand that creative projects develop on their own timeline, and sometimes the stars just need to align differently.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">If You Ever Need a Creative Partner:</h3>
              <p style="margin: 0;">Whether it's for this project or something completely different in the future, don't hesitate to reach out. I love working with passionate artists!</p>
            </div>
            
            <p>Wishing you all the best with your creative endeavors. I hope our paths cross again when the timing is right!</p>
            
            <p>Keep creating,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

This will be my last follow-up about collaboration opportunities, but I wanted to leave the door open for future projects.

I completely understand that creative projects develop on their own timeline, and sometimes the stars just need to align differently.

If You Ever Need a Creative Partner: Whether it's for this project or something completely different in the future, don't hesitate to reach out. I love working with passionate artists!

Wishing you all the best with your creative endeavors. I hope our paths cross again when the timing is right!

Keep creating,
Rrish`,
      },
      final_follow_up: {
        subject: 'Thank You & Future Creative Opportunities',
        delayHours: 240, // 10 days
        tags: ['collaboration', 'final'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>Thank you for considering me for your creative project. Even though we didn't collaborate this time, I appreciate you reaching out!</p>
            
            <p>The music world is beautifully interconnected, and I believe great collaborations happen when the timing and vision align perfectly.</p>
            
            <p>I'm always excited about new creative partnerships, so please keep me in mind for future projects - whether it's:</p>
            <ul>
              <li>🎵 Songwriting collaborations</li>
              <li>🎸 Recording sessions</li>
              <li>🎤 Live performance partnerships</li>
              <li>🎧 Production work</li>
            </ul>
            
            <p>Keep creating amazing music!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

Thank you for considering me for your creative project. Even though we didn't collaborate this time, I appreciate you reaching out!

The music world is beautifully interconnected, and I believe great collaborations happen when the timing and vision align perfectly.

I'm always excited about new creative partnerships, so please keep me in mind for future projects - whether it's songwriting collaborations, recording sessions, live performance partnerships, or production work.

Keep creating amazing music!

Best,
Rrish`,
      },
    },
  },

  general: {
    serviceType: 'general',
    totalDuration: 7,
    templates: {
      immediate_confirmation: {
        subject: "Thanks for Getting in Touch! Let's Connect",
        delayHours: 0,
        tags: ['general', 'confirmation'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>Thank you for reaching out! I appreciate you taking the time to get in touch.</p>
            
            <p>I'll review your message and get back to you within 24 hours with a thoughtful response.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">What I Do:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>🎸 Live Performance Services</li>
                <li>📚 Guitar Lessons (In-person & Online)</li>
                <li>🎵 Creative Collaborations</li>
              </ul>
            </div>
            
            <p>If you're interested in any of these services, I'd be happy to discuss how I can help with your specific needs!</p>
            
            <p>Talk soon,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

Thank you for reaching out! I appreciate you taking the time to get in touch.

I'll review your message and get back to you within 24 hours with a thoughtful response.

What I Do:
- Live Performance Services
- Guitar Lessons (In-person & Online)
- Creative Collaborations

If you're interested in any of these services, I'd be happy to discuss how I can help with your specific needs!

Talk soon,
Rrish`,
      },
      follow_up_24h: {
        subject: 'Following Up on Your Message',
        delayHours: 24,
        tags: ['general', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I hope you're having a great day! I wanted to follow up on your recent message.</p>
            
            <p>I'm here to help with any questions or interests you might have regarding my music services.</p>
            
            <p>Is there anything specific I can help clarify or discuss further?</p>
            
            <p>Feel free to reach out anytime!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I hope you're having a great day! I wanted to follow up on your recent message.

I'm here to help with any questions or interests you might have regarding my music services.

Is there anything specific I can help clarify or discuss further?

Feel free to reach out anytime!

Best,
Rrish`,
      },
      follow_up_3days: {
        subject: 'Still Here to Help!',
        delayHours: 72,
        tags: ['general', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>I know life gets busy, but I wanted to check in one more time to see if there's anything I can help you with.</p>
            
            <p>Whether you're interested in live music for an event, want to learn guitar, or have a creative project in mind, I'm here to help make it happen.</p>
            
            <p>No pressure at all - just want to make sure you have all the information you need!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

I know life gets busy, but I wanted to check in one more time to see if there's anything I can help you with.

Whether you're interested in live music for an event, want to learn guitar, or have a creative project in mind, I'm here to help make it happen.

No pressure at all - just want to make sure you have all the information you need!

Best,
Rrish`,
      },
      follow_up_1week: {
        subject: 'Final Check-in - Here When You Need Me!',
        delayHours: 168,
        tags: ['general', 'follow_up'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>This will be my final follow-up, but I wanted to say thank you for reaching out initially.</p>
            
            <p>If you ever have questions about music services or want to chat about potential projects, don't hesitate to get in touch.</p>
            
            <p>Wishing you all the best!</p>
            
            <p>Best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

This will be my final follow-up, but I wanted to say thank you for reaching out initially.

If you ever have questions about music services or want to chat about potential projects, don't hesitate to get in touch.

Wishing you all the best!

Best,
Rrish`,
      },
      final_follow_up: {
        subject: 'Thank You & Stay in Touch',
        delayHours: 168,
        tags: ['general', 'final'],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Hi {{name}},</h2>
            
            <p>Thank you for your initial interest! While we didn't connect this time, I appreciate you reaching out.</p>
            
            <p>Feel free to contact me anytime if you have future music-related needs or questions.</p>
            
            <p>All the best,<br>Rrish</p>
          </div>
        `,
        textContent: `Hi {{name}},

Thank you for your initial interest! While we didn't connect this time, I appreciate you reaching out.

Feel free to contact me anytime if you have future music-related needs or questions.

All the best,
Rrish`,
      },
    },
  },
}

/**
 * Email automation service class
 */
export class EmailAutomationService {
  private isEnabled: boolean = true
  private debugMode: boolean = process.env.NODE_ENV === 'development'

  /**
   * Initialize follow-up sequence for a contact form submission
   */
  async initializeFollowUpSequence(
    formData: ContactFormData
  ): Promise<EmailAutomationResult> {
    try {
      if (!this.isEnabled) {
        return { success: false, error: 'Email automation is disabled' }
      }

      const sequence = EMAIL_TEMPLATES[formData.serviceType]
      if (!sequence) {
        return {
          success: false,
          error: `No email sequence found for service type: ${formData.serviceType}`,
        }
      }

      const sequenceId = this.generateSequenceId(formData)
      let scheduledEmails = 0

      // Schedule all emails in the sequence
      for (const [templateType, template] of Object.entries(
        sequence.templates
      )) {
        const success = await this.scheduleEmail(
          formData,
          template,
          templateType as EmailTemplateType,
          sequenceId
        )

        if (success) {
          scheduledEmails++
        }
      }

      // Store sequence metadata for tracking
      this.storeSequenceMetadata(sequenceId, formData, sequence)

      return {
        success: true,
        sequenceId,
        scheduledEmails,
      }
    } catch (error) {
      console.error('Failed to initialize follow-up sequence:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Schedule individual email in sequence
   */
  private async scheduleEmail(
    formData: ContactFormData,
    template: EmailTemplate,
    templateType: EmailTemplateType,
    sequenceId: string
  ): Promise<boolean> {
    try {
      const sendTime = Date.now() + template.delayHours * 60 * 60 * 1000

      const emailData: EmailData = {
        to: formData.email,
        subject: this.personalizeContent(template.subject, formData),
        htmlContent: this.personalizeContent(template.htmlContent, formData),
        textContent: this.personalizeContent(template.textContent, formData),
        sendTime,
        templateType,
        sequenceId,
        tags: [...template.tags, formData.serviceType],
        metadata: {
          serviceType: formData.serviceType,
          originalSubmissionTime: Date.now(),
          customerName: formData.name,
        },
      }

      if (this.debugMode) {
        console.log(
          `[EmailAutomation] Scheduled ${templateType} email for ${formData.name} (${formData.serviceType})`,
          {
            sendTime: new Date(sendTime),
            subject: emailData.subject,
          }
        )

        // In development, store in localStorage for debugging
        this.storeDebugEmail(emailData)
      } else {
        // In production, integrate with actual email service
        await this.sendToEmailService(emailData)
      }

      return true
    } catch (error) {
      console.error(`Failed to schedule ${templateType} email:`, error)
      return false
    }
  }

  /**
   * Personalize email content with form data
   */
  private personalizeContent(
    content: string,
    formData: ContactFormData
  ): string {
    return content
      .replace(/{{name}}/g, formData.name)
      .replace(/{{email}}/g, formData.email)
      .replace(/{{service}}/g, this.getServiceDisplayName(formData.serviceType))
  }

  /**
   * Get display name for service type
   */
  private getServiceDisplayName(serviceType: ServiceType): string {
    const displayNames = {
      performance: 'Performance Services',
      teaching: 'Guitar Lessons',
      collaboration: 'Creative Collaboration',
      general: 'General Inquiry',
    }
    return displayNames[serviceType] || serviceType
  }

  /**
   * Generate unique sequence ID
   */
  private generateSequenceId(formData: ContactFormData): string {
    const timestamp = Date.now()
    const hash = btoa(
      `${formData.email}-${formData.serviceType}-${timestamp}`
    ).replace(/[^a-zA-Z0-9]/g, '')
    return `seq_${formData.serviceType}_${timestamp}_${hash.substr(0, 8)}`
  }

  /**
   * Store sequence metadata for tracking and management
   */
  private storeSequenceMetadata(
    sequenceId: string,
    formData: ContactFormData,
    sequence: FollowUpSequence
  ): void {
    const metadata: SequenceMetadata = {
      sequenceId,
      serviceType: formData.serviceType,
      customerEmail: formData.email,
      customerName: formData.name,
      startTime: Date.now(),
      totalDuration: sequence.totalDuration,
      status: 'active',
      emailsScheduled: Object.keys(sequence.templates).length,
      emailsSent: 0,
    }

    if (this.debugMode) {
      // Store in localStorage for development
      const existingSequences = JSON.parse(
        localStorage.getItem('email_sequences') || '[]'
      )
      existingSequences.push(metadata)
      localStorage.setItem('email_sequences', JSON.stringify(existingSequences))
    } else {
      // In production, store in actual database/analytics system
      this.storeSequenceInDatabase(metadata)
    }
  }

  /**
   * Store debug email in localStorage (development only)
   */
  private storeDebugEmail(emailData: EmailData): void {
    const debugEmailData: DebugEmailData = {
      ...emailData,
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      createdAt: Date.now(),
    }

    const existingEmails = JSON.parse(
      localStorage.getItem('scheduled_emails') || '[]'
    )
    existingEmails.push(debugEmailData)
    localStorage.setItem('scheduled_emails', JSON.stringify(existingEmails))
  }

  /**
   * Send to actual email service (production)
   */
  private async sendToEmailService(emailData: EmailData): Promise<void> {
    // This would integrate with services like:
    // - SendGrid
    // - Mailchimp
    // - ConvertKit
    // - Custom SMTP server

    console.log(
      '[EmailAutomation] Production email service integration needed',
      emailData
    )
  }

  /**
   * Store sequence in database (production)
   */
  private storeSequenceInDatabase(metadata: SequenceMetadata): void {
    // This would store in actual database for production use
    console.log(
      '[EmailAutomation] Database integration needed for sequence metadata',
      metadata
    )
  }

  /**
   * Cancel email sequence (for unsubscribes, conversions, etc.)
   */
  async cancelSequence(
    sequenceId: string,
    reason: string = 'user_request'
  ): Promise<boolean> {
    try {
      if (this.debugMode) {
        // Update localStorage
        const sequences = JSON.parse(
          localStorage.getItem('email_sequences') || '[]'
        )
        const updatedSequences = sequences.map((seq: SequenceMetadata) =>
          seq.sequenceId === sequenceId
            ? {
                ...seq,
                status: 'cancelled',
                cancelReason: reason,
                cancelledAt: Date.now(),
              }
            : seq
        )
        localStorage.setItem(
          'email_sequences',
          JSON.stringify(updatedSequences)
        )
      } else {
        // Cancel in production email service
        await this.cancelSequenceInEmailService(sequenceId, reason)
      }

      console.log(
        `[EmailAutomation] Cancelled sequence ${sequenceId} - Reason: ${reason}`
      )
      return true
    } catch (error) {
      console.error('Failed to cancel email sequence:', error)
      return false
    }
  }

  /**
   * Cancel sequence in email service (production)
   */
  private async cancelSequenceInEmailService(
    sequenceId: string,
    reason: string
  ): Promise<void> {
    // Implementation for production email service cancellation
    console.log(
      `[EmailAutomation] Production cancellation needed for ${sequenceId}: ${reason}`
    )
  }

  /**
   * Get sequence templates for a service type (useful for preview/testing)
   */
  getSequenceTemplates(serviceType: ServiceType): FollowUpSequence | null {
    return EMAIL_TEMPLATES[serviceType] || null
  }

  /**
   * Preview email template with sample data
   */
  previewEmail(
    serviceType: ServiceType,
    templateType: EmailTemplateType,
    sampleData?: Partial<ContactFormData>
  ): EmailTemplate | null {
    const sequence = EMAIL_TEMPLATES[serviceType]
    if (!sequence || !sequence.templates[templateType]) {
      return null
    }

    const template = sequence.templates[templateType]
    const defaultData: ContactFormData = {
      name: sampleData?.name || 'John',
      email: sampleData?.email || 'john@example.com',
      serviceType,
      message: sampleData?.message || 'Sample inquiry message',
      ...sampleData,
    }

    return {
      ...template,
      subject: this.personalizeContent(template.subject, defaultData),
      htmlContent: this.personalizeContent(template.htmlContent, defaultData),
      textContent: this.personalizeContent(template.textContent, defaultData),
    }
  }

  /**
   * Enable/disable automation system
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    console.log(`[EmailAutomation] System ${enabled ? 'enabled' : 'disabled'}`)
  }

  /**
   * Get automation system status
   */
  getStatus(): {
    enabled: boolean
    debugMode: boolean
    templatesCount: number
  } {
    return {
      enabled: this.isEnabled,
      debugMode: this.debugMode,
      templatesCount: Object.keys(EMAIL_TEMPLATES).reduce(
        (total, serviceType) =>
          total +
          Object.keys(EMAIL_TEMPLATES[serviceType as ServiceType].templates)
            .length,
        0
      ),
    }
  }
}

// Export singleton instance
export const emailAutomationService = new EmailAutomationService()

// Export types for external use
export type {
  EmailTemplateType,
  ContactFormData,
  EmailTemplate,
  FollowUpSequence,
  EmailAutomationResult,
}
