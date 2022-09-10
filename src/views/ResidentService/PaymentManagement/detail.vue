<template>
  <div class="add-employess container">
    <Breadcrumb :items="['客户服务', { name: '缴费管理', router: () => $router.replace({ name: 'PaymentManagement' }) }, pageModelText]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm ref="refForm" :disabled="pageModel === 'View'" :model="formData" :label-width="110">
          <SfFormItem :rules="rules.type" field="type" label="缴费类型">
            <a-select v-model="formData.type" placeholder="请选择缴费类型" :options="paymentTypeOptions" />
          </SfFormItem>
          <SfFormItem :rules="rules.name" field="name" label="类型名">
            <a-input v-model="formData.name" placeholder="请设置 类型名" />
          </SfFormItem>
          <SfFormItem :rules="rules.unitPrice" field="unitPrice" label="单价(元)">
            <a-input-number v-model="formData.unitPrice" placeholder="请输入单价" />
          </SfFormItem>
          <SfFormItem :rules="rules.unitName" field="unitName" label="计算单位">
            <a-input v-model="formData.unitName" placeholder="请输入计算单位" />
          </SfFormItem>
          <SfFormItem :rules="rules.cronUnit" field="cronUnit" label="缴费周期">
            <a-select
              v-model="formData.cronUnit"
              placeholder="缴费周期"
              @change="() => (formData.cronValue = undefined)"
              :options="[
                { label: '每月', value: 1 },
                { label: '每年', value: 2 },
              ]"
            ></a-select>
            <a-select v-if="formData.cronUnit === 1" v-model="formData.cronValue" placeholder="请选择日" :options="daysOptions"></a-select>
            <a-select v-else v-model="formData.cronValue" placeholder="请选择月" :options="monthOptions"></a-select>
          </SfFormItem>
          <SfFormItem field="remark" label="备注">
            <a-textarea
              v-model="formData.remark"
              :auto-size="{
                minRows: 3,
                maxRows: 5,
              }"
              :max-length="200"
              allow-clear
              placeholder="请输入备注"
              show-word-limit
            />
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }">
            <a-space>
              <a-button @click="onSave" type="primary" :loading="buttonLoading">保存</a-button>
            </a-space>
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import CUVue, { useDetailPage } from "@/components/lib/CU";
// import Pay, { PayModel } from "@/api/Property/Pay";
import RulesLib from "@/utils/RulesLib";
import { FieldRule, Message, ValidatedError } from "@arco-design/web-vue";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import PaymentManagement, {
  CreatePaymentManagementModel,
  PaymentManagementDetailModel,
  UpdatePaymentManagementModel,
} from "@/api/tenant/PaymentManagement";
import { useDetail, useDetailPageModel, useRouterManager } from "@/components/lib/CU/CU";

const daysOptions = Array(...Array(28)).map((_, i) => {
  return {
    value: i + 1 + "",
    label: i + 1 + "日",
  };
});
daysOptions.push({
  value: "29",
  label: "最后一天",
});

const monthOptions = Array(...Array(12)).map((_, i) => {
  return {
    value: i + 1 + "",
    label: i + 1 + "月",
  };
});

const paymentTypeOptions = [
  {
    value: 1,
    label: "物业费",
    type: 1,
  },
  {
    value: 2,
    label: "电费",
    type: 2,
  },
  {
    value: 3,
    label: "水费",
    type: 3,
  },
  {
    value: 4,
    label: "燃气费",
    type: 4,
  },
  {
    value: 5,
    label: "其他",
    type: 5,
  },
];

