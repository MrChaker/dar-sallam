import axios from "axios";

const api = axios.create({
  baseURL: "https://alquran.api.islamic.network/v1",
});

// Initialize the client
export const quranApi = {
  // getByPage: async (pageNumber) => {
  //   const pageVerses = await axios.get(
  //     "https://api.quran.com/api/v4/quran/verses/uthmani",
  //     {
  //       params: {
  //         page_number: pageNumber,
  //       },
  //     }
  //   );
  //   const mapped = pageVerses.data.verses.map(async (verse) => {
  //     const [surahId, verseId] = verse.verse_key.split(":");
  //     const surah = await quranApi.getSurah(surahId);
  //     return {
  //       surah: {
  //         id: surahId,
  //         name: surah.name,
  //       },
  //       verse: {
  //         id: verseId,
  //         text: verse.text_uthmani,
  //       },
  //     };
  //   });
  //   return groupBy(mapped, (item) => item.surah.id);
  // },
  getByPage: async (pageNumber) => {
    const response = await api.get(`/page/${pageNumber}`);

    return groupBy(response.data.data.ayahs, (item) => item.surah.number);
  },
  getSurah: async (id) => {
    const response = await api.get(`/surah/${id}`);
    return response.data;
  },
};

/**
 * Groups an array of items by a key callback.
 * @param {Array} arr - Array to group
 * @param {Function} keyFn - Function that returns the key for grouping
 * @returns {Object} - Grouped object
 *
 * Example:
 *   groupBy([{a:1, g:"x"}, {a:2, g:"y"}, {a:3, g:"x"}], item => item.g)
 *   // returns { x: [{a:1, g:"x"}, {a:3, g:"x"}], y: [{a:2, g:"y"}] }
 */
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}
