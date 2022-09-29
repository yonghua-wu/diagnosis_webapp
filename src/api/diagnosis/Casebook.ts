import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "casebook";

export interface CasebookModel {
  id: number;
  patientDescription: string;
  diagnosticStatus: number;
  rvsIdentificationResult: string;
  maIdentificationResult: string;
  doctorAdvice: string;
  userId: number;
  patientId: number;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

export default class Casebook {
  public static async page(current: number, pageSize: number) {
    const res = await http.get<HttpResponseBase<PaginationModel<CasebookModel>>>(`/${modelName}/page`, {
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
  public static async update(data: CasebookModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/update`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async add(data: CasebookModel) {
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
