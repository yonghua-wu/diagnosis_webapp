<template>
  <a-button @click="onShow">{{ buttonName }}</a-button>
  <a-modal
    v-model:visible="visible"
    :unmount-on-close="true"
    :title="modalTitle"
    title-align="start"
    :width="400"
    @cancel="cancel"
    :on-before-ok="submit"
  >
    <SfForm ref="refForm" :model="formData">
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.handlerId" field="handlerId" label="回访人">
        <!-- <StaffSelect v-model="formData.handlerId" placeholder="请选择回访人" /> -->
        <UserSelect ref="refUserSelect" v-model="formData.handlerId" placeholder="请选择回访人" />
      </SfFormItem>
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.visitDate" field="visitDate" label="回访日期">
        <a-date-picker v-model="formData.visitDate" />
      </SfFormItem>
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.visitType" field="visitType" label="回访方式">
        <a-select
          v-model="formData.visitType"
          :options="Object.keys(revisitTypeMap).map((k) => ({ label: revisitTypeMap[k].label, value: Number(k) }))"
        ></a-select>
      </SfFormItem>
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.content" field="content" label="回访备注">
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
import Revisit from "@/api/tenant/Revisit";
/**
 * 添加回访记录
 */
export default defineComponent({
  name: "modal-children-order",
  components: {
    SfForm,
    SfFormItem,
    // StaffSelect,
    UserSelect,
  },
  props: {
    buttonName: {
      type: String,
      default: () => "回访",
    },
    modalTitle: {
      type: String,
      default: () => "回访情况录入",
    },
    reload: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const revisitTypeMap = computed(() => {
      return appStore.revisitTypeMap as any;
    });
    const formData = ref<any>({
      handlerId: (appStore.userInfo as any)?.userId,
      handlerName: (appStore.userInfo as any)?.realName,
      handlerPhone: (appStore.userInfo as any)?.userPhone,
      visitDate: moment().format("YYYY-MM-DD"),
      visitType: 4,
      content: "",
    });
    const rules = {
      handlerId: new RulesLib().required("请选择回访人").done(),
      visitDate: new RulesLib().required("请选择回访日期").done(),
      visitType: new RulesLib().required("请选择回访方式").done(),
      content: new RulesLib().done(),
    };
    const visible = ref(false);
    const onShow = () => {
      visible.value = true;
    };
    const route = useRoute();
    const clear = () => {
      formData.value.handlerId = (appStore.userInfo as any)?.userId;
      formData.value.handlerName = (appStore.userInfo as any)?.realName;
      formData.value.handlerPhone = (appStore.userInfo as any)?.userPhone;
      formData.value.visitDate = moment().format("YYYY-MM-DD");
      formData.value.visitType = 4;
      formData.value.content = "";
    };
    const cancel = () => {
      clear();
    };

    const refForm = ref();
    const { vaildate } = useDetail(refForm);
    const refUserSelect = ref();
    const submit = (done: (v: boolean) => void) => {
      vaildate()
        .then(() => {
          return Revisit.create(
            {
              ticketId: route.params.id as string,
              handlerId: formData.value.handlerId,
              handlerName: refUserSelect.value?.selectedUserList?.[0]?.realName || formData.value.handlerName,
              handlerPhone: refUserSelect.value?.selectedUserList?.[0]?.userPhone || formData.value.handlerPhone,
              content: formData.value?.content,
              visitType: formData.value.visitType,
              visitTime: Number(moment(formData.value.visitDate).format("x")),
            },
            route.name === "ResidentReportListDetail" ? "REPORT" : "COMPLAIN",
          );
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
      refUserSelect,
      refForm,
      formData,
      visible,
      revisitTypeMap,
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
