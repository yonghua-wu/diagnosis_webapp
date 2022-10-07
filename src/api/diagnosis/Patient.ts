import { Message } from "@arco-design/web-vue";
import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "patient";

// private Integer id;
// private String patientName;
// private Integer patientGender;
// private Integer patientAge;
// private String phoneNumber;
// private String pastHistory;
// private Integer userId;

export interface PatientModel {
  id: number;
  patientName: string;
  patientGender: number;
  patientAge: number;
  phoneNumber: string;
  pastHistory: string;
  userId: number;
}

export default class Patient {
  public static async page(current: number, pageSize: number) {
    const res = await http.get<HttpResponseBase<PaginationModel<PatientModel>>>(`/${modelName}/page`, {
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
  public static async getAll() {
    let current = 1;
    const resultList = [];
    do {
      const res = await this.page(current, 100);
      resultList.push(...res.list);
      if (res.list.length < 100) {
        break;
      }
    } while (current++);
    return resultList;
  }
  public static async detail(patient: string) {
    const res = await http.get<HttpResponseBase<any>>(`/${modelName}/detail`, {
      params: {
        id: patient,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: Partial<PatientModel>) {
    const res = await http.post<HttpResponseBase<number>>(`/${modelName}/update`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: Partial<PatientModel>) {
    const res = await http.post<HttpResponseBase<number>>(`/${modelName}/create`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
