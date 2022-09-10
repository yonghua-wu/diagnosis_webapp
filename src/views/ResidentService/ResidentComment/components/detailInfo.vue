<template>
  <WorkGuestOriented :tabs="tabs">
    <WorkCommentDetail v-show="true" :evaluationId="evaluationId"></WorkCommentDetail>
  </WorkGuestOriented>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkGuestOriented from "@/components/Work/WorkGuestOriented.vue";
import WorkCommentDetail from "@/components/Work/WorkCommentDetail.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "resident-comment-detail-component",
  components: {
    WorkGuestOriented,
    WorkCommentDetail,
  },
  setup() {
    const tabs = ["评价详情"];
    const route = useRoute();
    const evaluationId = route.params.id as string;
    return {
      tabs,
      evaluationId,
    };
  },
});
</script>

<style lang="less" scoped></style>
