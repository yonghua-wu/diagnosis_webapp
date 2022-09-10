import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/TestPage",
    name: "TestPage",
    component: () => import("@/views/TestPage/index.vue"),
    meta: {
      locale: "测试页",
      icon: "icon-file",
      addToMenu: false,
    },
    children: [
      {
        path: "RdTest",
        name: "RdTest",
        // http://localhost:8080/#/TestPage/RdTest
        component: () => import("@/views/TestPage/RdTest/index.vue"),
        meta: {
          permission: "WorkOrderList",
          locale: "Rd组件测试",
          addToMenu: false,
        },
      },
      {
        path: "CuTest/:model/:id?",
        name: "CuTest",
        // http://localhost:8080/#/TestPage/CuTest/Edit/62a6e5a653316c0001b9ae5d
        component: () => import("@/views/TestPage/CuTest/index.vue"),
        meta: {
          permission: "WorkOrderList",
          locale: "CU组件测试",
          addToMenu: false,
        },
      },
    ],
  },
];

export default route;
