<template>
  <div class="user-detail container">
    <Breadcrumb :items="['模型管理', '详情']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm ref="refForm" :model="formData" :formModel="pageModel" :rules="rules">
          <SfFormItem field="name" label="模型名称">
            <a-input :max-length="50" v-model="formData.name" placeholder="请输入模型名称" />
            <template #view>{{ formData.name }}</template>
          </SfFormItem>
          <SfFormItem field="modelAddress" label="模型地址">
            <a-input :max-length="50" v-model="formData.modelAddress" placeholder="请输入模型地址" />
            <template #view>{{ formData.modelAddress }}</template>
          </SfFormItem>
          <SfFormItem :col-props="{ span: 24 }" v-if="pageModel !== 'View'">
            <a-button @click="save" type="primary">保存</a-button>
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import User, { UserModel } from "@/api/diagnosis/User";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { useStartStopWatch } from "@/hooks/use";
import Message from "@/utils/Message";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Model, { ModelModel } from "@/api/diagnosis/Model";
export default defineComponent({
  name: "user-detail",
  components: {
    CUVue,
    SfForm,
    SfFormItem,
    Breadcrumb,
  },
  setup() {
    const loading = ref(false);
    const formData = ref({
      name: "",
      modelAddress: "",
    });
    const rules = {
      name: new RulesLib().required("请输入模型名称").max(50, "模型名称最多50个字符").done(),
      modelAddress: new RulesLib().required("请输入模型地址").done(),
    };
    const showModalTips = ref(false);
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const { pageModel, pageModelName } = useDetailPage();
    const route = useRoute();
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      Model.detail(route.params.id as unknown as number)
        .then((res) => {
          console.log(res);
          formData.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    if (pageModel.value !== "Add") {
      loadData();
    }
    const router = useRouter();
    const update = () => {
      loading.value = true;
      Model.update(formData.value as unknown as ModelModel)
        .then((res) => {
          Message.success("修改成功");
          router.go(-1);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const create = () => {
      loading.value = true;
      Model.create(formData.value as unknown as ModelModel)
        .then((res) => {
          router.go(-1);
          Message.success("新增成功");
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const refForm = ref();
    const save = () => {
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          if (pageModel.value === "Add") {
            create();
          } else {
            update();
          }
        }
      });
    };
    return {
      loading,
      showModalTips,
      formData,
      pageModel,
      pageModelName,
      rules,
      refForm,
      save,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-detail {
}
</style>
