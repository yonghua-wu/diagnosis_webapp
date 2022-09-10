<template>
  <a-button @click="onShow">{{ buttonName }}</a-button>
  <a-modal v-model:visible="visible" :title="modalTitle" title-align="start" :width="400">
    <template #footer>
      <a-space>
        <a-button :loading="btnLoading" @click="close">取消</a-button>
        <a-button :loading="btnLoading" @click="cancel">验收不通过</a-button>
        <a-button :loading="btnLoading" @click="submit" type="primary">验收通过</a-button>
      </a-space>
    </template>
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
import { computed, defineComponent, PropType, ref, watch } from "vue";
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
 * 验收工单
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
      default: () => "验收",
    },
    modalTitle: {
      type: String,
      default: () => "验收",
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
    const close = () => {
      visible.value = false;
      clear();
    };
    watch(visible, () => {
      if (visible.value === false) {
        clear();
      }
    });
    const btnLoading = ref(false);
    const cancel = () => {
      if (formData.value.content) {
        btnLoading.value = true;
        Ticket.approveTicket({
          approveStatus: 2, // 不通过
          remark: formData.value.content,
          ticketId: route.params.id as string,
        })
          .then(() => {
            visible.value = false;
            clear();
            props.reload?.();
          })
          .finally(() => {
            btnLoading.value = false;
          });
      } else {
        Message.error("验收不通过请输入原因");
      }
      return false;
    };

    const refForm = ref();
    const { vaildate } = useDetail(refForm);

    const submit = () => {
      console.log("submit");
      btnLoading.value = true;
      vaildate()
        .then(() => {
          return Ticket.approveTicket({
            approveStatus: 1, // 通过
            remark: formData.value.content,
            ticketId: route.params.id as string,
          });
        })
        .then(() => {
          props.reload?.();
          setTimeout(() => {
            clear();
          }, 200);
          visible.value = false;
        })
        .catch(() => {
          visible.value = true;
        })
        .finally(() => {
          btnLoading.value = false;
        });
    };

    return {
      refForm,
      formData,
      visible,
      btnLoading,
      VISIT_TYPE_MAP,
      rules,
      close,
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
