<template>
  <SfTablePage
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="false"
    :operation="['view', 'edit']"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['病例管理']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Casebook from "@/api/diagnosis/Casebook";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { TableRowSelection } from "@arco-design/web-vue";

// id: number;
// patientDescription: string;
// diagnosticStatus: number;
// rvsIdentificationResult: string;
// maIdentificationResult: string;
// doctorAdvice: string;
// userId: number;
// patientId: number;
// createdBy: string;
// createdTime: string;
// updatedBy: string;
// updatedTime: string;
export default defineComponent({
  name: "user-index",
  components: {
    SfTablePage,
    Breadcrumb,
  },
  setup() {
    const { formatLoadData } = useFormatData<any>((item) => {
      return {
        key: item.id,
        data: item,
        ...item,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "患者",
            dataIndex: "userId",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "病例描述",
            dataIndex: "patientDescription",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "诊断状态",
            dataIndex: "diagnosticStatus",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "RVS识别结果",
            dataIndex: "rvsIdentificationResult",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "MA识别结果",
            dataIndex: "maIdentificationResult",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "医生建议",
            dataIndex: "doctorAdvice",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "创建时间",
            dataIndex: "createdTime",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "更新时间",
            dataIndex: "updatedTime",
            ellipsis: true,
            tooltip: true,
          },
        ];
      }),
      ["updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const rowSelection = reactive<TableRowSelection>({
      showCheckedAll: false,
      selectedRowKeys: [],
    });
    const loadData = (current: number, pageSize: number, query: any) => {
      return Casebook.page(current, pageSize);
    };
    return {
      loadData,
      formatLoadData,
      rowSelection,
      tableColumns,
      queryData,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-index {
}
</style>
