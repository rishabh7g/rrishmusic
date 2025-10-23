import SEOHead from '@/components/common/SEOHead'
import { TripleImageHero } from '@/components/sections/TripleImageHero'
import { Contact } from '@/components/sections/Contact'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import siteConfig from '@/content/site-config.json'

export function Home() {
  return (
    <>
      <SEOHead
        title={siteConfig.seo.title}
        description={siteConfig.seo.description}
        keywords={siteConfig.seo.keywords}
        canonical={siteConfig.branding.website}
        type="website"
      />

      <main
        id="main-content"
        className="min-h-screen bg-theme-bg text-theme-text transition-theme-colors"
      >
        {/* Hero Section - 3 Image Layout */}
        <ErrorBoundary fallback={<div>Error loading hero section</div>}>
          <TripleImageHero />
        </ErrorBoundary>

        {/* Contact Section */}
        <ErrorBoundary fallback={<div>Error loading contact section</div>}>
          <Contact />
        </ErrorBoundary>
      </main>
    </>
  )
}
