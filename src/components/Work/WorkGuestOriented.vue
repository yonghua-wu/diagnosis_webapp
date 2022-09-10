<template>
  <div class="work-guest-oriented">
    <a-card>
      <template #title>
        <div class="title">
          <a-button shape="circle" type="text" @click="goBack">
            <icon-left />
          </a-button>
          <a-tabs class="tabs" :default-active-key="defaultTab" v-model:active-key="activeTab" :hide-content="true">
            <a-tab-pane v-for="(item, key) in tabs" :key="key" :title="item"></a-tab-pane>
          </a-tabs>
        </div>
      </template>
      <template #extra>
        <slot name="extra"></slot>
      </template>
      <slot></slot>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { useRouterManager } from "../lib/CU/CU";
export default defineComponent({
  name: "work-guest-oriented",
  props: {
    tabs: {
      type: Array as PropType<string[]>,
      required: true,
      default: () => ["例子1", "例子2", "例子3"],
    },
    defaultTab: {
      type: Number,
      default: () => 0,
    },
    modelValue: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const activeTab = ref(props.modelValue);
    watch(activeTab, () => {
      emit("update:modelValue", activeTab.value);
    });
    const { goBack } = useRouterManager();
    return {
      activeTab,
      goBack,
    };
  },
});
</script>

<style lang="less" scoped>
.work-guest-oriented {
  position: relative;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  :deep(.arco-tabs-nav) {
    height: 46px;
    &::before {
      height: 0;
    }
  }
  :deep(.arco-tabs-nav-type-line .arco-tabs-tab) {
    line-height: 1.9;
  }
}
</style>
