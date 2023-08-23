const { retrieveCarsInformation } = require("./jobs/danawa.js");
const { retrievePostsAndComments } = require("./jobs/doctor-cha.js");
const { retrieveCarTerms } = require("./jobs/terms-naver.js");
const { retrieveGongimTables } = require("./jobs/dsmotors.js");
const {
  createExcelSheet,
  objectToMultipleSheetExcel,
} = require("./lib/helpers.js");

const MAX_RETRIES = 3; // Maximum number of retries for each job

async function retryJob(jobFunction, jobName) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const result = await jobFunction();
      console.log(`${jobName} succeeded on attempt ${retries + 1}`);
      return result;
    } catch (error) {
      console.error(`${jobName} failed on attempt ${retries + 1}: ${error}`);
      retries++;
    }
  }

  console.error(`${jobName} failed after ${MAX_RETRIES} attempts`);
  return null; // You can handle this case as needed
}

async function runJobs() {
  const danawaResult = await retryJob(
    retrieveCarsInformation,
    "retrieveCarsInformation"
  );
  if (danawaResult) {
    createExcelSheet("danawa.xlsx", "다나와 신차정보", danawaResult);
  }

  const doctorChaResult = await retryJob(
    retrievePostsAndComments,
    "retrievePostsAndComments"
  );
  if (doctorChaResult) {
    createExcelSheet("doctor-cha.xlsx", "닥터차 포스트", doctorChaResult);
  }

  const termsNaverResult = await retryJob(retrieveCarTerms, "retrieveCarTerms");
  if (termsNaverResult) {
    createExcelSheet("terms-naver.xlsx", "네이버 사전용어", termsNaverResult);
  }

  const dsmotorsResult = await retryJob(
    retrieveGongimTables,
    "retrieveGongimTables"
  );
  if (dsmotorsResult) {
    objectToMultipleSheetExcel("dsmotors.xlsx", dsmotorsResult);
  }
}

runJobs();
