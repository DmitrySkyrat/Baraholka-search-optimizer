import Vue from "vue";
import App from "./App.vue";

const nativeSearch = document.querySelector(".b-mnforum-search");
nativeSearch?.setAttribute("hidden", "true");
const vueContainer = document.createElement("div");
vueContainer.id = "app";
nativeSearch?.parentElement?.prepend(vueContainer);

new Vue({
  render: h => h(App)
}).$mount("#app");
