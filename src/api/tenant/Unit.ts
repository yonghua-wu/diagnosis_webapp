import http, { HttpResponseBase } from "./base";
const modelName = "unit";

export default class Unit {
  public static async getByPlaceId(placeId: string) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/getUnit`, {
      placeId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
