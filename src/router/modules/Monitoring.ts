import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/Monitoring",
    name: "Monitoring",
    component: () => import("@/views/Monitoring/index.vue"),
    meta: {
      locale: "监控中心",

      icon: "icon-bookmark",
    },
    children: [
      {
        path: "RealtimeVideo",
        name: "RealtimeVideo",
        component: () => import("@/views/Monitoring/RealtimeVideo/index.vue"),
        meta: {
          locale: "实时视频",
          permission: "RealtimeVideo",
        },
      },
    ],
  },
];

export default route;
