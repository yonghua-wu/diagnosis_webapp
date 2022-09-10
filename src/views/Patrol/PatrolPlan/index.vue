<template>
  <div class="container patrol-configuration">
    <Breadcrumb :items="['巡检中心', '巡检计划']" />
    <a-card>
      <a-space direction="vertical" fill>
        <a-row justify="space-between">
          <a-col flex="240px">
            <!-- <a-input-search placeholder="搜索" /> -->
          </a-col>
          <a-col flex="auto" style="text-align: right">
            <a-space>
              <a-button status="danger" v-if="rowSelection.selectedRowKeys.length" @click="clickDelete">
                <template #icon>
                  <icon-delete />
                </template>
                删除({{ rowSelection.selectedRowKeys.length }})
              </a-button>
              <a-button type="primary" @click="addPatrolPlan">
                <template #icon>
                  <icon-plus />
                </template>
                添加巡检计划
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-row>
          <a-table
            :bordered="false"
            :table-layout-fixed="true"
            column-resizable
            :filter-icon-align-left="true"
            :columns="columns"
            :data="tableData"
            :row-selection="rowSelection"
            :pagination="pagination"
            @row-click="rowClick"
            @select="rowSelect"
            @select-all="selectAll"
            @page-change="pageChange"
            @page-size-change="pageSizeChange"
          >
            <template #status="{ rowIndex }">
              <a-switch
                v-model="tableData[rowIndex].status"
                :loading="switchLoadingIndex === rowIndex"
                :checked-value="1"
                :unchecked-value="0"
                @click.stop="(v: any) => clickSwitchStatus(v, tableData[rowIndex], rowIndex)"
              >
                <template #checked> 开 </template>
                <template #unchecked> 关 </template>
              </a-switch>
            </template>
          </a-table>
        </a-row>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue/es/table/interface";
import { useRouter } from "vue-router";
import PatrolPlan from "@/api/edge/patrolPlan";
import moment from "moment";
import EventType from "@/api/edge/eventType";
import { Message, Modal } from "@arco-design/web-vue";

function useTable() {
  const router = useRouter();
  const isSelectAll = ref(false);
  const rowSelection = reactive<TableRowSelection>({
    type: "checkbox",
    showCheckedAll: true,
    width: 25,
    selectedRowKeys: [],
  });

  const columns = reactive<TableColumnData[]>([
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "巡检事件",
      dataIndex: "eventName",
    },
    {
      title: "计划执行时间",
      dataIndex: "frequency",
      width: 220,
    },
    {
      title: "截图频率",
      dataIndex: "timeRange",
    },
    {
      title: "状态",
      dataIndex: "status",
      slotName: "status",
    },
  ]);
  const tableData = ref<TableData[]>([]);

  const pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 20,
    showPageSize: true,
  });
  const pageChange = (page: number) => {
    pagination.current = page;
  };
  const pageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
  };

  const tableLoading = ref(false);
  const loadTableData = () => {
    tableLoading.value = true;
    PatrolPlan.page(pagination.current, pagination.pageSize)
      .then((res) => {
        pagination.total = res.total;
        tableData.value = res.data.map((item: any) => {
          let timeRange: string;
          if (!item.scheduConfig) {
            timeRange = "-";
          } else {
            const cron = item.scheduConfig.triggerCrons[0].split(" ");
            const m = cron[1];
            let h = cron[2];
            if (m.split("/").length === 2) {
              timeRange = `${h.split("-")[0]}h - ${Number(h.split("-")[1]) + 1}h，每${m.split("/")[1]}分钟一次`;
            } else {
              h = h.split("/");
              timeRange = `${h[0].split("-")[0]}h - ${Number(h[0].split("-")[1]) + 1}h，每${h[1]}小时一次`;
            }
          }
          return {
            ...item,
            key: item.uuid,
            timeRange,
            frequency: moment(item.scheduConfig.startTime).format("yyyy-MM-DD") + " - " + moment(item.scheduConfig.stopTime).format("yyyy-MM-DD"),
          };
        });
      })
      .finally(() => {
        tableLoading.value = false;
      })
      .then(() => {
        const reqMap: any = {};
        tableData.value.map((item) => {
          if (reqMap[item.event_type_id] != undefined) {
            reqMap[item.event_type_id].then((res: any) => {
              item.eventName = res.name;
            });
          } else {
            const req = EventType.findById(item.event_type_id).then((res) => {
              item.eventName = res.name;
              return res;
            });
            reqMap[item.event_type_id] = req;
          }
        });
      });
  };
  loadTableData();
  const rowClick = (record: TableData) => {
    router.push({
      name: "ViewPatrolPlan",
      params: {
        id: record.uuid,
      },
    });
    // openModal(record);
  };
  const rowSelect = (rowKeys: string[]) => {
    console.log("rowKeys", rowKeys);
    rowSelection.selectedRowKeys = rowKeys;
  };

  const selectAll = (e: boolean) => {
    if (e) {
      (rowSelection.selectedRowKeys as string[]) = tableData.value.map((data) => data.key as string);
      isSelectAll.value = true;
    } else {
      rowSelection.selectedRowKeys = [];
      isSelectAll.value = false;
    }
  };

  return {
    columns,
    tableData,
    rowSelection,
    pagination,
    loadTableData,
    pageSizeChange,
    pageChange,
    selectAll,
    rowClick,
    rowSelect,
  };
}

export default defineComponent({
  name: "PatrolConfiguration",
  components: {
    Breadcrumb,
  },
  setup() {
    const router = useRouter();
    const addPatrolPlan = () => {
      router.push({ name: "AddPatrolPlan" });
    };
    const { columns, tableData, rowSelection, pagination, loadTableData, pageSizeChange, pageChange, selectAll, rowClick, rowSelect } = useTable();
    const switchLoadingIndex = ref(-1);
    const clickSwitchStatus = (v: any, record: any, index: number) => {
      switchLoadingIndex.value = index;
      PatrolPlan.update({
        eventConfigId: record.eventConfigId,
        event_type_id: record.event_type_id,
        json_data: record.json_data,
        judgeType: record.judgeType,
        name: record.name,
        outputType: record.outputType,
        scheduConfig: record.scheduConfig,
        selectedSpaceIds: record.selectedSpaceIds,
        storageConfig: record.storageConfig,
        uuid: record.uuid,
        watcherIds: record.watcherIds,
        status: record.status,
        space_id: record.space_id,
        bind_user_uuid: record.bind_user_uuid,
      })
        .then(() => {
          Message.success("切换成功");
        })
        .catch(() => {
          Message.error("切换失败");
          record.status = !record.status;
        })
        .finally(() => {
          switchLoadingIndex.value = -1;
        });
    };
    const clickDelete = () => {
      const deleteList: string[] = rowSelection.selectedRowKeys || [];
      Modal.warning({
        title: "提示",
        content: `确认删除这${deleteList.length}个计划?`,
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onBeforeOk: (done: (flag: boolean) => void) => {
          PatrolPlan.delete(deleteList)
            .then(() => {
              Message.success("删除成功");
              done(true);
              loadTableData();
              rowSelection.selectedRowKeys = [];
            })
            .catch(() => {
              done(false);
            });
        },
      });
    };
    return {
      columns,
      tableData,
      rowSelection,
      pagination,
      switchLoadingIndex,
      clickDelete,
      clickSwitchStatus,
      pageSizeChange,
      pageChange,
      selectAll,
      rowClick,
      rowSelect,
      addPatrolPlan,
    };
  },
});
</script>

<style lang="less" scoped>
.patrol-configuration {
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
