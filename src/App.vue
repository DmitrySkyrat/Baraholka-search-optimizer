<template>
  <div id="app">
    <p>{{searchItem}}</p>
    <input placeholder="Enter your search items" v-model="searchItem" />
    <button @click="onSearchButtonClick">SEARCH</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getElemFromResponse,
  getTable,
  filterTableRows,
  getNewUrl,
  hasNextPageElem
} from "./helpers";

Vue.component("table-row", {
  props: ["name"],
  template: "<li>{{name}}</li>"
});

@Component({})
export default class App extends Vue {
  searchItem = "";
  pageNumber = 1;
  fullParsedArray: HTMLTableRowElement[] = [];

  onSearchButtonClick() {
    const url = new URL(location.href);
    url.searchParams.set("q", this.searchItem);
    this.loadMore(url);
  }
  async loadMore(url: URL) {
    const response = await fetch(url.href);
    const htmlPage = await response.text();
    const el = getElemFromResponse(htmlPage);
    const table = getTable(el);

    if (table === null) {
      return;
    }
    const parsedArray = filterTableRows(table);
    this.fullParsedArray.splice(0, 0, ...parsedArray);
    console.log(this.fullParsedArray);
    getNewUrl(url, this.pageNumber);
    this.pageNumber++;

    if (hasNextPageElem(el)) {
      this.loadMore(url);
    }
  }
}
</script>

<style lang="scss">
</style>