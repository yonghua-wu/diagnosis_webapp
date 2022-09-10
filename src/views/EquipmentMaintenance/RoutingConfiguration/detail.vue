<template>
  <div class="envmanagement-route-detail container">
    <Breadcrumb
      :items="['设备维护', { name: '巡检路线配置', router: () => $router.replace({ name: 'EquipmentRoutingConfiguration' }) }, pageModelName]"
    />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <a-form
          ref="refForm"
          :model="formData"
          :disabled="pageModel === 'View'"
          :label-col-props="{ span: 8 }"
          :wrapper-col-props="{ span: 16 }"
          style="width: 500px"
        >
          <a-form-item :rules="rules.routeName" field="routeName" label="巡检路线名称">
            <a-input :max-length="50" v-model="formData.routeName" placeholder="请输入巡检路线名称" />
          </a-form-item>
          <a-form-item :rules="rules.serviceClass" field="serviceClass" label="业务" :disabled="true">
            <a-select v-model="formData.serviceClass" placeholder="请选择业务">
              <a-option
                :label="serviceClassMap[key].label"
                :value="Number(key)"
                :key="index"
                v-for="(key, index) in Object.keys(serviceClassMap)"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item :rules="rules.addRouteSpots" :validate-trigger="['input']" field="addRouteSpots" label="巡检地点">
            <div class="route-spots">
              <div class="route-item" v-for="(place, index) in formData.addRouteSpots" :key="index">
                <span class="place-name">{{ place.placeName }}（{{ place.spotDevices.reduce((a, b) => a + (a && ", ") + b.deviceName, "") }}）</span>
                <div class="btns">
                  <a-button :disabled="index === 0" @click="() => routeSpotUp(index)" type="text" size="mini">
                    <template #icon>
                      <icon-up />
                    </template>
                  </a-button>
                  <a-button :disabled="index == formData.addRouteSpots.length - 1" @click="() => routeSpotDown(index)" type="text" size="mini">
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
            <DeviceSelectByPlace
              ref="refDeviceSelectByPlace"
              :modelValue="formData.addRouteSpots"
              @update:modelValue="updateAddRouteSpots"
              :multiple="true"
              :showInputArea="false"
            />
          </a-form-item>
          <a-form-item v-if="pageModel !== 'View'">
            <a-space>
              <a-button type="primary" @click="clickSave" :loading="createLoading">保存</a-button>
            </a-space>
          </a-form-item>
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
import MechanicalElectricalRoute, {
  CreateMechanicalElectricalRouteModel,
  UpdateMechanicalElectricalRouteModel,
} from "@/api/tenant/MechanicalElectricalRoute";
import DeviceSelectByPlace from "@/components/lib/DeviceSelectByPlace/index.vue";
import { deepClone } from "@/utils/utils";
import { useAppStore } from "@/store";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";

export default defineComponent({
  name: "envmanagement-route-detail",
  components: {
    Breadcrumb,
    CUVue,
    DeviceSelectByPlace,
  },
  setup() {
    const router = useRouter();
    const createLoading = ref(false);
    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const formData = ref<any>({
      routeName: "",
      addRouteSpots: [],
      serviceClass: 3,
      deleteRouteSpots: [],
    });
    const rules = {
      routeName: new RulesLib().required("请输入路线名称").done(),
      serviceClass: new RulesLib().required("请选择业务").done(),
      addRouteSpots: new RulesLib().required("请添加地点").done(),
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
      MechanicalElectricalRoute.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          formData.value.addRouteSpots = res.routeSpots;
          formData.value.deleteRouteSpots = deepClone(res.routeSpots);
          nextTick(startWatch);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const createData = () => {
      const submitData: CreateMechanicalElectricalRouteModel = {
        addRouteSpots: formData.value.addRouteSpots.map((p: any) => {
          return {
            placeId: p.placeId,
            placeName: p.placeName,
            placeOrder: p.placeOrder,
            addSpotDevices: p.spotDevices,
          };
        }),
        deleteRouteSpots: [],
        serviceClass: formData.value.serviceClass,
        routeName: formData.value.routeName,
      };
      console.log("submitData", submitData);
      createLoading.value = true;
      return MechanicalElectricalRoute.create(submitData)
        .then(() => {
          router.push({ name: "EquipmentRoutingConfiguration" });
        })
        .finally(() => {
          createLoading.value = false;
        });
    };
    const updateData = () => {
      const submitData: UpdateMechanicalElectricalRouteModel = {
        id: formData.value.id,
        addRouteSpots: formData.value.addRouteSpots.map((p: any) => {
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
        deleteRouteSpots: formData.value.deleteRouteSpots.map((p: any) => {
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
        serviceClass: formData.value.serviceClass,
        routeName: formData.value.routeName,
      };
      console.log("submitData", submitData);
      return MechanicalElectricalRoute.update(submitData)
        .then(() => {
          router.push({ name: "EquipmentRoutingConfiguration" });
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
      loading,
      pageModel,
      pageModelName,
      showModalTips,
      formData,
      createLoading,
      refDeviceSelectByPlace,
      routeSpotUp,
      routeSpotDown,
      routeSpotDel,
      serviceClassMap,
      updateAddRouteSpots,
      clickAddRouteSpots,
      clickSave,
    };
  },
});
</script>

<style lang="less" scoped>
.envmanagement-route-detail {
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
</style>
