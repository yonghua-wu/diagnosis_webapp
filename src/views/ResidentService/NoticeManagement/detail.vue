<template>
  <div class="add-employess container">
    <Breadcrumb :items="['客户服务', { name: '公告管理', router: () => $router.replace({ name: 'NoticeManagement' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <template #extra>
          <a-button type="primary" v-if="pageModel === 'View' && formData.state === 2" @click="goEdit"> 编辑 </a-button>
        </template>
        <a-form ref="refForm" :model="formData" :disabled="pageModel === 'View'" style="width: 500px">
          <a-form-item :rules="rules.title" field="title" label="标题">
            <a-input :max-length="50" v-model="formData.title" placeholder="请输入标题" />
          </a-form-item>
          <a-form-item :rules="rules.content" field="content" label="公告内容">
            <a-textarea
              v-model="formData.content"
              placeholder="请输入公告内容"
              :max-length="1000"
              :auto-size="{ minRows: 3, maxRows: 6 }"
              show-word-limit
            />
          </a-form-item>
          <a-form-item :rules="rules.imgs" field="imgs" label="封面图">
            <UploadVue ref="refUploadVue" :uploadType="'picture-card'" v-model:file-list="formData.imgs" v-if="formData.imgs" />
          </a-form-item>
          <a-form-item :rules="rules.buildingList" field="buildingList" label="发布到">
            <a-select v-model="formData.buildingList" multiple :max-tag-count="3" placeholder="请选择楼栋">
              <a-option
                :label="building.buildingNo"
                :value="building.buildingId"
                :key="index"
                v-for="(building, index) in buildingDataList"
              ></a-option>
            </a-select>
            <a-checkbox v-model="formData.allBuilding" style="width: 100px" @change="changeAllBuilding">全选</a-checkbox>
          </a-form-item>
          <!-- <a-form-item field="timing" label="立即发布" v-if="pageModel !== 'View'">
            <a-radio-group v-model="formData.timing">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item field="publishTime" label="发布时间" v-if="pageModel === 'View' && formData.state === 1">
            <a-date-picker show-time format="YYYY-MM-DD HH:mm" v-model="formData.publishTime" @select="selectPublishTime" />
          </a-form-item>
          <a-form-item v-if="pageModel !== 'View'">
            <a-space>
              <a-button type="primary" @click="publish" :loading="createLoading">发布</a-button>
              <a-button @click="() => clickSave()" :loading="createLoading">保存草稿</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

import CUVue, { useDetailPage } from "@/components/lib/CU";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import Notice, { CreateNoticeModel } from "@/api/tenant/Notice";
import { formatDateTime } from "@/utils/utils";
import Building, { BuildingModel } from "@/api/tenant/Building";
import UploadVue from "@/components/lib/Upload.vue";
import { Message, Modal } from "@arco-design/web-vue";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";

type PartialBuildingModel = Partial<BuildingModel>;

// function range(start: number, end: number) {
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// }

