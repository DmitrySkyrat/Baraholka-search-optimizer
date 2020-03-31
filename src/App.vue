<template>
  <div id="app">
    <div>
      <p>{{ searchItem }}</p>
      <input placeholder="Enter your search items" v-model="searchItem" />
      <button @click="onSearchButtonClick">SEARCH</button>
    </div>
    <table class="ba-tbl-list__table">
      <TableRow
        v-for="topic in fullParsedArray"
        v-bind:key="topic.id"
        v-bind:topic="topic"
      ></TableRow>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TableRow from "./components/TableRow.vue";
import {
  getElemFromResponse,
  getTable,
  filterTableRows,
  hasNextPageElem,
  hideNativeTable,
  hideNativePagination,
  tableRowsToTopics
} from "./helpers";
import { BaraholkaTopic } from "./models";

@Component({
  components: {
    TableRow
  }
})
export default class App extends Vue {
  searchItem = "";
  fullParsedArray: BaraholkaTopic[] = [];

  async onSearchButtonClick() {
    hideNativeTable();
    hideNativePagination();
    const pageNum = 0;
    const url = new URL(location.href);
    url.pathname = "search.php";
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
    const newParsedArray = tableRowsToTopics(parsedArray);
    this.fullParsedArray.push(...newParsedArray);

    if (hasNextPageElem(el)) {
      this.loadMore(url, pageNum + 1);
    }
  }
}
</script>

<style lang="scss"></style>
