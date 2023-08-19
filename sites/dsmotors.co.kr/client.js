import axios from "axios";
import cheerio from "cheerio";

import { cleanText } from "../../lib/helpers.js";

class Client {
  #prefixUrl;
  #timeoutMs;

  constructor(options) {
    this.#prefixUrl = options?.prefixUrl ?? "http://dsmotors.co.kr";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;
  }

  wages = {
    /**
     * retrieve list of wages
     */
    retrieve: async () => {
      const response = await axios.get(this.#prefixUrl + "/guide/guide1.php", {
        timeout: this.#timeoutMs,
      });
      const $ = cheerio.load(response.data);

      const wages = $(".tab_content > .guidebox > table")
        .map((_, el) => {
          const $el = $(el);
          return cleanText($el.html());
        })
        .get();

      return { data: wages };
    },
  };
}

export default Client;
