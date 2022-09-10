import { Http, HttpAxiosError } from "@/utils/http";
import { encryptAES, getMd5 } from "@/utils/utils";
import Message from "@/utils/Message";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import errorMap from "./errorMap";
import store from "@/store";

const serveiceName = "/seeingflow-tenant";

export interface HttpResponseBase<T> {
  code: number;
  msg: string;
  errorMsg: string;
  data: T;
}

export interface PaginationModel<T> {
  pageNum: number;
  pageSize: number;
  totalPage: number;
  total: number;
  list: T;
}

function isLogin(config: AxiosRequestConfig) {
  const l = ["/sysUser/login", "/sysUser/getCode", "/sysUser/phoneLogin", "/sysUser/resetPassword", "/tenant/getTenantConfigByDomain"];
  if (l.indexOf(config.url || "") !== -1) {
    return true;
  } else {
    return false;
  }
}

class TenantHttp extends Http {
  private static _tenantInstance: unknown;
  public requestInterceptors<T = any>(config: AxiosRequestConfig<T>) {
    if (config.method === "get" || config.method === "GET") {
      config.params = config.params || {};
      config.params.tenantId = store.state.value.app?.tenantId || undefined;
    } else {
      (config.data as any) = {
        blockId: localStorage.getItem("current_block") || store.state.value.app?.userInfo?.blockId,
        ...config.data,
        platform: "web",
        timestamp: new Date().getTime(),
        version: process.env.VUE_APP_VERSION,
        tenantId: store.state.value.app?.tenantId || undefined,
      };
    }
    const expire = new Date().getTime() + 60000;
    const token = localStorage.getItem("token") || "";
    if (!isLogin(config)) {
      config.headers = {
        ...config.headers,
        token: token,
        sign: serveiceName + config.url + String(expire) + token,
        expire: String(expire),
      };
      const blockId = localStorage.getItem("current_block")
        ? localStorage.getItem("current_block") || ""
        : store.state.value.app?.userInfo?.blockId
        ? store.state.value.app?.userInfo?.blockId
        : undefined;
      if (blockId) {
        config.headers["block-id"] = blockId;
      }
    } else {
      config.headers = {
        ...config.headers,
        expire: String(expire),
      };
    }
    console.groupCollapsed(
      `%c Tenant %c ${config.method} %c ${config.url} `,
      "color: #fff; background-color: rgb(229,180,86); padding: 2px 0px; border-radius: 4px 0 0 4px",
      // "color: #fff; background-color: rgb(198,120,221); padding: 2px 0px; border-radius: 4px 0 0 4px",
      "color: #fff; background-color: rgb(224,108,117); padding: 2px 0px;border-radius: 0 4px 4px 0",
      "color: rgb(97,175,239); padding: 2px 0px; border-radius: 0 4px 4px 0",
    );
    console.group("Body");
    console.log(JSON.parse(JSON.stringify(config.data || {})));
    console.groupEnd();
    console.group("Header");
    console.log({
      token: config.headers.token,
      sign: config.headers.sign,
      expire: config.headers.expire,
      "block-id": config.headers["block-id"],
    });
    console.groupEnd();
    console.group("Query");
    console.log(JSON.parse(JSON.stringify(config.params || {})));
    console.groupEnd();
    console.groupEnd();

    config.headers["block-id"] && (config.headers["block-id"] = encryptAES(config.headers["block-id"] as string));
    config.headers.sign && (config.headers.sign = getMd5(config.headers.sign as string));
    config.headers.expire && (config.headers.expire = encryptAES(config.headers.expire as string));

    config.params &&
      Object.keys(config.params).forEach((key) => {
        config.params[key] !== undefined && config.params[key] !== null && (config.params[key] = encryptAES(config.params[key].toString()));
      });
    config.data &&
      Object.keys(config.data as any).forEach((key) => {
        const data = (config.data as any)[key];
        if (data !== undefined && data !== null) {
          if (typeof data === "object") {
            (config.data as any)[key] = encryptAES(JSON.stringify(data));
          } else {
            (config.data as any)[key] = encryptAES(data.toString());
          }
        } else {
          delete (config.data as any)[key];
        }
      });
    return config;
  }
  public responseNormalHander(response: AxiosResponse<any, any>) {
    if ((errorMap as any)[response.data.code] !== undefined) {
      Message.error((errorMap as any)[response.data.code] || response.data.msg);
      throw response;
    }
    return response.data;
  }
  public static getInstance(config: AxiosRequestConfig): TenantHttp {
    if (!this._tenantInstance) {
      this._tenantInstance = new TenantHttp({
        baseURL: "",
        timeout: 60000,
        ...config,
      });
    }
    return this._tenantInstance as TenantHttp;
  }
}

export default TenantHttp.getInstance({
  baseURL: process.env.VUE_APP_SF_TENANT_BASE_URL + serveiceName,
  timeout: 60000,
});
