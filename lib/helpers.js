import cheerio from "cheerio";
import xlsx from "xlsx";

export const cleanText = (input) => {
  return input
    .replace(/[\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const createExcelSheet = (fileName, sheetName, data) => {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  xlsx.writeFile(workbook, fileName);
};
