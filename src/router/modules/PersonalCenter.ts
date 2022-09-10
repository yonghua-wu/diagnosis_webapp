import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/PersonalCenter",
    name: "PersonalCenter",
    component: () => import("@/views/PersonalCenter/index.vue"),
    meta: {
      locate: "个人中心",
      addToMenu: false,
    },
  },
];

export default route;
