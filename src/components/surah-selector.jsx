import { useState, useEffect } from 'react'
import { quranApi } from '../utils/api'
import { Select } from './ui/select'
import { cn } from '../lib/utils'

const SurahSelector = ({ setPageNumber, className }) => {
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
    <Select
      onChange={handleSurahChange}
      dir="rtl"
      className={cn("w-full", className)}
    >
      <option value="">السور</option>
      {surahs.map((surah, i) => (
        <option key={i} value={surah.i}>
          {i + 1}. {surah.name}
        </option>
      ))}
    </Select>
  )
}

export default SurahSelector
