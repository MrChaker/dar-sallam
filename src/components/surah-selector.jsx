import { useState, useEffect } from 'react'
import { quranApi } from '../utils/api'
import './surah-selector.css'

const SurahSelector = ({ setPageNumber }) => {
  const [surahs, setSurahs] = useState([])

  useEffect(() => {
    const fetchSurahs = async () => {
      const surahsList = await quranApi.getSurahs()
      setSurahs(surahsList || [])
    }

    fetchSurahs()
  }, [])

  const handleSurahChange = (e) => {
    const surahNumber = e.target.value

    if (surahNumber) {
      const selected = surahs[parseInt(surahNumber) - 1]
      if (selected && setPageNumber) {
        setPageNumber(selected.page)
      }
    }
  }

  return (
    <select
      className="surah-selector"
      onChange={handleSurahChange}
    >
      <option value="">السورة</option>
      {surahs.map((surah, i) => (
        <option key={i} value={surah.i}>
          {i + 1}. {surah.name}
        </option>
      ))}
    </select>
  )
}

export default SurahSelector