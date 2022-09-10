<template>
  <a-modal v-model:visible="visible" title="批量取消工单" title-align="start" width="500px" @before-ok="handleBeforeOk">
    <p>
      您选择了<span>{{ selectedDatas.length }}</span
      >个工单进行批量取消操作
    </p>
    <a-form :model="formData">
      <a-form-item label="处理备注" field="desc">
        <a-input :max-length="200" placeholder="请输入备注" v-model="formData.desc"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import Ticket, { TicketData } from "@/api/ticket/Ticket";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "batch-cancel-modal",
  setup() {
    const formData = ref<any>({
      desc: "",
    });
    const visible = ref(false);
    let selectedDatas = ref<TicketData[]>([]);
    let refreshTable: () => void;
    const handleBeforeOk = (done: (isDone: boolean) => void) => {
      const p = selectedDatas.value.map((item) => {
        return Ticket.update({
          tenantId: item.tenantId,
          ticketId: item.ticketId,
          status: 5,
        });
      });
      Promise.all(p)
        .then(() => {
          done(true);
          refreshTable();
        })
        .catch(() => {
          done(false);
        });
    };
    const openModal = (_selectedDatas: TicketData[], _refreshTable: () => void) => {
      selectedDatas.value = _selectedDatas;
      refreshTable = _refreshTable;
      visible.value = true;
    };
    return {
      formData,
      visible,
      selectedDatas,
      openModal,
      handleBeforeOk,
    };
  },
});
</script>
