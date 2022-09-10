import { PERMISSION_CODE_PREFIX, PERMISSION_TYPE } from "@/store/modules/dict/types";
import { deepClone } from "@/utils/utils";
import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "sysPermission";

export interface PermissionModel {
  //资源code
  code: string;
  //创建操作人
  createdBy: string;
  //创建操作人ID
  createdId: string;
  //创建时间
  createdTime: string;
  //资源图标
  icon: string;
  //id
  id: string;
  //资源名称
  name: string;
  //备注
  remark: string;
  //资源类型：MENU，BUTTON
  type: keyof typeof PERMISSION_TYPE;
  //更新操作人
  updatedBy: string;
  //更新操作人ID
  updatedId: string;
  //更新时间
  updatedTime: string;
  //资源路径
  url: string;
  parentId: string;
}

export interface CreatePermissionModel {
  //资源code
  code: string;
  //资源图标
  icon: string;
  //资源名称
  name: string;
  //备注
  remark: string;
  //资源类型：MENU，BUTTON
  type: keyof typeof PERMISSION_TYPE;
  //资源路径
  url: string;
  // 父权限id
  parentId?: string;
}

export default class Permission {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<PermissionModel[]>>>(`/${modelName}/getSysPermissionPage`, {
      pageNo: current,
      pageSize: pageSize,
      ...query,
    });
    if (res.code === 200) {
      return {
        ...res.data,
        list: res.data.list.map((item) => {
          return {
            ...item,
            code: item.code.replace(PERMISSION_CODE_PREFIX, ""),
          };
        }),
        current: res.data.pageNum,
        size: res.data.total,
      };
    } else {
      throw res;
    }
  }
  public static async getAll(query: any = {}) {
    const list: PermissionModel[] = [];
    let current = 1;
    let res: PaginationModel<PermissionModel[]>;
    do {
      res = await this.page(current, 100, query);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<PermissionModel>>(`/${modelName}/getSysPermissionInfo`, {
      id,
    });
    if (res.code === 200) {
      res.data.code = res.data.code.replace(PERMISSION_CODE_PREFIX, "");
      res.data.parentId = res.data.parentId === "0" ? "" : res.data.parentId;
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: PermissionModel) {
    const _data = deepClone(data);
    _data.parentId = _data.parentId || "0";
    _data.code = PERMISSION_CODE_PREFIX + _data.code;
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateSysPermission`, {
      ..._data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreatePermissionModel) {
    const _data = deepClone(data);
    _data.parentId = _data.parentId || "0";
    _data.code = PERMISSION_CODE_PREFIX + _data.code;
    const res = await http.post<HttpResponseBase<string>>(`/${modelName}/addSysPermission`, {
      ..._data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteSysPermission`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
