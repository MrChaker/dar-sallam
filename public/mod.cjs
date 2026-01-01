// Note: This script is intended to be run in a Node.js environment because "modifying the file directly" is not possible from within the browser

const fs = require("fs");
const path = require("path");

const mod = async () => {
  const filePath = path.join(__dirname, "quran.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const quranData = JSON.parse(fileContents);

  if (!quranData?.data?.surahs) {
    console.error("Surahs not found in quran.json");
    return;
  }

  quranData.data.surahs.forEach((surah) => {
    if (surah.ayahs && surah.ayahs.length > 0) {
      surah.end_page = surah.ayahs[surah.ayahs.length - 1].page;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(quranData, null, 2), "utf-8");
  console.log("Surahs updated with page field.");
};

mod();
