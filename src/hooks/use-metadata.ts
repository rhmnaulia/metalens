import { useMutation } from '@tanstack/react-query'

const validateUrl = (url: string): string | null => {
  if (!url) {
    return 'Please enter a URL'
  }

  try {
    const urlObj = new URL(url)
    if (!urlObj.protocol.startsWith('http')) {
      return 'URL must start with http:// or https://'
    }
    return null
  } catch {
    return 'Please enter a valid URL (e.g., https://example.com)'
  }
}

export function useMetadata() {
  const {
    mutate: checkMetadata,
    data: metadata,
    error,
    isPending,
  } = useMutation({
    mutationFn: async (url: string) => {
      const validationError = validateUrl(url)
      if (validationError) {
        throw new Error(validationError)
      }

      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch metadata')
      }

      return response.json()
    },
    onError: (error) => {
      console.error('Error fetching metadata:', error)
    },
  })

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
      ? 'An unexpected error occurred. Please try again.'
      : null

  return {
    checkMetadata,
    metadata,
    errorMessage,
    isPending,
  }
}
