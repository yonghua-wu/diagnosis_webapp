<template>
  <div class="create-complain container">
    <Breadcrumb :items="['客户服务', '客户投诉', { name: '投诉列表', router: () => $router.push({ name: 'ResidentComplainList' }) }, '录入投诉']" />
    <a-card>
      <template #title>
        <a-button shape="circle" type="text" @click="() => goBack()">
          <icon-left />
        </a-button>
        <span>录入投诉</span>
      </template>
      <a-row>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="10" :xxl="7">
          <WorkCreateForm
            ref="refComplainCreate"
            class="complain-form"
            formTitle="录入投诉"
            :disabledFieldList="['jobId']"
            :default-value="{ jobId: '62b3cb72889ffd00015e25f1', jobName: '客户投诉', serviceClass: 4 }"
            :customRules="rules"
            :defaultStaffQueryData="{ serviceClass: 4 }"
          />
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="14" :xxl="17">
          <WorkCreateFormTabs
            class="work-order-create"
            ref="refWorkOrderCreate"
            :disabledFieldList="['customName', 'customPhone']"
            :defaultJobQueryData="{ serviceType: [2, 3, 4], serviceClasses: [1, 2, 3, 5] }"
          />
        </a-col>
      </a-row>
      <div class="btns">
        <SfForm>
          <SfFormItem label="">
            <a-space>
              <a-button type="primary" @click="submit" :loading="btnsLoading">提交</a-button>
              <a-button @click="onCreateWorkOrder" :loading="btnsLoading">添加关联工单</a-button>
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
import WorkCreateFormTabs from "@/components/Work/WorkCreateFormTabs.vue";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import RulesLib from "@/utils/RulesLib";
import Ticket, { CreateTicketModel } from "@/api/tenant/Ticket";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "create-complain",
  components: {
    Breadcrumb,
    WorkCreateForm,
    WorkCreateFormTabs,
    SfForm,
    SfFormItem,
  },
  setup() {
    const refWorkOrderCreate = ref();
    const refComplainCreate = ref();
    const onCreateWorkOrder = () => {
      refComplainCreate.value?.submit().then((formData: any) => {
        delete formData.jobId;
        delete formData.placeName;
        delete formData.toId;
        refWorkOrderCreate.value?.handleAdd({
          ...formData,
          imgList: formData.imgList.map((item: string, index: number) => {
            let url = "";
            if (/^http/.test(item)) {
              url = item;
            } else {
              url = "http://" + item;
            }
            return {
              uid: index,
              url: url,
              name: url,
              response: url,
              status: "done",
            };
          }),
        });
      });
    };
    const rules = {
      jobId: new RulesLib().done(),
      placeId: new RulesLib().done(),
      customName: new RulesLib().required("请输入客户姓名").done(),
      customPhone: new RulesLib().required("请输入客户手机号").phone().done(),
    };
    const { goBack } = useRouterManager();
    const router = useRouter();
    const btnsLoading = ref(false);
    const submit = () => {
      btnsLoading.value = true;
      refComplainCreate.value
        ?.submit()
        .then((complainFormData: any) => {
          return refWorkOrderCreate.value?.submit().then((workOrderFormDataList: any[]) => {
            console.log(complainFormData);
            console.log(workOrderFormDataList);
            const data: CreateTicketModel = complainFormData;
            if (workOrderFormDataList.length) {
              data.refTickets = workOrderFormDataList;
            }
            return Ticket.createGuestOrientedOrder(data).then(() => {
              router.push({ name: "ResidentComplainList" });
            });
          });
        })
        .finally(() => {
          btnsLoading.value = false;
        });
    };
    return {
      btnsLoading,
      refWorkOrderCreate,
      refComplainCreate,
      onCreateWorkOrder,
      rules,
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
