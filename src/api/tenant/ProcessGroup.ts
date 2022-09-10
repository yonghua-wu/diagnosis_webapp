import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "processGroup";

export interface ProcessGroupModel {
  // 	创建者
  createdBy: string;
  // 	创建者
  createdId: string;
  // 	创建时间
  createdTime: string;
  // 	描述
  description: string;
  // 	成员编号数组
  memberUserIds: string[];
  // 	组名
  name: string;
  // 	备注
  remark: string;
  // 	1 开启 2 关闭
  state: 1 | 2;
  // 	更新者
  updatedBy: string;
  // 	更新者
  updatedId: string;
  // 	更新时间
  updatedTime: string;
  // 	编号
  userGroupId: number;
}

export interface QueryProcessGroupModel {
  // 开始创建时间
  beginCreateTime?: string;
  // 结束创建时间
  endCreateTime?: string;
  // 组名,示例值(芋道)
  name?: string;
  // 状态,示例值(1)
  state?: number;
}

export interface CreateProcessGroupModel {
  // 	描述
  description: string;
  // 	成员编号数组
  memberUserIds: string[];
  // 	组名
  name: string;
  // 	1 开启 2 关闭
  state: 1 | 2;
}
export interface UpdateProcessGroupModel {
  // 	描述
  description?: string;
  // 	成员编号数组
  memberUserIds?: string[];
  // 	组名
  name?: string;
  // 	1 开启 2 关闭
  state?: 1 | 2;
  // 	编号
  userGroupId: number;
}

export default class Place {
  public static async page(current: number, pageSize: number, query: QueryProcessGroupModel = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<ProcessGroupModel[]>>>(`/${modelName}/getPage`, {
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
    const list: ProcessGroupModel[] = [];
    let current = 1;
    let res: PaginationModel<ProcessGroupModel[]>;
    do {
      res = await this.page(current, 100);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async detail(id: string) {
    const res = await http.get<HttpResponseBase<ProcessGroupModel>>(`/${modelName}/getUserGroup`, {
      params: {
        userGroupId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: UpdateProcessGroupModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateStaff`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateProcessGroupModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addStaff`, data);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteUserGroup`, {
      userGroupId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
