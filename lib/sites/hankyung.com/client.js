const axios = require("axios");
const cheerio = require("cheerio");
const { cleanText } = require("../../helpers");
const logger = require("../../logger");

class Client {
  /** @type {import("axios").AxiosInstance} */
  #fetcher;
  #prefixUrl;
  #timeoutMs;

  constructor(options) {
    this.#prefixUrl = options?.prefixUrl ?? "https://www.hankyung.com";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;

    this.#fetcher = axios.create({
      baseURL: this.#prefixUrl,
      timeout: this.#timeoutMs,
    });
  }

  startup = {
    /**
     * retrieve list of startup
     */
    list: async ({ page }) => {
      try {
        const startupList = [];
        const r = await this.#fetcher.get("/geeks/startupdb", {
          params: {
            page,
          },
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;" +
              "q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          },
        });

        const $ = cheerio.load(r.data);

        $(".startup-db-list > li").each((_, el) => {
          const $name = $(el).find(".startup-name > a");
          startupList.push({
            name: cleanText($name.text()),
            detailUrl: $name.attr("href"),
          });
        });

        return startupList;
      } catch (error) {
        logger.error(error);

        return [];
      }
    },

    retrieve: async ({ detailUrl }) => {
      const data = {};
      const r = await this.#fetcher.get(detailUrl, {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;" +
            "q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        },
      });

      const $ = cheerio.load(r.data);

      data["회사명"] = cleanText($(".startup-company > div.name").text());

      $(".item-row > dl").each((_, el) => {
        const $dl = $(el);
        const key = cleanText($dl.find("dt").text());
        const value = cleanText($dl.find("dd").text());

        data[key] = value;
      });

      return data;
    },
  };
}

module.exports = Client;
