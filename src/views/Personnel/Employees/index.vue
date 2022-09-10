<template>
  <div class="container employees-view">
    <Breadcrumb :items="['人员管理', '用户管理']" />
    <a-card>
      <a-row justify="start" align="stretch" :wrap="false">
        <a-col flex="216px" class="departments">
          <a-space direction="vertical" fill>
            <a-input-search placeholder="搜索部门" />
            <SeeingTree />
          </a-space>
        </a-col>
        <a-col flex="auto" class="employyess">
          <a-space direction="vertical" fill>
            <a-row justify="space-between">
              <a-col flex="240px">
                <a-input-search placeholder="搜索姓名/账号/工号/联系方式" />
                <AreaSelectVue />
              </a-col>
              <a-col flex="auto" style="text-align: right">
                <a-space>
                  <a-button>批量导入/导出</a-button>
                  <a-button type="primary" @click="addEmployess">
                    <template #icon>
                      <icon-plus />
                    </template>
                    添加成员
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
            <a-table
              :bordered="false"
              :table-layout-fixed="true"
              column-resizable
              :filter-icon-align-left="true"
              :columns="columns"
              :data="tableData"
              :row-selection="rowSelection"
              @row-click="rowClick"
              @select="rowSelect"
            />
          </a-space>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SeeingTree from "./components/SeeingTree.vue";
import { TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue/es/table/interface";
import AreaSelectVue from "@/components/lib/AreaSelect.vue";
export default defineComponent({
  name: "EmployeesView",
  components: {
    Breadcrumb,
    SeeingTree,
    AreaSelectVue,
  },
  setup() {
    const router = useRouter();
    function useTable() {
      const rowSelection = reactive<TableRowSelection>({
        type: "checkbox",
        showCheckedAll: true,
        width: 25,
        selectedRowKeys: [],
      });

      const columns = reactive<TableColumnData[]>([
        {
          title: "姓名",
          dataIndex: "name",
          width: 110,
        },
        {
          title: "账号",
          dataIndex: "account",
          ellipsis: true,
tooltip: true,
        },
        {
          title: "工号",
          dataIndex: "workCode",
          ellipsis: true,
tooltip: true,
        },
        {
          title: "联系方式",
          dataIndex: "tel",
          width: 150,
        },
        {
          title: "部门",
          dataIndex: "department",
          ellipsis: true,
tooltip: true,
        },
        {
          title: "状态",
          dataIndex: "status",
          width: 80,
          filterable: {
            filters: [
              {
                text: "在职",
                value: "在职",
              },
              {
                text: "离职",
                value: "离职",
              },
            ],
            filter: (value: any, row: any) => row.address.includes(value),
            multiple: true,
          },
        },
        {
          title: "入职时间",
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
        router.push({ name: "ViewEmployees" });
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
    const addEmployess = () => {
      router.push({ name: "AddEmployees" });
    };
    return {
      columns,
      tableData,
      rowSelection,
      rowClick,
      rowSelect,
      addEmployess,
    };
  },
});
</script>

<style lang="less" scoped>
.employees-view {
  .departments {
    padding-right: 16px;
    border-right: 1px solid var(--color-neutral-3);
  }
  .employyess {
    padding-left: 16px;
    :deep(.arco-table-tr) {
      cursor: pointer;
    }
  }
}
</style>
