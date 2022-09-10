<template>
  <div class="process-detail container">
    <Breadcrumb :items="['工单管理', { name: '工作步骤', router: () => $router.replace({ name: 'WorkSteps' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <a-form :model="formData" :disabled="pageModel === 'View'" style="width: 500px">
          <a-form-item field="name" label="步骤名称">
            <a-input :max-length="50" v-model="formData.name" placeholder="请输入步骤名称" />
          </a-form-item>
          <a-form-item v-for="(post, index) of formData.steps" :field="`steps.${index}.value`" :label="`步骤 ${index + 1}`" :key="index">
            <a-input :max-length="50" v-model="post.value" placeholder="请输入步骤描述" />
            <a-button @click="handleDelete(index)" :style="{ marginLeft: '10px' }">删除</a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              添加步骤
            </a-button>
          </a-form-item>
          <a-form-item v-if="pageModel !== 'View'">
            <a-button type="primary" @click="clickSave">保存</a-button>
          </a-form-item>
        </a-form>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue, { useDetailPage } from "@/components/lib/CU";
// import { useStartStopWatch } from "@/hooks/use";
export default defineComponent({
  name: "process-detail",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const showModalTips = ref(false);

    const formData = ref<any>({
      steps: [],
    });
    // const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
    //   showModalTips.value = true;
    // });

    const handleAdd = () => {
      formData.value.steps.push({
        value: "",
      });
    };
    const handleDelete = (index: number) => {
      formData.value.steps.splice(index, 1);
    };

    const { pageModel, pageModelName } = useDetailPage();
    const loading = ref(false);
    // const loadData = () => {
    //   //
    // };

    const clickSave = () => {
      //
    };
    return {
      loading,
      pageModel,
      pageModelName,
      formData,
      showModalTips,
      clickSave,
      handleAdd,
      handleDelete,
    };
  },
});
</script>

<style lang="scss" scoped>
.process-detail {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
