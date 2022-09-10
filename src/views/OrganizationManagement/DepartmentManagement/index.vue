<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="del"
    :operation="['view']"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['组织管理', '部门管理']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { PaginationModel } from "@/api/Property/base";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import { TableRowSelection } from "@arco-design/web-vue";
import { computed, defineComponent, reactive } from "vue";
export default defineComponent({
  name: "department-mamagement",
  setup() {
    // TODO: 定义部门 page 类型
    const { formatLoadData } = useFormatData<any>((item) => {
      return {
        key: item.key,
        data: item,
        name: item.name,
        number: item.number,
        head: item.head,
        defaultRole: item.defaultRole,
        chatGroupName: item.chatGroupName,
        chatGroupOwner: item.chatGroupOwner,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => [
        {
          title: "部门名称",
          dataIndex: "name",
          ellipsis: true,
          tooltip: true,
          filterable: {
            type: "search",
          },
        },
        {
          title: "部门人数",
          dataIndex: "number",
          width: 80,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "负责人",
          dataIndex: "head",
          width: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "默认角色",
          dataIndex: "defaultRole",
          width: 200,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "部门群名称",
          dataIndex: "head",
          width: 200,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "部门群群主",
          dataIndex: "head",
          width: 100,
          ellipsis: true,
          tooltip: true,
        },
      ]),
      ["updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);

    const loadData = (current: number, pageSize: number, query: any) => {
      // TODO: 缺少部门 page 请求
      return Promise.resolve() as unknown as unknown as Promise<PaginationModel<any[]>>;
    };
    const del = (ids: string[]) => {
      // TODO: 缺少删除部门请求
      return Promise.resolve();
    };
    const rowSelection = reactive<TableRowSelection>({
      showCheckedAll: false,
      selectedRowKeys: [],
    });
    return {
      queryData,
      tableColumns,
      rowSelection,
      del,
      formatLoadData,
      loadData,
    };
  },
});
</script>

<style lang="less" scoped>
.department-mamagement {
}
</style>
