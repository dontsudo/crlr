const { retrieveCarsInformation } = require("../jobs/danawa");
const { retrievePostsAndComments } = require("../jobs/doctor-cha");
const { retrieveCarTerms } = require("../jobs/terms-naver");
const { retrieveGongimTables } = require("../jobs/dsmotors");
const { createCSVFile } = require("../lib/helpers");
const logger = require("../lib/logger");

const MAX_RETRIES = 3; // Maximum number of retries for each job

async function retryJob(jobFunction, jobName) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const result = await jobFunction();
      logger.info(`${jobName} 시도: ${retries + 1}`);
      return result;
    } catch (error) {
      logger.error(`${jobName} 실패: ${retries + 1}: ${error}`);
      retries++;
    }
  }

  logger.error(`${jobName} 실패: ${MAX_RETRIES} attempts`);
  return null; // You can handle this case as needed
}

async function runJobs() {
  const danawaResult = await retryJob(
    retrieveCarsInformation,
    "다나와 신차정보"
  );
  if (danawaResult) {
    createCSVFile("다나와.csv", danawaResult);
  }

  const doctorChaResult = await retryJob(
    retrievePostsAndComments,
    "닥터차 게시글 및 댓글"
  );
  if (doctorChaResult) {
    createCSVFile("닥터차.csv", doctorChaResult);
  }
  const termsNaverResult = await retryJob(
    retrieveCarTerms,
    "네이버 자동차 용어사전"
  );
  if (termsNaverResult) {
    createCSVFile("네이버용어사전.csv", termsNaverResult);
  }

  const dsmotorsResult = await retryJob(
    retrieveGongimTables,
    "공임 테이블 리스트"
  );
  if (dsmotorsResult) {
    for (const [key, value] of Object.entries(dsmotorsResult)) {
      createCSVFile(`공임천국_${key}.csv`, value);
    }
  }
}

runJobs().catch(logger.error);
