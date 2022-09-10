<template>
  <div class="routing-management-detail container">
    <Breadcrumb
      :items="['综合巡逻', { name: '巡逻路线', router: () => $router.replace({ name: 'SyntheticalRoutingConfiguration' }) }, pageModelName]"
    />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <a-form
          ref="refForm"
          :model="formData"
          :disabled="pageModel === 'View'"
          style="width: 500px"
          :label-col-props="{ span: 8 }"
          :wrapper-col-props="{ span: 16 }"
        >
          <a-form-item :rules="rules.routeName" field="routeName" label="巡逻路线名称">
            <a-input v-model="formData.routeName" :max-length="50" placeholder="请输入巡逻路线名称" />
          </a-form-item>
          <a-form-item :rules="rules.serviceClass" field="serviceClass" label="业务">
            <a-select v-model="formData.serviceClass" placeholder="请选择业务">
              <a-option
                :label="serviceClassMap[key].label"
                :value="Number(key)"
                :key="index"
                v-for="(key, index) in Object.keys(serviceClassMap)"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item :rules="rules.addRouteSpots" :validate-trigger="['input']" field="addRouteSpots" label="巡逻地点">
            <div class="route-spots">
              <div class="route-item" v-for="(place, index) in formData.addRouteSpots" :key="index">
                <span class="place-name">{{ place.placeName }}</span>
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
            <PlaceSelect
              ref="refPlaceSelect"
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
import PatrolRoute, { CreatePatrolRouteModel, UpdatePatrolRouteModel } from "@/api/tenant/PatrolRoute";
import PlaceSelect from "@/components/lib/PlaceSelect/index.vue";
import { deepClone } from "@/utils/utils";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import { useDictStore } from "@/store";
import { DictModel } from "@/api/tenant/Dict";
import { SERVICE_CLASS_CUSTOMER, SERVICE_CLASS_SAFETY, SERVICE_CLASS_VALUE_MAP } from "@/store/modules/dict/types";

export default defineComponent({
  name: "routing-management-detail",
  components: {
    Breadcrumb,
    CUVue,
    PlaceSelect,
  },
  setup() {
    const router = useRouter();
    const createLoading = ref(false);
    const dictStore = useDictStore();
    const serviceClassMap = computed<Record<DictModel["value"], DictModel>>(() => {
      return {
        [SERVICE_CLASS_VALUE_MAP[SERVICE_CLASS_SAFETY]]: dictStore.getServiceClassItemBySymb(SERVICE_CLASS_SAFETY),
        [SERVICE_CLASS_VALUE_MAP[SERVICE_CLASS_CUSTOMER]]: dictStore.getServiceClassItemBySymb(SERVICE_CLASS_CUSTOMER),
      };
    });
    const formData = ref<any>({
      routeName: "",
      addRouteSpots: [],
      serviceClass: 1,
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
      PatrolRoute.detail(route.params.id as string)
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
      const submitData: CreatePatrolRouteModel = {
        addRouteSpots: formData.value.addRouteSpots.map((v: any, i: number) => {
          return { placeName: v.placeName, placeId: v.placeId, placeOrder: i };
        }),
        deleteRouteSpots: [],
        serviceClass: formData.value.serviceClass,
        routeName: formData.value.routeName,
      };
      console.log("submitData", submitData);
      createLoading.value = true;
      return PatrolRoute.create(submitData)
        .then(() => {
          router.push({ name: "SyntheticalRoutingConfiguration" });
        })
        .finally(() => {
          createLoading.value = false;
        });
    };
    const updateData = () => {
      const submitData: UpdatePatrolRouteModel = {
        id: formData.value.id,
        addRouteSpots: formData.value.addRouteSpots.map((v: any, i: number) => {
          return { placeName: v.placeName, placeId: v.placeId, placeOrder: i };
        }),
        deleteRouteSpots: formData.value.deleteRouteSpots,
        serviceClass: formData.value.serviceClass,
        routeName: formData.value.routeName,
      };
      console.log("submitData", submitData);
      return PatrolRoute.update(submitData)
        .then(() => {
          router.push({ name: "SyntheticalRoutingConfiguration" });
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
          if (pageModel.value === "Edit") {
            return updateData();
          } else {
            return createData();
          }
        }
      });
    };
    const refPlaceSelect = ref();
    const clickAddRouteSpots = () => {
      refPlaceSelect.value.clickInput();
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
      refPlaceSelect,
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
.routing-management-detail {
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
      height: 30px;
      padding: 0px 8px;
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
