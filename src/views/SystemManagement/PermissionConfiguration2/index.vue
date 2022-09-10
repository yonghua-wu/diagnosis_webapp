<template>
  <div class="permission-configuration container">
    <Breadcrumb :items="['系统管理', '权限配置']" />
    <a-card>
      <a-space direction="vertical" fill>
        <a-form :model="filterData" layout="inline">
          <a-form-item field="name" label="名称" label-col-flex="100px" style="width: 310px">
            <a-input :max-length="50" v-model="filterData.name" placeholder="搜索" allow-clear />
          </a-form-item>
          <a-form-item field="code" label="编码" label-col-flex="100px" style="width: 310px">
            <a-input :max-length="50" v-model="filterData.code" placeholder="搜索" allow-clear />
          </a-form-item>
        </a-form>
        <div class="control">
          <div class="select-option">
            <a-space>
              <a-tooltip content="删除">
                <a-button status="danger" @click="dels" :disabled="!rowSelection.selectedRowKeys?.length">
                  <template #icon>
                    <icon-delete />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tag v-if="rowSelection.selectedRowKeys?.length" size="large" closable @close="() => (rowSelection.selectedRowKeys = [])">
                已选择 {{ rowSelection.selectedRowKeys?.length }} 条数据
              </a-tag>
            </a-space>
          </div>
          <div class="normal-option">
            <a-button type="primary" @click="add">
              <template #icon>
                <icon-plus />
              </template>
              添加
            </a-button>
            <a-divider direction="vertical" />
            <a-tooltip content="刷新">
              <a-button shape="circle" @click="loadData">
                <icon-sync />
              </a-button>
            </a-tooltip>
          </div>
        </div>
        <a-table
          ref="refTable"
          :bordered="{
            headerCell: true,
            wrapper: false,
          }"
          :default-expand-all-rows="true"
          :indent-size="20"
          :sticky-header="0.1"
          :table-layout-fixed="true"
          :filter-icon-align-left="false"
          :data="tableData"
          :columns="tableColumn"
          :loading="loading"
          :pagination="false"
          :rowSelection="rowSelection"
          :scroll="{ x: 1300 }"
          @select="rowSelect"
        >
          <template #operation="{ record }">
            <a-link style="padding: 4px 8px" @click="view(record)">
              <template #icon>
                <icon-eye />
              </template>
              详情
            </a-link>
            <a-link v-if="record.data.type !== 'BUTTON'" style="padding: 4px 8px" @click="add(record)">
              <template #icon>
                <icon-plus />
              </template>
              添加子权限
            </a-link>
          </template>
        </a-table>
        <!-- <SfTree></SfTree> -->
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts">
import Permission from "@/api/tenant/Permission";
import { listToTree } from "@/utils/utils";
import { Modal, TableColumnData, TableData, TableRowSelection } from "@arco-design/web-vue";
import { defineComponent, h, nextTick, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import router from "@/router";
// import SfTree from "@/components/lib/SfTree/index.vue";
import { useDictStore } from "@/store";
import { computed } from "@vue/reactivity";
import Message from "@/utils/Message";

const tableColumn: TableColumnData[] = [
  {
    title: "名称",
    dataIndex: "name",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "编码",
    dataIndex: "code",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "类型",
    dataIndex: "type",
    width: 80,
  },
  {
    title: "备注",
    dataIndex: "remark",
    ellipsis: true,
    tooltip: true,
  },
  // {
  //   title: "创建时间",
  //   dataIndex: "createdTime",
  //   width: 180,
  // },
  {
    title: "操作人",
    dataIndex: "updatedBy",
    width: 100,
  },
  {
    title: "操作时间",
    dataIndex: "updatedTime",
    width: 180,
  },
  {
    title: "操作",
    slotName: "operation",
    width: 210,
  },
];

export default defineComponent({
  name: "permission-configuration",
  components: {
    Breadcrumb,
    // SfTree,
  },
  setup() {
    const dictStore = useDictStore();
    const PERMISSION_TYPE = computed(() => {
      return dictStore.PERMISSION_TYPE;
    });
    const loading = ref(false);
    const filterData = reactive({
      name: "",
      code: "",
    });
    const refTable = ref();
    const tableData = ref<TableData[]>([]);
    const loadData = () => {
      loading.value = true;
      Permission.getAll(filterData)
        .then((res) => {
          tableData.value = listToTree(
            res.map((item) => {
              return {
                key: item.id,
                data: item,
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                code: item.code,
                type: PERMISSION_TYPE.value[item.type],
                remark: item.remark,
                createdTime: item.createdTime,
                updatedBy: item.updatedBy,
                updatedTime: item.updatedTime,
              };
            }),
            "parentId",
            "id",
            "children",
          );
          nextTick(() => {
            refTable.value?.expandAll();
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };
    loadData();
    const rowSelection = reactive<TableRowSelection>({
      type: "checkbox",
      showCheckedAll: false,
      width: 25,
      selectedRowKeys: [],
      onlyCurrent: false,
    });
    const rowSelect = (rowKeys: string[]) => {
      rowSelection.selectedRowKeys = rowKeys;
    };
    const view = (record: TableData) => {
      router.push({ name: "PermissionConfiguration2Detail", params: { model: "View", id: record.key } });
    };
    const dels = () => {
      const check = (data: TableData[]) => {
        for (let i = 0; i < data.length; i++) {
          if (!rowSelection.selectedRowKeys?.some((k) => k === data[i].key)) {
            return false;
          }
          if (data[i].children?.length) {
            if (check(data[i].children as TableData[]) === false) {
              return false;
            }
          }
        }
        return true;
      };
      const deepFind = (list: TableData[], findKey: string) => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].key === findKey) {
            return list[i];
          }
          if (list[i].children?.length) {
            const r: any = deepFind(list[i].children as TableData[], findKey);
            if (r !== undefined) {
              return r;
            }
          }
        }
        return undefined;
      };
      const selectedData = rowSelection.selectedRowKeys?.map((k) => {
        return deepFind(tableData.value, k);
      });
      if (selectedData?.length && check(selectedData as TableData[])) {
        console.log(selectedData);
        console.log("校验通过");
        Modal.warning({
          title: "删除",
          content: "确定删除吗？",
          closable: true,
          cancelText: "取消",
          hideCancel: false,
          onOk: () => {
            const close = Message.delayLoading("删除中...", 500);
            Promise.all(
              selectedData.map((item) => {
                return Permission.delete(item.key);
              }),
            )
              .then(() => {
                Message.success("删除成功");
                loadData();
              })
              .finally(() => {
                close();
                rowSelection.selectedRowKeys = [];
              });
          },
        });
      } else {
        Modal.error({
          title: "错误",
          content: () =>
            h("div", [
              h("div", { style: { textAlign: "center" } }, "有未选择的子权限"),
              h("div", { style: { textAlign: "center" } }, "删除权限时如果当前权限有子权限，需要一起删除"),
            ]),
          closable: true,
          hideCancel: true,
        });
      }
    };
    const add = (record: TableData) => {
      router.push({ name: "PermissionConfiguration2Detail", params: { model: "Add" }, query: { parentId: record?.key } });
    };
    return {
      refTable,
      loading,
      tableColumn,
      tableData,
      filterData,
      rowSelection,
      loadData,
      rowSelect,
      view,
      add,
      dels,
    };
  },
});
</script>

<style lang="scss" scoped>
.permission-configuration {
  .control {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
:deep(.arco-table-checkbox .arco-checkbox) {
  padding: 13px 6px;
}
</style>
