<template>
  <div id="app">
    <SearchItems @change="onSearchChange"></SearchItems>
    <table class="ba-tbl-list__table">
      <TableRow
        v-for="topic in topics"
        v-bind:key="topic.id"
        v-bind:topic="topic"
        :currencies="currencies"
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
import { Component, Vue } from 'vue-class-decorator';
import {
  getElemFromResponse,
  getTable,
  filterTableRows,
  hasNextPageElem,
  hideNativeTable,
  hideNativePagination,
  tableRowsToTopics,
  priceFilter,
  cityFilter,
} from './helpers';
import TableRow from './components/TableRow.vue';
import SearchItems from './components/SearchItems.vue';
import { BarLoader } from '@saeris/vue-spinners';
import { BaraholkaTopic, Category, City, SearchParams } from './models';
import { baraholkaDataSource } from './services/baraholka-data-source';
import { CurrencyMap, currencyService } from './services/currency.service';

@Component({
  components: {
    TableRow,
    BarLoader,
    SearchItems,
  },
})
export default class App extends Vue {
  currencies: CurrencyMap = {};
  pageNum = 0;
  isLoading = false;
  hasNextPage = true;
  topics: BaraholkaTopic[] = [];
  searchParams!: SearchParams;

  mounted() {
    hideNativeTable();
    hideNativePagination();
    this.loadCurrencies();

    //Infinite topic scroll
    document.addEventListener('scroll', () => {
      if (this.isLoading) {
        return;
      }
      const container = document.documentElement;
      const scrollIsAtTheBottom =
        container.scrollTop + container.clientHeight + 300 >=
        container.scrollHeight;

      if (scrollIsAtTheBottom && this.hasNextPage) {
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

  async loadMore() {
    if (!this.searchParams) {
      return;
    }
    this.isLoading = true;

    const newParsedArray = await baraholkaDataSource.getTopics({
      searchText: this.searchParams.searchText,
      category: this.searchParams.selectedCategory,
      pageNum: this.pageNum++,
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

    this.topics.push(...filteredTopics);
    this.isLoading = false;
    this.hasNextPage = newParsedArray.hasNextPage;
    if (this.hasNextPage && this.topics.length < 15) {
      await this.loadMore();
    }
  }

  async loadCurrencies() {
    this.currencies = await currencyService.fetchCurrencies();
  }
}
</script>

<style lang="scss"></style>
