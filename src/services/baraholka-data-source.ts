import {
    getElemFromResponse,
    getTable,
    filterTableRows,
    hasNextPageElem,
    tableRowsToTopics,
  } from "../helpers";

  import { BaraholkaTopic, BaraholkaSearchParams } from "../models";

  class BaraholkaDataSource {
    async getTopics(
      params: BaraholkaSearchParams
    ): Promise<{ topics: BaraholkaTopic[]; hasNextPage: boolean }> {
      const url = new URL(location.href);
      url.pathname = "search.php";
      url.searchParams.set("q", params.searchText);
      url.searchParams.set("cat", params.category.id);
      url.searchParams.set("start", `${50 * params.pageNum}`);
      const response = await fetch(url.href);
      const htmlPage = await response.text();
      const el = getElemFromResponse(htmlPage);
      const table = getTable(el);
      const nextPagePresenceValue = hasNextPageElem(el);
      if (table === null) {
        return { topics: [], hasNextPage: nextPagePresenceValue };
      }
      const parsedArray = filterTableRows(table);
      const newParsedArray = tableRowsToTopics(parsedArray);
      return {
        topics: newParsedArray,
        hasNextPage: nextPagePresenceValue,
      };
    }
  }
  
  export const baraholkaDataSource = new BaraholkaDataSource();