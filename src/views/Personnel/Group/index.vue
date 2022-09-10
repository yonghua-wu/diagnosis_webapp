<template>
  <div class="container group-view">
    <Breadcrumb :items="['人员管理', '用户组']" />
    <a-card>
      <a-row justify="start" align="stretch" :wrap="false">
        <a-col flex="216px" class="group">
          <a-space direction="vertical" fill>
            <a-input-search placeholder="搜索用户组" />
            <GroupList />
          </a-space>
        </a-col>
        <a-col flex="auto" class="employyess">
          <a-space direction="vertical" fill>
            <a-row justify="space-between">
              <a-col flex="240px">
                <a-input-search placeholder="搜索姓名/账号/工号/联系方式" />
              </a-col>
              <a-col flex="auto" style="text-align: right">
                <a-space>
                  <a-button status="danger" v-if="rowSelection.selectedRowKeys.length">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除成员({{ rowSelection.selectedRowKeys.length }})
                  </a-button>
                  <a-button type="primary" @click="joinEmployess">
                    <template #icon>
                      <icon-plus />
                    </template>
                    添加用户组成员
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
              @select="rowSelect"
              @select-all="selectAll"
            />
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <a-modal v-model:visible="visible" title="添加成员" title-align="start" width="800px" @before-ok="handleBeforeOk">
      <!-- <a-form :model="formData" style="width: 360px" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }"> -->
      <a-form-item
        field="name"
        label="搜索用户"
        :row-props="{ gutter: 24 }"
        style="width: 340px"
        :label-col-props="{ span: 8 }"
        :wrapper-col-props="{ span: 16 }"
      >
        <a-trigger class="trigger" trigger="focus" auto-fit-popup-width :blur-to-close="false" :click-outside-to-close="true" :click-to-close="true">
          <a-input-search placeholder="姓名/账号/工号/联系方式" />
          <template #content>
            <a-empty />
          </template>
        </a-trigger>
      </a-form-item>
      <!-- </a-form> -->
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import GroupList from "./components/GroupList.vue";
import { TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue/es/table/interface";

function useModal() {
  const formData = reactive({
    name: "",
  });
  const visible = ref(false);
  const joinEmployess = () => {
    visible.value = true;
  };
  const handleBeforeOk = () => {
    console.log("before ok");
  };
  return {
    formData,
    visible,
    joinEmployess,
    handleBeforeOk,
  };
}

export default defineComponent({
  name: "GroupView",
  components: {
    Breadcrumb,
    GroupList,
  },
  setup() {
    function useTable() {
      const rowSelection = reactive<TableRowSelection>({
        type: "checkbox",
        showCheckedAll: true,
        width: 25,
        selectedRowKeys: [],
      });
      const isSelectAll = ref(false);
      const deletable = ref(false);
      watch(
        () => rowSelection.selectedRowKeys as string[],
        (v: string[]) => {
          if (v.length) {
            deletable.value = true;
          } else {
            deletable.value = false;
          }
        },
      );

      const columns = reactive<TableColumnData[]>([
        {
          title: "姓名",
          dataIndex: "name",
        },
        {
          title: "账号",
          dataIndex: "account",
          ellipsis: true,
tooltip: true,
        },
        {
          title: "联系方式",
          dataIndex: "tel",
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
      const rowSelect = (rowKeys: string[]) => {
        console.log("rowKeys", rowKeys);
        rowSelection.selectedRowKeys = rowKeys;
        isSelectAll.value = false;
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
        deletable,
        rowSelect,
        selectAll,
      };
    }
    const { columns, tableData, rowSelection, deletable, rowSelect, selectAll } = useTable();
    const { formData, visible, joinEmployess, handleBeforeOk } = useModal();
    return {
      formData,
      visible,
      columns,
      tableData,
      rowSelection,
      deletable,
      selectAll,
      rowSelect,
      joinEmployess,
      handleBeforeOk,
    };
  },
});
</script>

<style lang="less" scoped>
.group-view {
  .group {
    padding-right: 16px;
    border-right: 1px solid var(--color-neutral-3);
  }
  .employyess {
    padding-left: 16px;
    // :deep(.arco-table-tr) {
    //   cursor: pointer;
    // }
  }
}
</style>
