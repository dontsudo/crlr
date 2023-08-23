const axios = require("axios");
const { listPosts, retrievePost } = require("./endpoint.js");

class Client {
  #prefixUrl;
  #timeoutMs;
  #axiosInstance;

  constructor(options) {
    this.#prefixUrl =
      options?.prefixUrl ?? "https://api.doctor-cha.com/graphql";
    this.#timeoutMs = options?.timeoutMs ?? 60_000;

    this.#axiosInstance = axios.create({
      baseURL: this.#prefixUrl,
      timeout: this.#timeoutMs,
    });
  }

  posts = {
    /**
     * retrieve list of posts
     *
     * @param {object} args
     * @param {object} args.variables
     * @param {string | number} args.variables.first
     * @param {string | number} args.variables.after
     */
    list: async (args) => {
      const response = await this.#axiosInstance({
        method: listPosts.method,
        url: this.#prefixUrl,
        data: {
          query: listPosts.query,
          variables: {
            ...args.variables,
            filter: {
              vehicleModels: [],
              withComment: true,
            },
          },
        },
        timeout: this.#timeoutMs,
      });

      const data = response.data?.data;

      return {
        data: {
          pageInfo: data?.communityPostConnection?.pageInfo,
          posts: data?.communityPostConnection?.edges.map((edge) => edge.node),
        },
      };
    },

    /**
     * retrieve a post
     *
     * @param {object} args
     * @param {object} args.variables
     * @param {string | number} args.variables.postId
     */
    retrieve: async (args) => {
      const response = await this.#axiosInstance({
        method: retrievePost.method,
        url: this.#prefixUrl,
        data: {
          query: retrievePost.query,
          variables: {
            ...args.variables,
            filter: {
              type: "LIKE",
            },
            loggedIn: false,
          },
        },
        timeout: this.#timeoutMs,
      });

      const data = response.data?.data;

      return {
        data: {
          post: data?.post,
          comments: data?.post?.commentConnection?.edges.map(
            (edge) => edge.node
          ),
        },
      };
    },
  };
}

module.exports = Client;
