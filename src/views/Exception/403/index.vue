<template>
  <a-result status="403" subtitle="抱歉，您没有权限访问该页面">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="$router.go(-1)">返回</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Exception401View",
  setup() {
    //
  },
});
</script>

<style lang="less" scoped>
.exception401-view {
}
</style>
