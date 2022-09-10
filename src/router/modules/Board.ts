import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/Board",
    name: "Board",
    component: () => import("@/views/Board/index.vue"),
    meta: {
      locale: "统计看板",
      icon: "icon-notification",
    },
  },
];

export default route;
