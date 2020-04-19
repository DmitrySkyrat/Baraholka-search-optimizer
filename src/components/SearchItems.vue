<template>
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
    <v-select
      :options="baraholkaCities"
      label="name"
      placeholder="CHOOSE A CITY"
      class="city-style"
      v-model="selectedCities"
      multiple
    ></v-select>
    <input type="submit" value="SEARCH" />
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mounted } from "vue-class-decorator";
import vSelect from "vue-select";
import { getCities, getRegions, parseCategories } from "../helpers";
import { BaraholkaTopic, Category, City } from "../models";

Vue.component("v-select", vSelect);

@Component({})
export default class Params extends Vue {
  searchText = "";
  minPrice = 0;
  maxPrice = 0;
  selectedCategoryIndex = 0;
  selectedCities: City[] = [];
  baraholkaCities: City[] = [];
  baraholkaRegionsID: string[] = [];
  baraholkaCategories: Category[] = [];

  async created() {
    const regions = await getRegions();
    this.baraholkaRegionsID.push(...regions.map((region) => region.id));
    for (let i = 0; i < this.baraholkaRegionsID.length; i++) {
      const cities = await getCities(this.baraholkaRegionsID[i]);
      this.baraholkaCities.push(...cities);
    }
    this.baraholkaCities.sort((a, b) => a.name > b.name ? 1 : -1);
  }

  @Mounted()
  getCategories() {
    const categoriesBlock = document.querySelector(".b-ba-tabs");
    if (!categoriesBlock) {
      return;
    }
    this.baraholkaCategories.push(...parseCategories(categoriesBlock));
    this.onFormSubmit();
  }

  onFormSubmit() {
    const searchData = {
      searchText: this.searchText,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedCities: this.selectedCities,
      selectedCategory: this.baraholkaCategories[this.selectedCategoryIndex],
    };
    this.$emit("change", searchData);
  }
}
</script>
