import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/AssetManagement",
    name: "AssetManagement",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "资产管理",
      icon: "icon-bookmark",
    },
    children: [
      {
        path: "HouseDynamicTable",
        name: "HouseDynamicTable",
        component: () => import("@/views/AssetManagement/HouseDynamicTable/index.vue"),
        meta: {
          permission: "HouseDynamicTable",
          locale: "房屋动态表",
        },
      },
      {
        path: "BillManagement",
        name: "BillManagement",
        component: () => import("@/views/AssetManagement/BillManagement/index.vue"),
        meta: {
          permission: "BillManagement",
          locale: "账单管理",
        },
      },
      {
        path: "BillManagement/:model/:id?",
        name: "BillManagementDetail",
        component: () => import("@/views/AssetManagement/BillManagement/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "BillManagement",
          locale: "账单管理",
        },
      },
    ],
  },
];

export default route;
