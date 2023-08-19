import axios from "axios";
import cheerio from "cheerio";

import { cleanText } from "../../lib/helpers.js";

class Client {
  #prefixUrl;
  #timeoutMs;

  constructor(options) {
    this.#prefixUrl = options?.prefixUrl ?? "https://terms.naver.com";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;
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
      const response = await axios.get(
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
      const response = await axios.get(
        this.#prefixUrl + "/list.naver",
        {
          params: args.params,
        },
        {
          timeout: this.#timeoutMs,
        }
      );
      const $ = cheerio.load(response.data);

      const page = $("#paginate > strong").text().trim();
      if (page !== args.params.page.toString()) {
        return { data: [] };
      }

      const terms = $(".content_list > li")
        .map((_i, el) => {
          const $el = $(el);

          return {
            title: cleanText(
              $el.find("strong.title > a:nth-child(1)").text().trim()
            ),
            url: cleanText(
              this.#prefixUrl + $el.find(".title > a").attr("href")
            ),
            description: cleanText($el.find(".desc").text().trim()),
          };
        })
        .get();

      return { data: terms };
    },
  };
}

export default Client;
