const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const cleanText = (input) => {
  return input
    .replace(/[\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const createCSVFile = async (csvFilePath, jsonData) => {
  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: Object.keys(jsonData[0]).map((key) => ({ id: key, title: key })),
  });

  return csvWriter.writeRecords(jsonData);
};

module.exports = {
  cleanText,
  createCSVFile,
};
