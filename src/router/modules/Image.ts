import { RouteRecordRaw } from "vue-router";

const route: Array<RouteRecordRaw> = [
  {
    path: "/Image",
    name: "Image",
    component: () => import("@/views/Image/index.vue"),
    meta: {
      locale: "图像管理",
      icon: "icon-image",
      addToMenu: true,
    },
  },
  {
    path: "/Image/:model/:id?",
    name: "ImageDetail",
    component: () => import("@/views/Image/detail.vue"),
    meta: {
      locale: "图像管理",
      icon: "icon-image",
      addToMenu: false,
    },
  },
];

export default route;
