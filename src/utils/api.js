const STORAGE_KEY = "quran-data-v1";

export const quranApi = {
  getByPage: async (pageNumber) => {
    const surahs = await getStoredData();
    const res = [];

    surahs.forEach((surah) => {
      surah.ayahs.forEach((ayah) => {
        if (ayah.page == pageNumber)
          res.push({
            ...ayah,
            surah: {
              number: surah.number,
              name: surah.name,
            },
          });
      });
    });

    return groupBy(res, (item) => item.surah.number);
  },

  groupAllByPage: async () => {
    const surahs = await getStoredData();
    const pages = {};

    surahs.forEach((surah) => {
      // [surahs[0], ...surahs.slice(110, 114)].forEach((surah) => {
      surah.ayahs.forEach((ayah) => {
        pages[ayah.page] = [
          ...(pages[ayah.page] ?? []),
          {
            ...ayah,
            surah: {
              number: surah.number,
              name: surah.name,
            },
          },
        ];
      });
    });

    return Object.keys(pages).map((key) =>
      groupBy(pages[key], (item) => item.surah.number)
    );
  },

  search: async (query) => {
    const surahs = await getStoredData();
    const results = [];
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
    return results;
  },

  getSurahs: async () => {
    const surahs = await getStoredData();
    const results = [];
    surahs.forEach((surah) => {
      results.push({
        name: surah.name,
        page: surah.ayahs[0].page,
      });
    });
    return results;
  },
};

const getStoredData = async () => {
  let data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const res = await fetch(`/quran.json`);
    data = (await res.json()).data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } else {
    data = JSON.parse(data);
  }
  if (!data) return { text: "NETWORK ERROR" };
  const { surahs } = data;
  return surahs;
};

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
