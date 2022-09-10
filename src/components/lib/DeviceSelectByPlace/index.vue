<template>
  <div class="place-select" style="width: 0px; height: 0px; overflow: hidden">
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
                    :multiple="true"
                    v-model="formData.ids"
                    :default-value="formData.ids"
                    @change="changeSelect"
                    expand-child
                  ></a-cascader-panel>
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
import Device, { DeviceModel } from "@/api/tenant/Device";
import Place, { PlaceConfigTreeGroupModel, PlaceConfigTreeModel, PlaceModel } from "@/api/tenant/Place";
import { CascaderOption, useFormItem } from "@arco-design/web-vue";
import { computed, defineComponent, nextTick, PropType, reactive, ref, watch } from "vue";

interface PlaceDeviceModel extends PlaceModel {
  subDevices?: DeviceModel[];
}

interface DevicePlaceModel extends DeviceModel {
  supPlace?: PlaceDeviceModel;
}

interface DeviceValueModel {
  deviceId?: string;
  deviceName?: string;
  deviceOrder?: number;
  placeId?: string;
}

interface PlaceValueModel {
  placeId?: string;
  placeName?: string;
  placeOrder?: string;
  spotDevices?: DeviceValueModel[];
}

export default defineComponent({
  name: "device-select-by-place",
  props: {
    placeholder: {
      type: String,
      default: () => "请选择设备",
    },
    modelValue: {
      type: Array as PropType<PlaceValueModel[]>,
    },
    placeName: {
      type: String,
    },
    showInputArea: {
      type: Boolean,
      default: () => true,
    },
  },
  emits: ["update:modelValue", "update:placeName"],
  setup(props, { emit }) {
    const activeTargetIdGroupId = ref<string>("");
    const placeConfigTree = ref<PlaceConfigTreeModel[]>([]);
    const placeNodeMap = reactive<Record<string, PlaceConfigTreeGroupModel>>({});
    const loading = ref(false);
    const formData = reactive<{ ids: string[] }>({
      ids: [],
    });
    const deviceMap = reactive<Record<string, DevicePlaceModel>>({});
    const placeMap = reactive<Record<string, PlaceDeviceModel>>({});
    const loadConfigTree = () => {
      loading.value = true;
      Place.getPlaceConfigTree()
        .then((res) => {
          placeConfigTree.value = res;
          res.forEach((group) => {
            group.groups.forEach((level) => {
              placeNodeMap[level.targetId + "/" + level.groupId] = level;
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
      const deviceId: string[] = [];
      props.modelValue?.forEach((p) => {
        p.spotDevices?.forEach((d) => {
          d.deviceId && deviceId.push(d.deviceId);
        });
      });
      formData.ids = deviceId;
      formData.ids.forEach((deviceId) => {
        deviceMap[deviceId] ||
          Device.detail(deviceId).then((res) => {
            console.log("device", deviceId, deviceMap);
            deviceMap[deviceId] = res;
            // debugger;
            if (placeMap[res.placeId] === undefined) {
              Place.findById(res.placeId).then((p) => {
                // debugger;
                // placeMap[res.placeId].subDevices = [res];
                if (placeMap[res.placeId] === undefined) {
                  placeMap[res.placeId] = p;
                }
                if (placeMap[res.placeId].subDevices === undefined) {
                  placeMap[res.placeId].subDevices = [res];
                } else {
                  placeMap[res.placeId].subDevices?.push(res);
                }
                deviceMap[deviceId].supPlace = placeMap[res.placeId];
              });
            } else {
              deviceMap[deviceId].supPlace = placeMap[res.placeId];
              // debugger;
              if (placeMap[res.placeId].subDevices === undefined) {
                placeMap[res.placeId].subDevices = [res];
              } else {
                placeMap[res.placeId].subDevices?.push(res);
              }
            }
          });
      });
    };

    const { eventHandlers, mergedDisabled } = useFormItem();
    const visible = ref(false);
    initData();
    const clickInput = () => {
      if (!mergedDisabled.value) {
        initData();
        visible.value = true;
      }
    };

    const cascaderOptions = reactive<any>({});
    watch(activeTargetIdGroupId, () => {
      if (cascaderOptions[activeTargetIdGroupId.value] !== undefined) {
        return;
      }
      const targetId = placeNodeMap[activeTargetIdGroupId.value].level.item?.categoryId;
      const groupId = placeNodeMap[activeTargetIdGroupId.value].level.item?.groupId;
      Place.getPlaceList(targetId as number, groupId as number).then((res) => {
        const isPlaceLeaf = placeNodeMap[activeTargetIdGroupId.value].level.item?.item ? false : true;
        cascaderOptions[activeTargetIdGroupId.value] = res.map((item) => {
          if (isPlaceLeaf) {
            placeMap[item.placeId] || (placeMap[item.placeId] = item);
          }
          return {
            value: item.placeId,
            label: item.name,
            data: {
              nodeData: item,
              treeInfo: placeNodeMap[activeTargetIdGroupId.value].level.item?.item,
              isPlaceLeaf,
            },
            isLeaf: false,
          };
        });
      });
    });
    const loadCascaderOptionsMore = (option: CascaderOption, done: (children?: CascaderOption[] | undefined) => void) => {
      console.log(option);
      const targetId = option.data.treeInfo?.categoryId;
      const groupId = option.data.treeInfo?.groupId;
      const isPlaceLeaf = option.data.isPlaceLeaf;
      if (isPlaceLeaf) {
        const placeId = option.data.nodeData.placeId;
        Device.findAllByPlaceId(placeId).then((res) => {
          placeMap[placeId].subDevices = res;
          done(
            res.map((item) => {
              deviceMap[item.deviceId] = item;
              deviceMap[item.deviceId].supPlace = placeMap[placeId];
              return {
                value: item.deviceId,
                label: item.deviceName,
                data: {
                  nodeData: item,
                },
                isLeaf: true,
              };
            }),
          );
        });
      } else {
        Place.getPlaceList(targetId, groupId, option.value as string).then((res) => {
          const isPlaceLeaf = option.data.treeInfo.item ? false : true;
          done(
            res.map((item) => {
              if (isPlaceLeaf) {
                placeMap[item.placeId] = item;
              }
              return {
                value: item.placeId,
                label: item.name,
                data: {
                  nodeData: item,
                  treeInfo: option.data.treeInfo?.item,
                  isPlaceLeaf,
                },
                isLeaf: false,
              };
            }),
          );
        });
      }
    };

    const modalTitle = computed(() => {
      // 多选
      if (formData.ids.length !== 0) {
        return `已选择 ${formData.ids.length} 个设备`;
      } else {
        return "选择设备";
      }
    });

    const handleBeforeOk = (done: (closed: boolean) => void) => {
      const data = formData.ids
        .map((id: string, index) => {
          const place = deviceMap[id]?.supPlace;
          // delete place?.subDevices;
          // const device = deviceMap[id];
          // delete device?.supPlace;
          return {
            placeId: place?.placeId,
            placeName: place?.name,
            placeOrder: index,
            spotDevices:
              place?.subDevices?.map((item, index) => {
                return {
                  deviceId: item.deviceId,
                  deviceName: item.deviceName,
                  deviceOrder: index,
                  placeId: place?.placeId,
                };
              }) || [],
          };
        })
        .reverse()
        .filter((item, index, arr) => {
          if (arr.slice(index + 1).findIndex((a) => a.placeId === item.placeId) !== -1) {
            return false;
          } else {
            return true;
          }
        })
        .reverse();
      data.forEach((p) => {
        p.spotDevices = p.spotDevices.filter((device) => formData.ids.findIndex((id) => id === device.deviceId) !== -1);
      });
      emit("update:modelValue", data);
      console.log("data", data);
      eventHandlers.value?.onInput?.();
      visible.value = false;
      done(true);
    };
    const handleCancel = () => {
      visible.value = false;
    };

    const changeTab = (key: string | number) => {
      // formData.ids = null;
    };
    const changeSelect = () => {
      // nextTick(() => {
      //   if (typeof formData.ids === "string") {
      //     formData.placeInfo = placeMap[formData.ids as string];
      //   } else {
      //     formData.placeInfo = (formData.ids as string[]).map((id: string) => placeMap[id]);
      //   }
      // });
    };

    return {
      mergedDisabled,
      activeTargetIdGroupId,
      placeConfigTree,
      modalTitle,
      visible,
      cascaderOptions,
      placeNodeMap,
      placeMap,
      formData,
      loading,
      deviceMap,
      changeSelect,
      loadCascaderOptionsMore,
      clickInput,
      handleBeforeOk,
      handleCancel,
      changeTab,
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
