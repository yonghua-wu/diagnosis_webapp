<template>
  <SfTablePage
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="false"
    :operation="['view', 'edit']"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['用户管理']" />
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
import { computed, defineComponent, reactive } from "vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import User from "@/api/diagnosis/User";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { TableRowSelection } from "@arco-design/web-vue";

// 职称 1 初级职称 (医士、医师/住院医师)、2 中级职称 (主治医师)、3 副高级职称 (副主任医师)、4 正高级职称 (主任医师)
const titleMap = {
  1: "初级职称",
  2: "中级职称",
  3: "副高级职称",
  4: "正高级职称",
};
export default defineComponent({
  name: "user-index",
  components: {
    SfTablePage,
    Breadcrumb,
  },
  setup() {
    const { formatLoadData } = useFormatData<any>((item) => {
      return {
        key: item.id,
        data: item,
        username: item.username,
        realName: item.realName,
        workExperience: item.workExperience + "年",
        title: titleMap[item.title as keyof typeof titleMap],
        updatedTime: item.updatedTime,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "登录名",
            dataIndex: "username",
          },
          {
            title: "姓名",
            dataIndex: "realName",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "工作经验",
            dataIndex: "workExperience",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "职称",
            dataIndex: "title",
            ellipsis: true,
            tooltip: true,
          },
        ];
      }),
      ["updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);

    const loadData = (current: number, pageSize: number, query: any) => {
      return User.page(current, pageSize);
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
    };
  },
});
</script>

<style lang="scss" scoped>
.user-index {
}
</style>
