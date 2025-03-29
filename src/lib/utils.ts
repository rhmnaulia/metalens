import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(url: string | null) {
  if (!url) return 'Not found'
  try {
    const urlObj = new URL(url)
    return urlObj.toString()
  } catch {
    return url
  }
}
