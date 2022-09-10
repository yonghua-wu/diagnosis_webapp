<template>
  <RDVue
    ref="refRDVue"
    v-model="tableDataList"
    :tableColumn="columns"
    :decorateLoadData="loadDevicePlan"
    :close-pagination="true"
    :closeSelectRow="true"
    style="width: 100%"
    :scroll="{ x: 1000, y: 500 }"
  >
    <template #selected-options> <div class="section-title">维保计划</div> </template>
  </RDVue>
</template>

<script lang="ts">
import MaintenancePlan, { MaintenancePlanModel } from "@/api/tenant/MaintenancePlan";
import { computed, defineComponent, ref, toRefs } from "vue";
import RDVue from "@/components/lib/RD";
import { getFreq } from "@/utils/cronUtils";
import { TableColumnData } from "@arco-design/web-vue";
import { formatDateTime } from "@/utils/utils";

const columns: TableColumnData[] = [
  {
    title: "维保计划名称",
    dataIndex: "t_planName",
  },
  {
    title: "维保地点",
    dataIndex: "t_placeName",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "计划执行人",
    dataIndex: "t_toName",
  },
  {
    title: "频次",
    dataIndex: "t_frequency",
  },
  {
    title: "下次触发时间",
    dataIndex: "t_nextExecuteTime",
  },
];

export default defineComponent({
  name: "device-log-table",
  components: {
    RDVue,
  },
  props: {
    placeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { placeId } = toRefs(props);
    const devicePlan = ref<MaintenancePlanModel[]>([]);
    const tableDataList = computed(() => {
      return devicePlan.value.map((d) => {
        return {
          t_planName: d.planName,
          t_placeName: d.cyclicalMaintenancePlaces.length ? d.cyclicalMaintenancePlaces.map((v) => v.placeName).reduce((a, b) => `${a}，${b}`) : "",
          t_toName: d.toName,
          t_frequency: d.cyclicalPlanTasks?.[0].cronExpress && getFreq(d.cyclicalPlanTasks?.[0].cronExpress),
          t_nextExecuteTime: formatDateTime(d.nextExecuteTime),
        };
      });
    });
    const loadDevicePlan = () => {
      return MaintenancePlan.pageByPlaceId({
        placeId: placeId.value,
      }).then((res) => {
        devicePlan.value = res;
        return res;
      });
    };
    return {
      loadDevicePlan,
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
