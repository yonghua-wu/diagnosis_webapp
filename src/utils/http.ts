import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { HOST, BASE_URL } from "./config";
import router from "@/router";
import Message from "@/utils/Message";
import { MessageReturn } from "@arco-design/web-vue/es/message/interface";

export interface HttpAxiosError extends AxiosError {
  isTips?: boolean;
}

const message = Message;

export class Http {
  private static _instance: unknown;
  public http: AxiosInstance;
  private status401msg: MessageReturn | undefined;
  private status404msg: MessageReturn | undefined;
  private status500msg: MessageReturn | undefined;
  constructor(config?: AxiosRequestConfig | undefined) {
    this.http = axios.create(config);
    this.http.interceptors.request.use((config) => {
      config = this.requestInterceptors(config);
      config = {
        ...config,
        headers: {
          // Authorization: config.headers?.Authorization || localStorage.getItem("token") || "",
          ...config.headers,
        },
      };
      return config;
    });
    this.http.interceptors.response.use(
      (response) => {
        return this.responseNormalHander(response);
      },
      (error) => {
        const _err: HttpAxiosError = error;
        if (!_err.isAxiosError) {
          message.error("网络异常，请检查网络");
          _err.isTips = true;
        } else {
          if (_err?.response?.status) {
            // 有HTTP状态码
            // message.error("有http状态码");
            if (_err?.response?.status === 500 || _err?.response?.status === 503) {
              if (!this.status500msg) {
                this.status500msg = message.error("服务器异常，状态 " + _err?.response?.status);
                setTimeout(() => {
                  this.status500msg = undefined;
                }, 2000);
              }
              _err.isTips = true;
            } else if (_err?.response?.status === 404) {
              if (!this.status404msg) {
                this.status404msg = message.error("请求失败，状态 404");
                setTimeout(() => {
                  this.status401msg = undefined;
                }, 2000);
              }
              _err.isTips = true;
            } else if (_err?.response?.status === 403) {
              if (!this.status401msg) {
                this.status401msg = message.error("登录失效，请重新登录");
                setTimeout(() => {
                  this.status401msg = undefined;
                }, 2000);
              }
              // const route = useRoute();
              console.log("route", router.currentRoute.value.fullPath);
              setTimeout(() => {
                if (router.currentRoute.value.name !== "Login") {
                  let query: any = { redirect: router.currentRoute.value.fullPath };
                  if (/403$/.test(router.currentRoute.value.fullPath)) {
                    query = undefined;
                  }
                  router.push({ name: "Login", query: query });
                }
              }, 500);
              _err.isTips = true;
            }
          } else {
            // 没有HTTP状态码
            message.error("网络连接失败，请重试");
            _err.isTips = true;
          }
        }
        return this.responseErrorHander(_err);
      },
    );
  }
  public static getInstance(config: AxiosRequestConfig): Http {
    if (!this._instance) {
      this._instance = new Http({
        baseURL: "",
        timeout: 60000,
        ...config,
      });
    }
    return this._instance as Http;
  }
  public requestInterceptors<T = any>(config: AxiosRequestConfig<T>) {
    return config;
  }
  public responseNormalHander(response: AxiosResponse<any, any>) {
    return response.data;
  }
  public responseErrorHander(err: HttpAxiosError) {
    return Promise.reject(err);
  }
  public async get<T = any>(url: string, config?: AxiosRequestConfig | undefined): Promise<T> {
    return await this.http.get(url, config);
  }
  public async delete<T = any>(url: string, config?: AxiosRequestConfig | undefined): Promise<T> {
    return await this.http.delete(url, config);
  }
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<T> {
    return await this.http.post(url, data, config);
  }
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<T> {
    return await this.http.put(url, data, config);
  }
}

export default Http.getInstance({
  baseURL: HOST + BASE_URL,
});
