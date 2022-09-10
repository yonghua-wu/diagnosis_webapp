import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/EmployeesManagement",
    name: "EmployeesManagement",
    component: () => import("@/components/RouterContainer.vue"),
    meta: {
      locale: "员工管理",
      icon: "icon-user-group",
    },
    children: [
      {
        path: "Member",
        name: "EmployeesMember",
        component: () => import("@/views/EmployeesManagement/Member/index.vue"),
        meta: {
          permission: "EmployeesMember",
          locale: "成员管理",
        },
      },
      {
        path: "Member/:model/:id?",
        name: "EmployeesMemberDetail",
        component: () => import("@/views/EmployeesManagement/Member/detail.vue"),
        meta: {
          permission: "EmployeesMember",
          addToMenu: false,
          locale: "成员管理",
        },
      },
    ],
  },
];
export default route;
