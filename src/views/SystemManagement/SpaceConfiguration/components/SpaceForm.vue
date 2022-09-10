<template>
  <div class="space-form">
    <div class="main-form" v-if="isSelected">
      <div class="title-bar">
        <a-tag
          v-if="cateMaps && Object.keys(cateMaps).length !== 0 && selectNodeData.data.type"
          :color="colors[Number(cateMaps[selectNodeData.data.type].parentId) % colors.length]"
          size="small"
          >{{ cateMaps[selectNodeData.data.type].name }}</a-tag
        >
        <span class="title">{{ selectNodeData.title }}</span>
        <a-button @click="clickEdit" v-if="pageModel === 'View'">编辑</a-button>
      </div>
      <component :is="formComp" :place-info="selectNodeData.data" v-model:model="pageModel" />
    </div>
    <a-empty v-else description="请选择空间" style="margin-top: 200px" />
  </div>
</template>

<script lang="ts">
import { useAppStore } from "@/store";
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
import SpaceFormBlock from "./SpaceFormBlock.vue";
import SpaceFormPlace from "./SpaceFormPlace.vue";
import SpaceFormBuilding from "./SpaceFormBuilding.vue";
import SpaceFormUnit from "./SpaceFormUnit.vue";

export default defineComponent({
  name: "space-form",
  components: {
    SpaceFormBlock,
    SpaceFormPlace,
    SpaceFormBuilding,
    SpaceFormUnit,
  },
  setup() {
    const pageModel = ref("View");
    const isSelected = ref(false);
    const type = ref<number>(0);
    const formComp = computed(() => {
      console.log(type.value);
      switch (type.value) {
        // case 38:
        //   return "SpaceFormBlock";
        case 5:
          return "SpaceFormBuilding";
        case 35:
          return "SpaceFormUnit";
        case 0:
        default:
          return "SpaceFormPlace";
      }
    });
    const selectNodeData = ref<any>({});
    const setSelectNodeData = (data: any) => {
      selectNodeData.value = data;
    };
    watch(selectNodeData, () => {
      type.value = selectNodeData.value.data.type;
      if (selectNodeData.value) {
        console.log(selectNodeData.value);
        isSelected.value = true;
      }
      pageModel.value = "View";
    });
    const appStore = useAppStore();
    const cateMaps = computed(() => {
      return appStore.cateMaps;
    });
    const clickEdit = () => {
      pageModel.value = "Edit";
    };
    return {
      pageModel,
      colors: appStore.colors,
      isSelected,
      selectNodeData,
      formComp,
      cateMaps,
      clickEdit,
      setSelectNodeData,
    };
  },
});
</script>

<style lang="less" scoped>
.space-form {
  .main-form {
    width: calc(100% - 24px);
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    .title-bar {
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .title {
        font-size: 18px;
        font-weight: bold;
        padding: 0px 8px;
      }
    }
  }
}
</style>
