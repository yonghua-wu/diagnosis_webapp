import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "ticket";

export interface TicketModel {
  // 内容描述
  content: string;
  // 创建操作人
  createdBy: string;
  // 创建操作人ID
  createdId: string;
  // 创建时间
  createdTime: string;
  // 设备或人id
  fromId: string;
  // 设备或人名称
  fromName: string;
  // 发单类型 1 员工 2 客户 3 设备
  fromType: number;
  // 组id, 工单组
  groupId: string;
  // 图片列表
  imgList: string[];
  // 事件id
  jobId: string;
  // 服务name
  jobName: string;
  // 0 是初始级别 升级可至3级，突发类别工单其实级别可能为3？？？ 规则待定
  level: number;
  // 源工单id
  originalTicketId: string;
  // 空间ID
  placeId: string;
  // place 名称
  placeName: string;
  // 备注
  remark: string;
  // 是否需要协助 1 否 2 是 协助人关联表
  requireAssist: 1 | 2 | number;
  // 工种服务类型 1 秩序 2 环境 3 机电 4 客服
  serviceClass: 1 | 2 | 3 | 4 | number;
  // 事件/工单服务类型 1 周期 2 临时 3 突发 4 对客
  serviceType: 1 | 2 | 3 | 4 | number;
  // 状态 1 待接单 2 已接单 3 已完成 4 已关闭
  state: 1 | 2 | 3 | 4 | number;
  // 当前状态更新时间
  stateUpdateTime: string;
  // 负责人/审核人
  supervisor: string;
  // 负责人/审核人姓名
  supervisorName: string;
  // 负责人/审核人手机号
  supervisorPhone: string;
  // 工单id
  ticketId: string;
  // 接单人id 派单/抢单
  toId: string;
  // 接单人名称
  toName: string;
  // 接单人电话
  toPhone: string;
  // 接单时间
  toWhen: string;
  unitId: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
  // 是否为升级工单
  upgrade: 0 | 1;
  // 工单类型
  productName: string;
  customName: string;
  customPhone: string;
}

export interface TicketLogModel {
  createdBy: string;
  createdId: string;
  // 执行人id
  executorId: string;
  // 执行人姓名
  executorName: string;
  // 执行人手机号
  executorPhone: string;
  // 执行人类型：1,工单处理人； 2,工单操作人
  executorType: number;
  id: string;
  // 工作执行流程表id
  jobProcessId: string;
  remark: string;
  imgList: string[];
  serviceClass: string;
  // 工单id
  ticketId: string;
  // 工单状态 1 待接单 2 已接单 3 已完成 4 已关闭
  ticketStatus: number;
  updatedBy: string;
  updatedId: string;
  createdTime: string;
  //结束创建时间
  //endCreatedTime: string;
  //结束更新时间
  //endUpdatedTime: string;
  //开始创建时间
  //startCreatedTime: string;
  //开始更新时间
  //startUpdatedTime: string;
}

export interface CreateTicketModel {
  // 内容
  content: string;
  // jobId工作ID
  jobId: string;
  imgList: string[];
  jobName: string;
  // 空间/设施ID
  placeId: string;
  // 空间名称
  placeName: string;
  // 报事类型
  serviceClass: number;
  fromName: string;
  fromPhone: string;
  refId?: string;
  refTickets?: CreateTicketModel[];
}

export interface TicketQueryParams {
  filterValue?: string;
  // 工种服务类型 1 秩序 2 环境 3 机电 4 客服
  serviceClass?: 1 | 2 | 3 | 4;
  // 事件/工单服务类型 1 周期 2 临时 3 突发 4 对客
  serviceType?: 1 | 2 | 3 | 4;
  status?: number[];
  product?: 1 | 2 | 3;
  placeName?: string;
  toName?: string;
  ticketId?: string;
  startTime?: number;
  endTime?: number;
  startUpdatedTime?: string;
  endUpdatedTime?: string;
  startCreatedTime?: string;
  endCreatedTime?: string;
}

/**
 * 转单接收参数
 */
export interface TransferTicketModel {
  // 转单描述
  remark: string;
  // 工单id
  ticketId: string;
  // 接单人id
  transferId: string;
  transferPhone?: string;
  transferName?: string;
}
export interface CloseTicketModel {
  imgList?: string[];
  remark?: string;
  ticketId?: string;
}

export interface ApproveTicketModel {
  // 审批状态必填,1 通过 2未通过
  approveStatus: number;
  // 提交审批描述说明
  remark: string;
  // 工单id
  ticketId: string;
}

export interface AddTicketAssistant {
  list: {
    // 协助人id
    assistantId: string;
    // 协助人姓名
    assistantName: string;
    // 协助人电话
    assistantPhone: string;
    // 头像
    assistantIcon: string;
  }[];
  // 备注
  remark: string;
  ticketId: string;
}

