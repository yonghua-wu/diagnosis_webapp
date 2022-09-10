import { Http } from "@/utils/http";

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

export default new Http({
  baseURL: process.env.VUE_APP_SF_BASE_BASE_URL + "/seeingflow-tenant-server",
  timeout: 60000,
});

export const tenantId = "6235bab4cd4ef4a76c6d768b";
