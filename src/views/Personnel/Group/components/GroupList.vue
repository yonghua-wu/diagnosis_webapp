<template>
  <div class="seeing-tree">
    <a-space direction="vertical" fill>
      <div style="max-height: 400px; overflow: auto">
        <a-tree :data="treeData" blockNode :default-expanded-keys="['0-0-0']" :default-selected-keys="['0-0-0']" v-model:selected-keys="selectedKeys">
          <template #extra="">
            <a-dropdown position="br">
              <icon-more style="position: absolute; right: 8px; font-size: 12px; top: 10px" />
              <template #content>
                <a-doption>
                  <template #icon>
                    <icon-delete />
                  </template>
                  <template #default>解散该组</template>
                </a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-tree>
      </div>
      <a-button long type="primary" @click="addGroup">
        <template #icon>
          <icon-plus />
        </template>
        添加用户组
      </a-button>
    </a-space>
    <a-modal v-model:visible="visible" title="添加用户组" @before-ok="handleBeforeOk">
      <a-form :model="formData">
        <a-form-item field="name" label="名称">
          <a-input :max-length="50" v-model="formData.name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";

function useModal() {
  const formData = reactive({
    name: "",
  });
  const visible = ref(false);
  const addGroup = () => {
    visible.value = true;
  };
  const editGroup = () => {
    visible.value = true;
  };
  const handleBeforeOk = () => {
    console.log("before ok");
  };
  return {
    formData,
    visible,
    addGroup,
    editGroup,
    handleBeforeOk,
  };
}

export default defineComponent({
  name: "SeeingTree",
  setup(props, context) {
    const emit = context.emit;
    const treeData = reactive([
      {
        title: "保洁组",
        key: "0-1",
      },
      {
        title: "保安组",
        key: "0-2",
      },
      {
        title: "巡检组",
        key: "0-3",
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

    const { formData, visible, addGroup, editGroup, handleBeforeOk } = useModal();
    return {
      treeData,
      selectedKeys,
      formData,
      visible,
      editGroup,
      addGroup,
      handleBeforeOk,
    };
  },
});
</script>

<style lang="less" scoped>
.seeing-tree {
  :deep(.arco-tree-node-switcher) {
    display: none;
  }
  :deep(.arco-tree-node-title) {
    margin-left: -2px;
  }
}
</style>
