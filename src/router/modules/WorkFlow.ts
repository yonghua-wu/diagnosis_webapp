import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/WorkFlow",
    name: "WorkFlow",
    component: () => import("@/views/WorkFlow/index.vue"),
    meta: {
      locale: "流程管理",
      icon: "icon-file",
      addToMenu: false,
    },
    children: [
      {
        path: "ProcessGroup",
        name: "ProcessGroup",
        // http://localhost:8080/#/WorkFlow/ProcessGroup
        component: () => import("@/views/WorkFlow/ProcessGroup/index.vue"),
        meta: {
          permission: "OrderList",
          locale: "Rd组件测试",
          addToMenu: false,
        },
      },
    ],
  },
];

export default route;
