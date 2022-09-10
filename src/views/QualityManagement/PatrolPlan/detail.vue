<template>
  <div class="inspection-plan-detail container">
    <Breadcrumb :items="['品质管理', { name: '品质巡检计划', router: () => $router.replace({ name: 'QualityPatrolPlan' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <a-form
          ref="refForm"
          :model="formData"
          @submit="clickSave"
          :label-col-props="{ span: 8 }"
          :wrapper-col-props="{ span: 16 }"
          :disabled="pageModel === 'View'"
          style="max-width: 1500px"
        >
          <a-space direction="vertical" fill>
            <a-space direction="vertical" fill>
              <a-row class="section-title">基本信息</a-row>
              <a-row class="section-body" :gutter="24">
                <a-col :span="8">
                  <a-form-item :rules="rules.planName" field="planName" label="名称" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.planName" placeholder="请输入巡检计划名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item required label="巡检标准" :row-props="{ gutter: 24 }">
                    <a-select
                      placeholder="请选择巡检标准"
                      :loading="jobConfigLoading"
                      :options="jobConfigOptions"
                      v-model="formData.jobId"
                      allow-search
                    ></a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.serviceClass" field="serviceClass" label="业务" :row-props="{ gutter: 24 }">
                    <a-select v-model="formData.serviceClass" placeholder="请选择业务">
                      <a-option
                        :label="serviceClassMap[key].label"
                        :value="Number(key)"
                        :key="index"
                        v-for="(key, index) in Object.keys(serviceClassMap)"
                      ></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.toId" field="toId" label="指定执行人" :row-props="{ gutter: 24 }">
                    <a-select
                      allow-clear
                      v-model="formData.toId"
                      :options="staffList"
                      :loading="staffListLoading"
                      placeholder="请选择执行人"
                    ></a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill>
              <a-row class="section-title">周期配置</a-row>
              <a-row class="section-body" :gutter="24">
                <a-col :span="8">
                  <a-form-item :rules="rules.freq" field="freq" label="周期" :row-props="{ gutter: 24 }">
                    <a-select v-model="formData.freq" placeholder="请选择周期">
                      <a-option :value="'DAY'" label="每天"></a-option>
                      <a-option :value="'WEEK'" label="每周"></a-option>
                      <a-option :value="'MONTH'" label="每月"></a-option>
                      <a-option :value="'QUARTER'" label="每季"></a-option>
                    </a-select>
                    <a-select
                      v-if="formData.freq === 'QUARTER'"
                      v-model="formData.quarter"
                      placeholder="请选择季度"
                      :options="selectQuarterList"
                    ></a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item
                    :rules="rules.triggerTimeList"
                    field="triggerTimeList"
                    label="触发时间"
                    style="transform: translateX(-4px)"
                    :row-props="{ gutter: 24 }"
                    :label-col-props="{ span: 4 }"
                    :wrapper-col-props="{ span: 10 }"
                  >
                    <div style="width: 100%">
                      <a-input-group style="width: 100%" v-for="(item, index) in formData.triggerTimeList" :key="index">
                        <a-select
                          v-if="formData.freq !== 'DAY' && (formData.freq === 'QUARTER' || formData.freq === 'MONTH')"
                          v-model="item.day"
                          :options="selectDayList"
                        ></a-select>
                        <a-select v-if="formData.freq !== 'DAY' && formData.freq === 'WEEK'" v-model="item.week" :options="selectWeekList"></a-select>
                        <a-select style="width: 100%" :options="selectHourList" v-model="item.hours" placeholder="小时" />
                        <a-select style="width: 100%" :options="selectMinutesList" v-model="item.minutes" placeholder="分钟" />
                        <a-button v-if="formData.triggerTimeList.length > 1" type="text" status="danger" @click="() => clickDelTriggerTime(index)"
                          >删除</a-button
                        >
                      </a-input-group>
                      <a-button v-if="formData.triggerTimeList.length < 5" type="text" @click="clickAddTriggerTime">添加</a-button>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill>
              <a-row class="section-title">巡检路线选择</a-row>
              <a-row class="section-body" :gutter="24">
                <a-col :span="8">
                  <a-form-item :rules="rules.cyclicalPlanRoutes" field="cyclicalPlanRoutes" label="" :row-props="{ gutter: 24 }">
                    <a-transfer
                      show-search
                      :title="['未选择的', '已选择的']"
                      :data="qualityCheckRouteList"
                      v-model="formData.cyclicalPlanRoutes"
                      @select="selectRoutes"
                    >
                      <template #item="{ label, value }">
                        <a-tooltip :content="qualityCheckRouteMap[value].routeDesc">
                          <div>{{ label }}</div>
                        </a-tooltip>
                      </template>
                    </a-transfer>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="section-body" :gutter="24"> </a-row>
            </a-space>
            <a-row :gutter="24" v-if="pageModel != 'View'">
              <a-col :span="8">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="clickSave" :loading="createLoading">保存</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
        </a-form>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

