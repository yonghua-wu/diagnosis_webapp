<template>
  <SfForm ref="refForm" :model="formData" :formModel="'Add'" :formMaxWidth="450" style="margin-right: 12px; width: unset">
    <SfFormItem v-if="formTitle" :colProps="{ span: 24 }" :label="formTitle"></SfFormItem>
    <SfFormItem v-if="formData.ticketId" :colProps="{ span: 24 }" field="ticketId" :label="'关联' + DETAIL_TYPE_MAP[type] + '号'">
      <a-input :model-value="formData.ticketId" disabled></a-input>
    </SfFormItem>
    <SfFormItem
      :colProps="{ span: 24 }"
      field="jobId"
      :disabled="disabledFieldList?.some((f) => f === 'jobId')"
      :validate-trigger="'input'"
      :rules="rules.jobId"
      label="事件类型"
    >
      <!-- <JobConfigSelect
        v-model="formData.jobId"
        v-model:job-name="formData.jobName"
        v-model:service-class="formData.serviceClass"
        :query-data="defaultJobQueryData"
      /> -->
      <SelectJobVue ref="refSelectJob" v-model="formData.jobId"></SelectJobVue>
    </SfFormItem>
    <SfFormItem
      :colProps="{ span: 24 }"
      :validate-trigger="'input'"
      field="placeId"
      :disabled="disabledFieldList?.some((f) => f === 'placeId')"
      :rules="rules.placeId"
      label="事件地点"
    >
      <PlaceSelect v-model="formData.placeId" v-model:place-name="formData.placeName" />
    </SfFormItem>
    <SfFormItem
      :colProps="{ span: 24 }"
      field="content"
      :disabled="disabledFieldList?.some((f) => f === 'content')"
      :rules="rules.content"
      label="备注"
    >
      <a-textarea
        v-model="formData.content"
        placeholder="请输入备注"
        :max-length="200"
        show-word-limit
        :auto-size="{ minRows: 3, maxRows: 6 }"
      ></a-textarea>
    </SfFormItem>
    <SfFormItem
      :colProps="{ span: 24 }"
      field="customName"
      :disabled="disabledFieldList?.some((f) => f === 'customName')"
      :rules="rules.customName"
      label="客户姓名"
    >
      <a-input :max-length="24" v-model="formData.customName" placeholder="请输入客户姓名"></a-input>
    </SfFormItem>
    <SfFormItem
      :colProps="{ span: 24 }"
      field="customPhone"
      :disabled="disabledFieldList?.some((f) => f === 'customPhone')"
      :rules="rules.customPhone"
      label="客户手机号"
    >
      <a-input :max-length="50" v-model="formData.customPhone" placeholder="请输入客户手机号"></a-input>
    </SfFormItem>
    <SfFormItem :colProps="{ span: 24 }" field="toId" :disabled="disabledFieldList?.some((f) => f === 'toId')" :rules="rules.toId" label="指定处理人">
      <StaffSelect :defaultQueryData="staffQueryData" ref="refStaffSelect" v-model="formData.toId" />
    </SfFormItem>
    <SfFormItem
      :colProps="{ span: 24 }"
      field="imgList"
      :disabled="disabledFieldList?.some((f) => f === 'imgList')"
      :rules="rules.imgList"
      label="上传照片"
    >
      <UploadVue ref="refUploadVue" :uploadType="'picture-card'" v-model:file-list="formData.imgList" :limit="3" />
    </SfFormItem>
  </SfForm>
</template>

<script lang="ts">
import RulesLib from "@/utils/RulesLib";
import { defineComponent, PropType, reactive, ref, toRefs, watch } from "vue";
import { useDetail } from "../lib/CU/CU";
import StaffSelect from "../lib/StaffSelect/index.vue";
// import JobConfigSelect from "../lib/JobConfigSelect/index.vue";
import SelectJobVue from "./Modal/SelectJob.vue";
import PlaceSelect from "../lib/PlaceSelect/index.vue";
import SfForm from "../lib/CU/SfForm";
import SfFormItem from "../lib/CU/SfFormItem";
import UploadVue from "../lib/Upload.vue";
import { FieldRule, FileItem } from "@arco-design/web-vue";
import { DETAIL_TYPE_MAP } from "./WorkSomethingDetail.vue";

export interface WorkCreateFormData {
  // 备注
  content: string;
  // jobId
  jobId: string;
  // 图片URL列表
  imgList: FileItem[];
  // jobName
  jobName: string;
  // 空间ID
  placeId: string;
  // 空间名称
  placeName: string;
  // 报事类型
  serviceClass?: number;
  // 客户姓名
  customName: string;
  // 客户手机号
  customPhone: string;
  // 指定处理人
  toId: string;
  toName: string;
  toPhone: string;
  [key: string]: any;
}

