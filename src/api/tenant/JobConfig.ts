import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "jobConfig";

export interface JobConfigModel {
  // 1 转工单 2 不转工单 3 通知
  action: number;
  // 工作流id
  activitiId: string;
  // 流程模型id
  activitiModelId: string;
  // ai计算 1 实时 2 非实时
  ai: number;
  // 配置流程 1 是 2否
  configProcess: number;
  // 施工等级
  constructionLevel: number;
  createdBy: string;
  createdId: string;
  createdTime: string;
  // 难度系数
  difficulty: number;
  // 频率
  frequency: number;
  // 单位
  frequencyUnit: string;
  // 生成工单 1是 2否
  generateTicket: number;
  id: string;
  // 工作内容
  jobName: string;
  // 等级
  level: number;
  // 方法
  method: string;
  // 1 公区巡查 2 资产巡查 3 人行管理 4 车型管理 5 安全管理 6 日常清洁 7 绿化管理 8 消杀 9 保洁管理 10 公区维保 11 泵房维保 12 中水处理 13 污水处理 14 消防设备维保 15 电梯维保 16 配电房维保 17 建筑物维保 18 暖通系统维保 19 智能化设备维保 20 工具装备维保 21 能耗管理 22 泳池维保 23 个体服务 24 集体服务 25 应急处理 26 综合巡逻 27 远程管理 28 车场管理 29 数字化管理
  module: number;
  // 1 巡逻 2 维保 3 品质巡查 4 普通 5 监控 6管理 7环境 8客服 9泳池 10应急
  product: number;
  remark: string;
  // 工种类型 1 安全 2 环境 3 机电 4 客服 5 管理
  serviceClass: number;
  // 服务类型 1 周期 2 临时 3 突发 4 对客 PS：周期性只有人
  serviceType: number;
  // 1 业主可见 2 业主不可见
  showPerson: number;
  // 标准： 1思流（默认） 2 自定义
  standard: number;
  // 标准工时
  standardWorkTime: number;
  // 工时说明
  standardWorkTimeDesc: string;
  status: number;
  tenantId: string;
  // 1 刚需 2 品质 3 增值
  tier: number;
  // 1 员工 2 客户 3 设备
  type: number;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
}

export interface CreateJobConfigModel {
  //部门id
  deptId: string;
  //部门名称
  deptName: string;
  //工号
  empNo: string;
  //用户真实姓名
  realName: string;
  //备注
  remark: string;
  //角色 id 列表
  roleIds: string[];
  //邮箱
  userEmail: string;
  //头像
  userIcon: string;
  //手机号
  userPhone: string;
  //登录账号
  username: string;
}
export interface JobModuleModel {
  createdBy: string;
  createdId: string;
  createdTime: string;
  moduleId: number;
  moduleName: string;
  remark: string;
  serviceClass: number;
  status: number;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
  product: number;
}

export default class JobConfig {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<JobConfigModel[]>>>(`/${modelName}/getJobConfigListByPageAndCondition`, {
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
  public static async all(query: any = {}) {
    const list: JobConfigModel[] = [];
    let current = 1;
    let res: PaginationModel<JobConfigModel[]>;
    do {
      res = await this.page(current, 50, query);
      list.push(...res.list);
    } while (res.total > current++ * 50);
    return list;
  }
  public static async findById(jobId: string) {
    const res = await http.post<HttpResponseBase<JobConfigModel>>(`/${modelName}/getJobConfigDetailById`, {
      id: jobId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async findByModule(id: string) {
    const list: JobConfigModel[] = [];
    let current = 1;
    let res: PaginationModel<JobConfigModel[]>;
    do {
      res = (
        await http.post<HttpResponseBase<PaginationModel<JobConfigModel[]>>>(`/${modelName}/getJobConfigByModule`, {
          keyName: id,
          pageNo: current,
          pageSize: 50,
        })
      ).data;
      list.push(...res.list);
    } while (res.total > current++ * 50);
    return list;
  }
  public static async findModuleByServiceClass(id: string) {
    const list: JobModuleModel[] = [];
    let current = 1;
    let res: PaginationModel<JobModuleModel[]>;
    do {
      res = (
        await http.post<HttpResponseBase<PaginationModel<JobModuleModel[]>>>(`/${modelName}/getJobConfigModuleByServiceClass`, {
          keyName: id,
          pageNo: current,
          pageSize: 50,
        })
      ).data;
      list.push(...res.list);
    } while (res.total > current++ * 50);
    return list;
  }
  public static async modifyGenerateTicket(id: string, status: 1 | 2) {
    const res = await http.post<HttpResponseBase<JobConfigModel>>(`/${modelName}/modifyGenerateTicket`, {
      id,
      status,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
