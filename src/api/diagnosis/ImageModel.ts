import http, { HttpResponseBase, PaginationModel } from "./base";
import Image from "./Image";

const modelName = "imageModel";

// private Integer casebookId;
// private Integer patientId;
// private String imageAddress;
// private Integer imageProperties;
// private Integer diagnosticStatus;
// private String resultImg;

export interface ImageModelModel {
  image: Partial<Image>;
  modelIds: number[];
}

export default class ImageModel {
  // public static async page(current: number, pageSize: number) {
  //   const res = await http.get<HttpResponseBase<PaginationModel<ImageModelModel>>>(`/${modelName}/page`, {
  //     params: {
  //       current: current,
  //       size: pageSize,
  //     },
  //   });
  //   if (res.code === 200) {
  //     return res.data;
  //   } else {
  //     throw res;
  //   }
  // }
  // public static async detail(id: number) {
  //   const res = await http.get<HttpResponseBase<any>>(`/${modelName}/detail`, {
  //     params: {
  //       id: id,
  //     },
  //   });
  //   if (res.code === 200) {
  //     return res.data;
  //   } else {
  //     throw res;
  //   }
  // }
  // public static async update(data: Partial<ImageModelModel>) {
  //   const res = await http.post<HttpResponseBase<any>>(`/${modelName}/update`, {
  //     ...data,
  //   });
  //   if (res.code === 200) {
  //     return res.data;
  //   } else {
  //     throw res;
  //   }
  // }
  public static async create(data: ImageModelModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/create`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  // public static async delete(id: number) {
  //   const res = await http.delete<HttpResponseBase<any>>(`/${modelName}/delete`, {
  //     params: {
  //       id: id,
  //     },
  //   });
  //   if (res.code === 200) {
  //     return res.data;
  //   } else {
  //     throw res;
  //   }
  // }
}
