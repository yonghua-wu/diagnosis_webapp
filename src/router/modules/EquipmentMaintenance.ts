import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/EquipmentMaintenance",
    name: "EquipmentMaintenance",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "设备维护",
      icon: "icon-storage",
    },
    children: [
      {
        path: "EquipmentManagement",
        name: "EquipmentManagement",
        component: () => import("@/views/EquipmentMaintenance/EquipmentManagement/index.vue"),
        meta: {
          permission: "EquipmentManagement",
          locale: "设备管理",
        },
      },
      {
        path: "EquipmentManagement/:model/:id?",
        name: "EquipmentManagementDetail",
        component: () => import("@/views/EquipmentMaintenance/EquipmentManagement/detail2.vue"),
        meta: {
          addToMenu: false,
          permission: "EquipmentManagement",
          locale: "设备管理",
        },
      },

      {
        path: "PatrolPlan",
        name: "EquipmentPatrolPlan",
        component: () => import("@/views/EquipmentMaintenance/PatrolPlan/index.vue"),
        meta: {
          permission: "EquipmentPatrolPlan",
          locale: "设备巡检计划",
        },
      },
      {
        path: "PatrolPlan/:model/:id?",
        name: "EquipmentPatrolPlanDetail",
        component: () => import("@/views/EquipmentMaintenance/PatrolPlan/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "EquipmentPatrolPlan",
          locale: "设备巡检计划",
        },
      },
      {
        path: "RoutingConfiguration",
        name: "EquipmentRoutingConfiguration",
        component: () => import("@/views/EquipmentMaintenance/RoutingConfiguration/index.vue"),
        meta: {
          permission: "EquipmentRoutingConfiguration",
          locale: "巡检路线配置",
        },
      },
      {
        path: "RoutingConfiguration/:model/:id?",
        name: "EquipmentRoutingConfigurationDetail",
        component: () => import("@/views/EquipmentMaintenance/RoutingConfiguration/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "EquipmentRoutingConfiguration",
          locale: "巡检路线配置",
        },
      },
      {
        path: "MaintenancePlan",
        name: "EquipmentMaintenancePlan",
        component: () => import("@/views/EquipmentMaintenance/MaintenancePlan/index.vue"),
        meta: {
          permission: "EquipmentMaintenancePlan",
          locale: "设备保养计划",
        },
      },
      {
        path: "MaintenancePlan/:model/:id?",
        name: "EquipmentMaintenancePlanDetail",
        component: () => import("@/views/EquipmentMaintenance/MaintenancePlan/detail.vue"),
        meta: {
          addToMenu: false,
          permission: "EquipmentMaintenancePlan",
          locale: "设备保养计划",
        },
      },
    ],
  },
];

export default route;
