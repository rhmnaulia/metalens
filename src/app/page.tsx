'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Globe, Search, Github, Copy, Check } from 'lucide-react'
import { fetchMetadata, MetadataResult } from '@/lib/metadata'
import { MetadataField } from '@/components/metadata-field'
import { MetadataSection } from '@/components/metadata-section'
import { MetadataGrid } from '@/components/metadata-grid'
import { ThemeToggle } from '@/components/theme-toggle'
import './animations.css'

const GITHUB_REPO_URL = 'https://github.com/yourusername/meta-checker' // TODO: Update with actual repo URL

function CopyButton({
  content,
  className = '',
}: {
  content: string | null | undefined
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  if (!content) return null

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className={`h-6 w-6 hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={copy}
    >
      {copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
      <span className='sr-only'>Copy</span>
    </Button>
  )
}

function formatUrl(url: string | null) {
  if (!url) return 'Not found'
  try {
    new URL(url)
    return (
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-primary hover:underline break-all'
      >
        {url}
      </a>
    )
  } catch {
    return url
  }
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<MetadataResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMetadata(null)

    try {
      const result = await fetchMetadata(url)
      setMetadata(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      <nav className='fixed top-0 right-0 p-4 z-50 flex items-center gap-2'>
        <a
          href={GITHUB_REPO_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-indigo-600 hover:text-white h-9 w-9'
        >
          <Github className='h-[1.2rem] w-[1.2rem]' />
        </a>
        <ThemeToggle />
      </nav>

      <div className='container mx-auto py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto space-y-8 animate-fade-in'>
          <div className='text-center space-y-4'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/20'>
              <Globe className='w-8 h-8 text-primary' />
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-indigo-600 via-primary to-indigo-400 bg-clip-text text-transparent animate-fade-in'>
              Meta
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600'>
                Lens
              </span>
            </h1>
            <p className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto'>
              Instantly analyze and preview your website&apos;s SEO metadata,
              social cards, and technical tags for better visibility
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  type='url'
                  placeholder='Enter website URL (e.g., https://example.com)'
                  className='pl-9 h-10'
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <Button className='h-10 w-20' type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Checking...
                  </>
                ) : (
                  'Check'
                )}
              </Button>
            </div>
          </form>

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {metadata && (
            <Tabs defaultValue='basic' className='animate-fade-in'>
              <TabsList className='grid w-full grid-cols-3 lg:w-[400px] mx-auto'>
                <TabsTrigger value='basic'>Basic</TabsTrigger>
                <TabsTrigger value='social'>Social</TabsTrigger>
                <TabsTrigger value='technical'>Technical</TabsTrigger>
              </TabsList>

              <TabsContent value='basic' className='space-y-4 animate-stagger'>
                <MetadataSection
                  title='Basic Information'
                  description='Core metadata information about your webpage'
                  data={{
                    title: metadata.title,
                    description: metadata.description,
                    keywords: metadata.keywords,
                    author: metadata.author,
                    generator: metadata.generator,
                    themeColor: metadata.themeColor,
                  }}
                >
                  <MetadataGrid>
                    <MetadataField label='Title' value={metadata.title} />
                    <MetadataField
                      label='Description'
                      value={metadata.description}
                    />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField label='Keywords' value={metadata.keywords} />
                    <MetadataField label='Author' value={metadata.author} />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField
                      label='Generator'
                      value={metadata.generator}
                    />
                    <MetadataField
                      label='Theme Color'
                      value={metadata.themeColor}
                    />
                  </MetadataGrid>
                </MetadataSection>

                <MetadataSection
                  title='Article Information'
                  description='Article-specific metadata for better content organization'
                  data={{
                    publishedTime: metadata.articlePublishedTime,
                    modifiedTime: metadata.articleModifiedTime,
                    author: metadata.articleAuthor,
                    section: metadata.articleSection,
                    tags: metadata.articleTags,
                  }}
                >
                  <MetadataGrid>
                    <MetadataField
                      label='Published Time'
                      value={metadata.articlePublishedTime}
                    />
                    <MetadataField
                      label='Modified Time'
                      value={metadata.articleModifiedTime}
                    />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField
                      label='Author'
                      value={metadata.articleAuthor}
                    />
                    <MetadataField
                      label='Section'
                      value={metadata.articleSection}
                    />
                  </MetadataGrid>
                  <MetadataField label='Tags' value={metadata.articleTags} />
                </MetadataSection>
              </TabsContent>

              <TabsContent value='social' className='space-y-4 animate-stagger'>
                <MetadataSection
                  title='Open Graph'
                  description='Social media sharing information using Open Graph protocol'
                  data={{
                    ogTitle: metadata.ogTitle,
                    ogDescription: metadata.ogDescription,
                    ogType: metadata.ogType,
                    ogSiteName: metadata.ogSiteName,
                    ogUrl: metadata.ogUrl,
                    ogLocale: metadata.ogLocale,
                    ogImage: metadata.ogImage,
                    ogImageWidth: metadata.ogImageWidth,
                    ogImageHeight: metadata.ogImageHeight,
                    ogImageAlt: metadata.ogImageAlt,
                    ogVideo: metadata.ogVideo,
                    ogAudio: metadata.ogAudio,
                  }}
                >
                  <MetadataGrid>
                    <MetadataField label='OG Title' value={metadata.ogTitle} />
                    <MetadataField
                      label='OG Description'
                      value={metadata.ogDescription}
                    />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField label='OG Type' value={metadata.ogType} />
                    <MetadataField
                      label='OG Site Name'
                      value={metadata.ogSiteName}
                    />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField
                      label='OG URL'
                      value={metadata.ogUrl}
                      type='url'
                    />
                    <MetadataField
                      label='OG Locale'
                      value={metadata.ogLocale}
                    />
                  </MetadataGrid>
                  <MetadataField
                    label='OG Image'
                    value={metadata.ogImage}
                    type='image'
                  />
                  {metadata.ogImageAlt && (
                    <MetadataField
                      label='OG Image Alt'
                      value={metadata.ogImageAlt}
                    />
                  )}
                  {metadata.ogVideo && (
                    <MetadataField
                      label='OG Video'
                      value={metadata.ogVideo}
                      type='url'
                    />
                  )}
                  {metadata.ogAudio && (
                    <MetadataField
                      label='OG Audio'
                      value={metadata.ogAudio}
                      type='url'
                    />
                  )}
                </MetadataSection>

                <MetadataSection
                  title='Facebook'
                  description='Facebook-specific metadata and verification'
                  data={{
                    appId: metadata.fbAppId,
                    pages: metadata.fbPages,
                    domainVerification: metadata.fbDomainVerification,
                  }}
                >
                  <MetadataGrid>
                    <MetadataField label='App ID' value={metadata.fbAppId} />
                    <MetadataField label='Pages' value={metadata.fbPages} />
                  </MetadataGrid>
                  <MetadataField
                    label='Domain Verification'
                    value={metadata.fbDomainVerification}
                  />
                </MetadataSection>

                <MetadataSection
                  title='Twitter Card'
                  description='Twitter-specific social media information'
                  data={{
                    cardType: metadata.twitterCard,
                    title: metadata.twitterTitle,
                    description: metadata.twitterDescription,
                    site: metadata.twitterSite,
                    creator: metadata.twitterCreator,
                    image: metadata.twitterImage,
                    imageAlt: metadata.twitterImageAlt,
                    domainVerification: metadata.twitterDomainVerification,
                  }}
                >
                  <MetadataGrid>
                    <MetadataField
                      label='Card Type'
                      value={metadata.twitterCard}
                    />
                    <MetadataField
                      label='Title'
                      value={metadata.twitterTitle}
                    />
                  </MetadataGrid>
                  <MetadataField
                    label='Description'
                    value={metadata.twitterDescription}
                  />
                  <MetadataGrid>
                    <MetadataField
                      label='Site (@username)'
                      value={metadata.twitterSite}
                    />
                    <MetadataField
                      label='Creator (@username)'
                      value={metadata.twitterCreator}
                    />
                  </MetadataGrid>
                  <MetadataField
                    label='Image'
                    value={metadata.twitterImage}
                    type='image'
                  />
                  {metadata.twitterImageAlt && (
                    <MetadataField
                      label='Image Alt'
                      value={metadata.twitterImageAlt}
                    />
                  )}
                  {metadata.twitterDomainVerification && (
                    <MetadataField
                      label='Domain Verification'
                      value={metadata.twitterDomainVerification}
                    />
                  )}
                </MetadataSection>

                <MetadataSection
                  title='WhatsApp Preview'
                  description='How your link appears when shared on WhatsApp'
                  data={{
                    title: metadata.whatsappTitle,
                    description: metadata.whatsappDescription,
                    image: metadata.whatsappImage,
                  }}
                >
                  <MetadataField label='Title' value={metadata.whatsappTitle} />
                  <MetadataField
                    label='Description'
                    value={metadata.whatsappDescription}
                  />
                  <MetadataField
                    label='Image'
                    value={metadata.whatsappImage}
                    type='image'
                  />
                </MetadataSection>

                <MetadataSection
                  title='LinkedIn Preview'
                  description='How your link appears when shared on LinkedIn'
                  data={{
                    title: metadata.linkedinTitle,
                    description: metadata.linkedinDescription,
                    author: metadata.linkedinAuthor,
                    image: metadata.linkedinImage,
                  }}
                >
                  <MetadataField label='Title' value={metadata.linkedinTitle} />
                  <MetadataField
                    label='Description'
                    value={metadata.linkedinDescription}
                  />
                  <MetadataField
                    label='Author'
                    value={metadata.linkedinAuthor}
                  />
                  <MetadataField
                    label='Image'
                    value={metadata.linkedinImage}
                    type='image'
                  />
                </MetadataSection>

                <MetadataSection
                  title='Pinterest Preview'
                  description='How your link appears when shared on Pinterest'
                  data={{
                    description: metadata.pinterestDescription,
                    image: metadata.pinterestImage,
                    domainVerification: metadata.pinterestDomainVerification,
                  }}
                >
                  <MetadataField
                    label='Description'
                    value={metadata.pinterestDescription}
                  />
                  <MetadataField
                    label='Image'
                    value={metadata.pinterestImage}
                    type='image'
                  />
                  {metadata.pinterestDomainVerification && (
                    <MetadataField
                      label='Domain Verification'
                      value={metadata.pinterestDomainVerification}
                    />
                  )}
                </MetadataSection>
              </TabsContent>

              <TabsContent
                value='technical'
                className='space-y-4 animate-stagger'
              >
                <MetadataSection
                  title='Technical Information'
                  description='Technical metadata and settings'
                  data={{
                    canonicalUrl: metadata.canonicalUrl,
                    robots: metadata.robots,
                    viewport: metadata.viewport,
                    charset: metadata.charset,
                    language: metadata.language,
                    manifest: metadata.manifest,
                    favicon: metadata.favicon,
                    appleTouchIcon: metadata.appleTouchIcon,
                  }}
                >
                  <MetadataGrid>
                    <MetadataField
                      label='Canonical URL'
                      value={metadata.canonicalUrl}
                      type='url'
                    />
                    <MetadataField label='Robots' value={metadata.robots} />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField label='Viewport' value={metadata.viewport} />
                    <MetadataField label='Charset' value={metadata.charset} />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField label='Language' value={metadata.language} />
                    <MetadataField
                      label='Manifest'
                      value={metadata.manifest}
                      type='url'
                    />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField
                      label='Favicon'
                      value={metadata.favicon}
                      type='url'
                    />
                    <MetadataField
                      label='Apple Touch Icon'
                      value={metadata.appleTouchIcon}
                      type='url'
                    />
                  </MetadataGrid>
                </MetadataSection>

                <MetadataSection
                  title='Sitemap & Robots.txt'
                  description='Search engine crawling configuration'
                  data={{
                    sitemapUrl: metadata.sitemapUrl,
                    robotsTxtContent: metadata.robotsTxtContent,
                  }}
                >
                  <MetadataGrid>
                    <div className='space-y-2'>
                      <h3 className='font-medium text-primary'>
                        Sitemap Status
                      </h3>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            metadata.sitemapExists
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <p className='text-sm text-muted-foreground'>
                          {metadata.sitemapExists
                            ? 'Sitemap found'
                            : 'No sitemap detected'}
                        </p>
                      </div>
                      {metadata.sitemapUrl && (
                        <MetadataField
                          label='URL'
                          value={metadata.sitemapUrl}
                          type='url'
                        />
                      )}
                    </div>
                    <div className='space-y-2'>
                      <h3 className='font-medium text-primary'>
                        Robots.txt Status
                      </h3>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            metadata.robotsTxtExists
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <p className='text-sm text-muted-foreground'>
                          {metadata.robotsTxtExists
                            ? 'robots.txt found'
                            : 'No robots.txt detected'}
                        </p>
                      </div>
                    </div>
                  </MetadataGrid>
                  {metadata.robotsTxtContent && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-medium text-primary'>
                          Robots.txt Content
                        </h3>
                        <CopyButton content={metadata.robotsTxtContent} />
                      </div>
                      <pre className='text-sm text-muted-foreground bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap'>
                        {metadata.robotsTxtContent}
                      </pre>
                    </div>
                  )}
                </MetadataSection>

                <MetadataSection
                  title='Additional Information'
                  description='Extra metadata and SEO-related information'
                  data={{
                    alternateUrls: metadata.alternateUrls
                      ? Object.entries(metadata.alternateUrls)
                          .map(([lang, url]) => `${lang}: ${url}`)
                          .join('\n')
                      : undefined,
                    prevPage: metadata.prevPage,
                    nextPage: metadata.nextPage,
                    rating: metadata.rating,
                    referrer: metadata.referrer,
                  }}
                >
                  {metadata.alternateUrls && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-medium text-primary'>
                          Alternate URLs
                        </h3>
                        <CopyButton
                          content={Object.entries(metadata.alternateUrls)
                            .map(([lang, url]) => `${lang}: ${url}`)
                            .join('\n')}
                        />
                      </div>
                      <div className='space-y-2'>
                        {Object.entries(metadata.alternateUrls).map(
                          ([lang, url]) => (
                            <div key={lang} className='flex gap-2'>
                              <span className='text-sm font-medium'>
                                {lang}:
                              </span>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(url)}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  <MetadataGrid>
                    <MetadataField
                      label='Previous Page'
                      value={metadata.prevPage}
                      type='url'
                    />
                    <MetadataField
                      label='Next Page'
                      value={metadata.nextPage}
                      type='url'
                    />
                  </MetadataGrid>
                  <MetadataGrid>
                    <MetadataField label='Rating' value={metadata.rating} />
                    <MetadataField
                      label='Referrer Policy'
                      value={metadata.referrer}
                    />
                  </MetadataGrid>
                </MetadataSection>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </main>
  )
}
