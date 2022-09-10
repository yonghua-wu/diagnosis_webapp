<template>
  <div class="container pay-view">
    <Breadcrumb :items="['资产管理', '账单记录']" />
    <a-card>
      <a-row :wrap="false" align="stretch" justify="start">
        <a-col class="pay" flex="auto">
          <a-form :model="queryParams">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="房号">
                  <a-input v-model="queryParams.unitName" placeholder="请输入房号" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="缴费类型">
                  <a-input v-model="queryParams.assetName" placeholder="请输入缴费类型名称" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="账单编号">
                  <a-input v-model="queryParams.statementId" placeholder="请输入账单编号" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="缴费月份">
                  <a-select v-model="queryParams.month" placeholder="请选择缴费月份">
                    <a-option v-for="item in monthOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="缴费状态">
                  <a-select v-model="queryParams.payState" placeholder="请选择缴费状态">
                    <a-option v-for="item in payStateOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="缴费日期">
                  <a-date-picker v-model="queryParams.payTime" placeholder="请选择缴费日期" />
                </a-form-item>
              </a-col>

              <a-col :span="1.5">
                <a-button size="large" type="primary" @click="clickFilter">查询</a-button>
              </a-col>

              <a-col :span="1">
                <a-button size="large" type="outline" @click="clickReset">重置</a-button>
              </a-col>
            </a-row>
          </a-form>
          <!--          <a-form-item field="payState" label="缴费状态" label-col-flex="80px">-->
          <!--            <a-radio-group v-model="queryParams.payState" type="button" @change="changePayState">-->
          <!--              <a-radio :value="0">全部</a-radio>-->
          <!--              <a-radio :value="1">待支付</a-radio>-->
          <!--              <a-radio :value="2">已支付</a-radio>-->
          <!--              <a-radio :value="3">已完成</a-radio>-->
          <!--              <a-radio :value="4">已关闭</a-radio>-->
          <!--            </a-radio-group>-->
          <!--          </a-form-item>-->
          <!--          <a-form-item field="search" label="搜索" label-col-flex="80px" style="width: 320px">-->
          <!--            <a-input-group>-->
          <!--              <a-select v-model="queryParams.fuzzyType" placeholder="搜索字段" style="width: 160px">-->
          <!--                <a-option label="房号" value="1"></a-option>-->
          <!--                <a-option label="缴费类型名称" value="2"></a-option>-->
          <!--                <a-option label="账单编号" value="3"></a-option>-->
          <!--                <a-option label="缴费状态" value="4"></a-option>-->
          <!--                <a-option label="缴费人" value="5"></a-option>-->
          <!--              </a-select>-->
          <!--              <a-input v-model="queryParams.fuzzy" :max-length="50" allow-clear placeholder="搜索" @clear="clearUp" @input="search" />-->
          <!--            </a-input-group>-->
          <!--          </a-form-item>-->
          <a-spin :loading="loading" style="width: 100%">
            <a-table :columns="columns" :data="tableData" :pagination="queryParams" @page-change="pageChange" @page-size-change="pageSizeChange">
              <template #type="{ record }">
                <a-space>
                  <a-tag v-if="record.type == 1">物业费</a-tag>
                  <a-tag v-if="record.type == 2">电费</a-tag>
                  <a-tag v-if="record.type == 3">水费</a-tag>
                  <a-tag v-if="record.type == 4">燃气费</a-tag>
                  <a-tag v-if="record.type == 5">其他</a-tag>
                </a-space>
              </template>
              <template #personType="{ record }">
                <a-space>
                  <a-tag v-if="record.personType == 1" color="#ff7d00">业主</a-tag>
                  <a-tag v-if="record.personType == 2" color="#0fc6c2">租客</a-tag>
                  <a-tag v-if="record.personType == 3" color="green">住户</a-tag>
                </a-space>
              </template>
              <template #payState="{ record }">
                <a-space>
                  <a-tag v-if="record.payState == 1">待支付</a-tag>
                  <a-tag v-if="record.payState == 2">已支付</a-tag>
                  <a-tag v-if="record.payState == 3">已支付</a-tag>
                  <a-tag v-if="record.payState == 4">已关闭</a-tag>
                </a-space>
              </template>
              <template #options="{ record }">
                <a-button size="small" type="text" @click="clickDetails(record)">
                  <icon-eye />
                  查看明细
                </a-button>
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
import Payecord from "@/api/Property/Payecord";
import { useRouter } from "vue-router";

