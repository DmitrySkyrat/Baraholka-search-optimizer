<template>
  <div id="app">
    <div>
      <input placeholder="Enter your search items" v-model="searchItem" />
      <input v-model="minPrice" placeholder="Enter min price" type="number" />
      <input v-model="maxPrice" placeholder="Enter max price" type="number" />
      <button @click="onSearchButtonClick">SEARCH</button>
    </div>
    <select v-model="selectedCategoryIndex">
      <option
        v-for="(category, index) in baraholkaCategories"
        :key="category.id"
        :value="index"
      >{{category.name}}</option>
    </select>
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
  priceFilter,
  parseCategories
} from "./helpers";
import { BaraholkaTopic, Category } from "./models";

@Component({
  components: {
    TableRow
  }
})
export default class App extends Vue {
  searchItem = "";
  fullParsedArray: BaraholkaTopic[] = [];
  baraholkaCategories: Category[] = [];
  selectedCategoryIndex = 0;
  minPrice = 0;
  maxPrice = 0;

  mounted() {
    const categoriesBlock = document.querySelector(".b-ba-tabs");
    if (!categoriesBlock) {
      return;
    }

    this.baraholkaCategories.push(...parseCategories(categoriesBlock));
  }

  async onSearchButtonClick() {
    hideNativeTable();
    hideNativePagination();

    this.fullParsedArray.splice(0);

    const pageNum = 0;
    const url = new URL(location.href);
    url.pathname = "search.php";
    url.searchParams.set("q", this.searchItem);
    url.searchParams.set(
      "cat",
      this.baraholkaCategories[this.selectedCategoryIndex].id
    );

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
      priceFilter(topic.price, this.minPrice, this.maxPrice)
    );

    this.fullParsedArray.push(...filteredTopics);

    if (hasNextPageElem(el)) {
      this.loadMore(url, pageNum + 1);
    }
  }
}
</script>

<style lang="scss"></style>
