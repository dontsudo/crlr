import axios from "axios";
import cheerio from "cheerio";

import { cleanText } from "../../lib/helpers.js";

class Client {
  #prefixUrl;
  #timeoutMs;

  constructor(options) {
    this.#prefixUrl = options?.prefixUrl ?? "https://auto.danawa.com";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;
  }

  /**
   * Danawa sites endpoints
   */
  cars = {
    /**
     * retrieve list of cars
     *
     * @param {object} args
     * @param {object} args.body
     */
    list: async (args) => {
      const response = await axios.post(
        this.#prefixUrl + "/newcar/searchAjax.php",
        args.body,
        {
          timeout: this.#timeoutMs,
        }
      );
      const $ = cheerio.load(response.data);

      const cars = $(".modelList > li")
        .map((_, el) => {
          const $el = $(el);
          return {
            name: cleanText($el.find(".name").text().trim()),
            price: cleanText(
              $el.find("div:nth-child(1) > div.price").text().trim()
            ),
          };
        })
        .get();

      return { data: cars };
    },
  };
}

export default Client;
