<template>
  <RDVue
    ref="refRDVue"
    v-model="tableDataList"
    :tableColumn="columns"
    :decorateLoadData="loadDeviceLog"
    :closeSelectRow="true"
    style="width: 100%"
    :scroll="{ x: 1000 }"
  >
    <template #selected-options> <div class="section-title">维保记录</div> </template>
  </RDVue>
</template>

<script lang="ts">
import Device from "@/api/tenant/Device";
import { computed, defineComponent, ref, toRefs } from "vue";
import RDVue from "@/components/lib/RD";

const columns = [
  {
    title: "工单编号",
    dataIndex: "t_ticketId",
    width: 240,
  },
  {
    title: "类型",
    dataIndex: "t_maintenanceType",
  },
  {
    title: "执行人",
    dataIndex: "t_handler",
  },
  {
    title: "验收人",
    dataIndex: "t_supervisorName",
  },
  {
    title: "维保时间",
    dataIndex: "t_handlerDate",
  },
];

export default defineComponent({
  name: "device-log-table",
  components: {
    RDVue,
  },
  props: {
    deviceId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { deviceId } = toRefs(props);
    const deviceLog = ref<any[]>([]);
    const tableDataList = computed(() => {
      return deviceLog.value.map((d) => {
        return {
          t_ticketId: d.ticketId,
          t_maintenanceType: d.maintenanceType,
          t_handler: d.handler,
          t_supervisorName: d.supervisorName,
          t_handlerDate: d.handlerDate,
        };
      });
    });
    const loadDeviceLog = (queryData: any) => {
      return Device.deviceLogPage(queryData.current, queryData.pageSize, deviceId.value).then((res) => {
        deviceLog.value = res.list;
        return res;
      });
    };
    return {
      loadDeviceLog,
      tableDataList,
      columns,
    };
  },
});
</script>

<style lang="less" scoped>
.device-log-table {
}
</style>
