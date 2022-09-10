<template>
  <div class="work-something-detail">
    <a-spin :loading="loading">
      <SfForm :model="data" :formModel="'View'">
        <SfFormItem field="serviceClass" label="业务">
          {{ serviceClassMap[data.serviceClass]?.label || "-" }}
        </SfFormItem>
        <SfFormItem field="ticketId" :label="DETAIL_TYPE_MAP[type] + '号'">
          {{ data.ticketId || "-" }}
        </SfFormItem>
        <SfFormItem field="productName" label="类型">
          {{ data.productName || "-" }}
        </SfFormItem>
        <SfFormItem field="placeName" :label="DETAIL_TYPE_MAP[type] + '地点'">
          {{ data.placeName || "-" }}
        </SfFormItem>
        <SfFormItem field="state" label="状态">
          {{ ticketStatusMap[data.state]?.label || "-" }}
        </SfFormItem>
        <SfFormItem field="jobName" label="事件">
          {{ data.jobName || "-" }}
        </SfFormItem>
        <SfFormItem field="createdBy" label="创建人">
          {{ data.createdBy || "-" }}
        </SfFormItem>
        <SfFormItem field="customName" label="客户姓名">
          {{ data.customName || "-" }}
        </SfFormItem>
        <SfFormItem field="customPhone" label="客户电话">
          {{ data.customPhone || "-" }}
        </SfFormItem>
        <SfFormItem field="refId" label="源工单编号" v-if="data.refId">
          <span>{{ data.refId || "-" }}</span>
          <a-link @click="goRefTicket">转到</a-link>
        </SfFormItem>
        <SfFormItem v-for="(item, index) in assistantData" :key="index" :label="'协助人 ' + (index + 1)">
          {{ item.assistantName || "-" }}
        </SfFormItem>
        <SfFormItem field="content" label="备注" :colProps="{ span: 24 }">
          {{ data.content || "-" }}
        </SfFormItem>
        <SfFormItem field="imgList" :label="DETAIL_TYPE_MAP[type] + '照片'" :colProps="{ span: 24 }">
          <a-image-preview-group infinite v-if="data.imgList?.length">
            <a-space>
              <a-image v-for="(img, index) in data.imgList" :key="index" :src="img?.url" width="60" />
            </a-space>
          </a-image-preview-group>
          <span v-else>无</span>
        </SfFormItem>
        <a-timeline mode="left" labelPosition="relative">
          <a-timeline-item v-for="(log, index) in ticketLog" :key="index" :label="ticketStatusMap[log.ticketStatus].label">
            <div style="margin-bottom: 8px">
              {{ log.createdTime }}
            </div>
            <a-descriptions :align="{ label: 'right' }" :column="1">
              <a-descriptions-item :label="log.executorType === 1 ? '处理人' : '操作人'">
                {{ log.executorName || "-" }}
              </a-descriptions-item>
              <a-descriptions-item label="备注">
                {{ log.remark || "-" }}
              </a-descriptions-item>
              <a-descriptions-item label="图片" v-if="index !== 0 && log.imgList">
                <a-image-preview-group infinite>
                  <a-space>
                    <a-image v-for="(img, index) in log.imgList" :key="index" :src="img" width="60" />
                  </a-space>
                </a-image-preview-group>
              </a-descriptions-item>
            </a-descriptions>
          </a-timeline-item>
        </a-timeline>
      </SfForm>
    </a-spin>
  </div>
</template>

<script lang="ts">
import Ticket, { AssistantModel, TicketLogModel } from "@/api/tenant/Ticket";
import { useAppStore } from "@/store";
import { computed, defineComponent, PropType, ref } from "vue";
import { useRouter } from "vue-router";
import SfForm from "../lib/CU/SfForm";
import SfFormItem from "../lib/CU/SfFormItem";
export const DETAIL_TYPE_MAP = {
  WORK_ORDER: "工单",
  COMPLAIN: "投诉",
  REPORT: "报事",
};
export default defineComponent({
  name: "work-something-detail",
  components: {
    SfForm,
    SfFormItem,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<keyof typeof DETAIL_TYPE_MAP>,
      required: true,
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const ticketStatusMap = computed(() => {
      return appStore.ticketStatusMap as any;
    });
    const data = ref<any>({});
    const assistantData = ref<AssistantModel[]>();
    const loading = ref(false);
    const loadData = () => {
      loading.value = true;
      Ticket.detail(props.id)
        .then((res) => {
          data.value = res;
          data.value.imgList = res.imgList
            ? res.imgList.map((item, index) => {
                return {
                  uid: index,
                  url: item,
                };
              })
            : [];
          return res;
        })
        .then(() => {
          return Ticket.findAssistantByTicketId(props.id).then((res) => {
            console.log(res);
            assistantData.value = res;
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const ticketLog = ref<TicketLogModel[]>([]);
    const ticketLogLoading = ref(false);
    const loadTicketLog = () => {
      ticketLogLoading.value = true;
      return Ticket.getTicketLog(props.id)
        .then((res) => {
          ticketLog.value = res;
        })
        .finally(() => {
          ticketLogLoading.value = false;
        });
    };
    const router = useRouter();
    const goRefTicket = () => {
      if (data.value.refIdType === 1) {
        // 报事工单
        router.push({ name: "ResidentReportListDetail", params: { model: "View", id: data.value.refId } });
      } else if (data.value.refIdType === 2) {
        // 投诉工单
        router.push({ name: "ResidentComplainListDetail", params: { model: "View", id: data.value.refId } });
      } else {
        router.push({ name: "WorkOrderListDetail", params: { model: "View", id: data.value.refId } });
      }
    };
    const load = () => {
      if (props.id) {
        loadData();
        loadTicketLog();
      }
    };
    load();
    return {
      loading,
      ticketLogLoading,
      data,
      assistantData,
      ticketLog,
      DETAIL_TYPE_MAP,
      serviceClassMap,
      ticketStatusMap,
      goRefTicket,
      load,
    };
  },
});
</script>

<style lang="less" scoped>
.work-something-detail {
  height: 100%;
  width: 100%;
}
</style>
