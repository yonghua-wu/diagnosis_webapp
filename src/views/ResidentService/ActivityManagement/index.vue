<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :operation="['view', 'opertion-publish']"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['客户服务', '活动管理']" />
    </template>
    <template #table-status="{ record }">
      <a-switch @click.stop="changeStatus(record)" :model-value="record.data.status === 1">
        <template #checked>开</template>
        <template #unchecked>关</template>
      </a-switch>
    </template>
    <template #table-seq="{ record }">
      <ChangeNumberSlot v-model:seq="record.data.seq" :idString="record.data.activityId" @updateView="updateView" />
    </template>
    <template #opertion-publish="{ record, defaultAttr }">
      <a-link :disabled="record.data.signUp === 2" v-bind="defaultAttr" @click.stop="checkSignUpInfo(record)">报名信息</a-link>
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import ActivityManagement, { ActivityManagementModel } from "@/api/tenant/ActivityManagement";
import moment from "moment";
import ChangeNumberSlot from "./components/ChangeNumberSlot.vue";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";
import Message from "@/utils/Message";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "activity-management-view",
  components: {
    Breadcrumb,
    SfTablePage,
    ChangeNumberSlot,
  },
  setup() {
    const { formatLoadData } = useFormatData<ActivityManagementModel>((item) => {
      return {
        key: item.activityId,
        data: item,
        activityTitle: item.activityTitle,
        activityStartTime: item.activityStartTime,
        activityEndTime: item.activityEndTime,
        seq: item.seq,
        signUp: item.signUp === 1 ? "是" : "否",
        createdBy: item.createdBy,
        createdTime: item.createdTime,
        status: item.status,
        duration: [],
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "标题名称",
            dataIndex: "activityTitle",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "生效开始时间",
            dataIndex: "activityStartTime",
            ellipsis: true,
            tooltip: true,
            filterable: {
              sort: 98,
              queryField: "duration",
              type: "range-picker",
              label: "生效时间",
            },
          },
          {
            title: "生效结束时间",
            dataIndex: "activityEndTime",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "活动排序",
            slotName: "table-seq",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "报名",
            dataIndex: "signUp",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "停/启状态",
            slotName: "table-status",
            width: 100,
            filterable: {
              group: 1,
              type: "radio",
              queryField: "status",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                {
                  text: "使用",
                  value: "1",
                },
                {
                  text: "禁用",
                  value: "0",
                },
              ],
            },
          },
          {
            // 如果没有自定义操作项，去掉即可
            title: "操作",
            // 操作列 slotName 固定为 table-operation
            slotName: "table-operation",
            ellipsis: true,
            // 62 为单个预置的操作按钮的宽度，32为单元格 padding 宽度
            width: 72 + 62 + 32,
          },
        ];
      }),
      ["NO", "createdBy", "createdTime", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const formatQueryData = (_query: Record<string, any>) => {
      interface Query {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      _query.createdTime && (query.createStartTime = formatDateTime(_query.createdTime[0]));
      _query.createdTime && (query.createEndTime = formatDateTime(moment(_query.createdTime[1]).add(1, "days")));
      delete query.createdTime;
      _query.duration && (query.activityStartTime = formatDateTime(_query.duration[0]));
      _query.duration && (query.activityEndTime = formatDateTime(moment(_query.duration[1]).add(1, "days")));
      delete query.duration;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return ActivityManagement.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const refSfTablePage = ref();
    //查看报名信息
    const router = useRouter();
    const checkSignUpInfo = (record: any) => {
      router.push({ name: "ActivityManagementSignUpList", params: { id: record.data.activityId } });
    };
    const changeStatus = (record: any) => {
      if (record.data.status === 2) {
        ActivityManagement.update(record.data.activityId, 1).then(() => {
          refSfTablePage.value.reLoadData();
          Message.success("成功");
        });
      } else {
        ActivityManagement.update(record.data.activityId, 2).then(() => {
          refSfTablePage.value.reLoadData();
          Message.success("成功");
        });
      }
    };
    //报名顺序修改后子组件调用父组件此方法实现页面刷新
    const updateView = () => {
      refSfTablePage.value.reLoadData();
    };
    return {
      refSfTablePage,
      tableColumns,
      queryData,
      formatLoadData,
      loadData,
      checkSignUpInfo,
      changeStatus,
      updateView,
    };
  },
});
</script>
