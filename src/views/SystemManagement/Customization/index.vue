<template>
  <div class="container customization">
    <Breadcrumb :items="['系统管理', '主题配置']" />
    <a-space direction="vertical" fill v-if="Object.keys(colorData).length !== 0">
      <a-card title="品牌 Logo">
        <a-space direction="vertical" fill>
          <a-row>
            <a-col :span="24" class="title"> 主 Logo </a-col>
            <a-col :span="24">
              <a-upload list-type="picture-card" action="/" :default-file-list="mainLogo" image-preview :limit="1" />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="title"> 辅 Logo </a-col>
            <a-col :span="24">
              <a-upload list-type="picture-card" action="/" :default-file-list="secondLogo" image-preview :limit="1" />
            </a-col>
          </a-row>
        </a-space>
      </a-card>
      <a-card title="主色/品牌色">
        <a-space align="end">
          <ColorCard @change-color="(hex) => changeColor(hex, '--primary-6')" :color="colorData['--primary-6']" title="主色" />
          <ColorGroup
            :colors="[
              colorData['--primary-1'],
              colorData['--primary-2'],
              colorData['--primary-3'],
              colorData['--primary-4'],
              colorData['--primary-5'],
              colorData['--primary-6'],
              colorData['--primary-7'],
            ]"
          />
        </a-space>
      </a-card>
      <a-card title="功能色">
        <a-space direction="vertical" fill>
          <a-row>
            <a-col :span="24" class="title"> 成功色 Success </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard @change-color="(hex) => changeColor(hex, '--success-6')" :color="colorData['--success-6']" title="常规" />
                <ColorGroup
                  :colors="[
                    colorData['--success-1'],
                    colorData['--success-2'],
                    colorData['--success-3'],
                    colorData['--success-4'],
                    colorData['--success-5'],
                    colorData['--success-6'],
                    colorData['--success-7'],
                  ]"
                />
              </a-space>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="title"> 警示色 Warning </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard @change-color="(hex) => changeColor(hex, '--warning-6')" :color="colorData['--warning-6']" title="常规" />
                <ColorGroup
                  :colors="[
                    colorData['--warning-1'],
                    colorData['--warning-2'],
                    colorData['--warning-3'],
                    colorData['--warning-4'],
                    colorData['--warning-5'],
                    colorData['--warning-6'],
                    colorData['--warning-7'],
                  ]"
                />
              </a-space>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="title"> 错误色 Danger </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard @change-color="(hex) => changeColor(hex, '--danger-6')" :color="colorData['--danger-6']" title="常规" />
                <ColorGroup
                  :colors="[
                    colorData['--danger-1'],
                    colorData['--danger-2'],
                    colorData['--danger-3'],
                    colorData['--danger-4'],
                    colorData['--danger-5'],
                    colorData['--danger-6'],
                    colorData['--danger-7'],
                  ]"
                />
              </a-space>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="title"> 链接色 Link </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard @change-color="(hex) => changeColor(hex, '--link-6')" :color="colorData['--link-6']" title="常规" />
                <ColorGroup
                  :colors="[
                    colorData['--link-1'],
                    colorData['--link-2'],
                    colorData['--link-3'],
                    colorData['--link-4'],
                    colorData['--link-5'],
                    colorData['--link-6'],
                    colorData['--link-7'],
                  ]"
                />
              </a-space>
            </a-col>
          </a-row>
        </a-space>
      </a-card>
      <a-card title="中性色">
        <a-space direction="vertical" fill>
          <a-row>
            <a-col :span="24" class="title"> 边框/线条 Border </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-border-1')" :color="colorData['--color-border-1']" title="浅色(1)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-border-2')" :color="colorData['--color-border-2']" title="一般(2)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-border-3')" :color="colorData['--color-border-3']" title="深/悬浮(3)" />
                <ColorCard
                  @change-color="(hex) => changeColor(hex, '--color-border-4')"
                  :color="colorData['--color-border-4']"
                  title="重/按钮描边(4)"
                />
              </a-space>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="title"> 填充 Fill </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard
                  @change-color="(hex) => changeColor(hex, '--color-bg-white')"
                  :color="colorData['--color-bg-white']"
                  title="纯白填充(white)"
                />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-fill-1')" :color="colorData['--color-fill-1']" title="浅/禁用(1)" />
                <ColorCard
                  @change-color="(hex) => changeColor(hex, '--color-fill-2')"
                  :color="colorData['--color-fill-2']"
                  title="常规/白底悬浮(2)"
                />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-fill-3')" :color="colorData['--color-fill-3']" title="深/灰底悬浮(3)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-fill-4')" :color="colorData['--color-fill-4']" title="重/特殊场景(4)" />
              </a-space>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="title"> 文字 Text </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard
                  @change-color="(hex) => changeColor(hex, '--color-text-1')"
                  :color="colorData['--color-text-1']"
                  title="强调/正文标题(1)"
                />
                <ColorCard
                  @change-color="(hex) => changeColor(hex, '--color-text-2')"
                  :color="colorData['--color-text-2']"
                  title="次强调/正文标题(2)"
                />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-text-3')" :color="colorData['--color-text-3']" title="次要信息(3)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-text-4')" :color="colorData['--color-text-4']" title="置灰信息(4)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-white')" :color="colorData['--color-white']" title="纯白文字(white)" />
              </a-space>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="title"> 背景 Background </a-col>
            <a-col :span="24">
              <a-space align="end">
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-bg-1')" :color="colorData['--color-bg-1']" title="整体背景色(1)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-bg-2')" :color="colorData['--color-bg-2']" title="一级容器背景(2)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-bg-3')" :color="colorData['--color-bg-3']" title="二级容器背景(3)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-bg-4')" :color="colorData['--color-bg-4']" title="三级容器背景(4)" />
                <ColorCard @change-color="(hex) => changeColor(hex, '--color-bg-5')" :color="colorData['--color-bg-5']" title="下拉弹出框(5)" />
              </a-space>
            </a-col>
          </a-row>
        </a-space>
      </a-card>
    </a-space>
    <div style="height: 0; text-align: right; padding-right: 20px">
      <a-affix :offsetBottom="40">
        <a-space>
          <a-tooltip content="提交修改" v-if="isChanged">
            <a-button type="primary" shape="circle" size="large" @click="submitColor">
              <icon-check />
            </a-button>
          </a-tooltip>
          <a-tooltip content="放弃修改" v-if="isChanged">
            <a-button type="outline" shape="circle" size="large" @click="cancelColor">
              <icon-close />
            </a-button>
          </a-tooltip>
          <a-tooltip content="恢复默认">
            <a-button type="outline" shape="circle" size="large" @click="resetColor">
              <icon-refresh />
            </a-button>
          </a-tooltip>
        </a-space>
      </a-affix>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref, watchEffect } from "vue";
