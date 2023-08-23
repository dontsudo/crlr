const Client = require("../lib/sites/hankyung.com/client");
const logger = require("../lib/logger");
const { createCSVFile } = require("../lib/helpers");

async function runJob() {
  const result = [];
  const hankyung = new Client();

  let page = 1;
  while (true) {
    const startupList = await hankyung.startup.list({
      page,
    });

    if (!startupList || startupList.length === 0) {
      break;
    }

    for (const startup of startupList) {
      const startupDetail = await hankyung.startup.retrieve({
        detailUrl: startup.detailUrl,
      });

      logger.log(startupDetail);
      result.push(startupDetail);
    }
  }

  createCSVFile("스타트업_목록.csv", result);
}

runJob().catch(logger.error);
