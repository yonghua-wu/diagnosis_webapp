<template>
  <div class="container rule-view">
    <Breadcrumb :items="['系统管理', '角色管理']" />
    <a-card>
      <RD2Vue
        ref="refRDVue"
        :data="tableData"
        v-model:queryData="filterData"
        v-model:selectedRowKeys="selectedRowKeys"
        :tableColumn="tableColumns"
        :decorateLoadData="loadData"
        @clickRow="clickView"
        @row-edit="clickEdit"
        @row-delete="clickDelete"
        @row-view="clickView"
        @click-add="clickCreate"
        @selected-delete="clickBatchDelete"
      >
        <template #filter>
          <a-form :model="filterData">
            <a-form-item field="search" label="搜索" label-col-flex="80px" style="width: 380px">
              <a-input-group>
                <a-select v-model="filterData.field" placeholder="搜索字段" style="width: 160px">
                  <a-option label="名称" value="name"></a-option>
                  <a-option label="编码" value="code"></a-option>
                </a-select>
                <a-input :max-length="50" v-model="filterData.search" placeholder="搜索" allow-clear />
              </a-input-group>
            </a-form-item>
          </a-form>
        </template>
      </RD2Vue>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SeeingTree from "./components/SeeingTree.vue";
import RD2Vue from "@/components/lib/RD2";
import Role, { RoleModel } from "@/api/tenant/Role";
import Message from "@/utils/Message";
import { Modal } from "@arco-design/web-vue";

const columns = [
  {
    title: "名称",
    dataIndex: "t_name",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "编码",
    dataIndex: "t_code",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "备注",
    dataIndex: "t_remark",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "创建时间",
    dataIndex: "t_createdTime",
    width: 180,
  },
  {
    title: "操作人",
    dataIndex: "t_updatedBy",
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "操作时间",
    dataIndex: "t_updatedTime",
    width: 180,
  },
  {
    title: "操作",
    slotName: "operation",
    width: 120,
  },
];

export default defineComponent({
  name: "rule-view",
  components: {
    Breadcrumb,
    // SeeingTree,
    RD2Vue,
  },
  setup() {
    const tableData = ref<RoleModel[]>([]);
    const loadData = (query: any) => {
      return Role.page(query.current, query.pageSize, {
        [query.field]: query.search,
      }).then((res) => {
        tableData.value = res.list.map((item) => {
          return {
            ...item,
            key: item.id,
            t_name: item.name,
            t_code: item.code,
            t_remark: item.remark,
            t_createdTime: item.createdTime,
            t_updatedBy: item.updatedBy,
            t_updatedTime: item.updatedTime,
          };
        });
        return res;
      });
    };
    const filterData = reactive({
      search: "",
      field: "name",
    });

    const selectedRowKeys = ref<string[]>([]);
    const selected = ref(false);
    watch(selectedRowKeys, () => {
      if (selectedRowKeys.value.length === 0) {
        selected.value = false;
      } else {
        selected.value = true;
      }
    });
    const router = useRouter();
    const refRDVue = ref();
    const clickView = (record: RoleModel) => {
      router.push({ name: "RoleManagementDetail", params: { id: record.id, model: "View" } });
    };
    const clickEdit = (record: RoleModel) => {
      router.push({ name: "RoleManagementDetail", params: { id: record.id, model: "Edit" } });
    };
    const clickCreate = () => {
      router.push({ name: "RoleManagementDetail", params: { model: "Add" } });
    };
    const doDelele = (list: string[]) => {
      return new Promise((reslove, reject) => {
        Modal.warning({
          title: "删除",
          content: "确定删除吗？",
          closable: true,
          cancelText: "取消",
          hideCancel: false,
          onOk: () => {
            Promise.all(
              list.map((id) => {
                return Role.delete(id);
              }),
            )
              .then(() => {
                Message.success("删除成功");
                reslove(true);
              })
              .catch(() => {
                Message.error("删除失败");
                reslove(false);
              })
              .finally(() => {
                refRDVue.value.loadTableData();
              });
          },
          onCancel: () => {
            reject();
          },
        });
      });
    };
    const clickDelete = (record: RoleModel) => {
      doDelele([record.id as string]);
    };
    const clickBatchDelete = () => {
      doDelele(selectedRowKeys.value).then(() => {
        selectedRowKeys.value = [];
      });
    };
    return {
      tableData,
      loadData,
      filterData,
      selectedRowKeys,
      selected,
      refRDVue,
      clickView,
      clickEdit,
      clickBatchDelete,
      clickCreate,
      clickDelete,
      tableColumns: columns,
    };
  },
});
</script>

<style lang="less" scoped>
.rule-view {
  .departments {
    padding-right: 16px;
    border-right: 1px solid var(--color-neutral-3);
  }
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
