<template>
  <div class="real-time-video-play">
    <div v-if="theCameraConfig.status === 'UNPLAY'"></div>
    <div v-else-if="theCameraConfig.status === 'UNSET'" class="unset">
      <a-form :model="theCameraConfig" size="mini" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }">
        <a-form-item label="拉流方式">
          <a-radio-group v-model="theCameraConfig.proxyType">
            <a-radio :value="'CAMERA'">摄像头</a-radio>
            <a-radio :value="'NVR'">NVR</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="拉流类型">
          <a-radio-group v-model="theCameraConfig.tag">
            <a-radio :value="'STREAM_MAIN'">主码流</a-radio>
            <a-radio :value="'STREAM_SUB'">子码流</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="">
          <a-space>
            <a-button type="primary" @click="onPlay">播放</a-button>
            <a-button @click="onCancel">关闭</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <a-spin class="loading-src" v-else-if="theCameraConfig.status === 'LOADING_SRC'" :loading="true">
      <div class="video-control">
        <div class="info">{{ theCameraConfig.data.name }}</div>
        <div class="ctrl">
          <span @click="onClose">关闭</span>
        </div>
      </div>
    </a-spin>
    <div class="playing" v-else-if="theCameraConfig.status === 'PLAYING'">
      <video class="video-js" ref="refVideoPlay"></video>
      <div class="video-control">
        <div class="info">{{ theCameraConfig.data.name }}</div>
        <div class="ctrl">
          <span @click="onClose">关闭</span>
          <span @click="onReload">设置</span>
          <span @click="onEnterFullscreen">全屏</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, Ref, ref, toRefs } from "vue";
import http from "@/api/edge/base";
import Message from "@/utils/Message";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-hls";

interface HlsVideoJsPlayer extends VideoJsPlayer {
  Hls: any;
}
const message = Message;
const theVideojs = videojs as unknown as HlsVideoJsPlayer;

