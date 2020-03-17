<template>
  <div id="app">
    <p>{{ searchItem }}</p>
    <input placeholder="Enter your search items" v-model="searchItem" />
    <button @click="onSearchButtonClick">SEARCH</button>
    <div>
      <SearchedInfo />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SearchedInfo from "@/components/Searched-info.vue"
import {
  getElemFromResponse,
  getTable,
  filterTableRows,
  hasNextPageElem
} from "./helpers";

@Component({
    components: {
    SearchedInfo
  }
})
export default class App extends Vue {
  @Prop() readonly item!: HTMLTableRowElement;
  searchItem = "";
  fullParsedArray: HTMLTableRowElement[] = [];

  async onSearchButtonClick() {
    const pageNum = 0;
    const url = new URL(location.href);
    url.searchParams.set("q", this.searchItem);
    this.loadMore(url, pageNum);
  }
  async loadMore(url: URL, pageNum: number) {
    url.searchParams.set("start", `${50 * pageNum}`);
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
    if (hasNextPageElem(el)) {
      this.loadMore(url, pageNum + 1);
    }
  }
}
</script>

<style lang="scss">
</style>