export interface SfTableFilterable {
  type: "search" | "checkbox" | "radio" | "range-picker-time" | "range-picker" | "select" | "slot";
  align?: "filter-bar" | "inline-table";
  sort?: number;
  ratio?: number;
  group?: number;
  queryField?: string;
  label?: string;
  filters?: TableFilterData[];
  filter?: (filteredValue: string[], record: TableData) => boolean;
  multiple?: boolean;
  filteredValue?: string[];
  defaultFilteredValue?: string[];
  defaultValue?: string | number | (string | number)[];
  renderContent?: (data: {
    filterValue: string[];
    setFilterValue: (filterValue: string[]) => void;
    handleFilterConfirm: (event: Event) => void;
    handleFilterReset: (event: Event) => void;
  }) => VNodeChild;
  icon?: RenderFunction;
  triggerProps?: TriggerProps;
  alignLeft?: boolean;
  slotName?: string;
}

/**
 * 扩展 TableColumnData 的 filterable 属性
 */
export interface SfTableColumnData {
  dataIndex?: string;
  title: string | RenderFunction;
  width?: number;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
  ellipsis?: boolean;
  tooltip?: boolean | Record<string, any>;
  sortable?: TableSortable;
  filterable?: SfTableFilterable;
  children?: TableColumnData[];
  cellStyle?: CSSProperties;
  headerCellStyle?: CSSProperties;
  bodyCellStyle?: CSSProperties | ((record: TableData) => CSSProperties);
  render?: (data: { record: TableData; column: TableColumnData; rowIndex: number }) => VNodeChild;
  slotName?: string;
  titleSlotName?: string;
  slots?: Slots;
  isLastLeftFixed?: boolean;
  isFirstRightFixed?: boolean;
  colSpan?: number;
  rowSpan?: number;
  index?: number;
}

import { PaginationModel } from "@/api/diagnosis/base";
import { PaginationProps, TableColumnData, TableData, TableFilterData, TableRowSelection, TableSortable, TriggerProps } from "@arco-design/web-vue";
import {
  computed,
  ComputedRef,
  CSSProperties,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  provide,
  Ref,
  ref,
  RenderFunction,
  Slots,
  toRefs,
  VNodeChild,
  watch,
  watchEffect,
} from "vue";
import { sfTableInjectKey } from "./context";
import FilterBar from "./FilterBar";
import Options from "./Options";
import SelectedOptions from "./SelectedOptions";
import Table from "./Table";

export const usePagination = (defaultPagination: Ref<false | PaginationProps>) => {
  const pagination = ref<PaginationProps | false>({
    total: 0,
    current: 1,
    pageSize: 20,
    showPageSize: true,
  });
  if (defaultPagination.value !== false) {
    pagination.value = {
      ...pagination.value,
      ...defaultPagination.value,
    };
  } else {
    pagination.value = false;
  }
  return { pagination };
};
export const useSelect = (
  defaultRowSelection: Ref<false | TableRowSelection>,
  tableData: ComputedRef<TableData[]>,
  emit?: (event: any, ...args: any[]) => void,
) => {
  const isSelectAll = ref(false);
  const isSelected = ref(false);
  const rowSelection = ref<undefined | TableRowSelection>({
    type: "checkbox",
    width: 25,
    onlyCurrent: false,
  });
  if (defaultRowSelection.value !== false) {
    rowSelection.value = {
      ...rowSelection.value,
      ...defaultRowSelection.value,
    };
  } else {
    rowSelection.value = undefined;
  }
  const onSelectAll = (checked: boolean) => {
    if (rowSelection.value !== undefined) {
      isSelectAll.value = checked;
      emit?.("selectAll", checked);
      if (checked) {
        if (rowSelection.value.selectedRowKeys?.length) {
          rowSelection.value.selectedRowKeys.push(...(tableData.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[]));
        } else {
          rowSelection.value.selectedRowKeys = tableData.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[];
        }
      } else {
        rowSelection.value.selectedRowKeys = rowSelection.value.selectedRowKeys?.filter(
          (x) => !(tableData.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[]).some((item) => x === item),
        );
      }
    }
  };
  const onRowSelect = (rowKeys: string[]) => {
    if (rowSelection.value !== undefined) {
      rowSelection.value.selectedRowKeys = rowKeys;
    }
  };
  if (rowSelection.value !== undefined) {
    watch(
      () => (rowSelection.value as TableRowSelection).selectedRowKeys,
      () => {
        if ((rowSelection.value as TableRowSelection).selectedRowKeys && (rowSelection.value as TableRowSelection).selectedRowKeys?.length) {
          isSelected.value = true;
        } else {
          isSelected.value = false;
        }
        emit?.("select", (rowSelection.value as TableRowSelection).selectedRowKeys);
      },
    );
  }
  return {
    rowSelection,
    isSelected,
    onSelectAll,
    onRowSelect,
  };
};
export const useHandlerTableColumns = (_displayColumnKeys: Ref<string[]>, tableColumns: Ref<SfTableColumnData[] | undefined>) => {
  const displayColumnKeys = ref(_displayColumnKeys.value || []);
  watch(_displayColumnKeys, () => {
    displayColumnKeys.value = _displayColumnKeys.value;
  });
  watchEffect(() => {
    if (!_displayColumnKeys.value?.length) {
      if (tableColumns.value) {
        displayColumnKeys.value = tableColumns.value.map((col) => {
          return (col.dataIndex || col.slotName) as string;
        });
      } else {
        displayColumnKeys.value = [];
      }
    }
  });
  const displayTableColumns = computed(() => {
    if (displayColumnKeys.value?.length) {
      return (
        tableColumns.value?.filter((col) => {
          return (displayColumnKeys.value as string[]).some((field) => col.dataIndex === field || col.slotName === field);
        }) || []
      );
    } else {
      return [];
    }
  });
  // const onUpdateDisplayColumns = (cols: string[]) => {
  //   displayColumnsKeys.value = cols;
  // };
  return {
    displayColumnKeys,
    displayTableColumns,
    // onUpdateDisplayColumns,
  };
};
const useLoadData = (
  pagination: Ref<PaginationProps | false>,
  rowSelection: Ref<undefined | TableRowSelection>,
  queryData: Ref<any>,
  rowData: Ref<PaginationModel<any> | undefined>,
  _loadData: (current: number, pageSize: number, queryData: any) => Promise<PaginationModel<any>>,
) => {
  const tableLoading = ref(false);
  const loadData = (showLoading = true) => {
    tableLoading.value = showLoading === true;
    return _loadData(
      pagination.value === false ? 0 : (pagination.value.current as number),
      pagination.value === false ? 0 : (pagination.value.pageSize as number),
      queryData.value,
    )
      .then((res) => {
        pagination.value && (pagination.value.total = res.total);
        rowData.value = res;
        return res;
      })
      .finally(() => {
        tableLoading.value = false;
      });
  };
  if (pagination.value !== false) {
    watch(
      () => (pagination.value as PaginationProps).current as number,
      () => loadData(),
    );
    watch(
      () => (pagination.value as PaginationProps).pageSize as number,
      () => loadData(),
    );
  }
  let delayTimer: number | null = null;
  onMounted(() => {
    loadData();
    watch(
      queryData,
      () => {
        nextTick(() => {
          pagination.value && (pagination.value.current = 1);
          rowSelection.value && (rowSelection.value.selectedRowKeys = []);
          if (delayTimer !== null) {
            clearTimeout(delayTimer);
            delayTimer = null;
          }
          tableLoading.value = true;
          delayTimer = setTimeout(loadData, 500);
        });
      },
      { deep: true },
    );
  });
  return {
    tableLoading,
    loadData,
  };
};

