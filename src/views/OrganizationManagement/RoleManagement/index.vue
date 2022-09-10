<template>
  <SfTablePage
    ref="refSfTablePage"
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="rowSelection"
    :del="del"
    :operation="['edit', 'permission-setting']"
    :row-edit="onEdit"
    :click-add="onAdd"
    @select="(keys: string[]) => (rowSelection.selectedRowKeys = keys)"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['组织管理', '角色管理']" />
    </template>
    <template #permission-setting="{ record, defaultAttr }">
      <a-link v-bind="defaultAttr" @click="onPermissionSetting(record)">权限配置</a-link>
    </template>
  </SfTablePage>
  <EditRoleModal ref="refEditRoleModal" :reload="reload"></EditRoleModal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import { TableData, TableRowSelection } from "@arco-design/web-vue";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { PaginationModel } from "@/api/tenant/base";
import EditRoleModal from "./components/EditRoleModal.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
export default defineComponent({
  name: "role-mamagement",
  components: {
    SfTablePage,
    EditRoleModal,
    Breadcrumb,
  },
  setup() {
    // TODO: 定义角色 page 类型
    const { formatLoadData } = useFormatData<any>((item) => {
      return {
        key: item.id,
        data: item,
        name: item.name,
        remark: item.remark,
        permissionGroupList: item.permissionGroupList,
        isDefault: item.isDefault,
        defaultDepartment: item.defaultDepartment,
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => [
        {
          title: "角色名称",
          dataIndex: "name",
          width: 200,
          ellipsis: true,
          tooltip: true,
          filterable: {
            type: "search",
          },
        },
        {
          title: "角色描述",
          dataIndex: "remark",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "关联的权限组",
          dataIndex: "permissionGroupList",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "是否默认",
          dataIndex: "isDefault",
          width: 80,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "默认部门",
          dataIndex: "defaultDepartment",
          width: 180,
          ellipsis: true,
          tooltip: true,
        },
      ]),
      ["NO", "createdTime", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);

    const loadData = (current: number, pageSize: number, query: any) => {
      // TODO: 缺少角色 page 请求
      return Promise.resolve() as unknown as unknown as Promise<PaginationModel<any[]>>;
    };
    const del = (ids: string[]) => {
      // TODO: 缺少删除角色请求
      return Promise.resolve();
    };
    const refEditRoleModal = ref();
    const onAdd = () => {
      // TODO: 新增角色，弹窗
    };
    const onEdit = (record: TableData) => {
      // TODO: 单个编辑，弹窗
    };
    const onPermissionSetting = (record: TableData) => {
      // TODO: 跳转页面，配置权限
    };
    const refSfTablePage = ref();
    const reload = refSfTablePage.value.reLoadData;
    const rowSelection = reactive<TableRowSelection>({
      showCheckedAll: false,
      selectedRowKeys: [],
    });
    return {
      queryData,
      tableColumns,
      rowSelection,
      reload,
      refSfTablePage,
      refEditRoleModal,
      del,
      onEdit,
      onAdd,
      onPermissionSetting,
      formatLoadData,
      loadData,
    };
  },
});
</script>

<style lang="less" scoped>
.role-mamagement {
}
</style>
