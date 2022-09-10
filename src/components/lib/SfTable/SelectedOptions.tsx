import { defineComponent, inject } from "vue";
import { sfTableInjectKey } from "./context";

export default defineComponent({
  setup(props, { slots }) {
    const sfTableCtx = inject(sfTableInjectKey);
    return () => (
      <a-space>
        {slots["selected-options"]?.()}
        {sfTableCtx?.isSelected.value ? (
          <a-tag size="large" closable onClose={() => sfTableCtx?.onRowSelect([])}>
            已选择 {sfTableCtx?.rowSelection.value?.selectedRowKeys?.length} 条数据
          </a-tag>
        ) : (
          <></>
        )}
      </a-space>
    );
  },
});
