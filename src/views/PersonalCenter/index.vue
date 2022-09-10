<template>
  <div class="container">
    <Breadcrumb :items="['个人中心']" />
    <div class="info-board">
      <a-row class="grid-demo" justify="space-around">
        <a-col
          :span="7"
          :style="{ padding: '0', paddingTop: '40px', paddingBottom: '60px', display: 'flex', justifyContent: 'center' }"
          class="left-info-layout"
        >
          <div :style="{ width: '90%' }">
            <a-space direction="vertical" fill>
              <a-avatar :size="180">
                <img alt="avatar" :src="avatar || require('@/assets/avatar.svg')" />
              </a-avatar>
              <div class="name-style">{{ userInfo.realName }}</div>
              <div class="other-info-style">
                <span style="width: 60px">登录账号</span>
                : {{ userInfo.username }}
              </div>
              <div class="other-info-style">
                <span style="width: 60px">工号</span>
                : {{ userInfo.empNo }}
              </div>
              <div class="other-info-style">
                <span style="width: 60px">手机号</span>
                : {{ userInfo.userPhone }}
              </div>
              <!-- <div class="other-info-style">中国-广东省-深圳市-龙华区</div>
              <div class="other-info-style">乐于助人</div> -->
            </a-space>
          </div>
        </a-col>
        <a-col :span="16" :style="{ height: '571px' }">
          <a-form ref="formRef" :model="form" @submit="handleSubmit" layout="vertical">
            <a-form-item
              field="oldPw"
              label="旧密码"
              :validate-status="validate.oldPw.status"
              :help="validate.oldPw.help"
              :rules="[{ required: true, message: '请输入旧密码' }]"
            >
              <a-input-password :max-length="50" v-model="form.oldPw" placeholder="请输入旧密码" allow-clear />
            </a-form-item>
            <a-popover trigger="click" position="right" :style="{ width: '360px' }">
              <a-form-item
                field="newPw"
                label="输入新密码"
                :validate-status="validate.newPw.status"
                :help="validate.newPw.help"
                :rules="[{ required: true, message: '请输入新密码' }]"
              >
                <a-input-password :max-length="50" v-model="form.newPw" placeholder="请输入新密码" allow-clear />
              </a-form-item>
              <template #content>
                <div class="guidence-message">
                  <span>密码强度</span>
                  <a-progress :status="progressStatus" :percent="progress" :style="{ width: '70%', marginLeft: '10px' }" :steps="4">
                    <template v-slot:text="scope">
                      {{ scope.percent < 0.5 ? (scope.percent < 0.25 ? "弱" : "中") : scope.percent < 0.75 ? "强" : "极强" }}
                    </template>
                  </a-progress>
                </div>
                <div class="guidence-message">
                  <a-progress size="mini" type="circle" :status="condition1 == 1 ? 'success' : 'danger'" :percent="condition1" class="gap" />
                  <span>6~32个字符，区分大小写，前后无空格</span>
                </div>
                <div class="guidence-message">
                  <a-progress size="mini" type="circle" :status="condition2 == 1 ? 'success' : 'danger'" :percent="condition2" class="gap" />
                  <span>字母，数字及英文字符 ~!@#$%^&*()_+=-</span>
                </div>
                <div class="guidence-message">
                  <a-progress size="mini" type="circle" :status="condition3 == 1 ? 'success' : 'danger'" :percent="condition3" class="gap" />
                  <span>需包含字母、数字及特殊字符两种或以上组合</span>
                </div>
              </template>
            </a-popover>
            <a-form-item
              field="doubleNewPw"
              label="再次确认新密码"
              :validate-status="validate.doubleNewPw.status"
              :help="validate.doubleNewPw.help"
              :rules="[{ required: true, message: '请再次输入新密码' }]"
            >
              <a-input-password :max-length="50" v-model="form.doubleNewPw" placeholder="请再次输入新密码" allow-clear />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit">确认</a-button>
                <a-button type="outline" @click="cleanInput">取消</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import Breadcrumb from "@/components/Breadcrumb.vue";
