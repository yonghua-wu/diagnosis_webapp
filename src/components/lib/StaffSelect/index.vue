<template>
  <div class="staff-select-component">
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
      :title="'选择员工' + selectedTitleText"
      :unmount-on-close="true"
      @before-ok="handleBeforeOk"
      @cancel="handleCancel"
    >
      <StaffSelectTable :disabledIds="disabledIds" :multiSelect="multiSelect" :defaultQueryData="defaultQueryData"></StaffSelectTable>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Staff, { StaffModel } from "@/api/tenant/Staff";
import { deepClone } from "@/utils/utils";
import { defineComponent, PropType, provide, ref, watch, watchEffect } from "vue";
import StaffSelectTable from "./StaffSelectTable.vue";
interface StaffKeyModel extends StaffModel {
  key: string;
}
export default defineComponent({
  name: "staff-select-component",
  components: { StaffSelectTable },
  props: {
    placeholder: {
      type: String,
      default: () => "请选择员工",
    },
    modelValue: {
      //
      type: [String, Array],
    },
    staffName: {
      type: String,
    },
    phone: {
      type: String,
    },
    multiSelect: {
      type: Boolean,
      default: () => false,
    },
    defaultQueryData: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
    allowClear: {
      type: Boolean,
      default: () => false,
    },
    disabledIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);
    const selectedStaffList = ref<StaffKeyModel[]>([]);
    provide("selectedStaffList", selectedStaffList);
    const isSelected = ref(false);
    if (props.modelValue) {
      isSelected.value = true;
    }
    const selectedText = ref(props.modelValue ? "加载中" : "");
    const selectedTitleText = ref("");
    const updateSelect = () => {
      if (selectedStaffList.value?.length) {
        isSelected.value = true;
      } else {
        isSelected.value = false;
      }
      if (props.multiSelect && selectedStaffList.value?.length > 1) {
        selectedText.value = `${selectedStaffList.value?.[0].name}等${selectedStaffList.value.length}位员工`;
        selectedTitleText.value = ` - 已选择${selectedStaffList.value?.[0]?.name}等${selectedStaffList.value.length}位员工`;
      } else if (selectedStaffList.value?.length) {
        selectedText.value = `${selectedStaffList.value?.[0]?.name || props.modelValue}`;
        selectedTitleText.value = ` - 已选择${selectedStaffList.value?.[0]?.name}`;
      } else {
        selectedText.value = `加载中`;
        selectedTitleText.value = "";
      }
    };
    watch(selectedStaffList, () => {
      updateSelect();
    });
    const loading = ref(false);
    const initStaffData = ref<any>([]);
    if (props.multiSelect) {
      if (props.modelValue?.length) {
        const p = (props.modelValue as string[]).map((k: string) => {
          return Staff.detail(k).then((res) => {
            initStaffData.value.push({
              key: res.staffId,
              ...res,
            });
            selectedStaffList.value = deepClone(initStaffData.value);
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
      Staff.detail(props.modelValue as string)
        .then((res) => {
          initStaffData.value.push({
            key: res.staffId,
            ...res,
          });
          selectedStaffList.value = deepClone(initStaffData.value);
          updateSelect();
        })
        .finally(() => {
          loading.value = false;
        });
    }
    watch(
      () => props.modelValue,
      () => {
        if (!props.modelValue) {
          isSelected.value = false;
          selectedTitleText.value = "";
          selectedText.value = "";
          selectedStaffList.value = [];
          initStaffData.value = [];
        }
      },
    );
    const clickInput = () => {
      !loading.value && (visible.value = true);
    };
    const handleBeforeOk = (done: (closed: boolean) => void) => {
      visible.value = false;
      if (props.multiSelect) {
        emit(
          "update:modelValue",
          selectedStaffList.value.map((item) => item.staffId),
        );
        emit("change", selectedStaffList.value);
      } else {
        emit("update:modelValue", selectedStaffList.value?.[0].staffId);
        emit("change", selectedStaffList.value?.[0]);
      }
      initStaffData.value = selectedStaffList.value;
      done(true);
    };
    const handleCancel = () => {
      selectedStaffList.value = initStaffData.value;
      visible.value = false;
    };
    const clear = () => {
      if (props.multiSelect) {
        selectedStaffList.value = [];
        emit("update:modelValue", []);
        emit("change", []);
      } else {
        selectedStaffList.value = [];
        emit("update:modelValue", "");
        emit("change", undefined);
      }
    };
    return {
      loading,
      visible,
      isSelected,
      selectedTitleText,
      selectedText,
      selectedStaffList,
      clickInput,
      handleBeforeOk,
      handleCancel,
      clear,
    };
  },
});
</script>

<style lang="less" scoped>
.staff-select-component {
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
    }
    .un-selected {
      color: var(--color-text-3);
    }
  }
}
</style>
