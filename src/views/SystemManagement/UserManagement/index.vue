<template>
  <div class="container user-view">
    <Breadcrumb :items="['系统管理', '用户管理']" />
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
            <a-form-item field="status" label="状态" label-col-flex="80px" style="width: 380px">
              <a-radio-group v-model="filterData.status" type="button">
                <a-radio :value="-1">全部</a-radio>
                <a-radio :value="1">激活</a-radio>
                <a-radio :value="2">停用</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item field="search" label="搜索" label-col-flex="80px" style="width: 380px">
              <a-input-group>
                <a-select v-model="filterData.field" placeholder="搜索字段" style="width: 160px">
                  <a-option label="姓名" value="realName"></a-option>
                  <a-option label="登录账号" value="username"></a-option>
                  <a-option label="工号" value="empNo"></a-option>
                  <a-option label="手机号" value="userPhone"></a-option>
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
import RD2Vue from "@/components/lib/RD2";
import User, { UserModel } from "@/api/tenant/User";
import Message from "@/utils/Message";
import { Modal } from "@arco-design/web-vue";

const statusMap = {
  1: "激活",
  2: "停用",
};

const columns = [
  {
    title: "姓名",
    dataIndex: "t_name",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "账号",
    dataIndex: "t_account",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "工号",
    dataIndex: "t_workCode",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "联系方式",
    dataIndex: "t_userPhone",
    width: 140,
  },
  {
    title: "状态",
    dataIndex: "t_status",
    ellipsis: true,
    tooltip: true,
    width: 80,
  },
  {
    title: "创建时间",
    dataIndex: "t_createdTime",
    width: 180,
  },
  {
    title: "操作人",
    dataIndex: "t_updatedBy",
    width: 100,
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
  name: "user-view",
  components: {
    Breadcrumb,
    // SeeingTree,
    RD2Vue,
  },
  setup() {
    const tableData = ref<UserModel[]>([]);
    const loadData = (query: any) => {
      return User.page(query.current, query.pageSize, {
        [query.field]: query.search,
        status: query.status === -1 ? undefined : query.status,
      }).then((res) => {
        tableData.value = res.list.map((item) => {
          return {
            ...item,
            key: item.userId,
            t_name: item.realName,
            t_account: item.username,
            t_workCode: item.empNo,
            t_userPhone: item.userPhone,
            t_status: statusMap[item.status as keyof typeof statusMap],
            t_createdTime: item.createdTime,
            t_updatedBy: item.updatedBy,
            t_updatedTime: item.updatedTime,
          };
        });
        return res;
      });
    };
    const filterData = reactive({
      field: "realName",
      search: "",
      status: -1,
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
    const clickView = (record: any) => {
      router.push({ name: "UserManagementDetail", params: { id: record.userId, model: "View" } });
    };
    const clickEdit = (record: any) => {
      router.push({ name: "UserManagementDetail", params: { id: record.userId, model: "Edit" } });
    };
    const clickCreate = () => {
      router.push({ name: "UserManagementDetail", params: { model: "Add" } });
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
                return User.delete(id);
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
    const clickDelete = (record: any) => {
      doDelele([record.id]);
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
      clickCreate,
      clickDelete,
      clickBatchDelete,
      tableColumns: columns,
    };
  },
});
</script>

<style lang="less" scoped>
.user-view {
  .departments {
    padding-right: 16px;
    border-right: 1px solid var(--color-neutral-3);
  }
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
}
</style>
