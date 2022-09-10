<template>
  <div class="work-comment-detail-list">
    <WorkCommentDetail v-for="(item, index) in commentList" :key="index" :data="item" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import WorkCommentDetail from "./WorkCommentDetail.vue";
export default defineComponent({
  name: "work-comment-detail-list",
  components: {
    WorkCommentDetail,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const commentList = ref([]);
    const loadData = () => {
      //
    };
    if (props.id) {
      loadData();
    }
    return {
      commentList,
    };
  },
});
</script>

<style lang="less" scoped>
.work-comment-detail-list {
  width: 100%;
}
</style>
