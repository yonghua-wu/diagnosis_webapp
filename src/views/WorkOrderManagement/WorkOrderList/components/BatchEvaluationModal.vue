<template>
  <a-modal v-model:visible="visible" title="客户评价" title-align="start" width="500px" @before-ok="handleBeforeOk">
    <a-form ref="refForm" :model="formData">
      <a-form-item :rules="rules.appraise" label="评分人" field="appraise">
        <a-select v-model="formData.appraise">
          <a-option :value="item.id" :label="item.name" :key="index" v-for="(item, index) in appraiseList"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item :rules="rules.score" label="评分" field="score">
        <a-rate v-model="formData.score" />
      </a-form-item>
      <a-form-item :rules="rules.remark" label="回访说明" field="remark">
        <a-textarea
          v-model="formData.remark"
          placeholder="请输入回访说明"
          :max-length="200"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          show-word-limit
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import Evaluation from "@/api/tenant/Evaluation";
import { TicketModel } from "@/api/tenant/Ticket";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "batch-confirm-modal",
  setup() {
    const formData = ref<any>({
      appraise: "6278afa44a0a33000163a011",
      score: 5,
      remark: "",
    });
    const rules = {
      appraise: new RulesLib().required("请选择评分人").done(),
      score: new RulesLib().required("请选择评分人").done(),
      remark: new RulesLib().done(),
    };
    const appraiseList = ref([
      {
        id: "6278afa44a0a33000163a011",
        name: "胡涛",
        phone: "13421381724",
      },
    ]);
    const visible = ref(false);
    const selectedDatas = ref<TicketModel[]>([]);
    let refreshTable: () => void;
    const openModal = (_selectedDatas: TicketModel[], _refreshTable: () => void) => {
      selectedDatas.value = _selectedDatas;
      refreshTable = _refreshTable;
      visible.value = true;
      formData.value.remark = "";
    };
    const refForm = ref();
    const handleBeforeOk = (done: (isDone: boolean) => void) => {
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          const appraise = appraiseList.value[appraiseList.value.findIndex((item) => item.id === formData.value.appraise)];
          const p = selectedDatas.value.map((item) => {
            return Evaluation.create({
              ticketId: item.ticketId,
              appraiseId: appraise.id,
              appraiseName: appraise.name,
              appraisePhone: appraise.phone,
              score: formData.value.score,
              content: formData.value.remark,
            });
          });
          Promise.all(p)
            .then(() => {
              done(true);
              refreshTable?.();
            })
            .catch((err) => {
              console.log("err", err);
              done(false);
            });
        } else {
          done(false);
        }
      });
    };
    return {
      rules,
      refForm,
      appraiseList,
      visible,
      selectedDatas,
      formData,
      openModal,
      handleBeforeOk,
    };
  },
});
</script>
