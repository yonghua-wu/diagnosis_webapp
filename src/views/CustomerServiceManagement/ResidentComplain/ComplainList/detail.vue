<template>
  <div class="container">
    <Breadcrumb :items="['客户服务', '客户投诉', { name: '投诉列表', router: () => $router.push({ name: 'ResidentComplainList' }) }, '详情']" />
    <Detail :defaultTab="0" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Detail from "../components/detail.vue";
export default defineComponent({
  name: "guest-report-revisit-detail",
  components: { Breadcrumb, Detail },
});
</script>
<style lang="less" scoped></style>
