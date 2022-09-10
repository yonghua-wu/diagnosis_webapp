import { TriggerProps } from "@arco-design/web-vue";
import { TableColumnData, TableData, TableFilterData, TableSortable } from "@arco-design/web-vue/es/table/interface";
import { CSSProperties, RenderFunction, Slots, VNodeChild } from "vue";

interface PaginationData<T> {
  total: number;
  pageSize: number;
  list: T[];
  [name: string]: any;
}

export interface RdTableFilterable {
  type: "search" | "checkbox" | "radio" | "range-picker-time" | "range-picker" | "select" | "user-select" | "staff-select" | "place-select";
  align: "filter-bar" | "inline-table";
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
export interface RdTableColumnData {
  dataIndex?: string;
  title?: string | RenderFunction;
  width?: number;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
  ellipsis?: boolean;
  tooltip?: boolean | Record<string, any>;
  sortable?: TableSortable;
  filterable?: RdTableFilterable;
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

export interface RdInitConfig<T> {
  loadData: (current: number, pageSize: number, queryData: any) => Promise<PaginationData<T>>;
  formatLoadData: (data: T[]) => TableData[] | Promise<TableData[]>;
  formatQueryData: (queryData: any, current: number, pageSize: number) => any;
  queryData: any;
  tableColumns: RdTableColumnData[];
  defaultShowColumn?: TableColumnData["dataIndex"][];
  closePagination: boolean;
  pagination?: { current?: number; pageSize?: number };
  multiSelectDeleteButtom: boolean;
  showCheckedAll: boolean;
  addButtonText: string;
  selectedRowKeys: string[];
  operation?: string[];
  scroll?: {
    x?: number;
    y?: number;
  };
}
