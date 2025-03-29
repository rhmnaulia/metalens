'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

export function CopyButton({
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

export function CopyAllButton({
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
