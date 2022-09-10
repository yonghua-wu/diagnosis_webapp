<template>
  <div class="create-order container">
    <Breadcrumb :items="['客服管理', { name: '客服工单', router: () => $router.replace({ name: 'ServiceWorkOrderList' }) }, '创建新工单']" />
    <a-card>
      <template #title>
        <a-button shape="circle" type="text" @click="() => goBack('ServiceWorkOrderList')">
          <icon-left />
        </a-button>
        <span>创建新工单</span>
      </template>
      <a-row>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="10" :xxl="7">
          <WorkCreateForm ref="refOrderForm" class="order-form" :defaultJobQueryData="{ serviceType: [2, 3, 4], serviceClasses: [1, 2, 3, 5] }" />
        </a-col>
      </a-row>
      <div class="btns">
        <SfForm>
          <SfFormItem label="">
            <a-space>
              <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
              <!-- <a-button @click="onCreateWorkOrder">添加关联工单</a-button> -->
            </a-space>
          </SfFormItem>
        </SfForm>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useRouterManager } from "@/components/lib/CU/CU";
import WorkCreateForm from "@/components/Work/WorkCreateForm.vue";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import RulesLib from "@/utils/RulesLib";
import Ticket from "@/api/tenant/Ticket";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "create-complain",
  components: {
    Breadcrumb,
    WorkCreateForm,
    SfForm,
    SfFormItem,
  },
  setup() {
    const refWorkOrderCreate = ref();
    const refOrderForm = ref();
    const { goBack } = useRouterManager();
    const loading = ref(false);
    const router = useRouter();
    const submit = () => {
      loading.value = true;
      refOrderForm.value
        ?.submit()
        .then((formData: any) => {
          console.log(formData);
          return Ticket.create(formData).then(() => {
            router.push({ name: "ServiceWorkOrderList" });
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };
    return {
      refWorkOrderCreate,
      refOrderForm,
      loading,
      goBack,
      submit,
    };
  },
});
</script>
<style lang="less" scoped>
.create-complain {
  width: 100%;
  height: 100%;
  .btns {
    margin-top: 8px;
  }
}
</style>
