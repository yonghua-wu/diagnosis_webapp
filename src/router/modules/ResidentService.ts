import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/ResidentService",
    name: "ResidentService",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "客户服务",

      icon: "icon-home",
    },
    children: [
      {
        path: "HousePersonalRelationalTable",
        name: "HousePersonalRelationalTable",
        component: () => import("@/views/ResidentService/HousePersonalRelationalTable/index.vue"),
        meta: {
          permission: "HousePersonalRelationalTable",
          locale: "房客关系表",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "HousePersonalRelationalTable/:model/:id?",
        name: "HousePersonalRelationalTableDetail",
        component: () => import("@/views/ResidentService/HousePersonalRelationalTable/detail.vue"),
        meta: {
          permission: "HousePersonalRelationalTable",
          addToMenu: false,
          locale: "房客关系表",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "ResidentAudit",
        name: "ResidentAudit",
        component: () => import("@/components/RouterContainer.vue"),
        meta: {
          locale: "住户审核",
        },
        children: [
          {
            path: "Owner",
            name: "OwnerAudit",
            component: () => import("@/views/ResidentService/ResidentAudit/OwnerAudit/index.vue"),
            meta: {
              permission: "OwnerAudit",
              locale: "业主审核",
              requiresAuth: true,
              roles: ["*"],
            },
          },
          {
            path: "Owner/:model/:id?",
            name: "OwnerAuditDetail",
            component: () => import("@/views/ResidentService/ResidentAudit/OwnerAudit/detail.vue"),
            meta: {
              permission: "OwnerAudit",
              addToMenu: false,
              locale: "审核详情",
              requiresAuth: true,
              roles: ["*"],
            },
          },
          {
            path: "Tenant",
            name: "TenantAudit",
            component: () => import("@/views/ResidentService/ResidentAudit/TenantAudit/index.vue"),
            meta: {
              permission: "TenantAudit",
              locale: "租户审核",
              requiresAuth: true,
              roles: ["*"],
            },
          },
          {
            path: "Tenant/:model/:id?",
            name: "TenantAuditDetail",
            component: () => import("@/views/ResidentService/ResidentAudit/TenantAudit/detail.vue"),
            meta: {
              permission: "TenantAudit",
              addToMenu: false,
              locale: "审核详情",
              requiresAuth: true,
              roles: ["*"],
            },
          },
        ],
      },
      {
        path: "PaymentManagement",
        name: "PaymentManagement",
        component: () => import("@/views/ResidentService/PaymentManagement/index.vue"),
        meta: {
          permission: "PaymentManagement",
          locale: "缴费管理",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "PaymentManagement/:model/:id?",
        name: "PaymentManagementDetail",
        component: () => import("@/views/ResidentService/PaymentManagement/detail.vue"),
        meta: {
          permission: "PaymentManagement",
          addToMenu: false,
          locale: "缴费管理",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "ResidentComment",
        name: "ResidentComment",
        component: () => import("@/views/ResidentService/ResidentComment/index.vue"),
        meta: {
          permission: "ResidentComment",
          locale: "客户评价",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "ResidentComment/:model/:id?",
        name: "ResidentCommentDetail",
        component: () => import("@/views/ResidentService/ResidentComment/detail.vue"),
        meta: {
          permission: "ResidentComment",
          addToMenu: false,
          locale: "客户评价",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "NoticeManagement",
        name: "NoticeManagement",
        component: () => import("@/views/ResidentService/NoticeManagement/index.vue"),
        meta: {
          permission: "NoticeManagement",
          locale: "公告管理",
        },
      },
      {
        path: "NoticeManagement/:model/:id?",
        name: "NoticeManagementDetail",
        component: () => import("@/views/ResidentService/NoticeManagement/detail.vue"),
        meta: {
          permission: "NoticeManagement",
          addToMenu: false,
          locale: "公告管理",
        },
      },
      {
        path: "ActivityManagement",
        name: "ActivityManagement",
        component: () => import("@/views/ResidentService/ActivityManagement/index.vue"),
        meta: {
          permission: "ActivityManagement",
          locale: "活动管理",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "ActivityManagement/:model/:id?",
        name: "ActivityManagementDetail",
        component: () => import("@/views/ResidentService/ActivityManagement/detail.vue"),
        meta: {
          permission: "ActivityManagement",
          addToMenu: false,
          locale: "活动管理",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "ActivityManagement/SignUpList/:id",
        name: "ActivityManagementSignUpList",
        component: () => import("@/views/ResidentService/ActivityManagement/signUpList.vue"),
        meta: {
          permission: "ActivityManagement",
          addToMenu: false,
          locale: "活动管理",
          requireAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "CarouselManagement",
        name: "CarouselManagement",
        component: () => import("@/views/ResidentService/CarouselManagement/index.vue"),
        meta: {
          permission: "CarouselManagement",
          locale: "轮播图管理",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "CarouselManagement/:model/:id?",
        name: "CarouselManagementDetail",
        component: () => import("@/views/ResidentService/CarouselManagement/detail.vue"),
        meta: {
          permission: "CarouselManagement",
          addToMenu: false,
          locale: "轮播图管理",
          requiresAuth: true,
          roles: ["*"],
        },
      },
      {
        path: "FaceAudit",
        name: "FaceAudit",
        component: () => import("@/views/ResidentService/FaceAudit/index.vue"),
        meta: {
          locale: "人脸审核",
          permission: "FaceAudit",
        },
      },
      {
        path: "FaceAudit/:model/:id",
        name: "FaceAuditDetail",
        component: () => import("@/views/ResidentService/FaceAudit/detail.vue"),
        meta: {
          locale: "人脸审核",
          permission: "FaceAudit",
          addToMenu: false,
        },
      },
    ],
  },
];

export default route;
