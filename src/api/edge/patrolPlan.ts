// import Api from "./base";
import http from "./base";

const modelName = "itworks_patrol_plan";

export interface model {
  name?: string;
  status?: number;
  space_id?: string;
  event_type_id?: string;
  judgeType?: string;
  uuid?: string;
  bind_user_uuid?: string;
  selectedSpaceIds?: string[];
  json_data?: {
    [key: string]: any;
  };
  outputType?: string;
  watcherIds?: string[];
  eventTypeId?: string;
  scheduConfig?: {
    period?: number;
    stopTime?: number;
    startTime?: number;
    periodTime?: number;
    triggerCrons?: string[];
  };
  eventConfigId?: string;
  storageConfig?: {
    transferType?: string;
  };
}

export default class PatroPlan {
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
