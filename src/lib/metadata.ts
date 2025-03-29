export interface MetadataResult {
  // Basic SEO
  title: string | null
  description: string | null
  keywords: string | null
  author: string | null
  generator: string | null
  themeColor: string | null

  // Open Graph
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  ogUrl: string | null
  ogType: string | null
  ogSiteName: string | null
  ogLocale: string | null
  ogVideo: string | null
  ogAudio: string | null

  // Twitter Cards
  twitterCard: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null
  twitterSite: string | null
  twitterCreator: string | null

  // Technical
  canonicalUrl: string | null
  robots: string | null
  viewport: string | null
  charset: string | null
  language: string | null
  favicon: string | null
  appleTouchIcon: string | null
  manifest: string | null

  // Article Specific
  articlePublishedTime: string | null
  articleModifiedTime: string | null
  articleAuthor: string | null
  articleSection: string | null
  articleTags: string | null

  // Additional SEO
  alternateUrls: { [key: string]: string } | null
  prevPage: string | null
  nextPage: string | null
  rating: string | null
  referrer: string | null
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
      null

    // Helper function to get link href
    const getLink = (rel: string) =>
      doc.querySelector(`link[rel="${rel}"]`)?.getAttribute('href') || null

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

    return {
      // Basic SEO
      title: doc.querySelector('title')?.textContent || null,
      description: getMeta('description'),
      keywords: getMeta('keywords'),
      author: getMeta('author'),
      generator: getMeta('generator'),
      themeColor: getMeta('theme-color'),

      // Open Graph
      ogTitle: getMeta('og:title', 'property'),
      ogDescription: getMeta('og:description', 'property'),
      ogImage: getMeta('og:image', 'property'),
      ogUrl: getMeta('og:url', 'property'),
      ogType: getMeta('og:type', 'property'),
      ogSiteName: getMeta('og:site_name', 'property'),
      ogLocale: getMeta('og:locale', 'property'),
      ogVideo: getMeta('og:video', 'property'),
      ogAudio: getMeta('og:audio', 'property'),

      // Twitter Cards
      twitterCard: getMeta('twitter:card'),
      twitterTitle: getMeta('twitter:title'),
      twitterDescription: getMeta('twitter:description'),
      twitterImage: getMeta('twitter:image'),
      twitterSite: getMeta('twitter:site'),
      twitterCreator: getMeta('twitter:creator'),

      // Technical
      canonicalUrl: getLink('canonical'),
      robots: getMeta('robots'),
      viewport: getMeta('viewport'),
      charset:
        doc.querySelector('meta[charset]')?.getAttribute('charset') || null,
      language: doc.querySelector('html')?.getAttribute('lang') || null,
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
        Object.keys(alternateUrls).length > 0 ? alternateUrls : null,
      prevPage: getLink('prev'),
      nextPage: getLink('next'),
      rating: getMeta('rating'),
      referrer: getMeta('referrer'),
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw new Error('Failed to fetch metadata')
  }
}
