/// <reference types="vite/client" />

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: {
        event_category?: string
        event_label?: string
        service_prominence?: string
        card_size?: string
        destination?: string
        [key: string]: string | number | boolean | undefined
      }
    ) => void
  }
}
