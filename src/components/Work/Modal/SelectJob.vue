<template>
  <div class="work-select-job">
    <div class="input-area" @click="clickInput" :style="mergedDisabled ? 'cursor: not-allowed' : ''">
      <span v-if="jobConfigMap[selectedValue]?.jobName">{{ jobConfigMap?.[selectedValue]?.jobName }}</span>
      <span v-else style="color: var(--color-text-3)">{{ placeholder }}</span>
    </div>
    <a-modal
      v-model:visible="visible"
      :title="'选择工作配置' + (selectedValue ? `（已选择 ${jobConfigMap?.[selectedValue]?.jobName}）` : '')"
      title-align="start"
      width="800px"
      @before-ok="handleBeforeOk"
      @cancel="handleCancel"
    >
      <a-tabs position="top" type="capsule" lazy-load v-model:active-key="activeTab">
        <a-tab-pane :key="Number(key)" :title="serviceClassMap[key].label" v-for="key in Object.keys(serviceClassMap)">
          <a-spin :loading="loadingServiceClass === Number(key)" style="height: 400px; width: 100%">
            <a-radio-group v-model="selectedValue">
              <div class="radio-list">
                <div class="radio-item" v-for="(item, index) in serviceClassAndJobConfigMap[Number(key)]" :key="key + String(index)">
                  <a-radio :value="item.id">{{ item.jobName }}</a-radio>
                </div>
              </div>
            </a-radio-group>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script lang="ts">
import JobConfig, { JobConfigModel } from "@/api/tenant/JobConfig";
import { useAppStore } from "@/store";
import { useFormItem } from "@arco-design/web-vue";
import { computed } from "@vue/reactivity";
import { defineComponent, reactive, ref, toRefs, watch } from "vue";
export default defineComponent({
  name: "work-select-job",
  props: {
    placeholder: {
      type: String,
      default: () => "请选择工作配置",
    },
    modelValue: {
      type: String,
      default: () => "",
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const entryModelValue = ref(modelValue.value);
    const { eventHandlers, mergedDisabled } = useFormItem();

    const loadingServiceClass = ref(-1);
    const jobConfigMap = reactive<Record<string, JobConfigModel>>({});
    const serviceClassAndJobConfigMap = reactive<Record<string, JobConfigModel[]>>({});
    const loadJobConfig = (serviceClass: number) => {
      if (serviceClassAndJobConfigMap[serviceClass]) {
        return;
      }
      const p = [];
      loadingServiceClass.value = serviceClass;
      p.push(JobConfig.all({ serviceClass, serviceType: 2 }));
      p.push(JobConfig.all({ serviceClass, serviceType: 3 }));
      Promise.all(p)
        .then((resList) => {
          resList.forEach((res) => {
            res.forEach((job) => {
              jobConfigMap[job.id] = job;
            });
            serviceClassAndJobConfigMap[serviceClass] || (serviceClassAndJobConfigMap[serviceClass] = []);
            serviceClassAndJobConfigMap[serviceClass].push(...res);
          });
        })
        .catch(() => {
          delete serviceClassAndJobConfigMap[serviceClass];
        })
        .finally(() => {
          loadingServiceClass.value = -1;
        });
    };

    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      const m: Record<string, any> = {};
      Object.keys(appStore.serviceClassMap as Record<string, any>)
        .filter((key) => {
          return [1, 2, 3, 5].some((v) => v === Number(key));
        })
        .forEach((key) => (m[key] = (appStore.serviceClassMap as Record<string, any>)[key]));
      return m;
    });

    const selectedValue = ref("");

    const initData = () => {
      selectedValue.value = modelValue.value;
      // console.log(jobConfigMap[selectedValue.value]);
      if (selectedValue.value && jobConfigMap[selectedValue.value] === undefined) {
        JobConfig.findById(selectedValue.value).then((res) => {
          jobConfigMap[selectedValue.value] = res;
        });
      }
    };
    initData();
    const activeTab = ref(1);
    loadJobConfig(activeTab.value);
    watch(activeTab, () => {
      loadJobConfig(activeTab.value);
    });
    const visible = ref(false);
    const clickInput = () => {
      if (!mergedDisabled.value) {
        initData();
        visible.value = true;
      }
    };

    watch(modelValue, () => {
      entryModelValue.value = modelValue.value;
      initData();
    });
    const handleBeforeOk = (done: (closed: boolean) => void) => {
      emit("update:modelValue", selectedValue.value);
      eventHandlers.value?.onInput?.();
      done(true);
    };
    const handleCancel = () => {
      selectedValue.value = entryModelValue.value;
      visible.value = false;
    };
    return {
      visible,
      jobConfigMap,
      serviceClassMap,
      serviceClassAndJobConfigMap,
      eventHandlers,
      mergedDisabled,
      activeTab,
      selectedValue,
      loadingServiceClass,
      clickInput,
      handleCancel,
      handleBeforeOk,
    };
  },
});
</script>

<style lang="less" scoped>
.work-select-job {
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

.radio-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}
.radio-item {
  width: 24.5%;
  height: 35px;
  line-height: 35px;
}

:deep(.arco-radio-group) {
  width: 100%;
}

:deep(.arco-tabs-left .arco-tabs-tab) {
  text-align: right;
  min-width: 120px;
}
:deep(.arco-tabs-nav-type-capsule .arco-tabs-nav-tab) {
  justify-content: center;
}
</style>
