import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "web";

export interface OwnerModel {
  name: string;
  nickName: string;
  phone: string;
  unitName: string;
  deed: string;
  emergencyContact: string;
  remark: string;
  type: number;
  success: number;
}

export default class Owner {
  public static async getOwnerList(query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<OwnerModel[]>>>(`/${modelName}/getOwnerApplyList`, {
      ...query,
    });
    if (res.code == 200) {
      return {
        ...res.data,
      };
    } else {
      throw res;
    }
  }

  public static async ownerModify(data: any) {
    const res = await http.post(`/${modelName}/ownerApply`, data);
    return res;
  }

  public static async getAllPerson(data: any) {
    const res = await http.post(`/${modelName}/getAllPerson`, data);
    return res;
  }
}
