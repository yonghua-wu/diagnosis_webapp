import { Http } from "@/utils/http";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "@/store";
import { getMd5 } from "@/utils/utils";
import Message from "@/utils/Message";

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

const serveiceName = "/seeingflow-wechat-app";

class PropertyHttp extends Http {
  private static _tenantInstance: unknown;
  public requestInterceptors<T = any>(config: AxiosRequestConfig<T>) {
    (config.data as any) = {
      blockId: store.state.value.app?.userInfo?.blockId || undefined,
      ...config.data,
      platform: "web",
      timestamp: new Date().getTime(),
      version: process.env.VUE_APP_VERSION,
      tenantId: store.state.value.app?.tenantId || undefined,
    };
    if (config.method === "get" || config.method === "GET") {
      config.params = config.params || {};
      config.params.tenantId = store.state.value.app?.tenantId || undefined;
    }
    // config.params &&
    //   Object.keys(config.params).forEach((key) => {
    //     config.params[key] !== undefined && config.params[key] !== null && (config.params[key] = encryptAES(config.params[key].toString()));
    //   });
    // console.log(config.url, JSON.parse(JSON.stringify(config.data)));
    // config.data &&
    //   Object.keys(config.data as any).forEach((key) => {
    //     const data = (config.data as any)[key];
    //     if (data !== undefined && data !== null) {
    //       if (typeof data === "object") {
    //         (config.data as any)[key] = encryptAES(JSON.stringify(data));
    //       } else {
    //         (config.data as any)[key] = encryptAES(data.toString());
    //       }
    //     } else {
    //       delete (config.data as any)[key];
    //     }
    //   });
    const expire = new Date().getTime() + 60000;
    const token = localStorage.getItem("token") || "";
    config.headers = {
      ...config.headers,
      token: token,
      sign: getMd5(serveiceName + config.url + String(expire) + token),
      expire: String(expire),
    };
    // if (!isLogin(config)) {
    // } else {
    //   config.headers = {
    //     ...config.headers,
    //     expire: encryptAES(String(expire)),
    //   };
    // }
    return config;
  }
  public responseNormalHander(response: AxiosResponse<any, any>) {
    if (response.data.code !== undefined && response.data.code !== 200) {
      Message.error(`${response.data.code}: ${response.data.msg}` || "服务器异常");
      throw response;
    }
    return response.data;
  }
  public static getInstance(config: AxiosRequestConfig): PropertyHttp {
    if (!this._tenantInstance) {
      this._tenantInstance = new PropertyHttp({
        baseURL: "",
        timeout: 60000,
        ...config,
      });
    }
    return this._tenantInstance as PropertyHttp;
  }
}

export default new PropertyHttp({
  baseURL: process.env.VUE_APP_SF_BASE_BASE_URL + serveiceName,
  timeout: 60000,
});
