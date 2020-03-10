<template>
  <div id="app">
    <p>{{ searchItem }}</p>
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
  hasElement
} from "./helpers";

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
    console.log(url);
    const response = await fetch(url.href);
    const htmlPage = await response.text();
    const el = getElemFromResponse(htmlPage);
    console.log(el);
    const table = getTable(el);
    
    if (table === null) {
      return;
    }
    const parsedArray = filterTableRows(table);
    console.log(parsedArray);
    this.fullParsedArray = this.fullParsedArray.concat(parsedArray);
    console.log(this.fullParsedArray);
    getNewUrl(url, this.pageNumber);
    this.pageNumber++;

    if (hasElement(el)) {
      console.log(this.pageNumber);
      this.loadMore(url);
    }
  }
}
</script>

<style lang="scss">
</style>
  /*  fetch(url.href)
      .then(response => response.text())
      .then(htmlText => {
        const el = getElemFromResponse(htmlText);
        console.log(el);
        const table = getTable(el);
        if (table === null) {
          return;
        }
        console.log(table);
        const parseedArray = filterTableRows(table);
        console.log(parseedArray);
      });
    */