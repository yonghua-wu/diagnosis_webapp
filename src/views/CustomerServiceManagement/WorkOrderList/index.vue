<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :click-add="false"
    :del="false"
    :operation="['view']"
    :scroll="{ x: 1570 }"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['工单管理', '工单列表']" />
    </template>
    <template #selected-options>
      <a-button :disabled="!selected" @click="clickBatchMove">批量转单</a-button>
    </template>
    <template #tools-options>
      <a-tooltip content="导出数据">
        <a-button shape="circle" @click="exportData">
          <icon-file />
        </a-button>
      </a-tooltip>
    </template>
  </SfTablePage>
  <BatchMoveModalVue ref="refBatchMoveModalVue" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import SfTablePage from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Ticket, { TicketModel, TicketQueryParams } from "@/api/tenant/Ticket";
import BatchMoveModalVue from "./components/BatchMoveModal.vue";
import { useDictStore } from "@/store";
import moment from "moment";
import router from "@/router";
import Message from "@/utils/Message";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { useFormatData, useTableColumns, useQueryData, useFilterDefaultValueQueryData } from "@/components/lib/SfTablePage";
import {
  TICKET_STATUS_TOBE_ALLOCATION,
  TICKET_STATUS_TOBE_ACCEPTED,
  TICKET_STATUS_ACCEPTED,
  TICKET_STATUS_TOBE_VERIFY,
  TICKET_STATUS_PASSED,
  TICKET_STATUS_NOT_PASSED,
  TICKET_STATUS_VALUE_MAP_KEYS,
  TICKET_STATUS_VALUE_MAP,
} from "@/store/modules/dict/types";
import { deepClone, formatDateTime } from "@/utils/utils";
import { TableRowSelection } from "@arco-design/web-vue";

