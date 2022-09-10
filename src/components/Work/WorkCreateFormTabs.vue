<template>
  <div class="work-create-form-tabs">
    <a-tabs v-if="data.length > 0" type="card-gutter" v-model:active-key="activeKey" :editable="true" @delete="handleDelete" auto-switch>
      <a-tab-pane v-for="(item, index) of data" :key="item.key" :title="'关联工单 ' + (index + 1)" :closable="closable">
        <WorkCreateForm
          ref="refWorkCreateFormList"
          :key="item.key"
          :defaultValue="item"
          :type="type"
          :disabledFieldList="disabledFieldList"
          :defaultJobQueryData="defaultJobQueryData"
        />
      </a-tab-pane>
    </a-tabs>
    <!-- <div v-else @click="handleAdd">添加关联工单</div> -->
  </div>
</template>

<script lang="ts">
import useModal from "@/hooks/useModal";
import { computed, defineComponent, PropType, reactive, Ref, ref } from "vue";
import WorkCreateForm, { WorkCreateFormData } from "./WorkCreateForm.vue";
import { DETAIL_TYPE_MAP } from "./WorkSomethingDetail.vue";
export default defineComponent({
  name: "work-create-form-tabs",
  components: {
    WorkCreateForm,
  },
  props: {
    defaultValue: {
      type: Array as PropType<Partial<WorkCreateFormData>>,
    },
    disabledFieldList: {
      type: Array as PropType<(keyof WorkCreateFormData)[]>,
    },
    type: {
      type: String as PropType<keyof typeof DETAIL_TYPE_MAP>,
      default: () => "WORK_ORDER",
    },
    minOrderCount: {
      type: Number,
      default: () => 0,
    },
    defaultJobQueryData: {
      type: Object as PropType<any>,
    },
  },
  setup(props) {
    //
    const data = ref(props.defaultValue ? [props.defaultValue] : []);
    if (data.value.length) {
      data.value.forEach((item, index) => (item.key = index));
    }
    const refWorkCreateFormList = ref();
    const activeKey = ref(data.value?.[0]?.key || null);
    const { showModal } = useModal();
    const handleDelete = (key: number | string) => {
      showModal({
        title: "删除",
        content: "确定删除此关联工单？",
        cancelText: "取消",
      }).then(() => {
        const i = data.value.findIndex((item) => item.key === key);
        // refWorkCreateFormList.value = refWorkCreateFormList.value.splice(i, 1);
        data.value = data.value.filter((item) => {
          return item.key !== key;
        });
        if (data.value[i]?.key === undefined) {
          if (data.value[i - 1]?.key === undefined) {
            activeKey.value = null;
          } else {
            activeKey.value = data.value[i - 1].key;
          }
        } else {
          activeKey.value = data.value[i].key;
        }
      });
    };
    let count = data.value?.length || 0;
    const handleAdd = (initFormData: any) => {
      const submitPromiseList = refWorkCreateFormList.value?.map((refItem: any, index: number) => {
        return refItem?.submit().catch((err: any) => {
          activeKey.value = data.value[index].key;
          throw err;
        });
      });
      if (submitPromiseList) {
        return Promise.all(submitPromiseList).then(() => {
          data.value = data.value.concat({
            key: count++,
            ...initFormData,
          });
          // refWorkCreateFormList.value.push(ref());
          activeKey.value = count - 1;
        });
      } else {
        data.value = data.value.concat({
          key: count++,
          ...initFormData,
        });
        // refWorkCreateFormList.value.push(ref());
        activeKey.value = count - 1;
      }
    };
    const submit = () => {
      if (refWorkCreateFormList.value?.length) {
        const submitPromiseList = refWorkCreateFormList.value.map((refItem: any, index: number) => {
          return refItem
            ?.submit()
            .then((itemFormData: any) => {
              return itemFormData;
            })
            .catch((err: any) => {
              activeKey.value = data.value[index].key;
              throw err;
            });
        });
        return Promise.all(submitPromiseList);
      } else {
        return Promise.resolve([]);
      }
    };
    const closable = computed(() => {
      if (props.minOrderCount !== 0) {
        return props.minOrderCount < data.value.length;
      } else {
        return true;
      }
    });
    return {
      closable,
      data,
      activeKey,
      refWorkCreateFormList,
      handleAdd,
      handleDelete,
      submit,
    };
  },
});
</script>

<style lang="less" scoped>
.work-create-form-tabs {
  width: 100%;
  height: 100%;
  // background-color: var(--color-fill-1);
  // border-radius: 4px;
  // padding: 8px;
}
</style>
