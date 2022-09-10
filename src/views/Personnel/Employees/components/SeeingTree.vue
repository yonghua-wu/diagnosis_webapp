<template>
  <div class="seeing-tree">
    <a-tree :data="treeData" blockNode :default-expanded-keys="['0-0-0']" :default-selected-keys="['0-0-0']" v-model:selected-keys="selectedKeys">
      <template #extra="">
        <a-dropdown position="br">
          <icon-more style="position: absolute; right: 8px; font-size: 12px; top: 10px" />
          <template #content>
            <a-doption>
              <template #icon>
                <icon-plus />
              </template>
              <template #default>添加部门</template>
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除此部门</template>
            </a-doption>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
    {{ selectedKeys }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
export default defineComponent({
  name: "SeeingTree",
  setup(props, context) {
    const emit = context.emit;
    const treeData = reactive([
      {
        title: "思流科技",
        key: "0-0",
        isRoot: true,
        children: [
          {
            title: "技术部",
            key: "0-0-0",
          },
          {
            title: "财务部",
            key: "0-0-1",
          },
        ],
      },
    ]);
    function useSelect() {
      const selectedKeys = ref([]);
      watch(selectedKeys, function (v) {
        emit("select", v);
      });
      return selectedKeys;
    }
    const selectedKeys = useSelect();
    return {
      treeData,
      selectedKeys,
    };
  },
});
</script>

<style lang="less" scoped>
.seeing-tree {
  :deep(.arco-tree-node-indent-block) {
    margin-right: 0px;
    width: 8px;
  }
  :deep(.arco-icon-hover) {
    font-size: 16px;
  }
}
</style>
