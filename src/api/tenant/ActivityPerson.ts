import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "activityPerson";

export interface ActivityPersonModel {
  //报名人id
  personId: string;
  //报名人姓名
  personName: string;
  //报名人手机号
  personPhone: string;
  //提交人姓名
  createdBy: string;
  //提交人身份
  //地址
  blockId: string;
  //报名时间
  createdTime: string;
}

export default class ActivityPerson {
  //分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<ActivityPersonModel[]>>>(`/${modelName}/getActivityPersonList`, {
      ...query,
      pageNo: current,
      pageSize: pageSize,
    });
    if (res.code === 200) {
      return {
        ...res.data,
        current: res.data.pageNum,
        size: res.data.pageSize,
      };
    } else {
      throw res;
    }
  }
}
