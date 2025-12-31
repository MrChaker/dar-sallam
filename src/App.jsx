import { useState, useEffect } from 'react'
import './App.css'
import { quranApi } from './utils/api'
import { Search } from './components/search'

function App() {
  const [pageNumber, setPageNumber] = useState(2)
  const [pageData, setPageData] = useState(null)
  const [page1, setPage1] = useState(null)
  const [fatihaActive, setFatihaActive] = useState(true)
  const [highlightedVerse, setHighlightedVerse] = useState(null)

  useEffect(() => {
    quranApi.getAll()

    quranApi.getByPage(pageNumber)
      .then((data) => setPageData(data))
    quranApi.getByPage(1)
      .then((data) => setPage1(data))
  }, [pageNumber])

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
        <Search setPageNumber={setPageNumber} setHighlightedVerse={setHighlightedVerse} />

        <div className="verses">
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
                        <div key={verse.number} className="verse"
                          style={{
                            color: highlightedVerse == verse.number ? "red" : undefined
                          }}>
                          <span className="verse-text">{verse.numberInSurah == 1 ? verse.text.slice(40) : verse.text}</span>
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

      <footer className="footer">
        <p>دار السلام</p>
      </footer>
    </div>
  )
}

export default App
