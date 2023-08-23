const axios = require("axios");
const cheerio = require("cheerio");
const { cleanText } = require("../../helpers.js");

// 탭 이름은 하드코딩하여 매핑하도록 함.
// (때로는 하드코딩이 정신건강에 좋다.)
const TAB_NAMES = [
  // 국산차 26개
  "국산차공임.엔진오일",
  "국산차공임.미션오일",
  "국산차공임.배터리",
  "국산차공임.브레이크",
  "국산차공임.부동액",
  "국산차공임.파워오일",
  "국산차공임.연료필터",
  "국산차공임.에어컨가스",
  "국산차공임.타이밍벨트",
  "국산차공임.쇼바교체",
  "국산차공임.외부벨트",
  "국산차공임.점화계통",
  "국산차공임.에어컨,히터",
  "국산차공임.일반점검",
  "국산차공임.정밀점검 A,B",
  "국산차공임.고장 정밀점검",
  "국산차공임.시동모터",
  "국산차공임.발전기",
  "국산차공임.범퍼,휀다",
  "국산차공임.소음기",
  "국산차공임.등속조인트",
  "국산차공임.로어암",
  "국산차공임.블랙박스",
  "국산차공임.마운트 미미",
  "국산차공임.스테빌라이저",
  "국산차공임.사이드미러",
  // 수입차 8개
  "수입차공임.엔진오일",
  "수입차공임.미션오일",
  "수입차공임.배터리",
  "수입차공임.브레이크",
  "수입차공임.부동액",
  "수입차공임.파워오일",
  "수입차공임.에어컨,히터필터",
  "수입차공임.스캔진단",
  // 타이어 1개
  "타이어공임",
];

class Client {
  #prefixUrl;
  #timeoutMs;
  #axiosInstance;

  constructor(options) {
    this.#prefixUrl = options?.prefixUrl ?? "http://dsmotors.co.kr";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;

    this.#axiosInstance = axios.create({
      baseURL: this.#prefixUrl,
      timeout: this.#timeoutMs,
    });
  }

  wages = {
    /**
     * retrieve list of wages
     */
    retrieve: async () => {
      const result = {};
      const paths = [
        "/guide/guide1.php",
        "/guide/guide2.php",
        "/guide/guide3.php",
      ];

      let index = 0;
      for (const path of paths) {
        const response = await this.#axiosInstance.get(this.#prefixUrl + path, {
          timeout: this.#timeoutMs,
        });
        const $ = cheerio.load(response.data);

        $(".guidebox").each((_, el) => {
          const $el = $(el);
          result[TAB_NAMES[index++]] = cleanText($el.html());
        });
      }

      return { data: result };
    },
  };
}

module.exports = Client;