export default defineComponent({
  name: "work-create-form",
  components: {
    StaffSelect,
    // JobConfigSelect,
    SelectJobVue,
    PlaceSelect,
    SfForm,
    SfFormItem,
    UploadVue,
  },
  props: {
    formTitle: {
      type: String,
    },
    defaultValue: {
      type: Object as PropType<Partial<WorkCreateFormData>>,
    },
    disabledFieldList: {
      type: Array as PropType<(keyof WorkCreateFormData)[]>,
    },
    customRules: {
      type: Object as PropType<Record<string, FieldRule<any>[]>>,
    },
    type: {
      type: String as PropType<keyof typeof DETAIL_TYPE_MAP>,
      default: () => "WORK_ORDER",
    },
    defaultStaffQueryData: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
    defaultJobQueryData: {
      type: Object as PropType<any>,
      default: () => ({ serviceTypes: [2, 3, 4] }),
    },
  },
  setup(props) {
    const { defaultValue, defaultStaffQueryData } = toRefs(props);
    const staffQueryData = defaultStaffQueryData;
    const formData = reactive<WorkCreateFormData>({
      content: "",
      jobId: "",
      imgList: [],
      jobName: "",
      placeId: "",
      placeName: "",
      customName: "",
      customPhone: "",
      toId: "",
      toName: "",
      toPhone: "",
      ...defaultValue.value,
    });
    watch(defaultValue, () => {
      console.log(defaultValue.value);
      formData.content = defaultValue.value?.content || formData.content;
      formData.jobId = defaultValue.value?.jobId || formData.jobId;
      formData.jobName = defaultValue.value?.jobName || formData.jobName;
      formData.imgList = defaultValue.value?.imgList || formData.imgList;
      formData.placeId = defaultValue.value?.placeId || formData.placeId;
      formData.placeName = defaultValue.value?.placeName || formData.placeName;
      formData.serviceClass = defaultValue.value?.serviceClass || formData.serviceClass;
      formData.customName = defaultValue.value?.customName || formData.customName;
      formData.customPhone = defaultValue.value?.customPhone || formData.customPhone;
      formData.toId = defaultValue.value?.toId || formData.toId;
      formData.toName = defaultValue.value?.toName || formData.toName;
      formData.toPhone = defaultValue.value?.toPhone || formData.toPhone;
    });
    watch(
      () => formData.jobId,
      () => {
        staffQueryData.value.serviceClass = refSelectJob.value?.jobConfigMap[formData.jobId].serviceClass;
        formData.toId = defaultValue.value?.toId || "";
        formData.toName = defaultValue.value?.toName || "";
        formData.toPhone = defaultValue.value?.toPhone || "";
      },
    );
    const rules = {
      customName: props.customRules?.customName || new RulesLib().done(),
      customPhone: props.customRules?.customPhone || new RulesLib().phone().done(),
      content: props.customRules?.content || new RulesLib().required("必须填写备注").done(),
      jobId: props.customRules?.jobId || new RulesLib().required("请选择报事类型").done(),
      placeId: props.customRules?.placeId || new RulesLib().required("请选择报事地点").done(),
      imgList: props.customRules?.imgList || new RulesLib().done(),
      toId: props.customRules?.toId || new RulesLib().done(),
    };
    const refForm = ref();
    const refUploadVue = ref();
    const refSelectJob = ref();
    const { vaildate } = useDetail(refForm);
    const refStaffSelect = ref();
    const submit = () => {
      return vaildate().then(() => {
        return refUploadVue.value
          .submit()
          .then(() => {
            return {
              content: formData.content,
              jobId: formData.jobId,
              jobName: refSelectJob.value?.jobConfigMap[formData.jobId].jobName,
              serviceClass: refSelectJob.value?.jobConfigMap[formData.jobId].serviceClass,
              imgList: formData.imgList.map((item: any) => {
                return item.response;
              }),
              placeId: formData.placeId,
              placeName: formData.placeName,
              customName: formData.customName,
              customPhone: formData.customPhone,
              toId: formData.toId || undefined,
              toName: refStaffSelect.value?.selectedStaffList?.[0]?.name,
              toPhone: refStaffSelect.value?.selectedStaffList?.[0]?.phone,
            };
          })
          .catch((err: any) => {
            console.log("err", err);
            throw err;
          });
      });
    };
    return {
      formData,
      rules,
      refForm,
      refUploadVue,
      refSelectJob,
      refStaffSelect,
      DETAIL_TYPE_MAP,
      staffQueryData,
      submit,
    };
  },
});
</script>

<style lang="less" scoped>
.work-create-form {
}
</style>
