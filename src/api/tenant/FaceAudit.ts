import { FACE_AUDIT_AUTH_TYPE_MAP, FACE_AUDIT_STATUS_MAP, IC_TYPE_MAP } from "@/store/modules/dict/types";
import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "face";

export interface FaceAuditPageModel {
  // 0未审核 1审核通过 2审核拒绝
  auditStatus: keyof typeof FACE_AUDIT_STATUS_MAP;
  // 授权类型 1 业主 2 访客
  authType: keyof typeof FACE_AUDIT_AUTH_TYPE_MAP;
  // 创建人
  createdBy: string;
  // 创建人id
  createdId: string;
  // 创建时间
  createdTime: string;
  // 主键
  id: string;
  // 姓名
  name: string;
  // person_id
  personId: string;
  // 手机号
  phone: string;
  // 房屋地址
  placeName: string;
  // 更新操作人
  updatedBy: string;
  // 更新操作人ID
  updatedId: string;
  // 更新时间
  updatedTime: string;
}

export interface FaceAuditDetailModel {
  // 0未审核 1审核通过 2审核拒绝
  auditStatus: keyof typeof FACE_AUDIT_STATUS_MAP;
  // 授权类型 1 业主 2 访客
  authType: keyof typeof FACE_AUDIT_AUTH_TYPE_MAP;
  // 项目名称
  blockName: string;
  // 创建人
  createdBy: string;
  // 创建人id
  createdId: string;
  // 创建时间
  createdTime: string;
  // 证件号 身份证号
  ic: string;
  // 证件类型 1 身份证 2 军官证 3 护照 4 其它 拿好心情的
  icType: keyof typeof IC_TYPE_MAP;
  // 自增主键
  id: string;
  // oss图片地址
  imgUrl: string;
  // 姓名
  name: string;
  // 用户id
  personId: string;
  // 手机号
  phone: string;
  // 户室地址
  placeName: string;
  // 更新操作人
  updatedBy: string;
  // 更新操作人ID
  updatedId: string;
  // 更新时间
  updatedTime: string;
}

export interface FaceAuditPageQuery {
  // 0未审核 1审核通过 2审核拒绝
  auditStatus?: keyof typeof FACE_AUDIT_STATUS_MAP;
  // 姓名
  name?: string;
  // 手机号
  phone?: string;
  // 开始创建时间
  startCreatedTime?: string;
  // 结束创建时间
  endCreatedTime?: string;
  // 开始更新时间
  startUpdatedTime?: string;
  // 结束更新时间
  endUpdatedTime?: string;
}

export interface AuditFaceQuery {
  // 审核状态 0未审核 1审核通过 2审核拒绝
  auditStatus: keyof typeof FACE_AUDIT_STATUS_MAP;
  // id
  faceId: string;
  // 备注
  remark: string;
  // 更新操作人
  updatedBy?: string;
  // 更新操作人ID
  updatedId?: string;
}

export default class FaceAudit {
  public static async page(current: number, pageSize: number, query: FaceAuditPageQuery) {
    const res = await http.post<HttpResponseBase<PaginationModel<FaceAuditPageModel[]>>>(`/${modelName}/getFacePage`, {
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
    const res = await http.get<HttpResponseBase<FaceAuditDetailModel>>(`/${modelName}/getFaceDetails`, {
      params: {
        faceId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async audit(data: AuditFaceQuery) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/reviewApplication`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
