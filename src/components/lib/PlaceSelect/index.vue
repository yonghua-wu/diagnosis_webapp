<template>
  <div class="place-select" :style="showInputArea ? '' : 'width: 0px;height: 0px;overflow: hidden;'">
    <div
      class="input-area"
      @click="clickInput"
      v-if="showInputArea"
      :style="[
        formModel === 'View' ? 'background-color: unset; color: unset' : '',
        disabled && formModel !== 'View' ? 'cursor: not-allowed' : 'cursor: text',
      ]"
    >
      <div v-if="inputAreaContent" class="selected">
        <span>{{ inputAreaContent }}</span>
        <icon-close v-if="allowClear" @click.stop="clear" />
      </div>
      <span v-else style="color: var(--color-text-3)">{{ placeholder }}</span>
    </div>
    <a-modal v-model:visible="visible" :title="modalTitle" title-align="start" width="800px" @before-ok="handleBeforeOk" @cancel="handleCancel">
      <a-spin :loading="loading" style="width: 100%; height: 600px">
        <a-tabs position="top" type="capsule" lazy-load>
          <a-tab-pane :key="index" :title="treeItem.categoryName" v-for="(treeItem, index) in placeConfigTree">
            <div class="cate-item">
              <a-tabs position="left" lazy-load v-model:active-key="activeTargetIdGroupId" style="height: 100%" @change="changeTab">
                <a-tab-pane
                  style="height: 100%"
                  :key="group.targetId + '/' + group.groupId"
                  :title="group.targetName"
                  v-for="group in treeItem.groups"
                >
                  <a-cascader-panel
                    class="cascader-panel"
                    :options="cascaderOptions[group.targetId + '/' + group.groupId]"
                    :load-more="loadCascaderOptionsMore"
                    :multiple="multiple"
                    v-model="formData.placeId"
                    :default-value="formData.placeId"
                    @change="changeSelect"
                    expand-child
                  >
                    <template #option="{ data }" v-if="multiple === false">
                      <div style="display: flex; flex-direction: row; align-items: center">
                        <a-radio v-if="data.isLeaf === true" :model-value="data.value === formData.placeId"></a-radio>
                        <span style="margin-left: 4px">{{ data.label }}</span>
                      </div>
                    </template>
                  </a-cascader-panel>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Place, {
  CateModel,
  PlaceConfigTreeGroupModel,
  PlaceConfigTreeItemModel,
  PlaceConfigTreeLevelModel,
  PlaceConfigTreeModel,
  PlaceModel,
} from "@/api/tenant/Place";
import { useAppStore } from "@/store";
import { CascaderOption, useFormItem } from "@arco-design/web-vue";
import { computed, defineComponent, nextTick, onMounted, reactive, ref, toRefs, watch } from "vue";
import { useSfFormItem } from "../SfForm/context";