export default defineComponent({
  name: "notice-detail",
  components: {
    Breadcrumb,
    CUVue,
    UploadVue,
  },
  setup() {
    const formData = ref<any>({
      title: "",
      content: "",
      fileUrl: "",
      buildingList: [],
      imgs: [],
      timing: true,
      publishTime: "",
      allBuilding: false,
    });
    const rules = {
      title: new RulesLib().required("请输入标题").done(),
      content: new RulesLib().required("请输入公告内容").done(),
      imgs: new RulesLib().done(),
      buildingList: new RulesLib().required("请选择楼栋").done(),
    };
    const showModalTips = ref(false);

    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });

    const { pageModel, pageModelName } = useDetailPage();
    const loading = ref(false);

    const route = useRoute();
    // const id = computed(() => route.params.id);
    const buildingDataList = ref<PartialBuildingModel[]>([]);
    Building.getAll().then((res) => {
      buildingDataList.value = res;
    });
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      Notice.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          formData.value.buildingList = res.buildingList.map((build) => build.buildingId);
          formData.value.imgs = res.imgList
            ? res.imgList.map((item, index) => {
                let url = "";
                if (/^http/.test(item)) {
                  url = item;
                } else {
                  url = "http://" + item;
                }
                return {
                  uid: index,
                  url: url,
                  name: url,
                  response: url,
                  status: "done",
                };
              })
            : [];
          nextTick(startWatch);
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

    const createLoading = ref(false);
    const createData = () => {
      const submitData: CreateNoticeModel = {
        //公告内容
        content: formData.value.content,
        //文件url
        imgList: formData.value.imgs.map((img: any) => img.response),
        // fileUrl: formData.value.imgs[0].response,

        buildingList: formData.value.buildingList,
        //发布公告时间
        publishTime: formData.value.publishTime || undefined,
        //公告标题
        title: formData.value.title,
        state: 2,
      };
      console.log("submitData", submitData);
      createLoading.value = true;
      return Notice.create(submitData)
        .then((res) => {
          return res;
        })
        .finally(() => {
          createLoading.value = false;
        });
    };
    const updateData = () => {
      const submitData = {
        //公告内容
        content: formData.value.content,
        //文件url
        imgList: formData.value.imgs.map((img: any) => img.response),
        // fileUrl: formData.value.imgs[0].response,
        buildingList: formData.value.buildingList,
        //发布公告时间
        publishTime: formData.value.publishTime || undefined,
        //公告标题
        title: formData.value.title,
        state: 2,
        id: formData.value.id,
      };
      return Notice.update(submitData)
        .then(() => {
          return {
            id: formData.value.id,
          };
        })
        .finally(() => {
          createLoading.value = false;
        });
    };
    const refForm = ref();
    const refUploadVue = ref();
    const clickSave = (toBack = true) => {
      return new Promise((resolve, reject) => {
        refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
          if (err) {
            reject(err);
          } else {
            refUploadVue.value
              .submit()
              .then(() => {
                if (pageModel.value === "Add") {
                  resolve(createData());
                } else {
                  resolve(updateData());
                }
              })
              .catch((err: any) => {
                console.log("err", err);
                reject(false);
              });
          }
        });
      }).then((res) => {
        if (toBack) {
          router.push({ name: "NoticeManagement" });
        }
        return res;
      });
    };
    const publish = () => {
      return new Promise((resolve, reject) => {
        refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
          if (err) {
            reject(err);
          } else {
            Modal.warning({
              title: "提示",
              content: "确认立即发布？",
              closable: true,
              cancelText: "取消",
              hideCancel: false,
              onOk: () => {
                // resolve(true);
                clickSave(false).then((res: any) => {
                  createLoading.value = true;
                  Notice.publish(res.id).then(() => {
                    Message.success("发布成功");
                    setTimeout(() => {
                      router.push({ name: "NoticeManagement" });
                    }, 500);
                  });
                });
              },
              onCancel: () => {
                // reject(false);
              },
            });
          }
        });
      });
    };
    const selectPublishTime = (dateString: string, date: Date) => {
      formData.value.publishTime = formatDateTime(date);
    };
    const changeAllBuilding = (v: boolean | (string | number | boolean)[]) => {
      if (v) {
        formData.value.buildingList = buildingDataList.value.map((build) => build.buildingId);
      } else {
        formData.value.buildingList = [];
      }
    };
    watch(
      () => formData.value.buildingList,
      () => {
        if (formData.value.buildingList.length === buildingDataList.value.length) {
          formData.value.allBuilding = true;
        } else {
          formData.value.allBuilding = false;
        }
      },
    );
    const goEdit = () => {
      router.push({ name: "NoticeManagementDetail", params: { model: "Edit", id: route.params.id } });
    };
    return {
      refForm,
      rules,
      loading,
      pageModel,
      pageModelName,
      showModalTips,
      formData,
      createLoading,
      buildingDataList,
      refUploadVue,
      goEdit,
      clickSave,
      publish,
      selectPublishTime,
      changeAllBuilding,
    };
  },
});
</script>

<style lang="less" scoped>
.add-employess {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
