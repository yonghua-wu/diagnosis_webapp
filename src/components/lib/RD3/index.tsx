import { deepClone } from "@/utils/utils";
import { PaginationProps } from "@arco-design/web-vue";
import { IconSearch } from "@arco-design/web-vue/es/icon";
import { TableColumnData, TableData, TableFilterable, TableRowSelection } from "@arco-design/web-vue/es/table/interface";
import { computed, defineComponent, h, nextTick, onMounted, reactive, Ref, ref, Slots, watch, watchEffect, WatchStopHandle } from "vue";

import UserSelect from "../UserSelect/index.vue";
import StaffSelect from "../StaffSelect/index.vue";
import PlaceSelect from "../PlaceSelect/index.vue";

import "./style.less";
import { RdInitConfig, RdTableColumnData, RdTableFilterable } from "./interface";

export default function <T>(initConfig: RdInitConfig<T>) {
  const useSelect = (emit: any, tableData: Ref<TableData[]>) => {
    const isSelectAll = ref(false);
    const isSelected = ref(false);
    const rowSelection = reactive<TableRowSelection>({
      type: "checkbox",
      showCheckedAll: initConfig.showCheckedAll,
      width: 25,
      selectedRowKeys: deepClone(initConfig.selectedRowKeys),
      onlyCurrent: false,
    });
    const selectAll = (checked: boolean) => {
      isSelectAll.value = checked;
      emit("selectAll", checked);
      if (checked) {
        if (rowSelection.selectedRowKeys?.length) {
          rowSelection.selectedRowKeys.push(...(tableData.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[]));
        } else {
          rowSelection.selectedRowKeys = tableData.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[];
        }
      } else {
        rowSelection.selectedRowKeys = rowSelection.selectedRowKeys?.filter(
          (x) => !(tableData.value?.filter((item) => item.disabled !== true).map((item) => item.key) as string[]).some((item) => x === item),
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
        emit("updateSelectedRowKeys", rowSelection.selectedRowKeys);
      },
    );
    return {
      rowSelection,
      isSelected,
      selectAll,
      rowSelect,
    };
  };
  const usePagination = () => {
    const pagination = reactive({
      total: 0,
      current: initConfig.pagination?.current || 1,
      pageSize: initConfig.pagination?.pageSize || 20,
      showPageSize: true,
    });
    const pageChange = (page: number) => {
      pagination.current = page;
    };
    const pageSizeChange = (pageSize: number) => {
      pagination.pageSize = pageSize;
    };
    return {
      pagination,
      pageChange,
      pageSizeChange,
    };
  };
  const useLoadData = (pagination: PaginationProps, rowSelection: TableRowSelection, tableData: Ref<TableData[]>) => {
    const tableLoading = ref(false);
    const loadData = (showLoading = true) => {
      tableLoading.value = showLoading === true;
      const query = initConfig.formatQueryData(initConfig.queryData, pagination.current as number, pagination.pageSize as number);
      return initConfig
        .loadData(pagination.current as number, pagination.pageSize as number, query)
        .then((res) => {
          pagination.total = res.total;
          const formatRes = initConfig.formatLoadData(res.list);
          if (formatRes instanceof Promise) {
            return formatRes;
          } else {
            return Promise.resolve(formatRes);
          }
        })
        .then((res) => {
          tableData.value = res;
          tableData.value.forEach((item, index) => {
            item["NO"] = ((pagination.current || 1) - 1) * (pagination.pageSize || 0) + index + 1;
          });
        })
        .finally(() => {
          tableLoading.value = false;
        });
    };
    let delayTimer: number | null = null;
    onMounted(() => {
      loadData();
      watch(
        initConfig.queryData,
        () => {
          pagination.current = 1;
          rowSelection.selectedRowKeys = [];
          if (delayTimer !== null) {
            clearTimeout(delayTimer);
          }
          tableLoading.value = true;
          delayTimer = setTimeout(loadData, 300);
        },
        { deep: true },
      );
    });
    watch(
      () => pagination.current,
      () => loadData(),
    );
    watch(
      () => pagination.pageSize,
      () => loadData(),
    );
    return {
      tableLoading,
      loadData,
    };
  };
  const useTableColumnTools = (emit: any, slots: Slots) => {
    const tableFilterSlots = {
      "table-filter-range-picker": ({ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }: any) => (
        <a-space direction="vertical">
          <a-range-picker hide-trigger picker-value={filterValue[0]} onChange={(value: string[]) => setFilterValue([value])} />
          <div class="custom-filter-footer">
            <a-button onClick={handleFilterConfirm}>Confirm</a-button>
            <a-button onClick={handleFilterReset}>Reset</a-button>
          </div>
        </a-space>
      ),
      "table-filter-range-picker-time": ({ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }: any) => (
        <a-space direction="vertical">
          <a-range-picker
            showTime
            hide-trigger
            showConfirmBtn={false}
            picker-value={filterValue[0]}
            onChange={(value: string[]) => setFilterValue([value])}
          ></a-range-picker>
          <div class="custom-filter-footer">
            <a-button onClick={handleFilterConfirm}>Confirm</a-button>
            <a-button onClick={handleFilterReset}>Reset</a-button>
          </div>
        </a-space>
      ),
      "table-filter-search": ({ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }: any) => (
        <a-space direction="vertical">
          <a-input model-value={filterValue[0]} onInput={(value: string) => setFilterValue([value])} />
          <div class="custom-filter-footer">
            <a-button onClick={handleFilterConfirm}>Confirm</a-button>
            <a-button onClick={handleFilterReset}>Reset</a-button>
          </div>
        </a-space>
      ),
    };
    const columnsOptions = initConfig.tableColumns
      // .filter((item) => item.slotName !== "table-operation")
      .map((item) => {
        return {
          value: item.dataIndex || item.slotName,
          label: item.title,
        };
      });

    // const Temp = slots.filter?.({ formItemDefaultAttr: { "label-col-style": { "min-width": "100px" } } });
    // Temp?.forEach(
    //   (item) =>
    //     (item.props = {
    //       ...item.props,
    //       style: { "background-color": "#c00" },
    //     }),
    // );
    // console.log(Temp);
    const changedQueryData = computed(() => {
      return filterBarList.value
        .map((item) => {
          const fieldName = item.filterable?.queryField || item.dataIndex || item.slotName;
          if (fieldName) {
            if (initConfig.queryData[fieldName]) {
              if (initConfig.queryData[fieldName] !== item.filterable?.defaultValue) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
        .reduce((a, b) => a || b, false);
    });
    const resetFilter = () => {
      filterBarList.value.forEach((item) => {
        const fieldName = item.filterable?.queryField || item.dataIndex || item.slotName;
        if (fieldName) {
          initConfig.queryData[fieldName] = item.filterable?.defaultValue || undefined;
        }
      });
    };
    const filterBarList = ref<RdTableColumnData[]>([]);
    const filterBarRowList = ref<(() => JSX.Element)[][]>([[], []]);
    watch(
      filterBarList,
      () => {
        console.log("filterBarList");
        filterBarRowList.value = [[], [], []];
        filterBarList.value
          .slice() // 不让排序影响原数组
          .sort((a, b) => {
            // 让 radio 和 checkbox 类型的筛选项靠前
            if (a.filterable?.type === "radio" || a.filterable?.type === "checkbox") {
              if (b.filterable?.type === "radio" || b.filterable?.type === "checkbox") {
                if (a.filterable?.filters?.length !== undefined && b.filterable?.filters?.length !== undefined) {
                  // 选项越多越靠前
                  return b.filterable?.filters?.length - a.filterable?.filters?.length;
                } else {
                  return 0;
                }
              } else {
                return -1;
              }
            } else {
              return 0;
            }
          })
          .forEach((item) => {
            const fitlerable = item?.filterable as RdTableFilterable;
            const fieldName = fitlerable?.queryField || item.dataIndex || item.slotName;
            if (fieldName === undefined) {
              return null;
            } else {
              switch (fitlerable.type) {
                case "checkbox":
                  filterBarRowList.value[0].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                      // style={fitlerable.filters?.length && fitlerable.filters?.length > 3 ? "width: 100%" : ""}
                    >
                      <a-checkbox-group
                        model-value={initConfig.queryData[fieldName]}
                        onChange={(value: string) => (initConfig.queryData[fieldName] = value)}
                        type="button"
                      >
                        {fitlerable.filters?.map((f) => (
                          <a-checkbox value={f.value}>{f.text}</a-checkbox>
                        ))}
                      </a-checkbox-group>
                    </a-form-item>
                  ));
                  break;
                case "radio":
                  filterBarRowList.value[0].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                      // style={fitlerable.filters?.length && fitlerable.filters?.length > 3 ? "width: 100%" : ""}
                    >
                      <a-radio-group
                        model-value={initConfig.queryData[fieldName]}
                        onChange={(value: string) => (initConfig.queryData[fieldName] = value)}
                        type="button"
                      >
                        {fitlerable.filters?.map((f) => (
                          <a-radio value={f.value}>{f.text}</a-radio>
                        ))}
                      </a-radio-group>
                    </a-form-item>
                  ));
                  break;
                case "range-picker":
                  filterBarRowList.value[2].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                    >
                      <a-range-picker
                        style="width: 230px"
                        showConfirmBtn={false}
                        model-value={initConfig.queryData[fieldName]}
                        onChange={(value: string[]) => (initConfig.queryData[fieldName] = value)}
                      ></a-range-picker>
                    </a-form-item>
                  ));
                  break;
                case "range-picker-time":
                  filterBarRowList.value[2].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                    >
                      <a-range-picker
                        style="width: 230px"
                        showTime
                        showConfirmBtn={false}
                        model-value={initConfig.queryData[fieldName]}
                        onChange={(value: string[]) => (initConfig.queryData[fieldName] = value)}
                      ></a-range-picker>
                    </a-form-item>
                  ));
                  break;
                case "search":
                  filterBarRowList.value[1].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                    >
                      <a-input
                        placeholder={"搜索"}
                        model-value={initConfig.queryData[fieldName]}
                        onInput={(value: string) => (initConfig.queryData[fieldName] = value)}
                        onClear={() => (initConfig.queryData[fieldName] = undefined)}
                        allow-clear={true}
                      ></a-input>
                    </a-form-item>
                  ));
                  break;
                case "select":
                  filterBarRowList.value[1].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                    >
                      <a-select
                        placeholder={"选择"}
                        v-model={initConfig.queryData[fieldName]}
                        onClear={() => (initConfig.queryData[fieldName] = undefined)}
                        allow-clear={true}
                      >
                        {fitlerable.filters?.map((f) => (
                          <a-option value={f.value}>{f.text}</a-option>
                        ))}
                      </a-select>
                    </a-form-item>
                  ));
                  break;
                case "user-select":
                  filterBarRowList.value[1].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                    >
                      <UserSelect v-model={initConfig.queryData[fieldName]} allow-clear={true} />
                    </a-form-item>
                  ));
                  break;
                case "staff-select":
                  filterBarRowList.value[1].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                    >
                      <StaffSelect v-model={initConfig.queryData[fieldName]} allow-clear={true} />
                    </a-form-item>
                  ));
                  break;
                case "place-select":
                  filterBarRowList.value[1].push(() => (
                    <a-form-item
                      label-col-style={{ "min-width": "100px" }}
                      wrapper-col-style={{ "min-width": "230px" }}
                      label={item?.filterable?.label || item.title}
                      field={fieldName}
                    >
                      <PlaceSelect v-model={initConfig.queryData[fieldName]} allow-clear={true} />
                    </a-form-item>
                  ));
                  break;
              }
            }
          });
        (filterBarRowList.value[2].length ? filterBarRowList.value[2] : filterBarRowList.value[1]).push(() => (
          <a-button type={changedQueryData.value ? "outline" : undefined} onClick={resetFilter}>
            重置
          </a-button>
        ));
        // .filter((item) => item !== null);
      },
      {
        deep: true,
      },
    );
    const filterBarSlot = () => {
      return (
        <a-form model={initConfig.queryData} layout="inline">
          {slots.filter?.({ formItemDefaultAttr: { "label-col-style": { "min-width": "100px" }, "wrapper-col-style": { "min-width": "230px" } } })}
          {filterBarRowList.value.map((row) => {
            return <div style="display: inline-flex; flex-wrap: wrap; width: 100%;">{row.map((ele) => ele())}</div>;
          })}
        </a-form>
      );
    };
    const displayColumnsValue = ref(
      initConfig.defaultShowColumn || initConfig.tableColumns.map((item) => item.dataIndex || item.slotName).filter((item) => item !== undefined),
    );
    watch(displayColumnsValue, () => {
      emit("adjustDisplayColumns", displayColumnsValue.value);
    });
    const minusScrollX = ref(0);
    const beCloseCol = ref(false);
    const tableColumns = computed(() => {
      filterBarList.value = [];
      minusScrollX.value = 0;
      beCloseCol.value = false;
      const c: TableColumnData[] = initConfig.tableColumns
        .filter((col) => {
          // 过滤需要显示的列
          const v = displayColumnsValue.value.some((field) => col.dataIndex === field || col.slotName === field);
          if (!v) {
            minusScrollX.value += col?.width || 0;
            beCloseCol.value = true;
            // 清除筛选值
            if (col?.filterable?.queryField) {
              initConfig.queryData[col.filterable.queryField] = col.filterable.defaultValue || undefined;
              if (
                initConfig.queryData[col.filterable.queryField] !== col.filterable.defaultValue ||
                initConfig.queryData[col.filterable.queryField] !== undefined
              ) {
                // 如果是不是默认值或者不是 undefined 则覆盖（减少修改次数）
                initConfig.queryData[col.filterable.queryField] = col?.filterable?.defaultValue || undefined;
              }
            } else if (col.dataIndex) {
              if (initConfig.queryData[col.dataIndex] !== col?.filterable?.defaultValue || initConfig.queryData[col.dataIndex] !== undefined) {
                // 如果是不是默认值或者不是 undefined 则覆盖（减少修改次数）
                initConfig.queryData[col.dataIndex] = col?.filterable?.defaultValue || undefined;
              }
            }
          }
          return v;
        })
        .map((col): TableColumnData => {
          // 构建 filterable
          let filterable: TableFilterable | undefined = undefined;
          const fitlerable = col?.filterable as RdTableFilterable;
          if (fitlerable?.defaultValue) {
            if (!Array.isArray(fitlerable.defaultValue)) {
              fitlerable.defaultFilteredValue = [String(fitlerable.defaultValue)];
            } else {
              fitlerable.defaultFilteredValue = fitlerable.defaultValue.map((item) => String(item));
            }
          }
          switch (fitlerable?.align) {
            case "filter-bar":
              filterBarList.value.push(col);
              break;
            case "inline-table":
              switch (fitlerable?.type) {
                case "checkbox":
                  filterable = {
                    filter: fitlerable.filter ? fitlerable.filter : () => true,
                    filters: fitlerable.filters,
                    multiple: true,
                  };
                  break;
                case "radio":
                case "select":
                  filterable = {
                    filter: fitlerable.filter ? fitlerable.filter : () => true,
                    filters: fitlerable.filters,
                  };
                  break;
                case "range-picker":
                  filterable = {
                    slotName: "table-filter-range-picker",
                    filter: fitlerable.filter ? fitlerable.filter : () => true,
                  };
                  break;
                case "range-picker-time":
                  filterable = {
                    slotName: "table-filter-range-picker-time",
                    filter: fitlerable.filter ? fitlerable.filter : () => true,
                  };
                  break;
                case "search":
                  filterable = {
                    slotName: "table-filter-search",
                    filter: fitlerable.filter ? fitlerable.filter : () => true,
                    icon: () => h(IconSearch),
                  };
                  break;
                default:
                  throw new Error("filterable.type 必须是 checkbox radio range-picker range-picker-time search 其中一项");
              }
              break;
            default:
              break;
          }
          return {
            ...col,
            filterable,
          };
        });
      return c;
    });
    const operationSlot = ({ record }: any) => {
      return (
        <>
          {initConfig.operation?.some((item) => item === "view") ? (
            <a-link style="padding: 4px 8px;" onClick={() => emit("rowView", record)}>
              {{
                default: () => <>详情</>,
                icon: () => <icon-eye />,
              }}
            </a-link>
          ) : null}
          {initConfig.operation?.some((item) => item === "edit") ? (
            <a-link style="padding: 4px 8px;" onClick={() => emit("rowEdit", record)}>
              {{
                default: () => <>编辑</>,
                icon: () => <icon-edit />,
              }}
            </a-link>
          ) : null}
          {initConfig.operation?.some((item) => item === "registrationList") ? (
            <a-link style="padding: 4px 8px;" onClick={() => emit("rowDelete", record)}>
              {{
                default: () => <>报名信息</>,
                icon: () => <icon-tags />,
              }}
            </a-link>
          ) : null}
          {initConfig.operation?.some((item) => item === "delete") ? (
            <a-link style="padding: 4px 8px;" status="danger" onClick={() => emit("rowDelete", record)}>
              {{
                default: () => <>报名信息</>,
                icon: () => <icon-delete />,
              }}
            </a-link>
          ) : null}
          {initConfig.operation
            ?.filter((o) => o !== "view" && o !== "edit" && o !== "delete")
            .map((o) => slots[o]?.({ record: record, defaultAttr: { style: "padding: 4px 8px;" } }))}
        </>
      );
    };

    return {
      displayColumnsValue,
      filterBarList,
      columnsOptions,
      tableColumns,
      tableFilterSlots,
      minusScrollX,
      beCloseCol,
      filterBarSlot,
      operationSlot,
    };
  };
  return defineComponent({
    name: "rd-3",
    emits: ["rowView", "rowEdit", "rowDelete", "rowClick", "clickAdd", "clickSelectedDelete", "updateSelectedRowKeys", "adjustDisplayColumns"],
    setup(props, { slots, emit }) {
      const tableData = ref<TableData[]>([]);
      const { rowSelection, isSelected, selectAll, rowSelect } = useSelect(emit, tableData);
      const { pagination, pageChange, pageSizeChange } = usePagination();
      const { tableLoading, loadData } = useLoadData(pagination, rowSelection, tableData);
      const { columnsOptions, tableColumns, displayColumnsValue, tableFilterSlots, minusScrollX, beCloseCol, filterBarSlot, operationSlot } =
        useTableColumnTools(emit, slots);
      const tableSlots: any = {};
      watchEffect(() => {
        Object.keys(slots)
          .filter((key) => /^table-/.test(key))
          .forEach((key) => (tableSlots[key] = slots[key]));
      });
      return {
        rdLoadData: (showLoading = true) => loadData(showLoading),
        setEmptySelectRowKeys: () => (rowSelection.selectedRowKeys = []),
        render: () => (
          <div class="rd">
            <a-space direction="vertical" fill>
              <div class="filter">{filterBarSlot()}</div>
              <a-row justify="space-between">
                <a-space>
                  {slots["selected-options"]?.()}
                  {slots["selected-options"] !== undefined && initConfig.multiSelectDeleteButtom && <a-divider direction="vertical" />}
                  {initConfig.multiSelectDeleteButtom === false ? (
                    <></>
                  ) : (
                    <a-tooltip content="删除">
                      <a-button status="danger" onClick={() => emit("clickSelectedDelete")} disabled={!isSelected.value}>
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
                <div>
                  <a-space>
                    {slots["normal-options"]?.()}
                    {!initConfig.addButtonText ? (
                      <></>
                    ) : (
                      <>
                        <a-button type="primary" onClick={() => emit("clickAdd")}>
                          {initConfig.addButtonText}
                        </a-button>
                      </>
                    )}
                  </a-space>
                  <a-divider direction="vertical" />
                  <a-space>
                    {slots["tools-options"]?.()}
                    <a-trigger trigger="click" unmount-on-close={false}>
                      {{
                        default: () => (
                          <a-tooltip content="表格工具">
                            <a-button shape="circle" type={beCloseCol.value ? "outline" : undefined}>
                              <icon-tool />
                            </a-button>
                          </a-tooltip>
                        ),
                        content: () => (
                          <div style="background-color: var(--color-bg-popup); border: 1px solid var(--color-fill-3);border-radius: var(--border-radius-medium);box-shadow: 0 4px 10px rgb(0 0 0 / 10%); padding: 6px 16px 6px 12px;">
                            <a-checkbox-group direction="vertical" v-model={displayColumnsValue.value} options={columnsOptions} />
                          </div>
                        ),
                      }}
                    </a-trigger>
                    <a-tooltip content="刷新">
                      <a-button shape="circle" onClick={() => loadData()}>
                        <icon-sync />
                      </a-button>
                    </a-tooltip>
                  </a-space>
                </div>
              </a-row>
              <a-table
                bordered={{
                  headerCell: true,
                  wrapper: false,
                }}
                table-layout-fixed={true}
                filter-icon-align-left={false}
                scroll={{
                  x: initConfig.scroll?.x && initConfig.scroll.x - minusScrollX.value,
                  y: initConfig.scroll?.y,
                }}
                sticky-header={0.1}
                columns={tableColumns.value}
                data={tableData.value}
                pagination={initConfig.closePagination === true ? false : pagination}
                row-selection={rowSelection}
                loading={tableLoading.value}
                onSelectAll={selectAll}
                onRowClick={(record: TableData) => emit("rowClick", record)}
                onSelect={rowSelect}
                onPageChange={pageChange}
                onPageSizeChange={pageSizeChange}
                v-slots={{
                  ...tableSlots,
                  ...tableFilterSlots,
                  "table-operation": operationSlot,
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
}
