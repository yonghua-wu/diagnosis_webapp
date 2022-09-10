<template>
  <div class="container space-configuration">
    <Breadcrumb :items="['系统管理', '空间配置']" />
    <a-card style="height: calc(100% - 36px)">
      <a-spin :loading="loading" style="width: 100%">
        <a-row justify="start" align="stretch" :wrap="false">
          <a-split min="180px" default-size="300px" style="width: 100%">
            <template #first>
              <SpaceTree v-model:treeData="treeData" @select-node="onSelectNode" @load-more="loadNodeChildren" @add="() => clickAdd('0')" />
            </template>
            <template #second>
              <SpaceForm ref="refSpaceForm" />
            </template>
          </a-split>
        </a-row>
      </a-spin>
    </a-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SpaceTree from "./components/SpaceTree.vue";
import SpaceForm from "./components/SpaceForm.vue";
import { PlaceModel } from "@/api/tenant/Place";
import Place from "@/api/tenant/Place";
import { useAppStore } from "@/store";
import eventBus from "@/utils/eventBus";

export default defineComponent({
  name: "SpaceConfiguration",
  components: {
    Breadcrumb,
    SpaceTree,
    SpaceForm,
  },
  setup() {
    const refSpaceForm = ref<InstanceType<typeof SpaceForm>>();
    const size = ref(0.1);
    const isShowLeaf = ref(false);
    const treeData = ref<any[]>([]);
    const loading = ref(false);
    const loadRoot = () => {
      loading.value = true;
      Place.getItemTree("0")
        .then((res) => {
          treeData.value = res.map((item, index) => {
            return {
              data: item,
              title: item.name,
              key: String(index),
              isLeaf: false,
              children: [],
            };
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };
    loadRoot();
    // Place.getAllCate();
    const loadNodeChildren = (nodeData: any, cb: any | undefined) => {
      if (!nodeData.data) {
        return Promise.resolve();
      }
      const p = Place.getItemTree(nodeData.data.placeId).then((res) => {
        if (res.length === 0) {
          nodeData.isLeaf = true;
        } else {
          nodeData.children = res.map((item, index) => {
            return {
              data: item,
              title: item.name,
              key: nodeData.key + "-" + index,
              isLeaf: item.children.length === 0,
              children: [],
            };
          });
        }
        return nodeData;
      });
      cb && cb(p);
      return p;
    };

    const clickSpace = (record: any) => {
      isShowLeaf.value = true;
      console.log("click space", record);
    };
    const placeList = ref<PlaceModel[]>([]);
    const selectedNodeData = ref<any>({});
    const selectedParentNodeData = ref<any>({});
    const onSelectNode = (nodeData: any, parentNodeData: any) => {
      selectedNodeData.value = nodeData;
      selectedParentNodeData.value = parentNodeData;
      if (!selectedNodeData.value.isLeaf && selectedNodeData.value.children.length === 0) {
        loadNodeChildren(nodeData, undefined);
      }
      refSpaceForm.value?.setSelectNodeData(nodeData);
    };
    const clickAdd = (parentId: string) => {
      console.log("parentId", parentId);
    };
    const appStore = useAppStore();
    const cateMaps = computed(() => {
      return appStore.cateMaps as any;
    });

    const event = eventBus.on("loadParentNodeChildren", () => {
      loadNodeChildren(selectedParentNodeData.value, undefined);
    });
    onBeforeUnmount(() => {
      eventBus.un(event);
    });

    return {
      loading,
      size,
      isShowLeaf,
      treeData,
      placeList,
      selectedNodeData,
      onSelectNode,
      loadNodeChildren,
      clickSpace,
      clickAdd,
      colors: appStore.colors,
      cateMaps,
      refSpaceForm,
    };
  },
});
</script>

<style lang="less" scoped>
.space-configuration {
  height: 100%;
  .level-tree {
    padding-right: 16px;
    border-right: 1px solid var(--color-neutral-3);
  }
  .layer {
    padding-left: 16px;
  }
  :deep(.arco-tabs-tab-disabled) {
    font-size: 16px;
    font-weight: bold;
    cursor: unset;
    text-align: left;
    color: var(--color-text-2);
    margin-left: 0px;
    padding-left: 0px;
  }
  :deep(.arco-card-body) {
    height: 100%;
    overflow: hidden;
  }
  :deep(.arco-tabs-tab) {
    padding: 3px 0px;
  }
  // :deep(.arco-tabs-tab-title) {
  //   height: 18px;
  //   padding: 7px 0px;
  // }
  :deep(.arco-split-trigger) {
    width: 10px;
    opacity: 0.2;
    transition: opacity 0.3s;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
