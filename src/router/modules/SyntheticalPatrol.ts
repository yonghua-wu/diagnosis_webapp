import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/SyntheticalPatrol",
    name: "SyntheticalPatrol",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "综合巡逻",
      icon: "icon-share-alt",
    },
    children: [
      {
        path: "PatrolPlan",
        name: "SyntheticalPatrolPlan",
        component: () => import("@/views/SyntheticalPatrol/PatrolPlan/index.vue"),
        meta: {
          permission: "SyntheticalPatrolPlan",
          locale: "巡逻计划",
        },
      },
      {
        path: "PatrolPlan/:model/:id?",
        name: "SyntheticalPatrolPlanDetail",
        component: () => import("@/views/SyntheticalPatrol/PatrolPlan/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "SyntheticalPatrolPlan",
          locale: "巡逻计划",
        },
      },
      {
        path: "RoutingConfiguration",
        name: "SyntheticalRoutingConfiguration",
        component: () => import("@/views/SyntheticalPatrol/RoutingConfiguration/index.vue"),
        meta: {
          permission: "SyntheticalRoutingConfiguration",
          locale: "路线配置",
        },
      },
      {
        path: "RoutingConfiguration/:model/:id?",
        name: "SyntheticalRoutingConfigurationDetail",
        component: () => import("@/views/SyntheticalPatrol/RoutingConfiguration/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "SyntheticalRoutingConfiguration",
          locale: "路线配置",
        },
      },
    ],
  },
];

export default route;
