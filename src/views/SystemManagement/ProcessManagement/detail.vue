<template>
  <div class="process-detail container">
    <Breadcrumb :items="['工单管理', { name: '流程管理', router: () => $router.replace({ name: 'ProcessManagement' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <a-form
          :model="formData"
          :disabled="pageModel === 'View'"
          style="max-width: 1500px"
          :label-col-props="{ span: 8 }"
          :wrapper-col-props="{ span: 16 }"
        >
          <a-space direction="vertical" fill>
            <a-space direction="vertical" fill>
              <a-row class="section-body" :gutter="2">
                <a-col :span="24">
                  <a-col :span="8">
                    <a-row class="section-title">
                      <a-form-item :row-props="{ gutter: 8 }"> 基本信息 </a-form-item>
                    </a-row>
                  </a-col>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="流程标识" field="key" :rules="[{ required: true, message: '流程标识不能为空' }]">
                    <a-input :max-length="50" v-model="formData.key" placeholder="请输入流标标识" />
                    <a-tooltip class="item" content="新建后，流程标识不可修改！" position="top">
                      <icon-question-circle />
                    </a-tooltip>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="流程名称" field="name" :rules="[{ required: true, message: '流程名称不能为空' }]">
                    <a-input :max-length="50" v-model="formData.name" placeholder="请输入流程名称" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="流程描述" field="description">
                    <a-input :max-length="50" type="textarea" v-model="formData.description" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="周期性流程">
                    <a-radio-group v-model="formData.isCron">
                      <a-radio :value="true">是</a-radio>
                      <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill v-if="formData.isCron">
              <a-row class="section-body" :gutter="2">
                <a-col :span="24">
                  <a-col :span="8">
                    <a-row class="section-title">
                      <a-form-item :row-props="{ gutter: 8 }"> 周期性流程配置 </a-form-item>
                    </a-row>
                  </a-col>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="每天" field="cronTerm" :rules="[{ required: true, message: '开始时间不能为空' }]">
                    <a-time-picker placeholder="起始时间" v-model="formData.cronTerm" format="HH:mm" disable-confirm> </a-time-picker>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :row-props="{ gutter: 8 }"
                    label="工单名称"
                    field="cronName"
                    :rules="[{ required: true, message: '工单名称不能为空' }]"
                  >
                    <a-input :max-length="50" v-model="formData.cronName" placeholder="请输入工单名称" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="工单描述" field="content">
                    <a-input :max-length="50" type="textarea" v-model="formData.content" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :row-props="{ gutter: 8 }"
                    label="服务归属"
                    field="ascription"
                    :rules="[{ required: true, message: '服务归属不能为空' }]"
                  >
                    <a-input :max-length="50" type="textarea" v-model="formData.ascription" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="任务地点" field="address" :rules="[{ required: true, message: '任务地点不能为空' }]">
                    <a-input :max-length="50" type="textarea" v-model="formData.address" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :row-props="{ gutter: 8 }"
                    label="处理人"
                    field="currentProcessor"
                    :rules="[{ required: true, message: '处理人不能为空' }]"
                  >
                    <a-input :max-length="50" type="textarea" v-model="formData.currentProcessor" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="审核人" field="approve" :rules="[{ required: true, message: '审核人不能为空' }]">
                    <a-input :max-length="50" type="textarea" v-model="formData.approve" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" label="预计收入" field="income">
                    <a-input :max-length="50" type="textarea" v-model="formData.income" allow-clear />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill>
              <a-row class="section-body" :gutter="2">
                <a-col :span="24">
                  <a-col :span="8">
                    <a-row class="section-title">
                      <a-form-item :row-props="{ gutter: 8 }"> 工作步骤 </a-form-item>
                    </a-row>
                  </a-col>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :row-props="{ gutter: 8 }"
                    v-for="(post, index) of formData.steps"
                    :field="`steps.${index}.value`"
                    :label="`步骤 ${index + 1}`"
                    :key="index"
                  >
                    <a-input :max-length="200" v-model="post.value" placeholder="请输入步骤描述" />
                    <a-button @click="handleDelete(index)" :style="{ marginLeft: '10px' }">删除</a-button>
                  </a-form-item>
                  <a-form-item :row-props="{ gutter: 8 }">
                    <a-button @click="handleAdd">
                      <template #icon>
                        <icon-plus />
                      </template>
                      添加步骤
                    </a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill>
              <a-row class="section-body" :gutter="2">
                <a-col :span="8">
                  <a-form-item :row-props="{ gutter: 8 }" v-if="pageModel !== 'View'">
                    <a-button type="primary" @click="clickSave">保存</a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
          </a-space>
        </a-form>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import { useStartStopWatch } from "@/hooks/use";
export default defineComponent({
  name: "process-detail",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const showModalTips = ref(false);

    const formData = ref<any>({
      steps: [],
    });
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });

    const handleAdd = () => {
      formData.value.steps.push({
        value: "",
      });
    };
    const handleDelete = (index: number) => {
      formData.value.steps.splice(index, 1);
    };

    const { pageModel, pageModelName } = useDetailPage();
    const loading = ref(false);
    const loadData = () => {
      //
    };

    const clickSave = () => {
      //
    };
    return {
      loading,
      pageModel,
      pageModelName,
      formData,
      showModalTips,
      clickSave,
      handleAdd,
      handleDelete,
    };
  },
});
</script>

<style lang="scss" scoped>
.process-detail {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
