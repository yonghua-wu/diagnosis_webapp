import { deepClone } from "@/utils/utils";
import { TableData } from "@arco-design/web-vue";
import { defineComponent, inject, nextTick } from "vue";
import { sfTableInjectKey } from "./context";

export default defineComponent({
  emits: ["rowClick"],
  setup(props, { emit, slots }) {
    const sfTableCtx = inject(sfTableInjectKey);
    const onPageChange = (n: number) => {
      if (sfTableCtx?.pagination.value) {
        sfTableCtx.pagination.value.current = n;
      }
    };
    const onPageSizeChange = (n: number) => {
      if (sfTableCtx?.pagination.value) {
        sfTableCtx.pagination.value.pageSize = n;
      }
    };
    let isMove = false;
    let isMoveDown = false;
    let isClick = false;
    const onMouseDown = () => {
      isMoveDown = true;
      isMove = false;
      isClick = true;
    };
    const onMouseMove = () => {
      isMove = true;
    };
    const onClick = (record: TableData) => {
      if (isMoveDown === true && isMove == false && isClick === true) {
        setTimeout(() => {
          emit("rowClick", record);
        }, 50);
      }
    };
    return () => (
      <a-table
        bordered={{
          headerCell: true,
          wrapper: false,
        }}
        table-layout-fixed={true}
        filter-icon-align-left={false}
        scroll={sfTableCtx?.scroll.value}
        sticky-header={0.1}
        columns={sfTableCtx?.displayTableColumns.value.map((col) => {
          const o = deepClone(col);
          delete o.filterable;
          return o;
        })}
        data={sfTableCtx?.tableData.value}
        pagination={sfTableCtx?.pagination.value}
        row-selection={sfTableCtx?.rowSelection.value}
        loading={sfTableCtx?.tableLoading.value}
        onRowClick={onClick}
        onSelectAll={sfTableCtx?.onSelectAll}
        onSelect={sfTableCtx?.onRowSelect}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onMousedown={onMouseDown}
        onMousemove={onMouseMove}
      >
        {slots}
      </a-table>
    );
  },
});
