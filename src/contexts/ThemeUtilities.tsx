/**
 * Theme Context Utilities
 *
 * Higher-order components and utility components for theme integration.
 */

import React, { ReactNode } from 'react'
import {
  ThemeProvider,
  useThemeContext,
  type ThemeContextValue,
} from './ThemeContext'

/**
 * Theme provider HOC for easier integration
 */
// eslint-disable-next-line react-refresh/only-export-components
export function withTheme<P extends object>(Component: React.ComponentType<P>) {
  const WithThemeComponent = (props: P) => (
    <ThemeProvider>
      <Component {...props} />
    </ThemeProvider>
  )

  WithThemeComponent.displayName = `withTheme(${Component.displayName || Component.name})`

  return WithThemeComponent
}

/**
 * Theme context consumer component for render props pattern
 */
export function ThemeConsumer({
  children,
}: {
  children: (theme: ThemeContextValue) => ReactNode
}) {
  const theme = useThemeContext()
  return <>{children(theme)}</>
}
