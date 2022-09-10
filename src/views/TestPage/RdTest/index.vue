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
    :operation="['view', 'opertion-publish']"
    :add-button-text="'添加'"
  >
    <template #filter="{ formItemDefaultAttr }">
      <a-form-item v-bind="formItemDefaultAttr" field="state" label="工单状态(#)">
        <a-radio-group v-model="queryData.state" type="button">
          <a-radio :value="'-999'">全部</a-radio>
          <a-radio :value="'1'"> 已发布 </a-radio>
          <a-radio :value="'2'"> 草稿 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="formItemDefaultAttr" field="search" label="搜索(#)">
        <a-input-group>
          <a-select v-model="queryData.field" placeholder="搜索字段">
            <a-option label="标题" value="title"></a-option>
            <a-option label="内容" value="content"></a-option>
          </a-select>
          <a-input :max-length="50" v-model="queryData.search" placeholder="搜索" allow-clear />
        </a-input-group>
      </a-form-item>
    </template>
    <template #selected-options>
      <a-button :disabled="selectedRowKeys.length === 0">多选操作</a-button>
    </template>
    <template #normal-options>
      <a-button>其他选项</a-button>
    </template>
    <template #opertion-publish="{ record, defaultAttr }">
      <a-link :disabled="record.data.state === 1" v-bind="defaultAttr" @click="publish(record)">立即发布</a-link>
    </template>
    <template #table-status="{ record }">
      <a-switch @click.stop="() => {}" :model-value="record.data.state === 1"></a-switch>
    </template>
  </SfTable> -->
  <SfTablePage
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="del"
    :operation="['view']"
    :scroll="{ x: 1570 }"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['测试页', '表格测试']" />
    </template>
    <template #table-status="{ record }">
      <a-switch @click.stop="() => {}" :model-value="record.data.state === 1"></a-switch>
    </template>
    <template #filter-productName="{ queryData }">
      <a-input :max-length="50" v-model="queryData.productName" placeholder="搜索123" allow-clear />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, Ref } from "vue";
import SfTable from "@/components/lib/RD3/SfTable";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Notice, { NoticeModel } from "@/api/tenant/Notice";
import { Modal, TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
import Message from "@/utils/Message";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { computed } from "@vue/reactivity";
import { PaginationModel } from "@/api/tenant/base";
import Ticket, { TicketModel } from "@/api/tenant/Ticket";
import { useAppStore } from "@/store";
export default defineComponent({
  name: "test-page",
  components: {
    SfTablePage,
    Breadcrumb,
  },
  setup() {
    const appStore = useAppStore();
    const serviceTypeMap = computed(() => {
      return appStore.serviceTypeMap as any;
    });
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const fromTypeMap = computed(() => {
      return appStore.fromTypeMap as any;
    });
    const ticketStatusMap = computed(() => {
      return appStore.ticketStatusMap as any;
    });
    const { formatLoadData } = useFormatData<TicketModel>((item) => {
      return {
        key: item.ticketId,
        data: item,
        disabled: [1, 2, 5].indexOf(item.state) === -1, // 待分配，待接单，已接单才能转单
        serviceType: serviceTypeMap.value[item.serviceType]?.label || item.serviceType,
        ticketId: item.ticketId,
        productName: item.productName,
        jobName: item.jobName,
        serviceClass: serviceClassMap.value[item.serviceClass]?.label || item.serviceClass,
        placeName: item.placeName,
        createdBy: item.createdBy,
        fromType: fromTypeMap.value[item.fromType]?.label || item.fromType,
        level: "p" + item.level,
        status: ticketStatusMap.value[item.state]?.label || item.state,
        toName: item.toName,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "业务",
            dataIndex: "serviceClass",
            width: 80,
            filterable: {
              ratio: 2,
              group: 1,
              sort: 2,
              align: "filter-bar",
              type: "radio",
              queryField: "serviceClass",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                {
                  text: "秩序",
                  value: "1",
                },
                {
                  text: "环境",
                  value: "2",
                },
                {
                  text: "机电",
                  value: "3",
                },
                // {
                //   text: "客服",
                //   value: "4",
                // },
                {
                  text: "管理",
                  value: "5",
                },
              ],
            },
          },
          {
            title: "工单编号",
            dataIndex: "ticketId",
            width: 240,
            ellipsis: true,
            tooltip: true,
            filterable: {
              align: "filter-bar",
              type: "search",
            },
          },
          {
            title: "事件",
            dataIndex: "jobName",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "工单类型",
            dataIndex: "productName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "slot",
              align: "filter-bar",
              slotName: "filter-productName",
            },
          },
          {
            title: "工单地点",
            dataIndex: "placeName",
            ellipsis: true,
            tooltip: true,
            filterable: {
              align: "filter-bar",
              type: "search",
            },
          },
          {
            title: "工单状态",
            dataIndex: "status",
            ellipsis: true,
            tooltip: true,
            filterable: {
              ratio: 2,
              group: 1,
              sort: 1,
              align: "filter-bar",
              type: "radio",
              queryField: "status",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                {
                  text: "待分配",
                  value: "5",
                },
                {
                  text: "待接单",
                  value: "1",
                },
                {
                  text: "已接单",
                  value: "2",
                },
                {
                  text: "待验收",
                  value: "3",
                },
                {
                  text: "已通过",
                  value: "8",
                },
                {
                  text: "未通过",
                  value: "9",
                },
              ],
            },
          },
          {
            title: "处理人",
            dataIndex: "toName",
            width: 120,
            filterable: {
              align: "filter-bar",
              type: "search",
            },
          },
        ];
      }),
      ["NO", "createdBy", "createdTime", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);

    const loadData = (current: number, pageSize: number, query: any) => {
      return Ticket.page(current, pageSize, fQueryData.value);
    };
    const del = (ids: string[]) => {
      return Promise.all(
        ids.map((id) => {
          return Notice.delete(id);
        }),
      );
    };
    const rowSelection = reactive<TableRowSelection>({
      showCheckedAll: false,
      selectedRowKeys: [],
    });
    return {
      loadData,
      formatLoadData,
      rowSelection,
      tableColumns,
      queryData,
      del,
    };
  },
});
</script>

<style lang="scss" scoped></style>
