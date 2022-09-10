<template>
  <SfTable
    ref="refSfTable"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :formatQueryData="formatQueryData"
    :tableColumns="tableColumns"
    v-model:queryData="queryData"
    :row-delete="del"
    :click-selected-delete="dels"
    v-model:selectedRowKeys="selectedRowKeys"
    :operation="['view', 'edit']"
    :add-button-text="'添加'"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['系统管理', '字典管理']" />
    </template>
  </SfTable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTable from "@/components/lib/RD3/SfTable";
import Dict, { DictModel } from "@/api/tenant/Dict";
import { useAppStore } from "@/store";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
import { TableData } from "@arco-design/web-vue";

export default defineComponent({
  name: "routing-management",
  components: {
    Breadcrumb,
    SfTable,
  },
  setup() {
    const refSfTable = ref();
    const loadData = Dict.page;
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const formatLoadData = (data: DictModel[]) => {
      return data.map((item) => {
        return {
          disabled: item.deleteStatus === 2,
          key: item.dictId,
          data: item,
          showLabel: item.showLabel || item.label,
          label: item.label,
          code: item.code,
          value: item.value,
          seq: item.seq,
          type: item.type,
          remark: item.remark,
        };
      }) as unknown as TableData[];
    };
    const selectedRowKeys = ref<string[]>([]);
    const tableColumns: RdTableColumnData[] = reactive([
      {
        title: "显示名称",
        dataIndex: "showLabel",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "默认名称",
        dataIndex: "label",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "值",
        dataIndex: "value",
        ellipsis: true,
        tooltip: true,
        width: 80,
      },
      {
        title: "CODE",
        dataIndex: "code",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "排序",
        dataIndex: "seq",
        ellipsis: true,
        tooltip: true,
        width: 80,
      },
      // {
      //   title: "类型",
      //   dataIndex: "type",
      //   ellipsis: true,
      //   tooltip: true,
      // },
      {
        title: "备注",
        dataIndex: "remark",
        ellipsis: true,
        tooltip: true,
      },
    ]);
    const queryData = reactive<any>({
      code: "",
    });
    const formatQueryData = (data: any) => {
      const q: any = {};
      Object.keys(data).forEach((k) => {
        if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
          q[k] = data[k];
        }
      });
      data.field && (q[data.field] = data.search);
      return q;
    };
    const del = Dict.delete;
    const dels = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return Dict.delete(id);
        }),
      );
    };
    return {
      serviceClassMap,
      refSfTable,
      loadData,
      selectedRowKeys,
      formatLoadData,
      tableColumns,
      queryData,
      formatQueryData,
      del,
      dels,
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
