<template>
  <div class="device-card" ref="device-card">
    <transition name="no-mode-fade" mode="out-in">
      <div class="inner" v-if="active" @click="active = false">
        <div class="device-type">
          <span> {{ deviceData.deviceType }} </span>
        </div>
        <div class="device-title" :class="[deviceData.deviceTitle.length > 7 ? 'device-title-long' : '']">
          <span>
            {{ deviceData.deviceTitle }}
          </span>
        </div>
        <div class="summary">
          <div class="status" :class="[status.className]"></div>
          <!-- <div class="value">{{ status.text }}</div> -->
          <div class="value">{{ deviceData.controlType === "switch" ? (switchStatus ? "开启" : "关闭") : summary }}</div>
        </div>
      </div>
      <div class="inner" v-else @click="active = true">
        <div class="summary">
          <a-switch
            v-model="switchStatus"
            :loading="switchLoading"
            v-if="deviceData.controlType === 'switch'"
            class="no-off"
            checked-color="#23c343"
            @click.stop="clickSwitch"
          ></a-switch>
          <div v-if="deviceData.controlType === ''" class="status" :class="[status.className]"></div>
          <div class="value">{{ deviceData.controlType === "switch" ? (switchStatus ? "开启" : "关闭") : summary }}</div>
        </div>
        <div class="details">
          <div class="detail" v-for="(item, index) in details" :key="index">{{ item }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, toRefs, watchEffect } from "vue";
export default defineComponent({
  name: "DeviceCard",
  props: {
    deviceData: Object,
  },
  setup(props) {
    const active = ref(true);
    const { deviceData } = toRefs(props);
    const theDeviceData = deviceData as any;
    const status = computed(() => {
      switch (theDeviceData.value.status) {
        case 0:
          return { className: "gray", text: "关闭" };
        case 1:
          return { className: "success", text: "运行" };
        case -2:
          return { className: "danger", text: "异常" };
        default:
        case -1:
          return { className: "warn", text: "未知" };
      }
    });
    const summary = computed(() => {
      if (theDeviceData.value.block && theDeviceData.value.block[0]) {
        const pointMap = theDeviceData.value.data[theDeviceData.value.block && theDeviceData.value.block[0]];
        return (pointMap && pointMap.format(pointMap.value)) || status.value.text;
      } else {
        return status.value.text;
      }
    });
    const details = computed(() => {
      if (theDeviceData.value.block.length > 1) {
        return theDeviceData.value.block.slice(1).map((point: string) => {
          const format = theDeviceData.value.data[point].format;
          return (theDeviceData.value.data[point]?.value && format(theDeviceData.value.data[point]?.value)) || "--";
        });
      } else {
        return [];
      }
    });
    const switchLoading = ref(false);
    const switchStatus = ref(false);
    watchEffect(() => {
      switchStatus.value = theDeviceData.value.status === 1 ? true : false;
    });
    const clickSwitch = () => {
      switchLoading.value = true;
      theDeviceData.value.data["#11"]
        .switchCellback(switchStatus.value)
        .catch(() => {
          switchStatus.value = !switchStatus.value;
        })
        .finally(() => {
          switchLoading.value = false;
        });
    };
    onMounted(() => {
      const _instance = getCurrentInstance();
      const refDeviceCard = _instance?.refs["device-card"] as Element;
      if (refDeviceCard) {
        const resizeEvt = "onorientationchange" in window ? "onorientationchange" : "resize";
        const recalc = function () {
          console.log("recal", refDeviceCard.clientWidth);
          const clientWidth = refDeviceCard.clientWidth;
          if (!clientWidth) return;
          const size = 100 * (clientWidth / 750) + "px";
          refDeviceCard.setAttribute("style", `font-size:${size}`);
        };
        recalc();
        if (!refDeviceCard.addEventListener) return;
        window.addEventListener(
          resizeEvt,
          () => {
            recalc();
            setTimeout(recalc, 200);
          },
          false,
        );
        refDeviceCard.addEventListener(
          "DOMContentLoaded",
          () => {
            recalc();
            setTimeout(recalc, 200);
          },
          false,
        );
      }
    });
    return {
      active,
      status,
      summary,
      details,
      switchStatus,
      switchLoading,
      clickSwitch,
    };
  },
});
</script>

<style lang="less" scoped>
@import "@arco-design/web-vue/es/style/theme/global.less";
.device-card {
  width: 100%;
  height: 0px;
  padding-bottom: 60%;
  position: relative;
  .inner {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-medium);
    padding: 0.3em 0.4em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .device-type {
      color: var(--color-text-3);
      height: 0.9em;
      line-height: 0.9em;
      span {
        // font-size: 0.8em;
        font-size: 0.8em;
        font-weight: bold;
        transform: scale(0.83) translateX(-12.3%);
        display: inline-block;
      }
    }
    .device-title {
      font-size: 0.85em;
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .device-title-long {
      font-size: 0.7em;
    }
    .summary {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-size: 1.1em;
      font-weight: bold;
      .value {
        text-shadow: @shadow1-down;
      }
      .status {
        height: 0.8em;
        width: 0.8em;
        border-radius: 50%;
        box-shadow: @shadow1-center;
      }
      .success {
        background-color: @color-success-5;
      }
      .danger {
        background-color: @color-danger-5;
      }
      .gray {
        background-color: var(--color-text-2);
      }
      .warn {
        background-color: @color-warning-5;
      }
      .no-off {
        min-width: 2em;
        height: 1em;
        line-height: 1em;
        border-radius: 0.5em;

        box-shadow: @shadow1-center;
      }
      :deep(.arco-switch-handle) {
        top: 0.125em;
        left: 0.125em;
        width: 0.75em;
        height: 0.75em;
        font-size: unset;
      }
      :deep(.arco-switch-checked) {
        .arco-switch-handle {
          left: 1.125em;
        }
      }
    }
    .details {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      // align-items: center;
      color: var(--color-text-2);
      .detail {
        font-size: 0.9em;
        width: 50%;
        text-align: center;
      }
    }
  }
  .no-mode-fade-enter-active {
    transition: all 0.2s ease-out;
  }
  .no-mode-fade-leave-active {
    transition: all 0.2s ease-in;
  }
  .no-mode-fade-enter-from,
  .no-mode-fade-leave-to {
    transform: rotateY(90deg);
  }
}
</style>
