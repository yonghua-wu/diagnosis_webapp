import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/Patrol",
    name: "Patrol",
    component: () => import("@/views/Patrol/index.vue"),
    meta: {
      locale: "巡检中心",

      icon: "icon-bookmark",
    },
    children: [
      {
        path: "RemoteOperation",
        name: "RemoteOperation",
        component: () => import("@/views/Patrol/RemoteOperation/index.vue"),
        meta: {
          permission: "RemoteOperation",
          locale: "远程巡检",
        },
      },
      {
        path: "PatrolPlan",
        name: "PatrolPlan",
        component: () => import("@/views/Patrol/PatrolPlan/index.vue"),
        meta: {
          permission: "PatrolPlan",
          locale: "巡检计划",
        },
      },
      {
        path: "PatrolPlan/Add",
        name: "AddPatrolPlan",
        component: () => import("@/views/Patrol/PatrolPlan/DetailPatrolPlan.vue"),
        meta: {
          permission: "AddPatrolPlan",
          addToMenu: false,

          model: "add",
        },
      },
      {
        path: "PatrolPlan/Edit/:id",
        name: "EditPatrolPlan",
        component: () => import("@/views/Patrol/PatrolPlan/DetailPatrolPlan.vue"),
        meta: {
          permission: "EditPatrolPlan",
          addToMenu: false,

          model: "edit",
        },
      },
      {
        path: "PatrolPlan/View/:id",
        name: "ViewPatrolPlan",
        component: () => import("@/views/Patrol/PatrolPlan/DetailPatrolPlan.vue"),
        meta: {
          permission: "ViewPatrolPlan",
          addToMenu: false,

          model: "view",
        },
      },
    ],
  },
];

export default route;
