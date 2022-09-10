import { defineStore } from "pinia";
import defaultSettings from "@/config/settings.json";
import { AppState } from "./types";
import Tenant from "@/api/tenant/Tenant";

const useAppStore = defineStore("app", {
  state: (): AppState => ({
    ...defaultSettings,
    initPromise: Promise.resolve(),
    colors: ["orange", "blue", "cyan", "orangered", "pinkpurple", "arcoblue", "gold", "lime", "red", "green", "magenta", "gray", "purple"],
    permissions: [],
    userInfo: {
      tenantId: "",
    },
    tenantId: null,
    initTenantIdWait: null,
    cateMaps: {},
    cateTree: [],
    cateList: [],
    serviceTypeMap: {},
    serviceClassMap: {},
    fromTypeMap: {},
    ticketStatusMap: {},
    productMap: {},
    jobConfigList: [],
    jobConfigMap: {},
    revisitTypeMap: {},
  }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
  },

  actions: {
    async initTenantId() {
      this.initTenantIdWait = Tenant.getTenantConfig();
      const res = await (this.initTenantIdWait as Promise<{ tenantId: string }>);
      this.tenantId = res.tenantId;
    },
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = "dark";
        document.body.setAttribute("arco-theme", "dark");
      } else {
        this.theme = "light";
        document.body.removeAttribute("arco-theme");
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
  },
});

export default useAppStore;
