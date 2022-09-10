import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/SystemManagement",
    name: "SystemManagement",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "系统管理",

      icon: "icon-settings",
    },
    children: [
      {
        path: "UserManagement",
        name: "UserManagement",
        component: () => import("@/views/SystemManagement/UserManagement/index.vue"),
        meta: {
          permission: "UserManagement",
          locale: "用户管理",
        },
      },
      {
        path: "UserManagement/:model/:id?",
        name: "UserManagementDetail",
        component: () => import("@/views/SystemManagement/UserManagement/detail.vue"),
        meta: {
          permission: "UserManagement",
          addToMenu: false,
          locale: "用户管理",
        },
      },
      {
        path: "RoleManagement",
        name: "RoleManagement",
        component: () => import("@/views/SystemManagement/RoleManagement/index.vue"),
        meta: {
          permission: "RoleManagement",
          locale: "角色管理",
        },
      },
      {
        path: "RoleManagement/:model/:id?",
        name: "RoleManagementDetail",
        component: () => import("@/views/SystemManagement/RoleManagement/detail.vue"),
        meta: {
          permission: "RoleManagement",
          addToMenu: false,
          locale: "角色管理",
        },
      },
      {
        path: "PermissionConfiguration",
        name: "PermissionConfiguration",
        component: () => import("@/views/SystemManagement/PermissionConfiguration/index.vue"),
        meta: {
          permission: "PermissionConfiguration",
          locale: "权限配置",
        },
      },
      {
        path: "PermissionConfiguration/:model/:id?",
        name: "PermissionConfigurationDetail",
        component: () => import("@/views/SystemManagement/PermissionConfiguration/detail.vue"),
        meta: {
          permission: "PermissionConfiguration",
          addToMenu: false,
          locale: "权限配置",
        },
      },
      {
        path: "PermissionConfiguration2",
        name: "PermissionConfiguration2",
        component: () => import("@/views/SystemManagement/PermissionConfiguration2/index.vue"),
        meta: {
          permission: "PermissionConfiguration2",
          locale: "权限配置2",
        },
      },
      {
        path: "PermissionConfiguration2/:model/:id?",
        name: "PermissionConfiguration2Detail",
        component: () => import("@/views/SystemManagement/PermissionConfiguration2/detail.vue"),
        meta: {
          permission: "PermissionConfiguration2",
          addToMenu: false,
          locale: "权限配置2",
        },
      },
      {
        path: "SyntheticalEventConfiguration",
        name: "SyntheticalEventConfiguration",
        component: () => import("@/views/SystemManagement/SyntheticalEventConfiguration/index.vue"),
        meta: {
          permission: "SyntheticalEventConfiguration",
          locale: "事件综合配置",
        },
      },
      {
        path: "SyntheticalEventConfiguration/:model/:id?",
        name: "SyntheticalEventConfigurationDetail",
        component: () => import("@/views/SystemManagement/SyntheticalEventConfiguration/detail.vue"),
        meta: {
          permission: "SyntheticalEventConfiguration",
          locale: "事件综合配置详情",
          addToMenu: false,
        },
      },
      {
        path: "EventConfiguration/WorkOrderConfiguration/:model/:id",
        name: "WorkOrderConfiguration",
        component: () => import("@/views/SystemManagement/SyntheticalEventConfiguration/WorkOrderConfiguration.vue"),
        meta: {
          permission: "SyntheticalEventConfiguration",
          locale: "工单配置",
          addToMenu: false,
        },
      },
      {
        path: "EventConfiguration/EventFlowConfiguration/:model/:id",
        name: "EventFlowConfiguration",
        component: () => import("@/views/SystemManagement/SyntheticalEventConfiguration/EventFlowConfiguration.vue"),
        meta: {
          permission: "SyntheticalEventConfiguration",
          locale: "流程配置",
          addToMenu: false,
        },
      },
      {
        path: "SpaceConfiguration",
        name: "SpaceConfiguration",
        component: () => import("@/views/SystemManagement/SpaceConfiguration/index.vue"),
        meta: {
          permission: "SpaceConfiguration",
          locale: "空间配置",
        },
      },
      {
        path: "DictManagement",
        name: "DictManagement",
        component: () => import("@/views/SystemManagement/DictManagement/index.vue"),
        meta: {
          permission: "DictManagement",
          locale: "字典管理",
        },
      },
      {
        path: "DictManagement/:model/:id?",
        name: "DictManagementDetail",
        component: () => import("@/views/SystemManagement/DictManagement/detail.vue"),
        meta: {
          permission: "DictManagement",
          addToMenu: false,
          locale: "字典管理",
        },
      },
    ],
  },
];
export default route;
