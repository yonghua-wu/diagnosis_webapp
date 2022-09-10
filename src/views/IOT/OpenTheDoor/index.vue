<template>
  <div class="open-the-door container">
    <Breadcrumb :items="['IOT模块', '云开门']" />
    <a-row style="width: 100%" :gutter="[8, 8]">
      <a-col v-for="(item, index) in deviceList" :key="index" :xs="12" :sm="8" :md="6" :lg="6" :xl="4" :xxl="3">
        <a-tooltip :content="openedDoorIndex[index] ? '此门已开' : '点击开门'">
          <a-card
            hoverable
            :class="openedDoorIndex[index] ? '' : 'card'"
            :body-style="{ 'flex-direction': 'column', 'align-items': 'center', cursor: openedDoorIndex[index] ? 'not-allowed' : 'pointer' }"
            @click="open(item.deviceId, index)"
          >
            <div class="image">
              <img v-show="openedDoorIndex[index]" :src="require('@/assets/open_door.svg')" alt="" />
              <img v-show="!openedDoorIndex[index]" :src="require('@/assets/close_door.svg')" alt="" />
            </div>
            <div class="name">{{ item.deviceName }}</div>
          </a-card>
        </a-tooltip>
      </a-col>
    </a-row>
    <a-empty v-if="deviceList.length === 0"></a-empty>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import OpenTheDoor, { OpenTheDoorModel } from "@/api/tenant/OpenTheDoor";
import Message from "@/utils/Message";
export default defineComponent({
  name: "open-the-door",
  components: {
    Breadcrumb,
  },
  setup() {
    const deviceList = ref<OpenTheDoorModel[]>([]);
    const openedDoorIndex = reactive<Record<number, boolean>>({});
    const loading = ref(false);
    const loadData = () => {
      loading.value = true;
      const close = Message.delayLoading("加载中...", 500);
      onUnmounted(close);
      OpenTheDoor.getAll()
        .then((res) => {
          deviceList.value = res;
          res.forEach((item, index) => {
            openedDoorIndex[index] = false;
          });
        })
        .finally(() => {
          loading.value = false;
          close?.();
        });
    };
    loadData();
    const open = (id: string, index: number) => {
      if (!openedDoorIndex[index]) {
        OpenTheDoor.open(id).then((res) => {
          Message.success(`打开${deviceList.value[index].deviceName}成功`);
        });
        openedDoorIndex[index] = true;
        setTimeout(() => {
          openedDoorIndex[index] = false;
        }, 4000);
      }
    };
    return {
      deviceList,
      loading,
      openedDoorIndex,
      open,
    };
  },
});
</script>

<style lang="less" scoped>
.open-the-door {
  .image {
    width: 100%;
    height: 100%;
    padding: 12px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name {
    text-align: center;
    width: 100%;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.card {
  transition: all 0.2s;
}
.card:hover {
  transform: translateY(-4px);
}
</style>
