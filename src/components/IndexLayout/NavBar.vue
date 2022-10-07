<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <icon-menu v-if="appStore.device === 'mobile'" style="font-size: 22px; cursor: pointer" @click="toggleDrawerMenu" />
        <!-- <div class="logo-img">
          <img alt="logo" :src="require('@/assets/siliu_SEEINGFLOW_Blue.svg')" />
        </div> -->
        <a-typography-title style="margin: 0; font-size: 18px; font-weight: bold; color: rgb(var(--primary-6))" :heading="5">
          AI 智诊
        </a-typography-title>
      </a-space>
    </div>
    <ul class="right-side">
      <!-- <li>
        <a-tooltip :content="$t('settings.search')">
          <a-button class="nav-btn" type="outline" :shape="'circle'">
            <template #icon>
              <icon-search />
            </template>
          </a-button>
        </a-tooltip>
      </li> -->
      <!-- <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setDropDownVisible">
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption v-for="item in locales" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li> -->
      <!-- <li>
        <a-select :options="blockOptions" v-model="block" :loading="blockLoading">
          <template #prefix>
            <icon-location />
          </template>
        </a-select>
      </li> -->
      <li>
        <a-tooltip :content="theme === 'light' ? '深色模式' : '亮色模式'">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="() => toggleTheme()">
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!-- <li>
        <a-tooltip content="消息通知">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setPopoverVisible">
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, minWidth: '400px' }"
          content-class="message-popover"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <a-doption>
              <a-space @click="$router.push({ name: 'info' })">
                <icon-user />
                <span> 占位 </span>
              </a-space>
            </a-doption>
          </template>
        </a-popover>
      </li> -->
      <!-- <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setVisible">
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li> -->
      <li>
        <a-dropdown trigger="click" :popup-style="{ height: 400 }" v-on:popup-visible-change="visibleChange" :popup-visible="popUpVisible">
          <a-avatar :size="32" :style="{ marginRight: '8px' }" style="cursor: pointer">
            <img alt="avatar" :src="avatar || require('@/assets/avatar.svg')" />
          </a-avatar>
          <template #content>
            <div class="user-card">
              <div class="user-info">
                <div class="base-info">
                  <a-avatar :size="64" :style="{ marginRight: '8px' }" style="width: 64px">
                    <img alt="avatar" :src="avatar || require('@/assets/avatar.svg')" />
                  </a-avatar>
                  <div class="user-name">{{ userInfo.realName }}</div>
                </div>
                <div class="info">
                  <div class="key">登录账号</div>
                  <div class="value">{{ userInfo.username }}</div>
                </div>
                <div class="info">
                  <div class="key">工号</div>
                  <div class="value">{{ userInfo.empNo }}</div>
                </div>
                <div class="info">
                  <div class="key">手机号</div>
                  <div class="value">{{ userInfo.userPhone }}</div>
                </div>
              </div>
              <div class="options">
                <a-button type="text" @click="enterPersonalCenter">
                  <template #icon>
                    <icon-user />
                  </template>
                  个人中心
                </a-button>
                <a-button type="text" @click="handleLogout">
                  <template #icon>
                    <icon-export />
                  </template>
                  退出登录
                </a-button>
              </div>
            </div>
            <!-- <a-doption>
              <a-space @click="switchRoles">
                <icon-tag />
                <span>
                  {{ $t("messageBox.switchRoles") }}
                </span>
              </a-space>
            </a-doption> -->
            <!-- <a-doption>
              <a-space @click="$router.push({ name: 'info' })">
                <icon-user />
                <span> 用户中心 </span>
              </a-space>
            </a-doption> -->
            <!-- <a-doption>
              <a-space @click="$router.push({ name: 'setting' })">
                <icon-settings />
                <span> 用户设置 </span>
              </a-space>
            </a-doption> -->
            <!-- <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span> 退出登录 </span>
              </a-space>
            </a-doption> -->
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject, watch } from "vue";
import Message from "@/utils/Message";
import { useDark, useEventBus, useToggle } from "@vueuse/core";
import { useAppStore, useUserStore } from "@/store";
import Auth from "@/api/tenant/Auth";
import { useRouter } from "vue-router";
import { useModalTips } from "@/hooks/use";
import Block from "@/api/tenant/Block";

