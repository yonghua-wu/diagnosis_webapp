import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/Model",
    name: "Model",
    component: () => import("@/views/Model/index.vue"),
    meta: {
      locale: "模型管理",
      icon: "icon-model",
      addToMenu: true,
    },
  },
  {
    path: "/Model/:model/:id?",
    name: "ModelDetail",
    component: () => import("@/views/Model/detail.vue"),
    meta: {
      locale: "模型管理",
      icon: "icon-model",
      addToMenu: false,
    },
  },
];

export default route;
