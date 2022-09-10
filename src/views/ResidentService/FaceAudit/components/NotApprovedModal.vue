<template>
  <a-button @click="onShow">不通过</a-button>
  <a-modal v-model:visible="visible" title="审核不通过" title-align="start" :width="400" @cancel="cancel" :on-before-ok="submit">
    <div style="margin-bottom: 12px">确定审核不通过？</div>
    <SfForm ref="refForm" :model="formData" :labelWidth="50">
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.content" field="content" label="备注">
        <a-textarea
          v-model="formData.content"
          placeholder="请输入备注"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 3, maxRows: 6 }"
        ></a-textarea>
      </SfFormItem>
    </SfForm>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store";
import FaceAudit from "@/api/tenant/FaceAudit";
import RulesLib from "@/utils/RulesLib";
import { useDetail } from "@/components/lib/CU/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
export default defineComponent({
  name: "approved-face-audit",
  components: {
    SfForm,
    SfFormItem,
  },
  props: {
    reload: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const visible = ref(false);
    const onShow = () => {
      visible.value = true;
    };
    const route = useRoute();
    const refForm = ref();
    const formData = ref<any>({
      content: "",
    });
    const rules = {
      content: new RulesLib().required("请输入备注").done(),
    };
    const clear = () => {
      formData.value.content = "";
    };
    const cancel = () => {
      visible.value = false;
      clear();
    };
    watch(visible, () => {
      if (visible.value === false) {
        clear();
      }
    });
    const { vaildate } = useDetail(refForm);
    const submit = (done: (v: boolean) => void) => {
      vaildate()
        .then(() => {
          return FaceAudit.audit({
            remark: formData.value.content,
            auditStatus: 2,
            faceId: route.params.id as string,
            updatedBy: userStore.name,
            updatedId: userStore.id,
          });
        })
        .then(() => {
          props.reload?.();
          setTimeout(() => {
            clear();
            done(true);
          }, 200);
        })
        .catch(() => {
          done(false);
        });
    };

    return {
      refForm,
      visible,
      formData,
      rules,
      onShow,
      submit,
      cancel,
    };
  },
});
</script>
