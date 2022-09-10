// import request from "@/utils/request";
import http from "./base";

const modelName = "bpm/model";

export default class BpmModel {
  public static async getModelPage(query: any) {
    const httpRes = await http.get(`/${modelName}/page`, { params: query });
    return httpRes;
  }
  public static async getModel(id: string) {
    const httpRes = await http.get(`/${modelName}/get?id=${id}`);
    return httpRes;
  }
  public static async updateModel(data: any) {
    const httpRes = await http.put(`/${modelName}/update`, data);
    return httpRes;
  }
  public static async updateModelState(id: string, state: any) {
    const httpRes = await http.put(`/${modelName}/update-state`, { id, state });
    return httpRes;
  }
  public static async createModel(data: any) {
    const httpRes = await http.post(`/${modelName}/create`, data);
    return httpRes;
  }
  public static async deleteModel(id: string) {
    const httpRes = await http.delete(`/${modelName}/delete?id=${id}`);
    return httpRes;
  }
  public static async deployModel(id: string) {
    const httpRes = await http.post(`/${modelName}/deploy?id=${id}`);
    return httpRes;
  }
}
