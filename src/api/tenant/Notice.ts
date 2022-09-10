import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "notice";

export interface NoticeModel {
  // 公告内容
  content: string;
  // 创建人
  createdBy: string;
  // 创建id
  createdId: string;
  // 创建时间
  createdTime: string;
  // 文件url
  fileUrl: string;
  imgList: string[];
  // 主键id
  id: string;
  // 发布公告时间
  publishTime: string;
  // 备注
  remark: string;
  // 公告标题
  title: string;
  // 是否置顶 1是 2 否
  top: 1 | 2;
  // 类型 1 公告 2
  type: number;
  state: number;
  // 修改人
  updatedBy: string;
  // 更新id
  updatedId: string;
  // 更新时间
  updatedTime: string;
  buildingList: any[];
}

export interface CreateNoticeModel {
  //公告内容
  content: string;
  //文件url
  imgList: string[];
  buildingList: string[];
  //发布公告时间
  publishTime: string;
  //公告标题
  title: string;
  // 1 立即发布 2 草稿
  state: 1 | 2;
}

export default class Notice {
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<NoticeModel[]>>>(`/${modelName}/getNoticePageByCondition`, {
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
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<NoticeModel>>(`/${modelName}/getNoticeById`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async update(data: any) {
    const res = await http.post<HttpResponseBase<any>>(`/${modelName}/updateNotice`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateNoticeModel) {
    const res = await http.post<HttpResponseBase<NoticeModel>>(`/${modelName}/addNotice`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async delete(id: string) {
    const res = await http.post<HttpResponseBase<void>>(`/${modelName}/deleteNotice`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async publish(id: string) {
    const res = await http.post<HttpResponseBase<void>>(`/${modelName}/publishNotice`, {
      id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
