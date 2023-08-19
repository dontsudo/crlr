/** @param input {string} */
export function cleanText(input) {
  return input
    .replace(/[\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 *
 * @param {Function} listFn
 * @param {object} firstPageArgs
 */
export async function* iteratePaginateAPI(listFn, firstPageArgs) {
  let page = firstPageArgs.page;
}
