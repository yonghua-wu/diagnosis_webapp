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
      <Breadcrumb :items="['客户服务', '缴费管理']" />
    </template>
    <template #table-status="{ record }">
      <div style="line-height: 25px">
        <a-switch
          @click.stop="() => ({})"
          :model-value="record.status"
          :checked-value="1"
          :unchecked-value="2"
          :loading="switchLoading === record.key"
          @change="(value) => onChangeStatus(value as number, record.key)"
        ></a-switch>
        <span style="margin-left: 6px" v-if="record.status === 1">启用</span>
        <span style="margin-left: 6px" v-else>停用</span>
      </div>
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";
import { TableRowSelection } from "@arco-design/web-vue";
import moment from "moment";
import PaymentManagement, { PaymentManagementModel, PaymentManagementPageQuery } from "@/api/tenant/PaymentManagement";
import Message from "@/utils/Message";

const effectOptions: any[] = [
  {
    value: 1,
    label: "本月生效",
  },
  {
    value: 2,
    label: "下月生效",
  },
];

const paymentTypeOptionsMap = {
  1: {
    value: 1,
    label: "物业费",
  },
  2: {
    value: 2,
    label: "电费",
  },
  3: {
    value: 3,
    label: "水费",
  },
  4: {
    value: 4,
    label: "燃气费",
  },
  5: {
    value: 5,
    label: "其他",
  },
};

const startTimeOptions = Array(...Array(28)).map((_, i) => {
  return {
    value: i + 1 + "",
    label: i + 1 + "日",
  };
});
startTimeOptions.push({
  value: "0",
  label: "最后一天",
});

export default defineComponent({
  name: "test-page",
  components: {
    SfTablePage,
    Breadcrumb,
  },
  setup() {
    // const dictStore = useDictStore();
    // const serviceClassMap = computed(() => {
    //   return dictStore.serviceClassMap;
    // });
    const { formatLoadData } = useFormatData<PaymentManagementModel>((item) => {
      let cycleText = "";
      if (item.cronUnit === 1) {
        // 每月
        cycleText = "每月" + (item.cronValue === "29" ? "最后一天" : String(item.cronValue) + "日");
      } else {
        cycleText = "每年" + String(item.cronValue) + "月";
      }
      return {
        key: item.id,
        data: item,
        name: item.name,
        type: paymentTypeOptionsMap[item.type]?.label,
        unitPrice: item.unitPrice,
        unitName: item.unitName,
        cycleText: cycleText,
        status: item.status,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "缴费类型名称",
            dataIndex: "name",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "缴费类型",
            dataIndex: "type",
            ellipsis: true,
            tooltip: true,
            filterable: {
              group: 1,
              sort: 2,
              ratio: 2,
              type: "radio",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...Object.keys(paymentTypeOptionsMap).map((key) => {
                  return {
                    text: paymentTypeOptionsMap[Number(key) as keyof typeof paymentTypeOptionsMap].label,
                    value: key,
                  };
                }),
              ],
            },
          },
          {
            title: "单价(元)",
            dataIndex: "unitPrice",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "单位",
            dataIndex: "unitName",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "缴费周期",
            dataIndex: "cycleText",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "状态",
            slotName: "table-status",
            width: 120,
            filterable: {
              group: 1,
              sort: 1,
              type: "radio",
              queryField: "status",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                {
                  text: "启用",
                  value: "1",
                },
                {
                  text: "停用",
                  value: "2",
                },
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
      interface Query extends PaymentManagementPageQuery {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return PaymentManagement.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return PaymentManagement.deleteBatch(selectedKeys).then(() => {
        rowSelection.selectedRowKeys = [];
      });
    };
    const rowSelection = reactive<TableRowSelection>({
      selectedRowKeys: [],
    });
    const refSfTablePage = ref();
    const switchLoading = ref("");
    const onChangeStatus = (v: number, id: string) => {
      console.log(v, id);
      switchLoading.value = id;
      let p;
      if (v === 1) {
        p = PaymentManagement.enable(id);
      } else {
        p = PaymentManagement.disable(id);
      }
      const close = Message.delayLoading("切换中...", 500);
      p.then(() => {
        Message.success("切换成功");
      }).finally(() => {
        switchLoading.value = "";
        close();
        refSfTablePage.value.reLoadData();
      });
    };
    return {
      refSfTablePage,
      tableColumns,
      queryData,
      rowSelection,
      switchLoading,
      onChangeStatus,
      formatLoadData,
      loadData,
      del,
    };
  },
});
</script>

<style lang="scss" scoped></style>
