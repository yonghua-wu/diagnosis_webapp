<template>
  <div class="container pay-view">
    <Breadcrumb :items="['客户服务', '业主审核']" />
    <a-card>
      <a-row :wrap="false" align="stretch" justify="start">
        <a-col class="pay" flex="auto">
          <a-form :model="queryParams">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="姓名">
                  <a-input v-model="queryParams.name" placeholder="请输入姓名" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="证件号码">
                  <a-input v-model="queryParams.ic" placeholder="请输入证件号码" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系方式">
                  <a-input v-model="queryParams.phone" placeholder="请输入手机号" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="房号">
                  <a-input v-model="queryParams.unitName" placeholder="请输入房号" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="状态">
                  <a-select v-model="queryParams.status" placeholder="请选择状态">
                    <a-option v-for="item in statusOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="创建日期">
                  <a-date-picker v-model="queryParams.createdTime" placeholder="请选择创建日期" />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="操作日期">
                  <a-date-picker v-model="queryParams.updatedTime" placeholder="请选择操作日期" />
                </a-form-item>
              </a-col>
              <a-col :span="99.5"></a-col>
              <a-col :span="99.5"></a-col>
              <a-col :span="1.5">
                <a-button size="large" type="primary" @click="clickFilter">查询</a-button>
              </a-col>

              <a-col :span="1">
                <a-button size="large" type="outline" @click="clickReset">重置</a-button>
              </a-col>
            </a-row>
          </a-form>

          <a-spin :loading="loading" style="width: 100%">
            <a-table :columns="columns" :data="tableData" :pagination="queryParams" @page-change="pageChange" @page-size-change="pageSizeChange">
              <template #deed="{ record }">
                <a-image :src="record.deed" height="50" width="50" />
              </template>
              <template #type="{ record }">
                <a-space>
                  <a-tag v-if="record.type == 1">业主</a-tag>
                  <a-tag v-if="record.type == 3">住客</a-tag>
                </a-space>
              </template>
              <template #icType="{ record }">
                <a-space>
                  <a-tag v-if="record.icType == 1">身份证</a-tag>
                  <a-tag v-if="record.icType == 2">军官证</a-tag>
                  <a-tag v-if="record.icType == 3">护照</a-tag>
                  <a-tag v-if="record.icType == 4">其他</a-tag>
                </a-space>
              </template>
              <template #status="{ record }">
                <a-space>
                  <a-tag v-if="record.personUnitVo.status == 1">审核通过</a-tag>
                  <a-tag v-if="record.personUnitVo.status == 2">禁用</a-tag>
                  <a-tag v-if="record.personUnitVo.status == 3">待审核</a-tag>
                  <a-tag v-if="record.personUnitVo.status == 99">审核不通过</a-tag>
                </a-space>
              </template>

              <template #options="{ record }">
                <a-button size="small" type="text" @click="clickDetails(record)">
                  <icon-eye />
                  详情
                </a-button>
                <!--                <a-button size="mini" type="primary" @click="handleExamine(record)">通过</a-button>-->
                <!--                <a-button :disabled="record.status == 1 ? true : false" size="mini" status="warning" @click="handleDelete(record)">不通过 </a-button>-->
              </template>
            </a-table>
          </a-spin>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Owner, { OwnerModel } from "@/api/tenant/Owner";
import Message from "@/utils/Message";
import modal from "@arco-design/web-vue/es/modal";
import { useRouter } from "vue-router";
import { TableColumnData } from "@arco-design/web-vue";

const columns: TableColumnData[] = [
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "房号",
    dataIndex: "personUnitVo.unitName",
    align: "center",
  },
  {
    title: "证件类型",
    dataIndex: "icType",
    slotName: "icType",
    align: "center",
  },
  {
    title: "证件号码",
    dataIndex: "ic",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "type",
    slotName: "type",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "personUnitVo.createdTime",
    align: "center",
  },
  {
    title: "操作人",
    dataIndex: "",
    align: "center",
  },
  {
    title: "操作时间",
    dataIndex: "personUnitVo.updatedTime",
    align: "center",
  },
  {
    title: "操作",
    slotName: "options",
    align: "center",
  },
];
const statusOptions: any[] = [
  {
    value: 0,
    label: "全部",
  },
  {
    value: 3,
    label: "待审核",
  },
  {
    value: 1,
    label: "审核通过",
  },
  {
    value: 99,
    label: "审核不通过",
  },
];

