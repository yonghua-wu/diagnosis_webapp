<template>
  <a-modal v-model:visible="visible" title="转移工单" title-align="start" width="500px" @before-ok="handleBeforeOk">
    <p>
      您选择了<span>{{ selectedDatas.length }}</span
      >个工单进行批量转单操作
    </p>
    <a-form ref="refForm" :model="formData">
      <a-form-item :rules="rules.staffId" label="转移给" field="staffId">
        <a-select placeholder="请选择员工" v-model="formData.staffId">
          <a-option :label="staff.name" :value="staff.staffId" :key="index" v-for="(staff, index) in staffDataList"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item :rules="rules.remark" label="备注" field="remark">
        <a-textarea
          v-model="formData.remark"
          placeholder="请输入备注"
          :max-length="200"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          show-word-limit
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { TicketModel } from "@/api/tenant/Ticket";
import { defineComponent, ref } from "vue";
import Staff, { StaffModel } from "@/api/tenant/Staff";
import Ticket from "@/api/tenant/Ticket";
import Message from "@/utils/Message";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
export default defineComponent({
  name: "batch-move-modal",
  setup() {
    const formData = ref<any>({
      remark: "",
      staffId: "",
    });
    const rules = {
      staffId: new RulesLib().required("请选择员工").done(),
      remark: new RulesLib().done(),
    };
    const visible = ref(false);
    const selectedDatas = ref<TicketModel[]>([]);
    const staffDataList = ref<StaffModel[]>([]);
    let refreshTable: () => void;
    const refForm = ref();
    const handleBeforeOk = (done: (isDone: boolean) => void) => {
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          const p = selectedDatas.value.map((item) => {
            return Ticket.transferTicket({
              ticketId: item.ticketId,
              remark: formData.value.remark,
              transferId: formData.value.staffId,
            });
          });
          Promise.all(p)
            .then(() => {
              done(true);
              refreshTable?.();
            })
            .catch(() => {
              Message.error("转单失败");
              done(false);
            });
        } else {
          done(false);
        }
      });
    };
    const openModal = (_selectedDatas: TicketModel[], _refreshTable: () => void) => {
      selectedDatas.value = _selectedDatas;
      const m: Record<number, boolean> = {};
      let serviceClass: any = null;
      for (let i = 0; i < _selectedDatas.length; i++) {
        m[_selectedDatas[i].serviceClass] = true;
        serviceClass = _selectedDatas[i].serviceClass;
      }
      if (Object.keys(m).length > 1) {
        Message.error("不能同时对不同业务进行转单");
        return;
      }
      refreshTable = _refreshTable;
      visible.value = true;
      formData.value.remark = "";
      formData.value.staffId = "";
      Staff.findByServiceClass(serviceClass).then((res) => {
        staffDataList.value = res;
      });
    };
    return {
      refForm,
      rules,
      staffDataList,
      formData,
      visible,
      selectedDatas,
      openModal,
      handleBeforeOk,
    };
  },
});
</script>
