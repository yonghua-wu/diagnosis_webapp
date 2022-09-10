<template>
  <div class="container">
    <Breadcrumb :items="['工单管理', '工作步骤']" />
    <a-card>
      <RDVue
        ref="refRDVue"
        v-model="tableData"
        v-model:queryData="filterData"
        v-model:selectedRowKeys="selectedRowKeys"
        :tableColumn="tableColumns"
        :decorateLoadData="loadData"
        @clickRow="clickRow"
      >
        <template #filter>
          <a-form :model="filterData" style="width: 500px">
            <a-form-item label-col-flex="80px" label="步骤名称" field="key">
              <a-input :max-length="50" v-model="filterData.search" placeholder="搜索" allow-clear />
            </a-form-item>
          </a-form>
        </template>
        <template #selected-options>
          <a-button :disabled="!selected" status="danger">删除</a-button>
        </template>
        <template #normal-options>
          <a-button type="primary" @click="clickCreate">新步骤</a-button>
        </template>
      </RDVue>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import RDVue from "@/components/lib/RD";
import { TableColumnData, TableData } from "@arco-design/web-vue/es/table/interface";
import { useRouter } from "vue-router";

const tableColumns: TableColumnData[] = [
  {
    title: "步骤名称",
    dataIndex: "t_name",
  },
  {
    title: "步骤数",
    dataIndex: "t_stepNum",
  },
  {
    title: "创建时间",
    dataIndex: "t_createTime",
  },
  {
    title: "更新时间",
    dataIndex: "t_updateTime",
  },
];

export default defineComponent({
  name: "work-steps",
  components: {
    Breadcrumb,
    RDVue,
  },
  setup() {
    const filterData = reactive({
      search: "",
    });
    const tableData = ref<TableData[]>([
      {
        key: "12",
        t_name: "12",
        t_stepNum: "12",
        t_createTime: "12",
        t_updateTime: "12",
      },
    ]);
    const tableDataMap = ref<any>({});
    const loadData = () => {
      // return BpmModel.getModelPage(queryParams).then((response: any) => {
      //   list.value = response.data.list.map((item: any) => {
      //     return {
      //       ...item,
      //       cronDesc: item.cronDesc && JSON.parse(item.cronDesc),
      //       createTime: moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
      //     };
      //   });
      //   queryParams.total = response.data.total;
      //   loading.value = false;
      // });
      return Promise.resolve({ total: 1 });
    };

    const selectedRowKeys = ref<string[]>([]);
    const selected = ref(false);
    watch(selectedRowKeys, () => {
      if (selectedRowKeys.value.length === 0) {
        selected.value = false;
      } else {
        selected.value = true;
      }
    });
    const refRDVue = ref();
    const clickCreate = () => {
      router.push({ name: "WorkStepsDetail", params: { model: "Add" } });
    };
    const router = useRouter();
    const clickRow = (record: any) => {
      console.log("record", record);
      router.push({ name: "WorkStepsDetail", params: { model: "View", id: record.t_id } });
    };

    return {
      tableData,
      tableColumns,
      tableDataMap,
      selectedRowKeys,
      selected,
      refRDVue,
      filterData,
      loadData,
      clickCreate,
      clickRow,
    };
  },
});
</script>

<style lang="less" scoped>
.my-process-designer {
  height: 900px;
}
:deep(.arco-table-tr) {
  cursor: pointer;
}
</style>
