import http, { HttpResponseBase, PaginationModel } from "./base";

export interface CreateEvaluation {
  // 评价人id，对应sf_person表person_id
  appraiseId: string;
  // 评价人姓名
  appraiseName: string;
  // 评价人手机号
  appraisePhone: string;
  // 评价内容
  content: string;
  // 评价星级：1，2，3，4，5
  score: 1 | 2 | 3 | 4 | 5;
  // 工单id
  ticketId: string;
}

export interface EvaluationModel {
  // 评价人id，对应sf_person表person_id
  appraiseId: string;
  // 评价人姓名
  appraiseName: string;
  // 评价人手机号
  appraisePhone: string;
  blockId: string;
  // 评价内容
  content: string;
  createdBy: string;
  createdId: string;
  createdTime: string;
  evaluationId: number;
  // 处理人id，对应sf_staff表staff_id
  handlerId: string;
  // 处理人姓名
  handlerName: string;
  // 处理人手机号
  handlerPhone: string;
  // job_config表id
  jobId: string;
  // job_config表name
  jobName: string;
  remark: string;
  // 评价星级：1，2，3，4，5
  score: number;
  status: number;
  tenantId: string;
  // 工单id
  ticketId: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
}

export interface EvaluationQueryParams {
  // 评价人id，对应sf_person表person_id
  appraiseId?: string;
  // 评价人姓名
  appraiseName?: string;
  // 评价人手机号
  appraisePhone?: string;
  blockId?: string;
  // 评价内容
  content?: string;
  createdBy?: string;
  createdId?: string;
  evaluationId?: number;
  // 处理人id，对应sf_staff表staff_id
  handlerId?: string;
  // 处理人姓名
  handlerName?: string;
  // 处理人手机号
  handlerPhone?: string;
  // job_config表id
  jobId?: string;
  // job_config表name
  jobName?: string;
  remark?: string;
  // 评价星级：1，2，3，4，5
  score?: 1 | 2 | 3 | 4 | 5;
  status?: number;
  tenantId?: string;
  // 工单id
  ticketId?: string;
  updatedBy?: string;
  updatedId?: string;
}

const modelName = "evaluation";

export default class Evaluation {
  public static async page(current: number, pageSize: number, params: EvaluationQueryParams) {
    const res = await http.post<HttpResponseBase<PaginationModel<EvaluationModel[]>>>(`/${modelName}/getPage`, {
      ...params,
      pageNo: current,
      pageSize: pageSize,
    });
    if (res.code === 200) {
      return {
        ...res.data,
        current: res.data.pageNum,
        size: res.data.total,
      };
    } else {
      throw res;
    }
  }
  public static async create(data: CreateEvaluation) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/addEvaluation`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async findDetailByTicketId(ticketId: string) {
    const res = await http.get(`/${modelName}/getEvaluationDetail`, {
      params: {
        ticketId,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async findDetailById(evaluationId: string) {
    const res = await http.get(`/${modelName}/getEvaluation`, {
      params: {
        evaluationId,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
