<template>
  <a-layout v-if="!loading" class="layout" :class="{ mobile: appStore.hideMenu }">
    <div class="layout-navbar">
      <NavBar />
    </div>
    <a-layout style="height: 100%">
      <a-layout style="height: 100%">
        <a-layout-sider
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbar ? '60px' : '' }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="menu-wrapper">
            <Menu />
          </div>
        </a-layout-sider>
        <a-drawer v-if="hideMenu" :visible="drawerVisible" placement="left" :footer="false" mask-closable :closable="false" @cancel="drawerCancel">
          <Menu />
        </a-drawer>
        <a-layout class="layout-content" :style="paddingStyle">
          <a-layout-content>
            <router-view v-if="updateContent" :key="$route.path" />
          </a-layout-content>
          <Footer v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
  <a-skeleton v-else :animation="true" class="layout skeleton" :class="{ mobile: appStore.hideMenu }">
    <div class="layout-navbar">
      <a-space>
        <a-skeleton-shape size="small" />
      </a-space>
      <a-space style="margin-right: 20px">
        <a-skeleton-shape size="small" shape="circle" style="margin-right: 10px" />
        <a-skeleton-shape size="small" shape="circle" />
      </a-space>
    </div>
    <a-layout style="height: 100%">
      <a-layout style="height: 100%">
        <a-layout-sider
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbar ? '60px' : '' }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="menu-wrapper">
            <a-skeleton-line :rows="8" :line-height="20" :line-spacing="24" />
          </div>
        </a-layout-sider>
        <a-drawer v-if="hideMenu" :visible="drawerVisible" placement="left" :footer="false" mask-closable :closable="false" @cancel="drawerCancel">
          <a-skeleton-shape :rows="8" />
        </a-drawer>
        <a-layout class="layout-content" :style="paddingStyle">
          <a-layout-content style="margin: 0px 20px">
            <div style="margin: 16px 0px">
              <a-skeleton-line :widths="[200]" />
            </div>
            <a-card>
              <a-skeleton-line :rows="3" :widths="[800, 400, 200]" />
            </a-card>
          </a-layout-content>
          <Footer v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-skeleton>
</template>

<script lang="ts">
import { defineComponent, ref, computed, provide, nextTick } from "vue";
import { useAppStore } from "@/store";
import NavBar from "@/components/IndexLayout/NavBar.vue";
import Menu from "@/components/IndexLayout/Menu.vue";
import Footer from "@/components/IndexLayout/Footer.vue";
import useInitApp from "@/hooks/useInitApp";
// import usePermission from '@/hooks/permission';
import useResponsive from "@/hooks/responsive";
import { useEventBus } from "@vueuse/core";

export default defineComponent({
  components: {
    NavBar,
    Menu,
    Footer,
  },
  setup() {
    const loading = ref(false);
    // useInitApp().finally(() => {
    //   setTimeout(() => {
    //     loading.value = false;
    //   }, 100);
    // });
    const appStore = useAppStore();
    // const permission = usePermission();
    useResponsive(true);
    const navbarHeight = `60px`;
    const navbar = computed(() => appStore.navbar);
    const renderMenu = computed(() => appStore.menu);
    const hideMenu = computed(() => appStore.hideMenu);
    const footer = computed(() => appStore.footer);
    const menuWidth = computed(() => {
      return appStore.menuCollapse ? 48 : appStore.menuWidth;
    });
    const collapsed = computed(() => {
      return appStore.menuCollapse;
    });
    const paddingStyle = computed(() => {
      const paddingLeft = renderMenu.value && !hideMenu.value ? { paddingLeft: `${menuWidth.value}px` } : {};
      const paddingTop = navbar.value ? { marginTop: navbarHeight } : {};
      return { ...paddingLeft, ...paddingTop, minHeight: "calc(100vh - 60px)" };
    });
    const setCollapsed = (val: boolean) => {
      appStore.updateSettings({ menuCollapse: val });
    };
    // watch(
    //   () => userStore.role,
    //   (roleValue) => {
    //     if (roleValue && !permission.accessRouter(route)) router.push({ name: "notFound" });
    //   },
    // );
    const drawerVisible = ref(false);
    const drawerCancel = () => {
      drawerVisible.value = false;
    };
    provide("toggleDrawerMenu", () => {
      drawerVisible.value = !drawerVisible.value;
    });
    const updateContent = ref(true);
    const blockEvent = useEventBus("BLOCK_SWITCH_EVENT");
    blockEvent.on(() => {
      updateContent.value = false;
      nextTick(() => {
        updateContent.value = true;
      });
      // refMainContent.value?.$forceUpdate();
      // console.log(refMainContent.value);
    });
    return {
      loading,
      navbar,
      renderMenu,
      hideMenu,
      footer,
      menuWidth,
      paddingStyle,
      collapsed,
      appStore,
      drawerVisible,
      updateContent,
      setCollapsed,
      drawerCancel,
    };
  },
});
</script>

<style scoped lang="less">
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
  width: 100%;
  height: 100%;
}

.layout-navbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: @nav-size-height;
}
.skeleton {
  .layout-navbar {
    display: flex;
    justify-content: space-between;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
    padding: 0px 20px;
  }
  .menu-wrapper {
    padding: 15px 10px;
  }
}

.layout-sider {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  box-sizing: border-box;
  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: "";
  }

  > :deep(.arco-layout-sider-children) {
    overflow-y: hidden;
  }
}

.menu-wrapper {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  // :deep(.arco-menu) {
  // ::-webkit-scrollbar {
  //   width: 12px;
  //   height: 4px;
  // }

  // ::-webkit-scrollbar-thumb {
  //   border: 4px solid transparent;
  //   background-clip: padding-box;
  //   border-radius: 7px;
  //   background-color: var(--color-text-4);
  // }

  // ::-webkit-scrollbar-thumb:hover {
  //   background-color: var(--color-text-3);
  // }
  // }
}

.layout-content {
  min-height: 100vh;
  // overflow-y: hidden;
  background-color: var(--color-fill-2);
  box-sizing: border-box;
}
:deep(.arco-spin-mask) {
  z-index: 1000;
}
</style>
