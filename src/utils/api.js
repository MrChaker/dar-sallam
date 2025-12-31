import axios from "axios";

const api = axios.create({
  baseURL: "https://alquran.api.islamic.network/v1",
});

// Initialize the client
export const quranApi = {
  getAll: async () => {
    const data = localStorage.getItem("quran-data");
    if (data) return data;
    const response = await api.get(`/quran/ar`);
    localStorage.setItem("quran-data", JSON.stringify(response.data.data));
  },
  getByPage: async (pageNumber) => {
    const response = await api.get(`/page/${pageNumber}`);
    return groupBy(response.data.data.ayahs, (item) => item.surah.number);
  },

  search: async (query) => {
    // const response = await api.get(`/search/${query}`);
    const data = localStorage.getItem("quran-data");
    if (!data) return [];
    const results = [];
    const { surahs } = JSON.parse(data);
    surahs.forEach((surah) => {
      surah.ayahs.forEach((ayah) => {
        if (
          ayah.text.includes(query) ||
          removeArabicTashkeel(ayah.text).includes(query)
        ) {
          results.push({
            ...ayah,
            surah: surah.name,
          });
        }
      });
    });
    console.log(results);

    return results;
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

function removeArabicTashkeel(word) {
  // Regex pattern to match Arabic diacritical marks (tashkeel)
  // Range includes Fathatan, Dammatan, Kasratan, Fatha, Damma, Kasra, Shadda, Sukun, etc.
  const tashkeel_pattern =
    /[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED]/g;

  // Replace all occurrences of tashkeel with an empty string
  return word.replace(tashkeel_pattern, "").replace("ٱ", "ا");
}
