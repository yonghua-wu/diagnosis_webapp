<template>
  <div class="employees-mamagement-detail container">
    <Breadcrumb :items="['组织管理', { name: '员工管理', router: () => $router.replace({ name: '' }) }, pageModelText]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm :model="formData" :label-width="130">
          <div style="width: 100%">基本信息</div>
          <SfFormItem :colProps="{ span: 24 }" field="avater" label="头像">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="姓名">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="证件类型">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="证件号码">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="性别">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="出生日期">
            {{ formData?.name }}
          </SfFormItem>
          <div style="width: 100%">工作信息</div>
          <SfFormItem field="name" label="工号">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="部门（岗位）">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="角色">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="手机号">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="直属上级">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="职称">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="入职日期">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="人员类型">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem field="name" label="状态">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem :colProps="{ span: 24 }" field="name" label="后台账号开关">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem :colProps="{ span: 24 }" extra="默认密码为123456，如此处留空，可使用手机号获取验证码登录。" field="name" label="后台账号">
            {{ formData?.name }}
          </SfFormItem>
          <SfFormItem :colProps="{ span: 24 }">
            <a-space>
              <a-button html-type="submit" type="primary">保存</a-button>
              <a-button @click="save" type="text" v-if="pageModel === 'Add'">保存并继续添加</a-button>
            </a-space>
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { useDetail, useDetailPageModel } from "@/components/lib/CU/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { useStartStopWatch } from "@/hooks/use";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import { Breadcrumb } from "@arco-design/web-vue";
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "employees-mamagement-detail",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
  },
  setup() {
    const loading = ref(false);
    const { pageModel, pageModelText } = useDetailPageModel();
    const route = useRoute();
    const detailInfo = ref<any>();
    const formData = ref<any>();
    const refForm = ref();
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
    };
    if (pageModel.value !== "Add") {
      loadData();
    }
    const showModalTips = ref(false);
    const { save, buttonLoading } = useDetail(refForm);
    return {
      buttonLoading,
      loading,
      showModalTips,
      pageModel,
      pageModelText,
      formData,
      save,
    };
  },
});
</script>

<style lang="less" scoped>
.employees-mamagement-detail {
}
</style>
