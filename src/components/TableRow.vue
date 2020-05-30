<template>
  <tr v-html="tr.innerHTML"></tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-class-decorator';
import { BaraholkaTopic } from '../models';
import { CurrencyMap } from '../services/currency.service';
import { PropType } from 'vue';

export default Vue.extend({
  name: 'Row',
  props: {
    topic: {
      type: Object as PropType<BaraholkaTopic>,
    },
    currencies: {
      type: Object as PropType<CurrencyMap>,
    },
  },
  computed: {
    tr(): HTMLTableRowElement {
      if (!this.currencies?.USD) {
        return this.topic.el;
      }

      const copy = document.createElement('tr');
      copy.innerHTML = this.topic.el.innerHTML;

      const priceEl = copy.querySelector('.price-primary');
      if (!priceEl) {
        return copy;
      }

      const convertedPriceEl = document.createElement('div');
      convertedPriceEl.innerHTML = `${Math.round(
        this.topic.price / this.currencies.USD.buy
      )} $`;

      priceEl.appendChild(convertedPriceEl);

      return copy;
    },
  },
});
</script>
