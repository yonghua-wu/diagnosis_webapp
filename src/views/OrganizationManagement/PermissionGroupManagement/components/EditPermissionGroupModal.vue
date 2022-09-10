<template>
  <a-modal v-model:visible="visible" :title="modalTitle" title-align="start" :width="400" @cancel="cancel" :on-before-ok="submit">
    <SfForm ref="refForm" :model="formData" :labelWidth="50">
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.name" field="name" label="权限组名称">
        <a-input v-model="formData.name" placeholder="请输入权限组名称" :max-length="20"></a-input>
      </SfFormItem>
      <SfFormItem :colProps="{ span: 24 }" :rules="rules.remark" field="remark" label="描述信息">
        <a-textarea
          v-model="formData.remark"
          placeholder="请输入权限组描述"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 3, maxRows: 6 }"
        ></a-textarea>
      </SfFormItem>
    </SfForm>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import RulesLib from "@/utils/RulesLib";
import { VISIT_TYPE_MAP } from "@/hooks/dict";
import { useDetail } from "@/components/lib/CU/CU";
/**
 * 关闭工单
 */
export default defineComponent({
  name: "modal-children-order",
  components: {
    SfForm,
    SfFormItem,
  },
  props: {
    reload: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const formData = ref<any>({
      name: "",
      remark: "",
    });
    const rules = {
      name: new RulesLib().required("请输入权限组名称").done(),
      remark: new RulesLib().done(),
    };
    const visible = ref(false);

    const type = ref<"Edit" | "Add">("Add");
    const modalTitle = computed(() => {
      if (type.value === "Add") {
        return "新建权限组";
      } else {
        return "编辑权限组";
      }
    });
    const loadData = () => {
      // TODO: 编辑的情况下加载权限组数据
    };
    const doShow = (groupId: string, _type: "Edit" | "Add") => {
      type.value = _type;
      visible.value = true;
      if (type.value === "Add") {
        loadData();
      }
    };
    const clear = () => {
      formData.value = {
        name: "",
        remark: "",
      };
    };
    const cancel = () => {
      clear();
    };

    const refForm = ref();
    const { vaildate } = useDetail(refForm);

    const submit = (done: (v: boolean) => void) => {
      vaildate()
        .then(() => {
          // TODO: 添加或修改权限组
          if (type.value === "Add") {
            //
          } else {
            //
          }
          return Promise.resolve();
        })
        .then(() => {
          props.reload?.();
          setTimeout(() => {
            clear();
          }, 200);
          done(true);
        })
        .catch(() => {
          done(false);
        });
    };

    return {
      refForm,
      formData,
      visible,
      VISIT_TYPE_MAP,
      rules,
      modalTitle,
      doShow,
      submit,
      cancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-children-order {
}
</style>
