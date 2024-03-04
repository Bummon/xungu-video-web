import { createApp } from "vue";
import App from "./App.vue";
import "@/styles/reset.scss";
import "@/styles/common.scss";
import "@/assets/iconfont/iconfont.scss";
import "@/assets/fonts/font.scss";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/element-dark.scss";
import "@/styles/element.scss";
// 全局公共样式
import "@/styles/global.scss";
import "virtual:svg-icons-register";
import ElementPlus from "element-plus";
import * as Icons from "@element-plus/icons-vue";
import directives from "@/directives/index";
import router from "@/routers";
import I18n from "@/languages/index";
import pinia from "@/stores";
import errorHandler from "@/utils/errorHandler";
import "vue3-sketch-ruler/lib/style.css";
import { setupDirectives, setupCustomComponents, initFunction } from "@/plugins";
// setupNaive,
import naive from "naive-ui";
import { GoAppProvider } from "@/components/GoAppProvider/index";
import ProTable from "@/components/ProTable/index.vue";
import XgCard from "@/components/xg-card/index.vue";

async function appInit() {
  const goAppProvider = createApp(GoAppProvider);
  const app = createApp(App);
  app.config.errorHandler = errorHandler;

  // 注册全局常用的 naive-ui 组件 选装式
  // setupNaive(app);

  // 注册饿了么的图标
  Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons]);
  });

  // 注册全局自定义指令
  setupDirectives(app);

  // 注册全局自定义组件
  setupCustomComponents(app);

  //解决路由守卫，Axios中可使用，Dialog，Message 等全局组件
  goAppProvider.mount("#appProvider", true);
  app.component("ProTable", ProTable);
  app.component("XgCard", XgCard);
  // 语言注册
  app.use(naive).use(ElementPlus).use(directives).use(router).use(I18n).use(pinia).mount("#app", true);

  // 挂载在 window 方便与在js中使用
  window["$vue"] = app;
}

appInit().then(() => {
  // initFunction();
});
