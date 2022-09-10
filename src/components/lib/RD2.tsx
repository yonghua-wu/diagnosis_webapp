import { TableChangeExtra, TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue/es/table/interface";
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch, watchEffect } from "vue";

export default defineComponent({
  name: "rd-2",
  props: {
    /**
     * table 数据
     */
    data: {
      type: Array as PropType<TableData[]>,
      required: true,
    },
    /**
     * table 字段
     */
    tableColumn: {
      type: Array as PropType<TableColumnData[]>,
      required: true,
    },
    /**
     * 默认显示字段
     */
    defaultShowColumn: {
      type: Array as PropType<string[]>,
      // required: true,
    },
    queryData: {
      type: Object as PropType<any>,
      required: true,
    },
    /**
     * 已选择的行
     */
    selectedRowKeys: {
      type: [Array, Boolean] as PropType<string[] | false>,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: () => false,
    },
    /**
     * 加载数据的方法
     */
    decorateLoadData: {
      type: Function as PropType<(queryData: any) => Promise<any>>,
      required: true,
    },
    /**
     * 关闭分页
     */
    closePagination: {
      type: Boolean as PropType<boolean>,
      default: () => false,
    },
    closeDelete: {
      type: Boolean as PropType<boolean>,
      default: () => false,
    },
    showCheckedAll: {
      type: Boolean as PropType<boolean>,
      default: () => true,
    },
    /**
     * 出现滚动条规则
     */
    scroll: {
      type: Object as PropType<{ x?: number; y?: number }>,
      default: () => {
        return { x: 1140 };
      },
    },
    /**
     * 添加按钮文本，留空不显示
     */
    addButtonText: {
      type: String as PropType<string>,
      default: () => {
        return "添加";
      },
    },
  },
  emits: [
    "update:modelValue",
    "update:selectedRowKeys",
    "update:queryData",
    "selectAll",
    "click-row",
    "row-delete",
    "row-view",
    "row-edit",
    "click-add",
    "selected-delete",
  ],
  setup(props, { emit, slots }) {
    const { data, queryData, closePagination, tableColumn } = toRefs(props);
    const loading = ref(false);

    const isSelectAll = ref(false);
    const isSelected = ref(false);
    const rowSelection = reactive<TableRowSelection>({
      type: "checkbox",
      showCheckedAll: props.showCheckedAll,
      width: 25,
      selectedRowKeys: props.selectedRowKeys || [],
    });
    const selectAll = (checked: boolean) => {
      isSelectAll.value = checked;
      emit("selectAll", checked);
      if (checked) {
        rowSelection.selectedRowKeys = data.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[];
      } else {
        rowSelection.selectedRowKeys = rowSelection.selectedRowKeys?.filter(
          (x) => !(data.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[]).some((item) => x === item),
        );
      }
    };
    const rowSelect = (rowKeys: string[]) => {
      rowSelection.selectedRowKeys = rowKeys;
    };
    watch(
      () => rowSelection.selectedRowKeys,
      () => {
        if (rowSelection.selectedRowKeys && rowSelection.selectedRowKeys?.length > 0) {
          isSelected.value = true;
        } else {
          isSelected.value = false;
        }
        emit("update:selectedRowKeys", rowSelection.selectedRowKeys);
      },
    );
    watch(
      () => props.selectedRowKeys,
      () => {
        if (props.selectedRowKeys) {
          rowSelection.selectedRowKeys = props.selectedRowKeys;
        }
      },
    );

    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: 20,
      showPageSize: true,
    });
    queryData.value.current = pagination.current;
    queryData.value.pageSize = pagination.pageSize;
    const pageChange = (page: number) => {
      pagination.current = page;
      loadData();
    };
    const pageSizeChange = (pageSize: number) => {
      pagination.pageSize = pageSize;
      loadData();
    };

    const loadData = () => {
      loading.value = true;
      return props
        .decorateLoadData({
          ...queryData.value,
          current: pagination.current,
          pageSize: pagination.pageSize,
        })
        .then((res) => {
          pagination.total = res.total;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    let delayTimer: number | null = null;
    onMounted(() => {
      loadData();
      watch(
        queryData,
        () => {
          pagination.current = 1;
          rowSelection.selectedRowKeys = [];
          if (delayTimer !== null) {
            clearTimeout(delayTimer);
          }
          delayTimer = setTimeout(loadData, 300);
        },
        { deep: true },
      );
    });

    const change = (data: any, changeInfo: TableChangeExtra) => {
      console.log(changeInfo);
      switch (changeInfo.type) {
        case "filter":
          emit("update:queryData", {
            ...queryData.value,
            filters: changeInfo.filters || undefined,
          });
          loadData();
          break;
        case "sorter":
          emit("update:queryData", {
            ...queryData.value,
            sorter: changeInfo.sorter || undefined,
          });
          loadData();
          break;
        default:
          break;
      }
    };
    const tableSlots: any = {};
    watchEffect(() => {
      Object.keys(slots)
        .filter((key) => /^table-/.test(key))
        .forEach((key) => (tableSlots[key] = slots[key]));
    });
    const selfTableColumn = computed(() => {
      return [
        {
          title: "序号",
          dataIndex: "NO",
          width: 70,
          ellipsis: true,
          tooltip: true,
        },
        ...tableColumn.value,
      ];
    });
    const tableData = computed(() => {
      return data.value.map((item, index) => {
        return {
          NO: (pagination.current - 1) * pagination.pageSize + index + 1,
          ...item,
        };
      });
    });
    return {
      loadTableData: loadData,
      render: () => (
        <div class="rd">
          <a-space direction="vertical" fill>
            <div class="filter">{slots.filter?.()}</div>
            <a-row justify="space-between">
              <a-space>
                {slots["selected-options"]?.()}
                {props.closeDelete === true ? (
                  <></>
                ) : (
                  <a-tooltip content="删除">
                    <a-button status="danger" onClick={() => emit("selected-delete")} disabled={!isSelected.value}>
                      {{
                        icon: () => <icon-delete />,
                      }}
                    </a-button>
                  </a-tooltip>
                )}
                {isSelected.value ? (
                  <a-tag size="large" closable onClose={() => (rowSelection.selectedRowKeys = [])}>
                    已选择 {rowSelection.selectedRowKeys?.length} 条数据
                  </a-tag>
                ) : (
                  <></>
                )}
              </a-space>

              <a-space>
                <a-tooltip content="刷新">
                  <a-button shape="circle" onClick={() => loadData()}>
                    <icon-sync />
                  </a-button>
                </a-tooltip>
                {/* <a-trigger trigger="click" unmount-on-close={false}>
                  {{
                    default: () => (
                      <a-tooltip content="表格工具">
                        <a-button shape="circle">
                          <icon-tool />
                        </a-button>
                      </a-tooltip>
                    ),
                    content: () => (
                      <div class="demo-basic">
                        <a-empty />
                      </div>
                    ),
                  }}
                </a-trigger> */}
                {/* <a-input-search placeholder="搜索"></a-input-search> */}
                {slots["normal-options"]?.()}
                {props.addButtonText === "" ? (
                  <></>
                ) : (
                  <a-button type="primary" onClick={() => emit("click-add")}>
                    {props.addButtonText}
                  </a-button>
                )}
              </a-space>
            </a-row>
            <a-table
              bordered={{
                headerCell: true,
                wrapper: false,
              }}
              table-layout-fixed={true}
              filter-icon-align-left={true}
              scroll={props.scroll}
              columns={selfTableColumn.value}
              data={tableData.value}
              pagination={closePagination.value === true ? false : pagination}
              row-selection={props.selectedRowKeys === false ? false : rowSelection}
              loading={loading.value}
              onSelectAll={selectAll}
              onRowClick={(record: TableData) => emit("click-row", record)}
              onSelect={rowSelect}
              onPageChange={pageChange}
              onPageSizeChange={pageSizeChange}
              v-slots={{
                ...tableSlots,
                operation: ({ record }: any) => (
                  <>
                    {/* <a-tooltip content="详情"> */}
                    <a-button type="text" size="small" onClick={() => emit("row-view", record)}>
                      {{
                        default: () => <>详情</>,
                        icon: () => <icon-eye />,
                      }}
                    </a-button>
                    {/* </a-tooltip> */}
                    {/* <a-tooltip content="编辑">
                      <a-button type="text" size="small" onClick={() => emit("row-edit", record)}>
                        {{
                          default: () => <icon-edit />,
                        }}
                      </a-button>
                    </a-tooltip>
                    <a-tooltip content="删除">
                      <a-button status="danger" type="text" size="small" onClick={() => emit("row-delete", record)}>
                        {{
                          default: () => <icon-delete />,
                        }}
                      </a-button>
                    </a-tooltip> */}
                  </>
                ),
              }}
            ></a-table>
          </a-space>
        </div>
      ),
    };
  },
  render() {
    return this.render();
  },
});
