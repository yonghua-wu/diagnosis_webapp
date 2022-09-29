import router from "@/router";
import { Http } from "@/utils/http";
import { AxiosRequestConfig, AxiosResponse } from "axios";

const serveiceName = "/diagnosis/api";

export interface HttpResponseBase<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PaginationModel<T> {
  current: number;
  size: number;
  total: number;
  list: T[];
}

// function isLogin(config: AxiosRequestConfig) {
//   const l = ["/sysUser/login", "/sysUser/getCode", "/sysUser/phoneLogin", "/sysUser/resetPassword", "/tenant/getTenantConfigByDomain"];
//   if (l.indexOf(config.url || "") !== -1) {
//     return true;
//   } else {
//     return false;
//   }
// }

class DiagnosisHttp extends Http {
  private static _tenantInstance: unknown;
  public requestInterceptors<T = any>(config: AxiosRequestConfig<T>) {
    config.headers = {
      ...config.headers,
      token: localStorage.getItem("token") || "",
    };
    return config;
  }
  public responseNormalHander(response: AxiosResponse<any, any>) {
    if (response.data.state === false) {
      router.push("/login");
      throw response;
    }
    return response.data;
  }
  public static getInstance(config: AxiosRequestConfig): DiagnosisHttp {
    if (!this._tenantInstance) {
      this._tenantInstance = new DiagnosisHttp({
        baseURL: "",
        timeout: 60000,
        ...config,
      });
    }
    return this._tenantInstance as DiagnosisHttp;
  }
}

export default DiagnosisHttp.getInstance({
  baseURL: process.env.VUE_APP_DIAGNOSIS_BASE_URL + serveiceName,
  timeout: 60000,
});
