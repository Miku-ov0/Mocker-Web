import { createApp } from "vue";
import router from "./routes";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import 'highlight.js/styles/github.css'
// import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import hljs from 'highlight.js/lib/core';

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(hljsVuePlugin)
app.mount("#app");
