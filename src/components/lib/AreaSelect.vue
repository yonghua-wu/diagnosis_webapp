<template>
  <a-cascader :options="options" :default-value="defaultValue" v-model="value" placeholder="请选择省市县/区" allow-clear allow-search />
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from "vue";
import area from "@/assets/area.json";
export default defineComponent({
  name: "area-select",
  props: {
    modelValue: {
      type: [String, Number],
      default: () => "",
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const defaultValue = modelValue.value;
    const value = ref(modelValue.value);
    watch(value, (val) => {
      emit("update:modelValue", val);
    });

    const options = area.area.map((item) => {
      return {
        ...item,
        value: item.areaCode,
        label: item.name,
        children: item.children.map((item) => {
          return {
            ...item,
            value: item.areaCode,
            label: item.name,
            children: item.children.map((item) => {
              return {
                ...item,
                value: item.areaCode,
                label: item.name,
                children: undefined,
              };
            }),
          };
        }),
      };
    });
    return {
      value,
      defaultValue,
      options,
    };
  },
});
</script>

<style lang="less" scoped></style>
