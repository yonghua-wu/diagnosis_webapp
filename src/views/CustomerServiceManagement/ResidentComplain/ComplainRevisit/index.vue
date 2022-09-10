<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :del="false"
    :row-click="toDetail"
    :row-view="toDetail"
    :operation="['view']"
    :click-add="false"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['客户服务', '客户投诉', '投诉回访']" />
    </template>
  </SfTablePage>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import ComplainRevisit, { ComplainRevisitModel } from "@/api/tenant/ComplainRevisit";
import { useAppStore } from "@/store";
import moment from "moment";
import { useRouter } from "vue-router";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";

export default defineComponent({
  name: "gcomplain-revisit",
  components: {
    Breadcrumb,
    SfTablePage,
  },
  setup() {
    // TODO: 设置回访方式字典
    const appStore = useAppStore();
    const revisitTypeMap = computed(() => {
      return appStore.revisitTypeMap as any;
    });
    const { formatLoadData } = useFormatData<ComplainRevisitModel>((item) => {
      return {
        // FIX: 为啥回访列表的key设的是ticketId？
        key: item.ticketId,
        data: item,
        ticketId: item.ticketId,
        //visitType: visitTypeMap.get(item.visitType) || item.visitType,
        visitType: revisitTypeMap.value[item.visitType]?.label,
        content: item.content,
        handlerName: item.handlerName,
        visitTime: item.visitTime,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "投诉编号",
            dataIndex: "ticketId",
            ellipsis: true,
            tooltip: true,
            width: 240,
            filterable: {
              type: "search",
            },
          },
          {
            title: "回访方式",
            dataIndex: "visitType",
            ellipsis: true,
            tooltip: true,
            width: 200,
            filterable: {
              group: 1,
              ratio: 2,
              type: "radio",
              queryField: "visitType",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...Object.keys(revisitTypeMap.value).map((k) => {
                  return {
                    text: revisitTypeMap.value[k]?.label || k,
                    value: k,
                  };
                }),
              ],
            },
          },
          {
            title: "回访备注",
            dataIndex: "content",
            ellipsis: true,
            tooltip: true,
            width: 200,
          },
          {
            title: "回访人",
            dataIndex: "handlerName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "回访日期",
            dataIndex: "visitTime",
            ellipsis: true,
            tooltip: true,
            width: 180,
            filterable: {
              sort: 98,
              type: "range-picker",
            },
          },
        ];
      }),
      ["NO"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const formatQueryData = (_query: Record<string, any>) => {
      interface Query {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      _query.visitTime && (query.startTime = formatDateTime(_query.visitTime[0]));
      _query.visitTime && (query.endTime = formatDateTime(moment(_query.visitTime[1]).add(1, "days")));
      delete query.visitTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return ComplainRevisit.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const refSfTablePage = ref();
    const router = useRouter();
    const toDetail = (record: any) => {
      router.push({ name: "ResidentComplainRevisitDetail", params: { id: record.ticketId, model: "View" } });
    };
    return {
      refSfTablePage,
      tableColumns,
      queryData,
      formatLoadData,
      loadData,
      toDetail,
    };
  },
});
</script>
<style lang="less" scoped></style>
