<template>
  <WorkGuestOriented v-model="activeTab" :tabs="tabs">
    <template #extra>
      <a-space>
        <template v-if="activeTab === 0">
          <ModalChildrenOrder />
          <template v-if="ticketStatus === 5">
            <!-- 待分配 -->
            <!-- <ModalCloseOrder :reload="reload" /> -->
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <ModalHandleOrder :reload="reload" />
            <ModalRelayOrder :ticketData="ticketData" :reload="reload" :buttonName="'指派'" :modalTitle="'指派处理人'" />
          </template>
          <template v-else-if="ticketStatus === 1">
            <!-- 待接单 -->
            <!-- <ModalCloseOrder :reload="reload" /> -->
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <ModalHandleOrder :reload="reload" />
            <ModalRelayOrder :ticketData="ticketData" :reload="reload" :buttonName="'转单'" :modalTitle="'选择处理人'" />
          </template>
          <template v-else-if="ticketStatus === 2 || ticketStatus === 6">
            <!-- 已接单、处理中 -->
            <a-button @click="addWorkOrder">添加关联工单</a-button>
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <!-- <ModalCloseOrder :reload="reload" /> -->
            <ModalFeedbackOrder :reload="reload" />
            <ModalRelayOrder :ticketData="ticketData" :reload="reload" :buttonName="'转单'" :modalTitle="'选择处理人'" />
          </template>
          <template v-else-if="ticketStatus === 3">
            <!-- 待验收 -->
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <ModalCreateRevisit :reload="reload" />
            <ModalApproveOrder :reload="reload" />
          </template>
          <template v-else-if="ticketStatus === 11">
            <!-- 暂停 -->
            <ModalContinueOrder :reload="reload"></ModalContinueOrder>
          </template>
          <template v-else-if="ticketStatus">
            <!-- 已通过/未通过/已取消/已关闭 -->
            <ModalCreateRevisit :reload="reload" />
          </template>
        </template>
        <template v-if="activeTab === 1"></template>
        <template v-if="activeTab === 2"></template>
      </a-space>
    </template>
    <WorkSomethingDetail ref="refTicketDetail" v-show="activeTab === 0" :id="ticketId" :type="'COMPLAIN'"></WorkSomethingDetail>
    <WorkCommentDetail ref="refCommentDetail" v-show="activeTab === 1" :ticketId="ticketId"></WorkCommentDetail>
    <WorkRevisitDetailList ref="refRevisitDetailList" v-show="activeTab === 2" :id="ticketId"></WorkRevisitDetailList>
  </WorkGuestOriented>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import WorkGuestOriented from "@/components/Work/WorkGuestOriented.vue";
import { useRoute, useRouter } from "vue-router";
import WorkSomethingDetail from "@/components/Work/WorkSomethingDetail.vue";
import WorkRevisitDetailList from "@/components/Work/WorkRevisitDetailList.vue";
import WorkCommentDetail from "@/components/Work/WorkCommentDetail.vue";
import ModalChildrenOrder from "@/components/Work/Modal/ChildrenOrder.vue";
import ModalCreateRevisit from "@/components/Work/Modal/CreateRevisit.vue";
import ModalRelayOrder from "@/components/Work/Modal/RelayOrder.vue";
import ModalApproveOrder from "@/components/Work/Modal/ApproveOrder.vue";
// import ModalCloseOrder from "@/components/Work/Modal/CloseOrder.vue";
import ModalHandleOrder from "@/components/Work/Modal/HandleOrder.vue";
import ModalFeedbackOrder from "@/components/Work/Modal/FeedbackOrder.vue";
import ModalContinueOrder from "@/components/Work/Modal/ContinueOrder.vue";
import ModalPauseOrder from "@/components/Work/Modal/PauseOrder.vue";
import JobOvertimeConfig from "@/api/tenant/JobOvertimeConfig";
export default defineComponent({
  name: "guest-report-detail-component",
  components: {
    WorkGuestOriented,
    WorkSomethingDetail,
    WorkRevisitDetailList,
    WorkCommentDetail,
    ModalChildrenOrder,
    ModalCreateRevisit,
    ModalRelayOrder,
    ModalApproveOrder,
    // ModalCloseOrder,
    ModalHandleOrder,
    ModalFeedbackOrder,
    ModalContinueOrder,
    ModalPauseOrder,
  },
  props: {
    defaultTab: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props) {
    const tabs = ["投诉详情", "评价详情", "回访详情"];
    const activeTab = ref(props.defaultTab);
    const route = useRoute();
    const ticketId = route.params.id as string;
    const refTicketDetail = ref();
    const refCommentDetail = ref();
    const refRevisitDetailList = ref();
    const ticketStatus = computed(() => {
      return refTicketDetail.value?.data?.state;
    });
    const ticketData = computed(() => {
      return refTicketDetail.value?.data;
    });
    const reload = () => {
      refTicketDetail.value?.load();
      refCommentDetail.value?.load();
      refRevisitDetailList.value?.load();
    };
    const router = useRouter();
    const addWorkOrder = () => {
      router.push({ name: "ResidentCreateComplainAssociatedWorkOrder", params: { ticketId } });
    };
    const isJobOvertime = ref(false);
    watch(ticketData, () => {
      if (ticketData.value?.jobId) {
        JobOvertimeConfig.getDetailByJobIdAndStatus(ticketData.value.jobId, ticketData.value.state)
          .then((res) => {
            if (res.overtimeSwitch === 1) {
              isJobOvertime.value = true;
            } else {
              isJobOvertime.value = false;
            }
          })
          .catch(() => {
            isJobOvertime.value = false;
          });
      }
    });
    return {
      ticketId,
      tabs,
      activeTab,
      refTicketDetail,
      refCommentDetail,
      refRevisitDetailList,
      ticketStatus,
      ticketData,
      isJobOvertime,
      reload,
      addWorkOrder,
    };
  },
});
</script>

<style lang="less" scoped>
.guest-report-detail-component {
}
</style>
