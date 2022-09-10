<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :add-text="'录入投诉'"
    :click-add="inputComplain"
    :del="false"
    :operation="['view']"
    :scroll="{ x: 1570 }"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['客户服务', '客户投诉', '投诉列表']" />
    </template>
    <template #tools-options>
      <a-tooltip content="导出数据">
        <a-button shape="circle" @click="exportData">
          <icon-file />
        </a-button>
      </a-tooltip>
    </template>
  </SfTablePage>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useDictStore } from "@/store";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Complain, { ComplainModel } from "@/api/tenant/Complain";
import moment from "moment";
import Message from "@/utils/Message";
import Ticket, { TicketQueryParams } from "@/api/tenant/Ticket";
import { SfTableColumnData } from "@/components/lib/SfTable";
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
import { useRouter } from "vue-router";

export default defineComponent({
  name: "gcomplain-main",
  components: {
    Breadcrumb,
    SfTablePage,
  },
  setup() {
    const dictStore = useDictStore();
    const serviceClassMap = computed(() => {
      return dictStore.serviceClassMap;
    });
    const ticketStatusMap = computed(() => {
      return dictStore.ticketStatusMap;
    });
    const { formatLoadData } = useFormatData<ComplainModel>((item) => {
      return {
        key: item.ticketId,
        data: item,
        ticketId: item.ticketId,
        serviceClass: serviceClassMap.value[item.serviceClass]?.label || item.serviceClass,
        jobName: item.jobName,
        productName: item.productName,
        state: ticketStatusMap.value[item.state]?.label || item.state,
        updatedBy: item.updatedBy,
        updatedTime: item.updatedTime,
        complaintName: item.customName,
        // 投诉时间
        createdTime: item.createdTime,
        toName: item.toName,
      };
    });

    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "业务",
            dataIndex: "serviceClass",
            ellipsis: true,
            tooltip: true,
            width: 80,
          },
          {
            title: "投诉编号",
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
            title: "状态",
            dataIndex: "state",
            ellipsis: true,
            tooltip: true,
            filterable: {
              group: 1,
              ratio: 2,
              type: "radio",
              queryField: "state",
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
              queryField: "handlerName",
              type: "search",
            },
          },
          {
            title: "投诉人",
            dataIndex: "complaintName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "投诉时间",
            dataIndex: "createdTime",
            width: 180,
            ellipsis: true,
            tooltip: true,
            filterable: {
              sort: 98,
              type: "range-picker",
            },
          },
        ];
      }),
      ["NO", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
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
      _query.state && (query.state = [_query.state]);
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return Complain.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const refSfTablePage = ref();
    const refBatchMoveModalVue = ref();
    const exportData = () => {
      const close = Message.delayLoading("导出中", 500);
      Ticket.exportComplainData(formatQueryData(queryData) as TicketQueryParams)
        .then(() => {
          close();
          Message.success("导出成功");
        })
        .catch(() => {
          close();
          Message.error("导出失败");
        });
    };
    const router = useRouter();
    const inputComplain = () => {
      router.push({ name: "ResidentCreateComplain" });
    };

    return {
      refSfTablePage,
      refBatchMoveModalVue,
      tableColumns,
      queryData,
      formatLoadData,
      loadData,
      exportData,
      inputComplain,
    };
  },
});
</script>
<style lang="less" scoped></style>
