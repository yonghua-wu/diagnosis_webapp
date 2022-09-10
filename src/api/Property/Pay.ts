import http, { HttpResponseBase } from "./base";

const modelName = "web";

export interface PayModel {
  id: string;
  typeName: string;
  typeNameTwo: string;
  price: number;
  company: string;
  remark: string;
  type: number;
  startTime: number;
  effect: number;
  updatedBy: string;
}

export interface filterData {
  company: string;
  startTime: string;
  type: undefined;
  typeName: string;
  updatedBy: string;
  updatedTime: string;
}

export default class Pay {
  public static async getPayList(data: filterData) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/getPaySettingsList`, {
      ...data,
    });
    if (res.code === 200) {
      return {
        ...res.data,
        current: res.data.pageNum,
        size: res.data.total,
      };
    } else {
      throw res;
    }
  }

  public static async paySettings(data: any) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/propertyPaySettings`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res.msg;
    }
  }

  public static async delete(id: string) {
    const res = await http.post(`/${modelName}/deletePaySettings`, {
      id,
    });
    return res;
  }
}