import { defineComponent, reactive, ref, computed, watch } from "vue";
import { useAppStore } from "@/store";
import Auth from "@/api/tenant/Auth";
import Message from "@/utils/Message";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "personal-center",
  components: {
    Breadcrumb,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const progress = ref<number>(0);
    const condition1 = ref<number>(0);
    const condition2 = ref<number>(1);
    const condition3 = ref<number>(0);
    const progressStatus = computed(() => {
      if (progress.value < 0.25) {
        return "danger";
      } else if (progress.value < 0.5) {
        return "warning";
      } else if (progress.value < 0.75) {
        return "normal";
      }
      return "success";
    });
    const appStore = useAppStore();
    const layout = ref("horizontal");
    const form = reactive({
      oldPw: "",
      newPw: "",
      doubleNewPw: "",
    });
    const validate = reactive<Record<string, { status: "error" | "success" | "warning" | "validating" | undefined; help: string }>>({
      oldPw: {
        status: undefined,
        help: "",
      },
      newPw: {
        status: undefined,
        help: "",
      },
      doubleNewPw: {
        status: undefined,
        help: "",
      },
    });

    watch(form, (newValue) => {
      progress.value = 0;
      condition1.value = 0;
      condition3.value = 0;
      condition2.value = 1;

      //密码及前后空格长度
      if (newValue.newPw.length == 0) {
        progress.value = 0;
      } else if (newValue.newPw.length < 6 && newValue.newPw.length > 0) {
        progress.value += 0.05;
        condition1.value = 0;
      } else if (newValue.newPw.length <= 10) {
        progress.value += 0.1;
        if (newValue.newPw.charAt(0) == " " || newValue.newPw.charAt(newValue.newPw.length - 1) == " ") {
          condition1.value = 0;
        } else {
          condition1.value = 1;
        }
      } else if (newValue.newPw.length <= 32) {
        progress.value += 0.25;
        if (newValue.newPw.charAt(0) == " " || newValue.newPw.charAt(newValue.newPw.length - 1) == " ") {
          condition1.value = 0;
        } else {
          condition1.value = 1;
        }
      } else {
        progress.value += 0.25;
        condition1.value = 0;
      }

      //大小写强度
      const reg1 = new RegExp(/[a-z]/g);
      const reg2 = new RegExp(/[A-Z]/g);
      const lowerCharAmount = newValue.newPw.match(reg1)?.length || 0;
      const upperCharAmount = newValue.newPw.match(reg2)?.length || 0;
      if (newValue.newPw.match(reg1) && newValue.newPw.match(reg2)) {
        progress.value += 0.2;
      } else if (newValue.newPw.match(reg1) || newValue.newPw.match(reg2)) {
        progress.value += 0.1;
      }

      //数字强度
      const reg3 = new RegExp(/[0-9]/g);
      const numAmount = newValue.newPw.match(reg3)?.length || 0;
      if (numAmount && numAmount >= 1 && numAmount < 3) {
        progress.value += 0.1;
      } else if (numAmount && numAmount >= 3) {
        progress.value += 0.2;
      }

      //特殊字符强度
      const reg4 = new RegExp(/[~!@#$%^&*()_+=-]/g);
      const specialCharAmount = newValue.newPw.match(reg4)?.length || 0;
      if (specialCharAmount && specialCharAmount == 1) {
        progress.value += 0.1;
      } else if (specialCharAmount && specialCharAmount > 1) {
        progress.value += 0.25;
      }

      // 字符 数字 大写字母 小写字母
      if (specialCharAmount && numAmount && lowerCharAmount && upperCharAmount) {
        progress.value += 0.05;
        condition3.value = 1;
      } else if (specialCharAmount && numAmount && (lowerCharAmount || upperCharAmount)) {
        // 字符 数字 字母
        progress.value += 0.03;
        condition3.value = 1;
      } else if (specialCharAmount && numAmount) {
        // 字符 数字
        condition3.value = 1;
      } else if (specialCharAmount && (upperCharAmount || lowerCharAmount)) {
        // 字符 字母
        condition3.value = 1;
      } else if (numAmount && (upperCharAmount || lowerCharAmount)) {
        // 字母 数字
        condition3.value = 1;
      }

      if (specialCharAmount + numAmount + lowerCharAmount + upperCharAmount != newValue.newPw.length) {
        condition2.value = 0;
      } else {
        condition2.value = 1;
      }
    });

    const handleSubmit = () => {
      if (form.oldPw === "") {
        validate.oldPw.status = "error";
        validate.oldPw.help = "请输入旧密码";
      } else if (form.oldPw.length < 6 || form.oldPw.length > 32) {
        validate.oldPw.status = "error";
        validate.oldPw.help = "密码字符应为6~32个字符";
      } else if (form.newPw === "") {
        validate.newPw.status = "error";
        validate.newPw.help = "请输入新密码";
      } else if (condition1.value != 1 || condition2.value != 1 || condition3.value != 1) {
        validate.newPw.status = "error";
        validate.newPw.help = "新密码未达到输入要求";
      } else if (form.oldPw === form.newPw) {
        validate.newPw.status = "error";
        validate.newPw.help = "旧密码和新密码不能相同";
      } else if (form.doubleNewPw === "") {
        validate.doubleNewPw.status = "error";
        validate.doubleNewPw.help = "请再次输入新密码";
      } else if (form.newPw !== form.doubleNewPw) {
        validate.doubleNewPw.status = "error";
        validate.doubleNewPw.help = "两次输入的新密码不相同";
      } else {
        validate.oldPw.status = undefined;
        validate.oldPw.help = "";
        validate.newPw.status = undefined;
        validate.newPw.help = "";
        validate.doubleNewPw.status = undefined;
        validate.doubleNewPw.help = "";
        loading.value = true;
        Auth.activeResetPassword(form.newPw, form.oldPw, userInfo.value.userId)
          .then(() => {
            Message.success("密码修改成功");
            Auth.logout()
              .then(() => {
                router.push({
                  name: "Login",
                });
              })
              .finally(() => {
                close();
              });
          })
          .catch((err) => {
            Message.error(err.msg);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    };

    const cleanInput = () => {
      form.oldPw = "";
      form.newPw = "";
      form.doubleNewPw = "";
    };

    const avatar = computed(() => {
      return (appStore.userInfo as any)?.userIcon;
    });
    const userInfo = computed(() => {
      console.log(appStore.userInfo);
      return appStore.userInfo as any;
    });

    return {
      form,
      layout,
      handleSubmit,
      cleanInput,
      avatar,
      validate,
      progress,
      progressStatus,
      userInfo,
      condition1,
      condition2,
      condition3,
    };
  },
});
</script>

<style lang="less" scoped>
.grid-demo {
  margin-top: 10px;
  margin-bottom: 40px;
}

.grid-demo .arco-col {
  line-height: 48px;
  text-align: center;
  display: flex;
  padding-left: 20px;
  padding-top: 40px;
}

.arco-form-item {
  width: 30%;
}

.info-board {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-2);
  border: 1px solid var(--color-border-2);
}

.left-info-layout {
  display: flex;
}

.name-style {
  color: var(--color-text-1);
  font-size: 26px;
  letter-spacing: 6px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.other-info-style {
  color: var(--color-text-1);
  border-bottom: 1px solid var(--color-border-2);
  line-height: 32px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 24px;
}

.guidence-message {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  .gap {
    margin-right: 8px;
  }
}
</style>
