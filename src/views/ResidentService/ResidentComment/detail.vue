<template>
  <div class="container">
    <Breadcrumb :items="['客户服务', { name: '客户评价', router: () => $router.push({ name: 'ResidentComment' }) }, '详情']" />
    <Detail />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Detail from "./components/detailInfo.vue";

export default defineComponent({
  name: "commentDetail",
  components: {
    Breadcrumb,
    Detail,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped lang="less"></style>
