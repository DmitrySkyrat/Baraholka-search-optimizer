import { BaraholkaTopic, Category, Region, City } from "./models";

export function getTable(htmlElement: HTMLDivElement) {
  return htmlElement.querySelector<HTMLTableElement>(".ba-tbl-list__table");
}
//Create HTML div element and put string response into it
export function getElemFromResponse(resp: string) {
  const el = document.createElement("div");
  el.innerHTML = resp;
  return el;
}
export function filterTableRows(table: HTMLTableElement) {
  return Array.from(table.rows).filter((row) => {
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
//Convert Table rows to Topics
export function tableRowsToTopics(
  parsedArray: HTMLTableRowElement[]
): BaraholkaTopic[] {
  return parsedArray.map((item) => {
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
        return parseFloat(primaryPrice.innerHTML.replace(/ +/g, ""));
      })(),
      dolPrice: (() => {
        const primaryPrice = item.querySelector(".price-primary");
        if (!primaryPrice) {
          return -1;
        }
        const dollarRateElem = document.querySelector("._u");
        if (!dollarRateElem) {
          return -1;
        }
        return Math.round(
          parseFloat(primaryPrice.innerHTML.replace(/ +/g, "")) /
            Number(
              dollarRateElem.innerHTML
                .replace(/ +/g, "")
                .slice(1)
                .replace(/,+/g, ".")
            )
        );
      })(),
      city: (() => {
        const cityElement = item.querySelector(".ba-signature strong");
        return cityElement?.innerHTML || "";
      })(),
      el: item,
    };
    return row;
  });
}
//Filter Topic prices
export function priceFilter(
  topicPrice: number,
  minPrice: number,
  maxPrice: number
) {
  if (maxPrice && topicPrice > maxPrice) {
    return false;
  }

  if (minPrice && topicPrice < minPrice) {
    return false;
  }

  return true;
}
//Filter Topic cities
export function cityFilter(topicCity: string, selectedCities: City[]) {
  if (selectedCities.length === 0) {
    return true;
  }
  if (
    selectedCities.length != 0 &&
    selectedCities.map((city) => city.name).includes(topicCity)
  ) {
    return true;
  }

  return false;
}
//Parse categories
export function parseCategories(categoriesBlock: Element) {
  const categoriesArray = Array.from(
    categoriesBlock?.getElementsByTagName("li")
  ).map((liElem) => liElem.querySelector("a") as HTMLAnchorElement);

  return categoriesArray.map((categoryElem) => {
    const id = new URL(categoryElem.href).searchParams.get("cat") || "";

    const category: Category = {
      id,
      name: categoryElem.innerText || "",
    };
    return category;
  });
}
//City filter
export async function getCities(idNumber: string): Promise<City[]> {
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
export async function getRegions(): Promise<Region[]> {
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
//Dollar conversion
export function onDollar(topic: BaraholkaTopic) : BaraholkaTopic {
  if (topic.dolPrice === -1) {
    return topic;
  }
  const dollarTopic = topic;
  dollarTopic.el.cells[1].firstElementChild && (dollarTopic.el.cells[1].firstElementChild.innerHTML = `$${topic.dolPrice}`);
  return dollarTopic;
}
