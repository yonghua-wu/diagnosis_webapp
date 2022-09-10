<template>
  <div class="work-order-configuration container">
    <Breadcrumb
      :items="['系统管理', { name: '事件综合管理', router: () => $router.replace({ name: 'SyntheticalEventConfiguration' }) }, '工单配置']"
    />
    <CUVue :show-modal-tips="showModalTips" :loading="loading" :pageModelText="'工单配置' + (jobData?.jobName ? ' - ' + jobData?.jobName : '')">
      <a-tabs :type="'rounded'" :hide-content="false" v-model:active-key="ticketStatus">
        <a-tab-pane :key="5" title="待分配"></a-tab-pane>
        <a-tab-pane :key="1" title="待接单"></a-tab-pane>
        <a-tab-pane :key="2" title="已接单"></a-tab-pane>
        <a-tab-pane :key="3" title="待验收"></a-tab-pane>
      </a-tabs>
      <SfForm ref="refForm" :model="formData" @submit="clickSave" :disabled="false" :labelWidth="120" :formMaxWidth="1500" :formModel="pageModel">
        <SfFormItem :colProps="{ span: 24 }" field="overtimeSwitch" :rules="rules.overtimeSwitch" label="超时开关">
          <a-switch v-model="formData.overtimeSwitch" :checked-value="1" :unchecked-value="2"></a-switch>
          <span style="margin-left: 8px">{{ formData.overtimeSwitch === 1 ? "开启" : "关闭" }}</span>
        </SfFormItem>
        <template v-if="formData.overtimeSwitch === 1">
          <SfFormItem :colProps="{ xs: 24, sm: 16, md: 12, lg: 8, xl: 8, xxl: 6 }" field="overtime" :rules="rules.overtime" label="超时时间">
            <a-select :options="overtimeSelectList" v-model="formData.overtime" placeholder="请选择超时时间"></a-select>
          </SfFormItem>
          <SfFormItem :colProps="{ span: 24 }" field="jobOvertimeType" :rules="rules.jobOvertimeType" label="超时处理">
            <a-checkbox-group
              :options="overtimeTypeSelectList"
              :model-value="
                formData.jobOvertimeType
                  ? parseInt(String(formData.jobOvertimeType))
                      .toString(2)
                      .split('')
                      .reverse()
                      .map((item, i) => Number(item) * 2 ** i)
                      .filter((item) => item)
                  : []
              "
              @change="(value) => (formData.jobOvertimeType = value.reduce((a, b) => Number(a) + Number(b), 0) as number)"
            ></a-checkbox-group>
          </SfFormItem>
          <SfFormItem :colProps="{ span: 24 }" field="noticeRole" :rules="rules.noticeRole" label="超时通知角色/人">
            <a-checkbox-group :options="noticeRoleSelectList" v-model="formData.noticeRole"></a-checkbox-group>
          </SfFormItem>
        </template>
        <template v-if="ticketStatus === 3">
          <SfFormItem :colProps="{ span: 24 }" field="autoAccept" label="自动验收开关">
            <a-switch v-model="formData.autoAccept" :checked-value="1" :unchecked-value="2"></a-switch>
            <span style="margin-left: 8px">{{ formData.autoAccept === 1 ? "开启" : "关闭" }}</span>
          </SfFormItem>
          <SfFormItem
            v-if="formData.autoAccept === 1"
            :colProps="{ xs: 24, sm: 16, md: 12, lg: 8, xl: 8, xxl: 6 }"
            field="autoAcceptOvertime"
            :rules="rules.autoAcceptOvertime"
            label="自动验收超时"
          >
            <a-select :options="overtimeSelectList" v-model="formData.autoAcceptOvertime" placeholder="请选择超时时间"></a-select>
          </SfFormItem>
        </template>
        <!-- <SfFormItem :colProps="{ span: 24 }" field="jobId" :rules="rules.jobId" label="是否应用到所有同类型事件">
          <a-radio-group></a-radio-group>
        </SfFormItem> -->
        <SfFormItem :colProps="{ span: 24 }">
          <a-space>
            <a-button html-type="submit" type="primary" :loading="buttonLoading">保存</a-button>
            <a-checkbox v-model="isAlike">应用到所有{{ jobProductName || "同" }}工单类型</a-checkbox>
          </a-space>
        </SfFormItem>
      </SfForm>
    </CUVue>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import Dict, { DictModel } from "@/api/tenant/Dict";
import JobOvertimeConfig, {
  CreateJobOvertimeConfigModel,
  JobOvertimeConfigModel,
  UpdateJobOvertimeConfigModel,
} from "@/api/tenant/JobOvertimeConfig";
import JobOvertimeType, { JobOvertimeTypeModel } from "@/api/tenant/JobOvertimeType";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue, { useDetailPageModel, useDetail } from "@/components/lib/CU/CU";
import { useStartStopWatch } from "@/hooks/use";
import { useRoute } from "vue-router";
import RulesLib from "@/utils/RulesLib";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import JobConfig, { JobConfigModel } from "@/api/tenant/JobConfig";
import { useAppStore } from "@/store";
import Message from "@/utils/Message";

