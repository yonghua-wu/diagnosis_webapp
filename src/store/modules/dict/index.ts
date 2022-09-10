import { DictModel } from "@/api/tenant/Dict";
import {
  DEVICE_STATUS_MAP,
  FACE_AUDIT_AUTH_TYPE_MAP,
  FACE_AUDIT_STATUS_MAP,
  IC_TYPE_MAP,
  PATROL_PLAN_SWITCH_MAP,
  PERMISSION_TYPE,
  REVISIT_TYPE_VALUE_MAP,
  SERVICE_CLASS_VALUE_MAP,
  TICKET_STATUS_VALUE_MAP,
} from "./types";
import { defineStore } from "pinia";
import { DictListState, DictMapState, DictState } from "./types";

// state 中大写为前端常量数据，驼峰写法为后端拿的数据。

const useDictStore = defineStore("dict", {
  state: (): DictState => ({
    serviceType: [],
    serviceTypeMap: {},
    serviceClass: [],
    serviceClassMap: {},
    fromType: [],
    fromTypeMap: {},
    ticketStatus: [],
    ticketStatusMap: {},
    ticketProduct: [],
    ticketProductMap: {},
    product: [],
    productMap: {},
    revisitType: [],
    revisitTypeMap: {},
    PERMISSION_TYPE: PERMISSION_TYPE,
    PERMISSION_TYPE_LIST: Object.keys(PERMISSION_TYPE).map((key) => ({
      label: PERMISSION_TYPE[key as keyof typeof PERMISSION_TYPE],
      value: key as keyof typeof PERMISSION_TYPE,
    })),
    FACE_AUDIT_AUTH_TYPE_MAP: FACE_AUDIT_AUTH_TYPE_MAP,
    FACE_AUDIT_STATUS_MAP: FACE_AUDIT_STATUS_MAP,
    IC_TYPE_MAP: IC_TYPE_MAP,
    PATROL_PLAN_SWITCH_MAP: PATROL_PLAN_SWITCH_MAP,
    DEVICE_STATUS_MAP: DEVICE_STATUS_MAP,
  }),

  getters: {
    getRevisitTypeItemBySymb: (state) => {
      return (symb: keyof typeof REVISIT_TYPE_VALUE_MAP) => state.revisitTypeMap[REVISIT_TYPE_VALUE_MAP[symb]];
    },
    getServiceClassItemBySymb: (state) => {
      return (symb: keyof typeof SERVICE_CLASS_VALUE_MAP) => state.serviceClassMap[SERVICE_CLASS_VALUE_MAP[symb]];
    },
    getTicketStatusItemBySymb: (state) => {
      return (symb: keyof typeof TICKET_STATUS_VALUE_MAP) => state.ticketStatusMap[TICKET_STATUS_VALUE_MAP[symb]];
    },
  },

  actions: {
    updateState(partial: Partial<DictListState>) {
      const _partial: Partial<DictState> = { ...partial };
      Object.keys(partial).forEach((key) => {
        const m: Record<DictModel["value"], DictModel> = {};
        partial[key as keyof DictListState]?.forEach((item) => {
          m[item.value] = item;
        });
        _partial[(key + "Map") as keyof DictMapState] = m;
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      this.$patch(_partial);
    },
  },
});

export default useDictStore;
