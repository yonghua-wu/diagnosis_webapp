<template>
  <div class="login-view">
    <div class="box">
      <div class="logo"><img :src="require('@/assets/siliu_SEEINGFLOW_Blue.svg')" alt="" /></div>
      <div class="form">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" title="密码登录">
            <a-form :model="formData" class="login-form">
              <a-form-item label="账 号" field="account" :validate-status="validate.account.status" :help="validate.account.help">
                <a-input :max-length="50" v-model="formData.account" placeholder="请输入账号" allow-clear></a-input>
              </a-form-item>
              <a-form-item label="密 码" field="password" :validate-status="validate.password.status" :help="validate.password.help">
                <a-input-password
                  :max-length="18"
                  v-model="formData.password"
                  placeholder="请输入密码"
                  @keydown.enter="clickLoginByPassword"
                  allow-clear
                ></a-input-password>
              </a-form-item>
              <a-form-item>
                <div style="width: 100%">
                  <a-button long type="primary" @click="clickLoginByPassword" :loading="loading">登 录</a-button>
                  <a-link style="margin-top: 8px" @click="$router.push({ name: 'ForgetPassword' })">忘记密码</a-link>
                </div>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="2" title="验证码登录">
            <a-form :model="formData" class="login-form">
              <a-form-item label="手机号" field="phone" :validate-status="validate.phone.status" :help="validate.phone.help">
                <a-input :max-length="22" v-model="formData.phone" placeholder="请输入账号" allow-clear></a-input>
              </a-form-item>
              <a-form-item label="验证码" field="code" :validate-status="validate.code.status" :help="validate.code.help">
                <a-input :max-length="6" placeholder="请输入验证码" v-model="formData.code" @keydown.enter="clickLoginByCode" allow-clear>
                  <template #append>
                    <a-button type="text" :disabled="countdownTime ? true : false" @click="clickGetCode">
                      <span>发送验证码</span>
                      <span v-if="countdownTime">({{ countdownTime }}s)</span>
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button long type="primary" @click="clickLoginByCode" :loading="loading">登 录</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Auth from "@/api/tenant/Auth";
import Message from "@/utils/Message";
export default defineComponent({
  name: "LoginView",
  setup() {
    const formData = reactive({
      account: "",
      password: "",
      phone: "",
      code: "",
    });
    const validate = reactive<Record<string, { status: "error" | "success" | "warning" | "validating" | undefined; help: string }>>({
      account: {
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
    const route = useRoute();
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

    const clickLoginByPassword = () => {
      if (formData.account === "") {
        validate.account.status = "error";
        validate.account.help = "请输入账号";
        return;
      } else if (formData.password === "") {
        validate.password.status = "error";
        validate.password.help = "请输入密码";
        return;
      } else if (formData.password.length < 6) {
        validate.password.status = "error";
        validate.password.help = "密码长度不能小于6位";
        return;
      } else {
        validate.password.status = undefined;
        validate.account.status = undefined;
        validate.password.help = "";
        validate.account.help = "";
      }
      loading.value = true;
      Auth.login(formData.account, formData.password)
        .then(() => {
          if (route.query.redirect && !/403$/.test(route.query?.redirect as string)) {
            router.push(route.query.redirect as string);
          } else {
            router.push({ name: "root" });
          }
        })
        .catch((err) => {
          console.log(err);
          // Message.error(err.msg || "登录失败");
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const clickLoginByCode = () => {
      if (formData.phone === "") {
        validate.phone.status = "error";
        validate.phone.help = "请输入手机号";
        return;
      } else if (formData.code === "") {
        validate.code.status = "error";
        validate.code.help = "请输入验证码";
        return;
      } else if (formData.code.length !== 6) {
        validate.code.status = "error";
        validate.code.help = "验证码长度必须是6位";
        return;
      }
      loading.value = true;
      Auth.loginByCode(formData.phone, formData.code)
        .then(() => {
          if (route.query.redirect) {
            router.push(route.query.redirect as string);
          } else {
            router.push({ name: "root" });
          }
        })
        .catch((err) => {
          console.log(err);
          // Message.error(err.msg || "登录失败");
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      formData,
      loading,
      countdownTime,
      validate,
      clickGetCode,
      clickLoginByPassword,
      clickLoginByCode,
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
  background-color: rgb(var(--primary-6));
  .box {
    box-sizing: border-box;
    width: 900px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-bg-1);
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
        margin-top: 50px;
        // margin-right: 24px;
        height: 100%;
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
