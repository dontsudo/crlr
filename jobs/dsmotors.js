const { CheerioTableParser } = require("html-tables-to-json");
const Dsmotors = require("../lib/sites/dsmotors.co.kr/client.js");

const retrieveGongimTables = async () => {
  const result = {};

  const dsmotors = new Dsmotors();
  const parser = new CheerioTableParser();

  try {
    const { data } = await dsmotors.wages.retrieve();

    for (const [name, html] of Object.entries(data))
      result[name] = parser.parse(html)[0];
  } catch (error) {
    console.error("An error occurred:", error);
  }

  return result;
};

module.exports = { retrieveGongimTables };
