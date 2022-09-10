<template>
  <div class="add-employess container">
    <Breadcrumb :items="['人员管理', { name: '用户管理', router: () => $router.go(-1) }, title]" />
    <a-card>
      <template #title>
        <a-button shape="circle" type="text" @click="goBack">
          <icon-left />
        </a-button>
        <span> {{ title }} </span>
      </template>
      <template #extra>
        <a-button type="primary" @click="goEdit" v-if="model === 'view'"> <icon-edit /> 编辑 </a-button>
      </template>
      <a-form :model="formData" @submit="handleSubmit" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" :disabled="model === 'view'">
        <a-space direction="vertical" fill>
          <a-space direction="vertical" fill>
            <a-row class="section-title">基本信息</a-row>
            <a-row class="section-body" :gutter="24">
              <a-col :span="8">
                <a-form-item field="realName" label="姓名" :row-props="{ gutter: 24 }">
                  <a-input :max-length="50" v-model="formData.realName" placeholder="请输入姓名" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="gender" label="性别" :row-props="{ gutter: 24 }">
                  <a-select v-model="formData.gender" placeholder="请选择性别">
                    <a-option :value="0" label="女" />
                    <a-option :value="1" label="男" />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="birthdate" label="出生年月" :row-props="{ gutter: 24 }">
                  <a-date-picker v-model="formData.birthdate" placeholder="请选择出生年月" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="account" label="登录账号" :row-props="{ gutter: 24 }">
                  <a-input :max-length="50" v-model="formData.account" placeholder="请设置登录账号" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="workCode" label="工号" :row-props="{ gutter: 24 }">
                  <a-input :max-length="50" v-model="formData.workCode" placeholder="请输入工号" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contact" label="联系方式" :row-props="{ gutter: 24 }">
                  <a-input :max-length="11" v-model="formData.contact" placeholder="请输入联系方式" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="entryDate" label="入职时间" :row-props="{ gutter: 24 }">
                  <a-date-picker v-model="formData.entryDate" placeholder="请选择入职时间" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
          <a-space direction="vertical" fill>
            <a-row class="section-title">工作信息</a-row>
            <a-row class="section-body" :gutter="24">
              <a-col :span="8">
                <a-form-item field="departmentId" label="部门" :row-props="{ gutter: 24 }">
                  <a-select v-model="formData.departmentId" placeholder="请选择部门"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="ruleIds" label="角色" :row-props="{ gutter: 24 }">
                  <a-select v-model="formData.ruleIds" multiple placeholder="请选择角色（可多选）"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="higherUpId" label="直属上级" :row-props="{ gutter: 24 }">
                  <a-select v-model="formData.higherUpId" placeholder="请选择直属上级"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="employTypeId" label="人员类型" :row-props="{ gutter: 24 }">
                  <a-select v-model="formData.employTypeId" placeholder="请选择人员类型"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="positionId" label="职务" :row-props="{ gutter: 24 }">
                  <a-select v-model="formData.positionId" placeholder="请选择职务"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="状态" :row-props="{ gutter: 24 }">
                  <a-select v-model="formData.status" placeholder="请选择状态"></a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
          <a-row :gutter="24" v-if="model != 'view'">
            <a-col :span="8">
              <a-form-item>
                <a-space>
                  <a-button html-type="submit" type="primary">保存</a-button>
                  <a-button html-type="submit" type="text" v-if="model !== 'edit'">保存并继续添加</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import modal from "@arco-design/web-vue/es/modal";
import { DetailModel } from "@/types";

function useTheRouter() {
  const router = useRouter();
  const showBackModal = ref(false);
  onBeforeRouteLeave(async () => {
    if (showBackModal.value) {
      try {
        await new Promise<void>((resolve, reject) => {
          modal.warning({
            title: "提示",
            content: "信息未保存，确定退出编辑？",
            closable: true,
            cancelText: "取消",
            hideCancel: false,
            onOk: () => {
              resolve();
            },
            onCancel: () => {
              reject();
            },
          });
        });
        return true;
      } catch (e) {
        console.log("cancel");
        return false;
      }
    } else {
      return true;
    }
  });
  const goBack = () => {
    router.go(-1);
  };
  const goEdit = () => {
    console.log("go edit");
    router.replace({ name: "EditEmployees" });
  };
  return {
    showBackModal,
    goBack,
    goEdit,
  };
}

function useModel() {
  const route = useRoute();
  const model = ref<DetailModel>(route.meta.model as DetailModel);
  console.log("model", model.value);
  const title = computed(() => {
    switch (model.value) {
      case "add":
        return "添加";
      case "edit":
        return "编辑";
      case "view":
        return "详情";
      default:
        return "";
    }
  });
  return {
    model,
    title,
  };
}

export default defineComponent({
  name: "DetailEmployess",
  components: {
    Breadcrumb,
  },
  setup() {
    const { showBackModal, goBack, goEdit } = useTheRouter();
    const { model, title } = useModel();

    function useForm() {
      const formData = reactive({
        realName: "",
        gender: "",
        birthdate: "",
        account: "",
        workCode: "",
        contact: "",
        entryDate: "",
        departmentId: "",
        ruleIds: [],
        higherUpId: "",
        employType: "", // 雇佣类型
        position: "",
        status: "",
      });
      watch(formData, () => {
        showBackModal.value = true;
      });
      const handleSubmit = (data: any) => {
        console.log(data);
      };
      return {
        formData,
        handleSubmit,
      };
    }
    const { formData, handleSubmit } = useForm();
    return {
      model,
      title,
      formData,
      goBack,
      goEdit,
      handleSubmit,
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
