<template>
  <div class="inspection-plan-detail container">
    <Breadcrumb :items="['设备维护', { name: '设备保养计划', router: () => $router.replace({ name: 'EquipmentMaintenancePlan' }) }, pageModelName]" />
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
              <a-row class="section-body">
                <a-col :span="8">
                  <a-form-item :rules="rules.planName" field="planName" label="名称" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.planName" placeholder="请输入计划名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.jobId" :validate-trigger="['input']" field="jobId" label="保养事件" :row-props="{ gutter: 24 }">
                    <JobConfigSelect v-model="formData.jobId" :queryData="{ serviceClasses: [3], serviceTypes: [1], products: [2] }" />
                    <!-- <a-select
                      v-model="formData.jobId"
                      :options="jobList"
                      :loading="jobSelectLoading"
                      placeholder="请选择维保事件"
                      allow-search
                    ></a-select> -->
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.toId" field="toId" label="指定执行人" :row-props="{ gutter: 24 }">
                    <a-select allow-clear v-model="formData.toId" :options="staffList" placeholder="请选择执行人"></a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill>
              <a-row class="section-title">周期配置</a-row>
              <a-row class="section-body">
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
              <!-- <a-row class="section-title">维保地点选择</a-row> -->
              <a-row class="section-body">
                <a-col :span="8">
                  <a-form-item
                    :rules="rules.addRouteSpots"
                    :validate-trigger="['input']"
                    field="addRouteSpots"
                    label="保养地点选择"
                    :row-props="{ gutter: 24 }"
                  >
                    <div class="route-spots">
                      <div class="route-item" v-for="(place, index) in formData.addRouteSpots" :key="index">
                        <span class="place-name">
                          {{ place.placeName }}（{{ place.spotDevices.reduce((a, b) => a + (a && ", ") + b.deviceName, "") }}）
                        </span>
                        <div class="btns">
                          <a-button :disabled="index === 0" @click="() => routeSpotUp(index)" type="text" size="mini">
                            <template #icon>
                              <icon-up />
                            </template>
                          </a-button>
                          <a-button
                            :disabled="index == formData.addRouteSpots.length - 1"
                            @click="() => routeSpotDown(index)"
                            type="text"
                            size="mini"
                          >
                            <template #icon>
                              <icon-down />
                            </template>
                          </a-button>
                          <a-button @click="() => routeSpotDel(index)" type="text" size="mini" status="danger">
                            <template #icon>
                              <icon-close />
                            </template>
                          </a-button>
                        </div>
                      </div>
                      <a-button type="text" long size="small" @click="clickAddRouteSpots">添加</a-button>
                    </div>
                    <!-- <PlaceSelect
                      ref="refDeviceSelectByPlace"
                      :modelValue="formData.addRouteSpots"
                      @update:modelValue="updateAddRouteSpots"
                      :multiple="true"
                      :showInputArea="false"
                    /> -->
                    <DeviceSelectByPlace
                      ref="refDeviceSelectByPlace"
                      :modelValue="formData.addRouteSpots"
                      @update:modelValue="updateAddRouteSpots"
                      :multiple="true"
                      :showInputArea="false"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-row :gutter="24" v-if="pageModel != 'view'">
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
import MaintenancePlan, { CreateMaintenancePlanModel, CyclicalPlanTaskModel } from "@/api/tenant/MaintenancePlan";
import { deepClone } from "@/utils/utils";
import { getFreqConst } from "@/utils/cronUtils";
import Staff from "@/api/tenant/Staff";
import { useAppStore } from "@/store";
import PlaceSelect from "@/components/lib/PlaceSelect/index.vue";
import JobConfig from "@/api/tenant/JobConfig";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import Message from "@/utils/Message";
import { Modal } from "@arco-design/web-vue";
import JobConfigSelect from "@/components/lib/JobConfigSelect/index.vue";
import DeviceSelectByPlace from "@/components/lib/DeviceSelectByPlace/index.vue";

