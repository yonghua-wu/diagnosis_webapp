import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "image";

// private Integer casebookId;
// private Integer patientId;
// private String imageAddress;
// private Integer imageProperties;
// private Integer diagnosticStatus;
// private String resultImg;

export interface ImageModel {
  id: number;
  casebookId: number;
  patientId: number;
  imageAddress: string;
  imageProperties: number;
  diagnosticStatus: number;
  resultImg: string;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

export default class Image {
  public static async page(current: number, pageSize: number) {
    const res = await http.get<HttpResponseBase<PaginationModel<ImageModel>>>(`/${modelName}/page`, {
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
  public static async update(data: ImageModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/update`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async add(data: ImageModel) {
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
