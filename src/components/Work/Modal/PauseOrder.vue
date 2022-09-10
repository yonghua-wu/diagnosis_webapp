<template>
  <a-button @click="onShow">{{ buttonName }}</a-button>
  <a-modal v-model:visible="visible" :title="modalTitle" title-align="start" :width="400" @cancel="cancel" :on-before-ok="submit">
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
import { defineComponent, PropType, ref } from "vue";
import { useRoute } from "vue-router";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import RulesLib from "@/utils/RulesLib";
import { VISIT_TYPE_MAP } from "@/hooks/dict";
import { useDetail } from "@/components/lib/CU/CU";
import Ticket from "@/api/tenant/Ticket";
/**
 * 暂停工单
 */
export default defineComponent({
  name: "modal-children-order",
  components: {
    SfForm,
    SfFormItem,
  },
  props: {
    buttonName: {
      type: String,
      default: () => "暂停",
    },
    modalTitle: {
      type: String,
      default: () => "确定暂停此工单？",
    },
    reload: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const formData = ref<any>({
      content: "",
    });
    const rules = {
      content: new RulesLib().required("请输入备注").done(),
    };
    const visible = ref(false);
    const onShow = () => {
      visible.value = true;
    };
    const route = useRoute();
    const clear = () => {
      formData.value.content = "";
    };
    const cancel = () => {
      visible.value = false;
      clear();
    };

    const refForm = ref();
    const { vaildate } = useDetail(refForm);

    const submit = (done: (v: boolean) => void) => {
      console.log("submit");
      vaildate()
        .then(() => {
          Ticket.pauseTicket(route.params.id as string, formData.value.content)
            .then(() => {
              props.reload?.();
              setTimeout(() => {
                clear();
              }, 200);
              done(true);
            })
            .catch(() => {
              done(false);
            });
        })
        .catch(() => {
          done(false);
        });
    };

    return {
      refForm,
      formData,
      visible,
      VISIT_TYPE_MAP,
      rules,
      onShow,
      submit,
      cancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-children-order {
}
</style>
