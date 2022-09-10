<template>
  <div class="container device-access">
    <Breadcrumb :items="['设备管理', { name: '设备接入', router: () => $router.go(-1) }, 'A栋']" />
    <a-row :gutter="[12, 12]">
      <a-col flex="220px" v-for="item in Array(...Array(12)).map((k, i) => i)" :key="item">
        <a-card hoverable title="运行" :style="{ width: '220px' }">
          <template #extra>
            <a-switch v-model="status"></a-switch>
          </template>
          <div class="device" @click="() => clickDevice(item)">
            <div class="icon">
              <img :src="require('@/assets/temperature.svg')" alt="" />
            </div>
            <div class="name">温度传感器</div>
            <div class="posistion">D栋配电箱</div>
            <div class="reading">25.5℃</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <div class="pagination">
      <a-pagination :total="2" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
export default defineComponent({
  name: "DeviceAccess",
  components: {
    Breadcrumb,
  },
  setup() {
    const status = ref(false);
    const clickDevice = () => {
      console.log("clickDevice");
    };
    return {
      status,
      clickDevice,
    };
  },
});
</script>

<style lang="less" scoped>
.device-access {
  :deep(.arco-card-hoverable):hover {
    box-shadow: 0 4px 10px rgb(var(--gray-3));
  }
  :deep(.arco-card-body) {
    padding: unset;
  }
  .device {
    cursor: pointer;
    padding: 16px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > * {
      margin-bottom: 12px;
    }
    .icon {
      width: 50px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      font-size: 16px;
      font-weight: bold;
    }
    .posistion {
      font-size: 12px;
      color: var(--color-text-3);
    }
    .reading {
      font-weight: bold;
    }
  }
  .pagination {
    margin-top: 12px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
