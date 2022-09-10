import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/QualityManagement",
    name: "QualityManagement",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "品质管理",
      icon: "icon-bookmark",
    },
    children: [
      {
        path: "PatrolPlan",
        name: "QualityPatrolPlan",
        component: () => import("@/views/QualityManagement/PatrolPlan/index.vue"),
        meta: {
          permission: "QualityPatrolPlan",
          locale: "品质巡检计划",
        },
      },
      {
        path: "PatrolPlan/:model/:id?",
        name: "QualityPatrolPlanDetail",
        component: () => import("@/views/QualityManagement/PatrolPlan/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "QualityPatrolPlan",
          locale: "品质巡检计划",
        },
      },
      {
        path: "RoutingConfiguration",
        name: "QualityRoutingConfiguration",
        component: () => import("@/views/QualityManagement/RoutingConfiguration/index.vue"),
        meta: {
          permission: "QualityRoutingConfiguration",
          locale: "路线配置",
        },
      },
      {
        path: "RoutingConfiguration/:model/:id?",
        name: "QualityRoutingConfigurationDetail",
        component: () => import("@/views/QualityManagement/RoutingConfiguration/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "QualityRoutingConfiguration",
          locale: "路线配置",
        },
      },
    ],
  },
];

export default route;
