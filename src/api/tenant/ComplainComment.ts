import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "evaluation";

export interface ComplainCommentModel {
  // 评价人id
  appraiseId: string;
  // 评价人
  appraiseName: string;
  // 评价人手机号
  appraisePhone: string;
  // 房号
  address: string;
  // 评价id
  evaluationId: string;
  // 关联投诉编号
  ticketId: string;
  // 评价内容
  content: string;
  // 评价对象
  jobId: string;
  jobName: string;
  // 评价星级
  score: number;
  // 评价时间
  createdTime: string;
}

export interface CreateComplainCommentModel {
  // 评价人地址
  address: string;
  // 评价人姓名
  appraiseName: string;
  // 开始日期
  startTime: string;
  // 结束日期
  endTime: string;
  // 评价星级
  score: number;
  // 租户id
  // tenantId
  // 投诉编号
  ticketId: string;
}

export default class ComplainComment {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<ComplainCommentModel[]>>>(`/${modelName}/getComplaintEvaluatePage`, {
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
