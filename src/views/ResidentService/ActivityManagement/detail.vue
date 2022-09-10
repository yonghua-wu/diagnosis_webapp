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
                <a-form-item
                  filed="activityTitle"
                  :validate-status="validate.activityTitle.status"
                  :help="validate.activityTitle.help"
                  :rules="rules.activityTitle"
                  label="标题"
                >
                  <a-input
                    :style="{ width: '200px' }"
                    v-model="formData.activityTitle"
                    placeholder="请输入活动标题"
                    :disabled="pageModel === 'View'"
                  ></a-input>
                </a-form-item>
                <a-form-item filed="jumpUrlType" :rules="rules.jumpUrlType" label="类型">
                  <a-select
                    :style="{ width: '200px' }"
                    v-model="formData.jumpUrlType"
                    @change="typeSelect(formData.jumpUrlType)"
                    :disabled="pageModel === 'View'"
                  >
                    <a-option :value="0">不跳转</a-option>
                    <a-option :value="2">跳转</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="imgurl" :rules="rules.imgurl" label="封面图片">
                  <UploadVue
                    ref="refUploadVue"
                    :uploadType="'picture-card'"
                    v-model:file-list="formData.imgurl"
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
                  filed="activityUrl"
                  :validate-status="validate.activityUrl.status"
                  :help="validate.activityUrl.help"
                  :rules="rules.activityUrl"
                  label="URL"
                  :disabled="pageModel === 'View'"
                >
                  <a-input :style="{ width: '200px' }" v-model="formData.activityUrl" placeholder="请输入活动URL"></a-input>
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
                <a-form-item filed="signUp" :rules="rules.signUp" label="是否报名">
                  <a-radio-group v-model="formData.signUp" :style="{ width: '200px' }" :disabled="pageModel === 'View'">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="2">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item v-if="!isShow" filed="smsNotice" :rules="rules.smsNotice" label="是否发送消息" :disabled="pageModel === 'View'">
                  <a-radio-group v-model="formData.smsNotice">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="2">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  filed="activityTime"
                  :validate-status="validate.activityTime.status"
                  :help="validate.activityTime.help"
                  :rules="rules.activityTime"
                  label="生效时间"
                  :disabled="pageModel === 'View'"
                >
                  <a-range-picker showTime v-model="formData.activityTime" style="width: 410px" />
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
import CUVue, { useDetailPage } from "@/components/lib/CU";
import { useStartStopWatch } from "@/hooks/use";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { defineComponent, reactive, ref, watch, nextTick } from "vue";
import UploadVue from "@/components/lib/Upload.vue";
//表单组件
import MyEditor from "@/components/editorPreViewWindow/myEditor.vue";
import ActivityManagement, { CreateActivityModel } from "@/api/tenant/ActivityManagement";
import { useRoute, useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import Message from "@/utils/Message";
import { deepClone } from "@/utils/utils";
import { Modal } from "@arco-design/web-vue";
import previewWindow from "@/components/editorPreViewWindow/previewWindow.vue";

export default defineComponent({
  name: "activity-management-detail",
  components: {
    Breadcrumb,
    //SfForm,
    //SfFormItem,
    UploadVue,
    MyEditor,
    CUVue,
    previewWindow,
  },
  setup() {
    const detailInfo = ref<any>({});
    const formData = ref<any>({
      //活动标题
      activityTitle: "",
      //活动类型(url跳转类型) 0-不跳转 other 跳转
      jumpUrlType: 0,
      //活动内容 初始内容为<p><br></p>保证进入页面后，富文本内容不会自动修改
      contentUrl: "<p><br></p>",
      //活动内容 url
      activityUrl: "",
      //活动图片
      activityImg: "",
      //活动图片组
      imgurl: [],
      //活动选择小区
      //blockList: [],
      //是否报名
      signUp: 1,
      //是否发送短信
      smsNotice: 1,
      //活动时间
      activityTime: [],
      //优先级
      seq: 1,
      //状态
      status: 1,
    });
    //富文本组件
    const refEditor = ref();
    //表单组件
    const refForm = ref();
    //图片上传组件
    const refUploadVue = ref();
    //预览页面组件
    const refPreView = ref();
    //默认跳转页面的链接 VIEW必须加上
    const preViewUrl = ref("http://localhost:8888/#/index/view/");
    //只有在jumptype为0是才能预览
    const preViewBtDisable = ref(true);
    //复选框选项
    // const blockLoading = ref(true);
    // const blockOptions = ref<any>([]);
    // Block.getAll()
    //   .then((res) => {
    //     blockOptions.value = res.map((item) => {
    //       return {
    //         label: item.name,
    //         value: item.blockId,
    //       };
    //     });
    //   })
    //   .finally(() => {
    //     blockLoading.value = false;
    //   });
    const validate = reactive<Record<string, { status: "error" | "success" | "warning" | "validating" | undefined; help: string }>>({
      activityTitle: {
        status: undefined,
        help: "",
      },
      contentUrl: {
        status: undefined,
        help: "",
      },
      activityUrl: {
        status: undefined,
        help: "",
      },
      activityTime: {
        status: undefined,
        help: "",
      },
      // blockList: {
      //   status: undefined,
      //   help: "",
      // },
    });
    const rules = {
      activityTitle: [{ required: true, message: "请输入活动标题" }],
      jumpUrlType: [{ required: true, message: "请选择跳转类型" }],
      contentUrl: [{ required: true, message: "请输入活动内容" }],
      imgurl: [{ required: true, message: "请选择图片" }],
      activityUrl: [{ required: true, message: "请选择活动活动URL" }],
      //blockList: [{ required: true, message: "请选择小区" }],
      signUp: [{ required: true, message: "请选择是否报名" }],
      smsNotice: [{ required: true, message: "请选择是否发送消息" }],
      activityTime: [{ required: true, message: "请选择生效起止时间" }],
      seq: [{ required: true, message: "请输入活动排序" }],
      status: [{ required: true, message: "请选择停/启用状态" }],
    };

    const isShow = ref(false);
    const typeSelect = (ev: any) => {
      if (ev == 2) {
        isShow.value = true;
      } else if (ev == 0) {
        isShow.value = false;
      }
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

    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      console.log("route.params.id", route.params.id);
      ActivityManagement.detail(route.params.id as string)
        .then((res) => {
          console.log("res", res);
          formData.value = res;
          isShow.value = formData.value.jumpUrlType === 2 ? true : false;
          preViewBtDisable.value = formData.value.jumpUrlType === 0 && pageModel.value === "View" ? false : true;
          formData.value.activityTime = [formData.value.activityStartTime, formData.value.activityEndTime];
          formData.value.imgurl = [mapImg(formData.value.activityImg)];
          if (formData.value.jumpUrlType === 0) {
            fetch(formData.value.activityUrl)
              .then((response) => response.text())
              .then((data) => {
                detailInfo.value = deepClone(res);
                refEditor.value.valueHtml = data.substring(62, data.length - 14);
                detailInfo.value.contentUrl = data.substring(62, data.length - 14);
                showModalTips.value = false;
                nextTick(startWatch);
              });
          } else {
            detailInfo.value = deepClone(res);
            showModalTips.value = false;
            nextTick(startWatch);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };
    if (pageModel.value && pageModel.value !== "Add") {
      loadData();
    } else {
      startWatch();
    }
    watch(pageModel, () => {
      if (pageModel.value && pageModel.value !== "Add") {
        loadData();
      } else {
        startWatch();
      }
    });

    const router = useRouter();
    const createData = (url: string) => {
      const submitData: CreateActivityModel = {
        activityTitle: formData.value.activityTitle,
        //暂时还需要 后续会删除 activityName
        activityName: formData.value.activityTitle,
        jumpUrlType: formData.value.jumpUrlType,
        activityImg: formData.value.imgurl[0].response,
        activityUrl: url,
        //blockList: formData.value.blockList,
        signUp: formData.value.signUp,
        activityEndTime: formData.value.activityTime[1],
        activityStartTime: formData.value.activityTime[0],
        seq: formData.value.seq,
        activityType: formData.value.signUp == 1 ? 2 : 1,
        status: formData.value?.status,
        smsNotice: formData.value.smsNotice,
      };
      console.log(submitData);
      ActivityManagement.create(submitData)
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => {
          btnsLoading.value = false;
          router.push({ name: "ActivityManagement" });
        });
    };

    const updateData = (id: string, res?: string) => {
      const submitData = {
        activityId: id,
        activityTitle: detailInfo.value.activityTitle === formData.value.activityTitle ? undefined : formData.value.activityTitle,
        activityName: detailInfo.value.activityTitle === formData.value.activityTitle ? undefined : formData.value.activityTitle,
        jumpUrlType: detailInfo.value.jumpUrlType === formData.value.jumpUrlType ? undefined : formData.value.jumpUrlType,
        activityImg: detailInfo.value.activityImg === formData.value.imgurl[0].response ? undefined : formData.value.imgurl[0].response,
        activityUrl: res ? res : detailInfo.value.activityUrl === formData.value.activityUrl ? undefined : formData.value.activityUrl,
        //blockList: detailInfo.value.blockList === formData.value.blockList ? undefined : formData.value.blockList,
        signUp: detailInfo.value.signUp === formData.value.signUp ? undefined : formData.value.signUp,
        activityType: formData.value.signUp == 1 ? 2 : 1,
        seq: detailInfo.value.seq === formData.value.seq ? undefined : formData.value.seq,
        smsNotice: detailInfo.value.seq === formData.value.smsNotice ? undefined : formData.value.smsNotice,
        status: detailInfo.value.status === formData.value.status ? undefined : formData.value.status,
        activityEndTime:
          detailInfo.value.activityEndTime === formData.value.activityTime[1] && detailInfo.value.activityStartTime === formData.value.activityTime[0]
            ? undefined
            : formData.value.activityTime[1],
        activityStartTime:
          detailInfo.value.activityEndTime === formData.value.activityTime[1] && detailInfo.value.activityStartTime === formData.value.activityTime[0]
            ? undefined
            : formData.value.activityTime[0],
      };
      console.log(submitData);
      ActivityManagement.updateDetailInfo(submitData)
        .then((res) => {
          router.push({ name: "ActivityManagement" });
        })
        .catch((err) => {
          Message.error(err.msg || "更新失败");
        });
    };

    const handleSubmit = () => {
      //判断是否为编辑且未修改
      if (pageModel.value == "Edit" && showModalTips.value === false) {
        Message.error("活动内容未进行修改，无法提交");
        return;
      }

      let flag = true;
      btnsLoading.value = true;
      //标题验证
      if (formData.value.activityTitle === "") {
        validate.activityTitle.status = "error";
        validate.activityTitle.help = "请输入活动标题";
        flag = false;
      } else {
        validate.activityTitle.status = undefined;
        validate.activityTitle.help = "";
      }
      //活动内容验证 在非跳转的情况下
      if (formData.value.jumpUrlType === 0 && (formData.value.contentUrl === "" || formData.value.contentUrl === "<p><br></p>")) {
        validate.contentUrl.status = "error";
        validate.contentUrl.help = "请输入活动内容介绍";
        flag = false;
      } else {
        validate.contentUrl.status = undefined;
        validate.contentUrl.help = "";
      }
      //活动链接验证 在跳转的情况下
      if (formData.value.jumpUrlType === 2 && formData.value.activityUrl === "") {
        validate.activityUrl.status = "error";
        validate.activityUrl.help = "请输入活动链接";
        flag = false;
      } else {
        validate.activityUrl.status = undefined;
        validate.activityUrl.help = "";
      }
      //活动链接合法性校验
      const expression = new RegExp(
        "(\\$\\{protocol\\}|http(s)?)://(([A-Za-z0-9-]+\\.)*([A-Za-z0-9-]+\\.[A-Za-z0-9]+))+((/?)(([A-Za-z0-9\\._\\-]+)(/){0,1}[A-Za-z0-9.-/]*)){0,1}",
        "i",
      );
      if (!expression.test(formData.value.activityUrl) && formData.value.jumpUrlType === 2) {
        validate.activityUrl.status = "error";
        validate.activityUrl.help = "活动链接格式错误";
        flag = false;
      } else {
        validate.activityUrl.status = undefined;
        validate.activityUrl.help = "";
      }
      //活动起止时间验证
      if (formData.value.activityTime.length === 0) {
        validate.activityTime.status = "error";
        validate.activityTime.help = "请选择活动起止时间";
        flag = false;
      } else {
        validate.activityTime.status = undefined;
        validate.activityTime.help = "";
      }
      //选择小区验证
      // if (formData.value.blockList.length === 0) {
      //   validate.blockList.status = "error";
      //   validate.blockList.help = "请选择活动小区";
      //   flag = false;
      // } else {
      //   validate.blockList.status = undefined;
      //   validate.blockList.help = "";
      // }

      if (flag) {
        if (pageModel.value === "Add") {
          refUploadVue.value.submit().then(() => {
            //存在富文本 不跳转选项
            if (formData.value.jumpUrlType == 0) {
              refEditor.value.submit().then((res: any) => {
                createData(res);
              });
            }
            //不存在富文本 跳转选项
            else if (formData.value.jumpUrlType == 2) {
              createData(formData.value.activityUrl);
            }
          });
        } else if (pageModel.value === "Edit") {
          // 判断jumpType是否改变
          if (formData.value.jumpUrlType === detailInfo.value.jumpUrlType) {
            //未改变
            //再判断之前富文本内容是否为空
            if (refEditor.value.valueHtml === "<p><br></p>") {
              //为空
              updateHtmlContent();
            } else {
              const whetherEqual = detailInfo.value.contentUrl === refEditor.value.valueHtml;
              updateHtmlContent(!whetherEqual);
            }
          } else {
            //改变
            if (detailInfo.value.contentUrl === undefined) {
              //为空,说明从url变成content
              updateHtmlContent(true);
            } else {
              updateHtmlContent(false);
            }
          }
        }
      } else {
        btnsLoading.value = false;
      }
    };

    //转换图片格式
    const mapImg = (url: string) => {
      return {
        uid: 0,
        url: url,
        name: url,
        response: url,
        status: "done",
      };
    };

    const goEdit = () => {
      router.push({ name: "ActivityManagementDetail", params: { model: "Edit", id: route.params.id } });
    };

    //返回
    const goBack = () => {
      checkEdited().then((res) => {
        if (res) {
          if (history.state.back) {
            router.go(-1);
          } else {
            router.push({ name: "ActivityManagement" });
          }
        }
      });
    };

    //预览
    const goPreview = () => {
      preViewUrl.value =
        preViewUrl.value +
        "ActivityId=" +
        route.params.id +
        "&BlockId=" +
        detailInfo.value.blockId +
        "&TenantId=" +
        detailInfo.value.tenantId +
        "&Platform=web&Version=v0.0.1&Timestamp=1660813190467";
      console.log(preViewUrl.value);
      refPreView.value.quit();
    };

    const checkEdited = async () => {
      if (showModalTips.value) {
        try {
          await new Promise<boolean>((resolve, reject) => {
            Modal.warning({
              title: "提示",
              content: "信息未保存，确定退出编辑？",
              closable: true,
              cancelText: "取消",
              hideCancel: false,
              onOk: () => {
                resolve(true);
              },
              onCancel: () => {
                reject(false);
              },
            });
          });
          return true;
        } catch (e) {
          console.log("cancel");
          return false;
        }
      } else {
        return true;
      }
    };

    //修改富文本内容
    const updateHtmlContent = (updateHTML?: boolean) => {
      //首先判断图片是否修改;
      if (refUploadVue.value.fileList[0].url === detailInfo.value.activityImg) {
        //未修改
        //再判断是否通过富文本修改
        if (!updateHTML) {
          //未通过
          updateData(route.params.id as string);
        } else {
          //通过
          refEditor.value.submit().then((res: any) => {
            updateData(route.params.id as string, res);
          });
        }
      } else {
        //已修改
        //再判断是否通过富文本修改
        if (!updateHTML) {
          //未通过
          refUploadVue.value.submit().then(() => {
            updateData(route.params.id as string);
          });
        } else {
          //通过
          refUploadVue.value.submit().then(() => {
            refEditor.value.submit().then((res: any) => {
              updateData(route.params.id as string, res);
            });
          });
        }
      }
    };

    return {
      formData,
      refForm,
      pageModel,
      pageModelName,
      showModalTips,
      refPreView,
      //blockOptions,
      //blockLoading,
      btnsLoading,
      loading,
      //根据isshow判定显示活动内容还是url
      isShow,
      typeSelect,
      refUploadVue,
      goBack,
      rules,
      handleSubmit,
      validate,
      refEditor,
      isReadOnly,
      goEdit,
      goPreview,
      preViewUrl,
      preViewBtDisable,
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
  top: 10px;
  left: 40%;
}
</style>
