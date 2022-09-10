<template>
  <a-button @click="onShow">{{ buttonName }}</a-button>
  <a-modal v-model:visible="visible" :title="modalTitle" title-align="start" :width="400" @cancel="cancel" :on-before-ok="submit">
    <SfForm ref="refForm" :model="formData" :labelWidth="60">
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.handlerId" field="handlerId" label="协助人">
        <StaffSelect ref="refStaffSelect" v-model="formData.handlerId" placeholder="请选择协助人" :disabledIds="disabledStaffId" />
      </SfFormItem>
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
import { VISIT_TYPE_MAP } from "@/hooks/dict";
import { useDetail } from "@/components/lib/CU/CU";
import StaffSelect from "@/components/lib/StaffSelect/index.vue";
import Ticket, { AssistantModel, TicketModel } from "@/api/tenant/Ticket";
/**
 * 添加协助人
 */
export default defineComponent({
  name: "modal-children-order",
  components: {
    SfForm,
    SfFormItem,
    StaffSelect,
  },
  props: {
    buttonName: {
      type: String,
      default: () => "添加协助人",
    },
    modalTitle: {
      type: String,
      default: () => "添加协助人",
    },
    reload: {
      type: Function as PropType<() => void>,
    },
    ticketData: {
      type: Object as PropType<TicketModel>,
    },
    assistantList: {
      type: Array as PropType<AssistantModel[]>,
    },
  },
  setup(props) {
    const formData = ref<any>({
      handlerId: "",
      content: "",
    });
    const rules = {
      handlerId: new RulesLib().required("请选择处理人").done(),
      content: new RulesLib().done(),
    };
    const visible = ref(false);
    const onShow = () => {
      visible.value = true;
    };
    const clear = () => {
      formData.value.content = "";
      formData.value.handlerId = "";
    };
    const cancel = () => {
      clear();
    };
    const refStaffSelect = ref();
    const refForm = ref();
    const { vaildate } = useDetail(refForm);
    const route = useRoute();
    const submit = (done: (v: boolean) => void) => {
      console.log("submit");
      vaildate()
        .then(() => {
          return Ticket.addAssistant({
            list: [
              {
                assistantId: formData.value.handlerId,
                assistantName: refStaffSelect.value?.selectedStaffList?.[0]?.name,
                assistantPhone: refStaffSelect.value?.selectedStaffList?.[0]?.phone,
                assistantIcon: refStaffSelect.value?.selectedStaffList?.[0]?.icon,
              },
            ],
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

    const disabledStaffId = computed(() => {
      const list = [];
      props.ticketData?.toId && list.push(props.ticketData?.toId);
      if (props.assistantList?.length) {
        props.assistantList.forEach((item) => {
          list.push(item.assistantId);
        });
      }
      return list;
    });

    return {
      refStaffSelect,
      refForm,
      formData,
      visible,
      VISIT_TYPE_MAP,
      rules,
      disabledStaffId,
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
