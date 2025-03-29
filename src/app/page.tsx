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
import { Loader2 } from 'lucide-react'
import { fetchMetadata, MetadataResult } from '@/lib/metadata'
import { ImagePreview } from '@/components/image-preview'

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
    <main className='container mx-auto py-8 px-4'>
      <div className='max-w-2xl mx-auto space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-4xl font-bold'>Meta Checker</h1>
          <p className='text-muted-foreground'>
            Check your website&apos;s metadata and SEO information
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              type='url'
              placeholder='Enter website URL (e.g., https://example.com)'
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              required
              className='flex-1'
            />
            <Button type='submit' disabled={loading}>
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
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {metadata && (
          <Tabs defaultValue='basic' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='basic'>Basic</TabsTrigger>
              <TabsTrigger value='social'>Social</TabsTrigger>
              <TabsTrigger value='technical'>Technical</TabsTrigger>
            </TabsList>
            <TabsContent value='basic'>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Basic metadata information</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h3 className='font-medium'>Title</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.title || 'Not found'}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium'>Description</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.description || 'Not found'}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium'>Keywords</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.keywords || 'Not found'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='social'>
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>
                    Open Graph and Twitter card information
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-4'>
                      <h3 className='font-medium'>Open Graph Title</h3>
                      <p className='text-sm text-muted-foreground'>
                        {metadata.ogTitle || 'Not found'}
                      </p>
                    </div>
                    <div className='space-y-4'>
                      <h3 className='font-medium'>Open Graph Description</h3>
                      <p className='text-sm text-muted-foreground'>
                        {metadata.ogDescription || 'Not found'}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='font-medium'>Open Graph Image</h3>
                    <ImagePreview
                      src={metadata.ogImage}
                      alt='Open Graph Image'
                      title='Open Graph Image Preview'
                    />
                  </div>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-4'>
                      <h3 className='font-medium'>Twitter Card</h3>
                      <p className='text-sm text-muted-foreground'>
                        {metadata.twitterCard || 'Not found'}
                      </p>
                    </div>
                    <div className='space-y-4'>
                      <h3 className='font-medium'>Twitter Title</h3>
                      <p className='text-sm text-muted-foreground'>
                        {metadata.twitterTitle || 'Not found'}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='font-medium'>Twitter Description</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.twitterDescription || 'Not found'}
                    </p>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='font-medium'>Twitter Image</h3>
                    <ImagePreview
                      src={metadata.twitterImage}
                      alt='Twitter Card Image'
                      title='Twitter Card Image Preview'
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='technical'>
              <Card>
                <CardHeader>
                  <CardTitle>Technical Information</CardTitle>
                  <CardDescription>
                    Technical metadata and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h3 className='font-medium'>Canonical URL</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.canonicalUrl || 'Not found'}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium'>Robots</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.robots || 'Not found'}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium'>Viewport</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.viewport || 'Not found'}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium'>Charset</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.charset || 'Not found'}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium'>Language</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.language || 'Not found'}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium'>Favicon</h3>
                    <p className='text-sm text-muted-foreground'>
                      {metadata.favicon || 'Not found'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  )
}
