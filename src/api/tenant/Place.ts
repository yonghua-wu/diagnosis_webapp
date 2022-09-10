import http, { HttpResponseBase } from "./base";

export interface PlaceModel {
  id: string;
  categoryId: number;
  parentId: number;
  children: PlaceModel[];
  hasChildren: boolean;
  placeId: string;
  level: boolean;
  name: string;
  groupName: string;
  type: number;
  qrCode: string;
  qrImg: string;
  blockId: string;
  tenantId: string;
  status: number;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

export interface AddPlaceModel {
  [key: string]: any;
  blockId?: string;
  deviceId?: string;
  level?: number;
  name?: string;
  parentId?: string;
  placeId?: string;
  platform?: string;
  qrCode?: string;
  tenantId?: string;
  timestamp?: string;
  type?: number;
  version?: string;
}

export interface CateModel {
  categoryId: number;
  disable: number;
  name: string;
  parentId: number;
  remark: string;
}

export interface PlaceConfigTreeItemModel {
  categoryId?: number;
  categoryName?: string;
  groupId: number;
  item?: PlaceConfigTreeItemModel;
  targetId: number;
}

export interface PlaceConfigTreeLevelModel {
  categoryId?: number;
  categoryName?: string;
  item?: PlaceConfigTreeItemModel;
  groupId: number;
  targetId: number;
}

export interface PlaceConfigTreeGroupModel {
  groupId: number;
  level: PlaceConfigTreeLevelModel;
  targetId: number;
  targetName: string;
}

export interface PlaceConfigTreeModel {
  categoryId: number;
  categoryName: string;
  groups: PlaceConfigTreeGroupModel[];
}

const modelName = "place";

export default class Place {
  public static async getItemTree(parentId: string | null = "0", query: any = {}) {
    const res = await http.post<HttpResponseBase<PlaceModel[]>>(`/${modelName}/getPlaceTree`, {
      ...query,
      parentId,
      lazy: true,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async findById(placeId: string) {
    const res = await http.post<HttpResponseBase<PlaceModel>>(`/${modelName}/getPlace`, {
      placeId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: AddPlaceModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/getTree`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: AddPlaceModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/updatePlace`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getCate() {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/Cate/getList`, {
      parentId: "0",
      // tenantId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async findCateById(id: string) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/Cate/getCate`, {
      categoryId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getAllCate() {
    const res = await http.post<HttpResponseBase<CateModel[]>>(`/${modelName}/Cate/getCateAll`);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getPlaceConfigTree() {
    const res = await http.post<HttpResponseBase<PlaceConfigTreeModel[]>>(`/${modelName}/getPlaceConfig`);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getPlaceList(categoryId: number, groupId: number, placeId?: string) {
    const res = await http.post<HttpResponseBase<PlaceModel[]>>(`/${modelName}/getPlaceData`, {
      categoryId,
      groupId,
      placeId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
