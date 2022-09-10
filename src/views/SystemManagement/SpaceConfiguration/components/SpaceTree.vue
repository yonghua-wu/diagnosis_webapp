<template>
  <div class="seeing-tree">
    <div class="filter">
      <a-input-search placeholder="搜索空间" />
      <!-- <div style="width: 32px; margin-left: 4px">
        <a-tooltip content="添加" position="right">
          <a-button type="primary" @click="$emit('add')">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
        </a-tooltip>
      </div> -->
    </div>
    <div class="tree">
      <a-tree :data="treeData" blockNode :default-expanded-keys="['0']" :load-more="loadMore" v-model:selected-keys="selectedKeys">
        <template #title="node">
          <div class="node">
            <a-tag
              v-if="Object.keys(cateMaps).length !== 0 && node.data.type"
              :color="colors[Number(cateMaps[node.data.type].parentId) % colors.length]"
              size="small"
              >{{ cateMaps[node.data.type].name }}
            </a-tag>
            <span class="title">{{ node.title }}</span>
          </div>
        </template>
        <!-- <a-dropdown trigger="contextMenu" alignPoint>
          <template #content>
            <a-doption @click="clickAdd(node.data.placeId)">添加子空间</a-doption>
            <a-doption @click="clickDel(node.data.placeId)">删除 {{ node.title }}</a-doption>
          </template>
        </a-dropdown> -->
      </a-tree>
    </div>
  </div>
</template>

<script lang="ts">
import Place, { PlaceModel } from "@/api/tenant/Place";
import { useAppStore } from "@/store";
import { TreeNodeData } from "@arco-design/web-vue/es/tree/interface";
import { storeToRefs } from "pinia";
import { defineComponent, PropType, reactive, ref, toRefs, watch } from "vue";

interface PlaceTreeNodeData extends TreeNodeData {
  data: PlaceModel;
  children: PlaceTreeNodeData[];
}

function getTreeDataByIndexList(tree: PlaceTreeNodeData, indexList: number[]): PlaceTreeNodeData {
  if (tree.children && indexList[0] !== undefined && tree.children[indexList[0]]) {
    return getTreeDataByIndexList(tree.children[indexList[0]], indexList.slice(1));
  } else {
    return tree;
  }
}
const colors = ["orange", "blue", "cyan", "orangered", "pinkpurple", "arcoblue", "gold", "lime", "red", "green", "magenta", "gray", "purple"];
export default defineComponent({
  name: "SeeingTree",
  emits: ["select-node", "load-more", "add"],
  props: {
    treeData: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    },
  },
  setup(props, context) {
    const { treeData } = toRefs(props);
    const emit = context.emit;
    const loadMore = (nodeData: TreeNodeData): Promise<void> => {
      return new Promise((resolve) => {
        emit("load-more", nodeData, (p: Promise<void>) => {
          p.finally(() => {
            resolve();
          });
        });
      });
    };
    function useSelect() {
      const selectedKeys = ref<string[]>([]);
      const selectedNodeData = ref<any>({});
      watch(selectedKeys, () => {
        console.log(selectedKeys.value);
        const indexList = selectedKeys.value[0].split("-").map((index) => Number(index));
        selectedNodeData.value = getTreeDataByIndexList(treeData.value[indexList[0]], indexList.slice(1));
        console.log(selectedNodeData.value);
        const parentNodeData = getTreeDataByIndexList(treeData.value[indexList[0]], indexList.slice(1, -1));
        emit("select-node", selectedNodeData.value, parentNodeData);
      });
      return {
        selectedNodeData,
        selectedKeys,
      };
    }
    const { selectedNodeData, selectedKeys } = useSelect();

    const clickAdd = (placeId: string) => {
      //
    };
    const clickDel = (placeId: string) => {
      //
    };

    const appStore = useAppStore();
    const { cateMaps: _c } = storeToRefs(appStore);
    const cateMaps = _c as any;
    return {
      selectedKeys,
      selectedNodeData,
      colors,
      loadMore,
      clickAdd,
      clickDel,
      cateMaps,
    };
  },
});
</script>

<style lang="less" scoped>
.seeing-tree {
  margin-right: 4px;
  height: calc(100vh - 210px);
  .filter {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 8px;
  }
  .tree {
    height: calc(100% - 40px);
    overflow: auto;
  }
  :deep(.arco-tree-node-indent-block) {
    margin-right: 4px;
    width: 8px;
  }
  :deep(.arco-icon-hover) {
    font-size: 16px;
  }
  :deep(.arco-tree-node-selected) {
    font-weight: bold;
  }
  :deep(.arco-tree) {
    margin-right: 4px;
  }
  :deep(.arco-tree-node-title-text) {
    width: 100%;
  }
  :deep(.node) {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    width: 100%;
    .title {
      margin-left: 4px;
    }
  }
}
</style>
