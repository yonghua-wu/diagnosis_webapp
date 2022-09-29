import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "model";
// private String modelAddress;
export interface ModelModel {
  id: number;
  modelAddress: string;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

export default class Model {
  public static async page(current: number, pageSize: number) {
    const res = await http.get<HttpResponseBase<PaginationModel<ModelModel>>>(`/${modelName}/page`, {
      params: {
        current: current,
        size: pageSize,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async detail(id: number) {
    const res = await http.get<HttpResponseBase<any>>(`/${modelName}/detail`, {
      params: {
        id: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: ModelModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/update`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async add(data: ModelModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/add`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: number) {
    const res = await http.delete<HttpResponseBase<any>>(`/${modelName}/delete`, {
      params: {
        id: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
