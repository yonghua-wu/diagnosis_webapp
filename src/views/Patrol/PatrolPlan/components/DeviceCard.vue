<template>
  <a-row class="device-card">
    <a-col flex="auto" class="device-desc">
      <a-row class="name">{{ watcherData.inputRes.name }}</a-row>
      <a-row class="addr">{{ watcherData.inputRes.ip }}</a-row>
    </a-col>
    <a-col flex="65px">
      <div class="device-icon">
        <a-image :src="imgSrc"></a-image>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import Input from "@/api/edge/input";
import { defineComponent, nextTick, onMounted, ref, toRefs } from "vue";
export default defineComponent({
  name: "DeviceCard",
  props: {
    watcherData: Object,
  },
  setup(props) {
    const { watcherData } = toRefs(props);
    const imgSrc = ref<string>("");
    onMounted(() => {
      // watch(
      //   () => (watcherData as any).inputRes,
      //   () => {
      //     },
      // );
      nextTick(() => {
        console.log("watcherData.inputRes", (watcherData as any).value.inputRes);
        Input.snapshot((watcherData as any).value.inputRes).then((res) => {
          imgSrc.value = res;
        });
      });
    });
    return {
      imgSrc,
    };
  },
});
</script>

<style lang="less" scoped>
.device-card {
  border: 1px solid var(--color-border-2);
  width: 280px;
  padding: 8px;
  height: calc(65px + 16px);
  .device-desc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .name {
      font-size: 16px;
    }
    .addr {
      font-size: 12px;
      font-weight: bold;
      color: var(--color-text-2);
    }
  }
  .device-icon {
    height: 65px;
    width: 114px;
    background-color: var(--color-fill-1);
    :deep(.arco-image-img) {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
