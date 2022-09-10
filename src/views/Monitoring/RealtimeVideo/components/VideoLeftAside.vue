<template>
  <div class="video-left-aside">
    <div class="filter">
      <a-space>
        <a-input-search placeholder="搜索摄像头" />
        <a-button>
          <template #icon>
            <icon-filter />
          </template>
        </a-button>
      </a-space>
    </div>
    <div class="camera-list" ref="refCameraList">
      <a-list :bordered="false" :split="false" :max-height="listHeight">
        <a-list-item
          class="item"
          draggable="true"
          v-for="(sensor, key) in unitList"
          :key="key"
          @dragstart="dragstart(sensor, key)"
          @dragend="dragend"
        >
          <div class="item-inner">
            <div class="camera-name">{{ sensor.name }}</div>
          </div>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script lang="ts">
import { useWindowSize } from "@vueuse/core";
import { defineComponent, onMounted, ref, watch } from "vue";
import eventBus, { ListenIndex } from "@/utils/eventBus";
import Input from "@/api/edge/input";
export default defineComponent({
  name: "VideoLeftAside",
  setup() {
    const refCameraList = ref(null);
    const loading = ref(false);
    const unitList = ref<any[]>([]);
    const { height } = useWindowSize();
    const listHeight = ref(height.value - 234);
    let moveSensorEvent: ListenIndex | null = null;
    watch(height, () => {
      listHeight.value = height.value - 234;
    });
    const load = () => {
      loading.value = true;
      Input.page(1, 1000)
        .then((res: any) => {
          unitList.value = res.data.filter((item: { status: number }) => item.status === 1);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    onMounted(load);
    const dragstart = (sensor: any, i: any) => {
      moveSensorEvent = eventBus.on("dropSensor", (cb) => {
        cb(sensor, i);
      });
    };
    const dragend = () => {
      if (moveSensorEvent !== null) {
        eventBus.un(moveSensorEvent);
        moveSensorEvent = null;
      }
    };
    return {
      unitList,
      listHeight,
      refCameraList,
      dragstart,
      dragend,
    };
  },
});
</script>

<style lang="less" scoped>
.video-left-aside {
  height: 100%;
  margin-right: 12px;
  // display: flex;
  // flex-direction: column;
  .filter {
    display: flex;
    flex-direction: row;
    padding-bottom: 12px;
  }
  .camera-list {
    // flex: 1;
    :deep(.arco-list) {
      border-radius: unset;
    }
    .item {
      cursor: grab;
      border-radius: var(--border-radius-small);
      padding: 0px 8px;
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--color-text-2);
      background-color: var(--color-bg-1);
      &:hover {
        color: rgb(var(--primary-6));
        background-color: var(--color-fill-2);
      }
      .item-inner {
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
