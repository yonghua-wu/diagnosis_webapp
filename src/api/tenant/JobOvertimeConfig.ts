import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "job-overtime-config";

export interface JobOvertimeConfigModel {
  // 自动验收开关 1开 2 关	integer(int32)
  autoAccept: number;
  // 自动验收超时时间: 21-24小时；22-48小时；23-72小时；24-1周，25-1月	integer(int32)
  autoAcceptOvertime: number;
  // 小区id	string
  blockId: string;
  // string
  createdBy: string;
  // string
  createdId: string;
  // string(date-time)
  createdTime: string;
  // 事件id	string
  jobId: string;
  // job name	string
  jobName: string;
  // 工单状态超时配置id	integer(int64)
  jobOvertimeConfigId: number;
  // 处理方式	integer(int32)
  jobOvertimeType: number;
  // 通知角色(json)，1当前工单处理人 2 业务主管 3 值班主管 4 项目经理 5 值班经理	array	integer
  noticeRole: number[];
  // 配置时长: 1-1s; 2-5s; 3-10s; 4-30s; 5-1m; 6-2m; 7-3m; 8-4m; 9-5m; 10-6m; 11-7m; 12-8m; 13-9m; 14-10m; 15-20m; 16-30m; 17-1h; 18-2h; 19-15m; 20-45m	integer(int32)
  overtime: number;
  // 超时开关 1开 2 关	integer(int32)
  overtimeSwitch: number;
  // 备注	string
  remark: string;
  // 状态	integer(int32)
  status: number;
  // string
  tenantId: string;
  // 工单状态 1 待接单 2 已接单 3 已完成/待验收 4 已关闭 5 待分配 6 处理中 8 已通过 9 未通过 10 已取消	integer(int32)
  ticketStatus: number;
  // 工单状态名称	string
  ticketStatusName: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
}

export interface QueryJobOvertimeConfigModel {
  [key: string]: any;
}

export interface CreateJobOvertimeConfigModel {
  //	自动验收开关 1开 2 关		false
  autoAccept: number;
  //	自动验收超时时间: 21-24小时；22-48小时；23-72小时；24-1周，25-1月		false
  autoAcceptOvertime: number;
  //	事件id		false
  jobId: string;
  //	job name		false
  jobName: string;
  //	处理方式		false
  jobOvertimeType: number;
  //	通知角色(json)，1当前工单处理人 2 业务主管 3 值班主管 4 项目经理 5 值班经理		false
  noticeRole: number[];
  //	配置时长: 1-1s; 2-5s; 3-10s; 4-30s; 5-1m; 6-2m; 7-3m; 8-4m; 9-5m; 10-6m; 11-7m; 12-8m; 13-9m; 14-10m; 15-20m; 16-30m; 17-1h; 18-2h; 19-15m; 20-45m		false
  overtime: number;
  //	超时开关 1开 2 关		false
  overtimeSwitch: number;
  //	工单状态 1 待接单 2 已接单 3 已完成/待验收 4 已关闭 5 待分配 6 处理中 8 已通过 9 未通过 10 已取消		false
  ticketStatus: number;
  //	工单状态名称		false
  ticketStatusName: string;
  // 是否应用到同类型事件, 1 是 2 否
  isAlike: number;
  // 工单类型
  product: number;
}
export interface UpdateJobOvertimeConfigModel {
  // 	自动验收开关 1开 2 关		false
  autoAccept: number;
  // 	自动验收超时时间: 21-24小时；22-48小时；23-72小时；24-1周，25-1月		false
  autoAcceptOvertime: number;
  // 	事件id		false
  jobId: string;
  // 	job name		false
  jobName: string;
  // 	工单状态超时配置id		false
  jobOvertimeConfigId: number;
  // 	处理方式		false
  jobOvertimeType: number;
  // 	通知角色(json)，1当前工单处理人 2 业务主管 3 值班主管 4 项目经理 5 值班经理		false
  noticeRole: number[];
  // 	配置时长: 1-1s; 2-5s; 3-10s; 4-30s; 5-1m; 6-2m; 7-3m; 8-4m; 9-5m; 10-6m; 11-7m; 12-8m; 13-9m; 14-10m; 15-20m; 16-30m; 17-1h; 18-2h; 19-15m; 20-45m		false
  overtime: number;
  // 	超时开关 1开 2 关		false
  overtimeSwitch: number;
  // 			false
  tenantId: string;
  // 	工单状态 1 待接单 2 已接单 3 已完成/待验收 4 已关闭 5 待分配 6 处理中 8 已通过 9 未通过 10 已取消		false
  ticketStatus: number;
  // 	工单状态名称		false
  ticketStatusName: string;
  // 是否应用到同类型事件, 1 是 2 否
  isAlike: number;
  // 工单类型
  product: number;
}

export default class JobOvertimeConfig {
  public static async page(current: number, pageSize: number, query: QueryJobOvertimeConfigModel = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<JobOvertimeConfigModel[]>>>(`/${modelName}/getPage`, {
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
  public static async getAll() {
    const list: JobOvertimeConfigModel[] = [];
    let current = 1;
    let res: PaginationModel<JobOvertimeConfigModel[]>;
    do {
      res = await this.page(current, 100);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async getDetailByJobIdAndStatus(jobId: string, ticketStatus: string | number) {
    const res = await http.get<HttpResponseBase<JobOvertimeConfigModel>>(`/${modelName}/getJobOvertimeConfig`, {
      params: {
        jobId,
        ticketStatus,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async detail(id: string) {
    const res = await http.get<HttpResponseBase<JobOvertimeConfigModel>>(`/${modelName}/getUserGroup`, {
      params: {
        jobOvertimeTypeId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: UpdateJobOvertimeConfigModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateJobOvertimeConfig`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateJobOvertimeConfigModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addJobOvertimeConfig`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.get<HttpResponseBase<{}>>(`/${modelName}/deleteJobOvertimeConfig`, {
      params: {
        jobOvertimeTypeId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