export default defineComponent({
  name: "pay-view",
  components: {
    Breadcrumb,
    // SeeingTree,
  },
  setup() {
    const loading = ref(true);
    const tableData = ref<OwnerModel[]>([]);
    // 分页请求参数
    const queryParams = reactive({
      pageNo: 1,
      pageSize: 20,
      total: 0,
      status: 3,
      showPageSize: true,
      fuzzy: "",
      name: undefined,
      ic: undefined,
      phone: undefined,
      unitName: undefined,
      createdTime: undefined,
      updatedTime: undefined,
    });
    // 审核请求参数
    const apply = reactive({
      personId: "",
      status: 0,
      personUnitId: "",
    });
    const router = useRouter();
    // 页面更改
    const pageChange = (page: number) => {
      queryParams.pageNo = page;
      getList();
    };
    // 页面大小更改
    const pageSizeChange = (pageSize: number) => {
      queryParams.pageSize = pageSize;
      getList();
    };
    // 页面加载
    onMounted(() => {
      getList();
    });
    // 获取数据
    const getList = () => {
      loading.value = true;
      Owner.getOwnerList(queryParams).then((res: any) => {
        if (res.list != null) {
          tableData.value = res.list.map((item: any) => {
            return {
              ...item,
              deed: item.personUnitVo.deed,
              type: item.personUnitVo.type,
              status: item.personUnitVo.status,
            };
          });
          queryParams.total = res.total;
          loading.value = false;
        } else {
          tableData.value = [];
          loading.value = false;
        }
      });
    };
    // 审核通过
    const handleExamine = (row: any) => {
      apply.personId = row.personId;
      apply.personUnitId = row.personUnitVo.personUnitId;
      apply.status = 1;
      console.log("apply", apply);
      Owner.ownerModify(apply).then((res) => {
        if (res.code == 200) {
          getList();
          Message.success("审核成功");
        } else {
          Message.error("审核失败,请联系管理员");
        }
      });
    };
    // 审核不通过
    const handleDelete = (row: any) => {
      apply.personId = row.personId;
      apply.personUnitId = row.personUnitVo.personUnitId;
      apply.status = 99;
      modal.warning({
        title: "提示",
        content: "是否审核不通过业主" + row.name,
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onOk: () => {
          Owner.ownerModify(apply).then((res) => {
            if (res.code == 200) {
              getList();
              Message.success("审核成功");
            } else {
              Message.error("审核失败,请联系管理员");
            }
          });
        },
      });
    };
    // 通过状态筛选
    const changeState = (row: any) => {
      console.log("row", row);
      queryParams.status = row;
      getList();
    };
    // 搜索
    const search = (row: any) => {
      queryParams.fuzzy = row;
      getList();
    };
    // 搜索清空事件
    const clearUp = () => {
      console.log("clearUp");
      getList();
    };

    const clickFilter = () => {
      getList();
    };
    const clickDetails = (row: any) => {
      console.log(row.personId);
      // Owner.getAllPerson(row.personId);
      router.push({ name: "OwnerAuditDetail", params: { id: row.personId, personUnitId: row.personUnitVo.personUnitId, model: "View" } });
    };
    const clickReset = () => {
      queryParams.fuzzy = ""; // 搜索框清空
      queryParams.status = 3; // 状态清空
      queryParams.name = undefined; // 姓名
      queryParams.ic = undefined; // 身份证
      queryParams.phone = undefined; // 手机号
      queryParams.unitName = undefined; // 单位名称
      queryParams.createdTime = undefined; // 创建时间
      queryParams.updatedTime = undefined; // 更新时间
      getList();
    };
    return {
      tableData,
      clickFilter,
      tableColumns: columns,
      columns,
      handleExamine,
      handleDelete,
      loading,
      queryParams,
      pageSizeChange,
      pageChange,
      changeState,
      search,
      clearUp,
      clickDetails,
      statusOptions,
      clickReset,
    };
  },
});
</script>

<style lang="less" scoped>
.pay-view {
  .departments {
    padding-right: 16px;
    border-right: 1px solid var(--color-neutral-3);
  }

  .pay {
    padding-left: 16px;

    :deep(.arco-table-tr) {
      cursor: pointer;
    }
  }
}
</style>
