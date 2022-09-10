import { Http } from "@/utils/http";

export interface HttpResponseBase<T> {
  code: number;
  msg: string;
  data: T;
}

export default new Http({
  // baseURL: "http://192.168.30.10:8080" + "/seeingflow-ticket",
  // baseURL: "https://saas-gateway.dev.seeingflow.com" + "/seeingflow-ticket",
  baseURL: process.env.VUE_APP_TICKET_BASE_URL + "/seeingflow-ticket",
  timeout: 60000,
});
