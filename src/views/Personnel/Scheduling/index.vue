<template>
  <div class="scheduling-view container">
    <Breadcrumb :items="['人员管理', '人员排班']" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
export default defineComponent({
  name: "SchedulingView",
  components: {
    Breadcrumb,
  },
  setup() {
    //
  },
});
</script>

<style lang="less" scoped>
.scheduling-view {
}
</style>
