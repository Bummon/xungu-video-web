// vite.config.ts
import { defineConfig, loadEnv } from "file:///F:/Project/xungu-framework-admin/node_modules/vite/dist/node/index.js";
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
import { VitePWA } from "file:///F:/Project/xungu-framework-admin/node_modules/vite-plugin-pwa/dist/index.js";
import { visualizer } from "file:///F:/Project/xungu-framework-admin/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { createHtmlPlugin } from "file:///F:/Project/xungu-framework-admin/node_modules/vite-plugin-html/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///F:/Project/xungu-framework-admin/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import vue from "file:///F:/Project/xungu-framework-admin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///F:/Project/xungu-framework-admin/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import eslintPlugin from "file:///F:/Project/xungu-framework-admin/node_modules/vite-plugin-eslint/dist/index.mjs";
import viteCompression from "file:///F:/Project/xungu-framework-admin/node_modules/vite-plugin-compression/dist/index.mjs";
import vueSetupExtend from "file:///F:/Project/xungu-framework-admin/node_modules/unplugin-vue-setup-extend-plus/dist/vite.js";
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
import dayjs from "file:///F:/Project/xungu-framework-admin/node_modules/dayjs/dayjs.min.js";
var __vite_injected_original_dirname = "F:\\Project\\xungu-framework-admin";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvZ2V0RW52LnRzIiwgImJ1aWxkL3Byb3h5LnRzIiwgImJ1aWxkL3BsdWdpbnMudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjpcXFxcUHJvamVjdFxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXFByb2plY3RcXFxceHVuZ3UtZnJhbWV3b3JrLWFkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9Qcm9qZWN0L3h1bmd1LWZyYW1ld29yay1hZG1pbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiwgQ29uZmlnRW52LCBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IHdyYXBwZXJFbnYgfSBmcm9tIFwiLi9idWlsZC9nZXRFbnZcIjtcclxuaW1wb3J0IHsgY3JlYXRlUHJveHkgfSBmcm9tIFwiLi9idWlsZC9wcm94eVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVWaXRlUGx1Z2lucyB9IGZyb20gXCIuL2J1aWxkL3BsdWdpbnNcIjtcclxuaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcclxuaW1wb3J0IGRheWpzIGZyb20gXCJkYXlqc1wiO1xyXG5cclxuY29uc3QgeyBkZXBlbmRlbmNpZXMsIGRldkRlcGVuZGVuY2llcywgbmFtZSwgdmVyc2lvbiB9ID0gcGtnO1xyXG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XHJcbiAgcGtnOiB7IGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzLCBuYW1lLCB2ZXJzaW9uIH0sXHJcbiAgbGFzdEJ1aWxkVGltZTogZGF5anMoKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpXHJcbn07XHJcblxyXG4vLyBAc2VlOiBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcclxuICBjb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKTtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHJvb3QpO1xyXG4gIGNvbnN0IHZpdGVFbnYgPSB3cmFwcGVyRW52KGVudik7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiB2aXRlRW52LlZJVEVfUFVCTElDX1BBVEgsXHJcbiAgICByb290LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgIFwiQFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgICBcInZ1ZS1pMThuXCI6IFwidnVlLWkxOG4vZGlzdC92dWUtaTE4bi5janMuanNcIlxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIF9fQVBQX0lORk9fXzogSlNPTi5zdHJpbmdpZnkoX19BUFBfSU5GT19fKVxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwiQC9zdHlsZXMvc3R5bGUuc2Nzc1wiO2AsXHJcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgICAgIHBvcnQ6IHZpdGVFbnYuVklURV9QT1JULFxyXG4gICAgICBvcGVuOiB2aXRlRW52LlZJVEVfT1BFTixcclxuICAgICAgY29yczogdHJ1ZSxcclxuICAgICAgLy8gTG9hZCBwcm94eSBjb25maWd1cmF0aW9uIGZyb20gLmVudi5kZXZlbG9wbWVudFxyXG4gICAgICBwcm94eTogY3JlYXRlUHJveHkodml0ZUVudi5WSVRFX1BST1hZKVxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IGNyZWF0ZVZpdGVQbHVnaW5zKHZpdGVFbnYpLFxyXG4gICAgZXNidWlsZDoge1xyXG4gICAgICBwdXJlOiB2aXRlRW52LlZJVEVfRFJPUF9DT05TT0xFID8gW1wiY29uc29sZS5sb2dcIiwgXCJkZWJ1Z2dlclwiXSA6IFtdXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgb3V0RGlyOiBcImRpc3RcIixcclxuICAgICAgbWluaWZ5OiBcImVzYnVpbGRcIixcclxuICAgICAgLy8gZXNidWlsZCBcdTYyNTNcdTUzMDVcdTY2RjRcdTVGRUJcdUZGMENcdTRGNDZcdTY2MkZcdTRFMERcdTgwRkRcdTUzQkJcdTk2NjQgY29uc29sZS5sb2dcdUZGMEN0ZXJzZXJcdTYyNTNcdTUzMDVcdTYxNjJcdUZGMENcdTRGNDZcdTgwRkRcdTUzQkJcdTk2NjQgY29uc29sZS5sb2dcclxuICAgICAgLy8gbWluaWZ5OiBcInRlcnNlclwiLFxyXG4gICAgICAvLyB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIC8vIFx0Y29tcHJlc3M6IHtcclxuICAgICAgLy8gXHRcdGRyb3BfY29uc29sZTogdml0ZUVudi5WSVRFX0RST1BfQ09OU09MRSxcclxuICAgICAgLy8gXHRcdGRyb3BfZGVidWdnZXI6IHRydWVcclxuICAgICAgLy8gXHR9XHJcbiAgICAgIC8vIH0sXHJcbiAgICAgIC8vIFx1Nzk4MVx1NzUyOCBnemlwIFx1NTM4Qlx1N0YyOVx1NTkyN1x1NUMwRlx1NjJBNVx1NTQ0QVx1RkYwQ1x1NTNFRlx1NzU2NVx1NUZBRVx1NTFDRlx1NUMxMVx1NjI1M1x1NTMwNVx1NjVGNlx1OTVGNFxyXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXHJcbiAgICAgIC8vIFx1ODlDNFx1NUI5QVx1ODlFNlx1NTNEMVx1OEI2Nlx1NTQ0QVx1NzY4NCBjaHVuayBcdTU5MjdcdTVDMEZcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAvLyBTdGF0aWMgcmVzb3VyY2UgY2xhc3NpZmljYXRpb24gYW5kIHBhY2thZ2luZ1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwiYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanNcIixcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogXCJhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XVwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjpcXFxcUHJvamVjdFxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXFByb2plY3RcXFxceHVuZ3UtZnJhbWV3b3JrLWFkbWluXFxcXGJ1aWxkXFxcXGdldEVudi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovUHJvamVjdC94dW5ndS1mcmFtZXdvcmstYWRtaW4vYnVpbGQvZ2V0RW52LnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0RldkZuKG1vZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBtb2RlID09PSBcImRldmVsb3BtZW50XCI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1Byb2RGbihtb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gbW9kZSA9PT0gXCJwcm9kdWN0aW9uXCI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1Rlc3RGbihtb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gbW9kZSA9PT0gXCJ0ZXN0XCI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaGV0aGVyIHRvIGdlbmVyYXRlIHBhY2thZ2UgcHJldmlld1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwb3J0TW9kZSgpOiBib29sZWFuIHtcclxuICByZXR1cm4gcHJvY2Vzcy5lbnYuVklURV9SRVBPUlQgPT09IFwidHJ1ZVwiO1xyXG59XHJcblxyXG4vLyBSZWFkIGFsbCBlbnZpcm9ubWVudCB2YXJpYWJsZSBjb25maWd1cmF0aW9uIGZpbGVzIHRvIHByb2Nlc3MuZW52XHJcbmV4cG9ydCBmdW5jdGlvbiB3cmFwcGVyRW52KGVudkNvbmY6IFJlY29yZGFibGUpOiBWaXRlRW52IHtcclxuICBjb25zdCByZXQ6IGFueSA9IHt9O1xyXG5cclxuICBmb3IgKGNvbnN0IGVudk5hbWUgb2YgT2JqZWN0LmtleXMoZW52Q29uZikpIHtcclxuICAgIGxldCByZWFsTmFtZSA9IGVudkNvbmZbZW52TmFtZV0ucmVwbGFjZSgvXFxcXG4vZywgXCJcXG5cIik7XHJcbiAgICByZWFsTmFtZSA9IHJlYWxOYW1lID09PSBcInRydWVcIiA/IHRydWUgOiByZWFsTmFtZSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiByZWFsTmFtZTtcclxuICAgIGlmIChlbnZOYW1lID09PSBcIlZJVEVfUE9SVFwiKSByZWFsTmFtZSA9IE51bWJlcihyZWFsTmFtZSk7XHJcbiAgICBpZiAoZW52TmFtZSA9PT0gXCJWSVRFX1BST1hZXCIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZWFsTmFtZSA9IEpTT04ucGFyc2UocmVhbE5hbWUpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgIH1cclxuICAgIHJldFtlbnZOYW1lXSA9IHJlYWxOYW1lO1xyXG4gIH1cclxuICByZXR1cm4gcmV0O1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHVzZXIgcm9vdCBkaXJlY3RvcnlcclxuICogQHBhcmFtIGRpciBmaWxlIHBhdGhcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSb290UGF0aCguLi5kaXI6IHN0cmluZ1tdKSB7XHJcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAuLi5kaXIpO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjpcXFxcUHJvamVjdFxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXFByb2plY3RcXFxceHVuZ3UtZnJhbWV3b3JrLWFkbWluXFxcXGJ1aWxkXFxcXHByb3h5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9Qcm9qZWN0L3h1bmd1LWZyYW1ld29yay1hZG1pbi9idWlsZC9wcm94eS50c1wiO2ltcG9ydCB0eXBlIHsgUHJveHlPcHRpb25zIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbnR5cGUgUHJveHlJdGVtID0gW3N0cmluZywgc3RyaW5nXTtcclxuXHJcbnR5cGUgUHJveHlMaXN0ID0gUHJveHlJdGVtW107XHJcblxyXG50eXBlIFByb3h5VGFyZ2V0TGlzdCA9IFJlY29yZDxzdHJpbmcsIFByb3h5T3B0aW9ucz47XHJcblxyXG4vKipcclxuICogXHU1MjFCXHU1RUZBXHU0RUUzXHU3NDA2XHVGRjBDXHU3NTI4XHU0RThFXHU4OUUzXHU2NzkwIC5lbnYuZGV2ZWxvcG1lbnQgXHU0RUUzXHU3NDA2XHU5MTREXHU3RjZFXHJcbiAqIEBwYXJhbSBsaXN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJveHkobGlzdDogUHJveHlMaXN0ID0gW10pIHtcclxuICBjb25zdCByZXQ6IFByb3h5VGFyZ2V0TGlzdCA9IHt9O1xyXG4gIGZvciAoY29uc3QgW3ByZWZpeCwgdGFyZ2V0XSBvZiBsaXN0KSB7XHJcbiAgICBjb25zdCBodHRwc1JFID0gL15odHRwczpcXC9cXC8vO1xyXG4gICAgY29uc3QgaXNIdHRwcyA9IGh0dHBzUkUudGVzdCh0YXJnZXQpO1xyXG5cclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9odHRwLXBhcnR5L25vZGUtaHR0cC1wcm94eSNvcHRpb25zXHJcbiAgICByZXRbcHJlZml4XSA9IHtcclxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgd3M6IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke3ByZWZpeH1gKSwgXCJcIiksXHJcbiAgICAgIC8vIGh0dHBzIGlzIHJlcXVpcmUgc2VjdXJlPWZhbHNlXHJcbiAgICAgIC4uLihpc0h0dHBzID8geyBzZWN1cmU6IGZhbHNlIH0gOiB7fSlcclxuICAgIH07XHJcbiAgfVxyXG4gIHJldHVybiByZXQ7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxQcm9qZWN0XFxcXHh1bmd1LWZyYW1ld29yay1hZG1pblxcXFxidWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcUHJvamVjdFxcXFx4dW5ndS1mcmFtZXdvcmstYWRtaW5cXFxcYnVpbGRcXFxccGx1Z2lucy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovUHJvamVjdC94dW5ndS1mcmFtZXdvcmstYWRtaW4vYnVpbGQvcGx1Z2lucy50c1wiO2ltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLWh0bWxcIjtcclxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcbmltcG9ydCBlc2xpbnRQbHVnaW4gZnJvbSBcInZpdGUtcGx1Z2luLWVzbGludFwiO1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvblwiO1xyXG5pbXBvcnQgdnVlU2V0dXBFeHRlbmQgZnJvbSBcInVucGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQtcGx1cy92aXRlXCI7XHJcblxyXG4vKipcclxuICogXHU1MjFCXHU1RUZBIHZpdGUgXHU2M0QyXHU0RUY2XHJcbiAqIEBwYXJhbSB2aXRlRW52XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlVml0ZVBsdWdpbnMgPSAodml0ZUVudjogVml0ZUVudik6IChQbHVnaW5PcHRpb24gfCBQbHVnaW5PcHRpb25bXSlbXSA9PiB7XHJcbiAgY29uc3QgeyBWSVRFX0dMT0JfQVBQX1RJVExFLCBWSVRFX1JFUE9SVCwgVklURV9QV0EgfSA9IHZpdGVFbnY7XHJcbiAgcmV0dXJuIFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgLy8gdnVlIFx1NTNFRlx1NEVFNVx1NEY3Rlx1NzUyOCBqc3gvdHN4IFx1OEJFRFx1NkNENVxyXG4gICAgdnVlSnN4KCksXHJcbiAgICAvLyBlc0xpbnQgXHU2MkE1XHU5NTE5XHU0RkUxXHU2MDZGXHU2NjNFXHU3OTNBXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3NTRDXHU5NzYyXHU0RTBBXHJcbiAgICBlc2xpbnRQbHVnaW4oKSxcclxuICAgIC8vIG5hbWUgXHU1M0VGXHU0RUU1XHU1MTk5XHU1NzI4IHNjcmlwdCBcdTY4MDdcdTdCN0VcdTRFMEFcclxuICAgIHZ1ZVNldHVwRXh0ZW5kKHt9KSxcclxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjI1M1x1NTMwNVx1NTM4Qlx1N0YyOVx1OTE0RFx1N0Y2RVxyXG4gICAgY3JlYXRlQ29tcHJlc3Npb24odml0ZUVudiksXHJcbiAgICAvLyBcdTZDRThcdTUxNjVcdTUzRDhcdTkxQ0ZcdTUyMzAgaHRtbCBcdTY1ODdcdTRFRjZcclxuICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICBpbmplY3Q6IHtcclxuICAgICAgICBkYXRhOiB7IHRpdGxlOiBWSVRFX0dMT0JfQVBQX1RJVExFIH1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICAvLyBcdTRGN0ZcdTc1Mjggc3ZnIFx1NTZGRVx1NjgwN1xyXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgICBpY29uRGlyczogW3Jlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJzcmMvYXNzZXRzL2ljb25zXCIpXSxcclxuICAgICAgc3ltYm9sSWQ6IFwiaWNvbi1bZGlyXS1bbmFtZV1cIlxyXG4gICAgfSksXHJcbiAgICAvLyB2aXRlUFdBXHJcbiAgICBWSVRFX1BXQSAmJiBjcmVhdGVWaXRlUHdhKHZpdGVFbnYpLFxyXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU3NTFGXHU2MjEwXHU1MzA1XHU5ODg0XHU4OUM4XHVGRjBDXHU1MjA2XHU2NzkwXHU0RjlEXHU4RDU2XHU1MzA1XHU1OTI3XHU1QzBGXHU1MDVBXHU0RjE4XHU1MzE2XHU1OTA0XHU3NDA2XHJcbiAgICBWSVRFX1JFUE9SVCAmJiAodmlzdWFsaXplcih7IGZpbGVuYW1lOiBcInN0YXRzLmh0bWxcIiwgZ3ppcFNpemU6IHRydWUsIGJyb3RsaVNpemU6IHRydWUgfSkgYXMgUGx1Z2luT3B0aW9uKVxyXG4gIF07XHJcbn07XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIFx1NjgzOVx1NjM2RSBjb21wcmVzcyBcdTkxNERcdTdGNkVcdUZGMENcdTc1MUZcdTYyMTBcdTRFMERcdTU0MENcdTc2ODRcdTUzOEJcdTdGMjlcdTg5QzRcdTUyMTlcclxuICogQHBhcmFtIHZpdGVFbnZcclxuICovXHJcbmNvbnN0IGNyZWF0ZUNvbXByZXNzaW9uID0gKHZpdGVFbnY6IFZpdGVFbnYpOiBQbHVnaW5PcHRpb24gfCBQbHVnaW5PcHRpb25bXSA9PiB7XHJcbiAgY29uc3QgeyBWSVRFX0JVSUxEX0NPTVBSRVNTID0gXCJub25lXCIsIFZJVEVfQlVJTERfQ09NUFJFU1NfREVMRVRFX09SSUdJTl9GSUxFIH0gPSB2aXRlRW52O1xyXG4gIGNvbnN0IGNvbXByZXNzTGlzdCA9IFZJVEVfQlVJTERfQ09NUFJFU1Muc3BsaXQoXCIsXCIpO1xyXG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gW107XHJcblxyXG4gIGlmIChjb21wcmVzc0xpc3QuaW5jbHVkZXMoXCJnemlwXCIpKSB7XHJcbiAgICBwbHVnaW5zLnB1c2goXHJcbiAgICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgICAgZXh0OiBcIi5nelwiLFxyXG4gICAgICAgIGFsZ29yaXRobTogXCJnemlwXCIsXHJcbiAgICAgICAgZGVsZXRlT3JpZ2luRmlsZTogVklURV9CVUlMRF9DT01QUkVTU19ERUxFVEVfT1JJR0lOX0ZJTEVcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG4gIGlmIChjb21wcmVzc0xpc3QuaW5jbHVkZXMoXCJicm90bGlcIikpIHtcclxuICAgIHBsdWdpbnMucHVzaChcclxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICBleHQ6IFwiLmJyXCIsXHJcbiAgICAgICAgYWxnb3JpdGhtOiBcImJyb3RsaUNvbXByZXNzXCIsXHJcbiAgICAgICAgZGVsZXRlT3JpZ2luRmlsZTogVklURV9CVUlMRF9DT01QUkVTU19ERUxFVEVfT1JJR0lOX0ZJTEVcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG4gIHJldHVybiBwbHVnaW5zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBWaXRlUHdhXHJcbiAqIEBwYXJhbSB2aXRlRW52XHJcbiAqL1xyXG5jb25zdCBjcmVhdGVWaXRlUHdhID0gKHZpdGVFbnY6IFZpdGVFbnYpOiBQbHVnaW5PcHRpb24gfCBQbHVnaW5PcHRpb25bXSA9PiB7XHJcbiAgY29uc3QgeyBWSVRFX0dMT0JfQVBQX1RJVExFIH0gPSB2aXRlRW52O1xyXG4gIHJldHVybiBWaXRlUFdBKHtcclxuICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXHJcbiAgICBtYW5pZmVzdDoge1xyXG4gICAgICBuYW1lOiBWSVRFX0dMT0JfQVBQX1RJVExFLFxyXG4gICAgICBzaG9ydF9uYW1lOiBWSVRFX0dMT0JfQVBQX1RJVExFLFxyXG4gICAgICB0aGVtZV9jb2xvcjogXCIjZmZmZmZmXCIsXHJcbiAgICAgIGljb25zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcIi9sb2dvLnBuZ1wiLFxyXG4gICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcIi9sb2dvLnBuZ1wiLFxyXG4gICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcIi9sb2dvLnBuZ1wiLFxyXG4gICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIHB1cnBvc2U6IFwiYW55IG1hc2thYmxlXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9KTtcclxufTtcclxuIiwgIntcclxuICBcIm5hbWVcIjogXCJ4dW5ndS1jb250cm9sXCIsXHJcbiAgXCJwcml2YXRlXCI6IHRydWUsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcclxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcclxuICBcImRlc2NyaXB0aW9uXCI6IFwibWVkaWEgaW5mb3JtYXRpb24gY29udHJvbCBcIixcclxuICBcImF1dGhvclwiOiB7XHJcbiAgICBcIm5hbWVcIjogXCJ4dW5ndVwiLFxyXG4gICAgXCJlbWFpbFwiOiBcIjU5Nzk3NDQ1MEBxcS5jb21cIixcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly93d3cuenl4Z2tqLmNvbS9cIlxyXG4gIH0sXHJcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXHJcbiAgXCJob21lcGFnZVwiOiBcIi9cIixcclxuICBcInNjcmlwdHNcIjoge1xyXG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXHJcbiAgICBcInNlcnZlXCI6IFwidml0ZVwiLFxyXG4gICAgXCJkb2NrZXJcIjogXCJkb2NrZXIgYnVpbGQgLXQgIG1lZXRjb250cm9sLWZyb250IC5cIixcclxuICAgIFwiYnVpbGQ6ZGV2XCI6IFwidml0ZSBidWlsZCAtLW1vZGUgZGV2ZWxvcG1lbnRcIixcclxuICAgIFwiYnVpbGQ6ZG9ja2VyXCI6IFwidml0ZSBidWlsZCAgLS1tb2RlIGRldmVsb3BtZW50ICYmIGRvY2tlciBidWlsZCAtdCAgbWVldGNvbnRyb2wtZnJvbnQgLlwiLFxyXG4gICAgXCJidWlsZDp0ZXN0XCI6IFwidnVlLXRzYyAmJiB2aXRlIGJ1aWxkIC0tbW9kZSB0ZXN0XCIsXHJcbiAgICBcImJ1aWxkOnByb1wiOiBcIiB2aXRlIGJ1aWxkIC0tbW9kZSBwcm9kdWN0aW9uXCIsXHJcbiAgICBcInR5cGU6Y2hlY2tcIjogXCJ2dWUtdHNjIC0tbm9FbWl0IC0tc2tpcExpYkNoZWNrXCIsXHJcbiAgICBcInByZXZpZXdcIjogXCJucG0gcnVuIGJ1aWxkOmRldiAmJiB2aXRlIHByZXZpZXdcIixcclxuICAgIFwibGludDplc2xpbnRcIjogXCJlc2xpbnQgLS1maXggLS1leHQgLmpzLC50cywudnVlIC4vc3JjXCIsXHJcbiAgICBcImxpbnQ6cHJldHRpZXJcIjogXCJwcmV0dGllciAtLXdyaXRlIFxcXCJzcmMvKiovKi57anMsdHMsanNvbix0c3gsY3NzLGxlc3Msc2Nzcyx2dWUsaHRtbCxtZH1cXFwiXCIsXHJcbiAgICBcImxpbnQ6c3R5bGVsaW50XCI6IFwic3R5bGVsaW50IC0tY2FjaGUgLS1maXggXFxcIioqLyoue3Z1ZSxsZXNzLHBvc3Rjc3MsY3NzLHNjc3N9XFxcIiAtLWNhY2hlIC0tY2FjaGUtbG9jYXRpb24gbm9kZV9tb2R1bGVzLy5jYWNoZS9zdHlsZWxpbnQvXCIsXHJcbiAgICBcImxpbnQ6bGludC1zdGFnZWRcIjogXCJsaW50LXN0YWdlZFwiLFxyXG4gICAgXCJwcmVwYXJlXCI6IFwiaHVza3kgaW5zdGFsbFwiLFxyXG4gICAgXCJyZWxlYXNlXCI6IFwic3RhbmRhcmQtdmVyc2lvblwiLFxyXG4gICAgXCJjb21taXRcIjogXCJnaXQgYWRkIC1BICYmIGN6ZyAmJiBnaXQgcHVzaFwiXHJcbiAgfSxcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBhbWFwL2FtYXAtanNhcGktbG9hZGVyXCI6IFwiXjEuMC4xXCIsXHJcbiAgICBcIkBhbWFwL2FtYXAtanNhcGktdHlwZXNcIjogXCJeMC4wLjEzXCIsXHJcbiAgICBcIkBlbGVtZW50LXBsdXMvaWNvbnMtdnVlXCI6IFwiXjIuMS4wXCIsXHJcbiAgICBcIkBpY29uaWZ5L3Z1ZVwiOiBcIl40LjEuMVwiLFxyXG4gICAgXCJAdmljb25zL2NhcmJvblwiOiBcIl4wLjEyLjBcIixcclxuICAgIFwiQHZpY29ucy9pb25pY29uczVcIjogXCJeMC4xMi4wXCIsXHJcbiAgICBcIkB2dWV1c2UvY29yZVwiOiBcIl4xMC4yLjFcIixcclxuICAgIFwiQHdhbmdlZGl0b3IvZWRpdG9yXCI6IFwiXjUuMS4yM1wiLFxyXG4gICAgXCJAd2FuZ2VkaXRvci9lZGl0b3ItZm9yLXZ1ZVwiOiBcIl41LjEuMTJcIixcclxuICAgIFwiYXhpb3NcIjogXCJeMS40LjBcIixcclxuICAgIFwiY29sb3JcIjogXCJeNC4yLjNcIixcclxuICAgIFwiY3J5cHRvLWpzXCI6IFwiXjQuMS4xXCIsXHJcbiAgICBcImRheWpzXCI6IFwiXjEuMTEuOVwiLFxyXG4gICAgXCJkb20taGVscGVyc1wiOiBcIl41LjIuMVwiLFxyXG4gICAgXCJkcml2ZXIuanNcIjogXCJeMC45LjhcIixcclxuICAgIFwiZWNoYXJ0c1wiOiBcIl41LjQuMlwiLFxyXG4gICAgXCJlY2hhcnRzLWxpcXVpZGZpbGxcIjogXCJeMy4xLjBcIixcclxuICAgIFwiZWNoYXJ0cy1zdGF0XCI6IFwiXjEuMi4wXCIsXHJcbiAgICBcImVjaGFydHMtd29yZGNsb3VkXCI6IFwiXjIuMS4wXCIsXHJcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjMuNFwiLFxyXG4gICAgXCJmbHYuanNcIjogXCJeMS42LjJcIixcclxuICAgIFwiZ3NhcFwiOiBcIl4zLjEyLjFcIixcclxuICAgIFwiaGlnaGxpZ2h0LmpzXCI6IFwiXjExLjguMFwiLFxyXG4gICAgXCJodG1sMmNhbnZhc1wiOiBcIl4xLjQuMVwiLFxyXG4gICAgXCJqcy1tZDVcIjogXCJeMC43LjNcIixcclxuICAgIFwia2V5bWFzdGVyXCI6IFwiXjEuNi4yXCIsXHJcbiAgICBcImxvZGFzaFwiOiBcIl40LjE3LjIxXCIsXHJcbiAgICBcIm1pbWVudFwiOiBcIl4wLjAuOVwiLFxyXG4gICAgXCJtaXR0XCI6IFwiXjMuMC4xXCIsXHJcbiAgICBcIm1vbmFjby1lZGl0b3JcIjogXCJeMC4zOS4wXCIsXHJcbiAgICBcIm5vLXZ1ZTMtY3JvblwiOiBcIl4xLjAuNFwiLFxyXG4gICAgXCJucHJvZ3Jlc3NcIjogXCJeMC4yLjBcIixcclxuICAgIFwicGluaWFcIjogXCJeMi4xLjRcIixcclxuICAgIFwicGluaWEtcGx1Z2luLXBlcnNpc3RlZHN0YXRlXCI6IFwiXjMuMS4wXCIsXHJcbiAgICBcInByaW50LWpzXCI6IFwiXjEuNi4wXCIsXHJcbiAgICBcInFzXCI6IFwiXjYuMTEuMlwiLFxyXG4gICAgXCJzY3JlZW5mdWxsXCI6IFwiXjYuMC4yXCIsXHJcbiAgICBcInNvcnRhYmxlanNcIjogXCJeMS4xNS4wXCIsXHJcbiAgICBcInRocmVlXCI6IFwiXjAuMTUzLjBcIixcclxuICAgIFwidnVlXCI6IFwiXjMuMy40XCIsXHJcbiAgICBcInZ1ZS1kZW1pXCI6IFwiXjAuMTQuNVwiLFxyXG4gICAgXCJ2dWUtaTE4blwiOiBcIl45LjIuMlwiLFxyXG4gICAgXCJ2dWUtcm91dGVyXCI6IFwiXjQuMi40XCIsXHJcbiAgICBcInZ1ZTMtZXZlbnRidXNcIjogXCJeMi4wLjBcIixcclxuICAgIFwidnVlMy1sYXp5bG9hZFwiOiBcIl4wLjMuNlwiLFxyXG4gICAgXCJ2dWUzLXNlYW1sZXNzLXNjcm9sbFwiOiBcIl4yLjAuMVwiLFxyXG4gICAgXCJ2dWUzLXNrZXRjaC1ydWxlclwiOiBcIl4xLjMuOVwiLFxyXG4gICAgXCJ2dWVkcmFnZ2FibGVcIjogXCJeNC4xLjBcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAY29tbWl0bGludC9jbGlcIjogXCJeMTcuNC42XCIsXHJcbiAgICBcIkBjb21taXRsaW50L2NvbmZpZy1jb252ZW50aW9uYWxcIjogXCJeMTcuNi42XCIsXHJcbiAgICBcIkB0eXBlcy9jb2xvclwiOiBcIl4zLjAuM1wiLFxyXG4gICAgXCJAdHlwZXMvY3J5cHRvLWpzXCI6IFwiXjQuMS4xXCIsXHJcbiAgICBcIkB0eXBlcy9qcy1tZDVcIjogXCJeMC43LjBcIixcclxuICAgIFwiQHR5cGVzL2tleW1hc3RlclwiOiBcIl4xLjYuMzBcIixcclxuICAgIFwiQHR5cGVzL25wcm9ncmVzc1wiOiBcIl4wLjIuMFwiLFxyXG4gICAgXCJAdHlwZXMvcXNcIjogXCJeNi45LjdcIixcclxuICAgIFwiQHR5cGVzL3NvcnRhYmxlanNcIjogXCJeMS4xNS4xXCIsXHJcbiAgICBcIkB0eXBlcy90aHJlZVwiOiBcIl4wLjE1Mi4xXCIsXHJcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjUuNjEuMFwiLFxyXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjUuNjEuMFwiLFxyXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNC4yLjNcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiOiBcIl4zLjAuMVwiLFxyXG4gICAgXCJhdXRvcHJlZml4ZXJcIjogXCJeMTAuNC4xNFwiLFxyXG4gICAgXCJjei1naXRcIjogXCJeMS42LjFcIixcclxuICAgIFwiY3pnXCI6IFwiXjEuNi4xXCIsXHJcbiAgICBcImVzbGludFwiOiBcIl44LjQ0LjBcIixcclxuICAgIFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl44LjguMFwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjQuMi4xXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tdnVlXCI6IFwiXjkuMTUuMVwiLFxyXG4gICAgXCJodXNreVwiOiBcIl44LjAuM1wiLFxyXG4gICAgXCJsaW50LXN0YWdlZFwiOiBcIl4xMy4yLjBcIixcclxuICAgIFwibmFpdmUtdWlcIjogXCJeMi4zNC40XCIsXHJcbiAgICBcInBvc3Rjc3NcIjogXCJeOC40LjI1XCIsXHJcbiAgICBcInBvc3Rjc3MtaHRtbFwiOiBcIl4xLjUuMFwiLFxyXG4gICAgXCJwcmV0dGllclwiOiBcIl4yLjguOFwiLFxyXG4gICAgXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjogXCJeNS45LjBcIixcclxuICAgIFwic2Fzc1wiOiBcIl4xLjYyLjFcIixcclxuICAgIFwic3RhbmRhcmQtdmVyc2lvblwiOiBcIl45LjUuMFwiLFxyXG4gICAgXCJzdHlsZWxpbnRcIjogXCJeMTUuMTAuMVwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLWh0bWxcIjogXCJeMS4xLjBcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNlc3Mtb3JkZXJcIjogXCJeNC4yLjBcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC1zY3NzXCI6IFwiXjkuMC4xXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctcmVjb21tZW5kZWQtdnVlXCI6IFwiXjEuNC4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmRcIjogXCJeMzQuMC4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmQtc2Nzc1wiOiBcIl43LjAuMVwiLFxyXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMS42XCIsXHJcbiAgICBcInR5cGVzY3JpcHQtZXNsaW50XCI6IFwiXjAuMC4xLWFscGhhLjBcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLXNldHVwLWV4dGVuZC1wbHVzXCI6IFwiXjEuMC4wXCIsXHJcbiAgICBcInZpdGVcIjogXCJeNC40LjJcIixcclxuICAgIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjogXCJeMC41LjFcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZXNsaW50XCI6IFwiXjEuOC4xXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWh0bWxcIjogXCJeMy4yLjBcIixcclxuICAgIFwidml0ZS1wbHVnaW4tcHdhXCI6IFwiXjAuMTYuNFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjogXCJeMi4wLjFcIixcclxuICAgIFwidnVlLWVjaGFydHNcIjogXCJeNi41LjVcIixcclxuICAgIFwidnVlLXRzY1wiOiBcIl4xLjguNFwiXHJcbiAgfSxcclxuICBcImVuZ2luZXNcIjoge1xyXG4gICAgXCJub2RlXCI6IFwiPj0xNi4wLjBcIlxyXG4gIH0sXHJcbiAgXCJicm93c2Vyc2xpc3RcIjoge1xyXG4gICAgXCJwcm9kdWN0aW9uXCI6IFtcclxuICAgICAgXCI+IDElXCIsXHJcbiAgICAgIFwibm90IGRlYWRcIixcclxuICAgICAgXCJub3Qgb3BfbWluaSBhbGxcIlxyXG4gICAgXSxcclxuICAgIFwiZGV2ZWxvcG1lbnRcIjogW1xyXG4gICAgICBcImxhc3QgMSBjaHJvbWUgdmVyc2lvblwiLFxyXG4gICAgICBcImxhc3QgMSBmaXJlZm94IHZlcnNpb25cIixcclxuICAgICAgXCJsYXN0IDEgc2FmYXJpIHZlcnNpb25cIlxyXG4gICAgXVxyXG4gIH0sXHJcbiAgXCJjb25maWdcIjoge1xyXG4gICAgXCJjb21taXRpemVuXCI6IHtcclxuICAgICAgXCJwYXRoXCI6IFwibm9kZV9tb2R1bGVzL2N6LWdpdFwiXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1IsU0FBUyxjQUFjLGVBQXNDO0FBQ3JWLFNBQVMsV0FBQUEsZ0JBQWU7OztBQ3FCakIsU0FBUyxXQUFXLFNBQThCO0FBQ3ZELFFBQU0sTUFBVyxDQUFDO0FBRWxCLGFBQVcsV0FBVyxPQUFPLEtBQUssT0FBTyxHQUFHO0FBQzFDLFFBQUksV0FBVyxRQUFRLE9BQU8sRUFBRSxRQUFRLFFBQVEsSUFBSTtBQUNwRCxlQUFXLGFBQWEsU0FBUyxPQUFPLGFBQWEsVUFBVSxRQUFRO0FBQ3ZFLFFBQUksWUFBWTtBQUFhLGlCQUFXLE9BQU8sUUFBUTtBQUN2RCxRQUFJLFlBQVksY0FBYztBQUM1QixVQUFJO0FBQ0YsbUJBQVcsS0FBSyxNQUFNLFFBQVE7QUFBQSxNQUNoQyxTQUFTLE9BQU87QUFBQSxNQUFDO0FBQUEs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
