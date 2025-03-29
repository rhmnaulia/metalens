import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(url: string | null | undefined) {
  if (!url) return 'Not found'

  try {
    new URL(url)
    return url
  } catch {
    return url
  }
}
