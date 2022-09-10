<template>
  <SfTable
    ref="refSfTable"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :formatQueryData="formatQueryData"
    :tableColumns="tableColumns"
    v-model:queryData="queryData"
    :row-delete="del"
    :click-selected-delete="dels"
    v-model:selectedRowKeys="selectedRowKeys"
    :operation="['view']"
    :add-button-text="'添加'"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['环境管理', '维保计划']" />
    </template>
    <template #table-status="{ record }">
      <a-switch @click.stop="changeStatus(record)" :model-value="record.data.status === 1">
        <template #checked>开</template>
        <template #unchecked>关</template>
      </a-switch>
    </template>
  </SfTable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import MaintenancePlan, { MaintenancePlanModel } from "@/api/tenant/EnvMaintenancePlan";
import Message from "@/utils/Message";
import { useAppStore } from "@/store";
import { getFreq } from "@/utils/cronUtils";
import { formatDateTime } from "@/utils/utils";
import SfTable from "@/components/lib/RD3/SfTable";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
import moment from "moment";

export default defineComponent({
  name: "inspection-plan",
  components: {
    Breadcrumb,
    //RD2Vue,
    SfTable,
  },
  setup() {
    const refSfTable = ref();
    const loadData = MaintenancePlan.page;
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const formatLoadData = (data: MaintenancePlanModel[]) => {
      return data.map((item) => {
        return {
          key: item.id,
          data: item,
          planName: item.planName,
          placeName: item.cyclicalMaintenancePlaces.length
            ? item.cyclicalMaintenancePlaces.map((v) => v.placeName).reduce((a, b) => `${a}，${b}`)
            : "",
          freq: item.cyclicalPlanTasks?.[0].cronExpress && getFreq(item.cyclicalPlanTasks?.[0].cronExpress),
          jobServiceClass: serviceClassMap.value[item.jobServiceClass].label,
          nextExecuteTime: formatDateTime(item.nextExecuteTime),
        };
      });
    };
    const selectedRowKeys = ref<string[]>([]);
    const tableColumns: RdTableColumnData[] = reactive([
      {
        title: "维保计划名称",
        dataIndex: "planName",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "维保地点",
        dataIndex: "placeName",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "频次",
        dataIndex: "freq",
        width: 80,
      },
      {
        title: "下次执行时间",
        dataIndex: "nextExecuteTime",
        width: 180,
      },
      {
        title: "状态",
        slotName: "table-status",
        width: 80,
        filterable: {
          align: "filter-bar",
          type: "radio",
          queryField: "status",
          defaultValue: "-999",
          filters: [
            {
              text: "全部",
              value: "-999",
            },
            {
              text: "开启",
              value: "1",
            },
            {
              text: "关闭",
              value: "2",
            },
          ],
        },
      },
      {
        title: "操作人",
        dataIndex: "updatedBy",
        ellipsis: true,
        tooltip: true,
        width: 100,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "操作时间",
        dataIndex: "updatedTime",
        ellipsis: true,
        tooltip: true,
        width: 180,
        filterable: {
          align: "filter-bar",
          type: "range-picker",
        },
      },
    ]);
    const queryData = reactive<any>({
      status: "-999",
    });
    const formatQueryData = (data: any) => {
      const q: any = {};
      if (data["updatedTime"]?.length > 0) {
        q["startUpdatedTime"] = moment(data["updatedTime"][0]).format("YYYY-MM-DD HH:mm:ss");
        q["endUpdatedTime"] = moment(data["updatedTime"][1]).add(1, "days").format("YYYY-MM-DD HH:mm:ss");
      }
      Object.keys(data).forEach((k) => {
        if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
          q[k] = data[k];
        }
      });
      data.field && (q[data.field] = data.search);
      return q;
    };
    const del = MaintenancePlan.delete;
    const dels = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return MaintenancePlan.delete(id);
        }),
      );
    };
    const changeStatus = (record: any) => {
      if (record.data.status === 2) {
        console.log("开");
        MaintenancePlan.enable(record.data.id).then(() => {
          console.log(refSfTable);
          refSfTable.value.tableLoadData();
          Message.success("成功");
        });
      } else {
        console.log("关");
        MaintenancePlan.disable(record.data.id).then(() => {
          console.log(refSfTable);
          refSfTable.value.tableLoadData();
          Message.success("成功");
        });
      }
    };

    return {
      changeStatus,
      refSfTable,
      loadData,
      formatLoadData,
      formatQueryData,
      tableColumns,
      queryData,
      del,
      dels,
      selectedRowKeys,
    };
  },
});
</script>

<style lang="less" scoped>
.inspection-plan {
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
