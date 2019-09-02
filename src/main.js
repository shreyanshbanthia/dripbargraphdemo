import Vue from "vue";
import App from "./App.vue";
import VueTippy, { tippy } from "vue-tippy";

Vue.use(VueTippy);
Vue.use(tippy);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
