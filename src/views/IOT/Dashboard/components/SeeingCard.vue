<template>
  <div class="seeing-card">
    <div class="title">{{ title }}</div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Seeing-Card",
  props: {
    title: String,
  },
  setup() {
    //
  },
});
</script>

<style lang="less" scoped>
@import "@arco-design/web-vue/es/style/theme/global.less";
.seeing-card {
  // border: 1px solid var(--color-border-1);
  height: calc(50vh - 95px);
  min-height: 310px;
  border-radius: var(--border-radius-large);
  background-color: var(--color-bg-1);
  color: var(--color-text-1);
  &:hover {
    box-shadow: @shadow1-down;
  }
  .title {
    color: var(--color-text-3);
    font-size: 16px;
    font-weight: bold;
    padding: 0px 12px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid var(--color-border-2);
  }
  .card-body {
    padding: 8px 12px;
  }
}
</style>
