import { createRouter, createWebHashHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

// 首页
const Home = () => import("../pages/home/Home.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "homePage",
    component: Home,
    meta: {
      title: "首页",
    },
  },
  // 不识别的路由自动跳 home 页
  {
    path: "/:catchAll(.*)",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
