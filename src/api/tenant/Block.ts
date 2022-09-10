import http, { HttpResponseBase, PaginationModel } from "./base";

export interface BlockModel {
  areaBusiness?: number;
  areaConstructaion?: number;
  areaGreen?: number;
  areaIndustry?: number;
  areaLand?: number;
  areaResidence?: number;
  blockId?: string;
  boundaries?: string;
  city?: string;
  community?: string;
  createdBy?: string;
  createdId?: string;
  createdTime?: string;
  dateAcquire?: string;
  landType?: number;
  latitude?: string;
  layoutFile?: string;
  longitude?: string;
  mapSource?: number;
  name?: string;
  pinyin?: string;
  plotRatio?: number;
  postalCode?: number;
  province?: string;
  remark?: string;
  status?: number;
  tenantId?: string;
  town?: string;
  updatedBy?: string;
  updatedId?: string;
  updatedTime?: string;
  vilage?: string;
}

// export interface AddPlaceModel {
//   blockId?: string;
//   deviceId?: string;
//   level?: number;
//   name?: string;
//   parentId?: string;
//   placeId?: string;
//   platform?: string;
//   qrCode?: string;
//   tenantId?: string;
//   timestamp?: string;
//   type?: number;
//   version?: string;
// }

const modelName = "block";

export default class Block {
  public static async page(current: number, pageSize: number, query: any = {}) {
    const res = await http.post<HttpResponseBase<PaginationModel<BlockModel[]>>>(`/${modelName}/getBlockPage`, {
      ...query,
      pageNo: current,
      pageSize: pageSize,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async getAll() {
    const list: BlockModel[] = [];
    let current = 1;
    let res: PaginationModel<BlockModel[]>;
    do {
      res = await this.page(current, 100);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
}
