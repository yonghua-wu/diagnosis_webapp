<template>
  <a-input-number ref="refInputNumber" v-model="tempNum" @click.stop="stopEnter"></a-input-number>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import ActivityManagement from "@/api/tenant/ActivityManagement";
import Message from "@/utils/Message";

export default defineComponent({
  name: "change-number-slot",
  props: {
    seq: {
      type: Number,
    },
    idString: {
      type: String,
    },
  },
  setup(props: any, { emit }) {
    const tempNum = ref(props.seq);
    const activityId = ref(props.idString);
    const refInputNumber = ref();
    const defaulNum = tempNum.value;
    watch(tempNum, (newValue) => {
      tempNum.value = newValue;
      if (tempNum.value != defaulNum) {
        ActivityManagement.updateSeq(activityId.value, tempNum.value).then(() => {
          emit("updateView");
          refInputNumber.value.blur();
          Message.success("成功");
        });
      }
    });
    const stopEnter = () => {
      console.log("修改活动顺序");
    };
    return {
      tempNum,
      stopEnter,
      refInputNumber,
    };
  },
});
</script>
