import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/Casebook",
    name: "Casebook",
    component: () => import("@/views/Casebook/index.vue"),
    meta: {
      locale: "病例管理",
      icon: "icon-file",
      addToMenu: true,
    },
  },
  {
    path: "/Casebook/:model/:id?",
    name: "CasebookDetail",
    component: () => import("@/views/Casebook/detail.vue"),
    meta: {
      locale: "病例管理",
      icon: "icon-file",
      addToMenu: false,
    },
  },
  {
    path: "/Casebook/View/:id?",
    name: "CasebookView",
    component: () => import("@/views/Casebook/View.vue"),
    meta: {
      locale: "病例管理",
      icon: "icon-file",
      addToMenu: false,
    },
  },
];

export default route;
