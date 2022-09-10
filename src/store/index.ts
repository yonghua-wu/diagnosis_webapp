import { createPinia } from "pinia";
import useAppStore from "./modules/app";
import useUserStore from "./modules/user";
import useDictStore from "./modules/dict";

const pinia = createPinia();

export { useAppStore, useUserStore, useDictStore };
export default pinia;
