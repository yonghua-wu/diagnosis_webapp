import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "tencentCos";

export interface CredentailModel {
  credentials: {
    sessionToken: string;
    tmpSecretId: string;
    tmpSecretKey: string;
  };
  expiration: string;
  expiredTime: number;
  requestId: string;
  startTime: number;
}

export interface BucketInfoModel {
  bucketName: string;
  region: string;
}

export default class Cos {
  public static async getAuthorization() {
    const res = await http.post<HttpResponseBase<CredentailModel>>(`/${modelName}/getTemporaryCredential`, {});
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getBucket() {
    const res = await http.post<HttpResponseBase<BucketInfoModel>>(`/${modelName}/getBucketInfo`, {});
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
