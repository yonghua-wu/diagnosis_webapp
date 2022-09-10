import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "device";

export interface DeviceModel {
  blockId: string;
  brandId: string;
  categoryId: number;
  createdBy: string;
  createdId: string;
  createdTime: string;
  description: string;
  deviceId: string;
  deviceName: string;
  placeId: string;
  qrCode: string;
  qrImg: string;
  remark: string;
  status: number;
  tenantId: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
  categoryName: string;
  placeName: string;
  deviceStatus: number;
  attributes: any[];
}

export interface CreateDeviceModel {
  attributes: {
    key: string;
    value: string;
  }[];
  brandId: string;
  categoryName: string;
  categoryId: number;
  description: string;
  deviceName: string;
  placeId: string;
  deviceStatus: number;
}

export interface DeviceCateModel {
  // 自增主键ID
  categoryId: number;
  createdBy: string;
  createdId: string;
  createdTime: string;
  // 1 可删除 2 不可删除
  deleteStatus: string;
  // 1 显示 2 不显示
  disable: number;
  // 分类名称
  name: string;
  parentId: number;
  // 备注
  remark: string;
  // 状态
  status: string;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
}

export interface CreateDeviceCateModel {
  name: string;
}

export interface DeviceLogModel {
  handler: string;
  handlerDate: string;
  handlerId: string;
  handlerPhone: string;
  maintenanceType: string;
  supervisorId: string;
  supervisorName: string;
  supervisorPhone: string;
  ticketId: string;
}

export default class Device {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<DeviceModel[]>>>(`/${modelName}/getDeviceList`, {
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
  public static async getAll(query: any) {
    const list: DeviceModel[] = [];
    let current = 1;
    let res: PaginationModel<DeviceModel[]>;
    do {
      res = await this.page(current, 100, query);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async findAllByPlaceId(placeId: string) {
    const res = await this.getAll({ placeId });
    return res;
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<DeviceModel>>(`/${modelName}/getDeviceDetail`, {
      deviceId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: any) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateDevice`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateDeviceModel) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/addDevice`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/deleteDevice`, {
      deviceId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async findDeviceCateByIdCategoryId(id: number) {
    const res = await http.get<HttpResponseBase<any>>(`/device-category/getDetail`, {
      params: {
        categoryId: id,
      },
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getAllCate() {
    const res = await http.get<HttpResponseBase<DeviceCateModel[]>>(`/device-category/getAll`, {
      params: {},
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async createCate(data: CreateDeviceCateModel) {
    const res = await http.post<HttpResponseBase<DeviceCateModel[]>>(`/device-category/addDeviceCategory`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async deviceLogPage(current: number, pageSize: number, deviceId: string) {
    const res = await http.post<HttpResponseBase<PaginationModel<DeviceLogModel[]>>>(`/${modelName}/getDeviceLog`, {
      pageNo: current,
      pageSize: pageSize,
      deviceId,
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
}
