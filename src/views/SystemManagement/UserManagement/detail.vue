<template>
  <div class="user-detail container">
    <Breadcrumb :items="['系统管理', { name: '用户管理', router: () => $router.replace({ name: 'UserManagement' }) }, pageModelName]" />
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
                  <a-form-item :rules="rules.realName" field="realName" label="姓名" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.realName" placeholder="请输入姓名" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.username" field="username" label="登录账号" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.username" placeholder="请设置登录账号" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.empNo" field="empNo" label="工号" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.empNo" placeholder="请输入工号" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :rules="rules.userPhone" field="userPhone" label="联系方式" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.userPhone" placeholder="请输入联系方式" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="status" label="状态" :row-props="{ gutter: 24 }" :disabled="pageModel !== 'Edit'">
                    <a-select
                      v-model="formData.status"
                      placeholder="请选择状态"
                      :options="[
                        { label: '激活', value: 1 },
                        { label: '停用', value: 2 },
                      ]"
                    ></a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill>
              <a-row class="section-title">工作信息</a-row>
              <a-row class="section-body" :gutter="24">
                <a-col :span="8">
                  <a-form-item :rules="rules.roleIds" field="roleIds" label="角色" :row-props="{ gutter: 24 }">
                    <a-select v-model="formData.roleIds" multiple placeholder="请选择角色（可多选）">
                      <a-option v-for="(p, index) in roleList" :label="p.name" :value="p.id" :key="index"></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="8">
                  <a-form-item :rules="rules.status" field="status" label="状态" :row-props="{ gutter: 24 }">
                    <a-select v-model="formData.status" placeholder="请选择状态"></a-select>
                  </a-form-item>
                </a-col> -->
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
import User, { CreateUserModel } from "@/api/tenant/User";
import Role, { RoleModel } from "@/api/tenant/Role";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import Message from "@/utils/Message";
import { deepClone, generatorAvator } from "@/utils/utils";
import TencentCos from "@/utils/tencentCos";
import COS from "cos-js-sdk-v5";

export default defineComponent({
  name: "user-detail",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const tencentCos = new TencentCos();
    const formData = ref<any>({
      deptName: "",
      empNo: "",
      realName: "",
      remark: "",
      roleIds: [],
      userEmail: "",
      userIcon: "",
      userPhone: "",
      username: "",
      status: 1,
    });
    const rules = {
      realName: new RulesLib().required("请输入姓名").maxLength(50).minLength(2).done(),
      gender: new RulesLib().required("请选择性别").done(),
      username: new RulesLib().required("请输入登录账号").done(),
      empNo: new RulesLib()
        .required("请输入工号")
        .match(/^[a-z0-9A-Z]+$/, "工号只能由数字和字母组成")
        .done(),
      userPhone: new RulesLib().required("请输入手机号").length(11).done(),
      roleIds: new RulesLib().required("请选择角色").done(),
    };
    const showModalTips = ref(false);
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const route = useRoute();
    const router = useRouter();
    const { pageModel, pageModelName } = useDetailPage();
    const loading = ref(false);
    const detailInfo = ref<any>({});
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      User.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          detailInfo.value = deepClone(res);
          formData.value.roleIds = res.roles.map((role: RoleModel) => role.id);
          delete formData.value.roles;
          nextTick(startWatch);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const roleList = ref<RoleModel[]>([]);
    Role.getAll().then((res) => {
      roleList.value = res;
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
    const buttonLoading = ref(false);
    const createData = () => {
      buttonLoading.value = true;
      // generatorAvator(formData.value.realName)
      //   .then((blob) => {
      //     if (blob) {
      //       return new Promise((resolve: (v: string) => void) => {
      //         tencentCos.upload(
      //           `${new Date().getTime()}_${Math.ceil(Math.random() * 10000)}.png`,
      //           blob,
      //           undefined,
      //           (err: COS.CosError, data: COS.PutObjectResult) => {
      //             if (err) {
      //               resolve("");
      //             } else {
      //               resolve("http://" + data.Location);
      //             }
      //           },
      //         );
      //       });
      //     } else {
      //       return Promise.resolve("");
      //     }
      //   })
      //   .then((avator) => {
      const submitData: CreateUserModel = {
        deptId: "",
        deptName: formData.value.deptName,
        empNo: formData.value.empNo,
        realName: formData.value.realName,
        remark: formData.value.remark,
        roleIds: formData.value.roleIds,
        userEmail: formData.value.userEmail,
        userPhone: formData.value.userPhone,
        username: formData.value.username,
        userIcon: "",
      };
      return User.create(submitData)
        .then(() => {
          router.push({ name: "UserManagement" });
        })
        .catch((err) => {
          if (err.code === 400 || err.code === 500) {
            Message.error(err.msg);
          }
        })
        .finally(() => {
          buttonLoading.value = false;
        });
      // })
    };
    const updateData = () => {
      buttonLoading.value = true;
      const submitData: any = {
        userId: formData.value.userId,
        status: formData.value.status,
        deptId: "",
        deptName: detailInfo.value.deptName === formData.value.deptName ? undefined : formData.value.deptName,
        empNo: detailInfo.value.empNo === formData.value.empNo ? undefined : formData.value.empNo,
        realName: detailInfo.value.realName === formData.value.realName ? undefined : formData.value.realName,
        remark: detailInfo.value.remark === formData.value.remark ? undefined : formData.value.remark,
        roleIds: detailInfo.value.roleIds === formData.value.roleIds ? undefined : formData.value.roleIds,
        userEmail: detailInfo.value.userEmail === formData.value.userEmail ? undefined : formData.value.userEmail,
        userIcon: detailInfo.value.userIcon === formData.value.userIcon ? undefined : formData.value.userIcon,
        userPhone: detailInfo.value.userPhone === formData.value.userPhone ? undefined : formData.value.userPhone,
        username: detailInfo.value.username === formData.value.username ? undefined : formData.value.username,
      };
      User.update(submitData)
        .then(() => {
          router.push({ name: "UserManagement" });
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
      roleList,
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
.user-detail {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
