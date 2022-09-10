import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "envPatrolRoute";

export interface RouteSpotModel {
  routeSpotId?: number;
  createdBy?: string;
  createdId?: string;
  createdTime?: string;
  placeId: string;
  placeName: string;
  placeOrder: number;
  remark?: string;
  routeId?: string;
  tenantId?: string;
  updatedBy?: string;
  updatedId?: string;
  updatedTime?: string;
}

export interface RouteModel {
  // 创建操作人
  createdBy: string;
  // 创建操作人ID
  createdId: string;
  // 创建时间
  createdTime: string;
  // id
  id: string;
  // 备注
  remark: string;
  // 路线名称
  routeName: string;
  routeSpots: RouteSpotModel[];
  // 路线类型 1 巡逻路线 2 巡查路线
  routeType: 1;
  // 1 使用 2 禁用
  status: 1 | 2;
  // 更新操作人
  updatedBy: string;
  // 更新操作人ID
  updatedId: string;
  // 更新时间
  updatedTime: string;
  serviceClass: 1 | 2 | 3 | 4 | 5;
}

export interface CreateRouteModel {
  addRouteSpots: RouteSpotModel[];
  deleteRouteSpots: RouteSpotModel[];
  // 备注
  remark?: string;
  // 路线名称
  routeName: string;
  serviceClass: 1 | 2 | 3 | 4 | 5;
}

export interface UpdateRouteModel extends CreateRouteModel {
  id: string;
}

export interface PatrolRouteQueryModel {
  routeName?: string;
  status?: 1 | 2;
  serviceClass?: number;
}

export default class EnvManagementRoute {
  public static async page(current: number, pageSize: number, query?: PatrolRouteQueryModel) {
    const res = await http.post<HttpResponseBase<PaginationModel<RouteModel[]>>>(`/${modelName}/getRoutePage`, {
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
  public static async getAll(query?: PatrolRouteQueryModel) {
    const list: RouteModel[] = [];
    let current = 1;
    let res: PaginationModel<RouteModel[]>;
    do {
      res = await this.page(current, 100, query);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<RouteModel>>(`/${modelName}/getRouteDetail`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateRouteModel) {
    const res = await http.post<HttpResponseBase<null>>(`/${modelName}/addRoute`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: UpdateRouteModel) {
    const res = await http.post<HttpResponseBase<null>>(`/${modelName}/updateRoute`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteRoute`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async deletes(ids: string[]) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteBatchRoute`, {
      ids,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async enable(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/enableRoute`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async disable(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/disableRoute`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
