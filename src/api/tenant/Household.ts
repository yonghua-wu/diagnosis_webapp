import http from "./base";

const modelName = "mainPerson";
export interface blockModel {
  blockId: string;
  name: string;
}
export interface buildingModel {
  buildingId: string;
  buildingNo: string;
}
export interface unitModel {
  unitId: string;
  name: string;
}
export interface operationLogModel {
  id: string;
  message: string;
  remark: string;
  title: string;
}

export default class Household {
  public static async addAllPersonList(data: any) {
    const res = await http.post(`/${modelName}/addAllPersonList`, data);
    if (res.code == 200) {
      return res;
    }
  }

  public static async getHousehold(query: any) {
    const res = await http.post(`/${modelName}/getAllPersonList`, query);
    return res;
  }

  public static async getBlock() {
    const res = await http.get(`/common/getBlock`);
    return res;
  }

  public static async getBuilding(data: any) {
    const res = await http.post(`/common/getBuilding`, data);
    return res;
  }

  public static async getBuildingByUnit(data: any) {
    const res = await http.post(`/common/getBuildingByUnit`, data);
    return res;
  }

  public static async deleteAllPerson(data: any) {
    const res = await http.post(`/${modelName}/deleteAllPerson`, data);
    return res;
  }
}
