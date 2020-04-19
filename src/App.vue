<template>
  <div id="app">
    <input type="button" value="ПОМЕНЯТЬ ВАЛЮТУ" @click="changeCurrency" />
    <SearchItems @change="onSearchChange"></SearchItems>
    <table class="ba-tbl-list__table">
      <TableRow
        v-for="topic in topics"
        v-bind:key="topic.id"
        v-bind:topic="topic"
      ></TableRow>
      <BarLoader
        class="custom-class"
        color="#bada55"
        :loading="isLoading"
        :height="10"
        :heightUnit="'px'"
        :width="831"
        :widthUnit="'px'"
      ></BarLoader>
      <tr v-if="!topics.length && !isLoading">
        No topics were found
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-class-decorator";
import {
  getElemFromResponse,
  getTable,
  filterTableRows,
  hasNextPageElem,
  hideNativeTable,
  hideNativePagination,
  tableRowsToTopics,
  priceFilter,
  getCities,
  getRegions,
  cityFilter,
  onDollar,
} from "./helpers";
import TableRow from "./components/TableRow.vue";
import SearchItems from "./components/SearchItems.vue";
import { BarLoader } from "@saeris/vue-spinners";
import { BaraholkaTopic, Category, City, SearchParams } from "./models";
import { baraholkaDataSource } from "./services/baraholka-data-source";

@Component({
  components: {
    TableRow,
    BarLoader,
    SearchItems,
  },
})
export default class App extends Vue {
  pageNum = 0;
  isLoading = false;
  hasNextPage = true;
  topics: BaraholkaTopic[] = [];
  searchParams!: SearchParams;
  isUSDConvertion = false;

  mounted() {
    hideNativeTable();
    hideNativePagination();
    //Infinite topic scroll
    document.addEventListener("scroll", (e) => {
      if (this.isLoading) {
        return;
      }
      const container = document.documentElement;
      if (
        container.scrollTop + container.clientHeight + 300 >=
          container.scrollHeight &&
        this.hasNextPage
      ) {
        this.loadMore();
      }
    });
  }

  onSearchChange(searchData: SearchParams) {
    this.topics.splice(0);
    this.searchParams = searchData;
    this.pageNum = 0;
    this.loadMore();
  }

  changeCurrency() {
    this.isUSDConvertion = !this.isUSDConvertion;
    this.topics.splice(0);
    this.loadMore();
  }

  async loadMore() {
    if (!this.searchParams) {
      return;
    }
    this.isLoading = true;

    const newParsedArray = await baraholkaDataSource.getTopics({
      searchText: this.searchParams.searchText,
      category: this.searchParams.selectedCategory,
      pageNum: this.pageNum,
    });

    const filteredTopics = newParsedArray.topics
      .filter((topic) =>
        priceFilter(
          topic.price,
          this.searchParams.minPrice,
          this.searchParams.maxPrice
        )
      )
      .filter((topic) =>
        cityFilter(topic.city, this.searchParams.selectedCities)
      );
    this.isUSDConvertion ? this.topics.push(...filteredTopics.map((topic) => onDollar(topic))) : this.topics.push(...filteredTopics);
    this.isLoading = false;
    this.hasNextPage = newParsedArray.hasNextPage;
    this.pageNum++;
  }
}
</script>

<style lang="scss"></style>
