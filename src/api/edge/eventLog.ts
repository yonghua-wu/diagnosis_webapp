// import Api from "./base";
import http from "./base";

const modelName = "itworks_event_log";

export interface model {
  plan_id?: string;
  watcher_id?: string;
  vbpg_ids?: any[];
  judge_type?: string;
  uuid?: string;
  space_id?: string;
  status?: number;
  is_deleted?: number;
  create_time?: number;
  update_time?: number;
  create_by?: string;
  update_by?: string;
}

export default class EventLog {
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
  public static async add(data: model) {
    const httpRes = await http.post(`/${modelName}/add`, data);
    if (httpRes.code === "00200") {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  public static async update(data: model) {
    const httpRes = await http.post(`/${modelName}/update`, data);
    if (httpRes.code === "00200") {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  public static async delete(uuids: string[]) {
    const httpRes = await http.post(`/${modelName}/delete`, {
      uuids,
    });
    if (httpRes.code === "00200") {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
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
}