export default defineComponent({
  props: {
    cameraConfig: Object,
  },
  setup(props) {
    const { cameraConfig } = toRefs(props);
    const theCameraConfig = cameraConfig as Ref<any>;
    let player: HlsVideoJsPlayer | null = null;
    const refVideoPlay = ref(null);
    const options = computed<VideoJsPlayerOptions>(() => {
      return {
        controls: false,
        preload: "auto",
        fluid: true,
        muted: true,
        loop: true,
        sources: [
          {
            src: theCameraConfig.value.src,
          },
        ],
        controlBar: {
          pictureInPictureToggle: false,
          playToggle: false,
        },
      };
    });
    const loadPlaySrc = (sensor: any) => {
      console.log("sensor", sensor);
      return http
        .post("/media/proxy_apply", {
          inputId: sensor.data.uuid,
          proxyType: sensor.proxyType,
          tag: sensor.tag,
        })
        .then((res: any) => {
          if (res.code !== "00200") {
            message.error("获取流地址失败");
          } else {
            sensor["src"] = process.env.VUE_APP_EDGE_BASE_URL + res.data.hlsVertx;
          }
        })
        .catch((err) => {
          if (err.response?.status && err.response?.status >= 400 && err.response?.status < 500) {
            message.error(err.response.data.msg);
          }
          return Promise.reject(err);
        });
    };
    const onCancel = () => {
      theCameraConfig.value.status = "CLOSE";
      theCameraConfig.value.data = {};
      theCameraConfig.value.src = "";
    };
    const onEnterFullscreen = () => {
      player?.requestFullscreen();
    };
    const onClose = () => {
      player && player.dispose();
      nextTick(() => {
        player = null;
        theCameraConfig.value.status = "CLOSE";
        theCameraConfig.value.data = {};
        theCameraConfig.value.src = "";
      });
    };
    const onReload = () => {
      player?.dispose();
      nextTick(() => {
        player = null;
        theCameraConfig.value.status = "UNPLAY";
        nextTick(() => {
          theCameraConfig.value.status = "UNSET";
        });
      });
    };
    const onPlay = () => {
      theCameraConfig.value.status = "LOADING_SRC";
      loadPlaySrc(theCameraConfig.value).then(() => {
        if (theCameraConfig.value.status === "CLOSE") {
          return Promise.reject();
        }
        theCameraConfig.value.status = "PLAYING";
        nextTick(() => {
          player = videojs(refVideoPlay.value as unknown as Element, options.value, function onPlayerReady() {
            //
          }) as HlsVideoJsPlayer;
          setTimeout(() => {
            player?.play();
          }, 1000);
          player.on("fullscreenchange", () => {
            player?.controls(!player?.controls()); // 在全屏下显示 controls
          });
        });
      });
    };
    onMounted(() => {
      theVideojs.Hls.xhr.beforeRequest = function (options: any) {
        options.headers = {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9.eyJzZXgiOjEsIm5hbWUiOiLnrqHnkIblkZgiLCJzYWx0IjoiOHB4N2RlOWwiLCJ1dWlkIjoiNDRiNmMwMjYtOTdmMi00Mjk5LTg2NjktOTc3YWVkMjQwYjYxIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJwaG9uZSI6IjEyMzQ1NiIsInN0YXR1cyI6MCwid3hTYWx0IjoiOGtnaWJoZGkiLCJhY2NvdW50IjoiYWRtaW4iLCJkZXB0SWRzIjpbImQ5NDRkOTA1LWY1OTAtNGJmNy1iZWZjLTI5NTQ5NzU4ZDE5NiJdLCJwb3N0SWRzIjpbImQ2OTE2ZmVmLTI4YTMtNDgzZi05YTFmLTRhZGJhYWU0NzY0ZCJdLCJyb2xlSWRzIjpbImFjZmY2NDU4LTJiOGMtNDNlMS1iZjRmLTY4ZTA0NWZkMTkyZSJdLCJiaXJ0aGRheSI6MTYzMzQ0OTYwMDAwMCwicGFzc3dvcmQiOiJiZTY3YWJlZGJhYWFmOTIwMzBhNDU4NDA1ZGYyM2E3YSIsInNwYWNlSWRzIjpbIklOVEVSTkFMIl0sInNwYWNlX2lkIjoiSU5URVJOQUwiLCJ3eE9wZW5pZCI6IjQyMzdkOWU1MWQ5NjcxZTYzYjljZTg5M2MxMWU0NWFkIiwiY3JlYXRlX2J5IjoiSU5URVJOQUwiLCJyZWFsX25hbWUiOiLnrqHnkIblkZgiLCJ1cGRhdGVfYnkiOiI0NGI2YzAyNi05N2YyLTQyOTktODY2OS05NzdhZWQyNDBiNjEiLCJ1c2VyX3V1aWQiOiI0NGI2YzAyNi05N2YyLTQyOTktODY2OS05NzdhZWQyNDBiNjEiLCJpc19kZWxldGVkIjowLCJjcmVhdGVfdGltZSI6MTYzMzY5MDQ0NjI1NSwidXBkYXRlX3RpbWUiOjE2Mzk1MzY2NTExNDksInNlbGVjdGVkU3BhY2VJZHMiOlsiSU5URVJOQUwiXSwiaWF0IjoxNjUwMjU1NjYyLCJleHAiOjE2NjU4MDc2NjJ9.AbQSOsSyawtm1580kvx7QpcQBJsqaGn7UUvfGrA0zabLexcscDj_L7ctJnq_yOB9Yt8H1DEeb2fbqByNsCECUYVuAfo1bHRfGMmOqaCS3Yuxr3WcSqHKHESYCJxz1IVUZ31tzWZTithHucgs6NPAMFuFwCawwbw9os7pFdlPiJAIMzH6",
        };
        return options;
      };
      // console.log(theCameraConfig.value);
      if (theCameraConfig.value.data?.uuid && (theCameraConfig.value.status === "UNPLAY" || theCameraConfig.value.status === "PLAYING")) {
        console.log(theCameraConfig.value.status);
        onPlay();
      }
    });
    onBeforeUnmount(() => {
      if (player) {
        player.dispose();
        player = null;
        theCameraConfig.value.status = "UNPLAY";
      }
    });
    return {
      refVideoPlay,
      theCameraConfig,
      onPlay,
      onCancel,
      onEnterFullscreen,
      onClose,
      onReload,
      loadPlaySrc,
    };
  },
});
</script>

<style lang="less" scoped>
.real-time-video-play {
  height: 100%;
  .unset {
    background-color: #ccc;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .loading-src,
  .playing {
    height: 100%;
    background-color: #000;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:hover {
      .video-control {
        // opacity: 1;
        background-color: rgba(0, 0, 0, 0.4);
        .ctrl {
          opacity: 1;
        }
      }
    }
    .video-control {
      z-index: 2001;
      transition: all 0.2s;
      // opacity: 0;
      background-color: unset;
      color: #fff;
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      top: 0px;
      padding-bottom: 20px;
      // display: flex;
      flex-direction: column;
      // justify-content: space-around;
      // align-items: center;
      .info {
        position: absolute;
        top: 0px;
        left: 10px;
        font-size: 16px;
        text-shadow: 0px 0px 5px #000;
      }
      .ctrl {
        position: absolute;
        bottom: 20px;
        opacity: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: flex-end;
        span {
          cursor: pointer;
        }
      }
    }
  }
}
:deep(.vjs-big-play-button) {
  display: none;
}
:deep(.video-js) {
  position: unset;
}
</style>
