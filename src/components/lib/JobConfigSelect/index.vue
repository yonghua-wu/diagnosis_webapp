<template>
  <div class="job-config-select">
    <div class="input-area" @click="clickInput" :style="mergedDisabled ? 'cursor: not-allowed' : ''">
      <span v-if="jobConfigMap[formData.job]?.jobName">{{ jobConfigMap?.[formData.job]?.jobName }}</span>
      <span v-else style="color: var(--color-text-3)">{{ placeholder }}</span>
    </div>
    <a-modal
      v-model:visible="visible"
      :title="'选择工作配置' + (formData.job ? `（已选择 ${jobConfigMap?.[formData.job]?.jobName}）` : '')"
      title-align="start"
      width="800px"
      @before-ok="handleBeforeOk"
      @cancel="handleCancel"
    >
      <a-tabs position="top" type="capsule" lazy-load v-model:active-key="activeTab">
        <a-tab-pane :key="key" :title="serviceClassMap[key].label" v-for="key in Object.keys(serviceClassMap)">
          <div class="module-item">
            <a-tabs position="left" lazy-load v-model:active-key="activeModuleTab[key]">
              <a-tab-pane :key="module.moduleId" :title="module.moduleName" v-for="module in moduleDataMap[key]">
                <a-input-search v-model="search" placeholder="搜索" style="width: 33%"></a-input-search>
                <a-radio-group v-model="formData.job">
                  <a-spin :loading="radioMap[module.moduleId] === undefined" style="width: 100%; height: 100%; min-height: 50px">
                    <div class="radio-list">
                      <div
                        class="radio-item"
                        v-for="(item, radioMapIndex) in radioMap[module.moduleId]?.filter((item) => {
                          return item.jobName.indexOf(search) !== -1;
                        })"
                        :key="radioMapIndex"
                      >
                        <a-radio :value="item.id">
                          {{ item.jobName }}
                        </a-radio>
                      </div>
                      <a-empty
                        v-if="
                          radioMap[module.moduleId]?.filter((item) => {
                            return item.jobName.indexOf(search) !== -1;
                          }).length === 0
                        "
                      ></a-empty>
                    </div>
                  </a-spin>
                </a-radio-group>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script lang="ts">
