import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/EnviromentManagement",
    name: "EnviromentManagement",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "环境管理",
      icon: "icon-public",
    },
    children: [
      {
        path: "PatrolPlan",
        name: "EnviromentPatrolPlan",
        component: () => import("@/views/EnvironmentalManagement/PatrolPlan/index.vue"),
        meta: {
          // permission: "EnviromentManagementPlan",
          permission: "EnviromentPatrolPlan",
          locale: "日常工作计划",
        },
      },
      {
        path: "PatrolPlan/:model/:id?",
        name: "EnviromentPatrolPlanDetail",
        component: () => import("@/views/EnvironmentalManagement/PatrolPlan/detail.vue"),
        meta: {
          addToMenu: false,
          // permission: "EnviromentManagementPlan",
          permission: "EnviromentPatrolPlan",
          locale: "日常工作计划",
        },
      },
      {
        path: "RoutingConfiguration",
        name: "EnviromentRoutingConfiguration",
        component: () => import("@/views/EnvironmentalManagement/RoutingConfiguration/index.vue"),
        meta: {
          permission: "EnviromentRoutingConfiguration",
          locale: "工作路线配置",
        },
      },
      {
        path: "RoutingConfiguration/:model/:id?",
        name: "EnviromentRoutingConfigurationDetail",
        component: () => import("@/views/EnvironmentalManagement/RoutingConfiguration/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "EnviromentRoutingConfiguration",
          locale: "工作路线配置",
        },
      },
    ],
  },
];

export default route;
