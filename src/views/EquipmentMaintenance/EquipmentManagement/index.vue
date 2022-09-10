<template>
  <!-- <SfTable
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
    :add-button-text="'添加设备'"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['设备维护', '设备管理']" />
    </template> -->
  <!-- <template #filter="{ formItemDefaultAttr }">
      <a-form-item v-bind="formItemDefaultAttr" field="categoryId" label="设备类型">
        <a-select style="width: 100%" v-model="queryData.categoryId" :options="deviceCateList" placeholder="请选择设备类型" allow-clear />
      </a-form-item>
    </template> -->
  <!-- <template #table-qrImg="{ record }">
      <a-popover title="" position="top">
        <icon-qrcode style="font-size: 20px" />
        <template #content>
          <a-image width="200" :src="record.data.qrImg" />
        </template>
      </a-popover>
    </template>
  </SfTable> -->
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
      <Breadcrumb :items="['设备维护', '设备管理']" />
    </template>
    <template #table-qrImg="{ record }">
      <a-popover title="" position="top">
        <icon-qrcode style="font-size: 20px" />
        <template #content>
          <a-image width="200" :src="record.data.qrImg" />
        </template>
      </a-popover>
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Device, { DeviceModel } from "@/api/tenant/Device";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import moment from "moment";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";
import { TableRowSelection } from "@arco-design/web-vue";
import { del } from "vue-demi";
import {
  DEVICE_NOT_INSTALL,
  DEVICE_INSTALLED,
  DEVICE_USE_NORMAL,
  DEVICE_USE_ABNORMAL,
  DEVICE_USE_STOP,
  DEVICE_STATUS_MAP,
  DEVICE_STATUS_MAP_KEYS,
} from "@/store/modules/dict/types";

const deviceStatusMap: any = {
  1: "未安装",
  2: "已安装",
  3: "使用（正常）",
  4: "使用（异常）",
  5: "停用",
};

