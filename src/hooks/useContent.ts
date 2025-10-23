/**
 * Simplified content management for minimal site
 */
import { useMemo } from 'react'

import contactContent from '../content/contact.json'
import navigationData from '../content/navigation.json'

// Default SEO data
const defaultSeoData = {
  title: 'RrishMusic - Melbourne Musician',
  description: 'Explore Rrish\'s musical journey through photos and videos. Melbourne-based musician.',
  keywords: 'Rrish, Melbourne musician, music, guitar, gallery',
  ogImage: '/images/rrish-profile.jpg',
}

/**
 * Main content hook - provides minimal content
 */
export const useContent = () => {
  return useMemo(
    () => ({
      contact: contactContent,
      menu: navigationData,
      seo: defaultSeoData,
    }),
    []
  )
}

/**
 * Hook for navigation menu data
 */
export const useMenuContent = () => {
  const content = useContent()
  return useMemo(() => content.menu, [content.menu])
}

/**
 * Hook for SEO content
 */
export const useSEO = () => {
  const generatePageTitle = (title: string) => `${title} | RrishMusic`

  return useMemo(
    () => ({
      data: defaultSeoData,
      generatePageTitle,
      loading: false,
      error: null,
    }),
    []
  )
}

// Enhanced section content access
export const useSectionContent = (section: string) => {
  const content = useContent()
  return useMemo(
    () => ({
      data: content[section as keyof typeof content],
      loading: false,
      error: null,
    }),
    [content, section]
  )
}

// Default export for backward compatibility
export default useContent
