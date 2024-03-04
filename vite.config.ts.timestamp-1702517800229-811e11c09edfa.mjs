// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/vite/dist/node/index.js";
import { resolve as resolve2 } from "path";

// build/getEnv.ts
function wrapperEnv(envConf) {
  const ret = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT")
      realName = Number(realName);
    if (envName === "VITE_PROXY") {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
      }
    }
    ret[envName] = realName;
  }
  return ret;
}

// build/proxy.ts
function createProxy(list = []) {
  const ret = {};
  for (const [prefix, target] of list) {
    const httpsRE = /^https:\/\//;
    const isHttps = httpsRE.test(target);
    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
      // https is require secure=false
      ...isHttps ? { secure: false } : {}
    };
  }
  return ret;
}

// build/plugins.ts
import { resolve } from "path";
import { VitePWA } from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/vite-plugin-pwa/dist/index.js";
import { visualizer } from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { createHtmlPlugin } from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/vite-plugin-html/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import vue from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import eslintPlugin from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/vite-plugin-eslint/dist/index.mjs";
import viteCompression from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/vite-plugin-compression/dist/index.mjs";
import vueSetupExtend from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/unplugin-vue-setup-extend-plus/dist/vite.js";
var createVitePlugins = (viteEnv) => {
  const { VITE_GLOB_APP_TITLE, VITE_REPORT, VITE_PWA } = viteEnv;
  return [
    vue(),
    // vue 可以使用 jsx/tsx 语法
    vueJsx(),
    // esLint 报错信息显示在浏览器界面上
    eslintPlugin(),
    // name 可以写在 script 标签上
    vueSetupExtend({}),
    // 创建打包压缩配置
    createCompression(viteEnv),
    // 注入变量到 html 文件
    createHtmlPlugin({
      inject: {
        data: { title: VITE_GLOB_APP_TITLE }
      }
    }),
    // 使用 svg 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    // vitePWA
    VITE_PWA && createVitePwa(viteEnv),
    // 是否生成包预览，分析依赖包大小做优化处理
    VITE_REPORT && visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true })
  ];
};
var createCompression = (viteEnv) => {
  const { VITE_BUILD_COMPRESS = "none", VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;
  const compressList = VITE_BUILD_COMPRESS.split(",");
  const plugins = [];
  if (compressList.includes("gzip")) {
    plugins.push(
      viteCompression({
        ext: ".gz",
        algorithm: "gzip",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  if (compressList.includes("brotli")) {
    plugins.push(
      viteCompression({
        ext: ".br",
        algorithm: "brotliCompress",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  return plugins;
};
var createVitePwa = (viteEnv) => {
  const { VITE_GLOB_APP_TITLE } = viteEnv;
  return VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: VITE_GLOB_APP_TITLE,
      short_name: VITE_GLOB_APP_TITLE,
      theme_color: "#ffffff",
      icons: [
        {
          src: "/logo.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    }
  });
};

// package.json
var package_default = {
  name: "xungu-control",
  private: true,
  version: "1.0.0",
  type: "module",
  description: "media information control ",
  author: {
    name: "xungu",
    email: "597974450@qq.com",
    url: "https://www.zyxgkj.com/"
  },
  license: "MIT",
  homepage: "/",
  scripts: {
    dev: "vite",
    serve: "vite",
    docker: "docker build -t  meetcontrol-front .",
    "build:dev": "vite build --mode development",
    "build:docker": "vite build  --mode development && docker build -t  meetcontrol-front .",
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": " vite build --mode production",
    "type:check": "vue-tsc --noEmit --skipLibCheck",
    preview: "npm run build:dev && vite preview",
    "lint:eslint": "eslint --fix --ext .js,.ts,.vue ./src",
    "lint:prettier": 'prettier --write "src/**/*.{js,ts,json,tsx,css,less,scss,vue,html,md}"',
    "lint:stylelint": 'stylelint --cache --fix "**/*.{vue,less,postcss,css,scss}" --cache --cache-location node_modules/.cache/stylelint/',
    "lint:lint-staged": "lint-staged",
    prepare: "husky install",
    release: "standard-version",
    commit: "git add -A && czg && git push"
  },
  dependencies: {
    "@amap/amap-jsapi-loader": "^1.0.1",
    "@amap/amap-jsapi-types": "^0.0.13",
    "@element-plus/icons-vue": "^2.1.0",
    "@iconify/vue": "^4.1.1",
    "@vicons/carbon": "^0.12.0",
    "@vicons/ionicons5": "^0.12.0",
    "@vueuse/core": "^10.2.1",
    "@wangeditor/editor": "^5.1.23",
    "@wangeditor/editor-for-vue": "^5.1.12",
    axios: "^1.4.0",
    color: "^4.2.3",
    "crypto-js": "^4.1.1",
    dayjs: "^1.11.9",
    "dom-helpers": "^5.2.1",
    "driver.js": "^0.9.8",
    echarts: "^5.4.2",
    "echarts-liquidfill": "^3.1.0",
    "echarts-stat": "^1.2.0",
    "echarts-wordcloud": "^2.1.0",
    "element-plus": "^2.3.4",
    "flv.js": "^1.6.2",
    gsap: "^3.12.1",
    "highlight.js": "^11.8.0",
    html2canvas: "^1.4.1",
    "js-md5": "^0.7.3",
    keymaster: "^1.6.2",
    lodash: "^4.17.21",
    miment: "^0.0.9",
    mitt: "^3.0.1",
    "monaco-editor": "^0.39.0",
    "no-vue3-cron": "^1.0.4",
    nprogress: "^0.2.0",
    pinia: "^2.1.4",
    "pinia-plugin-persistedstate": "^3.1.0",
    "print-js": "^1.6.0",
    qs: "^6.11.2",
    screenfull: "^6.0.2",
    sortablejs: "^1.15.0",
    three: "^0.153.0",
    vue: "^3.3.4",
    "vue-demi": "^0.14.5",
    "vue-i18n": "^9.2.2",
    "vue-router": "^4.2.4",
    "vue3-eventbus": "^2.0.0",
    "vue3-lazyload": "^0.3.6",
    "vue3-seamless-scroll": "^2.0.1",
    "vue3-sketch-ruler": "^1.3.9",
    vuedraggable: "^4.1.0"
  },
  devDependencies: {
    "@commitlint/cli": "^17.4.6",
    "@commitlint/config-conventional": "^17.6.6",
    "@types/color": "^3.0.3",
    "@types/crypto-js": "^4.1.1",
    "@types/js-md5": "^0.7.0",
    "@types/keymaster": "^1.6.30",
    "@types/nprogress": "^0.2.0",
    "@types/qs": "^6.9.7",
    "@types/sortablejs": "^1.15.1",
    "@types/three": "^0.152.1",
    "@typescript-eslint/eslint-plugin": "^5.61.0",
    "@typescript-eslint/parser": "^5.61.0",
    "@vitejs/plugin-vue": "^4.2.3",
    "@vitejs/plugin-vue-jsx": "^3.0.1",
    autoprefixer: "^10.4.14",
    "cz-git": "^1.6.1",
    czg: "^1.6.1",
    eslint: "^8.44.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-vue": "^9.15.1",
    husky: "^8.0.3",
    "lint-staged": "^13.2.0",
    "naive-ui": "^2.34.4",
    postcss: "^8.4.25",
    "postcss-html": "^1.5.0",
    prettier: "^2.8.8",
    "rollup-plugin-visualizer": "^5.9.0",
    sass: "^1.62.1",
    "standard-version": "^9.5.0",
    stylelint: "^15.10.1",
    "stylelint-config-html": "^1.1.0",
    "stylelint-config-recess-order": "^4.2.0",
    "stylelint-config-recommended-scss": "^9.0.1",
    "stylelint-config-recommended-vue": "^1.4.0",
    "stylelint-config-standard": "^34.0.0",
    "stylelint-config-standard-scss": "^7.0.1",
    typescript: "^5.1.6",
    "typescript-eslint": "^0.0.1-alpha.0",
    "unplugin-vue-setup-extend-plus": "^1.0.0",
    vite: "^4.4.2",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-eslint": "^1.8.1",
    "vite-plugin-html": "^3.2.0",
    "vite-plugin-pwa": "^0.16.4",
    "vite-plugin-svg-icons": "^2.0.1",
    "vue-echarts": "^6.5.5",
    "vue-tsc": "^1.8.4"
  },
  engines: {
    node: ">=16.0.0"
  },
  browserslist: {
    production: [
      "> 1%",
      "not dead",
      "not op_mini all"
    ],
    development: [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  config: {
    commitizen: {
      path: "node_modules/cz-git"
    }
  }
};

// vite.config.ts
import dayjs from "file:///D:/%E4%B8%AD%E9%9F%B3%E9%A1%B9%E7%9B%AE/xungu-framework-admin/node_modules/dayjs/dayjs.min.js";
var __vite_injected_original_dirname = "D:\\\u4E2D\u97F3\u9879\u76EE\\xungu-framework-admin";
var { dependencies, devDependencies, name, version } = package_default;
var __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};
var vite_config_default = defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": resolve2(__vite_injected_original_dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/style.scss";`,
          javascriptEnabled: true
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    plugins: createVitePlugins(viteEnv),
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    },
    build: {
      outDir: "dist",
      minify: "esbuild",
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: "terser",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
      // 		drop_debugger: true
      // 	}
      // },
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2e3,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvZ2V0RW52LnRzIiwgImJ1aWxkL3Byb3h5LnRzIiwgImJ1aWxkL3BsdWdpbnMudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcXHU0RTJEXHU5N0YzXHU5ODc5XHU3NkVFXFxcXHh1bmd1LWZyYW1ld29yay1hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcXHU0RTJEXHU5N0YzXHU5ODc5XHU3NkVFXFxcXHh1bmd1LWZyYW1ld29yay1hZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovJUU0JUI4JUFEJUU5JTlGJUIzJUU5JUExJUI5JUU3JTlCJUFFL3h1bmd1LWZyYW1ld29yay1hZG1pbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiwgQ29uZmlnRW52LCBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgd3JhcHBlckVudiB9IGZyb20gXCIuL2J1aWxkL2dldEVudlwiO1xuaW1wb3J0IHsgY3JlYXRlUHJveHkgfSBmcm9tIFwiLi9idWlsZC9wcm94eVwiO1xuaW1wb3J0IHsgY3JlYXRlVml0ZVBsdWdpbnMgfSBmcm9tIFwiLi9idWlsZC9wbHVnaW5zXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuaW1wb3J0IGRheWpzIGZyb20gXCJkYXlqc1wiO1xuXG5jb25zdCB7IGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzLCBuYW1lLCB2ZXJzaW9uIH0gPSBwa2c7XG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XG4gIHBrZzogeyBkZXBlbmRlbmNpZXMsIGRldkRlcGVuZGVuY2llcywgbmFtZSwgdmVyc2lvbiB9LFxuICBsYXN0QnVpbGRUaW1lOiBkYXlqcygpLmZvcm1hdChcIllZWVktTU0tREQgSEg6bW06c3NcIilcbn07XG5cbi8vIEBzZWU6IGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcbiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdCk7XG4gIGNvbnN0IHZpdGVFbnYgPSB3cmFwcGVyRW52KGVudik7XG5cbiAgcmV0dXJuIHtcbiAgICBiYXNlOiB2aXRlRW52LlZJVEVfUFVCTElDX1BBVEgsXG4gICAgcm9vdCxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAgIFwidnVlLWkxOG5cIjogXCJ2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qc1wiXG4gICAgICB9XG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fQVBQX0lORk9fXzogSlNPTi5zdHJpbmdpZnkoX19BUFBfSU5GT19fKVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL3N0eWxlcy9zdHlsZS5zY3NzXCI7YCxcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgICBwb3J0OiB2aXRlRW52LlZJVEVfUE9SVCxcbiAgICAgIG9wZW46IHZpdGVFbnYuVklURV9PUEVOLFxuICAgICAgY29yczogdHJ1ZSxcbiAgICAgIC8vIExvYWQgcHJveHkgY29uZmlndXJhdGlvbiBmcm9tIC5lbnYuZGV2ZWxvcG1lbnRcbiAgICAgIHByb3h5OiBjcmVhdGVQcm94eSh2aXRlRW52LlZJVEVfUFJPWFkpXG4gICAgfSxcbiAgICBwbHVnaW5zOiBjcmVhdGVWaXRlUGx1Z2lucyh2aXRlRW52KSxcbiAgICBlc2J1aWxkOiB7XG4gICAgICBwdXJlOiB2aXRlRW52LlZJVEVfRFJPUF9DT05TT0xFID8gW1wiY29uc29sZS5sb2dcIiwgXCJkZWJ1Z2dlclwiXSA6IFtdXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiBcImRpc3RcIixcbiAgICAgIG1pbmlmeTogXCJlc2J1aWxkXCIsXG4gICAgICAvLyBlc2J1aWxkIFx1NjI1M1x1NTMwNVx1NjZGNFx1NUZFQlx1RkYwQ1x1NEY0Nlx1NjYyRlx1NEUwRFx1ODBGRFx1NTNCQlx1OTY2NCBjb25zb2xlLmxvZ1x1RkYwQ3RlcnNlclx1NjI1M1x1NTMwNVx1NjE2Mlx1RkYwQ1x1NEY0Nlx1ODBGRFx1NTNCQlx1OTY2NCBjb25zb2xlLmxvZ1xuICAgICAgLy8gbWluaWZ5OiBcInRlcnNlclwiLFxuICAgICAgLy8gdGVyc2VyT3B0aW9uczoge1xuICAgICAgLy8gXHRjb21wcmVzczoge1xuICAgICAgLy8gXHRcdGRyb3BfY29uc29sZTogdml0ZUVudi5WSVRFX0RST1BfQ09OU09MRSxcbiAgICAgIC8vIFx0XHRkcm9wX2RlYnVnZ2VyOiB0cnVlXG4gICAgICAvLyBcdH1cbiAgICAgIC8vIH0sXG4gICAgICAvLyBcdTc5ODFcdTc1MjggZ3ppcCBcdTUzOEJcdTdGMjlcdTU5MjdcdTVDMEZcdTYyQTVcdTU0NEFcdUZGMENcdTUzRUZcdTc1NjVcdTVGQUVcdTUxQ0ZcdTVDMTFcdTYyNTNcdTUzMDVcdTY1RjZcdTk1RjRcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcbiAgICAgIC8vIFx1ODlDNFx1NUI5QVx1ODlFNlx1NTNEMVx1OEI2Nlx1NTQ0QVx1NzY4NCBjaHVuayBcdTU5MjdcdTVDMEZcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgLy8gU3RhdGljIHJlc291cmNlIGNsYXNzaWZpY2F0aW9uIGFuZCBwYWNrYWdpbmdcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiYXNzZXRzL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF1cIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFx1NEUyRFx1OTdGM1x1OTg3OVx1NzZFRVxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFx1NEUyRFx1OTdGM1x1OTg3OVx1NzZFRVxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cXFxcYnVpbGRcXFxcZ2V0RW52LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8lRTQlQjglQUQlRTklOUYlQjMlRTklQTElQjklRTclOUIlQUUveHVuZ3UtZnJhbWV3b3JrLWFkbWluL2J1aWxkL2dldEVudi50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNEZXZGbihtb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9kRm4obW9kZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIG1vZGUgPT09IFwicHJvZHVjdGlvblwiO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUZXN0Rm4obW9kZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIG1vZGUgPT09IFwidGVzdFwiO1xyXG59XHJcblxyXG4vKipcclxuICogV2hldGhlciB0byBnZW5lcmF0ZSBwYWNrYWdlIHByZXZpZXdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1JlcG9ydE1vZGUoKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIHByb2Nlc3MuZW52LlZJVEVfUkVQT1JUID09PSBcInRydWVcIjtcclxufVxyXG5cclxuLy8gUmVhZCBhbGwgZW52aXJvbm1lbnQgdmFyaWFibGUgY29uZmlndXJhdGlvbiBmaWxlcyB0byBwcm9jZXNzLmVudlxyXG5leHBvcnQgZnVuY3Rpb24gd3JhcHBlckVudihlbnZDb25mOiBSZWNvcmRhYmxlKTogVml0ZUVudiB7XHJcbiAgY29uc3QgcmV0OiBhbnkgPSB7fTtcclxuXHJcbiAgZm9yIChjb25zdCBlbnZOYW1lIG9mIE9iamVjdC5rZXlzKGVudkNvbmYpKSB7XHJcbiAgICBsZXQgcmVhbE5hbWUgPSBlbnZDb25mW2Vudk5hbWVdLnJlcGxhY2UoL1xcXFxuL2csIFwiXFxuXCIpO1xyXG4gICAgcmVhbE5hbWUgPSByZWFsTmFtZSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogcmVhbE5hbWUgPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogcmVhbE5hbWU7XHJcbiAgICBpZiAoZW52TmFtZSA9PT0gXCJWSVRFX1BPUlRcIikgcmVhbE5hbWUgPSBOdW1iZXIocmVhbE5hbWUpO1xyXG4gICAgaWYgKGVudk5hbWUgPT09IFwiVklURV9QUk9YWVwiKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmVhbE5hbWUgPSBKU09OLnBhcnNlKHJlYWxOYW1lKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICB9XHJcbiAgICByZXRbZW52TmFtZV0gPSByZWFsTmFtZTtcclxuICB9XHJcbiAgcmV0dXJuIHJldDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB1c2VyIHJvb3QgZGlyZWN0b3J5XHJcbiAqIEBwYXJhbSBkaXIgZmlsZSBwYXRoXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um9vdFBhdGgoLi4uZGlyOiBzdHJpbmdbXSkge1xyXG4gIHJldHVybiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgLi4uZGlyKTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFx1NEUyRFx1OTdGM1x1OTg3OVx1NzZFRVxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFx1NEUyRFx1OTdGM1x1OTg3OVx1NzZFRVxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cXFxcYnVpbGRcXFxccHJveHkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6LyVFNCVCOCVBRCVFOSU5RiVCMyVFOSVBMSVCOSVFNyU5QiVBRS94dW5ndS1mcmFtZXdvcmstYWRtaW4vYnVpbGQvcHJveHkudHNcIjtpbXBvcnQgdHlwZSB7IFByb3h5T3B0aW9ucyB9IGZyb20gXCJ2aXRlXCI7XHJcblxyXG50eXBlIFByb3h5SXRlbSA9IFtzdHJpbmcsIHN0cmluZ107XHJcblxyXG50eXBlIFByb3h5TGlzdCA9IFByb3h5SXRlbVtdO1xyXG5cclxudHlwZSBQcm94eVRhcmdldExpc3QgPSBSZWNvcmQ8c3RyaW5nLCBQcm94eU9wdGlvbnM+O1xyXG5cclxuLyoqXHJcbiAqIFx1NTIxQlx1NUVGQVx1NEVFM1x1NzQwNlx1RkYwQ1x1NzUyOFx1NEU4RVx1ODlFM1x1Njc5MCAuZW52LmRldmVsb3BtZW50IFx1NEVFM1x1NzQwNlx1OTE0RFx1N0Y2RVxyXG4gKiBAcGFyYW0gbGlzdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb3h5KGxpc3Q6IFByb3h5TGlzdCA9IFtdKSB7XHJcbiAgY29uc3QgcmV0OiBQcm94eVRhcmdldExpc3QgPSB7fTtcclxuICBmb3IgKGNvbnN0IFtwcmVmaXgsIHRhcmdldF0gb2YgbGlzdCkge1xyXG4gICAgY29uc3QgaHR0cHNSRSA9IC9eaHR0cHM6XFwvXFwvLztcclxuICAgIGNvbnN0IGlzSHR0cHMgPSBodHRwc1JFLnRlc3QodGFyZ2V0KTtcclxuXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaHR0cC1wYXJ0eS9ub2RlLWh0dHAtcHJveHkjb3B0aW9uc1xyXG4gICAgcmV0W3ByZWZpeF0gPSB7XHJcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHdzOiB0cnVlLFxyXG4gICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtwcmVmaXh9YCksIFwiXCIpLFxyXG4gICAgICAvLyBodHRwcyBpcyByZXF1aXJlIHNlY3VyZT1mYWxzZVxyXG4gICAgICAuLi4oaXNIdHRwcyA/IHsgc2VjdXJlOiBmYWxzZSB9IDoge30pXHJcbiAgICB9O1xyXG4gIH1cclxuICByZXR1cm4gcmV0O1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcXHU0RTJEXHU5N0YzXHU5ODc5XHU3NkVFXFxcXHh1bmd1LWZyYW1ld29yay1hZG1pblxcXFxidWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcXHU0RTJEXHU5N0YzXHU5ODc5XHU3NkVFXFxcXHh1bmd1LWZyYW1ld29yay1hZG1pblxcXFxidWlsZFxcXFxwbHVnaW5zLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8lRTQlQjglQUQlRTklOUYlQjMlRTklQTElQjklRTclOUIlQUUveHVuZ3UtZnJhbWV3b3JrLWFkbWluL2J1aWxkL3BsdWdpbnMudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xyXG5pbXBvcnQgZXNsaW50UGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjtcclxuaW1wb3J0IHZ1ZVNldHVwRXh0ZW5kIGZyb20gXCJ1bnBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kLXBsdXMvdml0ZVwiO1xyXG5cclxuLyoqXHJcbiAqIFx1NTIxQlx1NUVGQSB2aXRlIFx1NjNEMlx1NEVGNlxyXG4gKiBAcGFyYW0gdml0ZUVudlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVZpdGVQbHVnaW5zID0gKHZpdGVFbnY6IFZpdGVFbnYpOiAoUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10pW10gPT4ge1xyXG4gIGNvbnN0IHsgVklURV9HTE9CX0FQUF9USVRMRSwgVklURV9SRVBPUlQsIFZJVEVfUFdBIH0gPSB2aXRlRW52O1xyXG4gIHJldHVybiBbXHJcbiAgICB2dWUoKSxcclxuICAgIC8vIHZ1ZSBcdTUzRUZcdTRFRTVcdTRGN0ZcdTc1MjgganN4L3RzeCBcdThCRURcdTZDRDVcclxuICAgIHZ1ZUpzeCgpLFxyXG4gICAgLy8gZXNMaW50IFx1NjJBNVx1OTUxOVx1NEZFMVx1NjA2Rlx1NjYzRVx1NzkzQVx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzU0Q1x1OTc2Mlx1NEUwQVxyXG4gICAgZXNsaW50UGx1Z2luKCksXHJcbiAgICAvLyBuYW1lIFx1NTNFRlx1NEVFNVx1NTE5OVx1NTcyOCBzY3JpcHQgXHU2ODA3XHU3QjdFXHU0RTBBXHJcbiAgICB2dWVTZXR1cEV4dGVuZCh7fSksXHJcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTYyNTNcdTUzMDVcdTUzOEJcdTdGMjlcdTkxNERcdTdGNkVcclxuICAgIGNyZWF0ZUNvbXByZXNzaW9uKHZpdGVFbnYpLFxyXG4gICAgLy8gXHU2Q0U4XHU1MTY1XHU1M0Q4XHU5MUNGXHU1MjMwIGh0bWwgXHU2NTg3XHU0RUY2XHJcbiAgICBjcmVhdGVIdG1sUGx1Z2luKHtcclxuICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgZGF0YTogeyB0aXRsZTogVklURV9HTE9CX0FQUF9USVRMRSB9XHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgLy8gXHU0RjdGXHU3NTI4IHN2ZyBcdTU2RkVcdTY4MDdcclxuICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgaWNvbkRpcnM6IFtyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwic3JjL2Fzc2V0cy9pY29uc1wiKV0sXHJcbiAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCJcclxuICAgIH0pLFxyXG4gICAgLy8gdml0ZVBXQVxyXG4gICAgVklURV9QV0EgJiYgY3JlYXRlVml0ZVB3YSh2aXRlRW52KSxcclxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NzUxRlx1NjIxMFx1NTMwNVx1OTg4NFx1ODlDOFx1RkYwQ1x1NTIwNlx1Njc5MFx1NEY5RFx1OEQ1Nlx1NTMwNVx1NTkyN1x1NUMwRlx1NTA1QVx1NEYxOFx1NTMxNlx1NTkwNFx1NzQwNlxyXG4gICAgVklURV9SRVBPUlQgJiYgKHZpc3VhbGl6ZXIoeyBmaWxlbmFtZTogXCJzdGF0cy5odG1sXCIsIGd6aXBTaXplOiB0cnVlLCBicm90bGlTaXplOiB0cnVlIH0pIGFzIFBsdWdpbk9wdGlvbilcclxuICBdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBcdTY4MzlcdTYzNkUgY29tcHJlc3MgXHU5MTREXHU3RjZFXHVGRjBDXHU3NTFGXHU2MjEwXHU0RTBEXHU1NDBDXHU3Njg0XHU1MzhCXHU3RjI5XHU4OUM0XHU1MjE5XHJcbiAqIEBwYXJhbSB2aXRlRW52XHJcbiAqL1xyXG5jb25zdCBjcmVhdGVDb21wcmVzc2lvbiA9ICh2aXRlRW52OiBWaXRlRW52KTogUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10gPT4ge1xyXG4gIGNvbnN0IHsgVklURV9CVUlMRF9DT01QUkVTUyA9IFwibm9uZVwiLCBWSVRFX0JVSUxEX0NPTVBSRVNTX0RFTEVURV9PUklHSU5fRklMRSB9ID0gdml0ZUVudjtcclxuICBjb25zdCBjb21wcmVzc0xpc3QgPSBWSVRFX0JVSUxEX0NPTVBSRVNTLnNwbGl0KFwiLFwiKTtcclxuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xyXG5cclxuICBpZiAoY29tcHJlc3NMaXN0LmluY2x1ZGVzKFwiZ3ppcFwiKSkge1xyXG4gICAgcGx1Z2lucy5wdXNoKFxyXG4gICAgICB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICAgIGV4dDogXCIuZ3pcIixcclxuICAgICAgICBhbGdvcml0aG06IFwiZ3ppcFwiLFxyXG4gICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IFZJVEVfQlVJTERfQ09NUFJFU1NfREVMRVRFX09SSUdJTl9GSUxFXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuICBpZiAoY29tcHJlc3NMaXN0LmluY2x1ZGVzKFwiYnJvdGxpXCIpKSB7XHJcbiAgICBwbHVnaW5zLnB1c2goXHJcbiAgICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgICAgZXh0OiBcIi5iclwiLFxyXG4gICAgICAgIGFsZ29yaXRobTogXCJicm90bGlDb21wcmVzc1wiLFxyXG4gICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IFZJVEVfQlVJTERfQ09NUFJFU1NfREVMRVRFX09SSUdJTl9GSUxFXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuICByZXR1cm4gcGx1Z2lucztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gVml0ZVB3YVxyXG4gKiBAcGFyYW0gdml0ZUVudlxyXG4gKi9cclxuY29uc3QgY3JlYXRlVml0ZVB3YSA9ICh2aXRlRW52OiBWaXRlRW52KTogUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10gPT4ge1xyXG4gIGNvbnN0IHsgVklURV9HTE9CX0FQUF9USVRMRSB9ID0gdml0ZUVudjtcclxuICByZXR1cm4gVml0ZVBXQSh7XHJcbiAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gICAgbWFuaWZlc3Q6IHtcclxuICAgICAgbmFtZTogVklURV9HTE9CX0FQUF9USVRMRSxcclxuICAgICAgc2hvcnRfbmFtZTogVklURV9HTE9CX0FQUF9USVRMRSxcclxuICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICBpY29uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCIvbG9nby5wbmdcIixcclxuICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcclxuICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCIvbG9nby5wbmdcIixcclxuICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcclxuICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCIvbG9nby5wbmdcIixcclxuICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcclxuICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICBwdXJwb3NlOiBcImFueSBtYXNrYWJsZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcbiIsICJ7XHJcbiAgXCJuYW1lXCI6IFwieHVuZ3UtY29udHJvbFwiLFxyXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxyXG4gIFwidmVyc2lvblwiOiBcIjEuMC4wXCIsXHJcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIm1lZGlhIGluZm9ybWF0aW9uIGNvbnRyb2wgXCIsXHJcbiAgXCJhdXRob3JcIjoge1xyXG4gICAgXCJuYW1lXCI6IFwieHVuZ3VcIixcclxuICAgIFwiZW1haWxcIjogXCI1OTc5NzQ0NTBAcXEuY29tXCIsXHJcbiAgICBcInVybFwiOiBcImh0dHBzOi8vd3d3Lnp5eGdrai5jb20vXCJcclxuICB9LFxyXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxyXG4gIFwiaG9tZXBhZ2VcIjogXCIvXCIsXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxyXG4gICAgXCJzZXJ2ZVwiOiBcInZpdGVcIixcclxuICAgIFwiZG9ja2VyXCI6IFwiZG9ja2VyIGJ1aWxkIC10ICBtZWV0Y29udHJvbC1mcm9udCAuXCIsXHJcbiAgICBcImJ1aWxkOmRldlwiOiBcInZpdGUgYnVpbGQgLS1tb2RlIGRldmVsb3BtZW50XCIsXHJcbiAgICBcImJ1aWxkOmRvY2tlclwiOiBcInZpdGUgYnVpbGQgIC0tbW9kZSBkZXZlbG9wbWVudCAmJiBkb2NrZXIgYnVpbGQgLXQgIG1lZXRjb250cm9sLWZyb250IC5cIixcclxuICAgIFwiYnVpbGQ6dGVzdFwiOiBcInZ1ZS10c2MgJiYgdml0ZSBidWlsZCAtLW1vZGUgdGVzdFwiLFxyXG4gICAgXCJidWlsZDpwcm9cIjogXCIgdml0ZSBidWlsZCAtLW1vZGUgcHJvZHVjdGlvblwiLFxyXG4gICAgXCJ0eXBlOmNoZWNrXCI6IFwidnVlLXRzYyAtLW5vRW1pdCAtLXNraXBMaWJDaGVja1wiLFxyXG4gICAgXCJwcmV2aWV3XCI6IFwibnBtIHJ1biBidWlsZDpkZXYgJiYgdml0ZSBwcmV2aWV3XCIsXHJcbiAgICBcImxpbnQ6ZXNsaW50XCI6IFwiZXNsaW50IC0tZml4IC0tZXh0IC5qcywudHMsLnZ1ZSAuL3NyY1wiLFxyXG4gICAgXCJsaW50OnByZXR0aWVyXCI6IFwicHJldHRpZXIgLS13cml0ZSBcXFwic3JjLyoqLyoue2pzLHRzLGpzb24sdHN4LGNzcyxsZXNzLHNjc3MsdnVlLGh0bWwsbWR9XFxcIlwiLFxyXG4gICAgXCJsaW50OnN0eWxlbGludFwiOiBcInN0eWxlbGludCAtLWNhY2hlIC0tZml4IFxcXCIqKi8qLnt2dWUsbGVzcyxwb3N0Y3NzLGNzcyxzY3NzfVxcXCIgLS1jYWNoZSAtLWNhY2hlLWxvY2F0aW9uIG5vZGVfbW9kdWxlcy8uY2FjaGUvc3R5bGVsaW50L1wiLFxyXG4gICAgXCJsaW50OmxpbnQtc3RhZ2VkXCI6IFwibGludC1zdGFnZWRcIixcclxuICAgIFwicHJlcGFyZVwiOiBcImh1c2t5IGluc3RhbGxcIixcclxuICAgIFwicmVsZWFzZVwiOiBcInN0YW5kYXJkLXZlcnNpb25cIixcclxuICAgIFwiY29tbWl0XCI6IFwiZ2l0IGFkZCAtQSAmJiBjemcgJiYgZ2l0IHB1c2hcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAYW1hcC9hbWFwLWpzYXBpLWxvYWRlclwiOiBcIl4xLjAuMVwiLFxyXG4gICAgXCJAYW1hcC9hbWFwLWpzYXBpLXR5cGVzXCI6IFwiXjAuMC4xM1wiLFxyXG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcIl4yLjEuMFwiLFxyXG4gICAgXCJAaWNvbmlmeS92dWVcIjogXCJeNC4xLjFcIixcclxuICAgIFwiQHZpY29ucy9jYXJib25cIjogXCJeMC4xMi4wXCIsXHJcbiAgICBcIkB2aWNvbnMvaW9uaWNvbnM1XCI6IFwiXjAuMTIuMFwiLFxyXG4gICAgXCJAdnVldXNlL2NvcmVcIjogXCJeMTAuMi4xXCIsXHJcbiAgICBcIkB3YW5nZWRpdG9yL2VkaXRvclwiOiBcIl41LjEuMjNcIixcclxuICAgIFwiQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWVcIjogXCJeNS4xLjEyXCIsXHJcbiAgICBcImF4aW9zXCI6IFwiXjEuNC4wXCIsXHJcbiAgICBcImNvbG9yXCI6IFwiXjQuMi4zXCIsXHJcbiAgICBcImNyeXB0by1qc1wiOiBcIl40LjEuMVwiLFxyXG4gICAgXCJkYXlqc1wiOiBcIl4xLjExLjlcIixcclxuICAgIFwiZG9tLWhlbHBlcnNcIjogXCJeNS4yLjFcIixcclxuICAgIFwiZHJpdmVyLmpzXCI6IFwiXjAuOS44XCIsXHJcbiAgICBcImVjaGFydHNcIjogXCJeNS40LjJcIixcclxuICAgIFwiZWNoYXJ0cy1saXF1aWRmaWxsXCI6IFwiXjMuMS4wXCIsXHJcbiAgICBcImVjaGFydHMtc3RhdFwiOiBcIl4xLjIuMFwiLFxyXG4gICAgXCJlY2hhcnRzLXdvcmRjbG91ZFwiOiBcIl4yLjEuMFwiLFxyXG4gICAgXCJlbGVtZW50LXBsdXNcIjogXCJeMi4zLjRcIixcclxuICAgIFwiZmx2LmpzXCI6IFwiXjEuNi4yXCIsXHJcbiAgICBcImdzYXBcIjogXCJeMy4xMi4xXCIsXHJcbiAgICBcImhpZ2hsaWdodC5qc1wiOiBcIl4xMS44LjBcIixcclxuICAgIFwiaHRtbDJjYW52YXNcIjogXCJeMS40LjFcIixcclxuICAgIFwianMtbWQ1XCI6IFwiXjAuNy4zXCIsXHJcbiAgICBcImtleW1hc3RlclwiOiBcIl4xLjYuMlwiLFxyXG4gICAgXCJsb2Rhc2hcIjogXCJeNC4xNy4yMVwiLFxyXG4gICAgXCJtaW1lbnRcIjogXCJeMC4wLjlcIixcclxuICAgIFwibWl0dFwiOiBcIl4zLjAuMVwiLFxyXG4gICAgXCJtb25hY28tZWRpdG9yXCI6IFwiXjAuMzkuMFwiLFxyXG4gICAgXCJuby12dWUzLWNyb25cIjogXCJeMS4wLjRcIixcclxuICAgIFwibnByb2dyZXNzXCI6IFwiXjAuMi4wXCIsXHJcbiAgICBcInBpbmlhXCI6IFwiXjIuMS40XCIsXHJcbiAgICBcInBpbmlhLXBsdWdpbi1wZXJzaXN0ZWRzdGF0ZVwiOiBcIl4zLjEuMFwiLFxyXG4gICAgXCJwcmludC1qc1wiOiBcIl4xLjYuMFwiLFxyXG4gICAgXCJxc1wiOiBcIl42LjExLjJcIixcclxuICAgIFwic2NyZWVuZnVsbFwiOiBcIl42LjAuMlwiLFxyXG4gICAgXCJzb3J0YWJsZWpzXCI6IFwiXjEuMTUuMFwiLFxyXG4gICAgXCJ0aHJlZVwiOiBcIl4wLjE1My4wXCIsXHJcbiAgICBcInZ1ZVwiOiBcIl4zLjMuNFwiLFxyXG4gICAgXCJ2dWUtZGVtaVwiOiBcIl4wLjE0LjVcIixcclxuICAgIFwidnVlLWkxOG5cIjogXCJeOS4yLjJcIixcclxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjIuNFwiLFxyXG4gICAgXCJ2dWUzLWV2ZW50YnVzXCI6IFwiXjIuMC4wXCIsXHJcbiAgICBcInZ1ZTMtbGF6eWxvYWRcIjogXCJeMC4zLjZcIixcclxuICAgIFwidnVlMy1zZWFtbGVzcy1zY3JvbGxcIjogXCJeMi4wLjFcIixcclxuICAgIFwidnVlMy1za2V0Y2gtcnVsZXJcIjogXCJeMS4zLjlcIixcclxuICAgIFwidnVlZHJhZ2dhYmxlXCI6IFwiXjQuMS4wXCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGNvbW1pdGxpbnQvY2xpXCI6IFwiXjE3LjQuNlwiLFxyXG4gICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwiXjE3LjYuNlwiLFxyXG4gICAgXCJAdHlwZXMvY29sb3JcIjogXCJeMy4wLjNcIixcclxuICAgIFwiQHR5cGVzL2NyeXB0by1qc1wiOiBcIl40LjEuMVwiLFxyXG4gICAgXCJAdHlwZXMvanMtbWQ1XCI6IFwiXjAuNy4wXCIsXHJcbiAgICBcIkB0eXBlcy9rZXltYXN0ZXJcIjogXCJeMS42LjMwXCIsXHJcbiAgICBcIkB0eXBlcy9ucHJvZ3Jlc3NcIjogXCJeMC4yLjBcIixcclxuICAgIFwiQHR5cGVzL3FzXCI6IFwiXjYuOS43XCIsXHJcbiAgICBcIkB0eXBlcy9zb3J0YWJsZWpzXCI6IFwiXjEuMTUuMVwiLFxyXG4gICAgXCJAdHlwZXMvdGhyZWVcIjogXCJeMC4xNTIuMVwiLFxyXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl41LjYxLjBcIixcclxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl41LjYxLjBcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiXjQuMi4zXCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZS1qc3hcIjogXCJeMy4wLjFcIixcclxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTRcIixcclxuICAgIFwiY3otZ2l0XCI6IFwiXjEuNi4xXCIsXHJcbiAgICBcImN6Z1wiOiBcIl4xLjYuMVwiLFxyXG4gICAgXCJlc2xpbnRcIjogXCJeOC40NC4wXCIsXHJcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOC44LjBcIixcclxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIl40LjIuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjE1LjFcIixcclxuICAgIFwiaHVza3lcIjogXCJeOC4wLjNcIixcclxuICAgIFwibGludC1zdGFnZWRcIjogXCJeMTMuMi4wXCIsXHJcbiAgICBcIm5haXZlLXVpXCI6IFwiXjIuMzQuNFwiLFxyXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC4yNVwiLFxyXG4gICAgXCJwb3N0Y3NzLWh0bWxcIjogXCJeMS41LjBcIixcclxuICAgIFwicHJldHRpZXJcIjogXCJeMi44LjhcIixcclxuICAgIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI6IFwiXjUuOS4wXCIsXHJcbiAgICBcInNhc3NcIjogXCJeMS42Mi4xXCIsXHJcbiAgICBcInN0YW5kYXJkLXZlcnNpb25cIjogXCJeOS41LjBcIixcclxuICAgIFwic3R5bGVsaW50XCI6IFwiXjE1LjEwLjFcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1odG1sXCI6IFwiXjEuMS4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctcmVjZXNzLW9yZGVyXCI6IFwiXjQuMi4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctcmVjb21tZW5kZWQtc2Nzc1wiOiBcIl45LjAuMVwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY29tbWVuZGVkLXZ1ZVwiOiBcIl4xLjQuMFwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkXCI6IFwiXjM0LjAuMFwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkLXNjc3NcIjogXCJeNy4wLjFcIixcclxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjEuNlwiLFxyXG4gICAgXCJ0eXBlc2NyaXB0LWVzbGludFwiOiBcIl4wLjAuMS1hbHBoYS4wXCIsXHJcbiAgICBcInVucGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQtcGx1c1wiOiBcIl4xLjAuMFwiLFxyXG4gICAgXCJ2aXRlXCI6IFwiXjQuNC4yXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCI6IFwiXjAuNS4xXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWVzbGludFwiOiBcIl4xLjguMVwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1odG1sXCI6IFwiXjMuMi4wXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLXB3YVwiOiBcIl4wLjE2LjRcIixcclxuICAgIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcInZ1ZS1lY2hhcnRzXCI6IFwiXjYuNS41XCIsXHJcbiAgICBcInZ1ZS10c2NcIjogXCJeMS44LjRcIlxyXG4gIH0sXHJcbiAgXCJlbmdpbmVzXCI6IHtcclxuICAgIFwibm9kZVwiOiBcIj49MTYuMC4wXCJcclxuICB9LFxyXG4gIFwiYnJvd3NlcnNsaXN0XCI6IHtcclxuICAgIFwicHJvZHVjdGlvblwiOiBbXHJcbiAgICAgIFwiPiAxJVwiLFxyXG4gICAgICBcIm5vdCBkZWFkXCIsXHJcbiAgICAgIFwibm90IG9wX21pbmkgYWxsXCJcclxuICAgIF0sXHJcbiAgICBcImRldmVsb3BtZW50XCI6IFtcclxuICAgICAgXCJsYXN0IDEgY2hyb21lIHZlcnNpb25cIixcclxuICAgICAgXCJsYXN0IDEgZmlyZWZveCB2ZXJzaW9uXCIsXHJcbiAgICAgIFwibGFzdCAxIHNhZmFyaSB2ZXJzaW9uXCJcclxuICAgIF1cclxuICB9LFxyXG4gIFwiY29uZmlnXCI6IHtcclxuICAgIFwiY29tbWl0aXplblwiOiB7XHJcbiAgICAgIFwicGF0aFwiOiBcIm5vZGVfbW9kdWxlcy9jei1naXRcIlxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStTLFNBQVMsY0FBYyxlQUFzQztBQUM1VyxTQUFTLFdBQUFBLGdCQUFlOzs7QUNxQmpCLFNBQVMsV0FBVyxTQUE4QjtBQUN2RCxRQUFNLE1BQVcsQ0FBQztBQUVsQixhQUFXLFdBQVcsT0FBTyxLQUFLLE9BQU8sR0FBRztBQUMxQyxRQUFJLFdBQVcsUUFBUSxPQUFPLEVBQUUsUUFBUSxRQUFRLElBQUk7QUFDcEQsZUFBVyxhQUFhLFNBQVMsT0FBTyxhQUFhLFVBQVUsUUFBUTtBQUN2RSxRQUFJLFlBQVk7QUFBYSxpQkFBVyxPQUFPLFFBQVE7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
