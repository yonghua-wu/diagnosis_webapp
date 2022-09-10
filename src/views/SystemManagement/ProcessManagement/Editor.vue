<template>
  <div class="process-editor container">
    <Breadcrumb :items="['工单管理', { name: '流程管理', router: () => $router.replace({ name: 'ProcessManagement' }) }, '编辑']" />
    <a-card style="height: calc(100% - 48px)">
      <iframe name="process-editor" style="width: 100%; height: 100%" :src="`${publicPath}flow-page/?modelId=${modelId}`" frameborder="0"></iframe>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

import Breadcrumb from "@/components/Breadcrumb.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "ProcessEditor",
  components: {
    Breadcrumb,
  },
  setup() {
    const publicPath = location.origin + "/";
    const route = useRoute();
    const modelId = route.params.modelId;
    onMounted(() => {
      const name = "process-editor";
      console.log("process.env.TICKET_BASE_URL", process.env.VUE_APP_TICKET_BASE_URL);
      (window.frames[name as unknown as number] as any).TICKET_BASE_URL = process.env.VUE_APP_TICKET_BASE_URL;
      // console.log((window.frames[name as unknown as number] as any));
    });
    return {
      publicPath,
      modelId,
    };
  },
});
</script>

<style lang="less" scoped>
.process-editor {
  height: 100%;
}
:deep(.arco-card-body) {
  height: 100%;
}
</style>
