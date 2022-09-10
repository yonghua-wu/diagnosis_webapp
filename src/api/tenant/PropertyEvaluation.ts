import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "propertyEvaluation";

export interface PropertyEvaluationModel {
  // 评价编号
  propertyEvaluationId: string;
  // 评价人id
  personId: string;
  // 评价人
  personName: string;
  // 房号
  personAddress: string;
  // 评价内容
  content: string;
  // 评价图片url
  contentUrl: string;
  // 评价对象
  toName: string;
  // 评价星级
  score: number;
  // 创建时间
  createdTime: string;
}
export interface CreatePropertyEvaluationModel {
  //创建时间
  createTime: string;
  //评价人房号
  personAddress: string;
  //评价人姓名
  personName: string;
  // 租客id
  // tenantId: string;
}

export default class ComplainComment {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<PropertyEvaluationModel[]>>>(`/${modelName}/getPropertyEvaluationList`, {
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
