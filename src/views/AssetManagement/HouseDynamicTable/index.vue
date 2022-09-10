<template>
  <div class="container pay-view">
    <Breadcrumb :items="['资产管理', '房屋动态表']" />
    <a-card>
      <a-row :wrap="false" align="stretch" justify="start">
        <a-col class="pay" flex="auto">
          <a-row>
            <a-form :model="queryParams">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item label="房号">
                    <a-input v-model="queryParams.unitName" placeholder="请输入房号" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="房屋类型">
                    <a-select v-model="queryParams.status" placeholder="请选择房屋类型">
                      <a-option v-for="item in statusOptions" :key="item" :label="item.label" :value="item.value"></a-option>
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
                <a-col :span="1.5">
                  <a-button size="large" type="primary" @click="clickFilter">查询</a-button>
                </a-col>
                <a-col :span="1">
                  <a-button size="large" type="outline" @click="clickReset">重置</a-button>
                </a-col>
              </a-row>
              <!--            <a-form-item field="status" label="状态" label-col-flex="80px">-->
              <!--              <a-radio-group v-model="queryParams.status" type="button" @change="changeState">-->
              <!--                <a-radio :value="0">全部</a-radio>-->
              <!--                <a-radio :value="1">空置</a-radio>-->
              <!--                <a-radio :value="2">自住</a-radio>-->
              <!--                <a-radio :value="3">租住</a-radio>-->
              <!--              </a-radio-group>-->
              <!--            </a-form-item>-->
              <!--            <a-form-item field="payState" label="缴费状态" label-col-flex="80px">-->
              <!--              <a-radio-group v-model="queryParams.payState" type="button" @change="changePayState">-->
              <!--                <a-radio :value="0">全部</a-radio>-->
              <!--                <a-radio :value="1">已缴</a-radio>-->
              <!--                <a-radio :value="2">待缴</a-radio>-->
              <!--              </a-radio-group>-->
              <!--            </a-form-item>-->

              <!--            <a-form-item field="search" label="搜索" label-col-flex="80px" style="width: 320px">-->
              <!--              <a-input-group>-->
              <!--                <a-select v-model="queryParams.fuzzyType" placeholder="搜索字段" style="width: 160px">-->
              <!--                  <a-option label="房号" value="1"></a-option>-->
              <!--                  <a-option label="房屋状态" value="2"></a-option>-->
              <!--                  <a-option label="缴费状态" value="3"></a-option>-->
              <!--                </a-select>-->
              <!--                <a-input v-model="queryParams.fuzzy" :max-length="50" allow-clear placeholder="搜索" @clear="clearUp" @input="search" />-->
              <!--              </a-input-group>-->
              <!--              &lt;!&ndash;              <a-input :max-length="50" v-model="queryParams.fuzzy" placeholder="搜索" allow-clear @input="search" @clear="clearUp" />&ndash;&gt;-->
              <!--            </a-form-item>-->
            </a-form>
          </a-row>
          <a-row>
            <a-col :span="24"></a-col>
            <a-spin :loading="loading" style="width: 100%">
              <a-table :columns="columns" :data="tableData" :pagination="queryParams" @page-change="pageChange" @page-size-change="pageSizeChange">
                <template #deed="{ record }">
                  <a-image :src="record.deed" height="50" width="50" />
                </template>
                <template #status="{ record }">
                  <a-space>
                    <a-tag v-if="record.status == 1">空置</a-tag>
                    <a-tag v-if="record.status == 2">自住</a-tag>
                    <a-tag v-if="record.status == 3">租住</a-tag>
                  </a-space>
                </template>

                <template #payState="{ record }">
                  <a-space>
                    <a-tag v-if="record.payState == 1">已缴</a-tag>
                    <a-tag v-if="record.payState == 2">待缴</a-tag>
                  </a-space>
                </template>

                <template #options="{ record }">
                  <a-dropdown-button type="primary">
                    状态
                    <template #icon>
                      <icon-down />
                    </template>
                    <template #content>
                      <a-doption @click="modifyStatus(record.unitId, 1)">空置</a-doption>
                      <a-doption @click="modifyStatus(record.unitId, 2)">自住</a-doption>
                      <a-doption @click="modifyStatus(record.unitId, 3)">租住</a-doption>
                    </template>
                  </a-dropdown-button>
                  <!-- <a-dropdown-button type="dashed">
                  支付状态
                  <template #icon>
                    <icon-down />
                  </template>
                  <template #content>
                    <a-doption @click="modifyPayState(record.unitId, 1)">已缴</a-doption>
                    <a-doption @click="modifyPayState(record.unitId, 2)">待缴</a-doption>
                  </template>
                </a-dropdown-button> -->
                </template>
              </a-table>
            </a-spin>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Info from "@/api/Property/Info";
