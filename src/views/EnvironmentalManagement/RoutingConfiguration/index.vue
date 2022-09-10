<!-- 暂时使用品质管理巡检路线数据 -->
<template>
  <SfTablePage
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
      <Breadcrumb :items="['环境管理', '工作路线配置']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import EnvManagementRoute, { PatrolRouteQueryModel, RouteModel } from "@/api/tenant/EnvManagementRoute";
import moment from "moment";
import { SfTableColumnData } from "@/components/lib/SfTable";
import SfTablePage, { useFormatData, useTableColumns, useQueryData, useFilterDefaultValueQueryData } from "@/components/lib/SfTablePage";
import { deepClone, formatDateTime } from "@/utils/utils";
import { TableRowSelection } from "@arco-design/web-vue";

export default defineComponent({
  name: "envmanagement-route",
  components: {
    Breadcrumb,
    SfTablePage,
  },
  setup() {
    const { formatLoadData } = useFormatData<RouteModel>((item) => {
      return {
        key: item.id,
        data: item,
        routeName: item.routeName,
        placeName: item.routeSpots.length !== 0 ? item.routeSpots.map((v) => v.placeName).reduce((a, b) => `${a}，${b}`) : "",
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "路线名称",
            dataIndex: "routeName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "地点",
            dataIndex: "placeName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
        ];
      }),
      ["NO", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const formatQueryData = (_query: Record<string, any>) => {
      interface Query extends PatrolRouteQueryModel {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return EnvManagementRoute.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return EnvManagementRoute.delete(id);
        }),
      ).then(() => {
        rowSelection.selectedRowKeys = [];
      });
    };
    const rowSelection = reactive<TableRowSelection>({
      selectedRowKeys: [],
    });
    return {
      tableColumns,
      queryData,
      rowSelection,
      formatLoadData,
      loadData,
      del,
    };
  },
});
</script>

<style lang="less" scoped></style>
