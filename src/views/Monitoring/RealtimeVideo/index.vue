<template>
  <div class="container realtime-video-view">
    <Breadcrumb :items="['巡检中心', '实时视频']" />
    <a-card style="flex: 1; height: calc(100% - 56px)">
      <div class="content">
        <VideoLeftAside class="left-aside" />
        <VideoBoard class="video-board" />
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import VideoLeftAside from "./components/VideoLeftAside.vue";
import VideoBoard from "./components/VideoBoard.vue";
export default defineComponent({
  name: "RealtimeVideoView",
  components: {
    Breadcrumb,
    VideoLeftAside,
    VideoBoard,
  },
  setup() {
    //
  },
});
</script>

<style lang="less" scoped>
.realtime-video-view {
  padding-bottom: 0px;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  :deep(.arco-card-body) {
    width: 100%;
    height: 100%;
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .left-aside {
      width: 240px;
      height: 100%;
    }
    .video-board {
      flex: 1;
    }
  }
}
</style>
