import { PaginationModel } from "@/api/tenant/base";
import Message from "@/utils/Message";
import { deepClone } from "@/utils/utils";
import { Modal, PaginationProps, TableData, TableRowSelection } from "@arco-design/web-vue";
import { toRefs } from "@vueuse/core";
import { computed, ComputedRef, defineComponent, onMounted, PropType, reactive, ref, Ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import SfTable, { SfTableColumnData } from "../SfTable";
import "./style.less";

type SfTablePageOperation = "view" | "edit" | "delete";

/**
 * 生成 queryData
 * @param tableColumns 表格列的定义，需要计算属性
 * @param fromRouteQuery 是否同时从 route.query 获取初始数据
 * @returns {
 *   queryData
 * }
 */
export function useQueryData(tableColumns: ComputedRef<SfTableColumnData[]>, fromRouteQuery = true) {
  const queryData = reactive<Record<string, any>>({});
  const route = useRoute();
  const routeQuery = deepClone(route.query);
  watchEffect(() => {
    tableColumns.value.forEach((col) => {
      const field = (col.filterable?.queryField || col.dataIndex || col.slotName) as string;
      const defaultValue = col.filterable?.defaultValue;
      queryData[field] = fromRouteQuery ? routeQuery[field] || defaultValue : defaultValue;
    });
  });
  return {
    queryData,
  };
}

/**
 * 过滤 queryData 中前端定义的默认值
 * @param queryData queryData
 * @returns 过滤默认值后的 queryData
 */
export function useFilterDefaultValueQueryData(queryData: Record<string, any>) {
  const fQueryData = computed(() => {
    const o: Record<string, any> = {};
    Object.keys(queryData).forEach((k) => {
      if (queryData[k] !== "-999" && queryData[k] !== -999 && queryData[k] !== "" && queryData[k] !== null && queryData[k] !== undefined) {
        o[k] = queryData[k];
      }
    });
    return o;
  });
  return {
    fQueryData,
  };
}

/**
 * 添加扩展的数据格式化方法
 * @param formatHandler 自定义请求数据格式化方法，返回的对象需要有data属性
 * @returns 自定义请求数据格式化方法 + 扩展方法
 */
export function useFormatData<T>(formatHandler: (item: T) => TableData) {
  const formatLoadData = (data: Ref<PaginationModel<T[]> | undefined>) => {
    return computed<TableData[]>(() => {
      if (data.value) {
        return data.value?.list?.map(formatHandler).map((item, index) => {
          return {
            createdTime: item.data.createdTime,
            updatedTime: item.data.updatedTime,
            updatedBy: item.data.updatedBy,
            createdBy: item.data.createdBy,
            NO: (((data.value as PaginationModel<T[]>).pageNum || 1) - 1) * ((data.value as PaginationModel<T[]>).pageSize || 0) + index + 1,
            ...item,
          };
        });
      } else {
        return [];
      }
    });
  };
  return {
    formatLoadData,
  };
}

type ExtendColKeys = "NO" | "updatedBy" | "updatedTime" | "createdBy" | "createdTime";
/**
 * 添加扩展的表格列定义
 * @param _tableColumns 自定义表格列定义
 * @param extendColKeys 需要扩展的列，默认 "NO", "updatedBy", "updatedTime"
 * @returns 自定义表格列定义 + 扩展的列
 */
export function useTableColumns(
  _tableColumns: ComputedRef<SfTableColumnData[]>,
  extendColKeys: ExtendColKeys[] = ["NO", "updatedBy", "updatedTime"],
) {
  const byAttr = () => ({
    ellipsis: true,
    tooltip: true,
    width: 100,
    filterable: {
      align: "filter-bar",
      type: "search",
    },
  });
  const timeAttr = () => ({
    ellipsis: true,
    tooltip: true,
    width: 180,
    filterable: {
      sort: 99,
      align: "filter-bar",
      type: "range-picker",
    },
  });
  const tableColumns = computed<SfTableColumnData[]>(() => {
    const cols: SfTableColumnData[] = [];
    if (extendColKeys.some((k) => k === "NO")) {
      cols.push({
        dataIndex: "NO",
        title: "序号",
        width: 70,
        ellipsis: true,
        tooltip: true,
      });
    }
    const tableOperationIndex = _tableColumns.value.findIndex((col) => col.slotName === "table-operation");
    if (tableOperationIndex === -1) {
      cols.push(..._tableColumns.value);
    } else {
      cols.push(..._tableColumns.value.slice(0, tableOperationIndex), ..._tableColumns.value.slice(tableOperationIndex + 1));
    }
    const colMap: Record<string, boolean> = {};
    _tableColumns.value.forEach((col) => {
      colMap[(col.dataIndex || col.slotName) as string] = true;
    });
    if (extendColKeys.some((k) => k === "createdBy") && !colMap["createdBy"]) {
      cols.push({
        title: "创建人",
        dataIndex: "createdBy",
        ...(byAttr() as any),
      });
    }
    if (extendColKeys.some((k) => k === "createdTime") && !colMap["createdTime"]) {
      cols.push({
        title: "创建时间",
        dataIndex: "createdTime",
        ...(timeAttr() as any),
      });
    }
    if (extendColKeys.some((k) => k === "updatedBy") && !colMap["updatedBy"]) {
      cols.push({
        title: "操作人",
        dataIndex: "updatedBy",
        ...(byAttr() as any),
      });
    }
    if (extendColKeys.some((k) => k === "updatedTime") && !colMap["updatedTime"]) {
      cols.push({
        title: "操作时间",
        dataIndex: "updatedTime",
        ...(timeAttr() as any),
      });
    }
    if (tableOperationIndex !== -1) {
      cols.push(_tableColumns.value[tableOperationIndex]);
    }
    return cols;
  });
  return {
    tableColumns,
  };
}

/**
 * 表格工具
 * @param tableColumns 表格列的定义，需要计算属性
 * @param defaultShowColumn 默认显示的列
 * @param _scroll 表格 scroll
 * @returns
 */
export function useTableTools(
  tableColumns: ComputedRef<SfTableColumnData[]>,
  defaultShowColumn: string[] | undefined,
  _scroll: Ref<{ x?: number; y?: number }>,
) {
  // 所有列
  const columnsOptions = computed(() => {
    return tableColumns.value?.map((col) => {
      return {
        label: col.title,
        value: col.dataIndex || col.slotName,
      };
    });
  });
  const route = useRoute();
  // 处理列显隐
  const displayColumnKeys = ref<string[]>(JSON.parse(localStorage.getItem(`CustomDisplayColumns_${route.path}`) || "[]"));
  if (defaultShowColumn?.length) {
    displayColumnKeys.value = deepClone(defaultShowColumn);
  }
  const sumColumnWidth = ref(0);
  const colMap = ref<Record<string, SfTableColumnData>>({});
  watchEffect(() => {
    if (!displayColumnKeys.value.length) {
      displayColumnKeys.value = tableColumns.value.map((col) => col.dataIndex || col.slotName) as string[];
    }
    sumColumnWidth.value = tableColumns.value.map((col) => col.width || 0).reduce((a, b) => a + b, 0);
    colMap.value = {};
    tableColumns.value.forEach((col) => {
      colMap.value[(col.dataIndex || col.slotName) as string] = col;
    });
  });
  onMounted(() => {
    watch(displayColumnKeys, () => {
      localStorage.setItem(`CustomDisplayColumns_${route.path}`, JSON.stringify(displayColumnKeys.value));
    });
  });
  const beenSetColumn = computed(() => {
    // 如果有未显示的列，高亮按钮
    return displayColumnKeys.value.length !== tableColumns.value.length;
  });

  // 处理 scroll 宽度，
  const scroll = computed(() => {
    if (_scroll.value?.x) {
      const existColumnWidth = displayColumnKeys.value
        .map((k) => {
          return colMap.value[k].width || 0;
        })
        .reduce((a, b) => a + b, 0);
      const xDifferenceValue = sumColumnWidth.value - existColumnWidth;
      return {
        x: _scroll.value.x - xDifferenceValue,
        y: _scroll.value?.y,
      };
    } else {
      return {
        x: _scroll.value?.x,
        y: _scroll.value?.y,
      };
    }
  });
  const TableTools = () => (
    <a-trigger trigger="click" unmount-on-close={false}>
      {{
        default: () => (
          <a-tooltip content="表格工具">
            <a-button shape="circle" type={beenSetColumn.value ? "outline" : undefined}>
              <icon-tool />
            </a-button>
          </a-tooltip>
        ),
        content: () => (
          <div style="background-color: var(--color-bg-popup); border: 1px solid var(--color-fill-3);border-radius: var(--border-radius-medium);box-shadow: 0 4px 10px rgb(0 0 0 / 10%); padding: 6px 16px 6px 12px;">
            <a-checkbox-group direction="vertical" v-model={displayColumnKeys.value} options={columnsOptions.value} />
          </div>
        ),
      }}
    </a-trigger>
  );
  return {
    displayColumnKeys,
    scroll,
    TableTools,
  };
}

export default defineComponent({
  props: {
    /**
     * 表格列定义
     */
    tableColumns: {
      type: Array as PropType<SfTableColumnData[]>,
      required: true,
    },
    /**
     * 默认显示的列名 (dataIndex, slotName)
     */
    defaultShowColumn: {
      type: Array as PropType<string[]>,
    },
    /**
     * 筛选条件，具有全局响应性
     */
    queryData: {
      type: Object as PropType<any>,
    },
    /**
     * 默认分页，传入 false 不启用分页
     */
    defaultPagination: {
      type: [Boolean, Object] as PropType<false | PaginationProps>,
      default: () => ({ current: 1, pageSize: 20 }),
    },
    /**
     * 默认行选择配置，传入 false 不启用行选择
     */
    defaultRowSelection: {
      type: [Boolean, Object] as PropType<false | TableRowSelection>,
      default: () => false,
    },
    /**
     * scorll，表格最小宽高，小于这个值会显示滚动条，默认 x: 1400
     */
    scroll: {
      type: Object as PropType<{ x?: number; y?: number }>,
      default: () => ({
        x: 1400,
      }),
    },
    /**
     * 行操作，有 view edit delete 这三项操作；或者自定义，名称需要与slot命名相同
     */
    operation: {
      type: Array as PropType<SfTablePageOperation[] | string[]>,
      default: () => ["view", "edit", "delete"],
    },
    /**
     * 加载数据方法
     */
    loadData: {
      type: Function as PropType<(current: number, pageSize: number, queryData: any) => Promise<PaginationModel<any[]>>>,
      required: true,
    },
    /**
     * 格式化数据方法，返回值必须是计算属性
     */
    formatLoadData: {
      type: Function as PropType<(data: Ref<PaginationModel<any[]> | undefined>) => ComputedRef<TableData[]>>,
      required: true,
    },
    /**
     * 同步查询参数到 route
     */
    asyncToRouteQuery: {
      type: Boolean as PropType<boolean>,
      default: () => true,
    },
    /**
     * 行选择的删除方法，传入 false 不启用选择删除
     */
    del: {
      type: [Function, Boolean] as PropType<false | ((keys: string[]) => Promise<any>)>,
      default: () => false,
    },
    /**
     * operation 中 view 的方法
     */
    rowView: {
      type: [Function, Boolean] as PropType<boolean | ((record: TableData) => void)>,
      default: () => true,
    },
    /**
     * operation 中 edit 的方法
     */
    rowEdit: {
      type: [Function, Boolean] as PropType<boolean | ((record: TableData) => void)>,
      default: () => true,
    },
    /**
     * operation 中 delete 的方法
     */
    rowDelete: {
      type: [Function, Boolean] as PropType<boolean | ((id: string) => Promise<any>)>,
      default: () => true,
    },
    /**
     * 点击行的方法
     */
    rowClick: {
      type: [Function, Boolean] as PropType<boolean | ((record: TableData) => void)>,
      default: () => true,
    },
    /**
     * 点击添加按钮的方法，传入false不启用该按钮
     */
    clickAdd: {
      type: [Function, Boolean] as PropType<boolean | (() => void)>,
      default: () => true,
    },
    /**
     * 添加按钮文案
     */
    addText: {
      type: String as PropType<string>,
      default: () => "添加",
    },
  },
  setup(props, { slots, emit }) {
    const _refSfTable = ref();
    const isSelected = computed(() => {
      return _refSfTable.value?.isSelected;
    });

    // 处理 table-operation
    const tableColumns = computed(() => {
      const cols: SfTableColumnData[] = [...props.tableColumns];
      // table-operation
      const index = props.tableColumns.findIndex((item) => item.slotName === "table-operation");
      if (index !== -1 && props.operation?.length) {
        // cols.push(props.tableColumns[index]);
      } else if (props.operation?.length) {
        cols.push({
          title: "操作",
          slotName: "table-operation",
          width: 62 * props.operation.length + 32,
        });
      }
      return cols;
    });

    const { scroll: _scroll } = toRefs(props);
    const { displayColumnKeys, scroll, TableTools } = useTableTools(tableColumns, props.defaultShowColumn, _scroll);

    const router = useRouter();
    const route = useRoute();
    // 处理 route.query
    const { fQueryData } = useFilterDefaultValueQueryData(props.queryData);
    const loadData = (current: number, pageSize: number, queryData: any) => {
      if (props.asyncToRouteQuery) {
        const routeQuery = { current, pageSize, ...fQueryData.value };
        router.replace({ query: routeQuery });
      }
      return props.loadData(current, pageSize, queryData);
    };
    const pagination = ref<false | PaginationProps>(false);
    if (props.defaultPagination !== false) {
      pagination.value = {
        ...props.defaultPagination,
        current: route.query?.current ? Number(route.query.current) : 1,
        pageSize: route.query?.pageSize ? Number(route.query.pageSize) : 20,
      };
    }
    // => Promise<PaginationModel<any[]>

    // 多选
    const rowSelection = ref<false | TableRowSelection>({
      type: "checkbox",
      showCheckedAll: true,
      width: 25,
      selectedRowKeys: [],
      onlyCurrent: false,
    });
    if (props.defaultRowSelection !== false) {
      rowSelection.value = {
        ...rowSelection.value,
        ...props.defaultRowSelection,
      };
    } else {
      rowSelection.value = false;
    }
    const onSelect = (keys: string[]) => {
      if (rowSelection.value !== false) {
        rowSelection.value.selectedRowKeys = keys;
        emit("select", keys);
      }
    };

    const deleteModal = () => {
      return new Promise((resolve, reject) => {
        Modal.warning({
          title: "删除",
          content: "确定删除吗？",
          closable: true,
          cancelText: "取消",
          hideCancel: false,
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            reject(false);
          },
        });
      });
    };
    const onDelete = () => {
      if (props.del && rowSelection.value && rowSelection.value.selectedRowKeys?.length) {
        deleteModal()
          .then(() => {
            const close = Message.delayLoading("删除中...", 1000);
            props.del &&
              props.del((rowSelection.value as TableRowSelection).selectedRowKeys as string[]).finally(() => {
                if (_refSfTable.value) {
                  _refSfTable.value.sfLoadData();
                  _refSfTable.value.rowSelection.selectedrowKeys = [];
                }
                close();
              });
            emit("delete", (rowSelection.value as TableRowSelection).selectedRowKeys as string[]);
          })
          .catch(() => {
            //
          });
      }
    };

    const onRowView = (record: TableData) => {
      if (typeof props.rowView === "function") {
        props.rowView(record);
      } else {
        router.push({ name: (route.name as string) + "Detail", params: { model: "View", id: record.key } });
      }
    };
    const onRowEdit = (record: TableData) => {
      if (typeof props.rowEdit === "function") {
        props.rowEdit(record);
      } else {
        router.push({ name: (route.name as string) + "Detail", params: { model: "Edit", id: record.key } });
      }
    };
    const onRowDelete = (record: TableData) => {
      return deleteModal().then(() => {
        if (record?.key) {
          if (typeof props.rowDelete === "function") {
            const close = Message.delayLoading("删除中...", 1000);
            return props
              .rowDelete?.(record.key)
              .then(() => {
                _refSfTable.value.sfLoadData();
                _refSfTable.value.rowSelection.selectedrowKeys = [];
              })
              .finally(() => {
                close();
              });
          }
        }
      });
    };
    const onRowClick = (record: TableData) => {
      if (typeof props.rowClick === "function") {
        props.rowClick(record);
      } else if (props.rowClick !== false) {
        router.push({ name: (route.name as string) + "Detail", params: { model: "View", id: record.key } });
        // console.log("onRowClick", record.key);
      }
    };
    const clickAdd = () => {
      if (typeof props.clickAdd === "function") {
        props.clickAdd();
      } else {
        router.push({ name: (route.name as string) + "Detail", params: { model: "Add" } });
        // console.log("clickAdd");
      }
    };

    const operationSlot = ({ record }: any) => {
      return (
        <>
          {props.operation?.some((item) => item === "view") ? (
            <a-link style="padding: 4px 8px;" onClick={() => onRowView(record)}>
              {{
                default: () => <>详情</>,
                icon: () => <icon-eye />,
              }}
            </a-link>
          ) : null}
          {props.operation?.some((item) => item === "edit") ? (
            <a-link style="padding: 4px 8px;" onClick={() => onRowEdit(record)}>
              {{
                default: () => <>编辑</>,
                icon: () => <icon-edit />,
              }}
            </a-link>
          ) : null}
          {props.operation?.some((item) => item === "delete") ? (
            <a-link style="padding: 4px 8px;" status="danger" onClick={() => onRowDelete(record)}>
              {{
                default: () => <>删除</>,
                icon: () => <icon-delete />,
              }}
            </a-link>
          ) : null}
          {props.operation
            ?.filter((o) => o !== "view" && o !== "edit" && o !== "delete")
            .map((o) => slots[o]?.({ record: record, defaultAttr: { style: "padding: 4px 8px;" } }))}
        </>
      );
    };

    return {
      reLoadData: () => {
        return _refSfTable.value?.sfLoadData();
      },
      theRender: () => (
        <div class="sf-table-page container">
          {slots["breadcrumb"]?.()}
          <a-card>
            <SfTable
              class="sf-table"
              ref={_refSfTable}
              tableColumns={tableColumns.value}
              displayColumnKeys={displayColumnKeys.value}
              queryData={props.queryData}
              defaultPagination={pagination.value}
              defaultRowSelection={rowSelection.value}
              scroll={scroll.value}
              loadData={loadData}
              formatLoadData={props.formatLoadData}
              onSelect={onSelect}
              onRowClick={onRowClick}
            >
              {{
                ...slots,
                "selected-options": () => (
                  <span>
                    {props.del && (
                      <a-tooltip content="删除">
                        <a-button status="danger" onClick={onDelete} disabled={isSelected.value === false}>
                          {{
                            icon: () => <icon-delete />,
                          }}
                        </a-button>
                      </a-tooltip>
                    )}
                    {slots["selected-options"]?.()}
                  </span>
                ),
                options: () => (
                  <span>
                    {slots["options"]?.()}
                    {props.clickAdd !== false && (
                      <a-button type="primary" onClick={clickAdd}>
                        {{
                          default: () => props.addText,
                          icon: () => <icon-plus />,
                        }}
                      </a-button>
                    )}
                  </span>
                ),
                // "tools-options": () => (
                //   <>
                //     {slots["tools-options"]?.()}
                //     <TableTools />
                //   </>
                // ),
                "tools-options": () =>
                  slots["tools-options"] ? (
                    <>
                      {slots["tools-options"]?.()}
                      <TableTools />
                    </>
                  ) : (
                    <TableTools />
                  ),
                "table-operation": operationSlot,
              }}
            </SfTable>
          </a-card>
        </div>
      ),
    };
  },
  render() {
    return this.theRender();
  },
});