export default defineComponent({
  name: "device-management",
  components: {
    Breadcrumb,
    SfTablePage,
  },
  setup() {
    const { formatLoadData } = useFormatData<DeviceModel>((item) => {
      return {
        key: item.deviceId,
        data: item,
        deviceId: item.deviceId,
        deviceName: item.deviceName,
        categoryName: item.categoryName,
        placeName: item.placeName,
        deviceStatus: deviceStatusMap[item.deviceStatus],
        monitoringState: null,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "设备编号",
            dataIndex: "deviceId",
            width: 230,
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "设备名称",
            dataIndex: "deviceName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "设备类型",
            dataIndex: "categoryName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "select",
              queryField: "categoryId",
              filters: [],
            },
          },
          {
            title: "位置",
            dataIndex: "placeName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              // TODO: 空间选择器
              type: "search",
            },
          },
          {
            title: "二维码",
            slotName: "table-qrImg",
            width: 80,
            align: "center",
          },
          {
            title: "设备状态",
            dataIndex: "deviceStatus",
            width: 120,
            filterable: {
              group: 1,
              ratio: 2,
              type: "radio",
              queryField: "deviceStatus",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...[DEVICE_NOT_INSTALL, DEVICE_INSTALLED, DEVICE_USE_NORMAL, DEVICE_USE_ABNORMAL, DEVICE_USE_STOP].map((item) => {
                  return {
                    text: DEVICE_STATUS_MAP[item as DEVICE_STATUS_MAP_KEYS],
                    value: String(item),
                  };
                }),
              ],
            },
          },
          {
            title: "监控状态",
            dataIndex: "monitoringState",
            width: 100,
          },
        ];
      }),
      ["NO", "updatedBy", "updatedTime"],
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
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return Device.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return Device.delete(id);
        }),
      );
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
    // const refSfTable = ref();
    // const loadData = Device.page;
    // const formatLoadData = (data: DeviceModel[]) => {
    //   return data.map((item) => {
    //     return {
    //       key: item.deviceId,
    //       data: item,
    //       deviceId: item.deviceId,
    //       deviceName: item.deviceName,
    //       categoryName: item.categoryName,
    //       placeName: item.placeName,
    //       deviceStatus: deviceStatusMap[item.deviceStatus],
    //       monitoringState: null,
    //     };
    //   });
    // };
    // const deviceCateList = ref<any[]>([]);
    // const selectedRowKeys = ref<string[]>([]);
    // const tableColumns: RdTableColumnData[] = reactive([
    //   {
    //     title: "设备编号",
    //     dataIndex: "deviceId",
    //     width: 230,
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "设备名称",
    //     dataIndex: "deviceName",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "search",
    //     },
    //   },
    //   {
    //     title: "设备类型",
    //     dataIndex: "categoryName",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "select",
    //       queryField: "categoryId",
    //       filters: [],
    //     },
    //   },
    //   {
    //     title: "位置",
    //     dataIndex: "placeName",
    //     ellipsis: true,
    //     tooltip: true,
    //     filterable: {
    //       queryField: "placeId",
    //       align: "filter-bar",
    //       type: "place-select",
    //     },
    //   },
    //   {
    //     title: "二维码",
    //     slotName: "table-qrImg",
    //     width: 80,
    //     align: "center",
    //   },
    //   {
    //     title: "设备状态",
    //     dataIndex: "deviceStatus",
    //     width: 100,
    //     filterable: {
    //       align: "filter-bar",
    //       type: "radio",
    //       queryField: "deviceStatus",
    //       defaultValue: "-999",
    //       filters: [
    //         {
    //           text: "全部",
    //           value: "-999",
    //         },
    //         {
    //           text: "未安装",
    //           value: "1",
    //         },
    //         {
    //           text: "已安装",
    //           value: "2",
    //         },
    //         {
    //           text: "使用(正常)",
    //           value: "3",
    //         },
    //         {
    //           text: "使用(异常)",
    //           value: "4",
    //         },
    //         {
    //           text: "停用",
    //           value: "5",
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     title: "监控状态",
    //     dataIndex: "monitoringState",
    //     width: 100,
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
    //   deviceStatus: "-999",
    // });
    // const formatQueryData = (data: any) => {
    //   const q: any = {};
    //   if (data["updatedTime"]?.length > 0) {
    //     q["updatedStartTime"] = moment(data["updatedTime"][0]).format("YYYY-MM-DD HH:mm:ss");
    //     q["updatedEndTime"] = moment(data["updatedTime"][1]).add(1, "days").format("YYYY-MM-DD HH:mm:ss");
    //   }
    //   Object.keys(data).forEach((k) => {
    //     if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
    //       q[k] = data[k];
    //     }
    //   });
    //   data.field && (q[data.field] = data.search);
    //   return q;
    // };
    // const del = Device.delete;
    // const dels = (selectedKeys: string[]) => {
    //   return Promise.all(
    //     selectedKeys.map((id) => {
    //       return Device.delete(id);
    //     }),
    //   );
    // };

    // Device.getAllCate().then((res) => {
    //   deviceCateList.value = res.map((c) => {
    //     return {
    //       ...c,
    //       label: c.name,
    //       value: c.categoryId,
    //     };
    //   });
    //   tableColumns[2].filterable &&
    //     (tableColumns[2].filterable.filters = deviceCateList.value.map((item) => {
    //       return {
    //         text: item.label,
    //         value: item.value,
    //       };
    //     }));
    // });
    // return {
    //   deviceStatusMap,
    //   refSfTable,
    //   loadData,
    //   formatLoadData,
    //   tableColumns,
    //   formatQueryData,
    //   queryData,
    //   selectedRowKeys,
    //   deviceCateList,
    //   del,
    //   dels,
    // };
  },
});
</script>

<style lang="less" scoped>
.device-management {
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
  .building {
    height: 260px;
    background-color: var(--color-bg-1);
  }
  :deep(.arco-card-hoverable):hover {
    box-shadow: 0 4px 10px rgb(var(--gray-3));
  }
}
</style>
