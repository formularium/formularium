import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [
  "field",
  "block",
  "category",
  "xml",
  "mutation",
  "value",
  "sep"
];
import VJsf from "@koumoul/vjsf";
import "@koumoul/vjsf/dist/main.css";
// load third-party dependencies (markdown-it, vuedraggable)
// you can also load them separately based on your needs
Vue.component("VJsf", VJsf);
import Draggable from "vuedraggable";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

const _global =
  (typeof window !== "undefined" && window) ||
  (typeof global !== "undefined" && global) ||
  {};
_global.markdownit = require("markdown-it");
Vue.component("draggable", Draggable);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
