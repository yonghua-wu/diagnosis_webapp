import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "dict";

export interface DictModel {
  code: string;
  createdBy: string;
  createdId: string;
  createdTime: string;
  deleteStatus: number;
  dictId: number;
  disabled: number;
  icon: string;
  label: string;
  parentCode: string;
  remark: string;
  seq: number;
  showLabel: string;
  status: number;
  tableColumn: string;
  tableName: string;
  tenantId: string;
  type: number;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
  value: string;
}

export interface CreateDictModel {
  // code
  code: string;
  //  1 可删除 2 不可删除
  deleteStatus: 1 | 2;
  // icon
  icon?: string;
  // 默认名称
  label: string;
  // 父 code
  parentCode: string;
  //  备注
  remark?: string;
  //  排序
  seq: number;
  //  字段名
  tableColumn?: string;
  //  表名
  tableName?: string;
  // 1 字典 2
  type: 1;
  // 值
  value: string;
}

export default class Dict {
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<DictModel[]>>>(`/${modelName}/getPage`, {
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
  public static async getAllDictByCode(code: string) {
    const res = await http.post<HttpResponseBase<DictModel[]>>(`/${modelName}/getList`, {
      code,
    });
    if (res.code === 200) {
      return res.data.sort((a, b) => a.seq - b.seq);
    } else {
      throw res;
    }
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<DictModel>>(`/${modelName}/getDict`, {
      dictId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: DictModel) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/modify`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateDictModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/add`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.get<HttpResponseBase<{}>>(`/${modelName}/delete`, {
      params: {
        dictId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
