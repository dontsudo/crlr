import DanawaAuto from "../lib/sites/auto.danawa.com/client.js";

export const retrieveCarsInformation = async () => {
  const danawa = new DanawaAuto();
  const result = [];

  try {
    let page = 1;
    while (true) {
      const { data: cars } = await danawa.cars.list({
        body: {
          page,
          listSortType: 1,
          listCount: 20,
          tab: "all",
        },
      });

      if (!cars || cars.length === 0) {
        break;
      }

      result.push(...cars);

      page++;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }

  return result;
};
