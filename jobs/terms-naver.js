const TermsNaver = require("../lib/sites/terms.naver.com/client.js");
const logger = require("../lib/logger.js");

const retrieveCarTerms = async () => {
  const termsnaver = new TermsNaver();
  const result = [];

  try {
    let page = 1;
    while (true) {
      const { data: termsList } = await termsnaver.terms.list({
        params: {
          page,
          categoryId: "42330",
          cid: "42330",
        },
      });

      if (!termsList || termsList.length === 0) {
        break;
      }

      for (const { url } of termsList) {
        const termUrl = new URL(url);
        const { data: termData } = await termsnaver.terms.retrieve({
          params: termUrl.searchParams,
        });

        result.push({
          title: termData.title,
          description: termData.description,
        });

        logger.info(
          `네이버 용어 수집 중...: ${termUrl.searchParams.get("docId")}`
        );
      }

      page++;
    }
  } catch (error) {
    logger.error("An error occurred:", error);
  }

  return result;
};

module.exports = { retrieveCarTerms };
