<template>
  <SfTable
    ref="refSfTable"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :formatQueryData="formatQueryData"
    :tableColumns="tableColumns"
    :queryData="queryData"
    v-model:selectedRowKeys="selectedRowKeys"
    :default-show-column="defaultShowColumns"
    :multi-select-delete-buttom="false"
    :add-button-text="''"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['报名信息']" />
    </template>
    <template #tools-options>
      <a-tooltip content="导出数据">
        <a-button shape="circle" @click="exportData">
          <icon-file />
        </a-button>
      </a-tooltip>
    </template>
  </SfTable>
</template>

<script lang="ts">
import ActivityPerson, { ActivityPersonModel } from "@/api/tenant/ActivityPerson";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTable from "@/components/lib/RD3/SfTable";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
import { defineComponent, reactive, ref } from "vue";
import Block from "@/api/tenant/Block";

export default defineComponent({
  name: "sign-up-list",
  components: {
    Breadcrumb,
    SfTable,
  },
  setup() {
    const refSfTable = ref();
    const loadData = ActivityPerson.page;
    const reverseBlockOptions = ref<any>([]);
    Block.getAll().then((res) => {
      reverseBlockOptions.value = res.map((item) => {
        return {
          label: item.blockId,
          value: item.name,
        };
      });
    });
    const formatLoadData = (data: ActivityPersonModel[]) => {
      console.log(data);
      return data.map((item) => {
        return {
          key: item.personId,
          data: item,
          personId: item.personId,
          personName: item.personName,
          personPhone: item.personPhone,
          createdBy: item.createdBy,
          blockId: reverseBlockOptions[item.blockId],
          createdTime: item.createdTime,
        };
      });
    };
    const selectedRowKeys = ref<string[]>([]);
    const tableColumns: RdTableColumnData[] = reactive([
      {
        title: "姓名",
        dataIndex: "personName",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "手机号码",
        dataIndex: "personPhone",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "提交人姓名",
        dataIndex: "createdBy",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "地址",
        dataIndex: "blockId",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "创建时间",
        dataIndex: "createdTime",
        ellipsis: true,
        tooltip: true,
      },
    ]);
    // 设置显示的属性
    const defaultShowColumns: string[] = ["NO", "personName", "personPhone", "createdBy", "blockId", "signUp", "createdTime"];
    const queryData = reactive<any>({});
    const formatQueryData = (data: any) => {
      const q: any = {};
      Object.keys(data).forEach((k) => {
        if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null) {
          q[k] = data[k];
        }
      });
      data.field && q[data.field] == data.search;
      return q;
    };
    const exportData = () => {
      console.log("export data");
      //const close = Message.delayLoading("导出中",500);
    };
    return {
      refSfTable,
      loadData,
      formatLoadData,
      selectedRowKeys,
      tableColumns,
      queryData,
      formatQueryData,
      defaultShowColumns,
      exportData,
    };
  },
});
</script>
