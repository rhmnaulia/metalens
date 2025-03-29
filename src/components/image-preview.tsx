import Image from 'next/image'

interface ImagePreviewProps {
  src?: string
  alt: string
}

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  if (!src) {
    return (
      <div className='flex flex-col items-center justify-center h-48 bg-muted rounded-lg animate-scale-in'>
        <p className='text-sm text-muted-foreground'>No image available</p>
      </div>
    )
  }

  return (
    <div className='animate-scale-in hover-scale'>
      <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
        <Image
          src={src}
          alt={alt}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
    </div>
  )
}
