<template>
  <SfTable
    ref="refSfTable"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :formatQueryData="formatQueryData"
    :tableColumns="tableColumns"
    v-model:queryData="queryData"
    :multi-select-delete-buttom="false"
    v-model:selectedRowKeys="selectedRowKeys"
    :operation="['operation-workorder', 'operation-flow']"
    :add-button-text="''"
    :scroll="{ x: 1400 }"
    :row-click="() => {}"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['系统管理', '事件综合配置']" />
    </template>
    <template #table-generateTicket-switch="{ record }">
      <a-switch
        :model-value="record.generateTicket"
        :checked-value="1"
        :unchecked-value="2"
        @change="modifyGenerateTicket(record)"
        :loading="loadingSwitchTicketJobId === record.key"
      >
        <template #checked>开</template>
        <template #unchecked>关</template>
      </a-switch>
    </template>
    <template #table-configProcess-switch="{ record }">
      <a-switch :model-value="record.configProcess" disabled>
        <template #checked>开</template>
        <template #unchecked>关</template>
      </a-switch>
    </template>
    <template #operation-workorder="{ defaultAttr, record }">
      <a-link v-bind="defaultAttr" @click.stop="() => $router.push({ name: 'WorkOrderConfiguration', params: { id: record.key, model: 'Edit' } })"
        >工单配置</a-link
      >
    </template>
    <template #operation-flow="{ defaultAttr, record }">
      <a-link
        v-bind="defaultAttr"
        :disabled="true"
        @click.stop="() => $router.push({ name: 'EventFlowConfiguration', params: { id: record.key, model: 'Edit' } })"
        >流程配置</a-link
      >
    </template>
  </SfTable>
</template>

<script lang="ts">
import Breadcrumb from "@/components/Breadcrumb.vue";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
import { computed, defineComponent, isRef, reactive, ref, watch, watchEffect } from "vue";
import SfTable from "@/components/lib/RD3/SfTable";
import JobConfig, { JobConfigModel } from "@/api/tenant/JobConfig";
import { useAppStore, useDictStore } from "@/store";
import Message from "@/utils/Message";
export default defineComponent({
  name: "work-configuration",
  components: {
    Breadcrumb,
    SfTable,
  },
  setup() {
    const refSfTable = ref();

    const appStore = useAppStore();
    const dictStore = useDictStore();
    const serviceTypeMap = computed(() => {
      return dictStore.serviceTypeMap as any;
    });
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const productMap = computed(() => {
      return appStore.productMap as any;
    });
    const loadData = JobConfig.page;
    const formatLoadData = (data: JobConfigModel[]) => {
      const tableData = reactive(
        data.map((item) => {
          return {
            key: item.id,
            data: item,
            jobName: item.jobName,
            serviceClassName: serviceClassMap.value[item.serviceClass]?.label || item.serviceClass,
            serviceTypeName: serviceTypeMap.value[item.serviceType]?.label || item.serviceType,
            standardName: item.standard === 1 ? "思流" : "自定义",
            method: item.method,
            productName: productMap.value[item.product]?.label || item.product,
            generateTicket: item.generateTicket,
            configProcess: item.configProcess,
          };
        }),
      );
      watchEffect(() => {
        tableData.forEach((item) => {
          item.serviceTypeName = serviceTypeMap.value[item.data.serviceType]?.label || item.data.serviceType;
          item.serviceClassName = serviceClassMap.value[item.data.serviceClass]?.label || item.data.serviceClass;
          item.productName = productMap.value[item.data.product]?.label || item.data.product;
        });
      });
      return tableData;
    };
    const tableColumns: RdTableColumnData[] = reactive([
      {
        title: "事件",
        dataIndex: "jobName",
        ellipsis: true,
        tooltip: true,
        width: 220,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "业务",
        dataIndex: "serviceClassName",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "radio",
          queryField: "serviceClass",
          defaultValue: "-1",
          filters: [
            {
              text: "全部",
              value: "-1",
            },
            ...Object.keys(serviceClassMap.value).map((k) => {
              return {
                text: serviceClassMap.value[k].label,
                value: k,
              };
            }),
          ],
        },
      },
      {
        title: "类",
        dataIndex: "serviceTypeName",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "radio",
          queryField: "serviceType",
          defaultValue: "-1",
          filters: [
            {
              text: "全部",
              value: "-1",
            },
            ...Object.keys(serviceTypeMap.value).map((k) => {
              return {
                text: serviceTypeMap.value[k].label,
                value: k,
              };
            }),
          ],
        },
      },
      {
        title: "标准",
        dataIndex: "standardName",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "方法",
        dataIndex: "method",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "生成工单",
        slotName: "table-generateTicket-switch",
        width: 90,
      },
      {
        title: "工单类型",
        dataIndex: "productName",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "配置流程",
        slotName: "table-configProcess-switch",
        width: 90,
      },
      {
        title: "操作",
        slotName: "table-operation",
        ellipsis: true,
        width: 32 + 72 + 72,
      },
    ]);
    const queryData = reactive<any>({
      serviceClass: "-1",
      serviceType: "-1",
    });
    const formatQueryData = (data: any) => {
      const q: any = {};
      Object.keys(data).forEach((k) => {
        if (data[k] !== "-1" && data[k] !== -1 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
          q[k] = data[k];
        }
      });
      return q;
    };
    const loadingSwitchTicketJobId = ref("");
    const modifyGenerateTicket = (record: any) => {
      let p;
      console.log(record);
      if (record.data.generateTicket === 1 || record.data.generateTicket === "1") {
        p = JobConfig.modifyGenerateTicket(record.key, 2);
      } else {
        p = JobConfig.modifyGenerateTicket(record.key, 1);
      }
      const close = Message.delayLoading("切换中", 500);
      loadingSwitchTicketJobId.value = record.key;
      p.then(() => {
        close();
        Message.success("切换成功");
        refSfTable.value?.tableLoadData();
      })
        .catch(() => {
          close();
          Message.error("切换失败");
        })
        .finally(() => {
          loadingSwitchTicketJobId.value = "";
        });
    };
    const selectedRowKeys = ref<string[]>([]);
    return {
      refSfTable,
      loadData,
      formatLoadData,
      modifyGenerateTicket,
      loadingSwitchTicketJobId,
      tableColumns,
      queryData,
      formatQueryData,
      // del,
      // dels,
      selectedRowKeys,
    };
  },
});
</script>

<style lang="less" scoped></style>
