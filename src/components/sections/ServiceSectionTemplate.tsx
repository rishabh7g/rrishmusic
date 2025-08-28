import React from 'react'
import { ServiceType } from '@/types/content'

/**
 * Service Section Props Interface
 * Common props for all service-specific sections
 */
export interface ServiceSectionProps {
  serviceType?: ServiceType
  className?: string
  animate?: boolean
}

/**
 * Theme interface for service-specific styling
 */
interface ServiceTheme {
  primary: string
  secondary: string
  accent: string
  text: string
}

/**
 * Service Content Section Interface
 * Defines the structure for content sections within service templates
 */
export interface ServiceContentSection {
  id: string
  title: string
  subtitle?: string
  content: React.ReactNode
  variant?: 'default' | 'featured' | 'testimonial' | 'pricing' | 'gallery'
  background?: 'white' | 'gray' | 'dark' | 'gradient'
}

/**
 * Service Section Template Props
 */
interface ServiceSectionTemplateProps {
  serviceType: ServiceType
  title: string
  subtitle?: string
  sectionId: string
  variant?: 'default' | 'featured' | 'testimonial' | 'pricing' | 'gallery'
  background?: 'white' | 'gray' | 'dark' | 'gradient'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  animate?: boolean
  children: React.ReactNode
}

/**
 * Service Section Template Component
 * Reusable template for all service-specific content sections
 */
export const ServiceSectionTemplate: React.FC<ServiceSectionTemplateProps> = ({
  serviceType,
  title,
  subtitle,
  sectionId,
  variant = 'default',
  background = 'white',
  headerAlign = 'center',
  className = '',
  animate = true,
  children,
}) => {
  // Service-specific theme configuration
  const getServiceTheme = (service: ServiceType): ServiceTheme => {
    const themes: Record<ServiceType, ServiceTheme> = {
      teaching: {
        primary: 'brand-orange-warm',
        secondary: 'brand-orange-light',
        accent: 'orange-50',
        text: 'orange-900',
      },
      performance: {
        primary: 'brand-blue-primary',
        secondary: 'brand-blue-dark',
        accent: 'blue-50',
        text: 'blue-900',
      },
      collaboration: {
        primary: 'brand-green-primary',
        secondary: 'brand-green-dark',
        accent: 'green-50',
        text: 'green-900',
      },
    }
    return themes[service]
  }

  const theme = getServiceTheme(serviceType)

  // Background classes
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    gradient: `bg-gradient-to-br from-${theme.primary} to-${theme.secondary} text-white`,
  }

  // Variant-specific classes
  const variantClasses = {
    default: '',
    featured: `border-l-4 border-${theme.primary}`,
    testimonial: `bg-${theme.accent}`,
    pricing: `bg-gradient-to-r from-${theme.accent} to-white`,
    gallery: 'overflow-hidden',
  }

  // Animation classes
  const animationClasses = animate
    ? 'opacity-0 transform translate-y-8 animate-fade-in-up'
    : ''

  // CSS Custom Properties for dynamic theming
  const sectionStyles = {
    '--service-primary': `var(--color-${theme.primary})`,
    '--service-secondary': `var(--color-${theme.secondary})`,
    '--service-accent': `var(--color-${theme.accent})`,
    '--service-text': `var(--color-${theme.text})`,
  } as React.CSSProperties

  return (
    <section
      id={sectionId}
      className={`
        service-section service-section--${serviceType} service-section--${variant}
        ${backgroundClasses[background]} ${variantClasses[variant]} ${animationClasses}
        py-16 md:py-20 ${className}
      `}
      style={sectionStyles}
      data-service={serviceType}
      data-variant={variant}
      role="region"
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="container mx-auto px-4">
        <ServiceSectionContent
          title={title}
          subtitle={subtitle}
          headerAlign={headerAlign}
          theme={theme}
          serviceType={serviceType}
        >
          {children}
        </ServiceSectionContent>
      </div>
    </section>
  )
}

/**
 * Service Section Content Props
 */
interface ServiceSectionContentProps {
  title: string
  subtitle?: string
  headerAlign: 'left' | 'center' | 'right'
  theme: ServiceTheme
  serviceType: ServiceType
  children: React.ReactNode
}

const ServiceSectionContent: React.FC<ServiceSectionContentProps> = ({
  title,
  subtitle,
  headerAlign,
  theme,
  serviceType,
  children,
}) => {
  return (
    <div className="service-section-content">
      {/* Section Header */}
      <div
        className={`section-header mb-8 md:mb-12 ${headerAlign === 'center' ? 'max-w-3xl mx-auto' : ''} ${headerAlign}`}
      >
        <h2
          id={`${title.toLowerCase().replace(/\s+/g, '-')}-title`}
          className={`
            text-2xl md:text-3xl lg:text-4xl font-bold mb-4
            ${headerAlign === 'center' ? 'text-center' : ''}
            text-gray-900
          `}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`
            text-lg md:text-xl text-gray-600 max-w-2xl
            ${headerAlign === 'center' ? 'text-center' : ''}</p>
          `}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Section Content */}
      <div
        className={`
        section-content service-content service-content--${serviceType}
        ${headerAlign === 'center' ? 'max-w-6xl mx-auto' : ''}
      `}
      >
        <div
          className={`
          content-wrapper p-6 rounded-xl
          bg-${theme.accent} text-${theme.text}
        `}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default ServiceSectionTemplate
