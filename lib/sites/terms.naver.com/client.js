const axios = require("axios");
const cheerio = require("cheerio");
const { cleanText } = require("../../helpers.js");

class Client {
  #prefixUrl;
  #timeoutMs;
  #axiosInstance;

  constructor(options) {
    this.#prefixUrl = options?.prefixUrl ?? "https://terms.naver.com";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;
    this.#axiosInstance = axios.create({
      baseURL: this.#prefixUrl,
      timeout: this.#timeoutMs,
    });
  }

  /**
   * terms naver sites endpoints
   */
  terms = {
    /**
     * retrieve term
     *
     * @param {object} args
     * @param {object} args.params
     * @param {string | number} args.params.docId
     * @param {string | number} args.params.cid
     * @param {string | number} args.params.categoryId
     */
    retrieve: async (args) => {
      const response = await this.#axiosInstance.get(
        this.#prefixUrl + "/entry.naver",
        {
          params: args.params,
        },
        {
          timeout: this.#timeoutMs,
        }
      );
      const $ = cheerio.load(response.data);

      const term = {
        title: cleanText($(".headword").text().trim()),
        description: cleanText($(".size_ct_v2").text().trim()),
      };

      return { data: term };
    },

    /**
     * retrieve list of terms
     *
     * @param {object} args
     * @param {object} args.params
     * @param {string | number} args.params.cid
     * @param {string | number} args.params.categoryId
     * @param {string | number} args.params.page
     */
    list: async (args) => {
      const response = await this.#axiosInstance.get("/list.naver", {
        params: args.params,
      });
      const $ = cheerio.load(response.data);

      const page = $("#paginate > strong").text().trim();
      if (page !== args.params.page.toString()) {
        return { data: [] };
      }

      const termElements = $(".content_list > li");
      const termPromises = termElements
        .map(async (_i, el) => {
          const $el = $(el);
          const title = cleanText(
            $el.find("strong.title > a:nth-child(1)").text()
          );
          const url = cleanText(
            this.#prefixUrl + $el.find(".title > a").attr("href")
          );
          const description = cleanText($el.find(".desc").text());

          return { title, url, description };
        })
        .get();

      // good or bad?
      const terms = await Promise.all(termPromises);

      return { data: terms };
    },
  };
}

module.exports = Client;
