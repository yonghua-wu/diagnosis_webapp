import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "wechatAdvertising";

export interface CarouselManagementModel {
  //创建开始时间
  createEndTime: string;
  //创建结束时间
  createStartTime: string;
  //生效结束时间
  endTime: string;
  //生效时间
  startTime: string;
  //活动名称
  title: string;
  //状态 1使用 2禁用 99删除
  status: number;
  //id
  id: string;
  //排序
  seq: number;
  //创建人
  createdBy: string;
  //创建时间
  createdTime: string;
}

export interface CreateCarouselModel {
  //生效结束时间
  endTime: string;
  //活动图片链接
  imgUrl: string;
  //app跳转内容 url链接
  jumpContentId: string;
  //app跳转内容title
  jumpContentTitle: string;
  //url跳转类型
  jumpUrlType: number;
  //操作人
  operatorBy?: string;
  //操作人id
  operatorId?: string;
  //手机型号
  phoneModel?: string;
  //位置
  position?: number;
  //排序
  seq: number;
  //生效时间
  startTime: string;
  //状态
  status: number;
  //租户id
  tenantId?: string;
  //1图片 2文本
  type?: number;
}

export default class CarouselManagement {
  //分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<CarouselManagementModel[]>>>(`/${modelName}/getWechatAdvertisingList`, {
      ...query,
      pageNo: current,
      pageSize: pageSize,
    });
    if (res.code === 200) {
      return {
        ...res.data,
        current: res.data.pageNum,
        size: res.data.pageSize,
      };
    } else {
      throw res;
    }
  }
  //主页面修改
  public static async update(activityId: string, status?: number, seq?: number) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/updatedWechatAdvertising`, {
      activityId,
      status,
      seq,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  //创建轮播图
  public static async create(data: CreateCarouselModel) {
    const res = await http.post<HttpResponseBase<null>>(`/${modelName}/addWechatAdvertising`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
