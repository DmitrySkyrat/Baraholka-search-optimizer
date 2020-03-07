<template>
  <div id="app">
    <p>{{ searchItem }}</p>
    <input placeholder="Enter your search items" v-model="searchItem" />
    <button @click="onSearchButtonClick">SEARCH</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getElemFromResponse, getTable, filterTableRows } from "./helpers";

@Component({})
export default class App extends Vue {
  searchItem = "";
  async onSearchButtonClick() {
    const url = new URL(location.href);
    url.searchParams.set("q", this.searchItem);
    console.log(url);
    fetch(url.href)
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

    /*(async () => {
      const response = await fetch(url.href);
      const htmlPage = await response.text();
    })();
    */
  }
}
</script>

<style lang="scss">
</style>
