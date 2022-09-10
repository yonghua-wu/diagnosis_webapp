<template>
  <a-button @click="onShow" type="primary">通过</a-button>
  <a-modal v-model:visible="visible" title="审核通过" title-align="start" :width="400" :on-before-ok="submit">
    <span>确定审核通过？</span>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store";
import FaceAudit from "@/api/tenant/FaceAudit";
export default defineComponent({
  name: "approved-face-audit",
  setup() {
    const userStore = useUserStore();
    const visible = ref(false);
    const onShow = () => {
      visible.value = true;
    };
    const route = useRoute();

    const refForm = ref();

    const submit = () => {
      FaceAudit.audit({
        remark: "",
        auditStatus: 1,
        faceId: route.params.id as string,
        updatedBy: userStore.name,
        updatedId: userStore.id,
      });
    };

    return {
      refForm,
      visible,
      onShow,
      submit,
    };
  },
});
</script>
