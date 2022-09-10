import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "ticket";

export interface ComplainModel {
  // 服务类型
  serviceClass: number;
  // 投诉编号
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
  // 服务事件名称
  jobName: string;
  // 处理人姓名
  toName: string;
  // 接单事件
  toWhen: string;
}

export interface CreateComplainModel {
  // 投诉人 模糊查询
  complaintName: string;
  // 回访时间-结束时间
  endTime: string;
  // 回访时间-开始时间
  startTime: string;
  // 处理人
  handlerName: string;
  // 状态
  state: number;
  // 报事编号
  ticketId: string;
}

export default class Complain {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<ComplainModel[]>>>(`/${modelName}/getComplaintPage`, {
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
