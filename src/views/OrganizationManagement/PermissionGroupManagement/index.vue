<template>
  <div class="permission-group-mamagement container">
    <Breadcrumb :items="['组织管理', '权限组管理']"></Breadcrumb>
    <a-card>
      <a-space direction="vertical" fill>
        <FilterBar></FilterBar>
        <a-space>
          <div class="list">
            <a-row justify="space-between">
              <SelectedOptions>
                <template #selected-options></template>
              </SelectedOptions>
              <Options>
                <template #options></template>
                <template #tools-options>
                  <TableTools />
                </template>
              </Options>
            </a-row>
            <Table></Table>
          </div>
          <div class="tree">
            <PermissionTree></PermissionTree>
          </div>
        </a-space>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Table from "@/components/lib/SfTable/Table";
import FilterBar from "@/components/lib/SfTable/FilterBar";
import SelectedOptions from "@/components/lib/SfTable/SelectedOptions";
import Options from "@/components/lib/SfTable/Options";
import { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns, useTableTools } from "@/components/lib/SfTablePage";
import { sfTableInjectKey } from "@/components/lib/SfTable/context";
import { SfTableColumnData, useHandlerTableColumns, usePagination, useSelect } from "@/components/lib/SfTable";
import PermissionTree from "@/components/PermissionTree/index.vue";
export default defineComponent({
  name: "permission-group-mamagement",
  components: {
    Breadcrumb,
    Table,
    FilterBar,
    SelectedOptions,
    Options,
    // TODO: 权限组与权限树的联动
    PermissionTree,
  },
  setup() {
    // TODO: 定义权限组 page 类型
    const { formatLoadData } = useFormatData<any>((item) => {
      return {
        key: item.id,
        data: item,
        name: item.name,
        remark: item.remark,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => [
        {
          title: "权限组名称",
          dataIndex: "name",
          width: 200,
          ellipsis: true,
          tooltip: true,
          filterable: {
            type: "search",
          },
        },
        {
          title: "描述",
          dataIndex: "remark",
          ellipsis: true,
          tooltip: true,
        },
      ]),
      ["NO", "createdTime", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);

    const tableLoading = ref(false);
    const rowData = ref();
    const tableData = formatLoadData(rowData);
    const { pagination } = usePagination(ref({}));
    const loadData = (showLoading?: boolean | undefined) => {
      const query: any = {};
      showLoading && (tableLoading.value = true);
      // TODO: 权限组列表接口
      return Promise.resolve() as Promise<any>;
    };

    const { rowSelection, isSelected, onSelectAll, onRowSelect } = useSelect(ref({}), tableData);
    const _scorll = ref({ x: 1400 });
    const { scroll, displayColumnKeys, TableTools } = useTableTools(tableColumns, undefined, _scorll);
    const { displayTableColumns } = useHandlerTableColumns(displayColumnKeys, tableColumns);
    provide(sfTableInjectKey, {
      tableLoading,
      tableData,
      tableColumns,
      rowSelection,
      scroll,
      displayTableColumns,
      displayColumnKeys,
      queryData: ref(queryData),
      pagination,
      isSelected,
      onSelectAll,
      onRowSelect,
      loadData,
    });
    return {
      TableTools,
    };
  },
});
</script>

<style lang="less" scoped>
.permission-group-mamagement {
  .tree {
    width: 300px;
  }
}
</style>
