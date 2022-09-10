<template>
  <div class="department-mamagement-detail container">
    <Breadcrumb :items="['组织管理', { name: '部门管理', router: () => $router.replace({ name: '' }) }, pageModelText]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm :model="formData" :label-width="130" :form-model="pageModel" :disabled="pageModel === 'View'">
          <SfFormItem field="name" label="部门名称">
            <a-input></a-input>
          </SfFormItem>
          <SfFormItem field="name" label="上级部门"> 123 </SfFormItem>
          <SfFormItem field="name" label="部门负责人"> 123 </SfFormItem>
          <SfFormItem field="name" label="默认角色"> 123 </SfFormItem>
          <SfFormItem field="name" label="创建部门群"> 123 </SfFormItem>
          <SfFormItem field="name" label="部门群名称"> 123 </SfFormItem>
          <SfFormItem field="name" label="部门群主"> 123 </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue from "@/components/lib/CU";
import { useDetail, useDetailPageModel } from "@/components/lib/CU/CU";
import { useRoute } from "vue-router";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { useStartStopWatch } from "@/hooks/use";
export default defineComponent({
  name: "department-mamagement-detail",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
  },
  setup() {
    const { pageModel, pageModelText } = useDetailPageModel();
    const loading = ref(false);
    const route = useRoute();
    const detailInfo = ref<any>();
    const formData = ref<any>();
    const showModalTips = ref(false);

    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      const deptId = route.query.id as string;
      // TODO: 加载部门详情
    };
    loadData();
    const refForm = ref();
    const { save, buttonLoading } = useDetail(refForm);
    return {
      buttonLoading,
      showModalTips,
      pageModel,
      pageModelText,
      loading,
      formData,
      save,
    };
  },
});
</script>

<style lang="less" scoped>
.department-mamagement-detail {
}
</style>
