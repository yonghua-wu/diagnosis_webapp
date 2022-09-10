<template>
  <div class="add-employess container">
    <Breadcrumb :items="['系统管理', { name: '权限配置', router: () => $router.replace({ name: 'PermissionConfiguration' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <a-form
          ref="refForm"
          :model="formData"
          @submit="clickSave"
          :label-col-props="{ span: 8 }"
          :wrapper-col-props="{ span: 16 }"
          :disabled="pageModel === 'View'"
          style="max-width: 1500px"
        >
          <a-space direction="vertical" fill>
            <a-space direction="vertical" fill>
              <a-row class="section-title">基本信息</a-row>
              <a-row class="section-body" :gutter="24">
                <a-col :span="8">
                  <a-form-item :rules="rules.name" field="name" label="名称" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.name" placeholder="请输入名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.code" field="code" label="编码 Code" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.code" placeholder="请设置 Code" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.type" field="type" label="类型" :row-props="{ gutter: 24 }">
                    <a-select v-model="formData.type" placeholder="请选择类型">
                      <a-option label="菜单" value="MENU"></a-option>
                      <a-option label="按钮" value="BUTTON"></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.url" field="url" label="资源路径" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.url" multiple placeholder="请输入资源路径"> </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.remark" field="remark" label="备注" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.remark" placeholder="请输入备注" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-row :gutter="24" v-if="pageModel != 'View'">
              <a-col :span="8">
                <a-form-item>
                  <a-space>
                    <a-button html-type="submit" type="primary" :loading="buttonLoading">保存</a-button>
                    <!-- <a-button html-type="submit" type="text" v-if="pageModel !== 'edit'">保存并继续添加</a-button> -->
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
        </a-form>
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

export default defineComponent({
  name: "DetailEmployess",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const formData = ref<any>({
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

    const rules = {
      name: new RulesLib().required("请输入名称").done(),
      code: new RulesLib().required("请输入编码").done(),
      type: new RulesLib().required("请选择类型").done(),
      url: new RulesLib().done(),
      remark: new RulesLib().done(),
    };

    const showModalTips = ref(false);

    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const route = useRoute();
    const router = useRouter();

    const { pageModel, pageModelName } = useDetailPage();
    const loading = ref(false);
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      Permission.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
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

    const buttonLoading = ref(false);

    const createData = () => {
      console.log("create formData", formData.value);
      const submitData: CreatePermissionModel = {
        //资源code
        code: formData.value.code,
        //资源图标
        icon: formData.value.icon,
        //资源名称
        name: formData.value.name,
        //备注
        remark: formData.value.remark,
        //资源类型：MENU，BUTTON
        type: formData.value.type,
        //资源路径
        url: formData.value.url,
      };
      buttonLoading.value = true;
      Permission.create(submitData)
        .then(() => {
          router.push({ name: "PermissionConfiguration" });
        })
        .catch((err) => {
          if (err.code === 400 || err.code === 500) {
            Message.error(err.msg);
          }
        })
        .finally(() => {
          buttonLoading.value = false;
        });
    };
    const updateData = () => {
      buttonLoading.value = true;
      console.log("update formData", formData.value);
      Permission.update(formData.value)
        .then(() => {
          router.push({ name: "PermissionConfiguration" });
        })
        .catch((err) => {
          if (err.code === 400 || err.code === 500) {
            Message.error(err.msg);
          }
        })
        .finally(() => {
          buttonLoading.value = false;
        });
    };
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

    return {
      refForm,
      rules,
      loading,
      buttonLoading,
      pageModelName,
      pageModel,
      formData,
      createData,
      updateData,
      showModalTips,
      clickSave,
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
