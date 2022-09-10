<template>
  <div class="color-card">
    <a-popover position="rt" trigger="click">
      <div class="color" :style="'background-color:' + theColor"></div>
      <template #content>
        <Sketch
          v-if="theColor"
          class="color-picker"
          :presetColors="presetColors"
          :model-value="theColor"
          @update:model-value="changeColor"
          :disableAlpha="true"
        />
      </template>
    </a-popover>
    <div class="value">
      <span>
        {{ theColor }}
      </span>
      <span class="title">
        {{ title }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, watchEffect } from "vue";
import { Sketch } from "@ckpack/vue-color";
const presetColors = [
  "#165DFF",
  "#00B42A",
  "#FF7D00",
  "#F53F3F",
  "#1D2129",
  "#4E5969",
  "#86909C",
  "#C9CDD4",
  "#E5E6EB",
  "#F2F3F5",
  "#F7F8FA",
  "#FFFFFF",
];
export default defineComponent({
  name: "ColorCard",
  components: {
    Sketch,
  },
  props: {
    color: String,
    title: String,
  },
  setup(props, ctx) {
    const emit = ctx.emit;
    const color = toRef(props, "color");
    const theColor = ref<string>("");
    const buildTheColor = () => {
      if (color.value && !/^[rgb,#,RGB]/.test(color.value)) {
        if (/,/.test(color.value)) {
          theColor.value = `rgb(${color.value})`;
        } else {
          theColor.value = `#${color.value}`;
        }
      } else {
        theColor.value = color.value as string;
      }
    };
    watchEffect(buildTheColor);
    const changeColor = (e: any) => {
      emit("change-color", e);
    };
    return {
      theColor,
      presetColors,
      changeColor,
    };
  },
});
</script>

<style lang="less" scoped>
@import "@arco-design/web-vue/es/style/theme/global.less";
.color-card {
  width: 160px;
  height: 160px;
  border: 1px solid var(--color-border-2);
  border-radius: @border-radius-medium;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &:hover {
    box-shadow: @shadow1-center;
  }
  .color {
    cursor: pointer;
    flex: 1;
  }
  .value {
    height: 50px;
    // line-height: 50px;
    padding: 6px 8px;
    border-top: 1px solid var(--color-border-2);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // font-weight: bold;
    .title {
      color: var(--color-text-3);
      font-size: 12px;
    }
  }
}
.color-picker {
  box-shadow: unset;
}
</style>
