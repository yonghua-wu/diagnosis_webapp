<template>
  <div class="permission-setting">
    <!-- TODO: 权限配置后退的路由名称 -->
    <Breadcrumb :item="['组织管理', { name: '角色管理', router: () => $router.replace('') }, '权限配置']" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="false">
        <SfForm :model="roleData">
          <SfFormItem field="name" label="角色名称">
            {{ roleData.name }}
          </SfFormItem>
        </SfForm>
        <a-space>
          <a-card title="权限组">
            <a-checkbox-group direction="vertical" :options="permissionGroupList" v-model="permissionSelected" />
          </a-card>
          <a-card title="权限配置">
            <template #extra>
              <a-button type="primary" @click="onSave" :loading="buttonLoading">保存</a-button>
            </template>
            <PermissionTree />
          </a-card>
        </a-space>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue from "@/components/lib/CU";
import { useStartStopWatch } from "@/hooks/use";
import { useRouterManager } from "@/components/lib/CU/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import PermissionTree from "@/components/PermissionTree/index.vue";
import { CheckboxOption } from "@arco-design/web-vue";
export default defineComponent({
  name: "permission-setting",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
    PermissionTree,
  },
  setup() {
    const loading = ref(false);
    const showModalTips = ref(false);
    const permissionSelected = ref<any>();
    const permissionGroupList = ref<CheckboxOption[]>([]);
    const { startWatch, stopWatch } = useStartStopWatch(permissionSelected, () => {
      showModalTips.value = true;
    });
    const roleData = ref<any>();
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      // TODO: 请求角色数据
    };
    loadData();
    const { goBack } = useRouterManager();
    const buttonLoading = ref(false);
    const onSave = () => {
      //
      // TODO: 保存角色的权限配置
      goBack("");
    };
    return {
      buttonLoading,
      permissionSelected,
      permissionGroupList,
      roleData,
      loading,
      onSave,
    };
  },
});
</script>

<style lang="less" scoped>
.permission-setting {
}
</style>
