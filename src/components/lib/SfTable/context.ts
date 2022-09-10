import { PaginationModel } from "@/api/tenant/base";
import { PaginationProps, TableData, TableRowSelection } from "@arco-design/web-vue";
import { ComputedRef, InjectionKey, Ref } from "vue";
import { SfTableColumnData } from ".";

export interface SfTableContext {
  tableData: Ref<TableData[]>;
  tableLoading: Ref<Boolean>;
  rowSelection: Ref<undefined | TableRowSelection>;
  tableColumns: Ref<SfTableColumnData[] | undefined>;
  scroll: Ref<{ x?: number; y?: number } | undefined>;
  queryData: Ref<Record<string, any> | undefined>;
  pagination: Ref<false | PaginationProps | undefined>;
  displayColumnKeys: Ref<string[]>;
  displayTableColumns: ComputedRef<SfTableColumnData[]>;
  isSelected: Ref<boolean>;
  onSelectAll: (checked: boolean) => void;
  onRowSelect: (rowKeys: string[]) => void;
  loadData: (showLoading?: boolean) => Promise<PaginationModel<TableData[]>>;
}

export const sfTableInjectKey: InjectionKey<SfTableContext> = Symbol("sfTableInjectKey");
