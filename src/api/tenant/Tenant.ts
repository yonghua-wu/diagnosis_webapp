import http, { HttpResponseBase } from "./base";

const modelName = "/tenant";

export default class Tenant {
  public static async getTenantConfig() {
    const res = await http.post<HttpResponseBase<{ tenantId: string }>>(`${modelName}/getTenantConfigByDomain`, {
      key: location.host === "localhost:8080" || location.host === "192.168.30.62:8080" ? "10.3.26.154" : location.host,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
