<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :del="false"
    :operation="['view']"
    :click-add="false"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['客户服务', '客户报事', '报事评价']" />
    </template>
    <template #table-score="{ record }">
      <a-rate :model-value="record.data.score" readonly />
    </template>
  </SfTablePage>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import ReportComment, { ReportCommentModel } from "@/api/tenant/ReportComment";
import moment from "moment";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";
export default defineComponent({
  name: "greport-comment",
  components: {
    Breadcrumb,
    SfTablePage,
  },
  setup() {
    const { formatLoadData } = useFormatData<ReportCommentModel>((item) => {
      return {
        key: item.ticketId,
        data: item,
        ticketId: item.ticketId,
        appraiseId: item.appraiseId,
        appraiseName: item.appraiseName,
        appraisePhone: item.appraisePhone,
        address: item.address,
        content: item.content,
        jobId: item.jobId,
        jobName: item.jobName,
        score: item.score,
        createdTime: item.createdTime,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "评价人",
            dataIndex: "appraiseName",
            width: 80,
            filterable: {
              align: "filter-bar",
              type: "search",
            },
          },
          {
            title: "房号",
            dataIndex: "address",
            ellipsis: true,
            tooltip: true,
            filterable: {
              align: "filter-bar",
              type: "search",
            },
          },
          {
            title: "关联报事编号",
            dataIndex: "ticketId",
            ellipsis: true,
            tooltip: true,
            width: 200,
            filterable: {
              align: "filter-bar",
              type: "search",
            },
          },
          {
            title: "评价内容",
            dataIndex: "content",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "评价对象",
            dataIndex: "jobName",
            ellipsis: true,
            tooltip: true,
            width: 120,
          },
          {
            title: "评价星级",
            slotName: "table-score",
            width: 180,
            filterable: {
              type: "select",
              queryField: "score",
              filters: [
                {
                  value: "1",
                  text: "⭐",
                },
                {
                  value: "2",
                  text: "⭐⭐",
                },
                {
                  value: "3",
                  text: "⭐⭐⭐",
                },
                {
                  value: "4",
                  text: "⭐⭐⭐⭐",
                },
                {
                  value: "5",
                  text: "⭐⭐⭐⭐⭐",
                },
              ],
            },
          },
          {
            title: "评价时间",
            dataIndex: "createdTime",
            width: 180,
            filterable: {
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
      _query.createdTime && (query.startCreatedTime = formatDateTime(_query.createdTime[0]));
      _query.createdTime && (query.endCreatedTime = formatDateTime(moment(_query.createdTime[1]).add(1, "days")));
      delete query.createdTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return ReportComment.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const refSfTablePage = ref();
    return {
      refSfTablePage,
      tableColumns,
      queryData,
      formatLoadData,
      loadData,
    };
  },
});
</script>
<style lang="less" scoped></style>
