<template>
  <form @submit.prevent="onFormSubmit" class="form">
    <input
      placeholder="ВВЕДИТЕ НАЗВАНИЕ ТОВАРА"
      v-model="searchText"
      class="search-style"
    />
    <select v-model="selectedCategoryIndex" class="category-style">
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
      placeholder="ВЫБЕРИТЕ ГОРОД"
      class="city-style"
      v-model="selectedCities"
      multiple
    ></v-select>
    <input
      v-model="minPrice"
      placeholder="МИНИМАЛЬНАЯ ЦЕНА"
      type="number"
      class="min-style"
    />
    <input
      v-model="maxPrice"
      placeholder="МАКСИМАЛЬНАЯ ЦЕНА"
      type="number"
      class="max-style"
    />
    <button class="submit-style">ПОИСК</button>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mounted } from 'vue-class-decorator';
import vSelect from 'vue-select';
import { parseCategories } from '../helpers';
import { BaraholkaTopic, Category, City } from '../models';
import { baraholkaDataSource } from '../services/baraholka-data-source';

Vue.component('v-select', vSelect);

@Component({})
export default class Params extends Vue {
  searchText = '';
  minPrice = 0;
  maxPrice = 0;
  selectedCategoryIndex = 0;
  selectedCities: City[] = [];
  baraholkaCities: City[] = [];
  baraholkaRegionsID: string[] = [];
  baraholkaCategories: Category[] = [];

  async created() {
    const regions = await baraholkaDataSource.getRegions();
    this.baraholkaRegionsID.push(...regions.map((region) => region.id));

    const cities = await Promise.all(
      this.baraholkaRegionsID.map((id) => baraholkaDataSource.getCities(id))
    );
    cities.forEach((IdArray) => this.baraholkaCities.push(...IdArray));
    this.baraholkaCities.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  @Mounted()
  getCategories() {
    const categoriesBlock = document.querySelector('.b-ba-tabs');
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
    this.$emit('change', searchData);
  }
}
</script>
