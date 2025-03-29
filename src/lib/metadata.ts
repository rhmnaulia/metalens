export interface MetadataResult {
  title: string | null
  description: string | null
  keywords: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  twitterCard: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null
  canonicalUrl: string | null
  robots: string | null
  viewport: string | null
  charset: string | null
  language: string | null
  favicon: string | null
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    return {
      title: doc.querySelector('title')?.textContent || null,
      description:
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute('content') || null,
      keywords:
        doc.querySelector('meta[name="keywords"]')?.getAttribute('content') ||
        null,
      ogTitle:
        doc
          .querySelector('meta[property="og:title"]')
          ?.getAttribute('content') || null,
      ogDescription:
        doc
          .querySelector('meta[property="og:description"]')
          ?.getAttribute('content') || null,
      ogImage:
        doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute('content') || null,
      twitterCard:
        doc
          .querySelector('meta[name="twitter:card"]')
          ?.getAttribute('content') || null,
      twitterTitle:
        doc
          .querySelector('meta[name="twitter:title"]')
          ?.getAttribute('content') || null,
      twitterDescription:
        doc
          .querySelector('meta[name="twitter:description"]')
          ?.getAttribute('content') || null,
      twitterImage:
        doc
          .querySelector('meta[name="twitter:image"]')
          ?.getAttribute('content') || null,
      canonicalUrl:
        doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ||
        null,
      robots:
        doc.querySelector('meta[name="robots"]')?.getAttribute('content') ||
        null,
      viewport:
        doc.querySelector('meta[name="viewport"]')?.getAttribute('content') ||
        null,
      charset:
        doc.querySelector('meta[charset]')?.getAttribute('charset') || null,
      language: doc.querySelector('html')?.getAttribute('lang') || null,
      favicon:
        doc.querySelector('link[rel="icon"]')?.getAttribute('href') || null,
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw new Error('Failed to fetch metadata')
  }
}
