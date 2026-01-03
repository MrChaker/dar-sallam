import { useState, useEffect } from 'react'
import './App.css'
import { quranApi } from './utils/api'
import { Search } from './components/search'
import SurahSelector from './components/surah-selector'

function App() {
  const [pageNumber, setPageNumber] = useState(localStorage.getItem("pageNumber") ?? 2)
  const [pageData, setPageData] = useState(null)
  const [page1, setPage1] = useState(null)
  const [fatihaActive, setFatihaActive] = useState(true)
  const [highlightedVerse, setHighlightedVerse] = useState(null)


  useEffect(() => {
    localStorage.setItem("pageNumber", pageNumber)
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
      <div className="header">
        <div className='header-container'>
          {/* <Pdf page1={page1} /> */}

          <a href="https://drive.google.com/file/d/1yBEwe5uSxYJPz8f1WKoZu1LcLldEGTX0/view" style={{ textDecoration: "none", color: "inherit" }}>
            <button className="pdf-download-button" >تحميل</button>
          </a>


          <div className="navigation">
            <button onClick={goToPreviousPage} disabled={pageNumber === 1}>
              السابق
            </button>
            <div className="page-selector">
              <input
                type="number"
                min="1"
                max="604"
                value={pageNumber}
                onChange={(e) => goToPage(e.target.value)}
              />
              <span>/ 604</span>
            </div>
            <button onClick={goToNextPage} disabled={pageNumber === 604}>
              التالي
            </button>
          </div>
        </div>
      </div>
      <div className="fatiha-toggle-container">
        <label className="fatiha-toggle-label">
          <input
            type="checkbox"
            className="fatiha-toggle-checkbox"
            checked={fatihaActive}
            onChange={() => setFatihaActive(!fatihaActive)}
          />
          تفعيل ايات الفاتحة
        </label>
      </div>


      <div className="quran-page">

        <div className="filters">
          <Search setPageNumber={setPageNumber} setHighlightedVerse={setHighlightedVerse} />
          <SurahSelector setPageNumber={setPageNumber} />
        </div>

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

      <footer className="footer">
        <p>دار السلام</p>
      </footer>
    </div>
  )
}

export default App
