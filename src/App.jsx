import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pageNumber, setPageNumber] = useState(2)
  const [pageData, setPageData] = useState(null)
  const [page1, setPage1] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fatihaActive, setFatihaActive] = useState(true)


  useEffect(() => {
    fetchPage(pageNumber)
      .then((data) => setPageData(data))
    fetchPage(1)
      .then((data) => setPage1(data))
  }, [pageNumber])

  const fetchPage = async (page) => {
    setLoading(true)
    setError(null)
    try {
      // Using Quran.com API - a trusted source
      const response = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?page_number=${page}`)
      const data = await response.json()
      setLoading(false)
      return data
    } catch (err) {
      setError('Failed to load Quran page')
      setLoading(false)
    }
  }

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
    <div className="app">
      <header className="header">
        <h1>القرآن الكريم</h1>
        <p>The Holy Quran</p>
      </header>

      <div className="navigation">
        <button onClick={goToPreviousPage} disabled={pageNumber === 1}>
          السابق
        </button>
        <div className="page-selector">
          <label>الصفحة: </label>
          <input
            type="number"
            min="1"
            max="604"
            value={pageNumber}
            onChange={(e) => goToPage(e.target.value)}
          />
          <span> / 604</span>
        </div>
        <button onClick={goToNextPage} disabled={pageNumber === 604}>
          التالي
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "1rem 0" }}>
        <label style={{ fontSize: "1rem", fontWeight: 600, marginRight: "0.5rem" }}>
          <input
            type="checkbox"
            checked={fatihaActive}
            onChange={() => setFatihaActive(!fatihaActive)}
            style={{ marginRight: "0.3rem" }}
          />
          تفعيل ايات الفاتحة
        </label>
      </div>

      <div className="quran-page">
        <div className="verses">
          {page1 && page1.verses && pageData && pageData.verses &&
            pageData.verses.map((verse, idx) => {
              const verseNumber = verse.verse_key.split(":").pop()
              const fatihaVerse = page1.verses[(verseNumber - 1) % page1.verses.length].text_uthmani
              return (
                <div onMouseEnter={() => setHoveredVerse(verse.verse_key)} onMouseOut={() => setHoveredVerse(null)} key={verse.id} className="verse">
                  {
                    fatihaActive &&
                    <div onMouseEnter={() => setHoveredVerse(verse.verse_key)} className='popup'>
                      <span className="verse-text">{fatihaVerse}</span>
                    </div>
                  }
                  <span className="verse-text">{verse.text_uthmani}</span>
                  <span className="verse-number">﴿{verse.verse_key.split(":").pop()}﴾</span>
                </div>
              )
            })}
        </div>
      </div>

      <footer className="footer">
        <p>دار السلام</p>
      </footer>
    </div>
  )
}

export default App
