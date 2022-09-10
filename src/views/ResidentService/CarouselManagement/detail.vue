<template>
  <div>
    <div class="activity-management-detail container">
      <Breadcrumb :items="['客户服务', { name: '活动管理', router: () => $router.replace({ name: 'ActivityManagement' }) }, pageModelName]" />
      <a-spin :loading="loading" style="width: 100%">
        <CUVue :showModalTips="showModalTips">
          <template #extra>
            <a-button type="primary" v-if="pageModel === 'View'" @click="goPreview" :disabled="preViewBtDisable">预览</a-button>
            <a-button type="primary" v-if="pageModel === 'View'" @click="goEdit"> 编辑 </a-button>
          </template>
          <a-row>
            <a-col :md="12" :lg="12" :xl="10" :xxl="7" :xs="24" :sm="24">
              <a-form
                ref="refForm"
                :model="formData"
                style="margin-right: 12px; width: 550px"
                @submit="handleSubmit"
                :disabled="pageModel === 'View'"
              >
                <a-form-item filed="title" :validate-status="validate.title.status" :help="validate.title.help" :rules="rules.title" label="标题">
                  <a-input :style="{ width: '200px' }" v-model="formData.title" placeholder="请输入标题" :disabled="pageModel === 'View'"></a-input>
                </a-form-item>
                <a-form-item filed="jumpType" :rules="rules.jumpType" label="类型">
                  <a-select
                    :style="{ width: '200px' }"
                    v-model="formData.jumpType"
                    @change="jumpTypeSelect(formData.jumpType)"
                    :disabled="pageModel === 'View'"
                  >
                    <a-option :value="0">自定义</a-option>
                    <a-option :value="2">跳转URL</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="imgList" :rules="rules.imgList" label="封面图片">
                  <UploadVue
                    ref="refUploadVue"
                    :uploadType="'picture-card'"
                    v-model:file-list="formData.imgList"
                    :limit="1"
                    :disabled="pageModel === 'View'"
                  />
                </a-form-item>
                <a-form-item
                  v-show="!isShow"
                  filed="contentUrl"
                  :validate-status="validate.contentUrl.status"
                  :help="validate.contentUrl.help"
                  :rules="rules.contentUrl"
                  label="活动内容"
                >
                  <div class="combinedStyle">
                    <MyEditor ref="refEditor" v-model:contentUrl="formData.contentUrl" v-model:isReadOnly="isReadOnly" :scroll="false" />
                  </div>
                </a-form-item>
                <a-form-item
                  v-if="isShow"
                  filed="url"
                  :validate-status="validate.url.status"
                  :help="validate.url.help"
                  :rules="rules.url"
                  label="URL"
                  :disabled="pageModel === 'View'"
                >
                  <a-input :style="{ width: '200px' }" v-model="formData.url" placeholder="请输入活动URL"></a-input>
                </a-form-item>
                <!-- <a-form-item
                filed="blockList"
                :rules="rules.blockList"
                :validate-status="validate.blockList.status"
                :help="validate.blockList.help"
                label="选择小区"
              >
                <a-select
                  v-model="formData.blockList"
                  :options="blockOptions"
                  :loading="blockLoading"
                  :style="{ width: '410px' }"
                  placeholder="请选择活动小区"
                  multiple
                  :max-tag-count="3"
                  allow-clear
                  :disabled="pageModel === 'View'"
                >
                </a-select>
              </a-form-item> -->
                <!-- <a-form-item filed="signUp" :rules="rules.signUp" label="是否报名">
                  <a-radio-group v-model="formData.signUp" :style="{ width: '200px' }" :disabled="pageModel === 'View'">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="2">否</a-radio>
                  </a-radio-group>
                </a-form-item> -->
                <!-- <a-form-item v-if="!isShow" filed="smsNotice" :rules="rules.smsNotice" label="是否发送消息" :disabled="pageModel === 'View'">
                  <a-radio-group v-model="formData.smsNotice">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="2">否</a-radio>
                  </a-radio-group>
                </a-form-item> -->
                <a-form-item
                  filed="activityTime"
                  :validate-status="validate.times.status"
                  :help="validate.times.help"
                  :rules="rules.times"
                  label="生效时间"
                  :disabled="pageModel === 'View'"
                >
                  <a-range-picker showTime v-model="formData.times" style="width: 410px" />
                </a-form-item>
                <a-form-item filed="seq" :rules="rules.seq" label="活动排序">
                  <a-input-number
                    placeholder="Please Enter"
                    v-model="formData.seq"
                    mode="button"
                    class="input-demo"
                    :style="{ width: '200px' }"
                    :disabled="pageModel === 'View'"
                  />
                </a-form-item>
                <a-form-item filed="status" :rules="rules.status" label="停/启用状态">
                  <a-radio-group v-model="formData.status" :disabled="pageModel === 'View'">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">停用</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div class="btns">
                  <a-form-item label="">
                    <a-space>
                      <a-button type="primary" html-type="submit" :loading="btnsLoading">保存</a-button>
                      <!-- <a-button type="primary" @click="submit" :loading="btnsLoading">保存</a-button> -->
                      <a-button :loading="btnsLoading" @click="goBack">返回</a-button>
                    </a-space>
                  </a-form-item>
                </div>
              </a-form>
            </a-col>
          </a-row>
        </CUVue>
      </a-spin>
    </div>
    <previewWindow class="extraVueStyle" ref="refPreView" v-if="pageModel === 'View'" v-model:preViewUrl="preViewUrl" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import Breadcrumb from "@/components/Breadcrumb.vue";
