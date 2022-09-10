<template>
  <div class="space-form-place">
    <a-form
      :model="theFormData"
      @submit="handleSubmit"
      :label-col-props="{ span: 8 }"
      :wrapper-col-props="{ span: 16 }"
      style="max-width: 1500px"
      :disabled="model === 'View'"
    >
      <a-row class="section-body" :gutter="24">
        <a-col :span="8">
          <a-form-item field="name" label="名称" :row-props="{ gutter: 24 }">
            <a-input :max-length="50" v-model="theFormData.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="type" label="类型" :row-props="{ gutter: 24 }">
            <a-cascader :options="cateTree" v-model="theFormData.type" placeholder="请选择类型" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="level" label="层级" :row-props="{ gutter: 24 }">
            <a-select v-model="theFormData.level" placeholder="请选择层级">
              <a-option :value="0" label="虚拟空间" />
              <a-option :value="1" label="楼层" />
              <a-option :value="-1" label="地下室" />
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="theFormData.level !== 0">
          <a-form-item field="levelNum" label="层数" :row-props="{ gutter: 24 }">
            <a-input :max-length="50" v-model="theFormData.levelNum" placeholder="请输入层数" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="model !== 'View'">
        <a-col :span="8">
          <a-form-item>
            <a-space>
              <a-button html-type="submit" type="primary">保存</a-button>
              <a-button @click="clickCancel">取消</a-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts">
import Place from "@/api/tenant/Place";
import { useAppStore } from "@/store";
import eventBus from "@/utils/eventBus";
import { listToTree } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
export default defineComponent({
  name: "space-form-place",
  props: {
    formData: {
      type: Object,
      required: true,
    },
    model: {
      type: String,
      default: "Edit",
    },
  },
  emits: ["update:model"],
  setup(props, { emit }) {
    const loading = ref(false);
    const { formData } = toRefs(props);
    const theFormData = reactive({
      name: formData.value.name || "",
      type: formData.value.type || "",
      level: 0,
      levelNum: "",
    });
    if (formData.value.level === 0) {
      theFormData.level = 0;
    } else if (formData.value.level > 0) {
      theFormData.level = 1;
    } else {
      theFormData.level = -1;
    }
    theFormData.levelNum = formData.value.level;
    watch(formData, () => {
      theFormData.name = formData.value.name;
      theFormData.type = formData.value.type;
      if (formData.value.level === 0) {
        theFormData.level = 0;
      } else if (formData.value.level > 0) {
        theFormData.level = 1;
      } else {
        theFormData.level = -1;
      }
      theFormData.levelNum = formData.value.level;
    });
    const handleSubmit = (data: any) => {
      // console.log(data.values, formData);
      console.log("submit data: ", {
        name: data.values.name,
        type: data.values.type,
        level: data.values.levelNum,
        placeId: formData.value.placeId,
      });
      loading.value = true;
      Place.update({
        name: data.values.name,
        type: data.values.type,
        level: data.values.levelNum,
        placeId: formData.value.placeId,
        // blockId: formData.value.blockId,
        // hashKey: formData.value.hashKey,
        // parentId: formData.value.parentId,
        // qrCode: formData.value.qrCode,
        // qrImg: formData.value.qrImg,
        // status: formData.value.status,
      })
        .then(() => {
          emit("update:model", "View");
          eventBus.emit("loadParentNodeChildren", null);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const clickCancel = () => {
      theFormData.name = formData.value.name;
      theFormData.type = formData.value.type;
      if (formData.value.level === 0) {
        theFormData.level = 0;
      } else if (formData.value.level > 0) {
        theFormData.level = 1;
      } else {
        theFormData.level = -1;
      }
      theFormData.levelNum = formData.value.level;
      emit("update:model", "View");
    };

    const appStore = useAppStore();
    const cateTree = computed(() => {
      return appStore.cateTree;
    });

    return {
      loading,
      cateTree,
      theFormData,
      clickCancel,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.space-form-place {
  margin-top: 24px;
}
</style>
