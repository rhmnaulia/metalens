'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Globe, Search, Github, Copy, Check } from 'lucide-react'
import { fetchMetadata, MetadataResult } from '@/lib/metadata'
import { ImagePreview } from '@/components/image-preview'
import { ThemeToggle } from '@/components/theme-toggle'
import './animations.css'

const GITHUB_REPO_URL = '' // TODO: Update with actual repo URL

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

function CopyAllButton({
  data,
  title,
}: {
  data: Record<string, string | null | undefined>
  title: string
}) {
  const [copied, setCopied] = useState(false)

  const nonEmptyEntries = Object.entries(data).filter(([, value]) => value)
  if (nonEmptyEntries.length === 0) return null

  const copy = () => {
    const jsonData = {
      title,
      data: Object.fromEntries(nonEmptyEntries),
    }

    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant='outline'
      size='sm'
      className='ml-auto flex items-center gap-2'
      onClick={copy}
    >
      {copied ? (
        <>
          <Check className='h-3 w-3' />
          Copied!
        </>
      ) : (
        <>
          <Copy className='h-3 w-3' />
          Copy JSON
        </>
      )}
    </Button>
  )
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<MetadataResult | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMetadata(null)

    try {
      const result = await fetchMetadata(url)
      setMetadata(result)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to fetch metadata. Please check the URL and try again.')
    } finally {
      setLoading(false)
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
          <div className='text-center space-y-4 animate-slide-in'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/20'>
              <Globe className='w-8 h-8 text-primary' />
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight lg:text-5xl animate-fade-in'>
              MetaLens
            </h1>
            <p className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto'>
              Instantly analyze and preview your website&apos;s SEO metadata,
              social cards, and technical tags for better visibility
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4 animate-fade-in'>
            <div className='flex flex-col sm:flex-row gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  type='url'
                  placeholder='Enter website URL (e.g., https://example.com)'
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUrl(e.target.value)
                  }
                  required
                  className='pl-9'
                />
              </div>
              <Button
                type='submit'
                disabled={loading}
                size='lg'
                className='w-full sm:w-auto'
              >
                {loading ? (
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
            <div className='animate-fade-in'>
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {metadata && (
            <div className='animate-fade-in'>
              <Tabs defaultValue='basic' className='w-full'>
                <TabsList className='grid w-full grid-cols-5 mb-6'>
                  <TabsTrigger value='basic'>Basic</TabsTrigger>
                  <TabsTrigger value='social'>Social</TabsTrigger>
                  <TabsTrigger value='article'>Article</TabsTrigger>
                  <TabsTrigger value='technical'>Technical</TabsTrigger>
                  <TabsTrigger value='additional'>Additional</TabsTrigger>
                </TabsList>
                <div className='mt-4 space-y-4'>
                  <TabsContent value='basic'>
                    <div className='animate-stagger'>
                      <Card className='card-hover'>
                        <CardHeader className='space-y-1 flex items-start justify-between'>
                          <div>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                              Core metadata information about your webpage
                            </CardDescription>
                          </div>
                          <CopyAllButton
                            data={{
                              title: metadata.title,
                              description: metadata.description,
                              keywords: metadata.keywords,
                              author: metadata.author,
                              generator: metadata.generator,
                              themeColor: metadata.themeColor,
                            }}
                            title='Basic Information'
                          />
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Title
                                </h3>
                                <CopyButton content={metadata.title} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.title || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Description
                                </h3>
                                <CopyButton content={metadata.description} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.description || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Keywords
                                </h3>
                                <CopyButton content={metadata.keywords || ''} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.keywords || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Author
                                </h3>
                                <CopyButton content={metadata.author || ''} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.author || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Generator
                                </h3>
                                <CopyButton
                                  content={metadata.generator || ''}
                                />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.generator || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Theme Color
                                </h3>
                                <CopyButton
                                  content={metadata.themeColor || ''}
                                />
                              </div>
                              <div className='flex items-center gap-2'>
                                {metadata.themeColor && (
                                  <div
                                    className='w-4 h-4 rounded border'
                                    style={{
                                      backgroundColor: metadata.themeColor,
                                    }}
                                  />
                                )}
                                <p className='text-sm text-muted-foreground'>
                                  {metadata.themeColor || 'Not found'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value='social'>
                    <div className='animate-stagger space-y-4'>
                      <Card className='card-hover'>
                        <CardHeader>
                          <div>
                            <CardTitle>Open Graph</CardTitle>
                            <CardDescription>
                              Social media sharing information using Open Graph
                              protocol
                            </CardDescription>
                          </div>
                          <CopyAllButton
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
                            title='Open Graph Information'
                          />
                        </CardHeader>
                        <CardContent className='space-y-8'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  OG Title
                                </h3>
                                <CopyButton content={metadata.ogTitle || ''} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.ogTitle || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  OG Description
                                </h3>
                                <CopyButton
                                  content={metadata.ogDescription || ''}
                                />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.ogDescription || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG Type
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.ogType || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG Site Name
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.ogSiteName || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG URL
                              </h3>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(metadata.ogUrl)}
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG Locale
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.ogLocale || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <h3 className='font-medium text-primary'>
                              OG Image
                            </h3>
                            <div className='text-sm text-muted-foreground mb-2'>
                              {formatUrl(metadata.ogImage)}
                            </div>
                            {metadata.ogImageWidth &&
                              metadata.ogImageHeight && (
                                <p className='text-sm text-muted-foreground mb-2'>
                                  Dimensions: {metadata.ogImageWidth} x{' '}
                                  {metadata.ogImageHeight}
                                </p>
                              )}
                            {metadata.ogImageAlt && (
                              <p className='text-sm text-muted-foreground mb-2'>
                                Alt text: {metadata.ogImageAlt}
                              </p>
                            )}
                            <ImagePreview
                              src={metadata.ogImage}
                              alt='Open Graph Image'
                              title='Open Graph Image Preview'
                            />
                          </div>
                          {metadata.ogVideo && (
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG Video
                              </h3>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(metadata.ogVideo)}
                              </div>
                            </div>
                          )}
                          {metadata.ogAudio && (
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG Audio
                              </h3>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(metadata.ogAudio)}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className='card-hover'>
                        <CardHeader>
                          <div>
                            <CardTitle>Facebook</CardTitle>
                            <CardDescription>
                              Facebook-specific metadata and verification
                            </CardDescription>
                          </div>
                          <CopyAllButton
                            data={{
                              appId: metadata.fbAppId,
                              pages: metadata.fbPages,
                              domainVerification: metadata.fbDomainVerification,
                            }}
                            title='Facebook Information'
                          />
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  App ID
                                </h3>
                                <CopyButton content={metadata.fbAppId} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.fbAppId || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Pages
                                </h3>
                                <CopyButton content={metadata.fbPages} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.fbPages || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Domain Verification
                              </h3>
                              <CopyButton
                                content={metadata.fbDomainVerification}
                              />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.fbDomainVerification || 'Not found'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className='card-hover'>
                        <CardHeader>
                          <div>
                            <CardTitle>Twitter Card</CardTitle>
                            <CardDescription>
                              Twitter-specific social media information
                            </CardDescription>
                          </div>
                          <CopyAllButton
                            data={{
                              cardType: metadata.twitterCard,
                              title: metadata.twitterTitle,
                              description: metadata.twitterDescription,
                              site: metadata.twitterSite,
                              creator: metadata.twitterCreator,
                              image: metadata.twitterImage,
                              imageAlt: metadata.twitterImageAlt,
                              domainVerification:
                                metadata.twitterDomainVerification,
                            }}
                            title='Twitter Card Information'
                          />
                        </CardHeader>
                        <CardContent className='space-y-8'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Card Type
                                </h3>
                                <CopyButton content={metadata.twitterCard} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterCard || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Title
                                </h3>
                                <CopyButton content={metadata.twitterTitle} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterTitle || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Description
                              </h3>
                              <CopyButton
                                content={metadata.twitterDescription}
                              />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.twitterDescription || 'Not found'}
                            </p>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Site (@username)
                                </h3>
                                <CopyButton content={metadata.twitterSite} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterSite || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Creator (@username)
                                </h3>
                                <CopyButton content={metadata.twitterCreator} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterCreator || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Image
                              </h3>
                              <CopyButton content={metadata.twitterImage} />
                            </div>
                            <div className='text-sm text-muted-foreground mb-2'>
                              {formatUrl(metadata.twitterImage)}
                            </div>
                            {metadata.twitterImageAlt && (
                              <div>
                                <div className='flex items-center gap-2'>
                                  <p className='text-sm text-muted-foreground mb-2'>
                                    Alt text:
                                  </p>
                                  <CopyButton
                                    content={metadata.twitterImageAlt}
                                  />
                                </div>
                                <p className='text-sm text-muted-foreground mb-2'>
                                  {metadata.twitterImageAlt}
                                </p>
                              </div>
                            )}
                            <ImagePreview
                              src={metadata.twitterImage}
                              alt='Twitter Card Image'
                              title='Twitter Card Image Preview'
                            />
                          </div>
                          {metadata.twitterDomainVerification && (
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Domain Verification
                                </h3>
                                <CopyButton
                                  content={metadata.twitterDomainVerification}
                                />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterDomainVerification}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className='card-hover'>
                        <CardHeader>
                          <div>
                            <CardTitle>WhatsApp Preview</CardTitle>
                            <CardDescription>
                              How your link appears when shared on WhatsApp
                            </CardDescription>
                          </div>
                          <CopyAllButton
                            data={{
                              title: metadata.whatsappTitle,
                              description: metadata.whatsappDescription,
                              image: metadata.whatsappImage,
                            }}
                            title='WhatsApp Preview Information'
                          />
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Title
                              </h3>
                              <CopyButton content={metadata.whatsappTitle} />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.whatsappTitle || 'Not found'}
                            </p>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Description
                              </h3>
                              <CopyButton
                                content={metadata.whatsappDescription}
                              />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.whatsappDescription || 'Not found'}
                            </p>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Image
                              </h3>
                              <CopyButton content={metadata.whatsappImage} />
                            </div>
                            <ImagePreview
                              src={metadata.whatsappImage}
                              alt='WhatsApp Preview Image'
                              title='WhatsApp Preview Image'
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className='card-hover'>
                        <CardHeader>
                          <div>
                            <CardTitle>LinkedIn Preview</CardTitle>
                            <CardDescription>
                              How your link appears when shared on LinkedIn
                            </CardDescription>
                          </div>
                          <CopyAllButton
                            data={{
                              title: metadata.linkedinTitle,
                              description: metadata.linkedinDescription,
                              author: metadata.linkedinAuthor,
                              image: metadata.linkedinImage,
                            }}
                            title='LinkedIn Preview Information'
                          />
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Title
                              </h3>
                              <CopyButton content={metadata.linkedinTitle} />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.linkedinTitle || 'Not found'}
                            </p>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Description
                              </h3>
                              <CopyButton
                                content={metadata.linkedinDescription}
                              />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.linkedinDescription || 'Not found'}
                            </p>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Author
                              </h3>
                              <CopyButton content={metadata.linkedinAuthor} />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.linkedinAuthor || 'Not found'}
                            </p>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Image
                              </h3>
                              <CopyButton content={metadata.linkedinImage} />
                            </div>
                            <ImagePreview
                              src={metadata.linkedinImage}
                              alt='LinkedIn Preview Image'
                              title='LinkedIn Preview Image'
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className='card-hover'>
                        <CardHeader>
                          <div>
                            <CardTitle>Pinterest Preview</CardTitle>
                            <CardDescription>
                              How your link appears when shared on Pinterest
                            </CardDescription>
                          </div>
                          <CopyAllButton
                            data={{
                              description: metadata.pinterestDescription,
                              image: metadata.pinterestImage,
                              domainVerification:
                                metadata.pinterestDomainVerification,
                            }}
                            title='Pinterest Preview Information'
                          />
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Description
                              </h3>
                              <CopyButton
                                content={metadata.pinterestDescription}
                              />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.pinterestDescription || 'Not found'}
                            </p>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>
                                Image
                              </h3>
                              <CopyButton content={metadata.pinterestImage} />
                            </div>
                            <ImagePreview
                              src={metadata.pinterestImage}
                              alt='Pinterest Preview Image'
                              title='Pinterest Preview Image'
                            />
                          </div>
                          {metadata.pinterestDomainVerification && (
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Domain Verification
                                </h3>
                                <CopyButton
                                  content={metadata.pinterestDomainVerification}
                                />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.pinterestDomainVerification}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value='article'>
                    <div className='animate-stagger'>
                      <Card className='card-hover'>
                        <CardHeader>
                          <CardTitle>Article Information</CardTitle>
                          <CardDescription>
                            Article-specific metadata for better content
                            organization
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Published Time
                                </h3>
                                <CopyButton
                                  content={metadata.articlePublishedTime}
                                />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articlePublishedTime || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Modified Time
                                </h3>
                                <CopyButton
                                  content={metadata.articleModifiedTime}
                                />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articleModifiedTime || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Author
                                </h3>
                                <CopyButton content={metadata.articleAuthor} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articleAuthor || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Section
                                </h3>
                                <CopyButton content={metadata.articleSection} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articleSection || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium text-primary'>Tags</h3>
                              <CopyButton content={metadata.articleTags} />
                            </div>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.articleTags || 'Not found'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value='technical'>
                    <div className='animate-stagger'>
                      <Card className='card-hover'>
                        <CardHeader>
                          <CardTitle>Technical Information</CardTitle>
                          <CardDescription>
                            Technical metadata and settings
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className='grid gap-6'>
                            <div className='grid gap-6 md:grid-cols-2'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Canonical URL
                                  </h3>
                                  <CopyButton content={metadata.canonicalUrl} />
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.canonicalUrl)}
                                </div>
                              </div>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Robots
                                  </h3>
                                  <CopyButton content={metadata.robots} />
                                </div>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.robots || 'Not found'}
                                </p>
                              </div>
                            </div>
                            <div className='grid gap-6 md:grid-cols-2'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Viewport
                                  </h3>
                                  <CopyButton content={metadata.viewport} />
                                </div>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.viewport || 'Not found'}
                                </p>
                              </div>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Charset
                                  </h3>
                                  <CopyButton content={metadata.charset} />
                                </div>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.charset || 'Not found'}
                                </p>
                              </div>
                            </div>
                            <div className='grid gap-6 md:grid-cols-2'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Language
                                  </h3>
                                  <CopyButton content={metadata.language} />
                                </div>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.language || 'Not found'}
                                </p>
                              </div>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Manifest
                                  </h3>
                                  <CopyButton content={metadata.manifest} />
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.manifest)}
                                </div>
                              </div>
                            </div>
                            <div className='grid gap-6 md:grid-cols-2'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Favicon
                                  </h3>
                                  <CopyButton content={metadata.favicon} />
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.favicon)}
                                </div>
                              </div>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-medium text-primary'>
                                    Apple Touch Icon
                                  </h3>
                                  <CopyButton
                                    content={metadata.appleTouchIcon}
                                  />
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.appleTouchIcon)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className='card-hover mt-4'>
                        <CardHeader>
                          <CardTitle>Sitemap & Robots.txt</CardTitle>
                          <CardDescription>
                            Search engine crawling configuration
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='grid gap-6 md:grid-cols-2'>
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
                                <div>
                                  <div className='flex items-center gap-2 mt-2'>
                                    <h4 className='text-sm font-medium text-primary'>
                                      URL
                                    </h4>
                                    <CopyButton content={metadata.sitemapUrl} />
                                  </div>
                                  <div className='text-sm text-muted-foreground mt-1'>
                                    {formatUrl(metadata.sitemapUrl)}
                                  </div>
                                </div>
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
                          </div>
                          {metadata.robotsTxtContent && (
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Robots.txt Content
                                </h3>
                                <CopyButton
                                  content={metadata.robotsTxtContent}
                                />
                              </div>
                              <pre className='text-sm text-muted-foreground bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap'>
                                {metadata.robotsTxtContent}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value='additional'>
                    <div className='animate-stagger'>
                      <Card className='card-hover'>
                        <CardHeader>
                          <CardTitle>Additional Information</CardTitle>
                          <CardDescription>
                            Extra metadata and SEO-related information
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          {metadata.alternateUrls && (
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Alternate URLs
                                </h3>
                                <CopyButton
                                  content={Object.entries(
                                    metadata.alternateUrls
                                  )
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
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Previous Page
                                </h3>
                                <CopyButton content={metadata.prevPage} />
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(metadata.prevPage)}
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Next Page
                                </h3>
                                <CopyButton content={metadata.nextPage} />
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(metadata.nextPage)}
                              </div>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Rating
                                </h3>
                                <CopyButton content={metadata.rating} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.rating || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-medium text-primary'>
                                  Referrer Policy
                                </h3>
                                <CopyButton content={metadata.referrer} />
                              </div>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.referrer || 'Not found'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
