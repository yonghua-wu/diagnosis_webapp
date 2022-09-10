import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/CustomerServiceManagement",
    name: "CustomerServiceManagement",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "客服管理",

      icon: "icon-customer-service",
    },
    children: [
      {
        path: "ResidentComplain",
        name: "ResidentComplain",
        component: () => import("@/components/RouterContainer.vue"),
        meta: {
          locale: "客户投诉",
        },
        children: [
          {
            path: "ComplainList",
            name: "ResidentComplainList",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainList/index.vue"),
            meta: {
              permission: "ResidentComplainList",
              locale: "投诉列表",
            },
          },
          {
            path: "ComplainList/:model/:id?",
            name: "ResidentComplainListDetail",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainList/detail.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentComplainList",
              locale: "投诉列表",
            },
          },
          {
            path: "ComplainList/CreateAssociatedWorkOrder/:id",
            name: "ResidentCreateComplainAssociatedWorkOrder",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainList/CreateAssociatedWorkOrder.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentComplainList",
              locale: "投诉列表",
            },
          },
          {
            path: "CreateComplain",
            name: "ResidentCreateComplain",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainList/CreateComplain.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentComplainList",
              locale: "投诉列表",
            },
          },
          {
            path: "ComplainComment",
            name: "ResidentComplainComment",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainComment/index.vue"),
            meta: {
              permission: "ResidentComplainComment",
              locale: "投诉评价",
            },
          },
          {
            path: "ComplainComment/:model/:id?",
            name: "ResidentComplainCommentDetail",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainComment/detail.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentComplainComment",
              locale: "投诉评价",
            },
          },
          {
            path: "ComplainRevisit",
            name: "ResidentComplainRevisit",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainRevisit/index.vue"),
            meta: {
              permission: "ResidentComplainRevisit",
              locale: "投诉回访",
            },
          },
          {
            path: "ComplainRevisit/:model/:id?",
            name: "ResidentComplainRevisitDetail",
            component: () => import("@/views/CustomerServiceManagement/ResidentComplain/ComplainRevisit/detail.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentComplainRevisit",
              locale: "投诉回访",
            },
          },
        ],
      },
      {
        path: "ResidentReport",
        name: "ResidentReport",
        component: () => import("@/components/RouterContainer.vue"),
        meta: {
          locale: "客户报事",
        },
        children: [
          {
            path: "ReportList",
            name: "ResidentReportList",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportList/index.vue"),
            meta: {
              permission: "ResidentReportList",
              locale: "报事列表",
            },
          },
          {
            path: "ReportList/CreateReport",
            name: "ResidentCreateGuestReport",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportList/CreateReport.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentReportList",
              locale: "报事列表",
            },
          },
          {
            path: "ReportList/CreateAssociatedWorkOrder/:id",
            name: "ResidentCreateReportAssociatedWorkOrder",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportList/CreateAssociatedWorkOrder.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentReportList",
              locale: "报事列表",
            },
          },
          {
            path: "ReportList/:model/:id?",
            name: "ResidentReportListDetail",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportList/detail.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentReportList",
              locale: "报事列表",
            },
          },
          {
            path: "ReportComment",
            name: "ResidentReportComment",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportComment/index.vue"),
            meta: {
              permission: "ResidentReportComment",
              locale: "报事评价",
            },
          },
          {
            path: "ReportComment/:model/:id?",
            name: "ResidentReportCommentDetail",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportComment/detail.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentReportComment",
              locale: "报事评价",
            },
          },
          {
            path: "ReportRevisit",
            name: "ResidentReportRevisit",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportRevisit/index.vue"),
            meta: {
              permission: "ResidentReportRevisit",
              locale: "报事回访",
            },
          },
          {
            path: "ReportRevisit/:model/:id?",
            name: "ResidentReportRevisitDetail",
            component: () => import("@/views/CustomerServiceManagement/ResidentReport/ReportRevisit/detail.vue"),
            meta: {
              addToMenu: false,
              permission: "ResidentReportRevisit",
              locale: "报事回访",
            },
          },
        ],
      },
      {
        path: "ServiceWorkOrderList",
        name: "ServiceWorkOrderList",
        component: () => import("@/views/CustomerServiceManagement/WorkOrderList/index.vue"),
        meta: {
          permission: "ServiceWorkOrderList",
          locale: "客服工单",
        },
      },
      {
        path: "ServiceWorkOrderList/:model/:id?",
        name: "ServiceWorkOrderListDetail",
        component: () => import("@/views/CustomerServiceManagement/WorkOrderList/detail2.vue"),
        meta: {
          permission: "ServiceWorkOrderList",
          locale: "客服工单",
          addToMenu: false,
        },
      },
      {
        path: "ServiceWorkOrderList/CreateAssociatedWorkOrder/:id",
        name: "CreateServiceWorkOrderAssociatedWorkOrder",
        component: () => import("@/views/CustomerServiceManagement/WorkOrderList/CreateAssociatedWorkOrder.vue"),
        meta: {
          addToMenu: false,
          permission: "ServiceWorkOrderList",
          locale: "客服工单",
        },
      },
    ],
  },
];

export default route;
