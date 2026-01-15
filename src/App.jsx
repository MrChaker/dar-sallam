import { useState, useEffect, useRef } from 'react'
import './App.css'
import { quranApi } from './utils/api'
import Sidebar from './components/sidebar'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

function App() {
  const [pageNumber, setPageNumber] = useState(localStorage.getItem("pageNumber") ?? 2)
  const [pageData, setPageData] = useState(null)
  const [page1, setPage1] = useState(null)
  const [fatihaActive, setFatihaActive] = useState(true)
  const [highlightedVerse, setHighlightedVerse] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const versesRef = useRef(null)

  useEffect(() => {
    localStorage.setItem("pageNumber", pageNumber)
    quranApi.getByPage(pageNumber)
      .then((data) => setPageData(data))
    quranApi.getByPage(1)
      .then((data) => setPage1(data))
  }, [pageNumber])

  useEffect(() => {
    const adjustFontSize = () => {
      const versesDiv = versesRef.current
      if (!versesDiv || !pageData || window.innerWidth > 768) return

      // Set container height to 100vh
      versesDiv.style.height = '90vh'
      versesDiv.style.maxHeight = '90vh'

      // Reset to initial font size
      versesDiv.style.fontSize = '0.95rem'

      // Wait for DOM to update
      setTimeout(() => {
        let fontSize = parseFloat(window.getComputedStyle(versesDiv).fontSize)
        const containerHeight = versesDiv.clientHeight

        // Check if content overflows and adjust font size
        // Keep reducing font size until content fits or we reach minimum
        while (versesDiv.scrollHeight > containerHeight && fontSize > 0.8) {
          fontSize -= 0.05
          versesDiv.style.fontSize = `${fontSize}rem`
        }
      }, 100)
    }

    // Adjust font size when page data changes
    if (pageData) {
      adjustFontSize()
    }

    // Adjust font size on window resize
    const resizeObserver = new ResizeObserver(() => {
      adjustFontSize()
    })

    if (versesRef.current) {
      resizeObserver.observe(versesRef.current)
    }

    window.addEventListener('resize', adjustFontSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', adjustFontSize)
    }
  }, [pageData, fatihaActive])

  const goToNextPage = () => {
    if (pageNumber < 604) {
      setPageNumber(pageNumber + 1)
    }
  }

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const goToPage = (page) => {
    const pageNum = parseInt(page)
    if (pageNum >= 1 && pageNum <= 604) {
      setPageNumber(pageNum)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm p-2 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Search className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextPage}
            disabled={pageNumber === 604}
            className="h-6 w-6"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-row-reverse items-center gap-1">
            <span className="text-xs text-foreground">/ 604</span>
            <Input
              min="1"
              max="604"
              value={pageNumber}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              className="w-12 text-center py-1 px-2"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousPage}
            disabled={pageNumber === 1}

            className="h-6 w-6"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        fatihaActive={fatihaActive}
        setFatihaActive={setFatihaActive}
        setPageNumber={setPageNumber}
        setHighlightedVerse={setHighlightedVerse}
      />

      <div className="quran-page ">
        <div className="verses" ref={versesRef}>
          {page1 && pageData &&
            Object.keys(pageData).map((surah) => (
              <>
                {
                  pageData[surah].map((verse) => {
                    const verseNumber = verse.numberInSurah
                    const fatihaVerse = page1['1'][(verseNumber - 1) % page1['1'].length].text
                    return (
                      <>
                        {
                          verse.numberInSurah == 1 &&
                          <div className='surah-box'>
                            {verse.surah.name}
                          </div>
                        }
                        {
                          fatihaActive &&
                          <div className='popup'>
                            <span className="verse-text">{fatihaVerse}</span>
                          </div>
                        }
                        <div key={verse.number} className={`verse ${highlightedVerse == verse.number ? 'highlighted' : ''}`}>
                          <span className="verse-text">{verse.numberInSurah == 1 ? verse.text.slice(39) : verse.text}</span>
                          <span className="verse-number">﴿{verse.numberInSurah}﴾</span>
                        </div>
                      </>
                    )
                  })
                }
              </>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App
