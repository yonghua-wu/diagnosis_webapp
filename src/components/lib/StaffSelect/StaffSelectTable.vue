<template>
  <div class="staff-select-table">
    <a-form :model="queryData" layout="inline">
      <a-form-item field="name" label="姓名">
        <a-input style="width: 170px" v-model="queryData.name" placeholder="搜索" allow-clear></a-input>
      </a-form-item>
      <a-form-item field="empNo" label="工号">
        <a-input style="width: 170px" v-model="queryData.empNo" placeholder="搜索" allow-clear></a-input>
      </a-form-item>
      <a-form-item field="phone" label="联系方式">
        <a-input style="width: 170px" v-model="queryData.phone" placeholder="搜索" allow-clear></a-input>
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
import Staff, { StaffModel } from "@/api/tenant/Staff";
import { CRAFT_MAP } from "@/hooks/dict";
import { useAppStore } from "@/store";
import { debounce } from "@/utils/utils";
import { PaginationProps, TableColumnData, TableRowSelection } from "@arco-design/web-vue";
import { computed, defineComponent, inject, PropType, reactive, Ref, ref, watch } from "vue";
const tableColumns: TableColumnData[] = [
  {
    title: "姓名",
    dataIndex: "name",
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
    dataIndex: "phone",
    width: 140,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "职称",
    dataIndex: "title",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "业务",
    dataIndex: "serviceClassName",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "角色",
    dataIndex: "craftName",
    ellipsis: true,
    tooltip: true,
  },
];
export default defineComponent({
  name: "staff-select-table",
  props: {
    multiSelect: {
      type: Boolean,
      default: () => false,
    },
    defaultQueryData: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
    disabledIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const pagination = reactive<PaginationProps>({
      total: 0,
      current: 1,
      pageSize: 10,
      showPageSize: false,
    });
    const selectedStaffList = inject<Ref<any[]>>("selectedStaffList");
    const rowSelection = reactive<TableRowSelection>({
      selectedRowKeys: selectedStaffList?.value ? [...selectedStaffList.value.map((item) => item.staffId)] : [],
      type: props.multiSelect ? "checkbox" : "radio",
      showCheckedAll: true,
      onlyCurrent: false,
    });
    const queryData = reactive<any>({});
    const tableData = ref<StaffModel[]>([]);
    const staffMap = reactive<any>({});
    selectedStaffList &&
      watch(selectedStaffList, () => {
        rowSelection.selectedRowKeys = selectedStaffList.value.map((item) => item.staffId);
      });

    const loading = ref(false);
    const loadData = () => {
      loading.value = true;
      const q = {
        state: 1,
        ...queryData,
        ...props.defaultQueryData,
      };
      return Staff.page(pagination.current as number, pagination.pageSize as number, q)
        .then((res) => {
          tableData.value = res.list.map((item) => {
            staffMap[item.staffId] = item;
            return {
              disabled: props.disabledIds.some((v) => v === item.staffId),
              key: item.staffId,
              serviceClassName: serviceClassMap.value[item.serviceClass]?.label || "",
              craftName: CRAFT_MAP[item.craft as keyof typeof CRAFT_MAP],
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
      if (!record.disabled) {
        const index = rowSelection.selectedRowKeys?.indexOf(record.key);
        refTable.value?.select(record.key, index === -1);
      }
    };
    const onSelect = (rowKeys: string[]) => {
      selectedStaffList && (selectedStaffList.value = rowKeys.map((key) => staffMap[key]));
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
.staff-select-table {
  height: 540px;
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
