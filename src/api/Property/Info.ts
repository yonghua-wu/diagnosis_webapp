import http, { HttpResponseBase, PaginationModel } from "./base";
const modelName = "web";
export default class Info {
  public static async getInfo(query: any) {
    const res = await http.post(`/${modelName}/getAllUnitList`, query);
    return res;
  }

  public static async edit(data: any) {
    const res = await http.post(`/${modelName}/uitListEdit`, data);
    return res;
  }
}
