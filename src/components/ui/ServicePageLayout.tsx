import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SEOHead } from '@/components/common/SEOHead'

interface ServicePageLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  serviceName: string
  breadcrumbLabel: string
  className?: string
}

/**
 * Reusable layout component for service pages with breadcrumb navigation
 * and SEO optimization
 */
export const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  children,
  title,
  description,
  serviceName,
  breadcrumbLabel,
  className = '',
}) => {
  const location = useLocation()

  // Generate breadcrumb items based on current path
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: breadcrumbLabel, path: location.pathname },
  ]

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonicalUrl={`https://www.rrishmusic.com${location.pathname}`}
        type="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: serviceName,
          description: description,
          provider: {
            '@type': 'Person',
            name: 'Rrish',
            url: 'https://www.rrishmusic.com',
          },
          url: `https://www.rrishmusic.com${location.pathname}`,
        }}
      />

      <div className={`min-h-screen bg-gray-50 ${className}`}>
        {/* Breadcrumb Navigation */}
        <nav
          className="bg-white border-b border-gray-200"
          aria-label="Breadcrumb"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 py-4">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbItems.map((item, index) => (
                  <li key={item.path} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="w-4 h-4 mx-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {index === breadcrumbItems.length - 1 ? (
                      <span
                        className="font-medium text-brand-blue-primary"
                        aria-current="page"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        to={item.path}
                        className="text-gray-500 hover:text-brand-blue-primary transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </>
  )
}

export default ServicePageLayout
