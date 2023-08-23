const listPosts = {
  method: "post",
  query: `
  query posts($after: String, $before: String, $filter: CommunityPostConnectionFilter!, $first: Int, $last: Int, $term: String, $imageUrl: String, $hashtags: [String!]) {
    communityPostConnection(
      after: $after
      before: $before
      filter: $filter
      first: $first
      last: $last
      hashtags: $hashtags
      term: $term
      imageUrl: $imageUrl
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
        __typename
      }
      edges {
        node {
          id
          __typename
        }
        cursor
        __typename
      }
      __typename
    }
  }
`,
};

const retrievePost = {
  method: "post",
  query: `
  query postCard($postId: ID!, $loggedIn: Boolean!, $filter: ReactionCountFilter!) {
    post(postId: $postId) {
      id
      title
      vehicle {
        shortModelName
        __typename
      }
      votes {
        voter {
          id
          __typename
        }
        type
        __typename
      }
      bookmarked @include(if: $loggedIn)
      createdAt
      body
      reacted @include(if: $loggedIn)
      files {
        url
        ... on Image {
          metadata {
            height
            width
            __typename
          }
          __typename
        }
        ... on Video {
          metadata {
            height
            width
            __typename
          }
          __typename
        }
        __typename
      }
      author {
        id
        nickname
        __typename
      }
      hashtags {
        name
        __typename
      }
      commentCount
      areas {
        zone {
          province
          district
          __typename
        }
        __typename
      }
      commentConnection {
        edges {
          node {
            id
            author {
              id
              role
              nickname
              avatar {
                url
                __typename
              }
              __typename
            }
            ... on Comment {
              id
              createdAt
              body
              reactionCount(filter: $filter)
              replyCount
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`,
};

module.exports = { listPosts, retrievePost };
