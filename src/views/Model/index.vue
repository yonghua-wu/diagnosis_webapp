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
      <Breadcrumb :items="['模型管理']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Model from "@/api/diagnosis/Model";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { TableRowSelection } from "@arco-design/web-vue";

// modelAddress: string;
//   createdBy: string;
//   createdTime: string;
//   updatedBy: string;
//   updatedTime: string;
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
            title: "模型地址",
            dataIndex: "modelAddress",
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
      return Model.page(current, pageSize);
    };
    return {
      rowSelection,
      loadData,
      formatLoadData,
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
