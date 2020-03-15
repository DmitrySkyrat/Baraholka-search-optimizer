export function getTable(htmlElement: HTMLDivElement) {
  return htmlElement.querySelector<HTMLTableElement>(".ba-tbl-list__table");
}
export function getElemFromResponse(resp: string) {
  const el = document.createElement("div");
  el.innerHTML = resp;
  return el;
}
export function filterTableRows(table: HTMLTableElement) {
  return Array.from(table.rows)
    .filter(row => {
      return row.classList.length === 0;
    })
}
export function hasNextPageElem(el: HTMLDivElement) {
  const nextPageEl = el.querySelector(".page-next");
  if (!nextPageEl) {
    return false;
  }
  return true;
}
export function getNewUrl(url: URL, pageNumber: number){
  url.searchParams.set("start", `${50 * pageNumber}`);
  return url;
}