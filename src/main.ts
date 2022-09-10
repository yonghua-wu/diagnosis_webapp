import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import "@/style/global.less";
import "@/style/css-variables.css";

createApp(App).use(store).use(router).use(ArcoVue).use(ArcoVueIcon).mount("#app");
