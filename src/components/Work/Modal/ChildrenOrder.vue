<template>
  <a-button @click="onShow">{{ buttonName }}</a-button>
  <a-modal v-model:visible="visible" :title="modalTitle" title-align="start" :width="800">
    <a-table :columns="tableColumns" :data="tableData">
      <template #operation="{ record }">
        <a-link @click="$router.push({ name: 'WorkOrderListDetail', params: { id: record.ticketId, model: 'View' } })">查看详情</a-link>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts">
import Ticket from "@/api/tenant/Ticket";
import { useAppStore } from "@/store";
import { TableColumnData } from "@arco-design/web-vue";
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
const tableColumns: TableColumnData[] = [
  {
    dataIndex: "No",
    title: "序号",
  },
  {
    dataIndex: "serviceClassName",
    title: "工单业务",
  },
  {
    dataIndex: "jobName",
    title: "工单事件",
  },
  {
    dataIndex: "placeName",
    title: "工单地点",
  },
  {
    dataIndex: "stateName",
    title: "状态",
  },
  {
    slotName: "operation",
    title: "操作",
  },
];
/**
 * 子工单列表
 */
export default defineComponent({
  name: "modal-children-order",
  props: {
    buttonName: {
      type: String,
      default: () => "查看关联工单",
    },
    modalTitle: {
      type: String,
      default: () => "关联工单列表",
    },
  },
  setup() {
    //
    const visible = ref(false);
    const onShow = () => {
      visible.value = true;
      loadData();
    };
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const ticketStatusMap = computed(() => {
      return appStore.ticketStatusMap as any;
    });
    const route = useRoute();
    const loading = ref(false);
    const tableData = ref<any[]>([]);
    const loadData = () => {
      loading.value = true;
      const ticketId = route.params.id as string;
      console.log(ticketId);
      Ticket.findListByParentTicketId(ticketId)
        .then((res) => {
          tableData.value = res.map((item, index) => {
            return {
              key: item.ticketId,
              No: index + 1,
              serviceClassName: serviceClassMap.value[item.serviceClass]?.label,
              stateName: ticketStatusMap.value[item.state]?.label,
              ...item,
            };
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };
    return {
      visible,
      tableColumns,
      tableData,
      onShow,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-children-order {
}
</style>
