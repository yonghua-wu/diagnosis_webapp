import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "visit";

export interface ComplainRevisitModel {
  //投訴編號
  ticketId: string;
  //回訪方式
  visitType: number;
  //回訪備注
  content: string;
  //回訪人
  handlerName: string;
  //回訪日期
  visitTime: string;
  //操作人
  updatedBy: string;
  //操作時間
  updatedTime: string;
}

export interface CreateComplainRevisitModel {
  // 設備id
  deviceId: string;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  // 处理人/回访人
  handlerName: string;
  // 平台
  platform: string;
  // 租戶id
  // tenantId: string;
  // 投诉编号
  ticketId: string;
  // 時間戳
  timestamp: string;
  // 版本號
  version: string;
  // 回访类型
  visitType: number;
}

export default class ComplainRevisit {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<ComplainRevisitModel[]>>>(`/${modelName}/getComplaintVisitPage`, {
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
