<template>
  <div class="color-group">
    <div class="item" v-for="(color, index) in thecolors" :key="index" :style="'background-color:' + color"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRef, watchEffect } from "vue";
export default defineComponent({
  name: "ColorGroup",
  props: {
    colors: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const colors = toRef(props, "colors");
    const thecolors = reactive<string[]>([]);
    watchEffect(() => {
      thecolors.splice(0, thecolors.length);
      colors.value &&
        (colors.value as string[]).forEach((color: string) => {
          let c: string;
          if (color && !/^[rgb,#]/.test(color)) {
            if (/,/.test(color)) {
              c = `rgb(${color})`;
            } else {
              c = `#${color}`;
            }
          } else {
            c = color;
          }
          thecolors.push(c);
        });
    });
    return {
      thecolors,
    };
  },
});
</script>

<style lang="less" scoped>
@import "@arco-design/web-vue/es/style/theme/global.less";
.color-group {
  display: flex;
  flex-direction: row;
  height: 50px;
  border: 1px solid var(--color-border-2);
  .item {
    height: 100%;
    width: 50px;
  }
}
</style>