export default defineComponent({
  name: "place-select",
  props: {
    placeholder: {
      type: String,
      default: () => "请选择空间",
    },
    modelValue: {
      type: [String, Array],
    },
    placeName: {
      type: String,
    },
    multiple: {
      type: Boolean,
      default: () => false,
    },
    showInputArea: {
      type: Boolean,
      default: () => true,
    },
    allowClear: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ["update:modelValue", "update:placeName"],
  setup(props, { emit }) {
    const activeTargetIdGroupId = ref<string>("");
    const placeConfigTree = ref<PlaceConfigTreeModel[]>([]);
    const placeNodeMap = reactive<Record<string, PlaceConfigTreeGroupModel>>({});
    const loading = ref(false);
    const formData = reactive<{ placeId: string | string[]; placeInfo: null | PlaceModel | PlaceModel[] }>({
      placeId: "",
      placeInfo: null,
    });
    const placeMap = reactive<Record<string, PlaceModel>>({});
    const loadConfigTree = () => {
      loading.value = true;
      Place.getPlaceConfigTree()
        .then((res) => {
          placeConfigTree.value = res;
          res.forEach((group) => {
            group.groups.forEach((level) => {
              placeNodeMap[level.targetId + "/" + level.groupId] = level;
              // if (level.level && level.level.item) {
              //   const itemList = placeTreeItemToList(level.level.item);
              //   itemList.forEach((item) => {
              //     // placeNodeMap[item.categoryId + "/" + item.groupId] = item;
              //   });
              // }
            });
          });
          if (res[0] && res[0].groups[0]) {
            activeTargetIdGroupId.value = res[0].groups[0].targetId + "/" + res[0].groups[0].groupId;
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };
    loadConfigTree();

    const initData = () => {
      if (props.multiple) {
        (formData.placeId as unknown as string[]) = (props.modelValue as unknown as any[])
          .map((p: any) => p.placeId)
          .map((id) => {
            if (placeMap[id] === undefined) {
              Place.findById(id).then((res) => {
                placeMap[id] = res;
              });
            }
            return id;
          });
      } else if (props.modelValue) {
        formData.placeId = props.modelValue as string;
        Place.findById(props.modelValue as string).then((res) => {
          placeMap[props.modelValue as string] = res;
          formData.placeInfo = placeMap[props.modelValue as string];
          emit("update:placeName", placeMap[formData.placeId as string]?.name);
        });
      }
    };
    watch(
      () => props.modelValue,
      () => {
        if (!props.multiple) {
          formData.placeId = (props.modelValue as string) || "";
          if (formData.placeId && placeMap[formData.placeId as string] === undefined) {
            Place.findById(formData.placeId as string).then((res) => {
              placeMap[formData.placeId as string] = res;
            });
          }
        }
      },
    );
    const { sfFormContext } = useSfFormItem();
    console.log(sfFormContext?.formModel?.value);
    const { eventHandlers } = useFormItem();
    const visible = ref(false);
    initData();
    const clickInput = () => {
      if (!sfFormContext?.disabled?.value) {
        initData();
        visible.value = true;
      }
    };

    const cascaderOptions = reactive<any>({});
    watch(activeTargetIdGroupId, () => {
      // const [targetId, groupId] = activeTargetIdGroupId.value.split("/").map((v) => parseInt(v));
      // console.log("targetId, groupId", targetId, groupId);
      if (cascaderOptions[activeTargetIdGroupId.value] !== undefined) {
        return;
      }
      const targetId = placeNodeMap[activeTargetIdGroupId.value].level.item?.categoryId;
      const groupId = placeNodeMap[activeTargetIdGroupId.value].level.item?.groupId;
      Place.getPlaceList(targetId as number, groupId as number).then((res) => {
        const isLeaf = placeNodeMap[activeTargetIdGroupId.value].level.item?.item ? false : true;
        cascaderOptions[activeTargetIdGroupId.value] = res.map((item) => {
          if (isLeaf) {
            placeMap[item.placeId] = item;
          }
          return {
            value: item.placeId,
            label: item.name,
            data: {
              nodeData: item,
              treeInfo: placeNodeMap[activeTargetIdGroupId.value].level.item?.item,
            },
            isLeaf,
          };
        });
      });
    });
    const loadCascaderOptionsMore = (option: CascaderOption, done: (children?: CascaderOption[] | undefined) => void) => {
      console.log(option);
      const targetId = option.data.treeInfo.categoryId;
      const groupId = option.data.treeInfo.groupId;
      Place.getPlaceList(targetId, groupId, option.value as string).then((res) => {
        const isLeaf = option.data.treeInfo.item ? false : true;
        done(
          res.map((item) => {
            if (isLeaf) {
              placeMap[item.placeId] = item;
            }
            return {
              value: item.placeId,
              label: item.name,
              data: {
                nodeData: item,
                treeInfo: option.data.treeInfo?.item,
              },
              isLeaf,
            };
          }),
        );
      });
    };

    const modalTitle = computed(() => {
      if (props.multiple) {
        // 多选
        if (formData.placeId.length !== 0) {
          return `已选择 ${formData.placeId.length} 个地点`;
        } else {
          return "选择地点";
        }
      } else {
        // 单选
        if (formData.placeId) {
          return `已选择 ${(formData.placeInfo as PlaceModel)?.name}`;
        } else {
          return "选择地点";
        }
      }
    });

    const handleBeforeOk = (done: (closed: boolean) => void) => {
      if (props.multiple) {
        emit(
          "update:modelValue",
          (formData.placeId as unknown as string[]).map((id: string) => {
            return {
              placeName: placeMap[id]?.name,
              placeId: id,
            };
          }),
        );
      } else {
        emit("update:modelValue", formData.placeId);
        emit("update:placeName", placeMap[formData.placeId as string]?.name);
      }
      eventHandlers.value?.onInput?.();
      visible.value = false;
      done(true);
    };
    const handleCancel = () => {
      // formData.placeId = modelValue.value || "";
      visible.value = false;
    };

    const changeTab = (key: string | number) => {
      // formData.placeId = null;
    };
    const changeSelect = () => {
      nextTick(() => {
        if (typeof formData.placeId === "string") {
          formData.placeInfo = placeMap[formData.placeId as string];
        } else {
          formData.placeInfo = (formData.placeId as string[]).map((id: string) => placeMap[id]);
        }
      });
    };

    const inputAreaContent = computed(() => {
      if (props.multiple) {
        if (formData.placeId.length !== 0) {
          return `${placeMap[formData.placeId[0]]?.name} ${formData.placeId.length > 1 ? "等" + formData.placeId.length + "个地点" : ""}`;
        } else {
          return "选择地点";
        }
      } else {
        if (formData.placeId) {
          return `${placeMap[formData.placeId as string]?.name || ""}`;
        } else {
          return "";
        }
      }
    });

    const clear = () => {
      if (props.multiple) {
        formData.placeId = [];
        emit("update:modelValue", []);
      } else {
        formData.placeId = "";
        emit("update:modelValue", "");
      }
    };

    return {
      disabled: sfFormContext?.disabled,
      formModel: sfFormContext?.formModel,
      activeTargetIdGroupId,
      placeConfigTree,
      modalTitle,
      visible,
      cascaderOptions,
      placeNodeMap,
      placeMap,
      formData,
      loading,
      inputAreaContent,
      changeSelect,
      loadCascaderOptionsMore,
      clickInput,
      handleBeforeOk,
      handleCancel,
      changeTab,
      clear,
    };
  },
});
</script>

<style lang="less" scoped>
.place-select {
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
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.cate-item {
  height: 600px;
  overflow-y: auto;
}
.radio-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}
.radio-item {
  width: 33%;
}
.cascader-panel {
  height: 100%;
  background-color: unset;
  border: unset;
  border-radius: unset;
  box-shadow: unset;
}
:deep(.arco-cascader-panel-column) {
  max-height: unset;
}
:deep(.arco-tabs-content-list) {
  height: 100%;
}
:deep(.arco-tabs-pane) {
  height: 100%;
}
:deep(.arco-cascader-option-active) {
  color: rgb(var(--primary-6));
}
:deep(.arco-radio-group) {
  width: 100%;
}
:deep(.arco-checkbox-group) {
  width: 100%;
}
:deep(.arco-tabs-left .arco-tabs-tab) {
  text-align: right;
  min-width: 120px;
}
:deep(.arco-tabs-nav-type-capsule .arco-tabs-nav-tab) {
  justify-content: center;
}
:deep(.arco-cascader-list-empty) {
  height: unset;
}
</style>
