<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :add-text="'创建新工单'"
    :click-add="onClickAdd"
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
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Ticket, { TicketModel, TicketQueryParams } from "@/api/tenant/Ticket";
import BatchMoveModalVue from "./components/BatchMoveModal.vue";
import { useDictStore } from "@/store";
import moment from "moment";
import router from "@/router";
import Message from "@/utils/Message";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { TableRowSelection } from "@arco-design/web-vue";
import { deepClone, formatDateTime } from "@/utils/utils";
import {
  TICKET_STATUS_VALUE_MAP_KEYS,
  SERVICE_CLASS_VALUE_MAP_KEYS,
  SERVICE_CLASS_ENVI,
  SERVICE_CLASS_MACHINE,
  SERVICE_CLASS_MANAGE,
  SERVICE_CLASS_SAFETY,
  SERVICE_CLASS_VALUE_MAP,
  TICKET_STATUS_TOBE_ALLOCATION,
  TICKET_STATUS_TOBE_ACCEPTED,
  TICKET_STATUS_ACCEPTED,
  TICKET_STATUS_TOBE_VERIFY,
  TICKET_STATUS_PASSED,
  TICKET_STATUS_NOT_PASSED,
  TICKET_STATUS_VALUE_MAP,
} from "@/store/modules/dict/types";

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
            filterable: {
              ratio: 2,
              group: 1,
              sort: 2,
              type: "radio",
              queryField: "serviceClass",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...([SERVICE_CLASS_SAFETY, SERVICE_CLASS_ENVI, SERVICE_CLASS_MACHINE, SERVICE_CLASS_MANAGE] as SERVICE_CLASS_VALUE_MAP_KEYS).map(
                  (item) => {
                    const serviceClass = serviceClassMap.value[SERVICE_CLASS_VALUE_MAP[item]];
                    return {
                      text: serviceClass.label,
                      value: serviceClass.value,
                    };
                  },
                ),
              ],
            },
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
      return Ticket.page(current, pageSize, formatQueryData(fQueryData.value)).then((res) => {
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
      Ticket.exportWorkOrderData(formatQueryData(fQueryData.value))
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
  },
});
</script>

<style lang="less" scoped>
.work-order {
}
</style>
