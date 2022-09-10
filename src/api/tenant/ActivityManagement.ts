import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "activity";

export interface ActivityManagementModel {
  //活动结束时间
  activityEndTime: string;
  //活动开始时间
  activityStartTime: string;
  //活动标题
  activityTitle: string;
  //创建开始时间
  createdStratTime: string;
  //创建结束时间
  createdEndTime: string;
  //状态 1使用 2禁用 99删除
  status: number;
  //以上部分为查询所需
  //活动id
  activityId: string;
  //活动排序
  seq: number;
  //是否报名 1是 2否
  signUp: number;
  //创建人
  createdBy: string;
  //创建时间
  createdTime: string;
  //活动类型 1普通活动 2报名活动
  activityType: number;
}

export interface CreateActivityManagementModel {
  // 活动结束时间
  activityEndTime: string;
  // 活动开始时间
  activityStartTime: string;
  // 活动标题
  activityTitle: string;
  // 状态
  status: string;
  // 主键id
  activityId: string;
}

export interface CreateActivityModel {
  //活动id
  activityId?: string;
  //生效结束时间
  activityEndTime: string;
  //生效开始时间
  activityStartTime: string;
  //活动图片
  activityImg: string;
  //活动标题
  activityTitle: string;
  //暂时还需要 后续会删除 activityName
  activityName: string;
  //活动类型 1普通活动 2报名活动
  activityType: number;
  //活动内容 存url
  activityUrl: string;
  //活动选择小区
  //blockList: string[];
  //url跳转类型 0-不跳转 1-APP原生 2-h5带导航
  jumpUrlType: number;
  //操作人
  //operatorBy: string;
  //操作人id
  //operatorId: string;
  //优先级
  seq: number;
  //是否报名 1是2否
  signUp: number;
  //是否发送短信 1是2否
  smsNotice?: number;
  //状态 1使用 2禁用
  status: number;
}

export interface ActivityManagementDetial {
  //活动参与角色
  activityAuthType: number;
  //活动描述
  activityDesc: string;
  //生效结束时间
  activityEndTime: string;
  //活动图片
  activityImg: string;
  //暂时还需要 后续会删除 activityName
  activityName: string;
  //生效开始时间
  activityStartTime: string;
  //活动标题
  activityTitle: string;
  //活动类型 1普通活动 2报名活动
  activityType: number;
  //活动选择小区
  //blockList: string[];
  blockId: string;
  //活动内容 存url
  activityUrl: string;
  //url跳转类型 0-不跳转 1-APP原生 2-h5带导航
  jumpUrlType: number;
  //操作人
  //operatorBy: string;
  //操作人id
  //operatorId: string;
  //优先级
  seq: number;
  //是否报名 1是2否
  signUp: number;
  //是否发送短信 1是2否
  smsNotice: number;
  //状态 1使用 2禁用
  status: number;
}

export default class ActivityManagement {
  // 分页查询
  public static async page(current: number, pageSize: number, query: any) {
    const res = await http.post<HttpResponseBase<PaginationModel<ActivityManagementModel[]>>>(`/${modelName}/getActivityList`, {
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
  public static async update(activityId: string, status: number) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/updatedActivity`, {
      activityId,
      status,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async updateSeq(activityId: string, seq: number) {
    const res = await http.post<HttpResponseBase<{}>>(`/${modelName}/updatedActivity`, {
      activityId,
      seq,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async create(data: CreateActivityModel) {
    const res = await http.post<HttpResponseBase<null>>(`/${modelName}/addActivity`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
  public static async detail(id: string) {
    const res = await http.post<HttpResponseBase<ActivityManagementDetial>>(`/${modelName}/getActivityDetail`, {
      activityId: id,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      return res;
    }
  }
  public static async updateDetailInfo(data: CreateActivityModel) {
    const res = await http.post<HttpResponseBase<null>>(`/${modelName}/updatedActivity`, {
      ...data,
    });
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
