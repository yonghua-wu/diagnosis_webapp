import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/IOT",
    name: "IOT",
    component: () => import("@/views/IOT/index.vue"),
    meta: {
      locale: "IOT模块",
      icon: "icon-common",
    },
    children: [
      {
        path: "OpenTheDoor",
        name: "OpenTheDoor",
        component: () => import("@/views/IOT/OpenTheDoor/index.vue"),
        meta: {
          locale: "云开门",
          permission: "OpenTheDoor",
        },
      },
      // {
      //   path: "Dashboard",
      //   name: "Dashboard",
      //   component: () => import("@/views/IOT/Dashboard/index.vue"),
      //   meta: {
      //     locale: "IOT监控",
      //
      //     ,
      //   },
      // },
      // {
      //   path: "DeviceAccess",
      //   name: "DeviceAccess",
      //   component: () => import("@/views/IOT/DeviceAccess/index.vue"),
      //   meta: {
      //     locale: "设备管理",
      //     permission: "DeviceAccess",
      //   },
      // },
      // {
      //   path: "DeviceAccess/:model/:id",
      //   name: "DeviceAccessDetail",
      //   component: () => import("@/views/IOT/DeviceAccess/detail.vue"),
      //   meta: {
      //     addToMenu: false,
      //     locale: "设备管理",
      //     permission: "DeviceAccess",
      //   },
      // },
      // {
      //   path: "DeviceAccess/DeviceList/:buildingId",
      //   name: "DeviceList",
      //   component: () => import("@/views/IOT/DeviceAccess/DeviceList.vue"),
      //   meta: {
      //     addToMenu: false,
      //     locale: "设备列表",
      //
      //     ,
      //   },
      // },
    ],
  },
];

export default route;
