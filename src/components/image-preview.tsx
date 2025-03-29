import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface ImagePreviewProps {
  src: string | null
  alt: string
  title: string
}

export function ImagePreview({ src, alt, title }: ImagePreviewProps) {
  if (!src) {
    return (
      <div className='animate-scale-in'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex flex-col items-center justify-center h-48 bg-muted rounded-lg'>
              <p className='text-sm text-muted-foreground'>
                No image available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='animate-scale-in hover-scale'>
      <Card>
        <CardContent className='p-4'>
          <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
            <Image
              src={src}
              alt={alt}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
          <p className='mt-2 text-sm text-muted-foreground'>{title}</p>
        </CardContent>
      </Card>
    </div>
  )
}
