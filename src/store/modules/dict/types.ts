import { DictModel } from "@/api/tenant/Dict";

/**
 * 回访类型-电话回访
 */
export const REVISIT_TYPE_TEL = Symbol();

/**
 * 回访类型-当面回访
 */
export const REVISIT_TYPE_FACE_TO_FACE = Symbol();

/**
 * 回访类型-微信回访
 */
export const REVISIT_TYPE_WECHAT = Symbol();

/**
 * 回访类型-思流消息回访
 */
export const REVISIT_TYPE_SF_IM = Symbol();

/**
 * 回访类型-其他
 */
export const REVISIT_TYPE_OTHER = Symbol();

/**
 * 回访类型与字典表中值的对应 Map
 */
export const REVISIT_TYPE_VALUE_MAP = {
  [REVISIT_TYPE_TEL]: "1",
  [REVISIT_TYPE_FACE_TO_FACE]: "2",
  [REVISIT_TYPE_WECHAT]: "3",
  [REVISIT_TYPE_SF_IM]: "4",
  [REVISIT_TYPE_OTHER]: "5",
};

/**
 * 业务线-安全
 */
export const SERVICE_CLASS_SAFETY = Symbol();
/**
 * 业务线-环境
 */
export const SERVICE_CLASS_ENVI = Symbol();
/**
 * 业务线-机电
 */
export const SERVICE_CLASS_MACHINE = Symbol();
/**
 * 业务线-客服
 */
export const SERVICE_CLASS_CUSTOMER = Symbol();
/**
 * 业务线-管理
 */
export const SERVICE_CLASS_MANAGE = Symbol();

/**
 * 业务线与字典表中值的对应 Map
 */
export const SERVICE_CLASS_VALUE_MAP = {
  [SERVICE_CLASS_SAFETY]: "1",
  [SERVICE_CLASS_ENVI]: "2",
  [SERVICE_CLASS_MACHINE]: "3",
  [SERVICE_CLASS_CUSTOMER]: "4",
  [SERVICE_CLASS_MANAGE]: "5",
};

export type SERVICE_CLASS_VALUE_MAP_KEYS = (keyof typeof SERVICE_CLASS_VALUE_MAP)[];

/**
 * 工单状态-待接受
 */
export const TICKET_STATUS_TOBE_ACCEPTED = Symbol();
/**
 * 工单状态-待接受
 */
export const TICKET_STATUS_ACCEPTED = Symbol();
/**
 * 工单状态-待验收
 */
export const TICKET_STATUS_TOBE_VERIFY = Symbol();
/**
 * 工单状态-已关闭
 */
export const TICKET_STATUS_CLOSED = Symbol();
/**
 * 工单状态-待分配
 */
export const TICKET_STATUS_TOBE_ALLOCATION = Symbol();
/**
 * 工单状态-处理中
 */
export const TICKET_STATUS_HANDLING = Symbol();
/**
 * 工单状态-已通过
 */
export const TICKET_STATUS_PASSED = Symbol();
/**
 * 工单状态-未通过
 */
export const TICKET_STATUS_NOT_PASSED = Symbol();
/**
 * 工单状态-已取消
 */
export const TICKET_STATUS_CANCELED = Symbol();
/**
 * 工单状态-暂停
 */
export const TICKET_STATUS_PAUSE = Symbol();

/**
 * 工单状态与字典表中值的对应 Map
 */
export const TICKET_STATUS_VALUE_MAP = {
  [TICKET_STATUS_TOBE_ACCEPTED]: "1",
  [TICKET_STATUS_ACCEPTED]: "2",
  [TICKET_STATUS_TOBE_VERIFY]: "3",
  [TICKET_STATUS_CLOSED]: "4",
  [TICKET_STATUS_TOBE_ALLOCATION]: "5",
  [TICKET_STATUS_HANDLING]: "6",
  [TICKET_STATUS_PASSED]: "8",
  [TICKET_STATUS_NOT_PASSED]: "9",
  [TICKET_STATUS_CANCELED]: "10",
  [TICKET_STATUS_PAUSE]: "11",
};

export type TICKET_STATUS_VALUE_MAP_KEYS = (keyof typeof TICKET_STATUS_VALUE_MAP)[];

export const PATROL_PLAN_SWITCH_OPEN = 1;
export const PATROL_PLAN_SWITCH_CLOSE = 2;
export const PATROL_PLAN_SWITCH_MAP = {
  [PATROL_PLAN_SWITCH_OPEN]: {
    text: "开启",
    value: "1",
  },
  [PATROL_PLAN_SWITCH_CLOSE]: {
    text: "关闭",
    value: "2",
  },
};
export type PATROL_PLAN_SWITCH_MAP_KEYS = (keyof typeof PATROL_PLAN_SWITCH_MAP)[];

/**
 * 权限的类型
 */
export const PERMISSION_TYPE = {
  MENU: "菜单",
  BUTTON: "按钮",
};

export interface DictListState {
  serviceType: DictModel[];
  serviceClass: DictModel[];
  fromType: DictModel[];
  ticketStatus: DictModel[];
  ticketProduct: DictModel[];
  product: DictModel[];
  revisitType: DictModel[];
}

export interface DictMapState {
  serviceTypeMap: Record<string, DictModel>;
  serviceClassMap: Record<string, DictModel>;
  fromTypeMap: Record<string, DictModel>;
  ticketStatusMap: Record<string, DictModel>;
  ticketProductMap: Record<string, DictModel>;
  productMap: Record<string, DictModel>;
  revisitTypeMap: Record<string, DictModel>;
}

export const FACE_AUDIT_STATUS_MAP = {
  0: "未审核",
  1: "审核通过",
  2: "审核未通过",
  3: "已失效",
};

export const FACE_AUDIT_AUTH_TYPE_MAP = {
  1: "业主",
  2: "访客",
};

export const IC_TYPE_MAP = {
  1: "身份证",
  2: "军官证",
  3: "护照",
  4: "其他",
};

export const DEVICE_NOT_INSTALL = 1;
export const DEVICE_INSTALLED = 2;
export const DEVICE_USE_NORMAL = 3;
export const DEVICE_USE_ABNORMAL = 4;
export const DEVICE_USE_STOP = 5;
export const DEVICE_STATUS_MAP = {
  [DEVICE_NOT_INSTALL]: "未安装",
  [DEVICE_INSTALLED]: "已安装",
  [DEVICE_USE_NORMAL]: "使用（正常）",
  [DEVICE_USE_ABNORMAL]: "使用（异常）",
  [DEVICE_USE_STOP]: "停用",
};

export type DEVICE_STATUS_MAP_KEYS = keyof typeof DEVICE_STATUS_MAP;

export interface DictState extends DictListState, DictMapState {
  PERMISSION_TYPE: typeof PERMISSION_TYPE;
  FACE_AUDIT_AUTH_TYPE_MAP: typeof FACE_AUDIT_AUTH_TYPE_MAP;
  FACE_AUDIT_STATUS_MAP: typeof FACE_AUDIT_STATUS_MAP;
  IC_TYPE_MAP: typeof IC_TYPE_MAP;
  DEVICE_STATUS_MAP: typeof DEVICE_STATUS_MAP;
  PATROL_PLAN_SWITCH_MAP: typeof PATROL_PLAN_SWITCH_MAP;
  PERMISSION_TYPE_LIST: {
    value: keyof typeof PERMISSION_TYPE;
    label: string;
  }[];
  [key: string]: unknown;
}

export const PERMISSION_CODE_PREFIX = "sys:permission:";
