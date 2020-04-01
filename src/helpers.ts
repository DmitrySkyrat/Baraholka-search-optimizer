import { BaraholkaTopic } from "./models";

export function getTable(htmlElement: HTMLDivElement) {
  return htmlElement.querySelector<HTMLTableElement>(".ba-tbl-list__table");
}
export function getElemFromResponse(resp: string) {
  const el = document.createElement("div");
  el.innerHTML = resp;
  return el;
}
export function filterTableRows(table: HTMLTableElement) {
  return Array.from(table.rows).filter(row => {
    return row.classList.length === 0;
  });
}
export function hasNextPageElem(el: HTMLDivElement) {
  const nextPageEl = el.querySelector(".page-next");
  if (!nextPageEl) {
    return false;
  }
  return true;
}
//Hide root elements
export function hideNativeTable() {
  const nativeTable = document.querySelector(".ba-tbl-list");
  nativeTable?.setAttribute("hidden", "true");
}
export function hideNativePagination() {
  const nativePagination = document.querySelectorAll(".b-pages");
  for (let i = 0; i < nativePagination.length; i++) {
    nativePagination[i].setAttribute("hidden", "true");
  }
}
export function tableRowsToTopics(
  parsedArray: HTMLTableRowElement[]
): BaraholkaTopic[] {
  return parsedArray.map(item => {
    const row: BaraholkaTopic = {
      id: (() => {
        const itemId = item.querySelector(".wraptxt");
        const itemElement = itemId?.getElementsByTagName("a")[0];
        const itemAttribute = itemElement?.getAttribute("href");
        if (!itemAttribute) {
          return null;
        }
        return itemAttribute.substr(18);
      })(),
      price: (() => {
        const primaryPrice = item.querySelector(".price-primary");
        if (!primaryPrice) {
          return -1;
        }
        return parseFloat(primaryPrice.innerHTML.replace(/ +/g, ''));
      })(),
      city: (() => {
        const cityElement = item.querySelector(".ba-signature strong");
        return cityElement?.innerHTML || "";
      })(),
      el: item
    };
    return row;
  });
}
//Filter Topic prices
export function priceFilter(topicPrice : number, minPrice: number, maxPrice: number) {
  if ((maxPrice === 0) && (minPrice === 0)) {
    return null;
  }
  return minPrice <= topicPrice && topicPrice <= maxPrice;
}
