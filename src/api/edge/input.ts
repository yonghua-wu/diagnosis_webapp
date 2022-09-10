// import Api from "./base";
import http from "./base";

// const http = new Http({
//   baseURL: process.env.VUE_APP_EDGE_BASE_URL + "/api",
//   timeout: 60000,
// });

const modelName = "itworks_input";

export interface model {
  ip?: string;
  name?: string;
  type?: string;
  nvrIp?: string;
  status?: string;
  area_id?: string;
  password?: string;
  space_id?: string;
  username?: string;
  json_data?: {
    [key: string]: any;
  };
  nvrTunnel?: string;
  uuid?: string;
  is_deleted?: string;
  create_time?: number;
  update_time?: number;
  create_by?: string;
  update_by?: string;
}

export default class Input {
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
  public static async snapshot(data: model) {
    const httpRes = await http.post(`/apply_input_snapshot`, data, {
      responseType: "blob",
    });
    return URL.createObjectURL(httpRes);
  }
}
