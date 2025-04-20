'use client'

interface MetadataGridProps {
  children: React.ReactNode
  className?: string
}

export function MetadataGrid({ children, className = '' }: MetadataGridProps) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 items-start ${className}`}>
      {children}
    </div>
  )
}
