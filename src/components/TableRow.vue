<template>
  <div v-html="item"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Row extends Vue {
  @Prop() readonly item!: HTMLTableRowElement;
}
</script>