import JobConfig, { JobConfigModel } from "@/api/tenant/JobConfig";
import { useAppStore } from "@/store";
import { useFormItem } from "@arco-design/web-vue";
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
export default defineComponent({
  name: "job-config-select",
  props: {
    placeholder: {
      type: String,
      default: () => "请选择工作配置",
    },
    modelValue: {
      type: String,
    },
    serviceClass: {
      type: Number,
    },
    jobName: {
      type: String,
    },
    filterType: {
      type: Number,
      default: () => null,
    },
    queryData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "update:serviceClass", "update:serviceType", "update:jobName", "change"],
  setup(props, { emit }) {
    const formData = reactive({
      job: "",
    });
    const appStore = useAppStore();
    const activeTab = ref("1");
    const activeModuleTab = reactive<any>({});
    const serviceClassMap = computed(() => {
      const m = appStore.serviceClassMap as any;
      let res: any = {};
      if (props.queryData.serviceClasses) {
        Object.keys(m)
          .filter((key) => props.queryData.serviceClasses.some((qs: string) => qs == key))
          .forEach((key) => (res[key] = m[key]));
      } else {
        res = m;
      }
      Object.keys(res).forEach((key: any) => {
        activeModuleTab[key] = null;
      });
      return res;
    });
    activeTab.value = Object.keys(serviceClassMap.value)[0];
    const moduleDataMap = reactive<any>({});
    const loadModule = (serviceClassValue: string) => {
      console.log(serviceClassValue);
      if (moduleDataMap[serviceClassValue] === undefined) {
        JobConfig.findModuleByServiceClass(serviceClassValue).then((res) => {
          const filterProducts = props.queryData.products;
          moduleDataMap[serviceClassValue] = res.filter((item) => {
            return filterProducts ? filterProducts.some((p: number) => item.product == p) : true;
          });
          if (activeModuleTab[serviceClassValue] === null) {
            activeModuleTab[serviceClassValue] = res?.[0].moduleId;
          }
        });
      }
    };

    const jobConfigMap = reactive<any>({});
    const radioMap = reactive<Record<string, JobConfigModel[]>>({});
    const loadJobConfig = (moduleId: string) => {
      if (radioMap[moduleId] === undefined) {
        let filterServiceType: number[] = [];
        if (props.filterType) {
          filterServiceType = [props.filterType];
        } else if (props.queryData.serviceTypes) {
          filterServiceType = props.queryData.serviceTypes;
        }
        const filterProducts: number[] = props.queryData.products;
        JobConfig.findByModule(moduleId).then((res) => {
          const list = res
            .filter((item) => {
              return filterServiceType?.length ? filterServiceType.some((type) => item.serviceType == type) : true;
            })
            .filter((item) => {
              return filterProducts?.length ? filterProducts.some((type) => item.product == type) : true;
            });
          radioMap[moduleId] = list;
          list.forEach((item) => {
            jobConfigMap[item.id] = item;
          });
        });
      }
    };
    const search = ref("");
    watch(activeModuleTab, () => {
      Object.keys(activeModuleTab).forEach((key) => {
        activeModuleTab[key] && loadJobConfig(activeModuleTab[key]);
      });
      search.value = "";
    });
    const { eventHandlers, mergedDisabled } = useFormItem();
    const initData = () => {
      formData.job = modelValue.value || "";
      if (formData.job) {
        jobConfigMap[formData.job] === undefined &&
          JobConfig.findById(formData.job).then((res) => {
            jobConfigMap[formData.job] = res;
          });
      }
    };
    const { modelValue } = toRefs(props);
    formData.job = modelValue.value || "";
    watch(modelValue, () => {
      initData();
    });
    const visible = ref(false);
    initData();
    const clickInput = () => {
      if (!mergedDisabled.value) {
        initData();
        visible.value = true;
      }
    };

    loadModule(activeTab.value);
    watch(activeTab, () => {
      loadModule(activeTab.value);
    });

    const handleBeforeOk = (done: (closed: boolean) => void) => {
      emit("update:modelValue", formData.job);
      eventHandlers.value?.onInput?.();
      emit("update:serviceClass", Number(activeTab.value));
      emit("update:serviceType", jobConfigMap[formData.job]?.serviceType);
      emit("update:jobName", jobConfigMap[formData.job]?.jobName);
      visible.value = false;
      done(true);
    };
    const handleCancel = () => {
      formData.job = modelValue.value || "";
      visible.value = false;
    };

    return {
      mergedDisabled,
      search,
      formData,
      visible,
      serviceClassMap,
      activeModuleTab,
      // serviceTypeMap,
      moduleDataMap,
      jobConfigMap,
      radioMap,
      // jobConfigList,
      activeTab,
      clickInput,
      handleBeforeOk,
      handleCancel,
    };
  },
});
</script>

<style lang="less" scoped>
.job-config-select {
  width: 100%;
  height: 32px;
  .input-area {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-right: 12px;
    padding-left: 12px;
    color: var(--color-text-1);
    font-size: 14px;
    background-color: var(--color-fill-2);
    border: 1px solid transparent;
    border-radius: var(--border-radius-small);
  }
}
:deep(.arco-radio-group) {
  width: 100%;
}
.module-item {
  height: 600px;
  overflow-y: auto;
}
.radio-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}
.radio-item {
  width: 33%;
}
:deep(.arco-tabs-left .arco-tabs-tab) {
  text-align: right;
  min-width: 120px;
}
:deep(.arco-tabs-nav-type-capsule .arco-tabs-nav-tab) {
  justify-content: center;
}
</style>
