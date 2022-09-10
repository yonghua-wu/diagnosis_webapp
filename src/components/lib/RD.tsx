import type { TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue/es/table/interface";
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch, watchEffect } from "vue";

/**
 * 表格显示数据、勾选删除数据
 */
export default defineComponent({
  name: "RDComponent",
  props: {
    modelValue: {
      type: Array as PropType<any[]>,
      required: true,
    },
    tableColumn: {
      type: Array as PropType<TableColumnData[]>,
      required: true,
    },
    queryData: {
      type: Object as PropType<any>,
      required: false,
    },
    selectedRowKeys: {
      type: [Array, Boolean] as PropType<string[] | false>,
      required: false,
    },
    decorateLoadData: {
      type: Function as PropType<(queryData: any) => Promise<any>>,
      required: true,
    },
    closePagination: {
      type: Boolean as PropType<boolean>,
      default: () => false,
    },
    closeSelectRow: {
      type: Boolean as PropType<boolean>,
      default: () => false,
    },
    scroll: {
      type: Object as PropType<{ x?: number; y?: number }>,
      default: () => {
        return { x: 1140 };
      },
    },
    tailColumns: {
      type: Object as PropType<boolean | Record<"updatedBy" | "updatedTime" | "operation", boolean>>,
      default: () => {
        return {};
      },
    },
  },
  emits: ["update:modelValue", "update:selectedRowKeys", "update:queryData", "selectAll", "clickRow"],
  setup(props, { emit, slots }) {
    const { modelValue, queryData, closePagination, tailColumns } = toRefs(props);
    const tableData = modelValue;

    const isSelectAll = ref(false);
    const rowSelection = reactive<TableRowSelection>({
      type: "checkbox",
      showCheckedAll: true,
      width: 25,
      selectedRowKeys: props.selectedRowKeys || [],
    });
    const pagination = reactive({
      total: 10,
      current: 1,
      pageSize: 20,
      showPageSize: true,
    });

    // 双向绑定 selectedRowKeys
    watch(
      () => rowSelection.selectedRowKeys,
      () => {
        emit("update:selectedRowKeys", rowSelection.selectedRowKeys);
      },
    );

    const loading = ref(false);
    const cellLoadData = () => {
      loading.value = true;
      let query: any = {};
      if (closePagination.value) {
        query = queryData.value;
      } else {
        query = {
          ...queryData.value,
          current: pagination.current,
          pageSize: pagination.pageSize,
        };
      }
      return props
        .decorateLoadData(query)
        .then((res: any) => {
          if (!closePagination.value) {
            pagination.total = res.total;
          }
          rowSelection.selectedRowKeys = [];
        })
        .finally(() => {
          loading.value = false;
        });
    };
    let delayTimer: number | null = null;
    onMounted(() => {
      cellLoadData();
      watch(
        queryData,
        () => {
          pagination.current = 1;
          if (delayTimer !== null) {
            clearTimeout(delayTimer);
          }
          delayTimer = setTimeout(cellLoadData, 300);
        },
        { deep: true },
      );
    });
    const pageChange = (page: number) => {
      pagination.current = page;
      cellLoadData();
    };
    const pageSizeChange = (pageSize: number) => {
      pagination.pageSize = pageSize;
      cellLoadData();
    };

    const selectAll = (checked: boolean) => {
      isSelectAll.value = checked;
      emit("selectAll", checked);
      if (checked) {
        rowSelection.selectedRowKeys = tableData.value?.map((item) => item.key) as string[];
      } else {
        rowSelection.selectedRowKeys = [];
      }
    };
    const rowSelect = (rowKeys: string[]) => {
      rowSelection.selectedRowKeys = rowKeys;
    };
    const rowClick = (record: TableData) => {
      emit("clickRow", record);
    };

    const tableSlots: any = {};
    watchEffect(() => {
      Object.keys(slots)
        .filter((key) => /^table-/.test(key))
        .forEach((key) => (tableSlots[key] = slots[key]));
    });

    return {
      cellLoadData,
      render: () => (
        <div class="rd">
          <a-space direction="vertical" fill>
            <div class="filter">{slots.filter?.()}</div>
            <a-row justify="space-between">
              <a-space>{slots["selected-options"]?.()}</a-space>
              <a-space>
                <a-button onClick={() => cellLoadData()}>刷新</a-button>
                {slots["normal-options"]?.()}
              </a-space>
            </a-row>
            <a-table
              bordered={false}
              table-layout-fixed={true}
              column-resizable
              filter-icon-align-left={true}
              scroll={props.scroll}
              columns={props.tableColumn}
              data={tableData.value}
              pagination={closePagination.value === true ? undefined : pagination}
              row-selection={props.closeSelectRow === true ? undefined : rowSelection}
              loading={loading.value}
              onSelectAll={selectAll}
              onRowClick={rowClick}
              onSelect={rowSelect}
              onPageChange={pageChange}
              onPageSizeChange={pageSizeChange}
              v-slots={tableSlots}
            ></a-table>
          </a-space>
        </div>
      ),
    };
  },
  methods: {
    loadTableData() {
      return this.cellLoadData();
    },
  },
  render() {
    return this.render();
  },
});
