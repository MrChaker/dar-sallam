import { useEffect, useState } from 'react'
import { quranApi } from '../utils/api'
import html2pdf from 'html2pdf.js'

const Pdf = ({ page1 }) => {
  const [pdfPages, setPdfPages] = useState([])
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showDownloadPopup, setShowDownloadPopup] = useState(false)
  const [downloadPages, setDownloadPages] = useState({
    from: 1,
    to: 1
  })

  useEffect(() => {
    quranApi.groupAllByPage()
      .then(data => setPdfPages(data))
  }, [])


  const handleDownloadPdf = async () => {
    if (pdfLoading) return;
    setPdfLoading(true)
    const pages = document.querySelectorAll('.page');

    // element.style.display = "block"
    const pdfPromises = [];
    for (let i = 0; i <= pdfPages.length; i = i + 25) {
      const parent = document.createElement("div");
      for (let j = i; j < Math.min(i + 25, pdfPages.length); j++) {
        const page = pages[j];
        if (page) {
          // Clone the node deeply to avoid removing from DOM
          const clone = page.cloneNode(true);
          parent.appendChild(clone);
        }
      }

      const promise = html2pdf()
        .set({
          margin: [0, 0, 0, 0],
          filename: `quran-pages-${i + 1}-${Math.min(i + 25, pdfPages.length)}.pdf`,
          image: { type: 'jpeg', quality: 0.65 },
          html2canvas: {
            scale: 1.1,
            useCORS: true,
            backgroundColor: null,
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
          }
        })
        .from(parent)
        .save()
        .finally(() => {
          parent.remove();
        });

      pdfPromises.push(promise);
    }

    Promise.all(pdfPromises)
      .finally(() => {
        setPdfLoading(false);
      });
  };

  return (
    <>
      <button
        className="pdf-download-button"
        onClick={() => setShowDownloadPopup(true)}
      >
        تحميل
      </button>

      {showDownloadPopup && (
        <div className="pdf-popup-overlay" onClick={() => setShowDownloadPopup(false)}>
          <div
            style={{ direction: "rtl" }}
            className="pdf-download-controls"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="pdf-popup-close"
              onClick={() => setShowDownloadPopup(false)}
              style={{ position: 'absolute', top: '10px', left: '10px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
            >
              ×
            </button>

            <p className="pdf-pages-description">اختر الصفحات للتحميل . الحد الأقصى 50 صفحة</p>

            <div className="pdf-pages-inputs-container">
              <label className="pdf-pages-label">
                من
                <input
                  type="number"
                  min="1"
                  max="604"
                  value={downloadPages.from}
                  onChange={e => setDownloadPages(prev => ({ ...prev, from: Number(e.target.value) }))}
                  className="pdf-pages-input"
                  disabled={pdfLoading}
                  placeholder="من"
                />
              </label>
              <label className="pdf-pages-label">
                إلى
                <input
                  type="number"
                  min="1"
                  max="604"
                  value={downloadPages.to}
                  onChange={e => setDownloadPages(prev => ({ ...prev, to: Number(e.target.value) }))}
                  className="pdf-pages-input"
                  disabled={pdfLoading}
                  placeholder="إلى"
                />
              </label>
            </div>

            <button disabled={pdfLoading} className="pdf-download-button pdf-download-button-full" onClick={handleDownloadPdf}>
              {pdfLoading ? (
                <>
                  جاري إنشاء ملف PDF...
                </>
              ) : <>تحميل PDF</>}
            </button>
          </div>
        </div>
      )}

      <div style={{ position: "absolute", top: "-100000%" }}>
        <div
          className="pdf">
          {pdfPages.map((pageData, pageIndex) => (
            // {pdfPages.slice(downloadPages.from - 1, downloadPages.to).map((pageData, pageIndex) => (
            <div style={{ height: "1122px", display: "flex", alignItems: "center", padding: "0 2.5rem", position: "relative" }} key={pageIndex} className="page">
              <div style={{ position: "absolute", top: "0.5rem", left: "3rem" }}>
                {pageData[Object.keys(pageData)[0]][0].surah.name}
              </div>

              <div style={{ fontSize: "18px", lineHeight: 2.7 }} className='verses'>
                {
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
                                <div className='surah-box' style={{ boxShadow: 'none', border: "none" }}>
                                  {verse.surah.name}
                                </div>
                              }
                              <div className='popup' >
                                <span className="verse-text" style={{ fontSize: "10px" }}>{fatihaVerse}</span>
                              </div>
                              <div key={verse.number} className='verse' >
                                <span className="verse-text">{verse.numberInSurah == 1 ? verse.text.slice(39) : verse.text}</span>
                                <span className="verse-number" style={{ color: 'none' }}>﴿{verse.numberInSurah}﴾</span>
                              </div>
                            </>
                          )
                        })
                      }
                    </>
                  ))
                }
              </div>

              <div style={{ position: "absolute", left: "50%", bottom: "30px", transform: "translateX(-50%)" }}>{pageIndex + 1}</div>
            </div>
          ))}

        </div>
      </div>

    </>

  )
}

export default Pdf