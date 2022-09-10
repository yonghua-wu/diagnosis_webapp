<template>
  <div class="real-time-video">
    <div class="player-area" ref="refPlayerArea">
      <div
        @drop="() => drop(index)"
        @dragover="$event.preventDefault()"
        :class="['player-item', playCountDesc.cls]"
        v-for="(item, index) in sensorList"
        :key="index"
      >
        <RealtimeVideoPlayer :cameraConfig="item" />
      </div>
    </div>
    <div class="control-area">
      <a-dropdown @select="handlePlayCount">
        <a-button>{{ playCountDesc.text }}<icon-down /></a-button>
        <template #content>
          <a-doption :value="9">3x3</a-doption>
          <a-doption :value="4">2x2</a-doption>
          <a-doption :value="1">1x1</a-doption>
        </template>
      </a-dropdown>
      <a-button @click="onFullScreen"> <i class="a-icon-full-screen"></i> 全屏</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, watch } from "vue";
import RealtimeVideoPlayer from "./RealtimeVideoPlayer.vue";
import eventBus from "@/utils/eventBus";
export default defineComponent({
  components: {
    RealtimeVideoPlayer,
  },
  setup() {
    const listStr = localStorage.getItem("video-play-list");
    let list;
    if (listStr?.length) {
      list = JSON.parse(listStr).map((item: any) => {
        item.src = "";
        return item;
      });
    } else {
      list = Array(...Array(9)).map(() => {
        return {
          src: "",
          status: "CLOSE",
          uuid: "",
          proxyType: "NVR",
          tag: "STREAM_SUB",
          data: {
            //
          },
        };
      });
    }
    const playList = reactive(list);
    const playCount = ref(9);

    const drop = (index: number) => {
      console.log(index);
      nextTick(() => {
        eventBus.emit("dropSensor", (sensor: any) => {
          console.log(sensor);
          playList[index] = {
            ...playList[index],
            status: "UNSET",
            data: sensor,
          };
        });
      });
    };
    watch(
      playList,
      () => {
        localStorage.setItem("video-play-list", JSON.stringify(playList));
      },
      {
        deep: true,
      },
    );
    const sensorList = computed(() => {
      return playList.slice(0, playCount.value);
    });
    const playCountDesc = computed(() => {
      switch (playCount.value) {
        case 9:
          return {
            text: "3x3",
            cls: "x3",
          };
        case 4:
          return {
            text: "2x2",
            cls: "x2",
          };
        case 1:
          return {
            text: "1x1",
            cls: "x1",
          };
        default:
          return {
            text: "",
            cls: "",
          };
      }
    });
    const refPlayerArea = ref(null);
    const onFullScreen = () => {
      let fullarea = refPlayerArea.value as unknown as Element;
      fullarea.requestFullscreen();
      // if (fullarea.requestFullscreen) {
      // }
      // else if (fullarea.webkitRequestFullScreen) {
      //   fullarea.webkitRequestFullScreen();
      // } else if (fullarea.mozRequestFullScreen) {
      //   fullarea.mozRequestFullScreen();
      // } else if (fullarea.msRequestFullscreen) {
      //   fullarea.msRequestFullscreen();
      // }
    };
    const handlePlayCount = (v: any) => {
      // console.log("v", v);
      playCount.value = v;
    };
    return {
      playList,
      playCount,
      playCountDesc,
      sensorList,
      refPlayerArea,
      drop,
      onFullScreen,
      handlePlayCount,
    };
  },
});
</script>

<style lang="less" scoped>
.real-time-video {
  height: 100%;
  display: flex;
  flex-direction: column;
  .player-area {
    // flex: 1;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    .player-item {
      box-sizing: border-box;
      flex: 0 0 33.333333%;
      height: 33.333333%;
      border-top: 1px solid #999;
      border-left: 1px solid #999;
      background-color: #555;
    }
    .x3 {
      flex: 0 0 33.333333%;
      height: 33.333333%;
      &:nth-child(3n) {
        border-right: 1px solid #999;
      }
      &:not(:nth-last-child(n + 4)) {
        border-bottom: 1px solid #999;
      }
    }
    .x2 {
      flex: 0 0 50%;
      height: 50%;
      &:nth-child(2n) {
        border-right: 1px solid #999;
      }
      &:not(:nth-last-child(n + 3)) {
        border-bottom: 1px solid #999;
      }
    }
    .x1 {
      flex: 0 0 100%;
      height: 100%;
      border: 1px solid #999;
    }
  }
  .control-area {
    height: 50px;
    // padding: 0px 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    & > * {
      margin-right: 12px;
    }
    .ctrl {
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      color: #555;
      height: 25px;
      width: 40px;
      border-radius: var(--border-radius-small);
      &:hover {
        color: rgb(var(--primary-6));
        background-color: var(--color-fill-2);
      }
    }
  }
}
</style>
