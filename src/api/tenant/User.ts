import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "sysUser";

export interface UserModel {
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
  //工号
  empNo: string;
  //用户真实姓名
  realName: string;
  //备注
  remark: string;
  //状态描述
  statusName: string;
  //所属租户
  tenantId: string;
  //更新操作人
  updatedBy: string;
  //更新操作人ID
  updatedId: string;
  //更新时间
  updatedTime: string;
  //邮箱
  userEmail: string;
  //头像
  userIcon: string;
  //id
  userId: string;
  //手机号
  userPhone: string;
  //登录账号
  username: string;
  status: number;
}

export interface CreateUserModel {
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

export interface UserInfoModel {
  permissions: string[];
  userInfo: {
    createdBy: string;
    createdId: string;
    createdTime: string;
    deptId: string;
    deptName: string;
    empNo: string;
    realName: string;
    remark: string;
    tenantId: string;
    updatedBy: string;
    updatedId: string;
    updatedTime: string;
    userEmail: string;
    userIcon: string;
    userId: string;
    userPhone: string;
    username: string;
  };
}

export default class User {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<UserModel[]>>>(`/${modelName}/getSysUserPage`, {
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
  public static async detail(userId: string) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/getSysUserDetail`, {
      userId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: UserModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateSysUser`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateUserModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addSysUser`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(userId: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteSysUser`, {
      userId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getUserInfo() {
    const res = await http.post<HttpResponseBase<UserInfoModel>>(`/${modelName}/getCurLoginUserInfo`);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