const columns = [
  // {
  //   title: "序号",
  //   dataIndex: "serialNumber",
  // },
  {
    title: "房号",
    dataIndex: "unitName",
    align: "center",
  },
  {
    title: "缴费类型名称",
    dataIndex: "assetName",
    align: "center",
  },
  {
    title: "账单编号",
    dataIndex: "statementId",
    align: "center",
  },
  {
    title: "缴费月份",
    dataIndex: "payMonth",
    align: "center",
  },
  {
    title: "缴费金额",
    dataIndex: "assetCharge",
    align: "center",
  },
  {
    title: "支付状态",
    dataIndex: "payState",
    slotName: "payState",
    align: "center",
  },
  // {
  //   title: "账单类型",
  //   dataIndex: "type",
  //   slotName: "type",
  // },
  // {
  //   title: "业主名字",
  //   dataIndex: "mainAccountName",
  // },
  {
    title: "缴费人名字",
    dataIndex: "personName",
    slotName: "personName",
  },
  // {
  //   title: "缴费人类型",
  //   dataIndex: "personType",
  //   slotName: "personType",
  // },
  {
    title: "缴费时间",
    dataIndex: "payTime",
  },
  // {
  //   title: "出账日期",
  //   dataIndex: "billingDate",
  // },
  {
    title: "操作",
    slotName: "options",
    align: "center",
  },
];
const monthOptions: any[] = [
  {
    value: 1,
    label: "1月",
  },
  {
    value: 2,
    label: "2月",
  },
  {
    value: 3,
    label: "3月",
  },
  {
    value: 4,
    label: "4月",
  },
  {
    value: 5,
    label: "5月",
  },
  {
    value: 6,
    label: "6月",
  },
  {
    value: 7,
    label: "7月",
  },
  {
    value: 8,
    label: "8月",
  },
  {
    value: 9,
    label: "9月",
  },
  {
    value: 10,
    label: "10月",
  },
  {
    value: 11,
    label: "11月",
  },
  {
    value: 12,
    label: "12月",
  },
];
const payStateOptions: any[] = [
  {
    value: 1,
    label: "待支付",
  },
  {
    value: 3,
    label: "已完成",
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
    const tableData = ref([]);
    // 分页数据请求参数
    const queryParams = reactive({
      pageNo: 1,
      pageSize: 20,
      total: 0,
      showPageSize: true,
      fuzzy: "",
      payState: undefined,
      fuzzyType: "1",
      statementId: undefined,
      unitName: undefined,
      month: undefined,
      assetName: undefined,
      payTime: undefined,
    });
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
      Payecord.getBillList(queryParams).then((res: any) => {
        if (res.data != null) {
          tableData.value = res.data.list.map((item: any) => {
            return {
              ...item,
            };
          });
          queryParams.total = res.data.total;
          loading.value = false;
        } else {
          tableData.value = [];
          loading.value = false;
        }
      });
    };
    // 通过状态查询
    const changePayState = (row: any) => {
      queryParams.payState = row;
      getList();
    };
    // 搜索
    const search = (row: any) => {
      queryParams.fuzzy = row;
      getList();
    };
    // 搜索清空事件
    const clearUp = () => {
      getList();
    };

    const clickFilter = () => {
      getList();
    };
    const router = useRouter();
    const clickDetails = (row: any) => {
      console.log("clickDetails", row.statementId);
      // Owner.getAllPerson(row.personId);
      router.push({ name: "BillManagementDetail", params: { id: row.statementId, model: "View" } });
    };

    const clickReset = () => {
      queryParams.payState = undefined;
      queryParams.statementId = undefined;
      queryParams.unitName = undefined;
      queryParams.month = undefined;
      queryParams.assetName = undefined;
      queryParams.payTime = undefined;
      getList();
    };
    return {
      tableData,
      tableColumns: columns,
      columns,
      loading,
      queryParams,
      monthOptions,
      pageSizeChange,
      pageChange,
      search,
      clearUp,
      changePayState,
      payStateOptions,
      clickFilter,
      clickReset,
      clickDetails,
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
