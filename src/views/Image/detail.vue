<template>
  <div class="user-detail container">
    <Breadcrumb :items="['图像管理', '详情']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="false">
        <SfForm ref="refForm" :model="formData" :formModel="pageModel">
          <SfFormItem :col-props="{ span: 24 }" field="patientName" label="患者姓名">{{ formData.patientName }}</SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="imageProperties" label="图像属性">{{
            formData.imageProperties === 1 ? "左眼" : "右眼"
          }}</SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="diagnosticStatus" label="AI诊断状态">{{
            formData.diagnosticStatus === 1 ? "诊断中" : "已诊断"
          }}</SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="imageAddress" label="图像">
            <a-image :src="'/diagnosis' + formData.imageAddress" :height="200"></a-image>
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="resultImg" label="识别结果">
            <a-image v-if="formData.resultImg" :src="'/diagnosis' + formData.resultImg" :height="200"></a-image>
            <span v-else>暂无结果</span>
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import User, { UserModel } from "@/api/diagnosis/User";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { useStartStopWatch } from "@/hooks/use";
import Message from "@/utils/Message";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Image from "@/api/diagnosis/Image";
export default defineComponent({
  name: "user-detail",
  components: {
    CUVue,
    SfForm,
    SfFormItem,
    Breadcrumb,
  },
  setup() {
    const loading = ref(false);
    const formData = ref({
      patientName: "",
      imageProperties: null,
      diagnosticStatus: null,
      imageAddress: "",
      resultImg: "",
    });
    const { pageModel, pageModelName } = useDetailPage();
    const route = useRoute();
    const loadData = () => {
      loading.value = true;
      Image.detail(route.params.id as unknown as number)
        .then((res) => {
          console.log(res);
          formData.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    loadData();
    return {
      loading,
      formData,
      pageModel,
      pageModelName,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-detail {
}
</style>
