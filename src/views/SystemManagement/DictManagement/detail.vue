<template>
  <div class="dict-detail container">
    <Breadcrumb :items="['系统管理', { name: '字典管理', router: () => $router.replace({ name: 'DictManagement' }) }, pageModelText]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm
          ref="refForm"
          :model="formData"
          :formModel="pageModel"
          @submit="save"
          style="max-width: 500px"
          :label-width="130"
          :disabled="pageModel === 'View'"
        >
          <SfFormItem :col-props="{ span: 24 }" field="showLabel" label="显示名称" :rules="rules.showLabel">
            <a-input :max-length="50" v-model="formData.showLabel" placeholder="请输入显示名称" />
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="label" label="默认名称" :rules="rules.label">
            <a-input :max-length="50" v-model="formData.label" placeholder="默认名称" />
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="code" label="类型 (CODE)" :rules="rules.code">
            <a-select v-model="formData.code" placeholder="请选择类型 (CODE)">
              <a-option :label="k + ' (' + name + ')'" :value="k" v-for="(name, k) in DICT_CODE" :key="k"></a-option>
            </a-select>
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="value" label="值" :rules="rules.value">
            <a-input :max-length="50" v-model="formData.value" placeholder="请输入值" />
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="seq" label="排序" :rules="rules.seq">
            <a-input-number v-model="formData.seq" placeholder="请设置排序" />
          </SfFormItem>
          <SfFormItem
            :col-props="{ span: 24 }"
            field="deleteStatus"
            label="可否删除"
            :rules="rules.deleteStatus"
            :disabled="pageModel === 'Edit' && detailData.deleteStatus === 2"
          >
            <a-select
              v-model="formData.deleteStatus"
              :options="[
                { label: '可删除', value: 1 },
                { label: '不可删除', value: 2 },
              ]"
              placeholder="可否删除"
            />
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" field="remark" label="备注">
            <a-input :max-length="50" v-model="formData.remark" placeholder="请输入备注" />
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" v-if="pageModel !== 'View'">
            <a-space>
              <a-button html-type="submit" type="primary" :loading="buttonLoading">保存</a-button>
              <!-- <a-button html-type="submit" type="text" v-if="pageModel !== 'Edit'">保存并继续添加</a-button> -->
            </a-space>
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import { DICT_CODE } from "@/hooks/dict";
import Dict from "@/api/tenant/Dict";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import RulesLib from "@/utils/RulesLib";
import { useDetail, useDetailPageModel } from "@/components/lib/CU/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { deepClone } from "@/utils/utils";
export default defineComponent({
  name: "dict-detail",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
  },
  setup() {
    const formData = ref<any>({
      showLabel: "",
      label: "",
      code: "",
      value: "",
      seq: 1,
      deleteStatus: 1,
      remark: "",
    });

    const rules = {
      showLabel: new RulesLib().required("请输入显示名称").done(),
      label: new RulesLib().required("请输入默认名称").done(),
      code: new RulesLib().required("请选择类型 (CODE)").done(),
      value: new RulesLib().required("请输入值").done(),
      seq: new RulesLib().done(),
      deleteStatus: new RulesLib().required("请输入显示名称").done(),
      remark: new RulesLib().done(),
    };

    const showModalTips = ref(false);

    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });

    const route = useRoute();
    const router = useRouter();

    const { pageModel, pageModelText } = useDetailPageModel();
    const loading = ref(false);
    const detailData = ref();
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      Dict.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          detailData.value = deepClone(res);
          nextTick(startWatch);
        })
        .finally(() => {
          loading.value = false;
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
    const { buttonLoading, save } = useDetail(refForm, Dict);

    return {
      refForm,
      rules,
      loading,
      buttonLoading,
      pageModelText,
      pageModel,
      formData,
      showModalTips,
      DICT_CODE,
      detailData,
      save,
    };
  },
});
</script>

<style lang="less" scoped>
.dict-detail {
}
</style>
