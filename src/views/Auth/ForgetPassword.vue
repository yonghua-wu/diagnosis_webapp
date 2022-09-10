<template>
  <div class="login-view">
    <div class="box">
      <div class="logo"><img :src="require('@/assets/siliu_SEEINGFLOW_Blue.svg')" alt="" /></div>
      <div class="form">
        <a-link @click="$router.push({ name: 'Login' })">
          <icon-left />
          返回登录
        </a-link>
        <a-form :model="formData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" class="login-form">
          <a-form-item label="手机号" :validate-status="validate.phone.status" :help="validate.phone.help" field="phone">
            <a-input v-model="formData.phone" placeholder="请输入手机号" allow-clear></a-input>
          </a-form-item>
          <a-form-item label="验证码" :validate-status="validate.code.status" :help="validate.code.help" field="code">
            <a-input placeholder="请输入验证码" v-model="formData.code" allow-clear>
              <template #append>
                <a-button type="text" :disabled="countdownTime ? true : false" @click="clickGetCode">
                  <span>发送验证码</span>
                  <span v-if="countdownTime">({{ countdownTime }}s)</span>
                </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="密 码" field="password" :validate-status="validate.password.status" :help="validate.password.help">
            <a-input-password v-model="formData.password" placeholder="请输入密码" allow-clear></a-input-password>
          </a-form-item>
          <a-form-item label="确认密码" field="password" :validate-status="validate.passwordAgain.status" :help="validate.passwordAgain.help">
            <a-input-password
              v-model="formData.passwordAgain"
              placeholder="请输入确认密码"
              @keydown.enter="clickResetPassword"
              allow-clear
            ></a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button long type="primary" @click="clickResetPassword" :loading="loading">修改密码</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Auth from "@/api/tenant/Auth";
import Message from "@/utils/Message";
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "LoginView",
  setup() {
    const formData = reactive({
      phone: "",
      code: "",
      password: "",
      passwordAgain: "",
    });
    const validate = reactive<Record<string, { status: "error" | "success" | "warning" | "validating" | undefined; help: string }>>({
      passwordAgain: {
        status: undefined,
        help: "",
      },
      password: {
        status: undefined,
        help: "",
      },
      phone: {
        status: undefined,
        help: "",
      },
      code: {
        status: undefined,
        help: "",
      },
    });
    const loading = ref(false);
    const router = useRouter();

    const countdownTime = ref(0);
    // 倒计时 60s
    const countDown = () => {
      countdownTime.value = 60;
      const timer = setInterval(() => {
        countdownTime.value--;
        if (countdownTime.value <= 0) {
          clearInterval(timer);
          return;
        }
      }, 1000);
    };

    const clickGetCode = () => {
      if (formData.phone.length !== 11 || !/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(formData.phone)) {
        validate.phone.status = "error";
        validate.phone.help = "请输入正确的手机号";
        return;
      } else {
        validate.phone.status = undefined;
        validate.phone.help = "";
      }
      Auth.getCode(formData.phone)
        .then(() => {
          Message.success("验证码发送成功");
          countDown();
        })
        .catch(() => {
          Message.error("验证码发送失败");
        });
    };

    const clickResetPassword = () => {
      console.log("formData", formData);
      validate.passwordAgain.status = undefined;
      validate.passwordAgain.help = "";
      validate.password.status = undefined;
      validate.password.help = "";
      validate.phone.status = undefined;
      validate.phone.help = "";
      validate.code.status = undefined;
      validate.code.help = "";
      if (formData.phone.length !== 11 || !/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(formData.phone)) {
        validate.phone.status = "error";
        validate.phone.help = "请输入正确的手机号";
        return;
      } else if (formData.code === "") {
        validate.code.status = "error";
        validate.code.help = "请输入验证码";
        return;
      } else if (formData.password.length < 6) {
        validate.password.status = "error";
        validate.password.help = "密码长度不能小于6位";
        return;
      } else if (formData.password !== formData.passwordAgain) {
        validate.password.status = "error";
        validate.passwordAgain.status = "error";
        validate.password.help = "两次输入的密码不一致";
        validate.passwordAgain.help = "两次输入的密码不一致";
        return;
      }
      Auth.resetPassword(formData.phone, formData.code, formData.passwordAgain)
        .then(() => {
          Message.success("修改密码成功");
          router.replace({ name: "Login" });
        })
        .catch((err) => {
          Message.error(err.msg);
        });
    };

    return {
      validate,
      formData,
      loading,
      countdownTime,
      clickGetCode,
      clickResetPassword,
    };
  },
});
</script>

<style lang="less" scoped>
.login-view {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #0065b1;
  .box {
    box-sizing: border-box;
    width: 900px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: var(--border-radius-large);
    display: flex;
    flex-direction: row;
    .logo {
      box-sizing: border-box;
      padding: 12px;
      padding-left: 24px;
      flex: 1;
      border-right: 1px solid var(--color-border-2);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      img {
        width: 40%;
      }
    }
    .form {
      box-sizing: border-box;
      padding: 12px;
      padding-right: 24px;
      flex: 1;
      .login-form {
        margin-top: 42px;
        // margin-right: 24px;
        // height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
@media screen and (max-width: 767px) {
  .login-view {
    .box {
      width: calc(100% - 20px);
      .logo {
        display: none;
      }
    }
  }
}
</style>
