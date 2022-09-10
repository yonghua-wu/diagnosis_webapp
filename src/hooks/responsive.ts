import { onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useDebounceFn, useResizeObserver } from "@vueuse/core";
import { useAppStore } from "@/store";

const WIDTH = 992; // https://arco.design/vue/component/grid#responsivevalue

function queryDevice() {
  const rect = document.body.getBoundingClientRect();
  return rect.width - 1 < WIDTH;
}

export default function useResponsive(immediate?: boolean) {
  const appStore = useAppStore();
  function resizeHandler() {
    if (!document.hidden) {
      const isMobile = queryDevice();
      appStore.toggleDevice(isMobile ? "mobile" : "desktop");
      appStore.toggleMenu(isMobile);
    }
  }
  const debounceFn = useDebounceFn(resizeHandler, 100);
  onMounted(() => {
    if (immediate) debounceFn();
  });
  let obs: { stop: () => void };
  onBeforeMount(() => {
    obs = useResizeObserver(document.body, debounceFn);
    // addEventListen(window, "resize", debounceFn);
  });
  onBeforeUnmount(() => {
    // removeEventListen(window, "resize", debounceFn);
    obs?.stop();
  });
}
