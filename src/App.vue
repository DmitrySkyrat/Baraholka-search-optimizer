<template>
  <div id="app">
    <div>
      <input placeholder="Enter your search items" v-model="searchItem" />
      <input v-model="minPrice" placeholder="Enter min price" type="number" />
      <input v-model="maxPrice" placeholder="Enter max price" type="number" />
      <button @click="onSearchButtonClick">SEARCH</button>
    </div>
    <select onchange="window.location.href=this.options[this.selectedIndex].value">
      <option
        v-for="category in baraholkaCategories"
        v-bind:key="category.id"
        v-bind:value="category.el"
        v-html="category.name"
      ></option>
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
  parseCategory
} from "./helpers";
import { BaraholkaTopic, Categories } from "./models";

@Component({
  components: {
    TableRow
  }
})
export default class App extends Vue {
  //@Prop() readonly category!: Categories;
  searchItem = "";
  fullParsedArray: BaraholkaTopic[] = [];
  baraholkaCategories: Categories[] = [];
  minPrice = 0;
  maxPrice = 0;

    mounted() {
    const categoriesBlock = document.querySelector(".b-ba-tabs");
    const categoriesArray = categoriesBlock?.getElementsByTagName("li");
    if (!categoriesArray || !categoriesBlock) {
      return null;
    }
    for (let i = 0; i < categoriesArray.length; i++) {
      const newCategory = parseCategory(categoriesBlock, i);
      this.baraholkaCategories.push(newCategory);
    }
  }

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
