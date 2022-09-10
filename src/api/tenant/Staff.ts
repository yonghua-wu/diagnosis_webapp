import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "tenant-staff";

export interface StaffModel {
  //月补贴
  allowenceMth: number;
  //银行卡号
  bankAccount: string;
  //小区id
  blockId: string;
  blockName: string;
  //年终奖
  bonusAnnual: number;
  //月固定奖金
  bonusMth: number;
  //合约文件
  contraceFile: string;
  //合约到期日
  contractEnd: string;
  //工种类型 1 员工 2 主管
  craft: number;
  //创建操作人
  createdBy: string;
  //创建操作人ID
  createdId: string;
  //创建时间
  createdTime: string;
  //部门id
  deptId: string;
  //部门名称
  deptName: string;
  //生日
  dob: string;
  //性别
  gender: number;
  //薪级 1 2
  grade: number;
  //身份证号
  ic: string;
  //头像
  icon: string;
  //等级
  level: number;
  //员工名称
  name: string;
  //手机号
  phone: string;
  //手机deviceId
  phoneDeviceId: string;
  //手机类型 1 Android 2 IOS
  phoneType: number;
  //备注
  remark: string;
  //时薪
  salaryHour: number;
  //月薪
  salaryMth: number;
  //工种服务类型 1 秩序 2 环境 3 机电 4 客服 5 管理
  serviceClass: number;
  //员工id
  staffId: string;
  //入职日期
  startDate: string;
  //员工状态 1 在岗 2 休假 3 离职
  state: number;
  //职称 1 2
  title: number;
  //更新操作人
  updatedBy: string;
  //更新操作人ID
  updatedId: string;
  //更新时间
  updatedTime: string;
  //1 在班状态可接单 2 不在班不可接单
  workStatus: number;
  //月工作天数
  workingDays: number;
  //合约每日工时
  workingHour: number;
  empNo: string;
}

export interface CreateStaffModel {
  staffId?: string;
  // 月补贴
  allowenceMth?: number;
  // 银行卡号
  bankAccount?: string;
  // 年终奖
  bonusAnnual?: number;
  // 月固定奖金
  bonusMth?: number;
  // 合约文件
  contraceFile?: string;
  // 合约到期日
  contractEnd?: string;
  // 工种类型 1 员工 2 主管
  craft?: number;
  // 部门id
  deptId?: string;
  // 部门名称
  deptName?: string;
  // 出生年月
  dob?: string;
  // 性别
  gender?: number;
  // 薪级 1 2
  grade?: number;
  // 身份证号
  ic?: string;
  icon?: string;
  // 等级
  level?: number;
  // 员工名称
  name?: string;
  // 手机号/联系方式
  phone?: string;
  // 设备id
  phoneDeviceId?: string;
  // 时薪
  salaryHour?: number;
  // 月薪
  salaryMth?: number;
  // 工种服务类型 1 秩序 2 环境 3 机电 4 客服 5 管理
  serviceClass?: number;
  // 入职时间
  startDate?: string;
  // 员工状态 1 在岗 2 休假 3 离职
  state?: number;
  // 职务 1 2
  title?: number;
  // 月工作天数
  workingDays?: number;
  // 合约每日工时
  workingHour?: number;
  empNo?: string;
  icType?: number;
  staffBlockId?: string;
  staffBlockName?: string;
  // //创建操作人
  // createdBy: string;
  // //创建操作人ID
  // createdId: string;
  // operatorBy: string;
  // operatorId: string;
}

export default class Staff {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<StaffModel[]>>>(`/${modelName}/getStaffListByPageAndCondition`, {
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
    const list: StaffModel[] = [];
    let current = 1;
    let res: PaginationModel<StaffModel[]>;
    do {
      res = await this.page(current, 100);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async findByServiceClass(serviceClass: number) {
    const res = await http.post<HttpResponseBase<StaffModel[]>>(`/${modelName}/getStaffList`, {
      key: serviceClass,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async detail(id: string) {
    const res = await http.get<HttpResponseBase<StaffModel>>(`/${modelName}/getStaffInfoById`, {
      params: {
        staffId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: CreateStaffModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateStaff`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateStaffModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addStaff`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteStaff`, {
      staffId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
