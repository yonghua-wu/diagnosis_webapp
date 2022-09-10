<template>
  <a-button @click="onShow">{{ buttonName }}</a-button>
  <a-modal v-model:visible="visible" :title="modalTitle" title-align="start" :width="400" :on-before-ok="submit">
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
import { computed, defineComponent, PropType, ref } from "vue";
import { useRoute } from "vue-router";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import RulesLib from "@/utils/RulesLib";
import { useAppStore } from "@/store";
import StaffSelect from "@/components/lib/StaffSelect/index.vue";
import { VISIT_TYPE_MAP } from "@/hooks/dict";
import { useDetail } from "@/components/lib/CU/CU";
import UserSelect from "@/components/lib/UserSelect/index.vue";
import moment from "moment";
import Message from "@/utils/Message";
import Ticket from "@/api/tenant/Ticket";
/**
 * 处理工单
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
      default: () => "处理",
    },
    modalTitle: {
      type: String,
      default: () => "处理",
    },
    reload: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const appStore = useAppStore();
    // const userInfo = computed(() => {
    //   return appStore.userInfo as any;
    // });
    const formData = ref<any>({
      content: "",
    });
    const rules = {
      content: new RulesLib().done(),
    };
    const visible = ref(false);
    const onShow = () => {
      visible.value = true;
    };
    const route = useRoute();
    const clear = () => {
      formData.value.content = "";
    };

    const refForm = ref();
    const { vaildate } = useDetail(refForm);

    const submit = (done: (v: boolean) => void) => {
      console.log("submit");
      vaildate()
        .then(() => {
          return Ticket.acceptTicket({
            remark: formData.value.content,
            ticketId: route.params.id as string,
          });
        })
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
    };

    return {
      refForm,
      formData,
      visible,
      VISIT_TYPE_MAP,
      rules,
      onShow,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-children-order {
}
</style>
