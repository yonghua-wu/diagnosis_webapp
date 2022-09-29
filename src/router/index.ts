import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import createRouteGuard from "./guard";

import IndexLayout from "../views/IndexLayout.vue";
// import Home from "../views/Home/index.vue";
import store from "@/store";

import Exception404 from "../views/Exception/404/index.vue";
import Exception403 from "../views/Exception/403/index.vue";
import Exception500 from "../views/Exception/500/index.vue";
import LoginView from "../views/Auth/Login.vue";
import ForgetPasswordView from "../views/Auth/ForgetPassword.vue";

import Board from "./modules/Board";
import User from "./modules/User";
import Casebook from "./modules/Casebook";
import Model from "./modules/Model";
import Image from "./modules/Image";

const routes: Array<RouteRecordRaw> = [
  {
    name: "root",
    path: "/",
    component: IndexLayout,
    children: [
      ...Board,
      ...User,
      ...Casebook,
      ...Model,
      ...Image,
      {
        path: "/403",
        name: "Exception403",
        component: Exception403,
        meta: {
          addToMenu: false,
        },
      },
    ],
  },
  {
    path: "/Login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/ForgetPassword",
    name: "ForgetPassword",
    component: ForgetPasswordView,
  },
  {
    path: "/404",
    name: "Exception404",
    component: Exception404,
  },
  {
    path: "/500",
    name: "Exception500",
    component: Exception500,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createRouteGuard(router);
router.beforeEach(async (to, from, next) => {
  // emit route change
  // setRouteEmitter(to);
  // console.log("router to", to);
  // if (store.state.value.app && store.state.value.app.permissions.length !== 0) {
  //   const map: any = {};
  //   (store.state.value.app?.permissions as string[])
  //     .filter((perm: string) => {
  //       return perm.split(":").length === 3;
  //     })
  //     .forEach((perm) => {
  //       map[perm] = true;
  //     });
  //   map["Login"] = true;
  //   map["ForgetPassword"] = true;
  //   map["Exception404"] = true;
  //   map["Exception403"] = true;
  //   map["Exception500"] = true;
  //   if (map[to.name as string]) {
  //     next();
  //   } else {
  //     next("/403");
  //   }
  // }
  if (to.name === "Home") {
    next("/");
  } else {
    next();
  }
});

export default router;