export default defineComponent({
  props: {
    tableColumns: {
      type: Array as PropType<SfTableColumnData[]>,
    },
    displayColumnKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    queryData: {
      type: Object as PropType<any>,
    },
    defaultPagination: {
      type: [Boolean, Object] as PropType<false | PaginationProps>,
      default: () => ({ current: 1, pageSize: 20 }),
    },
    defaultRowSelection: {
      type: [Boolean, Object] as PropType<false | TableRowSelection>,
      default: () => false,
    },
    scroll: {
      type: Object as PropType<{ x?: number; y?: number }>,
    },
    loadData: {
      type: Function as PropType<(current: number, pageSize: number, queryData: any) => Promise<PaginationModel<any>>>,
      required: true,
    },
    formatLoadData: {
      type: Function as PropType<(data: Ref<PaginationModel<any> | undefined>) => ComputedRef<TableData[]>>,
      required: true,
    },
  },
  emits: ["select", "selectAll", "rowClick"],
  setup(props, { emit, slots }) {
    const { defaultPagination, defaultRowSelection, scroll, displayColumnKeys: _displayColumnKeys, queryData, tableColumns } = toRefs(props);
    const rowData = ref<PaginationModel<any>>();
    const tableData = props.formatLoadData(rowData);
    const { pagination } = usePagination(defaultPagination);
    const { rowSelection, isSelected, onSelectAll, onRowSelect } = useSelect(defaultRowSelection, tableData, emit);
    const { displayTableColumns, displayColumnKeys } = useHandlerTableColumns(_displayColumnKeys, tableColumns);
    const { tableLoading, loadData } = useLoadData(pagination, rowSelection, queryData, rowData, props.loadData);
    provide(sfTableInjectKey, {
      tableLoading,
      tableData,
      tableColumns,
      rowSelection,
      scroll,
      displayTableColumns,
      displayColumnKeys,
      queryData,
      pagination,
      isSelected,
      onSelectAll,
      onRowSelect,
      loadData,
    });
    const tableSlots: any = {};
    const filterSlots: any = {};
    watchEffect(() => {
      Object.keys(slots)
        .filter((key) => /^table-/.test(key))
        .forEach((key) => (tableSlots[key] = slots[key]));
      Object.keys(slots)
        .filter((key) => /^filter-/.test(key))
        .forEach((key) => (filterSlots[key] = slots[key]));
    });
    return {
      tableData,
      pagination,
      isSelected,
      rowSelection,
      sfLoadData: loadData,
      theRender: () => (
        <div class="sf-talbe">
          <a-space direction="vertical" fill>
            <FilterBar>{filterSlots}</FilterBar>
            <a-row justify="space-between">
              <SelectedOptions>{{ "selected-options": slots["selected-options"] }}</SelectedOptions>
              <Options
                v-slots={{
                  options: slots["options"],
                  "tools-options": slots["tools-options"],
                }}
              ></Options>
            </a-row>
            <Table onRowClick={(record: TableData) => emit("rowClick", record)}>{tableSlots}</Table>
          </a-space>
        </div>
      ),
    };
  },
  render() {
    return this.theRender();
  },
});
