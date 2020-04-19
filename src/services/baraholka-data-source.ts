import {
  getElemFromResponse,
  getTable,
  filterTableRows,
  hasNextPageElem,
  tableRowsToTopics
} from "../helpers";

import { BaraholkaTopic, BaraholkaSearchParams, Region, City } from "../models";

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
      hasNextPage: nextPagePresenceValue
    };
  }
  async  getCities(idNumber: string): Promise<City[]> {
    const formData = new URLSearchParams();
    formData.set("regionId", idNumber);
    const url = new URL(location.href);
    url.pathname = "getCities.php";
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        accept: "application/json, text/javascript, */*; q=0.01",
        "x-requested-with": "XMLHttpRequest",
      },
      body: formData,
    });
    const respBody = await response.json();
    return respBody.cities.map((citiesElem: any) => {
      const city: City = {
        name: citiesElem.name,
        id: citiesElem.id,
      };
      return city;
    });
  }
   async  getRegions(): Promise<Region[]> {
    const response = await fetch(
      "https://baraholka.onliner.by/fleamarketposting.php"
    );
    const htmlPage = await response.text();
    const el = getElemFromResponse(htmlPage);
    const regionElements: NodeListOf<HTMLOptionElement> = el.querySelectorAll(
      ".js-posting-region option"
    );
    return Array.from(regionElements).map((regionElem) => {
      const region: Region = {
        id: regionElem.value,
        name: regionElem.innerText,
      };
      return region;
    });
  }
}

export const baraholkaDataSource = new BaraholkaDataSource();
