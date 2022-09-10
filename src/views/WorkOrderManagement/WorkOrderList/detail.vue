<template>
  <div class="add-employess container">
    <Breadcrumb :items="['工单管理', { name: '工单列表', router: () => $router.replace({ name: 'WorkOrderList' }) }, '详情']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="false">
        <template #extra>
          <!-- <a-button disabled>打印工单</a-button> -->
          <!-- <a-button v-if="formData.state === 5 || formData.state === 1 || formData.state === 2" @click="clickTransferTicket">转发工单</a-button> -->
          <!-- <a-button>编辑状态</a-button> -->
          <!-- <a-button v-if="evalStatus === 1" @click="clickEvaluation">客户回访</a-button> -->
          <!-- <a-button v-if="evalStatus === 2" disabled>已回访</a-button> -->
          <!-- <a-button v-if="formData.state === 3" type="primary" @click="clickConfirmTicket">验收工单</a-button> -->
          <ModalChildrenOrder />
          <template v-if="ticketStatus === 5">
            <!-- 待分配 -->
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <ModalCloseOrder :reload="reload" :button-name="'关闭'" :modal-title="'关闭此工单'" />
            <ModalCancelOrder :reload="reload" :button-name="'取消'" :modal-title="'取消此工单'" />
            <ModalRelayOrder :ticketData="ticketData" :reload="reload" :buttonName="'转单'" :modalTitle="'转发工单'" />
            <ModalAcceptTicket :reload="reload" />
          </template>
          <template v-else-if="ticketStatus === 1">
            <!-- 待接单 -->
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <ModalCloseOrder :reload="reload" :button-name="'关闭'" :modal-title="'关闭此工单'" />
            <ModalCancelOrder :reload="reload" :button-name="'取消'" :modal-title="'取消此工单'" />
            <ModalRelayOrder :ticketData="ticketData" :reload="reload" :buttonName="'转单'" :modalTitle="'转发工单'" />
            <ModalAcceptTicket :reload="reload" />
          </template>
          <template v-else-if="ticketStatus === 2">
            <!-- 已接单 -->
            <a-button @click="addWorkOrder">添加关联工单</a-button>
            <ModalAddAssistant :reload="reload" :ticketData="ticketData" :assistantList="assistantList" />
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <ModalCloseOrder :reload="reload" :button-name="'关闭'" :modal-title="'关闭此工单'" />
            <ModalCancelOrder :reload="reload" :button-name="'取消'" :modal-title="'取消此工单'" />
            <ModalRelayOrder :ticketData="ticketData" :reload="reload" :buttonName="'转单'" :modalTitle="'转发工单'" />
            <ModalFinishOrder :reload="reload" :buttonName="'完成'" :modalTitle="'工单完成'" />
          </template>
          <template v-else-if="ticketStatus === 3">
            <!-- 待验收 -->
            <ModalPauseOrder v-if="isJobOvertime" :reload="reload"></ModalPauseOrder>
            <ModalApproveOrder :reload="reload" />
          </template>
          <template v-else-if="ticketStatus === 11">
            <!-- 暂停 -->
            <ModalContinueOrder :reload="reload"></ModalContinueOrder>
          </template>
          <template v-else-if="ticketStatus">
            <!-- 已通过/未通过/已取消/已关闭 -->
          </template>
        </template>
        <WorkSomethingDetail ref="refTicketDetail" :id="ticketId" :type="'WORK_ORDER'"></WorkSomethingDetail>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import WorkSomethingDetail from "@/components/Work/WorkSomethingDetail.vue";
import ModalCancelOrder from "@/components/Work/Modal/CancelOrder.vue";
import ModalChildrenOrder from "@/components/Work/Modal/ChildrenOrder.vue";
import ModalCloseOrder from "@/components/Work/Modal/CloseOrder.vue";
import ModalHandleOrder from "@/components/Work/Modal/HandleOrder.vue";
import ModalRelayOrder from "@/components/Work/Modal/RelayOrder.vue";
import ModalFinishOrder from "@/components/Work/Modal/FinishOrder.vue";
import ModalApproveOrder from "@/components/Work/Modal/ApproveOrder.vue";
import ModalAddAssistant from "@/components/Work/Modal/AddAssistant.vue";
import ModalAcceptTicket from "@/components/Work/Modal/AcceptTicket.vue";
import ModalContinueOrder from "@/components/Work/Modal/ContinueOrder.vue";
import ModalPauseOrder from "@/components/Work/Modal/PauseOrder.vue";
import JobOvertimeConfig from "@/api/tenant/JobOvertimeConfig";
export default defineComponent({
  name: "DetailEmployess",
  components: {
    Breadcrumb,
    CUVue,
    WorkSomethingDetail,
    ModalCancelOrder,
    ModalChildrenOrder,
    ModalCloseOrder,
    // ModalHandleOrder,
    ModalRelayOrder,
    ModalFinishOrder,
    ModalApproveOrder,
    ModalAddAssistant,
    ModalAcceptTicket,
    ModalContinueOrder,
    ModalPauseOrder,
  },
  setup() {
    const route = useRoute();
    const ticketId = route.params.id as string;
    const refTicketDetail = ref();
    const ticketStatus = computed(() => {
      return refTicketDetail.value?.data?.state;
    });
    const ticketData = computed(() => {
      return refTicketDetail.value?.data;
    });
    const assistantList = computed(() => {
      return refTicketDetail.value?.assistantData;
    });
    const loading = computed(() => {
      return refTicketDetail.value?.loading;
    });
    const router = useRouter();
    const addWorkOrder = () => {
      router.push({ name: "CreateWorkOrderAssociatedWorkOrder", params: { ticketId } });
    };
    const reload = () => {
      refTicketDetail.value?.load?.();
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
      refTicketDetail,
      ticketId,
      ticketStatus,
      loading,
      ticketData,
      assistantList,
      isJobOvertime,
      addWorkOrder,
      reload,
    };
  },
});
</script>

<style lang="less" scoped>
.add-employess {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
:deep(.arco-upload-list.arco-upload-list-type-picture-card) {
  flex-wrap: nowrap;
}
</style>
