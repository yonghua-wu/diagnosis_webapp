<template>
  <div class="add-employess container">
    <Breadcrumb :items="['系统管理', { name: '权限配置', router: () => $router.replace({ name: 'PermissionConfiguration2' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <SfForm ref="refSfForm" :model="formData" :formModel="pageModel" :disabled="pageModel === 'View'">
          <SfFormItem field="parentId" :rules="rules.parentId" label="父级权限">
            <a-tree-select
              :loading="loadingTree"
              allow-clear
              :max-length="50"
              v-model="formData.parentId"
              :data="parentPermissionTree"
              placeholder="留空则为顶级权限"
            />
          </SfFormItem>
          <SfFormItem field="name" :rules="rules.name" label="名称">
            <a-input :max-length="50" v-model="formData.name" placeholder="请输入名称" />
          </SfFormItem>
          <SfFormItem field="code" :rules="rules.code" label="编码 Code">
            <a-input :max-length="50" v-model="formData.code" placeholder="请输入编码" />
          </SfFormItem>
          <SfFormItem field="type" :rules="rules.type" label="类型">
            <a-select @change="changeType" v-model="formData.type" :options="PERMISSION_TYPE_LIST" placeholder="请选择类型"></a-select>
          </SfFormItem>
          <SfFormItem field="url" :rules="rules.url" label="资源路径">
            <a-input :max-length="50" v-model="formData.url" placeholder="请输入资源路径" />
          </SfFormItem>
          <SfFormItem field="remark" :rules="rules.remark" label="备注">
            <a-input :max-length="50" v-model="formData.remark" placeholder="请输入备注" />
          </SfFormItem>
          <SfFormItem :colProps="{ span: 24 }" v-if="pageModel !== 'View'">
            <a-button @click="onSave" type="primary" :loading="buttonLoading">保存</a-button>
            <a-checkbox v-if="pageModel === 'Add'" :disabled="formData.type === 'BUTTON'" v-model="isCreateSubPerm"
              >同时创建增删改查按钮权限</a-checkbox
            >
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import Permission, { CreatePermissionModel } from "@/api/tenant/Permission";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import Message from "@/utils/Message";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { useDetail, useRouterManager } from "@/components/lib/CU/CU";
import { useDictStore } from "@/store";
import { computed } from "@vue/reactivity";
import { listToTree } from "@/utils/utils";
import { PERMISSION_TYPE } from "@/store/modules/dict/types";

export default defineComponent({
  name: "DetailEmployess",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
  },
  setup() {
    const dictStore = useDictStore();
    const PERMISSION_TYPE_LIST = computed(() => {
      return dictStore.PERMISSION_TYPE_LIST;
    });
    const route = useRoute();
    const formData = ref<CreatePermissionModel>({
      parentId: route.query?.parentId ? (route.query.parentId as string) : "",
      //资源code
      code: "",
      //资源图标
      icon: "",
      //资源名称
      name: "",
      //备注
      remark: "",
      //资源类型：MENU，BUTTON
      type: "MENU",
      //资源路径
      url: "",
    });
    const isCreateSubPerm = ref(false);

    const rules = {
      parentId: new RulesLib().done(),
      name: new RulesLib().required("请输入名称").done(),
      code: new RulesLib().required("请输入编码").done(),
      type: new RulesLib()
        .required("请选择类型")
        .validator((value: keyof typeof dictStore.PERMISSION_TYPE, cb) => {
          if (value === "BUTTON" && formData.value.parentId === "") {
            cb("设置按钮权限必须同时设置父级权限");
          } else {
            cb();
          }
        })
        .done(),
      url: new RulesLib().done(),
      remark: new RulesLib().done(),
    };

    const showModalTips = ref(false);

    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });

    const { pageModel, pageModelName } = useDetailPage();

    const loading = ref(false);
    const parentPermissionTree = ref<any[]>([]);
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      const p = [];
      p.push(
        Permission.detail(route.params.id as string).then((res) => {
          formData.value = res;
          nextTick(startWatch);
        }),
      );
      Promise.all(p).finally(() => {
        loading.value = false;
      });
    };
    const loadingTree = ref(true);
    Permission.getAll()
      .then((res) => {
        parentPermissionTree.value = listToTree(
          res
            .filter((item) => item.type === "MENU")
            .map((item) => {
              return {
                key: item.id,
                data: item,
                parentId: item.parentId,
                title: item.name,
              };
            }),
          "parentId",
          "key",
          "children",
        );
      })
      .finally(() => {
        loadingTree.value = false;
      });
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

    const changeType = (v: keyof typeof PERMISSION_TYPE) => {
      if (v === "BUTTON") {
        isCreateSubPerm.value = false;
      }
    };

    const refSfForm = ref();
    const { buttonLoading, save } = useDetail(refSfForm, Permission);
    const { goBack } = useRouterManager();
    const onSave = () => {
      save(formData.value).then((res) => {
        let p: any = Promise.resolve();
        if (isCreateSubPerm.value && pageModel.value === "Add") {
          // 需要自动生成crud权限
          [
            { code: "create", name: "创建" },
            { code: "view", name: "查看" },
            { code: "update", name: "更新" },
            { code: "delete", name: "删除" },
          ].map((item) => {
            p = p.then(() =>
              Permission.create({
                parentId: res,
                code: formData.value.code + "_" + item.code,
                name: formData.value.name + "_" + item.name,
                type: "BUTTON",
                remark: formData.value.name + "_" + item.name,
                icon: "",
                url: "",
              }).then(() => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve("");
                  }, 200);
                });
              }),
            );
          });
        }
        buttonLoading.value = true;
        p.finally(() => {
          goBack("PermissionConfiguration2");
          buttonLoading.value = false;
        });
      });
    };
    return {
      refSfForm,
      rules,
      loading,
      buttonLoading,
      pageModelName,
      pageModel,
      formData,
      showModalTips,
      PERMISSION_TYPE_LIST,
      parentPermissionTree,
      isCreateSubPerm,
      loadingTree,
      changeType,
      onSave,
    };
  },
});
</script>

<style lang="less" scoped>
.add-employess {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
