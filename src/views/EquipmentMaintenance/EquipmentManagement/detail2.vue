<template>
  <div class="device-detail container">
    <Breadcrumb :items="['设备维护', { name: '设备管理', router: () => $router.replace({ name: 'EquipmentManagement' }) }, '设备']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm ref="refForm" :model="formData" :formModel="pageModel">
          <div class="section-title">基本信息</div>
          <SfFormItem :rules="rules.name" field="name" label="设备名称">
            <a-input :max-length="50" v-model="formData.name" placeholder="请输入设备名称" />
            <template #view>{{ formData.name }}</template>
          </SfFormItem>
          <SfFormItem :rules="rules.categoryId" field="categoryId" label="设备类型">
            <a-select v-model="formData.categoryId" allow-create :options="deviceCateList" placeholder="请选择设备类型" />
            <template #view>{{ deviceCateMap?.get(formData.categoryId)?.name }}</template>
          </SfFormItem>
          <SfFormItem :rules="rules.placeId" :validate-trigger="'input'" field="placeId" label="设备位置">
            <PlaceSelect v-model="formData.placeId" :placeholder="'请选择设备位置'" />
          </SfFormItem>
          <SfFormItem :rules="rules.deviceStatus" field="deviceStatus" label="设备状态">
            <a-select v-model="formData.deviceStatus" placeholder="请选择设备状态">
              <a-option label="未安装" :value="1"></a-option>
              <a-option label="已安装" :value="2"></a-option>
              <a-option v-if="pageModel === 'Edit'" label="使用（正常）" :value="3"></a-option>
              <a-option v-if="pageModel === 'Edit'" label="使用（异常）" :value="4"></a-option>
              <a-option v-if="pageModel === 'Edit'" label="停用" :value="5"></a-option>
            </a-select>
            <template #view>{{ DEVICE_STATUS_MAP[formData.deviceStatus as keyof typeof DEVICE_STATUS_MAP] }}</template>
          </SfFormItem>
          <SfFormItem field="title" label="监控状态" v-if="pageModel === 'View'"> <!-- {{ formData.title }} -->123 </SfFormItem>
          <SfFormItem :rules="rules.snCode" field="snCode" label="SN编码">
            <a-input :max-length="50" v-model="formData.snCode" placeholder="请输入设备SN编码" />
            <template #view>{{ formData.snCode }}</template>
          </SfFormItem>
          <SfFormItem :rules="rules.attributeList" field="attributeList" label="设备属性">
            <div style="width: 100%">
              <a-input-group style="width: 100%" v-for="(attr, index) in formData.attributeList" :key="index">
                <a-input :max-length="50" v-model="attr.name" placeholder="属性名" />
                <a-input :max-length="50" v-model="attr.value" placeholder="属性值" />
                <a-button type="text" status="danger" @click="() => clickDelAttr(index)">删除</a-button>
              </a-input-group>
              <a-button type="text" @click="clickAddAttr">添加</a-button>
            </div>
            <template #view>
              <div style="width: 100%; margin-top: 6px" v-if="formData.attributeList.length > 0">
                <a-descriptions
                  :data="
                    formData.attributeList.map((a: any) => {
                      return { label: a.name, value: a.value };
                    })
                  "
                  :column="1"
                />
              </div>
              <div v-else>暂无</div>
            </template>
          </SfFormItem>
          <SfFormItem label="设备二维码" v-if="pageModel === 'View'">
            <a-image v-if="formData.qrImg" :src="formData.qrImg" width="32px" style="cursor: pointer"></a-image>
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" v-if="pageModel !== 'View'">
            <a-space>
              <a-button type="primary" @click="clickSave" :loading="buttonLoading">保存</a-button>
            </a-space>
          </SfFormItem>
        </SfForm>
        <template v-if="pageModel === 'View'">
          <a-row class="section-body" style="width: 100%">
            <PlanTableVue v-if="formData.placeId" :place-id="formData.placeId" />
          </a-row>
          <a-row class="section-body" style="width: 100%">
            <LogTableVue v-if="formData.deviceId" :device-id="formData.deviceId" />
          </a-row>
        </template>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

import LogTableVue from "./components/LogTable.vue";
import PlanTableVue from "./components/PlanTable.vue";

import CUVue, { useDetailPage } from "@/components/lib/CU";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import Device, { CreateDeviceModel, DeviceCateModel } from "@/api/tenant/Device";
import PlaceSelect from "@/components/lib/PlaceSelect/index.vue";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import SfForm from "@/components/lib/SfForm/SfForm";
import SfFormItem from "@/components/lib/SfForm/SfFormItem";
import { listObjToMap } from "@/utils/utils";
import { useDictStore } from "@/store";

const deviceStatusMap: any = {
  1: "未安装",
  2: "已安装",
  3: "使用（正常）",
  4: "使用（异常）",
  5: "停用",
};

