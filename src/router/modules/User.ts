import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/User",
    name: "User",
    component: () => import("@/views/User/index.vue"),
    meta: {
      locale: "医生管理",
      icon: "icon-file",
      addToMenu: true,
    },
  },
  {
    path: "/User/:model/:id?",
    name: "UserDetail",
    component: () => import("@/views/User/detail.vue"),
    meta: {
      locale: "医生管理",
      icon: "icon-file",
      addToMenu: false,
    },
  },
];

export default route;
