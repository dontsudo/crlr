const axios = require("axios");
const cheerio = require("cheerio");
const { cleanText } = require("../../helpers.js");

class Client {
  #prefixUrl;
  #timeoutMs;
  #axiosInstance;

  constructor(options) {
    this.#prefixUrl = options?.prefixUrl ?? "https://auto.danawa.com";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;

    this.#axiosInstance = axios.create({
      baseURL: this.#prefixUrl,
      timeout: this.#timeoutMs,
    });
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
      try {
        const response = await this.#axiosInstance.post(
          "/newcar/searchAjax.php",
          args.body
        );
        return this.parseCarList(response.data);
      } catch (error) {
        console.error("An error occurred:", error);
        return { data: [] };
      }
    },
  };

  /**
   * @param {string} html
   */
  parseCarList(html) {
    const $ = cheerio.load(html);
    const cars = $(".modelList > li")
      .map((_, el) => {
        const $el = $(el);
        return {
          name: cleanText($el.find(".name").text()),
          price: cleanText($el.find("div:nth-child(1) > div.price").text()),
        };
      })
      .get();

    return { data: cars };
  }
}

module.exports = Client;
