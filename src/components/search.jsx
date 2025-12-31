import React from 'react'
import { useState, useEffect } from 'react'
import { quranApi } from '../utils/api'
import './search.css'

export const Search = ({
  setPageNumber,
  setHighlightedVerse
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
    }, 500) // 500ms debounce delay

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <div className='search'>
      <input
        type="text"
        placeholder="ابحث عن آية أو كلمة..."
        value={searchQuery || ""}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchLoading && <div className="search-loading">جاري البحث...</div>}
      {searchError && <div className="search-error">{searchError}</div>}
      {!searchLoading && !searchError && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result, index) => (
            <div onClick={() => {
              setPageNumber(result.page)
              setHighlightedVerse(result.number)
              setSearchQuery("")
            }} key={index} className="search-result-item">
              {result.text && <div className="verse-text">{result.text}</div>}
              {result.surah && result.number && (
                <div className="search-result-surah-info">
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