export default defineComponent({
  name: "NavBarComponent",
  components: {
    // MessageBox,
  },
  setup() {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const router = useRouter();
    const avatar = computed(() => {
      return (appStore.userInfo as any)?.userIcon;
    });
    const userInfo = computed(() => {
      return appStore.userInfo as any;
    });
    const theme = computed(() => {
      return appStore.theme;
    });
    const isDark = useDark({
      selector: "body",
      attribute: "arco-theme",
      valueDark: "dark",
      valueLight: "light",
      storageKey: "arco-theme",
      onChanged(dark: boolean) {
        // overridded default behavior
        console.log(dark);
        appStore.toggleTheme(dark);
      },
    });
    const toggleTheme = useToggle(isDark);
    const setVisible = () => {
      appStore.updateSettings({ globalSettings: true });
    };
    const refBtn = ref();
    const triggerBtn = ref();
    const setPopoverVisible = () => {
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      refBtn.value.dispatchEvent(event);
    };

    const modalTips = useModalTips();

    const handleLogout = () => {
      modalTips({
        type: "warning",
        title: "提示",
        content: "确认退出登录？",
        onOk: () => {
          const { close } = Message.loading({
            content: "正在退出...",
            duration: 0,
          });
          Auth.logout()
            .then(() => {
              Message.success("退出登录成功");
              router.push({
                name: "Login",
              });
            })
            .finally(() => {
              close();
            });
        },
        onCancel: () => {
          //
        },
      });
    };

    const popUpVisible = ref(false);
    const enterPersonalCenter = () => {
      router.push({ name: "PersonalCenter" });
      popUpVisible.value = false;
    };
    const visibleChange = () => {
      if (popUpVisible?.value == true) {
        popUpVisible.value = false;
      } else if (popUpVisible?.value == false) {
        popUpVisible.value = true;
      }
    };

    const setDropDownVisible = () => {
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      triggerBtn.value.dispatchEvent(event);
    };
    const switchRoles = async () => {
      const res = await userStore.switchRoles();
      Message.success(res as string);
    };
    const toggleDrawerMenu = inject("toggleDrawerMenu");
    const blockOptions = ref<any>([]);
    const blockLoading = ref(true);
    const block = ref(localStorage.getItem("current_block") || userInfo.value.blockId);
    const blockEvent = useEventBus("BLOCK_SWITCH_EVENT");
    watch(block, () => {
      localStorage.setItem("current_block", block.value);
      blockEvent.emit("switch");
    });
    // Block.getAll()
    //   .then((res) => {
    //     blockOptions.value = res.map((item) => {
    //       return {
    //         label: item.name,
    //         value: item.blockId,
    //       };
    //     });
    //   })
    //   .finally(() => {
    //     blockLoading.value = false;
    //   });

    return {
      blockOptions,
      block,
      blockLoading,
      userInfo,
      appStore,
      // locales,
      theme,
      avatar,
      // changeLocale,
      toggleTheme,
      setVisible,
      setPopoverVisible,
      refBtn,
      triggerBtn,
      handleLogout,
      setDropDownVisible,
      switchRoles,
      toggleDrawerMenu,
      enterPersonalCenter,
      popUpVisible,
      visibleChange,
    };
  },
});
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
  .logo-img {
    // width: 220px;
    // padding-left: 8px;
    display: flex;
    flex-direction: row;
    // justify-content: center;
    align-items: center;
    img {
      width: 60px;
    }
  }
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;
  :deep(.locale-select) {
    border-radius: 20px;
  }
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }
  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }
  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }
  .trigger-btn {
    margin-left: 14px;
  }
}
.user-card {
  width: 254px;
  height: 200px;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .base-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 8px;
    .user-name {
      margin-left: 8px;
      color: var(--color-text-1);
    }
  }
  .info {
    height: 25px;
    line-height: 25px;
    margin-top: 4px;
    margin-left: 8px;
    display: flex;
    flex-direction: row;
    .key {
      width: 80px;
      color: var(--color-text-3);
      // text-align: right;
    }
    .value {
      color: var(--color-text-2);
    }
  }
  .options {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
