import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/WorkOrderManagement",
    name: "WorkOrderManagement",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "工单管理",
      icon: "icon-file",
    },
    children: [
      {
        path: "WorkOrderList",
        name: "WorkOrderList",
        component: () => import("@/views/WorkOrderManagement/WorkOrderList/index.vue"),
        meta: {
          permission: "WorkOrderList",
          locale: "工单列表",
        },
      },
      {
        path: "WorkOrderList/:model/:id?",
        name: "WorkOrderListDetail",
        component: () => import("@/views/WorkOrderManagement/WorkOrderList/detail.vue"),
        meta: {
          permission: "WorkOrderList",
          locale: "工单详情",
          addToMenu: false,
        },
      },
      {
        path: "CreateOrder",
        name: "CreateOrder",
        component: () => import("@/views/WorkOrderManagement/WorkOrderList/CreateOrder.vue"),
        meta: {
          permission: "WorkOrderList",
          locale: "工单详情",
          addToMenu: false,
        },
      },
      {
        path: "WorkOrderList/CreateAssociatedWorkOrder/:id",
        name: "CreateWorkOrderAssociatedWorkOrder",
        component: () => import("@/views/WorkOrderManagement/WorkOrderList/CreateAssociatedWorkOrder.vue"),
        meta: {
          addToMenu: false,
          permission: "WorkOrderList",
          locale: "工单详情",
        },
      },
    ],
  },
];

export default route;
