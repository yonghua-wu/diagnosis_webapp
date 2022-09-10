import http, { HttpResponseBase, PaginationModel } from "./base";
const modelName = "envMaintenancePlan";

/**
 * 周期性计划任务
 */
export interface CyclicalPlanTaskModel {
  // 创建操作人
  createdBy?: string;
  // 创建操作人ID
  createdId?: string;
  // 创建时间
  createdTime?: string;
  // cron-天
  cronDays?: string;
  // cron
  cronExpress?: string;
  // 频率单位 1 秒 2 分 3 小时 4 天 5 周 6 月 7 年
  cronFreqUnit?: number;
  // cron-小时
  cronHours?: number;
  // cron-分钟
  cronMinutes?: number;
  // cron-月
  cronMonths?: string;
  // cron-秒
  cronSeconds?: number;
  // cron-周
  cronWeeks?: string;
  // cron-年
  cronYears?: string;
  // 租户周期性计划ID
  planId?: string;
  // id
  planTaskId?: number;
  // 备注
  remark?: string;
  // 所属租户
  tenantId?: string;
  // 更新操作人
  updatedBy?: string;
  // 更新操作人ID
  updatedId?: string;
  // 更新时间
  updatedTime?: string;
  // job中定时任务Id
  xxlJobId?: number;
}

export interface CyclicalMaintenancePlaces {
  createdBy: string;
  createdId: string;
  createdTime: string;
  placeId: string;
  placeName: string;
  planId: string;
  planPlaceId: number;
  remark: string;
  tenantId: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
}

/**
 * 巡逻计划信息
 */
export interface MaintenancePlanModel {
  // 创建操作人
  createdBy: string;
  // 创建操作人ID
  createdId: string;
  // 创建时间
  createdTime: string;
  cyclicalMaintenancePlaces: CyclicalMaintenancePlaces[];
  cyclicalPlanTasks: CyclicalPlanTaskModel[];
  // 工作组ID
  groupId: string;
  // 工作组名称
  groupName: string;
  // id
  id: string;
  // 工作配置ID
  jobId: string;
  // 工作名称
  jobName: string;
  // 工种分类 1 秩序 2 环境 3 机电 4 客服 5 管理
  jobServiceClass: 1 | 2 | 3 | 4 | 5;
  // 服务类型 1 周期 2 临时 3 突发 4 对客 PS：周期性只有人
  jobServiceType: number;
  // 1 员工 2 客户 3 设备
  jobType: number;
  // 计划名称
  planName: string;
  nextExecuteTime: string;
  // 1 巡逻 2 维保 3 品质巡查 4 普通工单
  product: 1;
  // 备注
  remark: string;
  // 状态 1 使用 2 禁用 99删除
  status: 1 | 2;
  // 接单人id 派单/抢单
  toId: string;
  // 接单人名称
  toName: string;
  // 手机号
  toPhone: string;
  // 更新操作人
  updatedBy: string;
  // 更新操作人ID
  updatedId: string;
  // 更新时间
  updatedTime: string;
}

export interface CreateMaintenancePlanModel {
  // 周期性计划路线
  addCyclicalPlanPlaces: CyclicalMaintenancePlaces[];
  // 周期性计划任务
  addCyclicalPlanTasks: CyclicalPlanTaskModel[];
  // 周期性计划路线
  deleteCyclicalPlanPlaces: CyclicalMaintenancePlaces[];
  // 周期性计划任务
  deleteCyclicalPlanTasks: CyclicalPlanTaskModel[];
  jobId: string;
  // 工作名称
  jobName: string;
  // 工种分类 1 秩序 2 环境 3 机电 4 客服 5 管理
  jobServiceClass: number;
  // 服务类型 1 周期 2 临时 3 突发 4 对客 PS：周期性只有人
  jobServiceType: number;
  // 计划名称
  planName: string;
  // 备注
  remark: string;
  id?: string;
  toId?: string;
  toName?: string;
  toPhone?: string;
}

/**
 * 分页查询参数
 */
export interface MaintenancePlanQueryModel {
  // 工作组ID
  groupId?: string;
  // 工作组名称
  groupName?: string;
  // 工作配置ID
  jobId?: string;
  // 工作名称
  jobName?: string;
  // 工种分类 1 秩序 2 环境 3 机电 4 客服 5 管理
  jobServiceClass?: number;
  // 服务类型 1 周期 2 临时 3 突发 4 对客 PS：周期性只有人
  jobServiceType?: number;
  // 1 员工 2 客户 3 设备
  jobType?: number;
  // 计划名称
  planName?: string;
  // 1 巡逻 2 维保 3 品质巡查 4 普通工单
  product?: number;
  // 状态 1 使用 2 禁用 99删除
  status?: number;
  // 接单人id 派单/抢单
  toId?: string;
  // 接单人名称
  toName?: string;
  // 手机号
  toPhone?: string;
  deviceId?: string;
  placeId?: string;
}

export default class MaintenancePlan {
  public static async page(current: number, pageSize: number, query?: MaintenancePlanQueryModel) {
    const res = await http.post<HttpResponseBase<PaginationModel<MaintenancePlanModel[]>>>(`/${modelName}/getMaintenancePlanPage`, {
      ...query,
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
  public static async pageByPlaceId(query?: MaintenancePlanQueryModel) {
    const res = await http.post<HttpResponseBase<MaintenancePlanModel[]>>(`/${modelName}/getMaintenancePlanDetailListByPlaceId`, {
      ...query,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<MaintenancePlanModel>>(`/${modelName}/getMaintenancePlanDetail`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateMaintenancePlanModel) {
    const res = await http.post<HttpResponseBase<null>>(`/${modelName}/addMaintenancePlan`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: Partial<CreateMaintenancePlanModel>) {
    const res = await http.post<HttpResponseBase<null>>(`/${modelName}/updateMaintenancePlan`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteMaintenancePlan`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async deletes(ids: string[]) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteBatchMaintenancePlan`, {
      ids,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async enable(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/enableMaintenancePlan`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async disable(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/disableMaintenancePlan`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
