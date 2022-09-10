// import Api from "./base";
import http from "./base";

const modelName = "itworks_vbpg_log";

export interface model {
  config?: any;
  fileName?: string;
  is_deleted?: number;
  judge_result?: any;
  judge_type?: string;
  plan_id?: string;
  resources?: any[];
  space_id?: string;
  status?: number;
  ts?: number;
  update_by?: string | null;
  update_time?: string;
  uuid?: string;
  watcher_id?: string;
}

export default class EventType {
  public static async page(current: number, size: number, params: model = {}) {
    const data = {
      ...params,
      startIndex: (current - 1) * size,
      endIndex: (current - 1) * size + size,
    };
    const httpRes = await http.post(`/${modelName}/page`, data);
    if (httpRes.code === "00200") {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  // public static async add(data: model) {
  //   const httpRes = await http.post(`/${modelName}/add`, data);
  //   if (httpRes.code === "00200") {
  //     return httpRes.data;
  //   } else {
  //     throw httpRes;
  //   }
  // }
  public static async update(data: model) {
    const httpRes = await http.post(`/${modelName}/update`, data);
    if (httpRes.code === "00200") {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  // public static async delete(uuids: string[]) {
  //   const httpRes = await http.post(`/${modelName}/delete`, {
  //     uuids,
  //   });
  //   if (httpRes.code === "00200") {
  //     return httpRes.data;
  //   } else {
  //     throw httpRes;
  //   }
  // }
  public static async findById(uuid: string) {
    const httpRes = await http.post(`/${modelName}/findById`, {
      uuid,
    });
    if (httpRes.code === "00200") {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  public static async staticVBPG(planId: string, fileName: string) {
    return await http.get("/vbpg/" + planId + "/" + fileName, {
      responseType: "arraybuffer",
      baseURL: process.env.VUE_APP_EDGE_BASE_URL,
    });
  }
}
