<template>
  <div class="work-revisit-detail-list">
    <a-timeline>
      <a-timeline-item v-for="(item, index) in revisitList" :key="index" style="margin-bottom: 12px">
        <WorkRevisitDetail :key="index" :data="item" />
      </a-timeline-item>
    </a-timeline>
    <a-empty v-if="!revisitList?.length" description="暂无回访记录"></a-empty>
  </div>
</template>

<script lang="ts">
import Evaluation from "@/api/tenant/Evaluation";
import Revisit, { RevisitModel } from "@/api/tenant/Revisit";
import { defineComponent, ref } from "vue";
import WorkRevisitDetail from "./WorkRevisitDetail.vue";
export default defineComponent({
  name: "work-revisit-detail-list",
  components: {
    WorkRevisitDetail,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const revisitList = ref<RevisitModel[]>([]);
    const loading = ref(false);
    const loadData = () => {
      loading.value = true;
      Revisit.getVisitDetailByTicketId(props.id as string)
        .then((res) => {
          revisitList.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
      // Evaluation.findDetailByTicketId(props.id).then((res) => {
      //   console.log(res);
      // });
    };
    const load = () => {
      if (props.id) {
        loadData();
      }
    };
    load();
    return {
      load,
      loading,
      revisitList,
    };
  },
});
</script>

<style lang="less" scoped>
.work-revisit-detail-list {
  width: 100%;
  padding-left: 14px;
  :deep(.arco-timeline-item-dot-wrapper .arco-timeline-item-dot-content) {
    height: 30px;
  }
}
</style>
