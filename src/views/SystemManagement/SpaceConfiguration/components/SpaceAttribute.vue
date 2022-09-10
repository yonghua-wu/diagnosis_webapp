<template>
  <div class="space-attribute">
    <a-form :model="formData" @submit="handleSubmit" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" :disabled="model === 'view'">
      <!-- <a-space direction="vertical" fill> -->
      <!-- <a-space direction="vertical" fill> -->
      <!-- <a-row class="section-title">基本信息</a-row> -->
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
            <a-input :max-length="50" v-model="formData.contact" placeholder="请输入联系方式" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="entryDate" label="入职时间" :row-props="{ gutter: 24 }">
            <a-date-picker v-model="formData.entryDate" placeholder="请选择入职时间" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="model != 'view'">
        <a-col :span="8">
          <a-form-item>
            <a-space>
              <a-button html-type="submit" type="primary">保存</a-button>
              <!-- <a-button html-type="submit" type="text" v-if="model !== 'edit'">保存并继续添加</a-button> -->
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
export default defineComponent({
  name: "space-attribute",
  setup() {
    //
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
        // showBackModal.value = true;
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
      formData,
      handleSubmit,
    };
  },
});
</script>

<style lang="less" scoped>
.space-attribute {
}
</style>
