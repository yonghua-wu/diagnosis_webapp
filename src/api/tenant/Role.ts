import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "sysRole";

export interface RoleModel {
  //角色code
  code?: string;
  //创建操作人
  createdBy?: string;
  //创建操作人ID
  createdId?: string;
  //创建时间
  createdTime?: string;
  //id
  id?: string;
  //角色名称
  name?: string;
  //备注
  remark?: string;
  // 权限id表
  permissions?: string[];
  //状态描述
  statusName?: string;
  //所属租户
  tenantId?: string;
  //更新操作人
  updatedBy?: string;
  //更新操作人ID
  updatedId?: string;
  //更新时间
  updatedTime?: string;
}

export interface CreateRoleModel {
  //角色code
  code: string;
  //角色名称
  name: string;
  // 权限id表
  permissionIds: string[];
  //备注
  remark: string;
}

export default class Role {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<RoleModel[]>>>(`/${modelName}/getSysRolePage`, {
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
  public static async getAll() {
    const list: RoleModel[] = [];
    let current = 1;
    let res: PaginationModel<RoleModel[]>;
    do {
      res = await this.page(current, 100);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/getSysRoleDetail`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: RoleModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateSysRole`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateRoleModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addSysRole`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteSysRole`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