const ticketStatusMap = {
  5: "待分配",
  1: "待接单",
  2: "已接单",
  3: "待验收",
};

export default defineComponent({
  name: "work-order-configuration",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
  },
  setup() {
    const showModalTips = ref(false);
    const loading = ref(false);
    const { pageModel, pageModelText } = useDetailPageModel();
    const ticketStatus = ref(5);
    const isAlike = ref(false);
    const formData = ref<Partial<JobOvertimeConfigModel>>({
      overtimeSwitch: 2,
      autoAccept: 2,
    });
    const rules = {
      overtimeSwitch: new RulesLib().done(),
      overtime: new RulesLib().required("请选择超时时间").done(),
      autoAcceptOvertime: new RulesLib().required("请选择超时时间").done(),
      jobOvertimeType: new RulesLib()
        .required("请至少选择一个处理方式")
        .validator((value, cb) => {
          if (value > 0) {
            cb();
          } else {
            cb("请至少选择一个处理方式");
          }
        })
        .done(),
      noticeRole: new RulesLib().required("请至少选择一个通知角色/人").done(),
    };
    const route = useRoute();
    const appStore = useAppStore();
    const productMap = computed(() => {
      return appStore.productMap as any;
    });
    const jobProductName = ref("");
    const jobData = ref<JobConfigModel>();
    JobConfig.findById(route.params.id as string).then((res) => {
      jobProductName.value = productMap.value?.[res.product].label || "";
      jobData.value = res;
    });
    const overtimeSelectList = ref<{ label: string; value: number }[]>([]);
    const noticeRoleSelectList = ref<{ label: string; value: number }[]>([]);
    const overtimeTypeSelectList = ref<{ label: string; value: number }[]>([]);
    const isNotSetting = ref(false);

    const isInit = ref(false);
    const init = () => {
      const p = [];
      p.push(
        Dict.getAllDictByCode("overtimeEnum").then((res) => {
          overtimeSelectList.value = res.map((item) => {
            return {
              label: item.label,
              value: Number(item.value),
            };
          });
        }),
      );
      p.push(
        Dict.getAllDictByCode("ticketOvertimeNoticeRole").then((res) => {
          noticeRoleSelectList.value = res.map((item) => {
            return {
              disabled: [3, 4, 5].some((v) => v === Number(item.value)),
              label: item.label,
              value: Number(item.value),
            };
          });
        }),
      );
      p.push(
        JobOvertimeType.all().then((res) => {
          overtimeTypeSelectList.value = res.map((item) => {
            return {
              label: item.name,
              value: Number(item.code),
            };
          });
        }),
      );
      return Promise.all(p);
    };
    const loadData = () => {
      loading.value = true;
      const jobId = route.params.id as string;
      const p: Promise<any>[] = [];
      if (!isInit.value) {
        p.push(init());
        isInit.value = true;
      }
      p.push(
        JobOvertimeConfig.getDetailByJobIdAndStatus(jobId, ticketStatus.value)
          .then((res) => {
            formData.value = res;
            formData.value.overtime = Number(res.overtime) || undefined;
            isNotSetting.value = false;
          })
          .catch((err) => {
            if (err?.code === 10010017) {
              isNotSetting.value = true;
              formData.value = {
                overtimeSwitch: 2,
                autoAccept: 2,
              };
            }
          }),
      );
      Promise.all(p).finally(() => {
        loading.value = false;
      });
    };
    loadData();
    watch(ticketStatus, loadData);
    watch(
      () => formData.value.autoAccept,
      () => {
        if (formData.value.autoAccept === 1) {
          formData.value.overtimeSwitch = 2;
        }
      },
    );
    watch(
      () => formData.value.overtimeSwitch,
      () => {
        if (formData.value.overtimeSwitch === 1) {
          formData.value.autoAccept = 2;
        }
      },
    );
    const refForm = ref();
    const { buttonLoading, create, update } = useDetail(refForm, JobOvertimeConfig);
    const clickSave = () => {
      if (isNotSetting.value) {
        create({
          ...formData.value,
          isAlike: isAlike.value ? 1 : 2,
          product: jobData.value?.product,
          ticketStatusName: ticketStatusMap[ticketStatus.value as keyof typeof ticketStatusMap],
          ticketStatus: ticketStatus.value,
          jobId: jobData.value?.id,
          jobName: jobData.value?.jobName || "",
        } as CreateJobOvertimeConfigModel).then(() => {
          Message.success("保存成功");
          return loadData();
        });
      } else {
        update({ ...formData.value, isAlike: isAlike.value ? 1 : 2, product: jobData.value?.product } as UpdateJobOvertimeConfigModel).then(() => {
          Message.success("保存成功");
        });
      }
    };
    return {
      showModalTips,
      pageModel,
      pageModelText,
      loading,
      formData,
      isAlike,
      rules,
      overtimeSelectList,
      noticeRoleSelectList,
      overtimeTypeSelectList,
      jobProductName,
      jobData,
      refForm,
      ticketStatus,
      clickSave,
      buttonLoading,
    };
  },
});
</script>

<style lang="less" scoped>
.work-order-configuration {
}
</style>
