import http, { HttpResponseBase, PaginationModel } from "./base";
const modelName = "building";

export interface BuildingModel {
  // 占地面积，单位平米
  area: number;
  // 占地面积，单位平米
  areaLand: number;

  blockId: string;
  buildingId: string;
  // 名称：一品居或栋 A101
  buildingNo: string;
  // 单元门数量
  cellGateNo: number;

  createdBy: string;
  createdId: string;
  createdTime: string;
  // 竣备日期
  dateAcceptance: string;
  // 竣工日期
  dateCompletion: string;
  // 层高/挑高
  height: number;
  // 地下层数
  levelBelowGround: number;
  // 地上层数
  levelOnGroud: number;
  // 场所id
  placeId: string;
  // 二维码生成字符串
  qrCode: string;
  // 二维码图片地址 生成规则主键id
  qrImg: string;

  remark: string;
  status: number;
  // 称重结构 1 排架 2 框架 3 剪刀墙
  structureLoad: number;
  // 建材结构 1 土木 2 砖木 3 砖.. 见百度
  structureMaterial: number;

  tenantId: string;
  // 交付日期
  top: string;
  // 总房间数
  totalUnit: number;
  // 楼栋类型 1 住宅 2 综合体 3 商写 4 mall 5 其它
  typeBuilding: number;
  // 建筑类型 1 高层 2 中层 3 中高层 5 低层 百度建筑类型
  typeConstruction: number;
  // 总户数
  unitCount: number;
  updatedBy: string;
  updatedId: string;
  updatedTime: string;
}

export default class Building {
  public static async page(current: number, pageSize: number) {
    const res = await http.post<HttpResponseBase<PaginationModel<BuildingModel[]>>>(`/${modelName}/getBuildingPage`, {
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
    const list: BuildingModel[] = [];
    let current = 1;
    let res: PaginationModel<BuildingModel[]>;
    do {
      res = await this.page(current, 100);
      list.push(...res.list);
    } while (res.total > current++ * 100);
    return list;
  }
}
