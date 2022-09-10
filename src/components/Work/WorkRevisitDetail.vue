<template>
  <div class="work-revisit-detail">
    <SfForm :model="revisitData" :formModel="'View'" :labelWidth="60">
      <SfFormItem :style="{ height: '32px' }" :colProps="{ span: 24 }" field="" label="录入时间">
        {{ revisitData?.createdTime || "-" }}
      </SfFormItem>
      <!-- <SfFormItem :style="{ height: '32px' }" :colProps="{ span: 24 }" field="" label="报事号">
        {{ revisitData?.ticketId || "-" }}
      </SfFormItem> -->
      <SfFormItem :style="{ height: '32px' }" :colProps="{ span: 24 }" field="" label="回访日期">
        {{ moment(revisitData?.visitTime).format("YYYY-MM-DD") || "-" }}
      </SfFormItem>
      <SfFormItem :style="{ height: '32px' }" :colProps="{ span: 24 }" field="" label="回访方式">
        {{ (revisitData?.visitType && revisitTypeMap[revisitData?.visitType]?.label) || "-" }}
      </SfFormItem>
      <SfFormItem :style="{ height: '32px' }" :colProps="{ span: 24 }" field="" label="回访人">
        {{ revisitData?.handlerName || "-" }}
      </SfFormItem>
      <SfFormItem :style="{ height: '32px' }" :colProps="{ span: 24 }" field="" label="备注">
        {{ revisitData?.content || "-" }}
      </SfFormItem>
    </SfForm>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";
import SfForm from "../lib/CU/SfForm";
import SfFormItem from "../lib/CU/SfFormItem";
import Evaluation from "@/api/tenant/Evaluation";
import Revisit, { RevisitModel } from "@/api/tenant/Revisit";
import moment from "moment";
import { useAppStore } from "@/store";
export default defineComponent({
  name: "work-revisit-detail",
  components: {
    SfForm,
    SfFormItem,
  },
  props: {
    data: {
      type: Object as PropType<RevisitModel>,
    },
    id: {
      type: String,
    },
  },
  setup(props) {
    const { data: revisitData } = toRefs(props);
    const loading = ref(false);
    const appStore = useAppStore();
    const revisitTypeMap = computed(() => {
      return appStore.revisitTypeMap as any;
    });
    const loadDataByTicketId = () => {
      // loading.value = true;
      // Revisit.getVisitDetailByTicketId(props.id as string)
      //   .then((res) => {
      //     revisitData.value = res;
      //   })
      //   .finally(() => {
      //     loading.value = false;
      //   });
    };
    if (props.data === undefined && props.id) {
      loadDataByTicketId();
    }
    return {
      moment,
      revisitData,
      revisitTypeMap,
    };
  },
});
</script>

<style lang="less" scoped>
.work-revisit-detail {
  width: 100%;
}
</style>