import { useAppStore } from "@/store";
import Breadcrumb from "@/components/Breadcrumb.vue";
import ColorCard from "./components/ColorCard.vue";
import ColorGroup from "./components/ColorGroup.vue";
import defaultColorData from "@/config/defaultColorData.json";
import { generate, getRgbStr } from "@arco-design/color";
import { ThemeType } from "@/types";
import modal from "@arco-design/web-vue/es/modal";

function useLogo() {
  const mainLogo = reactive([]);
  const secondLogo = reactive([]);
  return {
    mainLogo,
    secondLogo,
  };
}

function useColor(isChanged: Ref<boolean>) {
  const appStore = useAppStore();
  const theme = ref<ThemeType>("light");
  const colorData = reactive<any>({});
  const buildTheColor = () => {
    theme.value = appStore.theme as ThemeType;
    const bodyStyle = window.getComputedStyle(document.body);
    document.body.removeAttribute("style");
    for (const key in (defaultColorData as any)[theme.value]) {
      colorData[key] = bodyStyle.getPropertyValue(key).replace(/\s+/g, "");
    }
  };
  // buildTheColor();
  watchEffect(buildTheColor);
  const changeColor = (colorObj: any, colorKey: string) => {
    isChanged.value = true;
    if (/color/.test(colorKey)) {
      colorData[colorKey] = `rgb(${colorObj.rgba.r},${colorObj.rgba.g},${colorObj.rgba.b})`;
      document.body.style.setProperty(colorKey, colorData[colorKey]);
    } else {
      // 不需要前缀的情况
      colorData[colorKey] = `${colorObj.rgba.r},${colorObj.rgba.g},${colorObj.rgba.b}`;
      const newColors = generate(`rgb(${colorData[colorKey]})`, { list: true, dark: theme.value === "dark" });
      newColors.forEach((color: string, index: number) => {
        const key = colorKey.replace(/[0-9]/, String(index + 1));
        colorData[key] = getRgbStr(color);
        document.body.style.setProperty(key, colorData[key]);
        console.log(key, colorData[key]);
      });
    }
  };
  const submitColor = () => {
    modal.info({
      title: "提示",
      content: "确定提交本次修改？",
      closable: true,
      cancelText: "取消",
      hideCancel: false,
      onOk: () => {
        console.log("color", colorData);
      },
      onCancel: () => {
        //
      },
    });
  };
  const cancelColor = () => {
    modal.warning({
      title: "提示",
      content: "确定放弃本次修改？",
      closable: true,
      cancelText: "取消",
      hideCancel: false,
      onOk: () => {
        isChanged.value = false;
        buildTheColor();
      },
      onCancel: () => {
        //
      },
    });
  };
  const resetColor = () => {
    isChanged.value = true;
    for (const key in (defaultColorData as any)[theme.value]) {
      colorData[key] = (defaultColorData as any)[theme.value][key];
      document.body.style.setProperty(key, colorData[key]);
    }
  };
  return {
    isChanged,
    colorData,
    changeColor,
    submitColor,
    cancelColor,
    resetColor,
  };
}

export default defineComponent({
  name: "CustomizationView",
  components: {
    Breadcrumb,
    ColorCard,
    ColorGroup,
  },
  setup() {
    const isChanged = ref(false);
    const { colorData, changeColor, submitColor, cancelColor, resetColor } = useColor(isChanged);
    const { mainLogo, secondLogo } = useLogo();
    return {
      mainLogo,
      secondLogo,
      isChanged,
      colorData,
      changeColor,
      submitColor,
      cancelColor,
      resetColor,
    };
  },
});
</script>

<style lang="less" scoped>
.customization {
  .title {
    font-size: 14px;
    font-weight: bold;
    padding: 12px 0px;
  }
}
</style>
