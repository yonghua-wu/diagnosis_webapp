<template>
  <div class="user-select-table">
    <a-form :model="queryData" layout="inline">
      <a-form-item field="realName" label="姓名">
        <a-input style="width: 170px" v-model="queryData.realName" placeholder="搜索" allow-clear></a-input>
      </a-form-item>
      <a-form-item field="empNo" label="工号">
        <a-input style="width: 170px" v-model="queryData.empNo" placeholder="搜索" allow-clear></a-input>
      </a-form-item>
      <a-form-item field="userPhone" label="联系方式">
        <a-input style="width: 170px" v-model="queryData.userPhone" placeholder="搜索" allow-clear></a-input>
      </a-form-item>
    </a-form>
    <a-table
      ref="refTable"
      :columns="tableColumns"
      :data="tableData"
      :row-selection="rowSelection"
      :pagination="pagination"
      :loading="loading"
      @page-change="pageChange"
      @row-click="rowClick"
      @selection-change="onSelect"
    ></a-table>
  </div>
</template>

<script lang="ts">
import User, { UserModel } from "@/api/tenant/User";
import { debounce } from "@/utils/utils";
import { PaginationProps, TableColumnData, TableRowSelection } from "@arco-design/web-vue";
import { defineComponent, inject, PropType, reactive, Ref, ref, watch } from "vue";
const tableColumns: TableColumnData[] = [
  {
    title: "姓名",
    dataIndex: "realName",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "账号",
    dataIndex: "username",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "工号",
    dataIndex: "empNo",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "联系方式",
    dataIndex: "userPhone",
    width: 140,
    ellipsis: true,
    tooltip: true,
  },
];
export default defineComponent({
  name: "user-select-table",
  props: {
    multiSelect: {
      type: Boolean,
      default: () => false,
    },
    defaultQueryData: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  },
  setup(props) {
    const pagination = reactive<PaginationProps>({
      total: 0,
      current: 1,
      pageSize: 10,
      showPageSize: false,
    });
    const selectedUserList = inject<Ref<any[]>>("selectedUserList");
    const rowSelection = reactive<TableRowSelection>({
      selectedRowKeys: selectedUserList?.value ? [...selectedUserList.value.map((item) => item.userId)] : [],
      type: props.multiSelect ? "checkbox" : "radio",
      showCheckedAll: true,
      onlyCurrent: false,
    });
    const queryData = reactive<any>({});
    const tableData = ref<UserModel[]>([]);
    const userMap = reactive<any>({});
    selectedUserList &&
      watch(selectedUserList, () => {
        rowSelection.selectedRowKeys = selectedUserList.value.map((item) => item.userId);
      });

    const loading = ref(false);
    const loadData = () => {
      loading.value = true;
      const q = {
        status: 1,
        ...queryData,
        ...props.defaultQueryData,
      };
      return User.page(pagination.current as number, pagination.pageSize as number, q)
        .then((res) => {
          tableData.value = res.list.map((item) => {
            userMap[item.userId] = item;
            return {
              key: item.userId,
              ...item,
            };
          });
          pagination.total = res.total;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    loadData();
    watch(
      () => pagination.current,
      () => loadData(),
    );
    watch(
      () => pagination.pageSize,
      () => loadData(),
    );
    const todo = debounce();
    watch(queryData, () => {
      loading.value = true;
      todo(() => {
        if (pagination.current === 1) {
          loadData();
        } else {
          pagination.current = 1;
        }
      }, 500);
    });
    const pageChange = (page: number) => {
      pagination.current = page;
    };
    const pageSizeChange = (pageSize: number) => {
      pagination.pageSize = pageSize;
    };
    const refTable = ref();
    const rowClick = (record: any) => {
      const index = rowSelection.selectedRowKeys?.indexOf(record.key);
      refTable.value?.select(record.key, index === -1);
    };
    const onSelect = (rowKeys: string[]) => {
      selectedUserList && (selectedUserList.value = rowKeys.map((key) => userMap[key]));
    };
    return {
      refTable,
      tableData,
      tableColumns,
      rowSelection,
      pagination,
      loading,
      queryData,
      rowClick,
      onSelect,
      pageChange,
      pageSizeChange,
    };
  },
});
</script>

<style lang="less" scoped>
.user-select-table {
  height: 540px;
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
