<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :del="false"
    :click-add="false"
    :operation="['view']"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['客户服务', '客户评价']" />
    </template>
    <template #table-score="{ record }">
      <a-rate :model-value="record.data.score" readonly />
    </template>
    <template #filter-pre-extra="{ formItemAttr }">
      <a-form-item v-bind="formItemAttr" label="评价类型">
        <a-radio-group type="button" v-model="listType" :options="commentTypeOptions" />
      </a-form-item>
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import StaffEvaluation, { StaffEvaluationModel } from "@/api/tenant/StaffEvaluation";
import PropertyEvaluation, { PropertyEvaluationModel } from "@/api/tenant/PropertyEvaluation";
import moment from "moment";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";
import { TableRowSelection } from "@arco-design/web-vue";

export default defineComponent({
  name: "comment-view",
  components: {
    Breadcrumb,
    SfTablePage,
  },
  setup() {
    const { formatLoadData } = useFormatData<StaffEvaluationModel & PropertyEvaluationModel>((item) => {
      return {
        key: (item?.staffEvaluationId || item?.propertyEvaluationId) as string,
        data: item,
        evaludationId: (item?.staffEvaluationId || item?.propertyEvaluationId) as string,
        personId: item.personId,
        personName: item.personName,
        personAddress: item.personAddress,
        content: item.content,
        toName: item.toName,
        createdTime: item.createdTime,
        score: item.score,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "评价人",
            dataIndex: "personName",
            width: 80,
            filterable: {
              type: "search",
            },
          },
          {
            title: "房号",
            dataIndex: "personAddress",
            ellipsis: true,
            tooltip: true,
            filterable: {
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
            dataIndex: "toName",
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
        ];
      }),
      ["NO", "createdTime", "updatedBy", "updatedTime"],
    );
    const listType = ref(1);
    const commentTypeOptions = reactive([
      {
        value: 1,
        label: "员工评价",
      },
      {
        value: 2,
        label: "物业评价",
      },
    ]);
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
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      if (listType.value === 1) {
        return StaffEvaluation.page(current, pageSize, formatQueryData(fQueryData.value));
      } else {
        return PropertyEvaluation.page(current, pageSize, formatQueryData(fQueryData.value));
      }
    };
    const refSfTablePage = ref();
    watch(listType, () => {
      refSfTablePage.value.reLoadData();
    });
    const rowSelection = reactive<TableRowSelection>({
      selectedRowKeys: [],
    });
    return {
      refSfTablePage,
      tableColumns,
      queryData,
      rowSelection,
      listType,
      commentTypeOptions,
      formatLoadData,
      loadData,
    };
  },
});
</script>

<style scoped lang="less"></style>
