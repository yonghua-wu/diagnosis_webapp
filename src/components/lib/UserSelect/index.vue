<template>
  <div class="user-select-component">
    <div class="input-area" @click="clickInput" :style="loading ? 'cursor: not-allowed' : ''">
      <div class="selected" v-if="isSelected">
        <span>{{ selectedText }}</span>
        <icon-loading v-if="loading" style="margin-left: 6px" />
        <icon-close v-else-if="allowClear" @click.stop="clear" />
      </div>
      <span class="un-selected" v-else>{{ placeholder }}</span>
    </div>
    <a-modal
      v-model:visible="visible"
      width="800px"
      title-align="start"
      :title="'选择用户' + selectedTitleText"
      :unmount-on-close="true"
      @before-ok="handleBeforeOk"
      @cancel="handleCancel"
    >
      <UserSelectTable :multiSelect="multiSelect"></UserSelectTable>
    </a-modal>
  </div>
</template>

<script lang="ts">
import User, { UserModel } from "@/api/tenant/User";
import { deepClone } from "@/utils/utils";
import { defineComponent, provide, ref, watch } from "vue";
import UserSelectTable from "./UserSelectTable.vue";
interface UserKeyModel extends UserModel {
  key: string;
}
export default defineComponent({
  name: "user-select-component",
  components: { UserSelectTable },
  props: {
    placeholder: {
      type: String,
      default: () => "请选择用户",
    },
    modelValue: {
      //
      type: [String, Array],
    },
    multiSelect: {
      type: Boolean,
      default: () => false,
    },
    allowClear: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);
    const selectedUserList = ref<UserKeyModel[]>([]);
    provide("selectedUserList", selectedUserList);
    const isSelected = ref(false);
    if (props.modelValue) {
      isSelected.value = true;
    }
    const selectedText = ref(props.modelValue ? "加载中" : "");
    const selectedTitleText = ref("");
    const updateSelect = () => {
      if (selectedUserList.value?.length) {
        isSelected.value = true;
      } else {
        isSelected.value = false;
      }
      if (props.multiSelect && selectedUserList.value?.length > 1) {
        selectedText.value = `${selectedUserList.value?.[0].realName}等${selectedUserList.value.length}位用户`;
        selectedTitleText.value = ` - 已选择${selectedUserList.value?.[0]?.realName}等${selectedUserList.value.length}位用户`;
      } else if (selectedUserList.value?.length) {
        selectedText.value = `${selectedUserList.value?.[0]?.realName || props.modelValue}`;
        selectedTitleText.value = ` - 已选择${selectedUserList.value?.[0]?.realName}`;
      } else {
        selectedText.value = `加载中`;
        selectedTitleText.value = "";
      }
    };
    watch(selectedUserList, () => {
      updateSelect();
    });
    const loading = ref(false);
    const initUserData = ref<any>([]);
    if (props.multiSelect) {
      if (props.modelValue?.length) {
        const p = (props.modelValue as string[]).map((k: string) => {
          return User.detail(k).then((res) => {
            initUserData.value.push({
              key: res.userId,
              ...res,
            });
            selectedUserList.value = deepClone(initUserData.value);
          });
        });
        loading.value = true;
        Promise.all(p).finally(() => {
          updateSelect();
          loading.value = false;
        });
      }
    } else if (props.modelValue) {
      loading.value = true;
      User.detail(props.modelValue as string)
        .then((res) => {
          initUserData.value.push({
            key: res.userId,
            ...res,
          });
          selectedUserList.value = deepClone(initUserData.value);
          updateSelect();
        })
        .finally(() => {
          loading.value = false;
        });
    }
    const clickInput = () => {
      !loading.value && (visible.value = true);
    };
    const handleBeforeOk = (done: (closed: boolean) => void) => {
      visible.value = false;
      if (props.multiSelect) {
        emit(
          "update:modelValue",
          selectedUserList.value.map((item) => item.userId),
        );
        emit("change", selectedUserList.value);
      } else {
        emit("update:modelValue", selectedUserList.value?.[0].userId);
        emit("change", selectedUserList.value?.[0]);
      }
      initUserData.value = selectedUserList.value;
      done(true);
    };
    const handleCancel = () => {
      selectedUserList.value = initUserData.value;
      visible.value = false;
    };
    const clear = () => {
      if (props.multiSelect) {
        selectedUserList.value = [];
        emit("update:modelValue", []);
        emit("change", []);
      } else {
        selectedUserList.value = [];
        emit("update:modelValue", "");
        emit("change", undefined);
      }
    };
    watch(
      () => props.modelValue,
      () => {
        console.log("props.modelValue", props.modelValue);
        if (!props.modelValue) {
          selectedUserList.value = [];
        }
      },
    );
    return {
      loading,
      visible,
      isSelected,
      selectedTitleText,
      selectedText,
      selectedUserList,
      clear,
      clickInput,
      handleBeforeOk,
      handleCancel,
    };
  },
});
</script>

<style lang="less" scoped>
.user-select-component {
  width: 100%;
  height: 32px;
  .input-area {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-right: 12px;
    padding-left: 12px;
    color: var(--color-text-1);
    font-size: 14px;
    background-color: var(--color-fill-2);
    border: 1px solid transparent;
    border-radius: var(--border-radius-small);
    .selected {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .un-selected {
      color: var(--color-text-3);
    }
  }
}
</style>
