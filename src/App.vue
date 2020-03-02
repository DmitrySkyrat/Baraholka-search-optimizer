<template>
  <div id="app">
    <p>{{searchItem}}</p>
    <input placeholder="Enter your search items" v-model="searchItem" />
    <button @click="onSearchButtonClick">SEARCH</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class App extends Vue {
  searchItem = "";
  onSearchButtonClick() {
    const url = new URL(location.href);
    url.searchParams.set("q", this.searchItem);
    console.log(url);
    //const response = await fetch(`${url}`);
    //const htmlPage = await response.text();
    const htmlPage = fetch(`${url}`)
      .then(response => response.text())
      .then(htmlText => console.log(htmlText));
  }
}
</script>

<style lang="scss">
</style>
