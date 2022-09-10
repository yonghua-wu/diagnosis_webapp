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
      <Breadcrumb :items="['环境管理', '日常工作计划']" />
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
import Breadcrumb from "@/components/Breadcrumb.vue";
import EnvironmnetPlan, { EnvironmentPlanModel, EnvironmentPlanQueryModel } from "@/api/tenant/EnvManagementPlan";
import { getFreq } from "@/utils/cronUtils";
import { deepClone, formatDateTime } from "@/utils/utils";
import Message from "@/utils/Message";
import moment from "moment";
import { SfTableColumnData } from "@/components/lib/SfTable";
import SfTablePage, { useFormatData, useTableColumns, useQueryData, useFilterDefaultValueQueryData } from "@/components/lib/SfTablePage";
import { PATROL_PLAN_SWITCH_OPEN, PATROL_PLAN_SWITCH_CLOSE, PATROL_PLAN_SWITCH_MAP_KEYS, PATROL_PLAN_SWITCH_MAP } from "@/store/modules/dict/types";
import { TableRowSelection } from "@arco-design/web-vue";

export default defineComponent({
  name: "envmanagement-plan",
  components: {
    SfTablePage,
    Breadcrumb,
  },
  setup() {
    const { formatLoadData } = useFormatData<EnvironmentPlanModel>((item) => {
      return {
        key: item.id,
        data: item,
        planName: item.planName,
        routeName: item.cyclicalPatrolRoutes?.length ? item.cyclicalPatrolRoutes.map((v) => v.routeName).reduce((a, b) => `${a}，${b}`) : "",
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
            title: "工作计划名称",
            dataIndex: "planName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "工作路线",
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
      interface Query extends EnvironmentPlanQueryModel {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return EnvironmnetPlan.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return EnvironmnetPlan.delete(id);
        }),
      );
    };
    const refSfTablePage = ref();
    const changeStatus = (record: any) => {
      if (record.data.status === 2) {
        console.log("开");
        EnvironmnetPlan.enable(record.data.id).then(() => {
          Message.success("成功");
          refSfTablePage.value.reLoadData();
        });
      } else {
        console.log("关");
        EnvironmnetPlan.disable(record.data.id).then(() => {
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
  },
});
</script>

<style lang="less" scoped></style>
