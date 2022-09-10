<template>
  <div class="detail-patrol-plan container">
    <Breadcrumb :items="['巡检中心', { name: '巡检计划', router: () => $router.replace({ name: 'PatrolPlan' }) }, title]" />
    <a-card>
      <template #title>
        <a-button shape="circle" type="text" @click="goBack">
          <icon-left />
        </a-button>
        <span> {{ title }} </span>
      </template>
      <template #extra>
        <a-button type="primary" @click="goEdit" v-if="model === 'view'"> <icon-edit /> 编辑 </a-button>
      </template>
      <a-form :model="formData" @submit="handleSubmit" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" :disabled="model === 'view'">
        <a-space direction="vertical" fill>
          <a-space direction="vertical" fill>
            <a-row class="section-title">基本信息</a-row>
            <a-row class="section-body" :gutter="2">
              <a-col :span="8">
                <a-form-item field="name" label="名称" :row-props="{ gutter: 8 }">
                  <a-input :max-length="50" v-model="formData.name" placeholder="请输入名称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="eventTypeId" label="巡检事件" :row-props="{ gutter: 8 }">
                  <a-select placeholder="请输入巡检事件" v-model="formData.eventTypeId">
                    <a-option :label="'垃圾桶满溢'" :value="'38f98b07-cd6a-48a6-a0f4-24c418d5491e'"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="timeRange" label="计划执行时间" :row-props="{ gutter: 8 }">
                  <a-range-picker value-format="timestamp" format="YYYY-MM-DD" v-model="formData.timeRange" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
          <a-space direction="vertical" fill>
            <a-row class="section-title">截图配置</a-row>
            <a-row class="section-body" :gutter="2">
              <a-col :span="8">
                <a-form-item field="cycle" label="截图周期" :row-props="{ gutter: 8 }">
                  <a-time-picker v-model="formData.cycle" format="HH" type="time-range" disable-confirm />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="interval" label="截图间隔" :row-props="{ gutter: 8 }">
                  <a-select v-model="formData.interval" placeholder="请选择" :options="formData.unit === 0 ? minutesArray : hoursArray"> </a-select>
                  <a-select v-model="formData.unit">
                    <a-option label="分钟/次" :value="0"></a-option>
                    <a-option label="小时/次" :value="1"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="count" label="每次截图张数" :row-props="{ gutter: 8 }">
                  <a-input-number v-model="formData.count" placeholder="请输入截图张数 (1-5)" :min="1" :max="5" />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-if="formData.count > 1">
                <a-form-item field="picCycle" label="每张图间隔(s)" :row-props="{ gutter: 8 }">
                  <a-input-number v-model="formData.picCycle" :defaultValue="10" placeholder="请输入间隔时间 (5s-59s)" :min="5" :max="59" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
          <a-space direction="vertical" fill>
            <a-row class="section-title">选择设备</a-row>
            <a-row class="section-body" :gutter="2" v-if="model != 'view'">
              <a-col :span="8">
                <a-form-item label="空间筛选" :row-props="{ gutter: 8 }">
                  <a-select v-model="selectSpaceId" placeholder="请选择空间">
                    <a-option value="都会二期">都会二期</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="16"></a-col>
              <a-col :span="16">
                <a-form-item label="设备选择" :row-props="{ gutter: 8 }" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 20 }">
                  <a-transfer :title="['未选择的', '已选择的']" :data="transferData" v-model="formData.watcherIds" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="section-body" :gutter="2" v-else>
              <a-col :span="21">
                <a-form-item label="设备列表" :row-props="{ gutter: 8 }" :label-col-props="{ span: 3 }" :wrapper-col-props="{ span: 21 }">
                  <a-space>
                    <DeviceCard v-for="(watcher, index) in watchers" :key="index" :watcherData="watcher" />
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
          <a-row :gutter="24" v-if="model != 'view'">
            <a-col :span="8">
              <a-form-item>
                <a-space>
                  <a-button html-type="submit" type="primary" @click="clickSave">保存</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import DeviceCard from "./components/DeviceCard.vue";
import { DetailModel } from "@/types";
import { Message, Modal } from "@arco-design/web-vue";
import PatroPlan from "@/api/edge/patrolPlan";
import Watcher from "@/api/edge/watcher";
import Input from "@/api/edge/input";

function useTheRouter() {
  const router = useRouter();
  const showBackModal = ref(false);
  onBeforeRouteLeave(async () => {
    if (showBackModal.value) {
      try {
        await new Promise<void>((resolve, reject) => {
          Modal.warning({
            title: "提示",
            content: "信息未保存，确定退出编辑？",
            closable: true,
            cancelText: "取消",
            hideCancel: false,
            onOk: () => {
              resolve();
            },
            onCancel: () => {
              reject();
            },
          });
        });
        return true;
      } catch (e) {
        console.log("cancel");
        return false;
      }
    } else {
      return true;
    }
  });
  const goBack = () => {
    router.go(-1);
  };
  const route = useRoute();
  const goEdit = () => {
    console.log("go edit");
    router.replace({
      name: "EditPatrolPlan",
      params: {
        id: route.params.id,
      },
    });
  };
  const patrolPlanId = route.params.id;
  return {
    showBackModal,
    patrolPlanId,
    goBack,
    goEdit,
  };
}

function useModel() {
  const route = useRoute();
  const model = ref<DetailModel>(route.meta.model as DetailModel);
  console.log("model", model.value);
  const title = computed(() => {
    switch (model.value) {
      case "add":
        return "添加";
      case "edit":
        return "编辑";
      case "view":
        return "详情";
      default:
        return "";
    }
  });
  return {
    model,
    title,
  };
}

