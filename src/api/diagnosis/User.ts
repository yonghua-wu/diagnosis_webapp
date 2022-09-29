import { Message } from "@arco-design/web-vue";
import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "user";

export interface UserModel {
  username: string;
  gender: number;
  workExperience: number;
  title: string;
  realName: string;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

export default class User {
  public static async page(current: number, pageSize: number) {
    const res = await http.get<HttpResponseBase<PaginationModel<UserModel>>>(`/${modelName}/page`, {
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
  public static async login(username: string, password: string) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/login`, {
      username,
      password,
    });
    if (res.code === 403) {
      Message.error(res.msg);
    }
    if (res.code === 200) {
      localStorage.setItem("token", res.data);
      return res.data;
    } else {
      throw res;
    }
  }
  public static async detail(userId: string) {
    const res = await http.get<HttpResponseBase<any>>(`/${modelName}/detail`, {
      params: {
        id: userId,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: UserModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/update`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: UserModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/create`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
