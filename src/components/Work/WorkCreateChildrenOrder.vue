<template>
  <div class="work-create-children-order">
    <a-spin :loading="loading" style="width: 100%">
      <WorkCreateFormTabs
        :min-order-count="minOrderCount"
        ref="refWorkOrderCreateTabs"
        :type="type"
        :disabledFieldList="['customName', 'customPhone']"
      />
      <SfForm style="margin-top: 12px" :model="{}">
        <SfFormItem label="">
          <a-space>
            <a-button type="primary" @click="submit" :loading="submitLoading">提交</a-button>
            <a-button @click="onCreateWorkOrder" :loading="submitLoading">继续添加关联工单</a-button>
          </a-space>
        </SfFormItem>
      </SfForm>
    </a-spin>
  </div>
</template>

<script lang="ts">
import Ticket from "@/api/tenant/Ticket";
import { defineComponent, onMounted, PropType, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DETAIL_TYPE_MAP } from "./WorkSomethingDetail.vue";
import WorkCreateFormTabs from "./WorkCreateFormTabs.vue";
import SfForm from "../lib/CU/SfForm";
import SfFormItem from "../lib/CU/SfFormItem";
import router from "@/router";
export default defineComponent({
  name: "work-create-children-order",
  components: {
    WorkCreateFormTabs,
    SfForm,
    SfFormItem,
  },
  props: {
    type: {
      type: String as PropType<keyof typeof DETAIL_TYPE_MAP>,
      default: () => "WORK_ORDER",
    },
    minOrderCount: {
      type: Number,
    },
  },
  setup() {
    const route = useRoute();
    const sourceTicketId = route.params.id as string;
    const loading = ref(false);
    const defaultValue = ref<any>({});
    const loadTicketData = () => {
      loading.value = true;
      Ticket.detail(sourceTicketId)
        .then((res) => {
          defaultValue.value.content = res?.content || "";
          // defaultValue.value.jobId = res?.jobId || "";
          defaultValue.value.imgList = res.imgList
            ? res.imgList.map((item, index) => {
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
              })
            : [];
          defaultValue.value.placeId = res?.placeId || "";
          defaultValue.value.placeName = res?.placeName || "";
          defaultValue.value.serviceClass = res?.serviceClass || "";
          defaultValue.value.customName = res?.customName || "";
          defaultValue.value.customPhone = res?.customPhone || "";
          // defaultValue.value.toId = res?.toId || "";
          // defaultValue.value.toName = res?.toName || "";
          // defaultValue.value.toPhone = res?.toPhone || "";
          defaultValue.value.ticketId = res?.ticketId || "";
          refWorkOrderCreateTabs.value?.handleAdd(defaultValue.value);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    onMounted(() => {
      loadTicketData();
    });
    const refWorkOrderCreateTabs = ref();
    const onCreateWorkOrder = () => {
      refWorkOrderCreateTabs.value?.submit().then(() => {
        refWorkOrderCreateTabs.value?.handleAdd(defaultValue.value);
      });
    };
    const router = useRouter();
    const submitLoading = ref(false);
    const submit = () => {
      submitLoading.value = true;
      refWorkOrderCreateTabs.value
        ?.submit()
        .then((data: any[]) => {
          console.log(data);
          return Ticket.createGuestOrientedOrder({
            ...defaultValue.value,
            imgList: defaultValue.value.imgList.map((item: any) => item.response),
            refId: sourceTicketId,
            refTickets: data,
          });
          // const p = data.map((item) => {
          // });
          // return Promise.all(p);
        })
        .then(() => {
          router.go(-1);
        })
        .finally(() => {
          submitLoading.value = false;
        });
    };
    return {
      loading,
      submitLoading,
      sourceTicketId,
      defaultValue,
      onCreateWorkOrder,
      submit,
      DETAIL_TYPE_MAP,
      refWorkOrderCreateTabs,
    };
  },
});
</script>

<style lang="less" scoped>
.work-create-children-order {
  max-width: 500px;
}
</style>