import CUVue, { useDetailPage } from "@/components/lib/CU";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import QualityCheckPlan, { CreateQualityCheckPlanModel, CyclicalPlanTaskModel } from "@/api/tenant/QualityCheckPlan";
import { deepClone } from "@/utils/utils";
import QualityCheckRoute, { QualityCheckRouteModel } from "@/api/tenant/QualityCheckRoute";
import { getFreqConst } from "@/utils/cronUtils";
import Staff from "@/api/tenant/Staff";
import { useAppStore } from "@/store";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import Message from "@/utils/Message";
import JobConfig, { JobConfigModel } from "@/api/tenant/JobConfig";
import { SelectOption } from "@arco-design/web-vue";

export default defineComponent({
  name: "inspection-plan-detail",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      const classMap: any = {};
      Object.keys(appStore.serviceClassMap as any).forEach((key) => {
        classMap[key] = (appStore.serviceClassMap as any)[key];
        // 取消客服类
        // if (Number(key) !== 4) {
        //   classMap[key] = (appStore.serviceClassMap as any)[key];
        // }
      });
      return classMap as any;
    });
    const router = useRouter();
    const createLoading = ref(false);
    const formData = ref<any>({
      triggerTimeList: [
        {
          hours: 9,
          minutes: 0,
          day: 1,
          week: 1,
        },
      ],
      cyclicalPlanRoutes: [],
      serviceClass: null,
      planName: "",
      jobId: "",
      jobName: "",
      jobServiceClass: "",
      jobServiceType: "",
      freq: "DAY",
      quarter: 1,
      toId: null,
      toName: null,
      toPhone: null,
    });
    const rules = {
      planName: new RulesLib().required("请输入计划名称").done(),
      serviceClass: new RulesLib().required("请选择业务").done(),
      toId: new RulesLib().done(),
      freq: new RulesLib().required("请选择周期").done(),
      triggerTimeList: new RulesLib().required("请选择触发时间").done(),
      cyclicalPlanRoutes: new RulesLib().required("请选择巡检路线").done(),
    };
    const showModalTips = ref(false);
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const { pageModel, pageModelName } = useDetailPage();
    const loading = ref(false);

    const route = useRoute();

    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      const p1 = QualityCheckPlan.detail(route.params.id as string).then((res) => {
        formData.value = res;
        formData.value.serviceClass = res.jobServiceClass;
        formData.value.deleteCyclicalPlanRoutes = res.cyclicalPatrolRoutes;
        formData.value.deleteCyclicalPlanTasks = res.cyclicalPlanTasks;
        formData.value.cyclicalPlanRoutes = res.cyclicalPatrolRoutes.map((v) => v.routeId);
        formData.value.triggerTimeList = res.cyclicalPlanTasks.map((v) => {
          let day = 1;
          if (v.cronDays === "L") {
            day = 29;
          } else if (v.cronDays) {
            day = Number(v.cronDays);
          }
          return {
            hours: Number(v.cronHours),
            minutes: Number(v.cronMinutes),
            day: day,
            week: v.cronWeeks && Number(v.cronWeeks),
          };
        });
        formData.value.freq = res.cyclicalPlanTasks?.[0].cronExpress ? getFreqConst(res.cyclicalPlanTasks?.[0].cronExpress) : "DAY";
        if (formData.value.freq === "QUARTER") {
          switch (res.cyclicalPlanTasks?.[0].cronMonths) {
            case "1,4,7,10":
              formData.value.quarter = 1;
              break;
            case "2,5,8,11":
              formData.value.quarter = 2;
              break;
            case "3,6,9,12":
              formData.value.quarter = 3;
              break;
          }
        }
      });

      return Promise.all([p1])
        .then(() => {
          nextTick(startWatch);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const jobConfigOptions = ref<SelectOption[]>([]);
    const jobConfigMap = ref<{ [key: string]: JobConfigModel }>({});
    const jobConfigLoading = ref(true);
    JobConfig.all({ product: 3, serviceType: 1, serviceClass: 5 })
      .then((res) => {
        jobConfigOptions.value = res.map((v) => {
          jobConfigMap.value[v.id] = v;
          return {
            label: v.jobName,
            value: v.id,
          };
        });
      })
      .finally(() => {
        jobConfigLoading.value = false;
      });

    const createData = () => {
      const planTasks: CyclicalPlanTaskModel[] = formData.value.triggerTimeList.map((v: any) => {
        let months = undefined;
        let days = undefined;
        let weeks = undefined;
        let freq = "4";
        if (formData.value.freq === "QUARTER") {
          freq = "6";
          if (formData.value.quarter === 1) {
            months = "1,4,7,10";
          } else if (formData.value.quarter === 2) {
            months = "2,5,8,11";
          } else if (formData.value.quarter === 3) {
            months = "3,6,9,12";
          }
          if (v.day === 29) {
            days = "L";
          } else {
            days = String(v.day);
          }
        } else if (formData.value.freq === "WEEK") {
          freq = "5";

          weeks = String(v.week);
        } else if (formData.value.freq === "MONTH") {
          freq = "6";
          days = String(v.day);
          if (v.day === 29) {
            days = "L";
          } else {
            days = String(v.day);
          }
        }
        return {
          cronDays: days,
          cronFreqUnit: freq,
          cronSeconds: "0",
          cronWeeks: weeks,
          cronYears: undefined,
          cronHours: String(v.hours),
          cronMinutes: String(v.minutes),
          cronMonths: months,
        };
      });

      const submitData: CreateQualityCheckPlanModel = {
        addCyclicalPlanRoutes: formData.value.cyclicalPlanRoutes.map((id: string) => qualityCheckRouteMap.value[id]),
        addCyclicalPlanTasks: planTasks,
        deleteCyclicalPlanRoutes: [],
        deleteCyclicalPlanTasks: [],
        jobId: formData.value.jobId,
        jobName: jobConfigMap.value[formData.value.jobId].jobName,
        jobServiceClass: formData.value.serviceClass,
        jobServiceType: formData.value.jobServiceType,
        planName: formData.value.planName,
        remark: "",
        toId: formData.value.toId,
        toName: staffMap.value[formData.value.toId]?.name,
        toPhone: staffMap.value[formData.value.toId]?.phone,
      };
      createLoading.value = true;
      console.log("submitData", submitData);
      return QualityCheckPlan.create(submitData)
        .then(() => {
          router.push({ name: "QualityPatrolPlan" });
        })
        .catch((err) => {
          Message.error(err.msg);
        })
        .finally(() => {
          createLoading.value = false;
        });
    };
    const updateData = () => {
      const planTasks: CyclicalPlanTaskModel[] = formData.value.triggerTimeList.map((v: any) => {
        let months = undefined;
        let days = undefined;
        let weeks = undefined;
        let freq = "4";
        if (formData.value.freq === "QUARTER") {
          freq = "6";
          if (formData.value.quarter === 1) {
            months = "1,4,7,10";
          } else if (formData.value.quarter === 2) {
            months = "2,5,8,11";
          } else if (formData.value.quarter === 3) {
            months = "3,6,9,12";
          }
          if (v.day === 29) {
            days = "L";
          } else {
            days = String(v.day);
          }
        } else if (formData.value.freq === "WEEK") {
          freq = "5";

          weeks = String(v.week);
        } else if (formData.value.freq === "MONTH") {
          freq = "6";
          days = String(v.day);
          if (v.day === 29) {
            days = "L";
          } else {
            days = String(v.day);
          }
        }
        return {
          cronDays: days,
          cronFreqUnit: freq,
          cronSeconds: "0",
          cronWeeks: weeks,
          cronYears: undefined,
          cronHours: String(v.hours),
          cronMinutes: String(v.minutes),
          cronMonths: months,
        };
      });

      const submitData: CreateQualityCheckPlanModel = {
        addCyclicalPlanRoutes: formData.value.cyclicalPlanRoutes.map((id: string) => qualityCheckRouteMap.value[id]),
        addCyclicalPlanTasks: planTasks,
        deleteCyclicalPlanRoutes: formData.value.deleteCyclicalPlanRoutes,
        deleteCyclicalPlanTasks: formData.value.deleteCyclicalPlanTasks,
        jobId: formData.value.jobId,
        jobName: jobConfigMap.value[formData.value.jobId].jobName,
        jobServiceClass: formData.value.serviceClass,
        jobServiceType: formData.value.jobServiceType,
        planName: formData.value.planName,
        id: formData.value.id,
        toId: formData.value.toId,
        toName: staffMap.value[formData.value.toId]?.name,
        toPhone: staffMap.value[formData.value.toId]?.phone,
        remark: "",
      };
      createLoading.value = true;
      console.log("submitData", submitData);
      return QualityCheckPlan.update(submitData)
        .then(() => {
          router.push({ name: "QualityPatrolPlan" });
        })
        .catch((err) => {
          Message.error(err.msg);
        })
        .finally(() => {
          createLoading.value = false;
        });
    };

    if (pageModel.value && pageModel.value !== "Add") {
      loadData();
    } else {
      startWatch();
    }
    watch(pageModel, () => {
      if (pageModel.value && pageModel.value !== "Add") {
        loadData();
      } else {
        startWatch();
      }
    });
    const selectHourList = Array(...Array(24)).map((_, index) => {
      return {
        label: ("0" + String(index)).slice(-2) + "时",
        value: index,
      };
    });
    const selectMinutesList = Array(...Array(4)).map((_, index) => {
      return {
        label: ("0" + String(index * 15)).slice(-2) + "分",
        value: index * 15,
      };
    });
    const selectDayList = Array(...Array(28)).map((_, index) => {
      return {
        label: index + 1 + "日",
        value: index + 1,
      };
    });
    selectDayList.push({
      label: "最后一天",
      value: 29,
    });
    const selectWeekList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"].map((week, index) => {
      return {
        label: week,
        value: index + 1,
      };
    });
    const selectQuarterList = [
      {
        label: "1月 4月 7月 10月",
        value: 1,
      },
      {
        label: "2月 5月 8月 11月",
        value: 2,
      },
      {
        label: "3月 6月 9月 12月",
        value: 3,
      },
    ];
    const refForm = ref();
    const clickSave = () => {
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          if (pageModel.value === "Edit") {
            return updateData();
          } else {
            return createData();
          }
        }
      });
    };
    const clickAddTriggerTime = () => {
      const t = formData.value.triggerTimeList[formData.value.triggerTimeList.length - 1];
      formData.value.triggerTimeList.push(deepClone(t));
    };
    const clickDelTriggerTime = (i: number) => {
      formData.value.triggerTimeList.splice(i, 1);
    };
    const qualityCheckRouteList = ref<any[]>([]);
    const qualityCheckRouteMap = ref<any>({});
    const staffList = ref<any[]>([]);
    const staffListLoading = ref(false);
    const staffMap = ref<any>({});
    watch(
      () => formData.value.serviceClass,
      () => {
        if (formData.value.serviceClass) {
          QualityCheckRoute.getAll({ serviceClass: formData.value.serviceClass }).then((res) => {
            qualityCheckRouteMap.value = {};
            qualityCheckRouteList.value = res.map((v) => {
              qualityCheckRouteMap.value[v.id] = {
                routeDesc: v.routeSpots.length ? v.routeSpots.map((vv) => vv.placeName).reduce((a, b) => `${a}，${b}`) : "",
                remark: v.remark,
                routeId: v.id,
                routeName: v.routeName,
                routeType: v.routeType,
                serviceClass: v.serviceClass,
              };
              return {
                label: v.routeName,
                value: v.id,
              };
            });
            formData.value.deleteCyclicalPlanRoutes?.forEach((route: any) => {
              if (qualityCheckRouteMap.value[route.routeId] === undefined && route.serviceClass === formData.value.serviceClass) {
                qualityCheckRouteMap.value[route.routeId] = {
                  routeDesc: route.routeSpotInfos.length
                    ? route.routeSpotInfos.map((vv: any) => vv.placeName).reduce((a: string, b: string) => `${a}，${b}`)
                    : "",
                  isDeleted: true,
                  remark: route.remark,
                  routeId: route.routeId,
                  routeName: route.routeName,
                  routeType: route.routeType,
                  serviceClass: route.serviceClass,
                };
                qualityCheckRouteList.value.push({
                  label: route.routeId,
                  value: route.routeId,
                });
              }
            });
          });
          staffListLoading.value = true;
          Staff.findByServiceClass(formData.value.serviceClass)
            .then((res) => {
              staffMap.value = {};
              staffList.value = res
                .filter((s: any) => s.craft === 2)
                .map((s: any) => {
                  staffMap.value[s.staffId] = s;
                  return {
                    label: s.name + "（主管）",
                    value: s.staffId,
                  };
                });
              if (staffMap.value[formData.value.toId] === undefined) {
                formData.value.toId = null;
                formData.value.toName = null;
                formData.value.toPhone = null;
              }
            })
            .finally(() => {
              staffListLoading.value = false;
            });
        } else {
          staffList.value = [];
          formData.value.toId = null;
          formData.value.toName = null;
          formData.value.toPhone = null;
        }
      },
    );
    const selectedRouteDetail = ref<QualityCheckRouteModel | null>(null);
    const selectRoutes = (selected: string[]) => {
      selectedRouteDetail.value = qualityCheckRouteMap.value[selected.slice(-1)[0]];
    };
    return {
      rules,
      refForm,
      serviceClassMap,
      staffList,
      qualityCheckRouteList,
      selectMinutesList,
      selectHourList,
      selectQuarterList,
      selectWeekList,
      selectDayList,
      loading,
      pageModel,
      pageModelName,
      showModalTips,
      formData,
      createLoading,
      staffListLoading,
      selectedRouteDetail,
      qualityCheckRouteMap,
      jobConfigOptions,
      jobConfigLoading,
      selectRoutes,
      clickAddTriggerTime,
      clickDelTriggerTime,
      clickSave,
    };
  },
});
</script>

<style lang="less" scoped>
.inspection-plan-detail {
}
:deep(.arco-transfer) {
  width: calc(200% + 68px);
}
:deep(.arco-transfer-view) {
  width: 300px;
  // width: 100%;
}
</style>
