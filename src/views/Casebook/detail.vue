<template>
  <div class="user-detail container">
    <Breadcrumb :items="['用户管理', '添加']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm ref="refForm" :model="formData" :formModel="pageModel" :rules="rules" :label-width="100">
          <!-- <SfFormItem :col-props="{ span: 8 }" label="搜索患者" style="height: 32px" extra="搜索或者手动填写患者信息">
            <a-input-search placeholder="请输入患者姓名" v-model="searchPatient"></a-input-search>
          </SfFormItem> -->
          <a-divider orientation="left" style="width: 100%">患者信息</a-divider>
          <SfFormItem label="患者姓名" field="patientForm.id">
            <a-select
              v-model="formData.patientForm.id"
              :options="patientList"
              :loading="patientListLoading"
              placeholder="请输入或选择患者"
              :allow-create="true"
            ></a-select>
          </SfFormItem>
          <SfFormItem label="性别" field="patientForm.patientGender">
            <a-select v-model="formData.patientForm.patientGender" placeholder="请选择性别">
              <a-option :value="1">男</a-option>
              <a-option :value="2">女</a-option>
            </a-select>
          </SfFormItem>
          <SfFormItem label="患者年龄" field="patientForm.patientAge">
            <a-input-number v-model="formData.patientForm.patientAge" placeholder="请输入患者年龄"></a-input-number>
          </SfFormItem>
          <SfFormItem label="患者联系方式" field="patientForm.phoneNumber">
            <a-input v-model="formData.patientForm.phoneNumber" placeholder="请输入患者的联系方式" :max-length="11"></a-input>
          </SfFormItem>
          <SfFormItem label="患者既往史" field="patientForm.pastHistory">
            <a-textarea
              v-model="formData.patientForm.pastHistory"
              placeholder="请输入患者既往史"
              :max-length="200"
              show-word-limit
              :auto-size="{ minRows: 1, maxRows: 6 }"
            ></a-textarea>
          </SfFormItem>
          <a-divider orientation="left" style="width: 100%">就诊信息</a-divider>
          <SfFormItem field="patientDescription" label="患者描述">
            <a-textarea
              v-model="formData.patientDescription"
              placeholder="请输入患者描述"
              :max-length="200"
              show-word-limit
              :auto-size="{ minRows: 3, maxRows: 6 }"
            ></a-textarea>
          </SfFormItem>
          <!-- 上传图片 -->
          <div style="width: 100%"></div>
          <template v-for="(image, index) in formData.imagesForm" :key="index">
            <SfFormItem :rules="rules.imageProperties" :field="'imagesForm.' + index + '.imageProperties'" label="左右眼">
              <a-select v-model="formData.imagesForm[index].imageProperties" placeholder="请选择左右眼">
                <a-option :value="1">左眼</a-option>
                <a-option :value="2">右眼</a-option>
              </a-select>
            </SfFormItem>
            <SfFormItem :rules="rules.modelIds" :field="'imagesForm.' + index + '.modelIds'" label="选择模型">
              <a-select
                v-model="formData.imagesForm[index].modelIds"
                :multiple="true"
                placeholder="请选择使用的模型"
                :options="modelList"
                :loading="modelListLoading"
              />
            </SfFormItem>
            <SfFormItem :rules="rules.image" :field="'imagesForm.' + index + '.image'" label="上传图片">
              <a-upload
                ref="refUpload"
                accept="image/*"
                action="/diagnosis/api/upload"
                :image-preview="true"
                v-model:file-list="formData.imagesForm[index].image"
                :limit="1"
              >
                <template #remove-icon>
                  <icon-close />
                </template>
              </a-upload>
              <a-button
                @click="deleteItem(index)"
                style="margin-left: 8px"
                status="danger"
                v-if="formData.imagesForm.length > 1"
                :title="'删除这条记录'"
              >
                <template #icon>
                  <icon-delete />
                </template>
              </a-button>
            </SfFormItem>
          </template>
          <SfFormItem>
            <a-link @click="addPicture">添加图片</a-link>
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" v-if="pageModel !== 'View'">
            <a-button @click="save" type="primary">保存</a-button>
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import User, { UserModel } from "@/api/diagnosis/User";
import Patient, { PatientModel } from "@/api/diagnosis/Patient";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { useStartStopWatch } from "@/hooks/use";
import Message from "@/utils/Message";
import RulesLib from "@/utils/RulesLib";
import { FileItem, SelectOption, ValidatedError } from "@arco-design/web-vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import Casebook from "@/api/diagnosis/Casebook";
import Image from "@/api/diagnosis/Image";
import ImageModel from "@/api/diagnosis/ImageModel";
import Model, { ModelModel } from "@/api/diagnosis/Model";
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
      patientDescription: "",
      diagnosticStatus: 1,
      rvsIdentificationResult: "",
      doctorAdvice: "",
      patientForm: {
        id: undefined,
        patientName: "",
        patientGender: 1,
        patientAge: 35,
        phoneNumber: "",
        pastHistory: "",
        userId: "",
      },
      imagesForm: [
        {
          image: [],
          imageProperties: 1,
          modelIds: [],
        },
        {
          image: [],
          imageProperties: 2,
          modelIds: [],
        },
      ],
    });
    const rules = {
      patientDescription: new RulesLib().required("请输入病人描述").done(),
      diagnosticStatus: new RulesLib().required("请选择诊断状态").done(),
      rvsIdentificationResult: new RulesLib().required("请输入RVS识别结果").done(),
      doctorAdvice: new RulesLib().required("请输入医生建议").done(),
      "patientForm.id": new RulesLib().required("请创建或选择患者").done(),
      "patientForm.patientGender": new RulesLib().required("请选择患者性别").done(),
      "patientForm.patientAge": new RulesLib().required("请输入患者年龄").done(),
      "patientForm.phoneNumber": new RulesLib().required("请输入患者手机号").done(),
      "patientForm.pastHistory": new RulesLib().required("请输入患者既往史").done(),
      imageProperties: new RulesLib().required("请选择左右眼").done(),
      modelIds: new RulesLib().required("请选择使用的模型").done(),
      image: new RulesLib()
        .required("请上传图片")
        .validator((value, cb) => {
          if (value[0].status === "uploading") {
            cb("图片正在上传中，请稍后");
          } else if (value[0].status === "error") {
            cb("图片上传失败，请重新上传");
          }
          cb();
        })
        .done(),
    };
    const showModalTips = ref(false);
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const { pageModel, pageModelName } = useDetailPage();
    const route = useRoute();
    // 加载患者列表
    const patientList = ref<SelectOption[]>([]);
    const patientListLoading = ref(false);
    const patientMap = ref<Record<number, PatientModel>>({});
    const modelList = ref<SelectOption[]>([]);
    const modelListLoading = ref(false);
    const loadData = () => {
      patientListLoading.value = true;
      Patient.getAll()
        .then((res) => {
          patientList.value = res.map((item) => {
            patientMap.value[item.id] = item;
            return {
              label: `${item.patientName}（${item.patientGender === 1 ? "男" : "女"}，${item.patientAge}岁）`,
              value: item.id,
            };
          });
        })
        .finally(() => {
          patientListLoading.value = false;
        });
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
    };
    loadData();
    watch(
      () => formData.value.patientForm.id,
      () => {
        console.log(formData.value.patientForm.id);
        if (formData.value.patientForm.id && patientMap.value[formData.value.patientForm.id]) {
          formData.value.patientForm.patientName = patientMap.value[formData.value.patientForm.id].patientName;
          formData.value.patientForm.patientGender = patientMap.value[formData.value.patientForm.id].patientGender;
          formData.value.patientForm.patientAge = patientMap.value[formData.value.patientForm.id].patientAge;
          formData.value.patientForm.phoneNumber = patientMap.value[formData.value.patientForm.id].phoneNumber;
          formData.value.patientForm.pastHistory = patientMap.value[formData.value.patientForm.id].pastHistory;
        }
      },
    );
    const isCreatePatient = computed(() => {
      if (typeof formData.value.patientForm.id === "number") {
        return false;
      } else {
        return true;
      }
    });
    const router = useRouter();
    // const update = () => {
    //   loading.value = true;
    //   User.update(formData.value as unknown as UserModel)
    //     .then((res) => {
    //       Message.success("修改成功");
    //       router.go(-1);
    //     })
    //     .finally(() => {
    //       loading.value = false;
    //     });
    // };
    const create = () => {
      loading.value = true;
      let p;
      if (isCreatePatient.value) {
        p = Patient.create({
          patientName: formData.value.patientForm.id,
          patientGender: formData.value.patientForm.patientGender,
          patientAge: formData.value.patientForm.patientAge,
          phoneNumber: formData.value.patientForm.phoneNumber,
          pastHistory: formData.value.patientForm.pastHistory,
        });
      } else {
        p = Patient.update({
          id: formData.value.patientForm.id,
          patientName: formData.value.patientForm.patientName,
          patientGender: formData.value.patientForm.patientGender,
          patientAge: formData.value.patientForm.patientAge,
          phoneNumber: formData.value.patientForm.phoneNumber,
          pastHistory: formData.value.patientForm.pastHistory,
        });
      }
      p = p.then((res) => {
        // 插入病例
        const patientId = res;
        return Casebook.create({
          patientId: patientId,
          diagnosticStatus: formData.value.diagnosticStatus,
          patientDescription: formData.value.patientDescription,
          rvsIdentificationResult: formData.value.rvsIdentificationResult,
          doctorAdvice: formData.value.doctorAdvice,
        }).then((res) => {
          return {
            patientId,
            casebookId: res,
          };
        });
      });
      p.then((res) => {
        // 插入图片，关联模型
        const casebookId = res.casebookId;
        const patientId = res.patientId;
        const pp = formData.value.imagesForm.map((item) => {
          return ImageModel.create({
            image: {
              casebookId: casebookId,
              patientId: patientId,
              imageAddress: (item.image[0] as FileItem).response.data,
              imageProperties: item.imageProperties,
              diagnosticStatus: 1,
            },
            modelIds: item.modelIds as number[],
          });
        });
        return Promise.all(pp);
      })
        .then(() => {
          Message.success("添加成功");
          router.go(-1);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const refForm = ref();
    const save = () => {
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          create();
        }
      });
    };
    const addPicture = () => {
      formData.value.imagesForm.push({
        image: [],
        imageProperties: 1,
        modelIds: [],
      });
    };
    // 删除一条记录
    const deleteItem = (index: number) => {
      formData.value.imagesForm.splice(index, 1);
    };
    const refUpload = ref();
    const handleUploadSuccess = (index: number, file: FileItem) => {
      // formData.value.imagesForm[index].image.push(response.data);
    };
    return {
      loading,
      showModalTips,
      formData,
      pageModel,
      pageModelName,
      rules,
      refForm,
      searchPatient,
      patientList,
      patientListLoading,
      modelList,
      modelListLoading,
      save,
      deleteItem,
      addPicture,
      handleUploadSuccess,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-detail {
}
</style>
