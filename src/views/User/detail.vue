<template>
  <div class="user-detail container">
    <Breadcrumb :items="['用户管理', '详情']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm ref="refForm" :model="formData" :formModel="pageModel" :rules="rules">
          <SfFormItem field="realName" label="用户姓名">
            <a-input :max-length="50" v-model="formData.realName" placeholder="请输入用户姓名" />
            <template #view>{{ formData.realName }}</template>
          </SfFormItem>
          <SfFormItem field="gender" label="性别">
            <a-select v-model="formData.gender">
              <a-option :value="1">男</a-option>
              <a-option :value="2">女</a-option>
            </a-select>
            <template #view>{{ formData.realName }}</template>
          </SfFormItem>
          <SfFormItem field="workExperience" label="工作年限">
            <a-input-number :max-length="50" v-model="formData.workExperience" placeholder="请输入工作年限" />
            <template #view>{{ formData.workExperience }}</template>
          </SfFormItem>
          <SfFormItem field="title" label="职称">
            <a-select v-model="formData.title" placeholder="请选择职称">
              <!-- 职称 1 初级职称 (医士、医师/住院医师)、2 中级职称 (主治医师)、3 副高级职称 (副主任医师)、4 正高级职称 (主任医师) -->
              <a-option :value="1">初级职称</a-option>
              <a-option :value="2">中级职称</a-option>
              <a-option :value="3">副高级职称</a-option>
              <a-option :value="4">正高级职称</a-option>
            </a-select>
            <template #view>{{ formData.title }}</template>
          </SfFormItem>
          <SfFormItem field="username" label="登录账号">
            <a-input :max-length="50" v-model="formData.username" placeholder="请输入登录账号" />
            <template #view>{{ formData.username }}</template>
          </SfFormItem>
          <SfFormItem field="password" label="设置密码" v-if="pageModel === 'Add'">
            <a-input type="password" :max-length="50" v-model="formData.password" placeholder="请输入设置密码" />
            <template #view>{{ formData.password }}</template>
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
import Breadcrumb from "@/components/Breadcrumb.vue";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ValidatedError } from "@arco-design/web-vue";
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
      username: "",
      password: "",
      gender: 1,
      workExperience: 1,
      title: 1,
      realName: "",
    });
    const rules = {
      realName: new RulesLib().required("请输入用户姓名").done(),
      gender: new RulesLib().required("请选择性别").done(),
      workExperience: new RulesLib().required("请输入工作年限").done(),
      title: new RulesLib().required("请输入职称").done(),
      username: new RulesLib().required("请输入登录账号").done(),
      password: new RulesLib().required("请输入设置密码").done(),
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
      User.detail(route.params.id as string)
        .then((res) => {
          console.log(res);
          formData.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const router = useRouter();
    const update = () => {
      loading.value = true;
      User.update(formData.value as unknown as UserModel)
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
      User.create(formData.value as unknown as UserModel)
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
    loadData();
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
