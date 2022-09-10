import http, { HttpResponseBase } from "./base";

const modelName = "web";

export default class Payecord {
  public static async getBillList(data: any) {
    const res = await http.post(`/${modelName}/getBillList`, data);
    return res;
  }

  public static async getDetails(data: any) {
    const res = await http.post(`/${modelName}/getBilldetails`, data);
    return res;
  }
}
