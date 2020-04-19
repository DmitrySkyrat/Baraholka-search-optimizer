<template>
  <tr v-html="topic.el.innerHTML"></tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-class-decorator";
import { BaraholkaTopic } from "../models";

@Component({})
export default class Row extends Vue {
  @Prop() readonly topic!: BaraholkaTopic;
}
</script>