export default defineComponent({
  name: "DetailPatrolPlan",
  components: {
    Breadcrumb,
    DeviceCard,
  },
  setup() {
    const { showBackModal, goBack, goEdit, patrolPlanId } = useTheRouter();
    const { model, title } = useModel();
    const selectSpaceId = ref("");
    function useForm() {
      const formData = ref<any>({});
      const watchers = reactive<any[]>([]);
      const transferData = computed(() => {
        return watchers.map((item) => {
          return {
            value: item.uuid,
            label: item.name,
          };
        });
      });
      const doWatchFormData = () => {
        watch(formData, () => {
          showBackModal.value = true;
        });
      };
      const handleSubmit = (data: any) => {
        console.log(data);
      };
      if (model.value === "edit" || model.value === "view") {
        PatroPlan.findById(patrolPlanId as string).then((res) => {
          console.log("res", res);
          formData.value = res;
          formData.value.timeRange = [res.scheduConfig.startTime, res.scheduConfig.stopTime];
          formData.value.eventTypeId = res.event_type_id;
          const cron = res.scheduConfig.triggerCrons[0];
          const m: string = cron.split(" ")[1];
          const h: string = cron.split(" ")[2];
          let unit, interval;
          let cycle: String[];
          if (m.split("/").length > 1) {
            unit = 0;
            interval = Number(m.split("/")[1]);
            cycle = [h.split("-")[0] + ":00", Number(h.split("-")[1]) + 1 + ":00"];
          } else {
            unit = 1;
            const hh = h.split("/");
            interval = Number(hh[1]);
            cycle = [hh[0].split("-")[0] + ":00", Number(hh[0].split("-")[1]) + 1 + ":00"];
          }
          formData.value.cycle = cycle;
          formData.value.interval = interval;
          formData.value.unit = unit;
          formData.value.count = res.scheduConfig.period;
          formData.value.picCycle = Number(res.scheduConfig.periodTime / 1000);
          selectSpaceId.value = "都会二期";
          if (model.value === "view") {
            formData.value.watcherIds.map((watcherid: string, index: number) => {
              Watcher.findById(watcherid).then((res: any) => {
                Input.findById(res.inputConfig[0].inputId).then((inputRes) => {
                  watchers.push({ ...res, inputRes });
                });
              });
            });
          } else {
            Watcher.page(1, 1000).then((res: any) => {
              res.data.forEach((item: any) => {
                watchers.push(item);
              });
            });
          }
          doWatchFormData();
        });
      } else {
        Watcher.page(1, 1000).then((res: any) => {
          res.data.forEach((item: any) => {
            watchers.push(item);
          });
        });
      }
      const clickSave = () => {
        let cron = "";
        if (formData.value.unit === 0) {
          cron = `0 0/${formData.value.interval} ${Number(formData.value.cycle[0].split(":")[0])}-${
            Number(formData.value.cycle[1].split(":")[0]) - 1
          } * * ? *`;
        } else {
          cron = `0 0 ${Number(formData.value.cycle[0].split(":")[0])}-${Number(formData.value.cycle[1].split(":")[0]) - 1}/${
            formData.value.interval
          } * * ? *`;
        }
        if (model.value === "edit") {
          PatroPlan.update({
            uuid: formData.value.uuid,
            name: formData.value.name,
            status: 0,
            space_id: formData.value.space_id,
            json_data: {},
            outputType: "pic",
            watcherIds: formData.value.watcherIds,
            event_type_id: formData.value.eventTypeId,
            judgeType: formData.value.judgeType,
            bind_user_uuid: formData.value.bind_user_uuid,
            scheduConfig: {
              period: formData.value.count,
              periodTime: Number(formData.value.picCycle) * 1000,
              startTime: formData.value.timeRange[0],
              stopTime: formData.value.timeRange[1],
              triggerCrons: [cron],
            },
            eventConfigId: "",
            storageConfig: {
              transferType: "LOCAL",
            },
          }).then(() => {
            Message.success("操作成功!");
            goBack();
          });
        } else {
          PatroPlan.add({
            name: formData.value.name,
            status: 0,
            space_id: formData.value.space_id,
            json_data: {},
            outputType: "pic",
            watcherIds: formData.value.watcherIds,
            event_type_id: formData.value.eventTypeId,
            judgeType: formData.value.judgeType,
            bind_user_uuid: formData.value.bind_user_uuid,
            scheduConfig: {
              period: formData.value.count,
              periodTime: Number(formData.value.picCycle) * 1000,
              startTime: formData.value.timeRange[0],
              stopTime: formData.value.timeRange[1],
              triggerCrons: [cron],
            },
            eventConfigId: "",
            storageConfig: {
              transferType: "LOCAL",
            },
          }).then(() => {
            Message.success("操作成功!");
            goBack();
          });
        }
      };
      return {
        formData,
        watchers,
        transferData,
        clickSave,
        handleSubmit,
      };
    }
    const { formData, watchers, transferData, clickSave, handleSubmit } = useForm();
    const hoursArray = Array(...Array(23)).map((k, i) => i + 1);
    const minutesArray = Array(...Array(59)).map((k, i) => i + 1);
    return {
      model,
      title,
      formData,
      hoursArray,
      minutesArray,
      selectSpaceId,
      watchers,
      transferData,
      goBack,
      goEdit,
      clickSave,
      handleSubmit,
    };
  },
});
</script>

<style lang="less" scoped>
.detail-patrol-plan {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
    padding-top: 8px;
  }
  :deep(.arco-transfer) {
    width: 100%;
    justify-content: space-between;
  }
  :deep(.arco-transfer-view) {
    width: calc(40% - 6px);
  }
}
</style>
