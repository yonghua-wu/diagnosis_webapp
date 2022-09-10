import { defineComponent, inject } from "vue";
import { sfTableInjectKey } from "./context";

export default defineComponent({
  setup(props, { slots }) {
    const sfTableCtx = inject(sfTableInjectKey);
    return () => (
      <div>
        <a-space>{slots["options"]?.()}</a-space>
        <a-divider direction="vertical" />
        <a-space>
          {slots["tools-options"]?.()}
          <a-tooltip content="刷新">
            <a-button shape="circle" onClick={() => sfTableCtx?.loadData()}>
              <icon-sync />
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    );
  },
});
