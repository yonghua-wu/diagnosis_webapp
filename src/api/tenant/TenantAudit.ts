/* eslint-disable prettier/prettier */
import http, { HttpResponseBase, PaginationModel } from "./base";
const modelName = "mainPerson";

export default class TenantAudit {
  public static async getTenant(query: any) {
    const res = await http.post(`/${modelName}/getTenantApplyList`, query);
    return res;
  }

  public static async tenantModify(data: any){
    const res = await http.post(`/${modelName}/tenantApply`,data);
    return res;
  }
}
