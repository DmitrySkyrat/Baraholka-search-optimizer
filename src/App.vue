<template>
  <div id="app">
    <form @submit.prevent="onFormSubmit">
      <input placeholder="Enter your search items" v-model="searchText" />
      <input v-model="minPrice" placeholder="Enter min price" type="number" />
      <input v-model="maxPrice" placeholder="Enter max price" type="number" />
      <select v-model="selectedCategoryIndex">
        <option
          v-for="(category, index) in baraholkaCategories"
          :key="category.id"
          :value="index"
          >{{ category.name }}</option
        >
      </select>
      <input type="submit" value="SEARCH" />
    </form>
    <table class="ba-tbl-list__table">
      <TableRow
        v-for="topic in fullParsedArray"
        v-bind:key="topic.id"
        v-bind:topic="topic"
      ></TableRow>
      <tr v-show="isLoading">
        Loading more...
      </tr>
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
  parseCategories,
} from "./helpers";
import { BaraholkaTopic, Category } from "./models";
import { baraholkaDataSource } from "./services/baraholka-data-source"

@Component({
  components: {
    TableRow,
  },
})
export default class App extends Vue {
  searchText = "";
  fullParsedArray: BaraholkaTopic[] = [];
  baraholkaCategories: Category[] = [];
  selectedCategoryIndex = 1;
  pageNum = 0;
  minPrice = 0;
  maxPrice = 0;
  isLoading = false;

  mounted() {
    hideNativeTable();
    hideNativePagination();
    const categoriesBlock = document.querySelector(".b-ba-tabs");
    if (!categoriesBlock) {
      return;
    }
    this.baraholkaCategories.push(...parseCategories(categoriesBlock));
    //Infinite topic scroll
    this.loadMore();
    document.addEventListener("scroll", (e) => {
      if (this.isLoading) {
        return;
      }
      const container = document.documentElement;
      if (
        container.scrollTop + container.clientHeight + 300 >=
        container.scrollHeight
      ) {
        this.loadMore();
      }
    });
  }

  async onFormSubmit() {
    this.fullParsedArray.splice(0);
    this.pageNum = 0;
    this.loadMore();
  }

  async loadMore() {
    this.isLoading = true;

    const newParsedArray = await baraholkaDataSource.getTopics({
      searchText: this.searchText,
      category: this.baraholkaCategories[this.selectedCategoryIndex],
      pageNum: this.pageNum,
    });

    const filteredTopics = newParsedArray.topics.filter((topic) =>
      priceFilter(topic.price, this.minPrice, this.maxPrice)
    );
    this.fullParsedArray.push(...filteredTopics);
    this.isLoading = false;
    this.pageNum++;
  }
}
</script>

<style lang="scss"></style>
