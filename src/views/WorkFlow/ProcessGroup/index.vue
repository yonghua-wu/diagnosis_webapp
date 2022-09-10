<template>
  <SfTable
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :formatQueryData="formatQueryData"
    :defaultShowColumn="['NO', 'name', 'description', 'memberUser', 'stateText', 'updatedBy', 'updatedTime', 'table-operation']"
    :tableColumns="tableColumns"
    v-model:queryData="queryData"
    :row-delete="del"
    :click-selected-delete="dels"
    v-model:selectedRowKeys="selectedRowKeys"
    :operation="['view', 'opertion-publish']"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['工作流程', '用户组']" />
    </template>
  </SfTable>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import SfTable from "@/components/lib/RD3/SfTable";
import Breadcrumb from "@/components/Breadcrumb.vue";
import ProcessGroup, { ProcessGroupModel } from "@/api/tenant/ProcessGroup";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
import { TableData } from "@arco-design/web-vue";
import Staff from "@/api/tenant/Staff";
export default defineComponent({
  name: "test-page",
  components: {
    SfTable,
    Breadcrumb,
  },
  setup() {
    const userIdMap = reactive<Record<string, any>>({});
    const getUserInfo = (userId: string) => {
      if (userIdMap[userId] !== undefined) {
        return Promise.resolve(userIdMap[userId]);
      } else {
        return Staff.detail(userId).then((res) => {
          userIdMap[userId] = res?.name || "";
        });
      }
    };
    const loadData = (current: number, size: number, query: any) => {
      return ProcessGroup.page(current, size, query).then((res) => {
        let p: any = Promise.resolve();
        res.list.forEach((item) => {
          p = p.then(() => {
            return Promise.all(
              item.memberUserIds.map((id) => {
                return getUserInfo(id);
              }),
            );
          });
        });
        return p.then(() => res);
      });
    };
    const formatLoadData = (data: ProcessGroupModel[]) => {
      return data.map((item) => {
        return {
          key: String(item.userGroupId),
          data: item,
          userGroupId: item.userGroupId,
          name: item.name,
          description: item.description,
          memberUser: item.memberUserIds
            .map((id) => userIdMap[id])
            .filter((name) => name)
            .reduce((a, b) => `${a}, ${b}`),
          stateText: item.state === 1 ? "开启" : "关闭",
        };
      });
    };
    const selectedRowKeys = ref<string[]>([]);
    const tableColumns: RdTableColumnData[] = reactive([
      {
        title: "编号",
        dataIndex: "userGroupId",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "组名",
        dataIndex: "name",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "描述",
        dataIndex: "description",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "成员",
        dataIndex: "memberUser",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "状态",
        dataIndex: "stateText",
        width: 100,
        filterable: {
          align: "filter-bar",
          type: "radio",
          queryField: "state",
          defaultValue: "-999",
          filters: [
            {
              text: "全部",
              value: "-999",
            },
            {
              text: "开启",
              value: "1",
            },
            {
              text: "关闭",
              value: "2",
            },
          ],
        },
      },
    ]);
    const queryData = reactive<any>({
      state: "-999",
    });
    const formatQueryData = (data: any) => {
      const q: any = {};
      Object.keys(data).forEach((k) => {
        if (data[k] !== "-999" && data[k] !== -999 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
          q[k] = data[k];
        }
      });
      return q;
    };
    const del = ProcessGroup.delete;
    const dels = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return ProcessGroup.delete(id);
        }),
      );
    };
    return {
      userIdMap,
      loadData,
      formatLoadData,
      formatQueryData,
      selectedRowKeys,
      tableColumns,
      queryData,
      dels,
      del,
    };
  },
});
</script>

<style lang="scss" scoped></style>