import UploadVue from "@/components/lib/Upload.vue";
import MyEditor from "@/components/editorPreViewWindow/myEditor.vue";
import previewWindow from "@/components/editorPreViewWindow/previewWindow.vue";
import { useStartStopWatch } from "@/hooks/use";
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import CarouselManagement, { CreateCarouselModel } from "@/api/tenant/CarouselManagement";

export default defineComponent({
  name: "carousel-management-view",
  components: {
    Breadcrumb,
    UploadVue,
    MyEditor,
    CUVue,
    previewWindow,
  },
  setup() {
    const router = useRouter();
    const detailInfo = ref<any>();
    const formData = ref<any>({
      //标题
      title: "",
      //类型 自定义和跳转url
      jumpType: 0,
      //轮播图内容 初始内容为<p><br></p>保证进入页面后，富文本内容不会自动修改
      contentUrl: "<p><br></p>",
      //跳转url
      url: "",
      //图片
      img: "",
      //图片组 绑定到组件上
      imgList: [],
      //优先级
      seq: 1,
      //状态
      status: 1,
      //时间
      times: [],
    });
    //富文本组件
    const refEditor = ref();
    //表单组件
    const refFrom = ref();
    //图片上传组件
    const refUploadVue = ref();
    //预览页面组件
    const refPreView = ref();
    //默认跳转页面的链接 PREVIEW表示
    const preViewUrl = ref("http://localhost:8888/#/index/preview/");
    //只有在jumptype为0是才能预览
    const preViewBtDisable = ref(true);
    const validate = reactive<Record<string, { status: "error" | "success" | "warning" | "validating" | undefined; help: string }>>({
      title: {
        status: undefined,
        help: "",
      },
      contentUrl: {
        status: undefined,
        help: "",
      },
      url: {
        status: undefined,
        help: "",
      },
      times: {
        status: undefined,
        help: "",
      },
      // blockList: {
      //   status: undefined,
      //   help: "",
      // },
    });
    const rules = {
      title: [{ required: true, message: "请输入活动标题" }],
      jumpType: [{ required: true, message: "请选择跳转类型" }],
      contentUrl: [{ required: true, message: "请输入轮播图内容" }],
      imgList: [{ required: true, message: "请选择图片" }],
      url: [{ required: true, message: "请输入轮播图跳转URL" }],
      //blockList: [{ required: true, message: "请选择小区" }],
      times: [{ required: true, message: "请选择生效起止时间" }],
      seq: [{ required: true, message: "请输入活动排序" }],
      status: [{ required: true, message: "请选择停/启用状态" }],
    };

    const isShow = ref(false);
    const jumpTypeSelect = (ev: any) => {
      loading.value = true;
      isShow.value = ev == 2 ? true : false;
      loading.value = false;
    };

    const showModalTips = ref(false);

    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });

    const { pageModel, pageModelName } = useDetailPage();
    const isReadOnly = computed(() => {
      if (pageModel.value === "View") {
        return true;
      } else {
        return false;
      }
    });
    //显示加载
    //页面加载
    const loading = ref(false);
    //按钮加载
    const btnsLoading = ref(false);

    const route = useRoute();

    const handleSubmit = () => {
      let flag = true;
      btnsLoading.value = true;
      //标题验证
      if (formData.value.title === "") {
        validate.title.status = "error";
        validate.title.help = "请输入标题";
        flag = false;
      } else {
        validate.title.status = undefined;
        validate.title.help = "";
      }
      //活动内容验证 在非跳转的情况下
      if (formData.value.jumpType === 0 && (formData.value.contentUrl === "" || formData.value.contentUrl === "<p><br></p>")) {
        validate.contentUrl.status = "error";
        validate.contentUrl.help = "请输入内容介绍";
        flag = false;
      } else {
        validate.contentUrl.status = undefined;
        validate.contentUrl.help = "";
      }
      //活动链接验证 在跳转的情况下
      if (formData.value.jumpType === 2 && formData.value.url === "") {
        validate.url.status = "error";
        validate.url.help = "请输入链接";
        flag = false;
      } else {
        validate.url.status = undefined;
        validate.url.help = "";
      }
      //活动链接合法性校验
      const expression = new RegExp(
        "(\\$\\{protocol\\}|http(s)?)://(([A-Za-z0-9-]+\\.)*([A-Za-z0-9-]+\\.[A-Za-z0-9]+))+((/?)(([A-Za-z0-9\\._\\-]+)(/){0,1}[A-Za-z0-9.-/]*)){0,1}",
        "i",
      );
      if (!expression.test(formData.value.url) && formData.value.jumpType === 2) {
        validate.url.status = "error";
        validate.url.help = "链接格式错误";
        flag = false;
      } else {
        validate.url.status = undefined;
        validate.url.help = "";
      }
      //活动起止时间验证
      if (formData.value.times.length === 0) {
        validate.times.status = "error";
        validate.times.help = "请选择起止时间";
        flag = false;
      } else {
        validate.times.status = undefined;
        validate.times.help = "";
      }

      console.log(formData.value);
      if (flag) {
        if (pageModel.value === "Add") {
          refUploadVue.value.submit().then(() => {
            //存在富文本
            if (formData.value.jumpType === 0) {
              refEditor.value.submit().then((res: any) => {
                createCarousel(res);
              });
            }
            //不存在富文本
            else if (formData.value.jumpType === 2) {
              createCarousel(formData.value.activityUrl);
            }
          });
        }
      }
    };

    //创建轮播图内容
    const createCarousel = (url: string) => {
      const submitData: CreateCarouselModel = {
        endTime: formData.value.times[1],
        imgUrl: formData.value.imgList[0].response,
        jumpContentId: url,
        jumpContentTitle: formData.value.title,
        jumpUrlType: formData.value.jumpType,
        seq: formData.value.seq,
        startTime: formData.value.times[0],
        status: formData.value.status,
      };
      console.log(submitData);
      CarouselManagement.create(submitData)
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => {
          btnsLoading.value = false;
          router.push({ name: "CarouselManagement" });
        });
    };

    const goPreview = () => {
      console.log("goPreview");
    };

    const goEdit = () => {
      console.log("goEdit");
    };

    const goBack = () => {
      console.log("go back");
    };

    return {
      detailInfo,
      formData,
      refEditor,
      refFrom,
      refUploadVue,
      refPreView,
      preViewUrl,
      preViewBtDisable,
      btnsLoading,
      loading,
      isReadOnly,
      pageModel,
      pageModelName,
      rules,
      validate,
      isShow,
      showModalTips,
      jumpTypeSelect,
      goPreview,
      goEdit,
      handleSubmit,
      goBack,
    };
  },
});
</script>

<style scoped lang="less">
.activity-management {
  width: 100%;
  height: 100%;
}
.btns {
  margin-left: 64px;
}
.itemStyle {
  width: 200px;
}
.combinedStyle {
  min-width: 300px;
  max-width: 300px;
  border: 1px solid var(--color-border-2);
}
.extraVueStyle {
  position: absolute;
  z-index: 999;
  top: 0px;
  left: 40%;
}
</style>
