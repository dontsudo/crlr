import Danawa from "./sites/auto.danawa.com/client.js";
import Dsmotors from "./sites/dsmotors.co.kr/client.js";
import TermsNaver from "./sites/terms.naver.com/client.js";
import DoctorCha from "./sites/doctor-cha.com/client.js";

(async () => {
  // const termsnaver = new TermsNaver();
  // for (let page = 685; ; page++) {
  //   const terms = await termsnaver.terms.list({
  //     params: {
  //       categoryId: "42330",
  //       page,
  //       cid: "42330",
  //     },
  //   });
  //   if (!terms.data || terms.data?.length === 0) break;
  //   for (const { url } of terms.data) {
  //     const termUrl = new URL(url);
  //     const term = await termsnaver.terms.retrieve({
  //       params: termUrl.searchParams,
  //     });
  //     console.log(JSON.stringify(term.data, null, 4));
  //   }
  // }
  // const danawa = new Danawa();
  // for (let page = 1; ; page++) {
  //   const cars = await danawa.cars.list({
  //     body: {
  //       listSortType: 1,
  //       listCount: 30,
  //       page,
  //       tab: "all",
  //     },
  //   });
  //   if (!cars.data || cars.data?.length === 0) break;
  //   console.log(JSON.stringify(cars.data, null, 4));
  // }
  // const dsmotors = new Dsmotors();
  // const wages = await dsmotors.wages.retrieve();
  // console.log(JSON.stringify(wages.data, null, 4));

  const doctorcha = new DoctorCha();

  let nextCuror = undefined;
  do {
    let posts = await doctorcha.posts.list({
      variables: {
        first: 20,
        after: nextCuror,
      },
    });

    for (const { id } of posts.data.posts) {
      const post = await doctorcha.posts.retrieve({
        variables: {
          postId: id,
        },
      });

      console.log(JSON.stringify(post.data.post, null, 4));
      console.log(JSON.stringify(post.data.comments, null, 4));
    }

    nextCuror = posts.data.pageInfo.endCursor;
  } while (nextCuror);
})();