export default defineComponent({
  name: "OrderList",
  components: {
    Breadcrumb,
    BatchMoveModalVue,
    SfTablePage,
  },
  setup() {
    const dictStore = useDictStore();
    const serviceTypeMap = computed(() => {
      return dictStore.serviceTypeMap as any;
    });
    const serviceClassMap = computed(() => {
      return dictStore.serviceClassMap;
    });
    const fromTypeMap = computed(() => {
      return dictStore.fromTypeMap as any;
    });
    const ticketStatusMap = computed(() => {
      return dictStore.ticketStatusMap as any;
    });
    const { formatLoadData } = useFormatData<TicketModel>((item) => {
      return {
        key: item.ticketId,
        data: item,
        disabled: [1, 2, 5].indexOf(item.state) === -1, // 待分配，待接单，已接单才能转单
        serviceType: serviceTypeMap.value[item.serviceType]?.label || item.serviceType,
        ticketId: item.ticketId,
        productName: item.productName,
        jobName: item.jobName,
        serviceClass: serviceClassMap.value[item.serviceClass]?.label || item.serviceClass,
        placeName: item.placeName,
        createdBy: item.createdBy,
        fromType: fromTypeMap.value[item.fromType]?.label || item.fromType,
        level: "p" + item.level,
        status: ticketStatusMap.value[item.state]?.label || item.state,
        toName: item.toName,
      };
    });

    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "业务",
            dataIndex: "serviceClass",
            width: 80,
          },
          {
            title: "工单编号",
            dataIndex: "ticketId",
            width: 240,
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "事件",
            dataIndex: "jobName",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "工单类型",
            dataIndex: "productName",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "工单地点",
            dataIndex: "placeName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "工单状态",
            dataIndex: "status",
            ellipsis: true,
            tooltip: true,
            filterable: {
              ratio: 2,
              group: 1,
              sort: 1,
              type: "radio",
              queryField: "status",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...(
                  [
                    TICKET_STATUS_TOBE_ALLOCATION,
                    TICKET_STATUS_TOBE_ACCEPTED,
                    TICKET_STATUS_ACCEPTED,
                    TICKET_STATUS_TOBE_VERIFY,
                    TICKET_STATUS_PASSED,
                    TICKET_STATUS_NOT_PASSED,
                  ] as TICKET_STATUS_VALUE_MAP_KEYS
                ).map((item) => {
                  const status = ticketStatusMap.value[TICKET_STATUS_VALUE_MAP[item]];
                  return {
                    text: status.label,
                    value: status.value,
                  };
                }),
              ],
            },
          },
          {
            title: "处理人",
            dataIndex: "toName",
            width: 120,
            filterable: {
              type: "search",
            },
          },
        ];
      }),
      ["NO", "createdBy", "createdTime", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const tableDataMap = ref<Record<string, TicketModel>>({});
    const rowSelection = reactive<TableRowSelection>({
      showCheckedAll: false,
      selectedRowKeys: [],
    });
    const selected = computed(() => {
      return !!rowSelection.selectedRowKeys?.length;
    });
    const formatQueryData = (_query: Record<string, any>) => {
      interface Query extends TicketQueryParams {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.createdTime && (query.startCreatedTime = formatDateTime(_query.createdTime[0]));
      _query.createdTime && (query.endCreatedTime = formatDateTime(moment(_query.createdTime[1]).add(1, "days")));
      delete query.createdTime;
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      _query.status && (query.status = [_query.status]);
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return Ticket.pageByService(current, pageSize, formatQueryData(fQueryData.value)).then((res) => {
        Object.keys(tableDataMap.value).forEach((k) => {
          if (!(rowSelection.selectedRowKeys as string[]).some((sk) => sk === k)) {
            // 删除掉上一页未选中的
            delete tableDataMap.value[k];
          }
        });
        res.list.forEach((item) => {
          tableDataMap.value[item.ticketId] = item;
        });
        return res;
      });
    };

    const getDataByKeys = (keys: string[]) => {
      return keys.map((key) => tableDataMap.value[key]);
    };
    const refSfTablePage = ref();
    const refBatchMoveModalVue = ref();
    const reload = () => {
      refSfTablePage.value.reLoadData();
      rowSelection.selectedRowKeys = [];
    };
    const clickBatchMove = () => {
      refBatchMoveModalVue.value?.openModal(getDataByKeys(rowSelection.selectedRowKeys as string[]), reload);
    };

    const onClickAdd = () => {
      router.push({ name: "CreateOrder" });
    };

    const exportData = () => {
      const close = Message.delayLoading("导出中", 500);
      Ticket.exportCustomerTicketData(formatQueryData(fQueryData.value))
        .then(() => {
          close();
          Message.success("导出成功");
        })
        .catch(() => {
          close();
          Message.error("导出失败");
        });
    };

    return {
      loadData,
      formatLoadData,
      clickBatchMove,
      exportData,
      onClickAdd,
      selected,
      refSfTablePage,
      refBatchMoveModalVue,
      rowSelection,
      tableColumns,
      queryData,
    };
    // const refBatchMoveModalVue = ref();
    // const refRDVue = ref();
    // const tableDataMap = ref<any>({});
    // const getDataByKeys = (keys: string[]) => {
    //   console.log(keys, tableDataMap.value);
    //   return keys.map((key) => tableDataMap.value[key]);
    // };
    // const refSfTable = ref();
    // const clickBatchMove = () => {
    //   refBatchMoveModalVue.value?.openModal(getDataByKeys(selectedRowKeys.value), refSfTable.value.tableLoadData);
    // };

    // const loadData = (current: number, size: number, queryData: any) => {
    //   return Ticket.pageByService(current, size, queryData).then((res) => {
    //     Object.keys(tableDataMap.value).forEach((k) => {
    //       if (!selectedRowKeys.value.some((sk) => sk === k)) {
    //         // 删除掉上一页未选中的
    //         delete tableDataMap.value[k];
    //       }
    //     });
    //     res.list.forEach((item) => {
    //       tableDataMap.value[item.ticketId] = item;
    //     });
    //     return res;
    //   });
    // };
    // const appStore = useAppStore();
    // const serviceTypeMap = computed(() => {
    //   return appStore.serviceTypeMap as any;
    // });
    // const serviceClassMap = computed(() => {
    //   return appStore.serviceClassMap as any;
    // });
    // const fromTypeMap = computed(() => {
    //   return appStore.fromTypeMap as any;
    // });
    // const ticketStatusMap = computed(() => {
    //   return appStore.ticketStatusMap as any;
    // });
    // const formatLoadData = (data: TicketModel[]) => {
    //   return data.map((item) => {
    //     return {
    //       key: item.ticketId,
    //       data: item,
    //       disabled: [1, 2, 5].indexOf(item.state) === -1, // 待分配，待接单，已接单才能转单
    //       serviceType: serviceTypeMap.value[item.serviceType]?.label || item.serviceType,
    //       ticketId: item.ticketId,
    //       productName: item.productName,
    //       jobName: item.jobName,
    //       serviceClass: serviceClassMap.value[item.serviceClass]?.label || item.serviceClass,
    //       placeName: item.placeName,
    //       createdBy: item.createdBy,
    //       fromType: fromTypeMap.value[item.fromType]?.label || item.fromType,
    //       level: "p" + item.level,
    //       status: ticketStatusMap.value[item.state]?.label || item.state,
    //       toName: item.toName,
    //       createdTime: item.createdTime,
    //       upedatedTime: item.updatedTime,
    //       updatedBy: item.updatedBy,
    //     };
    //   });
    // };
    // const selectedRowKeys = ref<string[]>([]);
    // const tableColumns: RdTableColumnData[] = reactive([
    //   {
    //     title: "业务",
    //     dataIndex: "serviceClass",
    //     width: 80,
    //   },
    //   {
    //     title: "工单编号",
    //     dataIndex: "ticketId",
    //     width: 240,
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "事件",
    //     dataIndex: "jobName",
    //     ellipsis: true,
    //     tooltip: true,
    //   },
    //   {
    //     title: "工单类型",
    //     dataIndex: "productName",
    //     ellipsis: true,
    //     tooltip: true,
    //   },
    //   {
    //     title: "工单地点",
    //     dataIndex: "placeName",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "工单状态",
    //     dataIndex: "status",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "radio",
    //       queryField: "status",
    //       defaultValue: "-999",
    //       filters: [
    //         {
    //           text: "全部",
    //           value: "-999",
    //         },
    //         {
    //           text: "待分配",
    //           value: "5",
    //         },
    //         {
    //           text: "待接单",
    //           value: "1",
    //         },
    //         {
    //           text: "已接单",
    //           value: "2",
    //         },
    //         {
    //           text: "待验收",
    //           value: "3",
    //         },
    //         {
    //           text: "已通过",
    //           value: "8",
    //         },
    //         {
    //           text: "未通过",
    //           value: "9",
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     title: "处理人",
    //     dataIndex: "toName",
    //     width: 120,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "创建人",
    //     dataIndex: "createdBy",
    //     width: 120,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "创建时间",
    //     dataIndex: "createdTime",
    //     ellipsis: true,
    //     tooltip: true,
    //     width: 180,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "range-picker",
    //     },
    //   },
    //   {
    //     title: "操作人",
    //     dataIndex: "updatedBy",
    //     ellipsis: true,
    //     tooltip: true,
    //     width: 100,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "操作时间",
    //     dataIndex: "updatedTime",
    //     ellipsis: true,
    //     tooltip: true,
    //     width: 180,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "range-picker",
    //     },
    //   },
    // ]);
    // const queryData = reactive<any>({
    //   serviceClass: "-999",
    //   status: "-999",
    // });
    // const formatQueryData = (data: any) => {
    //   const q: any = {};
    //   // 如果存在时间
    //   if (data["updatedTime"]?.length > 0) {
    //     q["startUpdatedTime"] = moment(data["updatedTime"][0]).format("YYYY-MM-DD HH:mm:ss");
    //     q["endUpdatedTime"] = moment(data["updatedTime"][1]).add(1, "days").format("YYYY-MM-DD HH:mm:ss");
    //   }
    //   if (data["createdTime"]?.length > 0) {
    //     q["startCreatedTime"] = moment(data["createdTime"][0]).format("YYYY-MM-DD HH:mm:ss");
    //     q["endCreatedTime"] = moment(data["createdTime"][1]).add(1, "days").format("YYYY-MM-DD HH:mm:ss");
    //   }
    //   Object.keys(data).forEach((k) => {
    //     if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
    //       q[k] = data[k];
    //     }
    //   });
    //   if (q["status"]) {
    //     q["status"] = [q["status"]];
    //   }
    //   data.field && (q[data.field] = data.search);
    //   return q;
    // };
    // const selected = ref(false);
    // watch(selectedRowKeys, () => {
    //   if (selectedRowKeys.value.length === 0) {
    //     selected.value = false;
    //   } else {
    //     selected.value = true;
    //   }
    // });
    // const filterData = reactive({
    //   status: -1,
    //   search: "",
    //   placeName: "",
    //   serviceClass: -1,
    //   product: -1,
    //   toName: "",
    //   ticketId: "",
    //   startTime: 0,
    //   endTime: 0,
    // });
    // const refBatchCancelModalVue = ref();
    // const refBatchConfirmModalVue = ref();
    // const refCreateModalVue = ref();
    // const refEditModalVue = ref();
    // const clickBatchConfirm = () => {
    //   refBatchConfirmModalVue.value?.openModal(getDataByKeys(selectedRowKeys.value), refRDVue.value.loadTableData);
    // };
    // const clickBatchCancel = () => {
    //   refBatchCancelModalVue.value?.openModal(getDataByKeys(selectedRowKeys.value), refRDVue.value.loadTableData);
    // };

    // const onClickAdd = () => {
    //   router.push({ name: "ServiceCreateOrder" });
    // };

    // const exportData = () => {
    //   console.log("exportData");
    //   const close = Message.delayLoading("导出中", 500);
    //   Ticket.exportCustomerTicketData(formatQueryData(queryData) as TicketQueryParams)
    //     .then((res) => {
    //       close();
    //       Message.success("导出成功");
    //     })
    //     .catch(() => {
    //       close();
    //       Message.error("导出失败");
    //     });
    // };

    // return {
    //   tableDataMap,
    //   selected,
    //   filterData,
    //   refBatchCancelModalVue,
    //   refBatchConfirmModalVue,
    //   refBatchMoveModalVue,
    //   refCreateModalVue,
    //   refEditModalVue,
    //   refRDVue,
    //   loadData,
    //   clickBatchConfirm,
    //   clickBatchCancel,
    //   clickBatchMove,
    //   exportData,
    //   // 测试添加
    //   refSfTable,
    //   serviceClassMap,
    //   serviceTypeMap,
    //   fromTypeMap,
    //   ticketStatusMap,
    //   formatLoadData,
    //   tableColumns,
    //   selectedRowKeys,
    //   queryData,
    //   formatQueryData,
    //   onClickAdd,
    // };
  },
});
</script>

<style lang="less" scoped>
@import "@arco-design/web-vue/es/style/theme/global.less";
.container {
  padding: 0 20px 20px 20px;
}
.work-order {
  .filter-bar {
    border-bottom: 1px solid var(--color-border-2);
  }
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
