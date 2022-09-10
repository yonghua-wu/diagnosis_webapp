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
      <Breadcrumb :items="['品质管理', '路线配置']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import QualityCheckRoute, { QualityCheckRouteModel, QualityCheckRouteQueryModel } from "@/api/tenant/QualityCheckRoute";
import { useDictStore } from "@/store";
import moment from "moment";
import { SfTableColumnData } from "@/components/lib/SfTable";
import {
  SERVICE_CLASS_SAFETY,
  SERVICE_CLASS_ENVI,
  SERVICE_CLASS_MACHINE,
  SERVICE_CLASS_CUSTOMER,
  SERVICE_CLASS_MANAGE,
  SERVICE_CLASS_VALUE_MAP_KEYS,
  SERVICE_CLASS_VALUE_MAP,
} from "@/store/modules/dict/types";
import { deepClone, formatDateTime } from "@/utils/utils";
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
    const { formatLoadData } = useFormatData<QualityCheckRouteModel>((item) => {
      return {
        key: item.id,
        data: item,
        routeName: item.routeName,
        placeName: item.routeSpots.map((v) => v.placeName).reduce((a, b) => `${a}，${b}`),
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
              ratio: 2,
              type: "radio",
              queryField: "serviceClass",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...(
                  [
                    SERVICE_CLASS_SAFETY,
                    SERVICE_CLASS_ENVI,
                    SERVICE_CLASS_MACHINE,
                    SERVICE_CLASS_CUSTOMER,
                    SERVICE_CLASS_MANAGE,
                  ] as SERVICE_CLASS_VALUE_MAP_KEYS
                ).map((item) => {
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
      interface Query extends QualityCheckRouteQueryModel {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return QualityCheckRoute.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return QualityCheckRoute.delete(id);
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
