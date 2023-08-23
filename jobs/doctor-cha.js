const DoctorCha = require("../lib/sites/doctor-cha.com/client.js");
const logger = require("../lib/logger.js");

const retrievePostsAndComments = async () => {
  const doctorcha = new DoctorCha();
  const result = [];

  try {
    let hasNextPage = true;
    let nextCursor = undefined;

    while (hasNextPage) {
      const { data: postsList } = await doctorcha.posts.list({
        variables: {
          first: 20,
          after: nextCursor,
        },
      });

      if (!postsList || postsList.posts.length === 0) {
        break;
      }

      for (const post of postsList.posts) {
        const id = post.id; // Make sure the property is named correctly
        const { data: postData } = await doctorcha.posts.retrieve({
          variables: {
            postId: id,
          },
        });

        const { title, author, body } = postData.post || {};

        if (postData.comments.length === 0) {
          result.push({
            title,
            author: author?.nickname,
            body,
            comment: "", // Set an empty string for missing comment
          });
        } else {
          postData.comments.forEach((comment) => {
            result.push({
              title,
              author: author?.nickname,
              body,
              comment: comment?.body,
            });
          });
        }

        logger.info(`닥터차 포스트 정보 수집 중...: ${id}`);
      }

      nextCursor = postsList.pageInfo.endCursor;
      hasNextPage = postsList.pageInfo.hasNextPage;
    }
  } catch (error) {
    logger.error("An error occurred:", error);
  }

  return result;
};

module.exports = { retrievePostsAndComments };