export default defineComponent({
  name: "inspection-plan-detail",
  components: {
    Breadcrumb,
    CUVue,
    DeviceSelectByPlace,
    JobConfigSelect,
  },
  setup() {
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
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
      addRouteSpots: [],
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
      jobId: new RulesLib().required("请选择保养事件").done(),
      toId: new RulesLib().done(),
      freq: new RulesLib().required("请选择周期").done(),
      triggerTimeList: new RulesLib().required("请设置触发时间").done(),
      addRouteSpots: new RulesLib().required("请选择保养地点").done(),
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
      MaintenancePlan.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          formData.value.deleteCyclicalPlanPlaces = res.cyclicalMaintenancePlaces;
          formData.value.deleteCyclicalPlanTasks = res.cyclicalPlanTasks;
          formData.value.addRouteSpots = deepClone(res.cyclicalMaintenancePlaces);
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
          nextTick(startWatch);
        })
        .finally(() => {
          loading.value = false;
        });
    };

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

      const submitData: CreateMaintenancePlanModel = {
        addCyclicalPlanPlaces: formData.value.addRouteSpots.map((p: any) => {
          return {
            placeId: p.placeId,
            placeName: p.placeName,
            placeOrder: p.placeOrder,
            addSpotDevices: p.spotDevices,
          };
        }),
        addCyclicalPlanTasks: planTasks,
        deleteCyclicalPlanPlaces: [],
        deleteCyclicalPlanTasks: [],
        jobId: formData.value.jobId,
        jobName: jobMap.value[formData.value.jobId].jobName,
        jobServiceClass: jobMap.value[formData.value.jobId].serviceClass,
        jobServiceType: jobMap.value[formData.value.jobId].serviceType,
        planName: formData.value.planName,
        remark: "",
        toId: formData.value.toId,
        toName: staffMap.value[formData.value.toId]?.name,
        toPhone: staffMap.value[formData.value.toId]?.phone,
      };
      createLoading.value = true;
      console.log("submitData", submitData);
      return MaintenancePlan.create(submitData)
        .then(() => {
          router.push({ name: "EquipmentMaintenancePlan" });
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

      const submitData: CreateMaintenancePlanModel = {
        addCyclicalPlanPlaces: formData.value.addRouteSpots.map((p: any) => {
          return {
            placeId: p.placeId,
            placeName: p.placeName,
            placeOrder: p.placeOrder,
            addSpotDevices: p.spotDevices.map((d: any) => {
              return {
                deviceId: d.deviceId,
                deviceName: d.deviceName,
                deviceOrder: d.deviceOrder,
                placeId: d.placeId,
              };
            }),
          };
        }),
        addCyclicalPlanTasks: planTasks,
        deleteCyclicalPlanPlaces: formData.value.deleteCyclicalPlanPlaces.map((p: any) => {
          return {
            ...p,
            deleteSpotDevices: p.spotDevices.map((d: any) => {
              return {
                ...d,
              };
            }),
            spotDevices: undefined,
          };
        }),
        deleteCyclicalPlanTasks: formData.value.deleteCyclicalPlanTasks,
        jobId: formData.value.jobId,
        jobName: jobMap.value[formData.value.jobId].jobName,
        jobServiceClass: jobMap.value[formData.value.jobId].serviceClass,
        jobServiceType: jobMap.value[formData.value.jobId].serviceType,
        planName: formData.value.planName,
        id: formData.value.id,
        toId: formData.value.toId,
        toName: staffMap.value[formData.value.toId]?.name,
        toPhone: staffMap.value[formData.value.toId]?.phone,
        remark: "",
      };
      createLoading.value = true;
      console.log("submitData", submitData);
      return MaintenancePlan.update(submitData)
        .then(() => {
          router.push({ name: "EquipmentMaintenancePlan" });
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
          if (pageModel.value === "Add") {
            createData();
          } else {
            updateData();
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
    const jobList = ref<any[]>([]);
    const jobMap = ref<any>({});
    const staffList = ref<any[]>([]);
    const staffMap = ref<any>({});
    Staff.findByServiceClass(3).then((res) => {
      staffMap.value = {};
      staffList.value = res
        // .filter((s: any) => s.craft === 2)
        .map((s: any) => {
          staffMap.value[s.staffId] = s;
          return {
            label: s.name,
            value: s.staffId,
          };
        });
    });
    const jobSelectLoading = ref(true);
    JobConfig.all({
      serviceClass: 3,
      serviceType: 1,
      product: 2,
    })
      .then((res) => {
        jobList.value = res.map((j) => {
          jobMap.value[j.id] = j;
          return {
            value: j.id,
            label: j.jobName,
          };
        });
      })
      .finally(() => {
        jobSelectLoading.value = false;
      });
    const refDeviceSelectByPlace = ref();
    const clickAddRouteSpots = () => {
      refDeviceSelectByPlace.value.clickInput();
    };
    const updateAddRouteSpots = (v: any[]) => {
      console.log(v);
      formData.value.addRouteSpots = v;
    };
    const routeSpotUp = (index: number) => {
      if (index > 0) {
        const list = formData.value.addRouteSpots;
        const v = list[index];
        list.splice(index, 1);
        list.splice(index - 1, 0, v);
        formData.value.addRouteSpots = list;
      }
    };
    const routeSpotDown = (index: number) => {
      if (index < formData.value.addRouteSpots.length - 1) {
        const list = formData.value.addRouteSpots;
        const v = list[index];
        list.splice(index, 1);
        list.splice(index + 1, 0, v);
        formData.value.addRouteSpots = list;
      }
    };
    const routeSpotDel = (index: number) => {
      formData.value.addRouteSpots.splice(index, 1);
    };
    return {
      rules,
      refForm,
      jobSelectLoading,
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
      clickAddTriggerTime,
      clickDelTriggerTime,
      clickSave,
      clickAddRouteSpots,
      updateAddRouteSpots,
      routeSpotUp,
      routeSpotDown,
      routeSpotDel,
      refDeviceSelectByPlace,
      jobList,
    };
  },
});
</script>

<style lang="scss" scoped>
.inspection-plan-detail {
  .route-spots {
    min-height: 300px;
    max-height: 600px;
    overflow: auto;
    width: 100%;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);
    padding: 2px 12px;
    .route-item {
      display: flex;
      align-items: center;
      color: var(--color-text-1);
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-word;
      background-color: var(--color-bg-2);
      border: 1px solid var(--color-fill-3);
      border-radius: var(--border-radius-small);
      min-height: 30px;
      padding: 4px 8px;
      width: 100%;
      margin-top: 1px;
      margin-bottom: 1px;
      .place-name {
        flex: 1;
        overflow: hidden;
      }
      .btns {
        transition: all 0.2s;
        opacity: 0;
      }
      &:hover {
        .btns {
          opacity: 1;
        }
      }
    }
  }
}
:deep(.arco-transfer-view) {
  width: 300px;
}
</style>
