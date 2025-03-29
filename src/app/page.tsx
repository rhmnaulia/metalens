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
import { Loader2, Globe, Search } from 'lucide-react'
import { fetchMetadata, MetadataResult } from '@/lib/metadata'
import { ImagePreview } from '@/components/image-preview'
import { ThemeToggle } from '@/components/theme-toggle'
import './animations.css'

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
      <nav className='fixed top-0 right-0 p-4 z-50'>
        <ThemeToggle />
      </nav>
      <div className='container mx-auto py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto space-y-8 animate-fade-in'>
          <div className='text-center space-y-4 animate-slide-in'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/20'>
              <Globe className='w-8 h-8 text-primary' />
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent'>
              MetaScope
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
                        <CardHeader className='space-y-1'>
                          <CardTitle>Basic Information</CardTitle>
                          <CardDescription>
                            Core metadata information about your webpage
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Title
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.title || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Description
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.description || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Keywords
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.keywords || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Author
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.author || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Generator
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.generator || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Theme Color
                              </h3>
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
                          <CardTitle>Open Graph</CardTitle>
                          <CardDescription>
                            Social media sharing information using Open Graph
                            protocol
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-8'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG Title
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.ogTitle || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                OG Description
                              </h3>
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
                          <CardTitle>Twitter Card</CardTitle>
                          <CardDescription>
                            Twitter-specific social media information
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-8'>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Card Type
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterCard || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Title
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterTitle || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <h3 className='font-medium text-primary'>
                              Description
                            </h3>
                            <p className='text-sm text-muted-foreground break-words'>
                              {metadata.twitterDescription || 'Not found'}
                            </p>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Site (@username)
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterSite || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Creator (@username)
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.twitterCreator || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <h3 className='font-medium text-primary'>Image</h3>
                            <div className='text-sm text-muted-foreground mb-2'>
                              {formatUrl(metadata.twitterImage)}
                            </div>
                            <ImagePreview
                              src={metadata.twitterImage}
                              alt='Twitter Card Image'
                              title='Twitter Card Image Preview'
                            />
                          </div>
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
                              <h3 className='font-medium text-primary'>
                                Published Time
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articlePublishedTime || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Modified Time
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articleModifiedTime || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Author
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articleAuthor || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Section
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.articleSection || 'Not found'}
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <h3 className='font-medium text-primary'>Tags</h3>
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
                                <h3 className='font-medium text-primary'>
                                  Canonical URL
                                </h3>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.canonicalUrl)}
                                </div>
                              </div>
                              <div className='space-y-2'>
                                <h3 className='font-medium text-primary'>
                                  Robots
                                </h3>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.robots || 'Not found'}
                                </p>
                              </div>
                            </div>
                            <div className='grid gap-6 md:grid-cols-2'>
                              <div className='space-y-2'>
                                <h3 className='font-medium text-primary'>
                                  Viewport
                                </h3>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.viewport || 'Not found'}
                                </p>
                              </div>
                              <div className='space-y-2'>
                                <h3 className='font-medium text-primary'>
                                  Charset
                                </h3>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.charset || 'Not found'}
                                </p>
                              </div>
                            </div>
                            <div className='grid gap-6 md:grid-cols-2'>
                              <div className='space-y-2'>
                                <h3 className='font-medium text-primary'>
                                  Language
                                </h3>
                                <p className='text-sm text-muted-foreground break-words'>
                                  {metadata.language || 'Not found'}
                                </p>
                              </div>
                              <div className='space-y-2'>
                                <h3 className='font-medium text-primary'>
                                  Manifest
                                </h3>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.manifest)}
                                </div>
                              </div>
                            </div>
                            <div className='grid gap-6 md:grid-cols-2'>
                              <div className='space-y-2'>
                                <h3 className='font-medium text-primary'>
                                  Favicon
                                </h3>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.favicon)}
                                </div>
                              </div>
                              <div className='space-y-2'>
                                <h3 className='font-medium text-primary'>
                                  Apple Touch Icon
                                </h3>
                                <div className='text-sm text-muted-foreground'>
                                  {formatUrl(metadata.appleTouchIcon)}
                                </div>
                              </div>
                            </div>
                          </div>
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
                              <h3 className='font-medium text-primary'>
                                Alternate URLs
                              </h3>
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
                              <h3 className='font-medium text-primary'>
                                Previous Page
                              </h3>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(metadata.prevPage)}
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Next Page
                              </h3>
                              <div className='text-sm text-muted-foreground'>
                                {formatUrl(metadata.nextPage)}
                              </div>
                            </div>
                          </div>
                          <div className='grid gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Rating
                              </h3>
                              <p className='text-sm text-muted-foreground break-words'>
                                {metadata.rating || 'Not found'}
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <h3 className='font-medium text-primary'>
                                Referrer Policy
                              </h3>
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
