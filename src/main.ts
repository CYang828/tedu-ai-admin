import { createApp } from "vue";
import "@/styles/global.scss";
import App from "./App.vue";
import router from "./router/index.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app
  .use(ElementPlus, {
    size: "small",
    zIndex: 3000,
    locale: zhCn,
  })
  .use(router)
  .mount("#app");
