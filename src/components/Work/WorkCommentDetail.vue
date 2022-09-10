<template>
  <div class="work-comment-detail">
    <SfForm v-if="reportData" :model="reportData" :formModel="'View'">
      <SfFormItem field="appraiseName" label="评价人">
        {{ reportData?.appraiseName || "-" }}
      </SfFormItem>
      <SfFormItem field="address" label="房号">
        {{ reportData?.address || "-" }}
      </SfFormItem>
      <SfFormItem field="appraisePhone" label="评价人手机号">
        {{ reportData?.appraisePhone || "-" }}
      </SfFormItem>
      <SfFormItem field="placeName" label="评价对象">
        <!-- 报事、投诉、员工、物业 -->
      </SfFormItem>
      <SfFormItem field="ticketId" label="关联报事号">
        {{ reportData?.ticketId || "-" }}
      </SfFormItem>
      <SfFormItem field="createdTime" label="评价日期">
        {{ reportData?.createdTime || "-" }}
      </SfFormItem>
      <SfFormItem field="score" label="评价星级">
        <a-rate :model-value="reportData?.score" readonly />
      </SfFormItem>
      <!-- {{ reportData?.score || "-" }} -->
      <SfFormItem field="content" label="评价内容" :colProps="{ span: 24 }">
        {{ reportData?.content || "-" }}
      </SfFormItem>
    </SfForm>
    <a-empty v-else description="暂无评价记录"></a-empty>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SfForm from "../lib/CU/SfForm";
import SfFormItem from "../lib/CU/SfFormItem";
import Evaluation from "@/api/tenant/Evaluation";
export default defineComponent({
  name: "work-report-detail",
  components: {
    SfForm,
    SfFormItem,
  },
  props: {
    data: {
      type: Object,
    },
    ticketId: {
      type: String,
    },
    evaluationId: {
      type: String,
    },
  },
  setup(props) {
    const reportData = ref<any>();
    const score = ref<number>(0);
    const loading = ref(false);
    const loadDataByEvaluationId = () => {
      console.log(props);
      loading.value = true;
      Evaluation.findDetailById(props.evaluationId as string)
        .then((res) => {
          reportData.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const loadDataByTicketId = () => {
      loading.value = true;
      Evaluation.findDetailByTicketId(props.ticketId as string)
        .then((res) => {
          reportData.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const load = () => {
      if (props.data === undefined && props.evaluationId) {
        loadDataByEvaluationId();
      } else if (props.data === undefined && props.ticketId) {
        loadDataByTicketId();
      }
    };
    load();
    return {
      load,
      reportData,
      score,
    };
  },
});
</script>

<style lang="less" scoped>
.work-comment-detail {
  width: 100%;
}
</style>
