import http, { HttpResponseBase } from "./base";

const modelName = "ticket";

export interface PageResult<T> {
  list: T[];
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页 size
   */
  pageSize: number;
  /**
   * 总记录数
   */
  total: number;
  /**
   * 总页数
   */
  totalPage: number;
}

export type TicketType = 1 | 2 | 3 | 4 | 5;

export interface TicketQueryData {
  /**
   * 页数
   */
  pageNo: number;
  /**
   * 页大小
   */
  pageSize: number;
  address?: string;
  approve?: string;
  ascription?: string;
  bpmKey?: string;
  content?: string;
  createDate?: string;
  createdBy?: string;
  createdTime?: string;
  currentProcessor?: string;
  currentProcessorId?: string;
  endPicture?: string;
  endTime?: string;
  eventPicture?: string;
  filterValue?: string;
  income?: number;
  jobId?: string;
  name?: string;
  maximum?: number;
  exclusiveMaximum?: false;
  placeId?: string;
  priority?: number;
  startTime?: string;
  /**
   * 工单状态 1 待接收 2 处理中 3 已完成 4 已取消 99删除
   */
  status?: TicketType;
  statusList?: number[];
  tenantId?: string;
  ticketId?: string;
  type?: number;
  updatedBy?: string;
  updatedTime?: string;
}

export interface TicketData {
  /**
   * 工单地点
   */
  address?: string;

  /**
   * 审核/验收人
   */
  approve?: string;

  /**
   * 服务归属
   */
  ascription?: string;

  /**
   * 流程id
   */
  bpmId?: string;

  /**
   * 工作流模型key
   */
  bpmKey?: string;

  /**
   * 工单描述
   */
  content?: string;

  /**
   * 创建人
   */
  createdBy?: string;

  /**
   * 工单创建时间
   */
  createdTime?: number;

  /**
   * 当前处理人
   */
  currentProcessor?: string;

  /**
   * 当前处理人ID
   */
  currentProcessorId?: string;

  /**
   * 完成时上传图片或摄像头关单截图
   */
  endPicture?: string;

  /**
   * 工单结束时间
   */
  endTime?: number;

  /**
   * 事件上传图片
   */
  eventPicture?: string;

  /**
   * 预计收入
   */
  income?: number;

  /**
   * 事件id
   */
  jobId?: string;

  /**
   * 工单名称
   */
  name?: string;

  /**
   * sf_place_id
   */
  placeId?: string;

  /**
   * 优先级
   */
  priority?: 0 | 1 | 2 | 3;

  /**
   * 工单开始时间
   */
  startTime?: number;

  /**
   * 工单状态 1 待接收 2 处理中 3 已完成 4 已取消 99删除
   */
  status?: TicketType;

  /**
   * tenant_id
   */
  tenantId: string;

  /**
   * ticketId
   */
  ticketId: string;

  /**
   * 工单类型 1 周期 2 临时
   */
  type?: 1 | 2;

  /**
   * 更新人
   */
  updatedBy?: string;

  /**
   * 修改更新时间
   */
  updatedTime?: number;
}

export interface TicketLogList {
  content: string;
  createdBy: string;
  createdTime: string;
  eventPicture: string;
  id: string;
  processor: string;
  processorName: string;
  status: number;
  taskDefinitionKey: string;
  taskDefinitionName: string;
  ticketId: string;
  type: number;
  updatedBy: string;
  updatedTime: string;
}

export default class Ticket {
  public static async getPage(queryData: TicketQueryData) {
    const httpRes = await http.post<HttpResponseBase<PageResult<TicketData>>>(`/${modelName}/getPage`, queryData);
    if (httpRes.code === 200) {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  public static async update(data: TicketData) {
    const httpRes = await http.post<HttpResponseBase<boolean>>(`/${modelName}/modify`, data);
    if (httpRes.code === 200) {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  public static async create(data: TicketData) {
    const httpRes = await http.post<HttpResponseBase<boolean>>(`/${modelName}/create`, data);
    if (httpRes.code === 200) {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  public static async detail(ticketId: string) {
    const httpRes = await http.get<HttpResponseBase<TicketData>>(`/${modelName}/getDetail?ticketId=${ticketId}`);
    if (httpRes.code === 200) {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
  public static async getLogList(ticketId: string) {
    const httpRes = await http.post<HttpResponseBase<TicketLogList[]>>(`/${modelName}/log/getlist`, {
      ticketId,
    });
    if (httpRes.code === 200) {
      return httpRes.data;
    } else {
      throw httpRes;
    }
  }
}
