<template>
  <a-modal v-model:visible="visible" title="创建新工单" title-align="start" width="500px" @before-ok="handleBeforeOk">
    <a-form :model="formData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 16 }">
      <a-form-item label="工单类型">
        <a-select placeholder="请选择工单类型" v-model="formData.type">
          <a-option :value="1" label="周期"></a-option>
          <a-option :value="2" label="临时"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="工单归属">
        <a-select placeholder="请选择工单归属" v-model="formData.ascription">
          <a-option value="保洁" label="保洁"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="工单地点">
        <a-select placeholder="请选择工单地点">
          <a-option value="A栋垃圾房" label="A栋垃圾房"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="优先级">
        <a-select placeholder="请选择优先级" v-model="formData.priority">
          <a-option
            :value="Number(item)"
            :label="TICKET_PRIORITY[item]"
            v-for="(item, index) in Object.keys(TICKET_PRIORITY)"
            :key="index"
          ></a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="指派处理人" v-model="formData.currentProcessor">
        <a-select placeholder="请选择指派处理人" allow-clear>
          <a-option value="狂徒张三" label="狂徒张三"></a-option>
        </a-select>
        <a-tooltip content="留空则工单引擎自动分配">
          <span style="padding-left: 4px"><icon-question-circle /></span>
        </a-tooltip>
      </a-form-item>
      <a-form-item label="上传照片">
        <a-upload list-type="picture-card" action="/" image-preview />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { TICKET_STATUS, TICKET_PRIORITY } from "@/hooks/ticket";
import Ticket, { TicketData } from "@/api/ticket/Ticket";
import Message from "@/utils/Message";

export default defineComponent({
  name: "create-modal",
  setup() {
    const formData = ref({
      type: 1,
      ascription: "",
      priority: 0,
      currentProcessor: "",
    });
    const visible = ref(false);
    let refreshTable: () => void;
    const openModal = (_refreshTable: () => void) => {
      refreshTable = _refreshTable;
      visible.value = true;
    };
    const handleBeforeOk = (done: (isDone: boolean) => void) => {
      Ticket.create(formData.value as TicketData)
        .then(() => {
          done(true);
          refreshTable();
        })
        .catch((err) => {
          if (err.isTips) {
            Message.error("创建失败");
          }
          done(false);
        });
    };
    return {
      formData,
      visible,
      openModal,
      handleBeforeOk,
      TICKET_STATUS,
      TICKET_PRIORITY,
    };
  },
});
</script>
