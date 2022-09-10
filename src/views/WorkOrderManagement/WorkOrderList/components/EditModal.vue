<template>
  <a-modal v-model:visible="visible" title="工单编辑" title-align="start" width="600px" @before-ok="handleBeforeOk">
    <a-form :model="formData">
      <a-form-item label="工单类型">
        <a-select placeholder="请选择工单类型" v-model="formData.type">
          <a-option :value="1" label="周期"></a-option>
          <a-option :value="2" label="临时"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="工单编号">{{ formData.t_code }}</a-form-item>
      <a-form-item label="工单归属">{{ formData.t_attribution }}</a-form-item>
      <a-form-item label="工单地点">{{ formData.t_position }}</a-form-item>
      <a-form-item label="工单状态">
        <a-select placeholder="请设置工单状态" v-model="formData.status">
          <a-option :value="Number(item)" :label="TICKET_STATUS[item]" v-for="(item, index) in Object.keys(TICKET_STATUS)" :key="index"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="优先级">
        <a-select placeholder="请设置优先级" v-model="formData.priority">
          <a-option
            :value="Number(item)"
            :label="TICKET_PRIORITY[item]"
            v-for="(item, index) in Object.keys(TICKET_PRIORITY)"
            :key="index"
          ></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="处理人">
        <a-select placeholder="请选择处理人" v-model="formData.currentProcessor">
          <a-option :value="formData.currentProcessor" :label="formData.currentProcessor"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="工单创建时间"> {{ formData.t_createdTime }} </a-form-item>
      <a-form-item label="开始处理时间" v-if="formData.startTime"> {{ formatDateTime(formData.startTime) }} </a-form-item>
      <a-form-item label="处理完成时间" v-if="formData.endTime"> {{ formatDateTime(formData.endTime) }} </a-form-item>
      <a-form-item label="审核/验收人">{{ formData.approve }}</a-form-item>
      <!-- <a-form-item label="关联事件">{{ formData.t_position }}</a-form-item> -->
      <a-form-item label="图片" v-if="formData.eventPicture">
        <a-image width="150" height="150" :src="formData.eventPicture" />
      </a-form-item>
      <a-form-item label="工单过程">
        <a-spin :loading="logListLoading">
          <a-timeline mode="left">
            <a-timeline-item v-for="(log, index) in logListData" :key="index" :label="formatDateTime(log.updatedTime)">
              <a-descriptions :column="3">
                <a-descriptions-item label="处理人">
                  {{ log.processorName }}
                </a-descriptions-item>
                <a-descriptions-item label="描述">
                  {{ log.content }}
                </a-descriptions-item>
                <a-descriptions-item label="图片" v-if="log.eventPicture">
                  <a-image width="80" height="80" :src="log.eventPicture" />
                </a-descriptions-item>
              </a-descriptions>
            </a-timeline-item>
          </a-timeline>
        </a-spin>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch, WatchStopHandle } from "vue";
import { TICKET_STATUS, TICKET_PRIORITY } from "@/hooks/ticket";
import { formatDateTime } from "@/utils/utils";
import Ticket, { TicketData, TicketLogList } from "@/api/ticket/Ticket";
import Message from "@/utils/Message";

export default defineComponent({
  name: "edit-modal",
  setup() {
    const formData = ref<any>({});
    const logListLoading = ref(false);
    const logListData = ref<TicketLogList[]>([]);
    const visible = ref(false);
    let isChange = false;
    let refreshTable: () => void;
    let watcher: WatchStopHandle;
    watch(visible, () => {
      if (visible.value) {
        //
      } else {
        watcher && watcher();
        isChange = false;
        logListLoading.value = false;
        logListData.value = [];
      }
    });
    const handleBeforeOk = (done: (isDone: boolean) => void) => {
      if (isChange) {
        // update
        const data = formData.value as TicketData;
        Ticket.update({
          tenantId: data.tenantId,
          ticketId: data.ticketId,
          type: data.type,
          status: data.status,
          priority: data.priority,
          currentProcessor: data.currentProcessor,
        })
          .then(() => {
            done(true);
            refreshTable && refreshTable();
          })
          .catch((err) => {
            if (!err.isTips) {
              Message.error("修改失败");
            }
            done(false);
            throw err;
          });
      } else {
        done(true);
      }
    };
    const openModal = (data: any, _refreshTable: () => void) => {
      console.log("data", data);
      logListLoading.value = true;
      Ticket.getLogList(data.ticketId)
        .then((res) => {
          // console.log("res", res);
          logListData.value = res;
        })
        .finally(() => {
          logListLoading.value = false;
        });
      formData.value = data;
      visible.value = true;
      refreshTable = _refreshTable;
      watcher = watch(
        formData,
        () => {
          isChange = true;
        },
        { deep: true },
      );
    };
    return {
      formData,
      visible,
      logListData,
      logListLoading,
      openModal,
      handleBeforeOk,
      TICKET_STATUS,
      TICKET_PRIORITY,
      formatDateTime,
    };
  },
});
</script>
<style lang="less" scoped>
:deep(.arco-image-img) {
  object-fit: cover;
}
</style>
