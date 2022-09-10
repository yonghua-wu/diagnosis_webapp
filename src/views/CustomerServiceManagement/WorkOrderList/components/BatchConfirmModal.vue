<template>
  <a-modal v-model:visible="visible" title="验收工单" title-align="start" width="500px">
    <!-- <p>
      您选择了
      <span>{{ selectedDatas.length }}</span>
      个工单进行验收操作
    </p> -->
    <a-form :model="formData">
      <a-form-item label="处理备注" field="remark">
        <a-textarea
          v-model="formData.remark"
          placeholder="请输入备注"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 3, maxRows: 6 }"
        ></a-textarea>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="clickNoPass">验收不通过</a-button>
        <a-button @click="clickPass" type="primary">验收通过</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts">
import Ticket, { TicketModel } from "@/api/tenant/Ticket";
import Message from "@/utils/Message";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "batch-confirm-modal",
  setup() {
    const formData = ref<any>({
      remark: "",
    });
    const visible = ref(false);
    const selectedDatas = ref<TicketModel[]>([]);
    let refreshTable: () => void;
    const loading = ref(false);
    const clickPass = () => {
      loading.value = true;
      submit(true).finally(() => {
        loading.value = false;
      });
    };
    const clickNoPass = () => {
      loading.value = true;
      submit(false).finally(() => {
        loading.value = false;
      });
    };
    const submit = (isPass: boolean) => {
      const p = selectedDatas.value.map((item) => {
        return Ticket.approveTicket({
          approveStatus: isPass ? 1 : 2,
          remark: formData.value.remark,
          ticketId: item.ticketId,
        });
      });
      return Promise.all(p)
        .then(() => {
          refreshTable?.();
          visible.value = false;
        })
        .catch(() => {
          Message.error("审批失败");
        });
    };
    const openModal = (_selectedDatas: TicketModel[], _refreshTable: () => void) => {
      selectedDatas.value = _selectedDatas;
      refreshTable = _refreshTable;
      visible.value = true;
      formData.value.remark = "";
    };
    return {
      visible,
      selectedDatas,
      formData,
      openModal,
      clickPass,
      clickNoPass,
    };
  },
});
</script>