export interface AssistantModel {
  assistantId: string;
  assistantName: string;
  assistantPhone: string;
  createdBy: string;
  createdId: string;
  createdTime: string;
  id: string;
  remark: string;
  status: number;
  tenantId: string;
  ticketId: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
}

export default class Ticket {
  public static async page(current: number, pageSize: number, params: TicketQueryParams) {
    const res = await http.post<HttpResponseBase<PaginationModel<TicketModel[]>>>(`/${modelName}/getTicketPage`, {
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
  public static async pageByService(current: number, pageSize: number, params: TicketQueryParams) {
    const res = await http.post<HttpResponseBase<PaginationModel<TicketModel[]>>>(`/${modelName}/getCustomerQualityTicketPage`, {
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
  public static async findListByParentTicketId(ticketId: string) {
    const res = await http.post<HttpResponseBase<TicketModel[]>>(`/${modelName}/getSubTicketPage`, {
      refId: ticketId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<TicketModel>>(`/${modelName}/getTicket`, {
      ticketId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: TicketModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateTicket`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateTicketModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addTicket`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteTicket`, {
      params: {
        ticketId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getTicketLog(id: string) {
    const res = await http.get<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/log/getTicketLogList`, {
      params: {
        ticketId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async transferTicket(data: TransferTicketModel) {
    const res = await http.post<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/transferTicket`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async closeTicket(data: CloseTicketModel) {
    const res = await http.post<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/closeTicket`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async cancelTicket(data: { remark: string; ticketId: string }) {
    const res = await http.post<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/cancelTicket`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async approveTicket(data: ApproveTicketModel) {
    const res = await http.post<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/approveTicket`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async finishTicket(ticketId: string, remark: string) {
    const res = await http.post<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/completeTicket`, {
      ticketId,
      remark,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getTicketBoard() {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/getTicketBoard`, {
      params: {},
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  /**
   * 处理工单，工单状态置为 2
   * @param ticketId 工单id
   * @param remark 备注
   */
  public static async handleTicket(ticketId: string, remark: string) {
    // 处理工单
    const res = await http.post<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/updateComplaintReport`, {
      ticketId,
      state: 2,
      remark,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  /**
   * 反馈完成工单，工单状态置为 3
   * @param ticketId 工单id
   * @param remark 备注
   */
  public static async feedbackFinishTicket(ticketId: string, remark: string) {
    const res = await http.post<HttpResponseBase<TicketLogModel[]>>(`/${modelName}/updateComplaintReport`, {
      ticketId,
      state: 3,
      remark,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  // public static async getChildrenTicketList(ticketId: string) {
  //   const res = await http.post<HttpResponseBase<TicketModel[]>>(`/${modelName}/getSubTicketPage`, {
  //     refId: ticketId,
  //   });
  //   if (res.code === 200) {
  //     return res.data;
  //   } else {
  //     throw res;
  //   }
  // }
  public static async createGuestOrientedOrder(data: CreateTicketModel) {
    const res = await http.post<HttpResponseBase<TicketModel[]>>(`/${modelName}/addCustomTicket`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async acceptTicket(data: { ticketId: string; remark: string }) {
    const res = await http.post<HttpResponseBase<TicketModel[]>>(`/${modelName}/handleTicket`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async pauseTicket(ticketId: string, remark: string) {
    const res = await http.post<HttpResponseBase<TicketModel[]>>(`/${modelName}/stopTicket`, {
      ticketId,
      remark,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async continueTicket(ticketId: string) {
    const res = await http.post<HttpResponseBase<TicketModel[]>>(`/${modelName}/continueTicket`, {
      ticketId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async findAssistantByTicketId(ticketId: string) {
    const res = await http.get<HttpResponseBase<AssistantModel[]>>(`/${modelName}/assistant/getAll`, {
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
  public static async addAssistant(data: AddTicketAssistant) {
    const res = await http.post<HttpResponseBase<TicketModel[]>>(`/${modelName}/assistant/addAssistant`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async exportWorkOrderData(query: TicketQueryParams) {
    const res = await http.post<Blob>(`/${modelName}/exportWebTicketFile`, query, {
      responseType: "blob",
    });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(res);
    const filename = "工单列表";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    return res;
  }
  public static async exportReportData(query: TicketQueryParams) {
    const res = await http.post<Blob>(`/${modelName}/exportReportFile`, query, {
      responseType: "blob",
    });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(res);
    const filename = "报事列表";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    return res;
  }
  public static async exportComplainData(query: TicketQueryParams) {
    const res = await http.post<Blob>(`/${modelName}/exportComplaintFile`, query, {
      responseType: "blob",
    });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(res);
    const filename = "投诉列表";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    return res;
  }
  public static async exportCustomerTicketData(query: TicketQueryParams) {
    const res = await http.post<Blob>(`/${modelName}/exportWebCustomerTicketFile`, query, {
      responseType: "blob",
    });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(res);
    const filename = "客服工单列表";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    return res;
  }
}
