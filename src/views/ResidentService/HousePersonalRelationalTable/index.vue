<template>
  <div class="container pay-view">
    <Breadcrumb :items="['客户服务', '房客关系表']" />
    <a-card>
      <a-row :wrap="false" align="stretch" justify="start">
        <a-col class="pay" flex="auto">
          <a-row>
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
                  <a-form-item label="住户类型">
                    <a-select v-model="queryParams.type" placeholder="请选择住户类型">
                      <a-option v-for="item in typtOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                    </a-select>
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
              <!--              <a-form-item field="status" label="状态" label-col-flex="80px">
                              <a-radio-group v-model="queryParams.status" @change="changeState" type="button">
                                <a-radio :value="0">全部</a-radio>
                                <a-radio :value="1">正常</a-radio>
                                <a-radio :value="99">作废</a-radio>
                              </a-radio-group>
                            </a-form-item>-->

              <!--              <a-form-item field="search" label="搜索" label-col-flex="80px" style="width: 320px">
                              <a-input-group>
                                <a-select v-model="queryParams.fuzzyType" placeholder="搜索字段" style="width: 160px">
                                  <a-option label="姓名" value="1"></a-option>
                                  <a-option label="证件号" value="2"></a-option>
                                  <a-option label="联系方式" value="3"></a-option>
                                  <a-option label="住户类型" value="4"></a-option>
                                  <a-option label="房号" value="5"></a-option>
                                </a-select>
                                <a-input :max-length="50" v-model="queryParams.fuzzy" placeholder="搜索" allow-clear @input="search" @clear="clearUp" />
                              </a-input-group>
                              &lt;!&ndash;              <a-input :max-length="50" v-model="queryParams.fuzzy" placeholder="搜索" allow-clear @input="search" @clear="clearUp" />&ndash;&gt;
                            </a-form-item>-->
            </a-form>
          </a-row>

          <a-spin :loading="loading" style="width: 100%">
            <a-col :span="24" style="text-align: right">
              <a-button type="primary" @click="clickCreate">添加</a-button>
            </a-col>

            <a-table :columns="columns" :data="tableData" :pagination="queryParams" @page-change="pageChange" @page-size-change="pageSizeChange">
              <template #deed="{ record }">
                <a-image :src="record.deed" height="50" width="50" />
              </template>
              <template #type="{ record }">
                <a-space>
                  <a-tag v-if="record.type == 1">业主</a-tag>
                  <a-tag v-if="record.type == 2">租客</a-tag>
                  <a-tag v-if="record.type == 3">住户</a-tag>
                  <a-tag v-if="record.type == 4">访客</a-tag>
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
                  <a-tag v-if="record.personUnitVo.status == 1">正常</a-tag>
                  <!--                  <a-tag v-if="record.personUnitVo.status == 2">禁用</a-tag>-->
                  <!--                  <a-tag v-if="record.personUnitVo.status == 3">待审核</a-tag>-->
                  <!--                  <a-tag v-if="record.personUnitVo.status == 99">审核不通过</a-tag>-->
                  <a-tag v-if="record.personUnitVo.status == 6">作废</a-tag>
                </a-space>
              </template>

              <template #options="{ record }">
                <a-button size="small" type="text" @click="clickDetails(record)">
                  <icon-eye />
                  查看明细
                </a-button>
                <!--                <a-button size="mini" type="primary" @click="handleExamine(record)">通过</a-button>-->
                <!--                <a-button size="mini" status="warning" @click="handleDelete(record)">不通过</a-button>-->
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
import Household from "@/api/tenant/Household";
import { useRouter } from "vue-router";

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "证件类型",
    dataIndex: "icType",
    slotName: "icType",
    align: "center",
  },
  {
    title: "证件号",
    dataIndex: "ic",
    align: "center",
  },
  {
    title: "联系方式",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "房号",
    dataIndex: "personUnitVo.unitName",
    align: "center",
  },
  // {
  //   title: "备注",
  //   dataIndex: "remark",
  // },
  {
    title: "住户类型",
    dataIndex: "personUnitVo.type",
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

const typtOptions: any[] = [
  {
    value: 0,
    label: "全部",
  },
  {
    value: 1,
    label: "业主",
  },
  {
    value: 2,
    label: "租客",
  },
  {
    value: 3,
    label: "住户",
  },
  {
    value: 4,
    label: "访客",
  },
];

const statusOptions: any[] = [
  {
    value: 0,
    label: "全部",
  },
  {
    value: 1,
    label: "正常",
  },
  // {
  //   value: 3,
  //   label: "待审核",
  // },
  {
    value: 6,
    label: "作废",
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
      fuzzy: undefined,
      fuzzyType: undefined,
      createdTime: undefined,
      ic: undefined,
      phone: undefined,
      type: undefined,
      unitName: undefined,
      updatedTime: undefined,
      name: undefined,
    });
    // 操作请求参数
    const apply = reactive({
      status: 0,
      personUnitIds: [""],
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
      console.log("queryParams", queryParams);
      Household.getHousehold(queryParams)
        .then((res: any) => {
          if (res.data != null) {
            tableData.value = res.data.list.map((item: any) => {
              return {
                ...item,
                deed: item.personUnitVo.deed,
                type: item.personUnitVo.type,
                status: item.personUnitVo.status,
              };
            });
            queryParams.total = res.data.total;
            // queryParams.totalPage = res.data.totalPage;
            loading.value = false;
          } else if (res.code == 500) {
            tableData.value = [];
            loading.value = false;
          } else {
            tableData.value = [];
            loading.value = false;
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };
    // 通过状态筛选
    const changeState = (row: any) => {
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
    // 搜索按钮
    const clickFilter = () => {
      getList();
    };
    // 重置
    const clickReset = () => {
      queryParams.fuzzy = undefined;
      queryParams.ic = undefined;
      queryParams.status = 0;
      queryParams.fuzzyType = undefined;
      queryParams.phone = undefined;
      queryParams.createdTime = undefined;
      queryParams.type = undefined;
      queryParams.unitName = undefined;
      queryParams.updatedTime = undefined;
      queryParams.name = undefined;
      getList();
    };

    const clickCreate = () => {
      router.push({ name: "HousePersonalRelationalTableDetail", params: { model: "Add" } });
    };
    const clickDetails = (row: any) => {
      console.log("clickDetails", row.personUnitVo.personUnitId);
      // Owner.getAllPerson(row.personId);
      router.push({
        name: "HousePersonalRelationalTableDetail",
        params: { id: row.personId, personUnitId: row.personUnitVo.personUnitId, model: "View" },
      });
    };
    /*const handleExamine = (row: any) => {
      apply.personId = row.personId;
      let Ids: string[] = [row.personUnitVo.personUnitId];
      apply.personUnitIds = Ids;
      apply.status = 1;
      console.log("apply", apply);
      // Tenant.tenantModify(apply).then((res) => {
      //   if (res.code == 200) {
      //     getList();
      //     Message.success("审核成功");
      //   } else {
      //     Message.error("审核失败,请联系管理员");
      //   }
      // });
    };
    const handleDelete = (row: any) => {
      apply.personId = row.personId;
      let Ids: string[] = [row.personUnitVo.personUnitId];
      apply.personUnitIds = Ids;
      apply.status = 99;
      console.log("apply", apply);
      modal.warning({
        title: "提示",
        content: "是否审核不通过租户" + row.name,
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onOk: () => {
          // Tenant.tenantModify(apply).then((res) => {
          //   if (res.code == 200) {
          //     getList();
          //     Message.success("审核成功");
          //   } else {
          //     Message.error("审核失败,请联系管理员");
          //   }
          // });
        },
      });
    };*/
    return {
      tableData,
      tableColumns: columns,
      columns,
      // handleExamine,
      // handleDelete,
      loading,
      pageSizeChange,
      pageChange,
      queryParams,
      changeState,
      search,
      clearUp,
      clickFilter,
      typtOptions,
      statusOptions,
      clickReset,
      clickCreate,
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
