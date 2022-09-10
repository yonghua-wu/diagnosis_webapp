<!-- 暂时使用品质管理巡逻计划数据 -->
<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="del"
    :operation="['view']"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['设备维护', '设备巡检计划']" />
    </template>
    <template #table-status="{ record }">
      <a-switch @click.stop="changeStatus(record)" :model-value="record.data.status === 1">
        <template #checked>开</template>
        <template #unchecked>关</template>
      </a-switch>
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from "vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import MechanicalElectricalPlan, { MechanicalElectricalPlanModel, MechanicalElectricalPlanQueryModel } from "@/api/tenant/MechanicalElectricalPlan";
import { getFreq } from "@/utils/cronUtils";
import { deepClone, formatDateTime } from "@/utils/utils";
import Message from "@/utils/Message";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { PATROL_PLAN_SWITCH_OPEN, PATROL_PLAN_SWITCH_CLOSE, PATROL_PLAN_SWITCH_MAP_KEYS, PATROL_PLAN_SWITCH_MAP } from "@/store/modules/dict/types";
import { TableRowSelection } from "@arco-design/web-vue";
import moment from "moment";

export default defineComponent({
  name: "envmanagement-plan",
  components: {
    SfTablePage,
    Breadcrumb,
  },
  setup() {
    const { formatLoadData } = useFormatData<MechanicalElectricalPlanModel>((item) => {
      return {
        key: item.id,
        data: item,
        planName: item.planName,
        routeName: item.cyclicalPatrolRoutes.length ? item.cyclicalPatrolRoutes.map((v) => v.routeName).reduce((a, b) => `${a}，${b}`) : "",
        freq: item.cyclicalPlanTasks?.[0].cronExpress && getFreq(item.cyclicalPlanTasks?.[0].cronExpress),
        nextExecuteTime: formatDateTime(item.nextExecuteTime),
        updatedBy: item.updatedBy,
        updatedTime: item.updatedTime,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "巡逻计划名称",
            dataIndex: "planName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "巡逻路线",
            dataIndex: "routeName",
            ellipsis: true,
            tooltip: true,
            filterable: {
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
              group: 1,
              sort: 2,
              type: "radio",
              queryField: "status",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...([PATROL_PLAN_SWITCH_OPEN, PATROL_PLAN_SWITCH_CLOSE] as PATROL_PLAN_SWITCH_MAP_KEYS).map((item) => {
                  const serviceClass = PATROL_PLAN_SWITCH_MAP[item];
                  return {
                    text: serviceClass.text,
                    value: serviceClass.value,
                  };
                }),
              ],
            },
          },
        ];
      }),
      ["NO", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const formatQueryData = (_query: Record<string, any>) => {
      interface Query extends MechanicalElectricalPlanQueryModel {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return MechanicalElectricalPlan.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return MechanicalElectricalPlan.delete(id);
        }),
      );
    };
    const refSfTablePage = ref();
    const changeStatus = (record: any) => {
      if (record.data.status === 2) {
        console.log("开");
        MechanicalElectricalPlan.enable(record.data.id).then(() => {
          Message.success("成功");
          refSfTablePage.value.reLoadData();
        });
      } else {
        console.log("关");
        MechanicalElectricalPlan.disable(record.data.id).then(() => {
          Message.success("成功");
          refSfTablePage.value.reLoadData();
        });
      }
    };
    const rowSelection = reactive<TableRowSelection>({
      selectedRowKeys: [],
    });
    return {
      refSfTablePage,
      tableColumns,
      queryData,
      rowSelection,
      formatLoadData,
      loadData,
      del,
      changeStatus,
    };
    // const refSfTable = ref();
    // const loadData = MechanicalElectricalPlan.page;
    // const appStore = useAppStore();
    // const serviceClassMap = computed(() => {
    //   return appStore.serviceClassMap as any;
    // });
    // const formatLoadData = (data: MechanicalElectricalPlanModel[]) => {
    //   return data.map((item) => {
    //     return {
    //       key: item.id,
    //       data: item,
    //       planName: item.planName,
    //       routeName: item.cyclicalPatrolRoutes.length ? item.cyclicalPatrolRoutes.map((v) => v.routeName).reduce((a, b) => `${a}，${b}`) : "",
    //       freq: item.cyclicalPlanTasks?.[0].cronExpress && getFreq(item.cyclicalPlanTasks?.[0].cronExpress),
    //       jobServiceClass: serviceClassMap.value[item.jobServiceClass].label,
    //       nextExecuteTime: formatDateTime(item.nextExecuteTime),
    //       updatedBy: item.updatedBy,
    //       updatedTime: item.updatedTime,
    //     };
    //   });
    // };
    // const selectedRowKeys = ref<string[]>([]);
    // const tableColumns: RdTableColumnData[] = reactive([
    //   {
    //     title: "巡逻计划名称",
    //     dataIndex: "planName",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "巡逻路线",
    //     dataIndex: "routeName",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "频次",
    //     dataIndex: "freq",
    //     width: 80,
    //   },
    //   {
    //     title: "下次执行时间",
    //     dataIndex: "nextExecuteTime",
    //     width: 180,
    //   },
    //   {
    //     title: "状态",
    //     slotName: "table-status",
    //     width: 80,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "radio",
    //       queryField: "status",
    //       defaultValue: "-999",
    //       filters: [
    //         {
    //           text: "全部",
    //           value: "-999",
    //         },
    //         {
    //           text: "开启",
    //           value: "1",
    //         },
    //         {
    //           text: "关闭",
    //           value: "2",
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     title: "操作人",
    //     dataIndex: "updatedBy",
    //     ellipsis: true,
    //     tooltip: true,
    //     width: 100,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "操作时间",
    //     dataIndex: "updatedTime",
    //     ellipsis: true,
    //     tooltip: true,
    //     width: 180,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "range-picker",
    //     },
    //   },
    // ]);
    // const queryData = reactive<any>({
    //   status: "-999",
    // });
    // const formatQueryData = (data: any) => {
    //   const q: any = {};
    //   Object.keys(data).forEach((k) => {
    //     if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
    //       q[k] = data[k];
    //     }
    //   });
    //   data.field && (q[data.field] = data.search);
    //   return q;
    // };
    // const del = MechanicalElectricalPlan.delete;
    // const dels = (selectedKeys: string[]) => {
    //   return Promise.all(
    //     selectedKeys.map((id) => {
    //       return MechanicalElectricalPlan.delete(id);
    //     }),
    //   );
    // };
    // const changeStatus = (record: any) => {
    //   if (record.data.status === 2) {
    //     console.log("开");
    //     MechanicalElectricalPlan.enable(record.data.id).then(() => {
    //       refSfTable.value.tableLoadData();
    //       // record.data.status = 1;
    //       Message.success("成功");
    //     });
    //   } else {
    //     console.log("关");
    //     MechanicalElectricalPlan.disable(record.data.id).then(() => {
    //       refSfTable.value.tableLoadData();
    //       // record.data.status = 2;
    //       Message.success("成功");
    //     });
    //   }
    // };
    // return {
    //   refSfTable,
    //   loadData,
    //   serviceClassMap,
    //   formatLoadData,
    //   selectedRowKeys,
    //   tableColumns,
    //   queryData,
    //   formatQueryData,
    //   del,
    //   dels,
    //   changeStatus,
    // };
  },
});
</script>

<style lang="less" scoped></style>
