const xlsx = require("xlsx");

const cleanText = (input) => {
  return input
    .replace(/[\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const createExcelSheet = (fileName, sheetName, data) => {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  xlsx.writeFile(workbook, fileName);
};

const objectToMultipleSheetExcel = (fileName, data) => {
  const workbook = xlsx.utils.book_new();
  for (const [sheetName, sheetData] of Object.entries(data)) {
    const worksheet = xlsx.utils.json_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  xlsx.writeFile(workbook, fileName);
};

module.exports = {
  cleanText,
  createExcelSheet,
  objectToMultipleSheetExcel,
};
