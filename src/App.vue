<template>
  <div id="app">
    <p>{{searchItem}}</p>
    <input placeholder="Enter your search items" v-model="searchItem" />
    <button @click="sendToConsole">SEARCH</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default {
  name: "app",
  data() {
    return {
      searchItem: ''
    };
  },
  methods:{
    sendToConsole(){
      console.log('SEARCH')
    }
  }
};
</script>

<style lang="scss">
</style>
