import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "evaluation";

export interface ReportCommentModel {
  // 评价人id
  appraiseId: string;
  // 评价人
  appraiseName: string;
  // 评价人手机号
  appraisePhone: string;
  // 房号
  address: string;
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

export interface CreateReportCommentModel {
  // 评价人地址
  address: string;
  // 评价人姓名
  appraiseName: string;
  // 查询开始日期
  startTime: string;
  // 查询结束日期
  endTime: string;
  // 评价星级
  score: number;
  // 租户id
  // tenantId
  // 投诉编号
  ticketId: string;
}

export default class ReportComment {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<ReportCommentModel[]>>>(`/${modelName}/getReportEvaluatePage`, {
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
