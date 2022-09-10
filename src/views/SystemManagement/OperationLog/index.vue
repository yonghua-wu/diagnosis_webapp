<template>
  <div class="container operation-log">
    <Breadcrumb :items="['系统管理', '操作日志']" />
    <a-card>
      <a-space direction="vertical" fill>
        <a-row>
          <a-space>
            <a-button status="danger" :disabled="rowSelection.selectedRowKeys.length === 0">删除</a-button>
          </a-space>
        </a-row>
        <a-row>
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
            @select-all="selectAll"
          />
        </a-row>
      </a-space>
    </a-card>
    <a-modal v-model:visible="visible" title="详情" title-align="start" width="500px" @before-ok="handleBeforeOk">
      <a-form :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 16 }">
        <a-form-item label="实体名称">1213</a-form-item>
        <a-form-item label="实体类型">1213</a-form-item>
        <a-form-item label="用户">1213</a-form-item>
        <a-form-item label="操作类型">1213</a-form-item>
        <a-form-item label="状体">1213</a-form-item>
        <a-form-item label="操作时间">1213</a-form-item>
        <a-form-item label="提交的数据">1213</a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue/es/table/interface";

function useTable(openModal: (record: TableData) => void) {
  const isSelectAll = ref(false);
  const rowSelection = reactive<TableRowSelection>({
    type: "checkbox",
    showCheckedAll: true,
    width: 25,
    selectedRowKeys: [],
  });

  const columns = reactive<TableColumnData[]>([
    {
      title: "实体名称",
      dataIndex: "entityName",
      width: 110,
    },
    {
      title: "实体类型",
      dataIndex: "entityType",
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "用户",
      dataIndex: "username",
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "操作类型",
      dataIndex: "operationType",
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 150,
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      ellipsis: true,
      tooltip: true,
    },
  ]);
  const tableData = reactive<TableData[]>([
    {
      key: "1",
      entityName: "技术部",
      entityType: "部门",
      username: "武永华",
      operationType: "新增",
      status: "成功",
      createTime: "2022-02-23 12:12:12",
    },
    {
      key: "2",
      entityName: "产品部",
      entityType: "部门",
      username: "武永华",
      operationType: "新增",
      status: "成功",
      createTime: "2022-02-23 12:12:12",
    },
    {
      key: "3",
      entityName: "业务部",
      entityType: "部门",
      username: "武永华",
      operationType: "新增",
      status: "成功",
      createTime: "2022-02-23 12:12:12",
    },
  ]);

  const rowClick = (record: TableData) => {
    console.log("rowClick: record", record);
    // router.push({ name: "ViewEmployees" });
    openModal(record);
  };
  const rowSelect = (rowKeys: string[]) => {
    console.log("rowKeys", rowKeys);
    rowSelection.selectedRowKeys = rowKeys;
  };

  const selectAll = (e: boolean) => {
    if (e) {
      (rowSelection.selectedRowKeys as string[]) = tableData.map((data) => data.key as string);
      isSelectAll.value = true;
    } else {
      rowSelection.selectedRowKeys = [];
      isSelectAll.value = false;
    }
  };

  return {
    columns,
    tableData,
    rowSelection,
    selectAll,
    rowClick,
    rowSelect,
  };
}

function useModal() {
  const formData = reactive({
    name: "",
  });
  const visible = ref(false);
  const openModal = () => {
    visible.value = true;
  };
  const handleBeforeOk = () => {
    console.log("before ok");
  };
  return {
    formData,
    visible,
    openModal,
    handleBeforeOk,
  };
}

export default defineComponent({
  name: "OperationLog",
  components: {
    Breadcrumb,
  },
  setup() {
    const { formData, visible, openModal, handleBeforeOk } = useModal();
    const { columns, tableData, rowSelection, selectAll, rowClick, rowSelect } = useTable(openModal);
    return { columns, tableData, rowSelection, selectAll, rowClick, rowSelect, formData, visible, openModal, handleBeforeOk };
  },
});
</script>

<style lang="scss" scoped>
.operation-log {
}
</style>
