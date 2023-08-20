import { retrieveCarsInformation } from "./jobs/danawa.js";
import { retrievePostsAndComments } from "./jobs/doctor-cha.js";
import { retrieveCarTerms } from "./jobs/terms-naver.js";
import { createExcelSheet } from "./lib/helpers.js";

async function bootstrap() {
  retrieveCarsInformation().then((result) => {
    createExcelSheet("danawa.xlsx", "다나와 신차정보", result);
  });

  retrievePostsAndComments().then((result) => {
    createExcelSheet("doctor-cha.xlsx", "닥터차 포스트", result);
  });

  retrieveCarTerms().then((result) => {
    createExcelSheet("terms-naver.xlsx", "네이버 사전용어", result);
  });
}

bootstrap();
