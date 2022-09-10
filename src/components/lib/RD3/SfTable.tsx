import Message from "@/utils/Message";
import { deepClone } from "@/utils/utils";
import { Modal, TableData } from "@arco-design/web-vue";
import { defineComponent, PropType, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import RD from ".";
import { RdInitConfig, RdTableColumnData } from "./interface";
import "./SfTable.less";
export default defineComponent({
  name: "sf-table",
  props: {
    loadData: {
      type: Function as PropType<RdInitConfig<any>["loadData"]>,
      required: true,
    },
    formatLoadData: {
      type: Function as PropType<RdInitConfig<any>["formatLoadData"]>,
      required: true,
    },
    formatQueryData: {
      type: Function as PropType<(query: any) => any>,
      required: true,
    },
    queryData: {
      type: Object as PropType<RdInitConfig<any>["queryData"]>,
      required: true,
    },
    tableColumns: {
      type: Array as PropType<RdInitConfig<any>["tableColumns"]>,
      required: true,
    },
    // 默认显示的列，留空则显示全部
    defaultShowColumn: {
      type: Array as PropType<RdInitConfig<any>["defaultShowColumn"]>,
    },
    /**
     * 关闭分页
     */
    closePagination: {
      type: Boolean as PropType<RdInitConfig<any>["closePagination"]>,
      default: () => false,
    },
    /**
     * 显示多选删除按钮
     */
    multiSelectDeleteButtom: {
      type: Boolean as PropType<RdInitConfig<any>["multiSelectDeleteButtom"]>,
      default: () => true,
    },
    /**
     * 显示全选 checkbox
     */
    showCheckedAll: {
      type: Boolean as PropType<RdInitConfig<any>["showCheckedAll"]>,
      default: () => true,
    },
    /**
     * 显示添加按钮，传空字符串则隐藏
     */
    addButtonText: {
      type: String as PropType<RdInitConfig<any>["addButtonText"]>,
      default: () => "添加",
    },
    /**
     * 已选择的行
     */
    selectedRowKeys: {
      type: Object as PropType<RdInitConfig<any>["selectedRowKeys"]>,
    },
    /**
     * 操作列
     */
    operation: {
      type: Array as PropType<RdInitConfig<any>["operation"]>,
      default: () => ["view", "edit", "delete"],
    },
    scroll: {
      type: Object as PropType<RdInitConfig<any>["scroll"]>,
      default: () => ({ x: 1140 }),
    },
    rowView: {
      type: Function as PropType<(record: TableData) => void>,
    },
    rowEdit: {
      type: Function as PropType<(record: TableData) => void>,
    },
    rowDelete: {
      type: Function as PropType<(id: string) => Promise<any>>,
    },
    rowClick: {
      type: Function as PropType<(record: TableData) => void>,
    },
    clickAdd: {
      type: Function as PropType<() => void>,
    },
    clickSelectedDelete: {
      type: Function as PropType<(selectedKeys: string[]) => Promise<any>>,
    },
  },
  setup(props, { emit, slots }) {
    // 已选择的keys
    const selectedRowKeys = ref<string[]>(props.selectedRowKeys || []);
    watch(selectedRowKeys, () => {
      emit("update:selectedRowKeys", selectedRowKeys.value);
    });
    // 默认格式化
    const formatLoadData = (data: any[]) => {
      const formatRes = props.formatLoadData(data);
      if (formatRes instanceof Promise) {
        return formatRes.then((res) => {
          return res.map((item) => {
            return {
              updatedBy: item.data.updatedBy,
              updatedTime: item.data.updatedTime,
              ...item,
            };
          });
        });
      } else {
        formatRes.forEach((item: any) => {
          item.updatedBy = item.data.updatedBy;
          item.updatedTime = item.data.updatedTime;
        });
        return formatRes;
      }
    };
    // 检测是否上传操作时间，如果未上传默认-1，如果上传获取index
    const newTableColumns = reactive(props.tableColumns);
    const updatedTimeIndex = props.tableColumns.findIndex((item) => item.title === "操作时间");
    const updatedTimeColumn = reactive(props.tableColumns[updatedTimeIndex]);
    // 如果已上传，先提取出这一列
    if (updatedTimeIndex !== -1) {
      newTableColumns.splice(updatedTimeIndex, 1);
    }
    const updatedByIndex = props.tableColumns.findIndex((item) => item.title === "操作人");
    const updatedByColumn = reactive(props.tableColumns[updatedByIndex]);
    if (updatedByIndex !== -1) {
      newTableColumns.splice(updatedByIndex, 1);
    }
    // 默认列
    const tableColumns: RdTableColumnData[] = [
      {
        dataIndex: "NO",
        title: "序号",
        width: 70,
        ellipsis: true,
        tooltip: true,
      },
      ...newTableColumns,
    ];
    if (updatedByIndex === -1) {
      tableColumns.push({
        title: "操作人",
        dataIndex: "updatedBy",
        ellipsis: true,
        tooltip: true,
        width: 100,
      });
    } else {
      tableColumns.push(updatedByColumn);
    }

    // 如果未上传，上传默认值；如果已上传，updatedTimeColumn变量
    if (updatedTimeIndex === -1) {
      tableColumns.push({
        title: "操作时间",
        dataIndex: "updatedTime",
        width: 180,
        ellipsis: true,
        tooltip: true,
      });
    } else {
      tableColumns.push(updatedTimeColumn);
    }

    // 合并操作列
    const index = tableColumns.findIndex((item) => item.slotName === "table-operation");
    if (index !== -1 && props.operation?.length) {
      tableColumns.push({
        title: "操作",
        slotName: "table-operation",
        ellipsis: true,
        width: 62 * props.operation.length + 32,
        ...(tableColumns[index] as RdTableColumnData),
      });
      tableColumns.splice(index, 1);
    } else if (props.operation?.length) {
      tableColumns.push({
        title: "操作",
        slotName: "table-operation",
        ellipsis: true,
        width: 62 * props.operation.length + 32,
      });
    }
    const route = useRoute();
    let createQueryData = deepClone(route.query);
    const createCurrent: number = createQueryData?.current && Number(createQueryData.current);
    const createPageSize: number = createQueryData?.pageSize && Number(createQueryData.pageSize);
    delete createQueryData.current;
    delete createQueryData.pageSize;
    emit("update:queryData", { ...props.queryData, ...createQueryData });
    console.log(route.path);
    const customDisplayColumns: string[] = JSON.parse(localStorage.getItem(`CustomDisplayColumns_${route.path}`) || "[]");
    const formatQueryData = (query: any, current: number, pageSize: number) => {
      Object.keys(createQueryData).forEach((key) => {
        query[key] = createQueryData[key];
      });
      const routeQuery = { current, pageSize, ...query };
      Object.keys(routeQuery).forEach((key) => {
        if (routeQuery[key] === "-999" || routeQuery[key] === -999 || !routeQuery[key]) {
          delete routeQuery[key];
        }
      });
      router.replace({ query: routeQuery });
      const q = props.formatQueryData(query);
      createQueryData = {};
      return q;
    };
    const RdComponent = RD({
      loadData: props.loadData,
      formatLoadData: formatLoadData,
      formatQueryData: formatQueryData,
      queryData: props.queryData,
      tableColumns: tableColumns,
      defaultShowColumn: customDisplayColumns.length ? customDisplayColumns : props.defaultShowColumn,
      closePagination: props.closePagination,
      pagination: {
        current: createCurrent,
        pageSize: createPageSize,
      },
      multiSelectDeleteButtom: props.multiSelectDeleteButtom,
      showCheckedAll: props.showCheckedAll === true,
      addButtonText: props.addButtonText,
      selectedRowKeys: selectedRowKeys.value,
      operation: props.operation,
      scroll: props.scroll,
    });
    const refRd = ref();
    const tableLoadData = () => {
      return refRd.value.rdLoadData();
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

    const router = useRouter();
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
                refRd.value.setEmptySelectRowKeys();
                return tableLoadData();
              })
              .finally(() => {
                close();
              });
          }
        } else {
          throw new Error("删除失败，未配置 table.key");
        }
      });
    };
    const onRowClick = (record: TableData) => {
      if (typeof props.rowClick === "function") {
        props.rowClick(record);
      } else {
        router.push({ name: (route.name as string) + "Detail", params: { model: "View", id: record.key } });
      }
    };
    const clickAdd = () => {
      if (typeof props.clickAdd === "function") {
        props.clickAdd();
      } else {
        router.push({ name: (route.name as string) + "Detail", params: { model: "Add" } });
      }
    };
    const clickSelectedDelete = () => {
      return deleteModal()
        .then(() => {
          if (typeof props.rowDelete === "function") {
            const close = Message.delayLoading("删除中...", 1000);
            return props
              .clickSelectedDelete?.(selectedRowKeys.value)
              .then(() => {
                refRd.value.setEmptySelectRowKeys();
                return tableLoadData();
              })
              .finally(() => {
                close();
              });
          }
        })
        .catch(() => {
          //
        });
    };
    const onAdjustDisplayColumns = (colNames: string[]) => {
      localStorage.setItem(`CustomDisplayColumns_${route.path}`, JSON.stringify(colNames));
    };
    return {
      tableLoadData,
      render: () => (
        <div class="sf-table container">
          {slots["breadcrumb"]?.()}
          <a-card>
            <RdComponent
              ref={refRd}
              onUpdateSelectedRowKeys={(keys) => (selectedRowKeys.value = keys)}
              onRowView={onRowView}
              onRowEdit={onRowEdit}
              onRowDelete={onRowDelete}
              onRowClick={onRowClick}
              onClickAdd={clickAdd}
              onClickSelectedDelete={clickSelectedDelete}
              onAdjustDisplayColumns={onAdjustDisplayColumns}
            >
              {{ ...slots }}
            </RdComponent>
          </a-card>
        </div>
      ),
    };
  },
  render() {
    return this.render();
  },
});
