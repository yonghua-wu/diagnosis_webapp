<template>
  <div class="add-employess container">
    <Breadcrumb :items="['资产管理', { name: '账单记录', router: () => $router.replace({ name: 'BillManagement' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <template #extra>
          <template v-if="pageModel === 'View'"></template>
        </template>
        <template v-if="pageModel === 'View'">
          <a-form
            ref="refForm"
            :disabled="pageModel === 'View'"
            :label-col-props="{ span: 8 }"
            :model="formData"
            :wrapper-col-props="{ span: 16 }"
            style="max-width: 1500px"
          >
            <!--@submit="clickSave"-->
            <a-space direction="vertical" fill>
              <a-space direction="vertical" fill>
                <a-row class="section-title">基本信息</a-row>
                <a-row :gutter="24" class="section-body">
                  <a-col :span="8">
                    <a-form-item field="unitName" label="房屋信息">
                      <a-input v-model="formData.unitName" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item field="assetName" label="缴费项目">
                      <a-input v-model="formData.assetName" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item field="payStateName" label="缴费状态">
                      <a-input v-model="formData.payStateName" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="section-title">账单明细</a-row>
                <!--       :data="tableData"         -->
                <a-table :columns="columns" :data="tableData"></a-table>
              </a-space>
            </a-space>
          </a-form>
        </template>
      </CUVue>
    </a-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import { useRoute, useRouter } from "vue-router";
import Payecord from "@/api/Property/Payecord";

export default defineComponent({
  name: "PayecordDetail",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const tableData = ref([]);
    const { pageModel, pageModelName } = useDetailPage();
    const router = useRouter();
    const columns = [
      {
        title: "扣费项目",
        dataIndex: "assetName",
      },
      {
        title: "账单编号",
        dataIndex: "statementId",
      },
      {
        title: "交易单号",
        dataIndex: "transactionId",
      },
      {
        title: "商户单号",
        dataIndex: "outTradeNo",
      },
      {
        title: "支付时间",
        dataIndex: "payTime",
      },
      {
        title: "支付方式",
        dataIndex: "payTypeName",
      },
    ];
    const formData = ref<any>({
      assetName: "",
      outTradeNo: "",
      payStateName: "",
      payTime: "",
      payTypeName: "",
      statementId: "",
      transactionId: "",
      unitName: "",
    });
    onMounted(() => {
      loadData();
    });
    const route = useRoute();
    const loadData = () => {
      console.log("route.params.id", route.params.id);
      const data = {
        statementId: route.params.id,
      };
      Payecord.getDetails(data).then((res) => {
        console.log("res.data", res.data);
        formData.value.assetName = res.data.billdetailsTwoVo.assetName;
        formData.value.outTradeNo = res.data.billdetailsTwoVo.outTradeNo;
        formData.value.payStateName = res.data.billdetailsTwoVo.payStateName;
        formData.value.payTime = res.data.billdetailsTwoVo.payTime;
        formData.value.payTypeName = res.data.billdetailsTwoVo.payTypeName;
        formData.value.statementId = res.data.billdetailsTwoVo.statementId;
        formData.value.unitName = res.data.billdetailsTwoVo.unitName;
        tableData.value = res.data.billdetailsThreeVoList.map((item: any) => {
          return {
            ...item,
          };
        });
      });
    };
    let disabledInput = true;
    const loading = ref(false);
    const buttonLoading = ref(false);
    const refUploadVue = ref();
    const refForm = ref();

    return {
      tableData,
      columns,
      refForm,
      formData,
      loading,
      buttonLoading,
      pageModel,
      pageModelName,
      refUploadVue,
    };
  },
});
</script>
<style lang="less" scoped>
.add-employess {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
:deep(.arco-upload-list.arco-upload-list-type-picture-card) {
  flex-wrap: nowrap;
}
</style>
