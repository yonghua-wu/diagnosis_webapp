import { Modal } from "@arco-design/web-vue";
import { ref, Ref, watch, WatchStopHandle } from "vue";

export function useStartStopWatch(refData: Ref<any>, handler: () => void) {
  const stopWatch = ref<WatchStopHandle>();
  const startWatch = () => {
    stopWatch.value = watch(refData, handler, { deep: true });
  };
  return {
    stopWatch,
    startWatch,
  };
}

interface UseModalConfig {
  title?: string;
  content?: string;
  onOk: () => void;
  onCancel?: () => void;
  type: "info" | "success" | "warning" | "error";
}

export function useModalTips() {
  return (config: UseModalConfig) => {
    Modal[config.type]({
      title: config.title || "提示",
      content: config.content || "",
      closable: true,
      cancelText: "取消",
      hideCancel: config.onCancel ? false : true,
      onOk: config.onOk,
      onCancel: config.onCancel,
    });
  };
}
