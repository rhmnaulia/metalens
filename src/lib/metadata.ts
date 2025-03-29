export interface MetadataResult {
  // Basic SEO
  title?: string
  description?: string
  keywords?: string
  author?: string
  generator?: string
  themeColor?: string

  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogImageWidth?: string
  ogImageHeight?: string
  ogImageAlt?: string
  ogUrl?: string
  ogType?: string
  ogSiteName?: string
  ogLocale?: string
  ogVideo?: string
  ogAudio?: string

  // Facebook
  fbAppId?: string
  fbPages?: string
  fbDomainVerification?: string

  // Twitter Cards
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterImageAlt?: string
  twitterSite?: string
  twitterCreator?: string
  twitterDomainVerification?: string

  // WhatsApp
  whatsappTitle?: string
  whatsappDescription?: string
  whatsappImage?: string

  // LinkedIn
  linkedinTitle?: string
  linkedinDescription?: string
  linkedinImage?: string
  linkedinAuthor?: string

  // Pinterest
  pinterestDescription?: string
  pinterestImage?: string
  pinterestDomainVerification?: string

  // Technical
  canonicalUrl?: string
  robots?: string
  viewport?: string
  charset?: string
  language?: string
  favicon?: string
  appleTouchIcon?: string
  manifest?: string

  // Article Specific
  articlePublishedTime?: string
  articleModifiedTime?: string
  articleAuthor?: string
  articleSection?: string
  articleTags?: string

  // Additional SEO
  alternateUrls?: { [key: string]: string }
  prevPage?: string
  nextPage?: string
  rating?: string
  referrer?: string

  // Sitemap
  sitemapUrl?: string
  sitemapExists: boolean
  robotsTxtExists: boolean
  robotsTxtContent?: string
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Helper function to get meta content
    const getMeta = (name: string, attr: string = 'name') =>
      doc.querySelector(`meta[${attr}="${name}"]`)?.getAttribute('content') ||
      undefined

    // Helper function to get link href
    const getLink = (rel: string) =>
      doc.querySelector(`link[rel="${rel}"]`)?.getAttribute('href') || undefined

    // Get alternate URLs
    const alternateLinks = doc.querySelectorAll('link[rel="alternate"]')
    const alternateUrls: { [key: string]: string } = {}
    alternateLinks.forEach((link) => {
      const hreflang = link.getAttribute('hreflang')
      const href = link.getAttribute('href')
      if (hreflang && href) {
        alternateUrls[hreflang] = href
      }
    })

    // Check for sitemap and robots.txt
    const baseUrl = new URL(url).origin
    let sitemapUrl: string | undefined
    let sitemapExists = false
    let robotsTxtExists = false
    let robotsTxtContent: string | undefined

    // Check robots.txt
    try {
      const robotsResponse = await fetch(`${baseUrl}/robots.txt`)
      if (robotsResponse.ok) {
        robotsTxtExists = true
        robotsTxtContent = await robotsResponse.text()

        // Try to find sitemap in robots.txt
        const sitemapMatch = robotsTxtContent.match(/Sitemap:\s*(.+)/i)
        if (sitemapMatch) {
          sitemapUrl = sitemapMatch[1].trim()
          sitemapExists = true
        }
      }
    } catch (error) {
      console.error('Error checking robots.txt:', error)
    }

    // If sitemap not found in robots.txt, check common locations
    if (!sitemapExists) {
      const commonSitemapPaths = [
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/sitemap/',
        '/sitemap/sitemap.xml',
      ]

      for (const path of commonSitemapPaths) {
        try {
          const sitemapResponse = await fetch(`${baseUrl}${path}`)
          if (sitemapResponse.ok) {
            sitemapUrl = `${baseUrl}${path}`
            sitemapExists = true
            break
          }
        } catch (error) {
          console.error(`Error checking sitemap at ${path}:`, error)
        }
      }
    }

    return {
      // Basic SEO
      title: doc.querySelector('title')?.textContent || undefined,
      description: getMeta('description'),
      keywords: getMeta('keywords'),
      author: getMeta('author'),
      generator: getMeta('generator'),
      themeColor: getMeta('theme-color'),

      // Open Graph
      ogTitle: getMeta('og:title', 'property'),
      ogDescription: getMeta('og:description', 'property'),
      ogImage: getMeta('og:image', 'property'),
      ogImageWidth: getMeta('og:image:width', 'property'),
      ogImageHeight: getMeta('og:image:height', 'property'),
      ogImageAlt: getMeta('og:image:alt', 'property'),
      ogUrl: getMeta('og:url', 'property'),
      ogType: getMeta('og:type', 'property'),
      ogSiteName: getMeta('og:site_name', 'property'),
      ogLocale: getMeta('og:locale', 'property'),
      ogVideo: getMeta('og:video', 'property'),
      ogAudio: getMeta('og:audio', 'property'),

      // Facebook
      fbAppId: getMeta('fb:app_id', 'property'),
      fbPages: getMeta('fb:pages', 'property'),
      fbDomainVerification: getMeta('facebook-domain-verification'),

      // Twitter Cards
      twitterCard: getMeta('twitter:card'),
      twitterTitle: getMeta('twitter:title'),
      twitterDescription: getMeta('twitter:description'),
      twitterImage: getMeta('twitter:image'),
      twitterImageAlt: getMeta('twitter:image:alt'),
      twitterSite: getMeta('twitter:site'),
      twitterCreator: getMeta('twitter:creator'),
      twitterDomainVerification: getMeta('twitter:domain-verification'),

      // WhatsApp
      whatsappTitle: getMeta('og:title', 'property') || getMeta('title'),
      whatsappDescription:
        getMeta('og:description', 'property') || getMeta('description'),
      whatsappImage: getMeta('og:image', 'property'),

      // LinkedIn
      linkedinTitle: getMeta('og:title', 'property') || getMeta('title'),
      linkedinDescription:
        getMeta('og:description', 'property') || getMeta('description'),
      linkedinImage: getMeta('og:image', 'property'),
      linkedinAuthor: getMeta('article:author', 'property'),

      // Pinterest
      pinterestDescription:
        getMeta('og:description', 'property') || getMeta('description'),
      pinterestImage: getMeta('og:image', 'property'),
      pinterestDomainVerification: getMeta('p:domain_verify'),

      // Technical
      canonicalUrl: getLink('canonical'),
      robots: getMeta('robots'),
      viewport: getMeta('viewport'),
      charset:
        doc.querySelector('meta[charset]')?.getAttribute('charset') ||
        undefined,
      language: doc.querySelector('html')?.getAttribute('lang') || undefined,
      favicon: getLink('icon') || getLink('shortcut icon'),
      appleTouchIcon: getLink('apple-touch-icon'),
      manifest: getLink('manifest'),

      // Article Specific
      articlePublishedTime: getMeta('article:published_time', 'property'),
      articleModifiedTime: getMeta('article:modified_time', 'property'),
      articleAuthor: getMeta('article:author', 'property'),
      articleSection: getMeta('article:section', 'property'),
      articleTags: getMeta('article:tag', 'property'),

      // Additional SEO
      alternateUrls:
        Object.keys(alternateUrls).length > 0 ? alternateUrls : undefined,
      prevPage: getLink('prev'),
      nextPage: getLink('next'),
      rating: getMeta('rating'),
      referrer: getMeta('referrer'),

      // Sitemap
      sitemapUrl,
      sitemapExists,
      robotsTxtExists,
      robotsTxtContent,
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw new Error('Failed to fetch metadata')
  }
}
