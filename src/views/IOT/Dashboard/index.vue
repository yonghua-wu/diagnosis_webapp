<template>
  <div class="dashboard-view container">
    <Breadcrumb :items="['IOT设备', 'IOT监控']" />
    <!-- <a-card> -->
    <a-row :gutter="[12, 12]">
      <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
        <SeeingCard :title="'总览'">
          <a-row :gutter="[12, 12]" style="font-size: 12px; font-weight: bold">
            <a-col :span="4"> </a-col>
            <a-col :span="5" style="text-align: center"> 关闭 </a-col>
            <a-col :span="5" style="text-align: center"> 开启 </a-col>
            <a-col :span="5" style="text-align: center"> 未知 </a-col>
            <a-col :span="5" style="text-align: center"> 异常 </a-col>
          </a-row>
          <a-row :gutter="[12, 12]" v-for="(room, roomIndex) in roomData" :key="roomIndex">
            <a-col :span="4" style="text-align: right">{{ room.name }}</a-col>
            <a-col :span="5" style="text-align: center">{{ room.deviceList.filter((item) => item.status === 0).length }}</a-col>
            <a-col :span="5" style="text-align: center">{{ room.deviceList.filter((item) => item.status === 1).length }}</a-col>
            <a-col :span="5" style="text-align: center">{{ room.deviceList.filter((item) => item.status === -1).length }}</a-col>
            <a-col :span="5" style="text-align: center">{{ room.deviceList.filter((item) => item.status === -2).length }}</a-col>
          </a-row>
        </SeeingCard>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" :xxl="6" v-for="(room, roomIndex) in roomData" :key="roomIndex">
        <SeeingCard :title="room.name">
          <a-row :gutter="[8, 8]">
            <a-col :span="8" v-for="(device, deviceIndex) in room.deviceList" :key="'' + roomIndex + deviceIndex">
              <DeviceCard :deviceData="device" />
            </a-col>
          </a-row>
        </SeeingCard>
      </a-col>
    </a-row>
    <!-- </a-card> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SeeingCard from "./components/SeeingCard.vue";
import DeviceCard from "./components/DeviceCard.vue";
import TbConnect from "@/utils/TbConnect";
export default defineComponent({
  name: "DashboardView",
  components: {
    Breadcrumb,
    SeeingCard,
    DeviceCard,
  },
  setup() {
    const delayFlag = ref(2);
    const switchCellback = (value: boolean, point: string) => {
      delayFlag.value = 1;
      return TbConnect.setSwitchStatus(value, "e535c000-bafd-11ec-af95-a17ea9952626", point);
    };

    const roomData = reactive([
      {
        name: "办公室",
        deviceList: [
          {
            deviceType: "会议室",
            deviceTitle: "会议室温湿度",
            controlType: "",
            status: -1, // 未知 -1 ； 关闭 0 ； 运行 1 ； 异常 -2 ；
            block: ["#2", "#1"],
            summmary: "",
            data: { "#2": { value: "", format: (v: string) => v + "℃" }, "#1": { value: "", format: (v: string) => v + "%" } },
          },
          {
            deviceType: "办公区",
            deviceTitle: "办公区温湿度",
            controlType: "",
            status: -1, // 未知 -1 ； 关闭 0 ； 运行 1 ； 异常 -2 ；
            block: ["#4", "#3"],
            summmary: "",
            data: { "#4": { value: "", format: (v: string) => v + "℃" }, "#3": { value: "", format: (v: string) => v + "%" } },
          },
          {
            deviceType: "办公室",
            deviceTitle: "玻璃门开锁控制",
            controlType: "switch",
            status: -1, // 未知 -1 ； 关闭 0 ； 运行 1 ； 异常 -2 ；
            block: ["#11"],
            summmary: "",
            data: {
              "#11": { value: "", format: (v: string) => (v === "true" ? "打开" : "关闭"), switchCellback: (v: any) => switchCellback(v, "#11") },
            },
          },
          {
            deviceType: "办公室",
            deviceTitle: "玻璃门左侧开闭状态",
            controlType: "",
            status: -1, // 未知 -1 ； 关闭 0 ； 运行 1 ； 异常 -2 ；
            block: ["#13"],
            summmary: "",
            data: { "#13": { value: "", format: (v: string) => (v === "true" ? "关闭" : "打开") } },
          },
          {
            deviceType: "办公室",
            deviceTitle: "玻璃门右侧开闭状态",
            controlType: "",
            status: -1, // 未知 -1 ； 关闭 0 ； 运行 1 ； 异常 -2 ；
            block: ["#14"],
            summmary: "",
            data: { "#14": { value: "", format: (v: string) => (v === "true" ? "关闭" : "打开") } },
          },
          {
            deviceType: "储藏室",
            deviceTitle: "储藏室门开闭状态",
            controlType: "",
            status: -1, // 未知 -1 ； 关闭 0 ； 运行 1 ； 异常 -2 ；
            block: ["#17"],
            summmary: "",
            data: { "#17": { value: "", format: (v: string) => (v === "true" ? "关闭" : "打开") } },
          },
        ],
      },
    ]);

    const tsSubCmds = [
      {
        cmdId: 1,
        entityId: "e535c000-bafd-11ec-af95-a17ea9952626",
        entityType: "DEVICE",
        scope: "LATEST_TELEMETRY",
        unsubscribe: false,
      },
    ];

    TbConnect.subscribe(tsSubCmds, (msg) => {
      if (delayFlag.value < 2) {
        delayFlag.value += 1;
      } else {
        roomData.forEach((room) => {
          room.deviceList.forEach((device) => {
            device.block.forEach((b) => {
              if (msg.data[b]) {
                (device.data as any)[b]["value"] = msg.data[b][0][1];
                if (msg.data[b][0][1] === "true") {
                  device.status = 0;
                } else if (msg.data[b][0][1] === "false") {
                  device.status = 1;
                } else {
                  device.status = 1;
                }
                if (b === "#11") {
                  device.status = msg.data[b][0][1] === "false" ? 0 : 1;
                }
              }
            });
          });
        });
      }
    });

    onBeforeUnmount(() => {
      TbConnect.unsubscribe(tsSubCmds);
    });
    return {
      roomData,
    };
  },
});
</script>

<style lang="less" scoped>
.dashboard-view {
}
</style>
