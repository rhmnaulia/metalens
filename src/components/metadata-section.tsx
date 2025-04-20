'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CopyAllButton } from '@/components/copy-button'

interface MetadataSectionProps {
  title: string
  description: string
  data: Record<string, string | undefined>
  children: React.ReactNode
}

export function MetadataSection({
  title,
  description,
  data,
  children,
}: MetadataSectionProps) {
  return (
    <Card className='card-hover'>
      <CardHeader>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 space-y-1 text-left'>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <CopyAllButton data={data} title={title} />
        </div>
      </CardHeader>
      <CardContent className='space-y-6 text-left'>{children}</CardContent>
    </Card>
  )
}
