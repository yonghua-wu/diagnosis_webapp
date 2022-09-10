import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "cloud";

export interface OpenTheDoorModel {
  // 	block_id
  blockId: string;
  // 	品牌
  brandId: string;
  // 	设备分类id 增加设备分类表，
  categoryId: number;
  // 	设备描述
  description: string;
  // 	设备id
  deviceId: string;
  // 	设备名称
  deviceName: string;
  // 	place_id
  placeId: string;
  // 	二维码生成字符串
  qrCode: string;
  // 	二维码地址 生成规则 主键id
  qrImg: string;
  // 	tenantId
  tenantId: string;
}

export default class User {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<OpenTheDoorModel[]>>>(`/${modelName}/getWebDevicePage`, {
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
    const list: OpenTheDoorModel[] = [];
    let current = 1;
    let res: PaginationModel<OpenTheDoorModel[]>;
    do {
      res = await this.page(current, 100);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
  public static async open(deviceId: string) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/cloudOpen`, {
      deviceId,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
