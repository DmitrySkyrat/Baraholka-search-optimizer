<template>
  <form @submit.prevent="onFormSubmit">
    <div class="filters-container">
      <div class="server-side-filters">
        <input
          placeholder="ВВЕДИТЕ НАЗВАНИЕ ТОВАРА"
          v-model="searchText"
          class="control search-input"
        />
        <select v-model="selectedCategoryIndex" class="control category-select">
          <option
            v-for="(category, index) in baraholkaCategories"
            :key="category.id"
            :value="index"
            >{{ category.name }}</option
          >
        </select>
      </div>

      <div class="client-side-filters">
        <v-select
          :options="baraholkaCities"
          label="name"
          placeholder="ВЫБЕРИТЕ ГОРОД"
          class="control city-select"
          v-model="selectedCities"
          multiple
        ></v-select>
        <input
          v-model="minPrice"
          placeholder="МИНИМАЛЬНАЯ ЦЕНА"
          type="number"
          class="control min-price-filter"
        />
        <input
          v-model="maxPrice"
          placeholder="МАКСИМАЛЬНАЯ ЦЕНА"
          type="number"
          class="control max-price-filter"
        />
      </div>
    </div>

    <button>ПОИСК</button>
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

<style lang="scss" scoped>
form {
  display: flex;
  border: solid 1px #e6e6e6;
  background-color: #e4f2ff;
  margin-bottom: 2rem;
  padding: 0.5rem;
}

.filters-container {
  flex-grow: 1;
}

.server-side-filters {
  margin-bottom: 0.5rem;
}

.control {
  min-height: 25px;
  color: #394066;
  background: #f5f5f5;
  border: solid 1px rgba(60, 60, 60, 0.26);
}

.search-input {
  width: 400px;
  text-align: center;
}

.city-select {
  display: inline-block;
  width: 200px;
  border: none;
  font-variant: small-caps;
}

.category-select {
  width: 100px;
  text-align-last: center;
  height: 29px;
}

.min-price-filter {
  width: 200px;
  text-align: center;
}

.max-price-filter {
  width: 200px;
  text-align: center;
}
</style>
