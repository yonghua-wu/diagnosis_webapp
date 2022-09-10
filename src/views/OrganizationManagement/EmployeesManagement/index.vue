<template>
  <div class="employees-mamagement container">
    <Breadcrumb :items="['组织管理', '员工管理']" />
    <a-card>
      <a-split class="main-split" v-model:size="size" min="80px">
        <template #first>
          <a-space direction="vertical" fill>
            <a-input-search placeholder="搜索姓名、手机号"></a-input-search>
            <DepartmentTree class="department-tree" />
            <a-space>
              <a-button>
                <template #icon>
                  <icon-plus />
                </template>
                新建部门
              </a-button>
              <a-button>管理部门</a-button>
            </a-space>
          </a-space>
        </template>
        <template #second>
          <a-space direction="vertical" fill>
            <a-row justify="space-between">
              <div class="title">
                <!-- TODO: 部门名称和部门及子部门人数 -->
                <span>部门名称</span>
                <a-tooltip content="包含子部门员工">
                  <icon-user-group />
                  <span>部门人数</span>
                </a-tooltip>
              </div>
              <div class="switch-status"></div>
            </a-row>
            <a-row justify="space-between">
              <SelectedOptions>
                <template #selected-options></template>
              </SelectedOptions>
              <Options>
                <template #options>
                  <a-button type="primary">添加</a-button>
                  <a-button>批量导入</a-button>
                </template>
                <template #tools-options>
                  <TableTools />
                </template>
              </Options>
            </a-row>
            <Table></Table>
          </a-space>
        </template>
      </a-split>
    </a-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import DepartmentTree from "@/components/DepartmentTree/index.vue";
import Table from "@/components/lib/SfTable/Table";
import SelectedOptions from "@/components/lib/SfTable/SelectedOptions";
import Options from "@/components/lib/SfTable/Options";
import { sfTableInjectKey } from "@/components/lib/SfTable/context";
import { SfTableColumnData, usePagination, useSelect, useHandlerTableColumns } from "@/components/lib/SfTable";
import { useFormatData, useTableColumns, useQueryData, useFilterDefaultValueQueryData, useTableTools } from "@/components/lib/SfTablePage";
export default defineComponent({
  name: "employees-mamagement",
  components: {
    Breadcrumb,
    DepartmentTree,
    Table,
    SelectedOptions,
    Options,
  },
  setup() {
    const size = ref(300);
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
          title: "姓名",
          dataIndex: "name",
          width: 120,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "职位",
          dataIndex: "name",
          width: 120,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "状态",
          dataIndex: "name",
          width: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "联系方式",
          dataIndex: "name",
          width: 130,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "部门",
          dataIndex: "name",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "角色",
          dataIndex: "name",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "入职时间",
          dataIndex: "name",
          width: 180,
          ellipsis: true,
          tooltip: true,
        },
      ]),
      ["NO", "updatedBy", "updatedTime"],
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
      // TODO: 员工列表接口
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
      size,
      TableTools,
    };
  },
});
</script>

<style lang="less" scoped>
.employees-mamagement {
  .main-split {
    height: 100%;
    width: 100%;
    min-width: 800px;
  }
  .department-tree {
    height: 100%;
  }
}
</style>
