import { useState, useEffect } from 'react'
import { quranApi } from '../utils/api'
import { Input } from './ui/input'
import { cn } from '../lib/utils'

export const Search = ({
  setPageNumber,
  setHighlightedVerse,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    setSearchLoading(true)
    setSearchError(null)

    const timeoutId = setTimeout(async () => {
      try {
        const results = await quranApi.search(searchQuery)
        setSearchResults(results || [])
      } catch (error) {
        setSearchError(error.message || 'Failed to search')
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <div className={cn("w-full space-y-2", className)}>
      <Input
        type="text"
        placeholder="ابحث عن آية أو كلمة..."
        value={searchQuery || ""}
        onChange={(e) => setSearchQuery(e.target.value)}
        dir="rtl"
        className="w-full"
      />
      {searchLoading && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          جاري البحث...
        </div>
      )}
      {searchError && (
        <div className="p-4 text-center text-sm text-destructive">
          {searchError}
        </div>
      )}
      {!searchLoading && !searchError && searchResults.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto border border-border rounded-md bg-background">
          {searchResults.map((result, index) => (
            <div
              onClick={() => {
                setPageNumber(result.page)
                setHighlightedVerse(result.number)
                setSearchQuery("")
              }}
              key={index}
              className="p-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent transition-colors"
            >
              {result.text && (
                <div className="text-sm font-medium text-foreground mb-1">
                  {result.text}
                </div>
              )}
              {result.surah && result.number && (
                <div className="text-xs text-muted-foreground">
                  {result.surah} - آية {result.numberInSurah}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
