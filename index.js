const { retrieveCarsInformation } = require("./jobs/danawa.js");
const { retrievePostsAndComments } = require("./jobs/doctor-cha.js");
const { retrieveCarTerms } = require("./jobs/terms-naver.js");
const { retrieveGongimTables } = require("./jobs/dsmotors.js");
const {
  createExcelSheet,
  objectToMultipleSheetExcel,
} = require("./lib/helpers.js");

async function run() {
  retrieveCarsInformation().then((result) => {
    createExcelSheet("danawa.xlsx", "다나와 신차정보", result);
  });

  retrievePostsAndComments().then((result) => {
    createExcelSheet("doctor-cha.xlsx", "닥터차 포스트", result);
  });

  retrieveCarTerms().then((result) => {
    createExcelSheet("terms-naver.xlsx", "네이버 사전용어", result);
  });

  retrieveGongimTables().then((result) => {
    objectToMultipleSheetExcel("dsmotors.xlsx", result);
  });
}

run();
