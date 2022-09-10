<template>
  <div v-if="showVue" class="main">
    <div class="delete_bt" @click="quit">X</div>
    <div>
      <iframe class="network_show" name="content_fram" :src="jumpUrl" frameborder="0" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "preview-window",
  props: {
    preViewUrl: String,
  },
  setup(props) {
    const showVue = ref(false);
    const jumpUrl = ref(props.preViewUrl);
    watch(
      () => props.preViewUrl,
      (newValue, oldValue) => {
        jumpUrl.value = newValue;
      },
    );
    const quit = () => {
      if (showVue.value) {
        showVue.value = false;
      } else {
        showVue.value = true;
      }
    };
    return { quit, showVue, jumpUrl };
  },
});
</script>

<style lang="less">
.main {
  background-color: #fff;
  border: 2px solid rgba(0, 0, 0, 0.2);
  width: 300px;
  height: 680px;
}
.delete_bt {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: black;
  color: #fff;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  opacity: 0.3;
}
.delete_bt:hover {
  opacity: 0.7;
  cursor: pointer;
}
.network_show {
  height: 680px;
}
</style>
