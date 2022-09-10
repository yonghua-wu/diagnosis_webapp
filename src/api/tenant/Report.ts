import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "ticket";

export interface ReportModel {
  // 服务类型
  serviceClass: number;
  // 报事编号
  ticketId: string;
  // 工单类型
  product: number;
  // 工单类型名称
  productName: string;
  // 工单地点
  placeId: string;
  // 工单地点描述
  placeName: string;
  // 状态
  state: number;
  // 状态更新时间
  stateUpdateTime: string;
  // 提交图片列表
  commitImgList: string[];
  // 提交备注
  completeRemark: string;
  // 提交时间
  completeTime: string;
  // 提交工单描述
  content: string;
  // 创建人
  createdBy: string;
  // 创建Id
  createdId: string;
  // 创建时间
  createdTime: string;
  // 更新人
  updatedBy: string;
  // 更新Id
  updatedId: string;
  // 更新时间
  updatedTime: string;
  // 客户姓名
  customName: string;
  // 客户电话
  customPhone: string;
  // 事件id
  jobId: string;
  // 服务事件名称
  jobName: string;
  // 处理人姓名
  toName: string;
  // 接单事件
  toWhen: string;
  // 报事状态
  status: number;
}

export interface CreateReportModel {
  // 状态
  state: number;
  // 租户id
  // tenantId: string;
  // 工单id
  ticketId: string;
  // 接单人id
  toId: string;
}

export default class Report {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<ReportModel[]>>>(`/${modelName}/getReportPage`, {
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
