<template>
  <div id="app">
    <div>
      <p>{{ searchItem }}</p>
      <input placeholder="Enter your search items" v-model="searchItem" />
      <button @click="onSearchButtonClick">SEARCH</button>
      <input v-model.number="minPrice" placeholder="Enter min price" type="number"/>
      <input v-model.number="maxPrice" placeholder="Enter max price" type="number"/>
    </div>
    <table class="ba-tbl-list__table">
      <TableRow v-for="topic in fullParsedArray" v-bind:key="topic.id" v-bind:topic="topic"></TableRow>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TableRow from "./components/TableRow.vue";
import {
  getElemFromResponse,
  getTable,
  filterTableRows,
  hasNextPageElem,
  hideNativeTable,
  hideNativePagination,
  tableRowsToTopics,
  priceFilter
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
  minPrice = "";
  maxPrice = "";

  async onSearchButtonClick() {
    hideNativeTable();
    hideNativePagination();
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
    const newParsedArray = tableRowsToTopics(parsedArray);
    const filteredTopics = newParsedArray.filter(topic =>
      priceFilter(topic.price, Number(this.minPrice), Number(this.maxPrice))
    );
    this.fullParsedArray.push(...filteredTopics);
    console.log(this.fullParsedArray);
    if (hasNextPageElem(el)) {
      this.loadMore(url, pageNum + 1);
    }
  }
}
</script>

<style lang="scss"></style>
