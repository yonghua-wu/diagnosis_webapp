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
      <Breadcrumb :items="['综合巡逻', '巡逻路线']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import PatrolRoute, { PatrolRouteModel, PatrolRouteQueryModel } from "@/api/tenant/PatrolRoute";
import moment from "moment";
import { useDictStore } from "@/store";
import { SERVICE_CLASS_CUSTOMER, SERVICE_CLASS_SAFETY, SERVICE_CLASS_VALUE_MAP, SERVICE_CLASS_VALUE_MAP_KEYS } from "@/store/modules/dict/types";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { formatDateTime, deepClone } from "@/utils/utils";
import { TableRowSelection } from "@arco-design/web-vue";

export default defineComponent({
  name: "routing-management",
  components: {
    Breadcrumb,
    SfTablePage,
  },
  setup() {
    const dictStore = useDictStore();
    const serviceClassMap = computed(() => {
      return dictStore.serviceClassMap;
    });
    const { formatLoadData } = useFormatData<PatrolRouteModel>((item) => {
      return {
        key: item.id,
        data: item,
        routeName: item.routeName,
        placeName: item.routeSpots.length !== 0 ? item.routeSpots.map((v) => v.placeName).reduce((a, b) => `${a}，${b}`) : "",
        serviceClass: serviceClassMap.value[item.serviceClass]?.label || "",
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
          {
            title: "业务",
            dataIndex: "serviceClass",
            width: 80,
            filterable: {
              group: 1,
              type: "radio",
              queryField: "serviceClass",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...([SERVICE_CLASS_SAFETY, SERVICE_CLASS_CUSTOMER] as SERVICE_CLASS_VALUE_MAP_KEYS).map((item) => {
                  const serviceClass = serviceClassMap.value[SERVICE_CLASS_VALUE_MAP[item]];
                  return {
                    text: serviceClass.label,
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
      return PatrolRoute.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return PatrolRoute.delete(id);
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

<style lang="less" scoped>
.routing-management {
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
