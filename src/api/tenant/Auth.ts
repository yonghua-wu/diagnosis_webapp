import http, { HttpResponseBase } from "./base";

const modelName = "/sysUser";

export default class Auth {
  public static async login(account: string, password: string) {
    const res = await http.post<HttpResponseBase<any>>(`${modelName}/login`, {
      username: account,
      password: password,
    });
    if (res.code === 200) {
      localStorage.setItem("token", res.data);
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getCode(phone: string) {
    const res = await http.post<HttpResponseBase<any>>(`${modelName}/getCode`, {
      phone: phone,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async loginByCode(phone: string, code: string) {
    const res = await http.post<HttpResponseBase<any>>(`${modelName}/phoneLogin`, {
      phone: phone,
      smsCode: code,
    });
    if (res.code === 200) {
      localStorage.setItem("token", res.data);
      return res.data;
    } else {
      throw res;
    }
  }
  public static async resetPassword(phone: string, code: string, password: string) {
    const res = await http.post<HttpResponseBase<any>>(`${modelName}/resetPassword`, {
      phone: phone,
      smsCode: code,
      password,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async activeResetPassword(newPassword: string, oldPassword: string, userId: string) {
    const res = await http.post<HttpResponseBase<any>>(`${modelName}/activeResetPassword`, {
      newPassword: newPassword,
      oldPassword: oldPassword,
      userId: userId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async logout() {
    const res = await http.post<HttpResponseBase<any>>(`${modelName}/logout`, {});
    if (res.code === 200) {
      localStorage.removeItem("token");
      return res.data;
    } else {
      throw res;
    }
  }
}
