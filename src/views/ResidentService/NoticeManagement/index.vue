<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="del"
    :operation="['view', 'opertion-publish']"
    :add-text="'新公告'"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['客户服务', '公告管理']" />
    </template>
    <template #opertion-publish="{ record, defaultAttr }">
      <a-link :disabled="record.data.state === 1" v-bind="defaultAttr" @click.stop="publish(record)">立即发布</a-link>
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Notice, { NoticeModel } from "@/api/tenant/Notice";
import { Modal, TableRowSelection } from "@arco-design/web-vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import Message from "@/utils/Message";
import moment from "moment";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { deepClone, formatDateTime } from "@/utils/utils";

export default defineComponent({
  name: "natice-management",
  components: {
    Breadcrumb,
    //RD2Vue,
    SfTablePage,
  },
  setup() {
    const { formatLoadData } = useFormatData<NoticeModel>((item) => {
      return {
        key: item.id,
        data: item,
        title: item.title,
        content: item.content,
        disabled: item.state === 1 ? true : false,
        state: item.state === 1 ? "已发布" : "草稿",
        publishTime: item.publishTime === "1900-01-01 00:00:00" ? "" : item.publishTime,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "标题",
            dataIndex: "title",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "内容",
            dataIndex: "content",
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "公告状态",
            dataIndex: "state",
            width: 100,
            filterable: {
              group: 1,
              type: "radio",
              queryField: "state",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                {
                  text: "已发布",
                  value: "1",
                },
                {
                  text: "草稿",
                  value: "2",
                },
              ],
            },
          },
          {
            title: "发布时间",
            dataIndex: "publishTime",
            width: 180,
            filterable: {
              type: "range-picker",
            },
          },
          {
            // 如果没有自定义操作项，去掉即可
            title: "操作",
            // 操作列 slotName 固定为 table-operation
            slotName: "table-operation",
            // 62 为单个预置的操作按钮的宽度，32为单元格 padding 宽度
            width: 72 + 62 + 32,
          },
        ];
      }),
      ["NO", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);
    const formatQueryData = (_query: Record<string, any>) => {
      interface Query {
        [keys: string]: any;
      }
      const query: Query = deepClone(_query);
      _query.updatedTime && (query.startUpdatedTime = formatDateTime(_query.updatedTime[0]));
      _query.updatedTime && (query.endUpdatedTime = formatDateTime(moment(_query.updatedTime[1]).add(1, "days")));
      delete query.updatedTime;
      return query;
    };
    const loadData = (current: number, pageSize: number) => {
      return Notice.page(current, pageSize, formatQueryData(fQueryData.value));
    };
    const del = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return Notice.delete(id);
        }),
      ).then(() => {
        rowSelection.selectedRowKeys = [];
      });
    };
    const refSfTablePage = ref();
    const rowSelection = reactive<TableRowSelection>({
      selectedRowKeys: [],
    });
    const publish = (record: any) => {
      console.log(record.data.id);
      Modal.warning({
        title: "提示",
        content: "确认立即发布？",
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onOk: () => {
          const close = Message.delayLoading("发布中...", 1000);
          Notice.publish(record.data.id)
            .then(() => {
              close();
              Message.success("成功");
              refSfTablePage.value.reLoadData();
            })
            .catch(() => {
              close();
            });
        },
      });
    };
    return {
      refSfTablePage,
      tableColumns,
      queryData,
      rowSelection,
      formatLoadData,
      loadData,
      del,
      publish,
    };
  },
});
</script>

<style lang="less" scoped>
@import "@arco-design/web-vue/es/style/theme/global.less";
.container {
  padding: 0 20px 20px 20px;
}
.notice-management {
  .filter-bar {
    border-bottom: 1px solid var(--color-border-2);
  }
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
