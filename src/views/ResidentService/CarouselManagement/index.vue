<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :operation="['view']"
    :defaultShowColumn="defaultShowColumns"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['客户服务', '轮播图管理']" />
    </template>
    <template #table-status="{ record }">
      <a-switch @click.stop="changeStatus(record)" :model-value="record.data.status === 1">
        <template #checked>开</template>
        <template #unchecked>关</template>
      </a-switch>
    </template>
    <template #table-seq="{ record }">
      <ChangeNumberSlot v-model:seq="record.data.seq" :idString="record.data.id" @updateView="updateView" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import CarouselManagement, { CarouselManagementModel } from "@/api/tenant/CarouselManagement";
import { computed, defineComponent, ref } from "vue";
import moment from "moment";
import Message from "@/utils/Message";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
// FIX: 改不了顺序，调用的还是活动的接口
import ChangeNumberSlot from "../ActivityManagement/components/ChangeNumberSlot.vue";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";

export default defineComponent({
  name: "carousel-management-view",
  components: {
    Breadcrumb,
    SfTablePage,
    ChangeNumberSlot,
  },
  setup() {
    const { formatLoadData } = useFormatData<CarouselManagementModel>((item) => {
      return {
        key: item.id,
        data: item,
        status: item.status,
        seq: item.seq,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "标题名称",
            dataIndex: "title",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "生效开始时间",
            dataIndex: "startTime",
            ellipsis: true,
            tooltip: true,
            filterable: {
              queryField: "duration",
              type: "range-picker",
              label: "生效时间",
            },
          },
          {
            title: "生效结束时间",
            dataIndex: "endTime",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "轮播图排序",
            slotName: "table-seq",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "创建人",
            dataIndex: "createdBy",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "创建时间",
            dataIndex: "createdTime",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "range-picker",
            },
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
                  value: "2",
                },
              ],
            },
          },
        ];
      }),
      ["NO", "createdBy", "createdTime", "updatedBy", "updatedTime"],
    );
    const defaultShowColumns: string[] = [
      "NO",
      "title",
      "startTime",
      "endTime",
      "table-seq",
      "table-status",
      "createdBy",
      "createdTime",
      "table-operation",
    ];
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const formatQueryData = (_query: Record<string, any>) => {
      interface Query {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      // TODO: 要增加更新时间，更新人筛选
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      _query.createdTime && (query.createStartTime = formatDateTime(_query.createdTime[0]));
      _query.createdTime && (query.createEndTime = formatDateTime(moment(_query.createdTime[1]).add(1, "days")));
      delete query.createdTime;
      _query.duration && (query.startTime = formatDateTime(_query.duration[0]));
      _query.duration && (query.endTime = formatDateTime(moment(_query.duration[1]).add(1, "days")));
      delete query.duration;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return CarouselManagement.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const refSfTablePage = ref();
    const changeStatus = (record: any) => {
      // FIX: 修改不了状态
      if (record.data.status === 2) {
        const status = 1;
        CarouselManagement.update(record.data.activityId, status).then(() => {
          refSfTablePage.value.reLoadData();
          Message.success("成功");
        });
      } else {
        const status = 2;
        CarouselManagement.update(record.data.activityId, status).then(() => {
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
      defaultShowColumns,
      formatLoadData,
      loadData,
      changeStatus,
      updateView,
    };

    // const refSfTable = ref();
    // const loadData = CarouselManagement.page;
    // const formatLoadData = (data: CarouselManagementModel[]) => {
    //   return data.map((item) => {
    //     return {
    //       key: item.id,
    //       data: item,
    //       createdTime: item.createdTime,
    //       createdBy: item.createdBy,
    //       status: item.status,
    //       seq: item.seq,
    //       title: item.title,
    //       startTime: item.startTime,
    //       endTime: item.endTime,
    //     };
    //   });
    // };
    // const selectedRowKeys = ref<string[]>([]);
    // const tableColumns: RdTableColumnData[] = reactive([
    //   {
    //     title: "标题名称",
    //     dataIndex: "title",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "生效开始时间",
    //     dataIndex: "startTime",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       queryField: "duration",
    //       align: "filter-bar",
    //       type: "range-picker",
    //       label: "生效时间",
    //     },
    //   },
    //   {
    //     title: "生效结束时间",
    //     dataIndex: "endTime",
    //     ellipsis: true,
    //     tooltip: true,
    //   },
    //   {
    //     title: "轮播图排序",
    //     slotName: "table-seq",
    //     ellipsis: true,
    //     tooltip: true,
    //   },
    //   {
    //     title: "创建人",
    //     dataIndex: "createdBy",
    //     ellipsis: true,
    //     tooltip: true,
    //   },
    //   {
    //     title: "创建时间",
    //     dataIndex: "createdTime",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "range-picker",
    //     },
    //   },
    //   {
    //     title: "停/启状态",
    //     slotName: "table-status",
    //     width: 100,
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
    //           text: "使用",
    //           value: "1",
    //         },
    //         {
    //           text: "禁用",
    //           value: "2",
    //         },
    //       ],
    //     },
    //   },
    // ]);
    // // 设置显示的属性
    // const defaultShowColumns: string[] = [
    //   "NO",
    //   "title",
    //   "startTime",
    //   "endTime",
    //   "table-seq",
    //   "createdBy",
    //   "createdTime",
    //   "table-status",
    //   "table-operation",
    // ];
    // const queryData = reactive<any>({
    //   status: "-999",
    // });
    // const formatQueryData = (data: any) => {
    //   const q: any = {};
    //   if (data["duration"]?.length > 0) {
    //     q["startTime"] = data["duration"][0].concat(" 00:00:00");
    //     q["endTime"] = moment(data["duration"][1]).add(1, "d").format("YYYY-MM-DD").concat(" 00:00:00");
    //   }
    //   if (data["createdTime"]?.length > 0) {
    //     q["createStartTime"] = data["createdTime"][0].concat(" 00:00:00");
    //     q["createEndTime"] = moment(data["createdTime"][1]).add(1, "d").format("YYYY-MM-DD").concat(" 00:00:00");
    //   }
    //   Object.keys(data).forEach((k) => {
    //     if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null && k != "duration" && k != "createdTime") {
    //       q[k] = data[k];
    //     }
    //   });
    //   data.field && q[data.field] == data.search;
    //   return q;
    // };
    // const changeStatus = (record: any) => {
    //   if (record.data.status === 2) {
    //     const status = 1;
    //     CarouselManagement.update(record.data.activityId, status).then(() => {
    //       console.log(refSfTable);
    //       refSfTable.value.tableLoadData();
    //       Message.success("成功");
    //     });
    //   } else {
    //     const status = 2;
    //     CarouselManagement.update(record.data.activityId, status).then(() => {
    //       console.log(refSfTable);
    //       refSfTable.value.tableLoadData();
    //       Message.success("成功");
    //     });
    //   }
    // };
    // //报名顺序修改后子组件调用父组件此方法实现页面刷新
    // const updateView = () => {
    //   refSfTable.value.tableLoadData();
    // };

    // return {
    //   refSfTable,
    //   loadData,
    //   formatLoadData,
    //   selectedRowKeys,
    //   tableColumns,
    //   queryData,
    //   formatQueryData,
    //   changeStatus,
    //   updateView,
    //   defaultShowColumns,
    // };
  },
});
</script>

<style scoped lang="less"></style>
