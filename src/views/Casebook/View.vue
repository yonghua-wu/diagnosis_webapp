<template>
  <div class="user-detail container">
    <Breadcrumb :items="['病例管理', '详情']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="false">
        <SfForm ref="refForm" :model="formData" :formModel="'View'" :label-width="100">
          <a-divider orientation="left" style="width: 100%">患者信息</a-divider>
          <SfFormItem label="患者姓名" field="patient.id">
            {{ formData.patient?.patientName }}
          </SfFormItem>
          <SfFormItem label="性别" field="patient.patientGender">
            {{ formData.patient?.patientGender === 1 ? "男" : "女" }}
          </SfFormItem>
          <SfFormItem label="患者年龄" field="patient.patientAge">
            {{ formData.patient?.patientAge }}
          </SfFormItem>
          <SfFormItem label="患者联系方式" field="patient.phoneNumber">
            {{ formData.patient?.phoneNumber }}
          </SfFormItem>
          <SfFormItem label="患者既往史" field="patient.pastHistory">
            {{ formData.patient?.pastHistory }}
          </SfFormItem>
          <a-divider orientation="left" style="width: 100%">就诊信息</a-divider>
          <SfFormItem field="patientDescription" label="患者描述">
            {{ formData.patientDescription }}
          </SfFormItem>
          <!-- 上传图片 -->
          <div style="width: 100%"></div>
          <template v-for="(image, index) in formData.images" :key="index">
            <SfFormItem :field="'imagesForm.' + index + '.image'" :label="image.imageProperties === 1 ? '左眼图片' : '右眼图片'">
              <a-image :src="'/diagnosis' + image.imageAddress" :height="100" />
            </SfFormItem>
            <SfFormItem :field="'imagesForm.' + index + '.image'" label="结果图"></SfFormItem>
            <div style="width: 100%"></div>
          </template>
          <a-divider orientation="left" style="width: 100%">医生诊断</a-divider>
          <SfFormItem field="doctorAdvice" label="诊断内容">
            <a-textarea
              v-model="formData.doctorAdvice"
              placeholder="请输入诊断内容"
              :max-length="200"
              show-word-limit
              :auto-size="{ minRows: 3, maxRows: 6 }"
            ></a-textarea>
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }">
            <a-button @click="save" type="primary">保存</a-button>
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import CUVue from "@/components/lib/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { SelectOption } from "@arco-design/web-vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { defineComponent, ref } from "vue";
import Model from "@/api/diagnosis/Model";
import Casebook from "@/api/diagnosis/Casebook";
import { useRoute } from "vue-router";
import Message from "@/utils/Message";
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
    const searchPatient = ref("");
    const formData = ref({
      id: undefined,
      patientDescription: "",
      diagnosticStatus: 1,
      rvsIdentificationResult: "",
      doctorAdvice: "",
      patient: {
        id: undefined,
        patientName: "",
        patientGender: 1,
        patientAge: 35,
        phoneNumber: "",
        pastHistory: "",
        userId: "",
      },
      images: [],
    });
    const modelList = ref<SelectOption[]>([]);
    const modelListLoading = ref(false);
    const route = useRoute();
    const loadData = () => {
      modelListLoading.value = true;
      Model.getAll()
        .then((res) => {
          modelList.value = res.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        })
        .finally(() => {
          modelListLoading.value = false;
        });
      Casebook.detail(route.params.id as unknown as number).then((res) => {
        console.log(res);
        formData.value = res;
      });
    };
    loadData();
    const save = () => {
      loading.value = true;
      Casebook.update({
        id: formData.value.id as unknown as number,
        doctorAdvice: formData.value.doctorAdvice,
      })
        .then(() => {
          Message.success("保存成功");
        })
        .finally(() => {
          loading.value = false;
        });
    };
    return {
      loading,
      formData,
      searchPatient,
      modelList,
      modelListLoading,
      save,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-detail {
}
</style>