export default defineComponent({
  name: "device-detail",
  components: {
    Breadcrumb,
    CUVue,
    PlaceSelect,
    LogTableVue,
    PlanTableVue,
    SfForm,
    SfFormItem,
  },
  setup() {
    const dictStore = useDictStore();
    const loading = ref(false);
    const buttonLoading = ref(false);
    const formData = ref<any>({
      //
      placeId: "",
      name: "",
      snCode: "",
      categoryId: null,
      categoryName: "",
      deviceStatus: null,
      attributeList: [],
    });
    const rules = {
      name: new RulesLib().required("请输入设备名称").done(),
      categoryId: new RulesLib().required("请选择设备类型").done(),
      placeId: new RulesLib().done(),
      snCode: new RulesLib().required("请输入设备SN编码").done(),
      deviceStatus: new RulesLib().required("请选择设备状态").done(),
      attributeList: new RulesLib()
        .validator((attr: any, cb: (err?: string) => void) => {
          if (attr.length === 0) {
            cb();
          } else {
            for (let i = 0; i < attr.length; i++) {
              if (!attr[i].name) {
                cb("请输入属性名称");
                return;
              } else if (!attr[i].value) {
                cb("请输入属性值");
                return;
              }
            }
            cb();
          }
        })
        .done(),
    };
    const showModalTips = ref(false);
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });

    const deviceCateList = ref<any[]>([]);
    const deviceCateMap = ref<Map<string, DeviceCateModel>>();
    Device.getAllCate().then((res) => {
      deviceCateList.value = res.map((c) => {
        return {
          ...c,
          label: c.name,
          value: c.categoryId,
        };
      });
      deviceCateMap.value = listObjToMap(deviceCateList.value, "value");
    });

    const { pageModel, pageModelName } = useDetailPage();

    const route = useRoute();
    const router = useRouter();
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      console.warn("route.params.id", route.params.id);
      // debugger;
      // console.warn("")
      Device.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          formData.value.name = res.deviceName;
          formData.value.attributeList = res.attributes.map((a: any) => {
            return {
              id: a.id,
              name: a.key,
              value: a.value,
            };
          });
          nextTick(startWatch);
        })
        .finally(() => {
          loading.value = false;
        });
      // Notice.detail(route.params.id as string)
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

    const createData = () => {
      if (typeof formData.value.categoryId !== "number") {
        // Device.createCate({ name: formData.value.categoryId });
        formData.value.categoryName = formData.value.categoryId;
        formData.value.categoryId = null;
      }
      const submitData: CreateDeviceModel = {
        attributes: formData.value.attributeList.map((a: any) => {
          return {
            key: a.name,
            value: a.value,
          };
        }),
        brandId: "",
        categoryId: formData.value.categoryId,
        categoryName: formData.value.categoryName,
        description: "",
        deviceName: formData.value.name,
        placeId: formData.value.placeId,
        deviceStatus: formData.value.deviceStatus,
      };
      buttonLoading.value = true;
      console.log("submitData", submitData);
      Device.create(submitData)
        .then(() => {
          router.push({ name: "EquipmentManagement" });
        })
        .finally(() => {
          buttonLoading.value = false;
        });
    };
    const updateData = () => {
      if (typeof formData.value.categoryId !== "number") {
        // Device.createCate({ name: formData.value.categoryId });
        formData.value.categoryName = formData.value.categoryId;
        formData.value.categoryId = null;
      }
      const submitData: any = {
        attributes: formData.value.attributeList.map((a: any) => {
          return {
            id: a.id,
            key: a.name,
            value: a.value,
          };
        }),
        brandId: "",
        categoryId: formData.value.categoryId,
        categoryName: formData.value.categoryName,
        description: "",
        deviceName: formData.value.name,
        placeId: formData.value.placeId,
        deviceStatus: formData.value.deviceStatus,
        deviceId: formData.value.deviceId,
      };
      buttonLoading.value = true;
      console.log("submitData", submitData);
      Device.update(submitData)
        .then(() => {
          router.push({ name: "EquipmentManagement" });
        })
        .finally(() => {
          buttonLoading.value = false;
        });
    };
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
    const clickAddAttr = () => {
      formData.value.attributeList.push({
        name: "",
        value: "",
      });
    };
    const clickDelAttr = (index: number) => {
      formData.value.attributeList.splice(index, 1);
    };
    return {
      rules,
      refForm,
      deviceStatusMap,
      deviceCateList,
      buttonLoading,
      clickSave,
      clickAddAttr,
      clickDelAttr,
      pageModel,
      pageModelName,
      loading,
      showModalTips,
      formData,
      DEVICE_STATUS_MAP: dictStore.DEVICE_STATUS_MAP,
      deviceCateMap,
    };
  },
});
</script>

<style lang="less" scoped>
.device-detail {
  :deep(.section-title) {
    width: 100%;
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
