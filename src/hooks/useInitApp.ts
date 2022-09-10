import Dict from "@/api/tenant/Dict";
import User from "@/api/tenant/User";
import { useAppStore, useDictStore } from "@/store";
import { SERVICE_CLASS_SAFETY } from "@/store/modules/dict/types";
import { deepClone } from "@/utils/utils";
import { computed, watch } from "vue";

export default function useInitApp() {
  const p: Promise<void>[] = [];
  // init store
  const appState = useAppStore();
  const dictState = useDictStore();
  p.push(
    (appState.initTenantIdWait as Promise<{ tenantId: string }>).then(() => {
      return (
        User.getUserInfo()
          .then((res: any) => {
            appState.updateSettings({ userInfo: res.userInfo });
            appState.updateSettings({ permissions: res.permissions });
          })
          // .then((): any => {
          //   const pp: Promise<void>[] = [];
          //   return Promise.all(pp);
          // })
          .catch((err) => {
            console.log("用户信息加载失败", err);
            // Message.error("用户信息加载失败" + (err.msg || ""));
          })
      );
    }),
  );
  p.push(
    Dict.getAllDictByCode("serviceType").then((res) => {
      dictState.updateState({ serviceType: res });
      const serviceTypeMap: any = {};
      res.forEach((item) => {
        serviceTypeMap[item.value] = item;
      });
      appState.updateSettings({ serviceTypeMap });
    }),
  );
  p.push(
    Dict.getAllDictByCode("serviceClass").then((res) => {
      dictState.updateState({ serviceClass: res });
      const serviceClassMap: any = {};
      res.forEach((item) => {
        serviceClassMap[item.value] = item;
      });
      appState.updateSettings({ serviceClassMap });
    }),
  );
  p.push(
    Dict.getAllDictByCode("fromType").then((res) => {
      dictState.updateState({ fromType: res });
      const fromTypeMap: any = {};
      res.forEach((item) => {
        fromTypeMap[item.value] = item;
      });
      appState.updateSettings({ fromTypeMap });
    }),
  );
  p.push(
    Dict.getAllDictByCode("ticketStatus").then((res) => {
      dictState.updateState({ ticketStatus: res });
      const ticketStatusMap: any = {};
      res.forEach((item) => {
        ticketStatusMap[item.value] = item;
      });
      appState.updateSettings({ ticketStatusMap });
    }),
  );
  p.push(
    Dict.getAllDictByCode("ticketProduct").then((res) => {
      dictState.updateState({ ticketProduct: res });
      const ticketProductMap: any = {};
      res.forEach((item) => {
        ticketProductMap[item.value] = item;
      });
      appState.updateSettings({ ticketProductMap });
    }),
  );
  p.push(
    Dict.getAllDictByCode("product").then((res) => {
      dictState.updateState({ product: res });
      const productMap: any = {};
      res.forEach((item) => {
        productMap[item.value] = item;
      });
      appState.updateSettings({ productMap });
    }),
  );
  p.push(
    Dict.getAllDictByCode("visitType").then((res) => {
      dictState.updateState({ revisitType: res });
      const revisitTypeMap: any = {};
      res.forEach((item) => {
        revisitTypeMap[item.value] = item;
      });
      appState.updateSettings({ revisitTypeMap });
    }),
  );
  const promiseAll = Promise.all(p);
  appState.updateSettings({ initPromise: promiseAll });
  return promiseAll;
}