export default defineComponent({
  name: "DetailEmployess",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
  },
  setup() {
    const { pageModel, pageModelText } = useDetailPageModel();
    const loading = ref(false);
    const route = useRoute();
    const formData = ref<Partial<UpdatePaymentManagementModel & CreatePaymentManagementModel>>({
      id: undefined,
      cronUnit: undefined,
      cronValue: "",
      name: "",
      remark: "",
      type: undefined,
      unitName: "",
      unitPrice: undefined,
    });
    const rules: Partial<Record<keyof PaymentManagementDetailModel, FieldRule[]>> = {
      name: new RulesLib().required("请输入名称").done(),
      unitPrice: new RulesLib()
        .required("请输入单价")
        .match(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "请输入合法数值")
        .done(),
      unitName: new RulesLib().required("请输入单位").done(),
      cronUnit: new RulesLib()
        .required("请选择缴费周期")
        .validator((value, cb) => {
          if (value) {
            if (formData.value.cronValue) {
              cb();
            } else {
              if (formData.value.cronUnit === 1) {
                cb("请选择日");
              } else {
                cb("请选择月");
              }
            }
          } else {
            cb("请选择缴费周期");
          }
        })
        .done(),
      remark: new RulesLib().done(),
      type: new RulesLib().required("请选择缴费类型").done(),
      cronValue: new RulesLib().required("请选择开始日").done(),
    };
    const showModalTips = ref(false);
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      PaymentManagement.detail(route.params.id as string)
        .then((res) => {
          formData.value.id = res.id;
          formData.value.cronUnit = res.cronUnit;
          formData.value.cronValue = res.cronValue;
          formData.value.name = res.name;
          formData.value.remark = res.remark;
          formData.value.type = res.type;
          formData.value.unitName = res.unitName;
          formData.value.unitPrice = res.unitPrice;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    if (pageModel.value && pageModel.value !== "Add") {
      loadData();
    } else {
      startWatch();
    }
    const refForm = ref();
    const { save, buttonLoading } = useDetail(refForm, PaymentManagement);
    const { goBack } = useRouterManager();
    const onSave = () => {
      save(formData.value as UpdatePaymentManagementModel | CreatePaymentManagementModel).then(() => {
        goBack();
      });
    };
    return {
      refForm,
      daysOptions,
      paymentTypeOptions,
      monthOptions,
      formData,
      showModalTips,
      pageModelText,
      pageModel,
      loading,
      rules,
      buttonLoading,
      onSave,
    };

    // const formData = ref<any>({
    //   id: "",
    //   tenantId: "",
    //   typeName: "",
    //   type: "",
    //   remark: "",
    //   company: "",
    //   price: undefined,
    //   startTime: undefined,
    //   effect: "1",
    // });
    //
    // const startTimeOptions: any[] = [
    //   {
    //     value: 1,
    //     label: "1",
    //   },
    //   {
    //     value: 2,
    //     label: "2",
    //   },
    //   {
    //     value: 3,
    //     label: "3",
    //   },
    //   {
    //     value: 4,
    //     label: "4",
    //   },
    //   {
    //     value: 5,
    //     label: "5",
    //   },
    //   {
    //     value: 6,
    //     label: "6",
    //   },
    //   {
    //     value: 7,
    //     label: "7",
    //   },
    //   {
    //     value: 8,
    //     label: "8",
    //   },
    //   {
    //     value: 9,
    //     label: "9",
    //   },
    //   {
    //     value: 10,
    //     label: "10",
    //   },
    //   {
    //     value: 11,
    //     label: "11",
    //   },
    //   {
    //     value: 12,
    //     label: "12",
    //   },
    //   {
    //     value: 13,
    //     label: "13",
    //   },
    //   {
    //     value: 14,
    //     label: "14",
    //   },
    //   {
    //     value: 15,
    //     label: "15",
    //   },
    //   {
    //     value: 16,
    //     label: "16",
    //   },
    //   {
    //     value: 17,
    //     label: "17",
    //   },
    //   {
    //     value: 18,
    //     label: "18",
    //   },
    //   {
    //     value: 19,
    //     label: "19",
    //   },
    //   {
    //     value: 20,
    //     label: "20",
    //   },
    //   {
    //     value: 21,
    //     label: "21",
    //   },
    //   {
    //     value: 22,
    //     label: "22",
    //   },
    //   {
    //     value: 23,
    //     label: "23",
    //   },
    //   {
    //     value: 24,
    //     label: "24",
    //   },
    //   {
    //     value: 25,
    //     label: "25",
    //   },
    //   {
    //     value: 26,
    //     label: "26",
    //   },
    //   {
    //     value: 27,
    //     label: "27",
    //   },
    //   {
    //     value: 28,
    //     label: "28",
    //   },
    //   {
    //     value: 0,
    //     label: "最后一天",
    //   },
    // ];

    // const dataScopeOptions: any[] = [
    //   {
    //     value: 1,
    //     label: "物业费",
    //     type: 1,
    //   },
    //   {
    //     value: 2,
    //     label: "电费",
    //     type: 2,
    //   },
    //   {
    //     value: 3,
    //     label: "水费",
    //     type: 3,
    //   },
    //   {
    //     value: 4,
    //     label: "燃气费",
    //     type: 4,
    //   },
    //   {
    //     value: 5,
    //     label: "其他",
    //     type: 5,
    //   },
    // ];

    // const showModalTips = ref(false);

    // const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
    //   showModalTips.value = true;
    // });
    // const route = useRoute();
    // const router = useRouter();

    // const { pageModel, pageModelName } = useDetailPage();
    // const loading = ref(false);
    // // const
    // const loadData = () => {
    //   loading.value = true;
    //   stopWatch.value?.();
    //   console.log("route", route);
    //   formData.value = route;
    // };

    // const buttonLoading = ref(false);

    // const createData = () => {
    //   const submitData: any = {
    //     typeName: formData.value.typeName,
    //     price: formData.value.price,
    //     company: formData.value.company,
    //     remark: formData.value.remark,
    //     id: formData.value.id,
    //     type: formData.value.type,
    //     startTime: formData.value.startTime,
    //     effect: formData.value.effect,
    //   };
    //   buttonLoading.value = true;
    //   Pay.paySettings(submitData)
    //     .then((res: any) => {
    //       Message.success(res);
    //       router.push({ name: "PaymentManagement" });
    //     })
    //     .catch((err: any) => {
    //       Message.error(err);
    //     })
    //     .finally(() => {
    //       buttonLoading.value = false;
    //     });
    // };
    // // const updateData = () => {
    // //   buttonLoading.value = true;
    // //   const updateData = {
    // //     id: formData.value.id,
    // //     code: formData.value.code,
    // //     name: formData.value.name,
    // //     permissionIds: formData.value.permissionIds,
    // //     remark: formData.value.remark,
    // //   };
    // //   console.log("update formData", updateData);
    // //   Role.update(updateData)
    // //     .then(() => {
    // //       router.push({ name: "Role" });
    // //     })
    // //     .finally(() => {
    // //       buttonLoading.value = false;
    // //     });
    // // };
    // // 点击
    // const refForm = ref();
    // const clickSave = () => {
    //   refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
    //     if (err) {
    //       //
    //     } else {
    //       createData();
    //     }
    //   });
    // };
    // const selectTypeName = (type: any) => {
    //   if (type == 5) {
    //     formData.value.typeName = "";
    //   } else {
    //     switch (type) {
    //       case 1:
    //         formData.value.typeName = "物业费";
    //         break;
    //       case 2:
    //         formData.value.typeName = "电费";
    //         break;
    //       case 3:
    //         formData.value.typeName = "水费";
    //         break;
    //       case 4:
    //         formData.value.typeName = "燃气费";
    //         break;
    //     }
    //   }
    // };
    // return {
    //   refForm,
    //   rules,
    //   loading,
    //   buttonLoading,
    //   pageModelName,
    //   pageModel,
    //   formData,
    //   createData,
    //   showModalTips,
    //   clickSave,
    //   dataScopeOptions,
    //   selectTypeName,
    //   startTimeOptions,
    // };
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
</style>
