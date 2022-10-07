<template>
  <SfTablePage
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="false"
    :operation="['view']"
    :clickAdd="false"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['图像管理']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Image from "@/api/diagnosis/Image";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { TableRowSelection } from "@arco-design/web-vue";

const imagePropertiesMap: any = {
  1: "左眼",
  2: "右眼",
};
const diagnosticStatusMap: any = {
  1: "未诊断",
  2: "已诊断",
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
        ...item,
        key: item.id,
        data: item,
        imageProperties: imagePropertiesMap[item.imageProperties],
        diagnosticStatus: diagnosticStatusMap[item.diagnosticStatus],
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "患者姓名",
            dataIndex: "patientName",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "图像地址",
            dataIndex: "imageAddress",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "图像属性",
            dataIndex: "imageProperties",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "AI诊断状态",
            dataIndex: "diagnosticStatus",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "结果图像",
            dataIndex: "resultImg",
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
      return Image.page(current, pageSize);
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
