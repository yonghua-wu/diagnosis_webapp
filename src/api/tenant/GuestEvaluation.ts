// 暂时使用工单投诉评价的接口,因为获取的数据和投诉评价并不完全
// 相同，所以新建查询
import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "evaluation";

export interface GuestEvaluationModel {
  // 评价人地址
  address: string;
  // 评价人id
  appraiseId: string;
  // 评价人姓名
  appraiseName: string;
  // 评价人手机号
  appraisePhone: string;
  // 创建人
  createdBy: string;
  // 创建人id
  createdId: string;
  // 创建时间
  createdTime: string;
  // 评价id
  evaluationId: string;
  // 关联工单编号
  ticketId: string;
  // 评价内容
  content: string;
  // 评价对象
  jobName: string;
  jobId: string;
  // 评价星级
  score: string;
}

export interface CreateGuestEvaluationModel {
  // 评价人地址
  address: string;
  // 评价人姓名
  appraiseName: string;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  // 评价星级
  score: string;
  // 租户id
  // tenantId
  // 关联工单编号
  ticketId: string;
}

export default class GuestEvaluation {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<GuestEvaluationModel[]>>>(`/${modelName}/getComplaintEvaluatePage`, {
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
