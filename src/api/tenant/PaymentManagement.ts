import { FACE_AUDIT_AUTH_TYPE_MAP, FACE_AUDIT_STATUS_MAP, IC_TYPE_MAP } from "@/store/modules/dict/types";
import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "billingSettings";

export interface PaymentManagementModel {
  // 	小区ID
  blockId: string;
  // 	小区名称
  blockName: string;
  // 	创建人
  createdBy: string;
  // 	创建人Id
  createdId: string;
  // 	创建时间
  createdTime: string;
  // 	缴费周期类型 1 月 2 年
  cronUnit: 1 | 2;
  // 	缴费周期开始日
  cronValue: string;
  //
  delSerial: string;
  // 	物业缴费设置id
  id: string;
  // 	物业缴费名称
  name: string;
  // 	备注
  remark: string;
  // 	状态 1 使用 2 禁用 99删除
  status: 1 | 2;
  // 	租户ID
  tenantId: string;
  // 	缴费类型 1物业费 2电费 3水费 4燃气费 5其他
  type: 1 | 2 | 3 | 4 | 5;
  // 	计算单位名 （水用量单位：吨）
  unitName: string;
  // 	单价
  unitPrice: number;
  // 	修改人
  updatedBy: string;
  // 	修改人ID
  updatedId: string;
  // 	修改时间
  updatedTime: string;
  // 	缴费项目Id
  wxCompanyId: string;
  // 	缴费机构ID
  wxInstitutionId: string;
  // 	缴费机构ID名称
  wxInstitutionName: string;
  // 	收款子商户ID
  wxSubMerchantId: string;
  // 	收款子商户名称
  wxSubMerchantName: string;
  // 	xxl-job中定时任务Id
  xxlJobId: number;
}

export interface PaymentManagementPageQuery {
  // 创建人
  createdBy?: string;
  // 创建人Id
  createdId?: string;
  // 缴费周期类型 1 月 2 年
  cronUnit?: number;
  // 缴费周期开始日
  cronValue?: string;
  // 设备ID
  deviceId?: string;
  // 结束创建时间
  endCreatedTime?: string;
  // 结束更新时间
  endUpdatedTime?: string;
  // 物业缴费设置id
  id?: string;
  // 物业缴费名称
  name?: string;
  // 起始页
  pageNo?: number;
  // 每页展示数
  pageSize?: number;
  // 平台名称
  platform?: string;
  // 开始创建时间
  startCreatedTime?: string;
  // 开始更新时间
  startUpdatedTime?: string;
  // 状态 1 使用 2 禁用 99删除
  status?: number;
  // 租户id
  tenantId?: string;
  // 时间戳
  timestamp?: string;
  // 缴费类型 1物业费 2电费 3水费 4燃气费 5其他
  type?: number;
  // 更新操作人
  updatedBy?: string;
  // 更新操作人ID
  updatedId?: string;
  // 版本号
  version?: string;
}

export interface PaymentManagementDetailModel {
  // 创建人
  createdBy: string;
  // 创建人Id
  createdId: string;
  // 创建时间
  createdTime: string;
  // 缴费周期类型 1 月 2 年
  cronUnit: 1 | 2;
  // 缴费周期开始日
  cronValue: string;
  //
  delSerial: string;
  // 物业缴费设置id
  id: string;
  // 物业缴费名称
  name: string;
  // 备注
  remark: string;
  // 状态 1 使用 2 禁用 99删除
  status: number;
  // 租户ID
  tenantId: string;
  // 缴费类型 1物业费 2电费 3水费 4燃气费 5其他
  type: 1 | 2 | 3 | 4 | 5;
  // 计算单位名 （水用量单位：吨）
  unitName: string;
  // 单价
  unitPrice: number;
  // 修改人
  updatedBy: string;
  // 修改人ID
  updatedId: string;
  // 修改时间
  updatedTime: string;
  // xxl-job中定时任务Id
  xxlJobId: number;
}

export interface CreatePaymentManagementModel {
  // 缴费周期类型 1 月 2 年
  cronUnit: 1 | 2;
  // 缴费周期开始日
  cronValue: string;
  // 物业缴费名称
  name: string;
  // 备注
  remark: string;
  // 缴费类型 1物业费 2电费 3水费 4燃气费 5其他
  type: 1 | 2 | 3 | 4 | 5;
  // 计算单位名 （水用量单位：吨）
  unitName: string;
  // 单价
  unitPrice: number;
}

export interface UpdatePaymentManagementModel {
  // 缴费周期类型 1 月 2 年
  cronUnit?: 1 | 2;
  // 缴费周期开始日
  cronValue?: string;
  // 物业缴费设置id
  id: string;
  // 物业缴费名称
  name?: string;
  // 备注
  remark?: string;
  // 缴费类型 1物业费 2电费 3水费 4燃气费 5其他
  type?: 1 | 2 | 3 | 4 | 5;
  // 计算单位名 （水用量单位：吨）
  unitName?: string;
  // 单价
  unitPrice?: number;
}

export default class PaymentManagement {
  public static async page(current: number, pageSize: number, query: PaymentManagementPageQuery) {
    const res = await http.post<HttpResponseBase<PaginationModel<PaymentManagementModel[]>>>(`/${modelName}/getListPage`, {
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
    const res = await http.get<HttpResponseBase<PaymentManagementDetailModel>>(`/${modelName}/getDetail`, {
      params: {
        id: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: UpdatePaymentManagementModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/update`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreatePaymentManagementModel) {
    const res = await http.post<HttpResponseBase<string>>(`/${modelName}/add`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async deleteBatch(ids: string[]) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteBatch`, {
      ids,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async enable(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/enable`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async disable(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/disable`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
