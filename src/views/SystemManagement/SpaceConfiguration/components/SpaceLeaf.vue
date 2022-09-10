<template>
  <div class="space-leaf">
    <a-card :bordered="false">
      <template #title>
        <a-button shape="circle" type="text" @click="$emit('exit-show-leaf')">
          <icon-left />
        </a-button>
        <span> {{ "户室属性" }} </span>
      </template>
      <template #extra>
        <a-button type="primary" @click="goEdit" v-if="model === 'view'"> <icon-edit /> 编辑 </a-button>
      </template>
      <SpaceAttribute />
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue/es/table/interface";
import SpaceAttribute from "./SpaceAttribute.vue";

export default defineComponent({
  name: "space-leaf",
  components: {
    SpaceAttribute,
  },
  setup() {
    //
    function useTable() {
      const rowSelection = reactive<TableRowSelection>({
        type: "checkbox",
        showCheckedAll: true,
        width: 25,
        selectedRowKeys: [],
      });

      const columns = reactive<TableColumnData[]>([
        {
          title: "名称",
          dataIndex: "name",
          width: 110,
        },
        {
          title: "楼层",
          dataIndex: "account",
          ellipsis: true,
tooltip: true,
        },
        {
          title: "类型",
          dataIndex: "workCode",
          ellipsis: true,
tooltip: true,
        },
        {
          title: "户型",
          dataIndex: "tel",
          width: 150,
        },
        {
          title: "更新时间",
          dataIndex: "createTime",
          width: 110,
          sortable: {
            sortDirections: ["ascend", "descend"],
            sorter: true,
          },
        },
      ]);
      const tableData = reactive<TableData[]>([
        {
          key: "1",
          name: "武永华",
          account: "yonghua",
          workCode: "000239",
          tel: "15616900010",
          department: "技术部",
          // createTime: 1647417597008,
          createTime: "2022-3-15",
          status: "在职",
        },
        {
          key: "2",
          name: "武永华",
          account: "yonghua",
          workCode: "000239",
          tel: "15616900010",
          department: "技术部",
          // createTime: 1647417597008,
          createTime: "2022-3-15",
          status: "在职",
        },
        {
          key: "3",
          name: "武永华",
          account: "yonghua",
          workCode: "000239",
          tel: "15616900010",
          department: "技术部",
          // createTime: 1647417597008,
          createTime: "2022-3-15",
          status: "在职",
        },
        {
          key: "4",
          name: "武永华",
          account: "yonghua",
          workCode: "000239",
          tel: "15616900010",
          department: "技术部",
          // createTime: 1647417597008,
          createTime: "2022-3-15",
          status: "在职",
        },
        {
          key: "5",
          name: "武永华",
          account: "yonghua",
          workCode: "000239",
          tel: "15616900010",
          department: "技术部",
          // createTime: 1647417597008,
          createTime: "2022-3-15",
          status: "在职",
        },
      ]);
      const rowClick = (record: TableData) => {
        console.log("rowClick: record", record);
        // router.push({ name: "ViewEmployees" });
      };
      const rowSelect = (rowKeys: string[]) => {
        console.log("rowKeys", rowKeys);
        rowSelection.selectedRowKeys = rowKeys;
      };
      return {
        columns,
        tableData,
        rowSelection,
        rowClick,
        rowSelect,
      };
    }
    const { columns, tableData, rowSelection, rowClick, rowSelect } = useTable();

    return {
      columns,
      tableData,
      rowSelection,
      rowClick,
      rowSelect,
    };
  },
});
</script>

<style lang="less" scoped>
.space-leaf {
  :deep(.arco-card-header) {
    height: 32px;
    padding: unset;
  }
  :deep(.arco-card-body) {
    padding: unset;
    padding-top: 8px;
  }
}
</style>
