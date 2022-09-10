import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "visit";

export interface RevisitModel {
  // 回访内容
  content: string;
  // 回访图片
  contentUrl: string;
  createdBy: string;
  createdId: string;
  createdTime: string;
  // 处理人id，对应sf_staff表staff_id
  handlerId: string;
  // 处理人姓名
  handlerName: string;
  // 处理人手机号
  handlerPhone: string;
  // 事件id
  jobId: string;
  // 服务name
  jobName: string;
  remark: string;
  // 投诉/报事 编号
  ticketId: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
  // integer
  visitId: number;
  // 回访时间
  visitTime: string;
  // 回访方式： 1电话回访（默认） 2 当面回访 3 微信回访 4 思流IM回访integer
  visitType: number;
}

export interface CreateRevisitModel {
  content?: string;
  contentUrl?: string;
  handlerId?: string;
  handlerName?: string;
  handlerPhone?: string;
  operatorId?: string;
  operatorName?: string;
  operatorPhone?: string;
  ticketId?: string;
  visitTime?: number;
  visitType?: number;
}

export default class Revisit {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<RevisitModel[]>>>(`/${modelName}/getSysRolePage`, {
      pageNo: current,
      pageSize: pageSize,
      ...query,
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
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/getSysRoleDetail`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: RevisitModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateSysRole`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateRevisitModel, type: "REPORT" | "COMPLAIN") {
    let res;
    if (type === "REPORT") {
      res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addReportVisit`, data);
    } else {
      res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addComplaintVisit`, data);
    }
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteSysRole`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getVisitDetailByTicketId(ticketId: string) {
    const res = await http.get<HttpResponseBase<RevisitModel[]>>(`/${modelName}/getVisitDetailByTicketId`, {
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
}