import { Message } from "@arco-design/web-vue";

const columns = [
  {
    title: "物业名称",
    dataIndex: "unitName",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
    align: "center",
  },
  {
    title: "收费面积（㎡）",
    dataIndex: "areaCharging",
    align: "center",
  },
  {
    title: "缴费状态",
    dataIndex: "payState",
    slotName: "payState",
    align: "center",
  },
  {
    title: "待缴金额",
    dataIndex: "totoalCharge",
    align: "center",
  },
  {
    title: "房屋关联人数",
    dataIndex: "unitPersonNum",
    align: "center",
  },
  // {
  //   title: "账单日期",
  //   dataIndex: "statementTime",
  // },
  // {
  //   title: "操作",
  //   dataIndex: "options",
  //   slotName: "options",
  // },
];
const payStateOptions: any[] = [
  {
    value: 0,
    label: "全部",
  },
  {
    value: 1,
    label: "已缴",
  },
  {
    value: 2,
    label: "待缴",
  },
];
const statusOptions: any[] = [
  {
    value: 0,
    label: "全部",
  },
  // {
  //   value: 1,
  //   label: "空置",
  // },
  {
    value: 2,
    label: "自住",
  },
  {
    value: 3,
    label: "租住",
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
    // 分页请求参数
    const queryParams = reactive({
      pageNo: 1,
      pageSize: 20,
      total: 0,
      showPageSize: true,
      status: 0,
      fuzzy: "",
      fuzzyType: "1",
      payState: 0,
      unitName: undefined,
    });
    // 操作请求参数
    const apply = reactive({
      status: 0,
      payState: 0,
      unitIdList: [""],
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
      Info.getInfo(queryParams).then((res: any) => {
        console.log("list", res);
        if (res.data != null) {
          tableData.value = res.data.list.map((item: any) => {
            return {
              ...item,
              status: item.status,
              payState: item.payState,
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
    // 支付状态筛选
    const changePayState = (row: any) => {
      queryParams.payState = row;
      getList();
    };
    // 搜索清空事件
    const clearUp = () => {
      getList();
    };
    const selectedRowKeys = ref<string[]>([]);
    const selected = ref(false);
    watch(selectedRowKeys, () => {
      if (selectedRowKeys.value.length === 0) {
        selected.value = false;
      } else {
        selected.value = true;
      }
    });
    // 修改状态
    const modifyStatus = (id: string, status: number) => {
      console.log("id", id);
      console.log("status", status);
      let Ids: string[] = [id];
      apply.unitIdList = Ids;
      apply.status = status;
      Info.edit(apply).then((res) => {
        if (res.code == 200) {
          getList();
          Message.success("修改成功");
        } else {
          Message.error("修改失败,请联系管理员");
        }
      });
    };
    // 修改支付状态
    const modifyPayState = (id: string, status: number) => {
      let Ids: string[] = [id];
      apply.unitIdList = Ids;
      apply.payState = status;
      Info.edit(apply).then((res) => {
        if (res.code == 200) {
          getList();
          Message.success("修改成功");
        } else {
          Message.error("修改失败,请联系管理员");
        }
      });
    };
    const clickFilter = () => {
      getList();
    };
    const clickReset = () => {
      queryParams.payState = 0;
      queryParams.unitName = undefined;
      queryParams.status = 0;
      getList();
    };

    return {
      tableData,
      tableColumns: columns,
      columns,
      loading,
      pageSizeChange,
      pageChange,
      queryParams,
      changeState,
      search,
      changePayState,
      clearUp,
      selectedRowKeys,
      selected,
      modifyStatus,
      modifyPayState,
      payStateOptions,
      statusOptions,
      clickFilter,
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
