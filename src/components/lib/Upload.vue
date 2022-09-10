<template>
  <a-upload
    style="width: 100%; height: 100px"
    v-if="uploadType === 'picture-card'"
    v-model:file-list="theFileList"
    :default-file-list="fileList"
    list-type="picture-card"
    :custom-request="customRequest"
    :auto-upload="false"
    :limit="limit"
    ref="refUpload"
    image-preview
    accept="image/png, image/jpeg, image/bmp, image/jpg"
  >
    <template #upload-bottom v-if="theFileList.length > 0"></template>
  </a-upload>
</template>

<script lang="ts">
import { FileItem, RequestOption } from "@arco-design/web-vue/es/upload/interfaces";
import { defineComponent, PropType, reactive, ref, toRefs, watch } from "vue";
import TencentCos from "@/utils/tencentCos";
import COS from "cos-js-sdk-v5";
import Message from "@/utils/Message";
type UploadType = "picture-card" | "";

export default defineComponent({
  name: "upload-component",
  props: {
    uploadType: {
      type: String as PropType<UploadType>,
      default: (): UploadType => {
        return "picture-card";
      },
    },
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
    limit: {
      type: Number as PropType<number>,
      default: () => 1,
    },
  },
  setup(props, { emit }) {
    const { fileList } = toRefs(props);
    const refUpload = ref();
    const theFileList = ref<FileItem[]>(props.fileList);
    watch(fileList, () => {
      theFileList.value = fileList.value;
    });
    // watch(theFileList, (val) => {
    //   console.log("theFileList", val);
    //   // emit("updata:file-list", val);
    // });

    const fileStoreList = reactive<RequestOption[]>([]);
    const customRequest = (option: RequestOption) => {
      fileStoreList.push(option);
      const filename = option.fileItem.name?.split(".");
      const fileExt = filename?.[filename.length - 1];
      const uploadFileName = `${new Date().getTime()}_${Math.ceil(Math.random() * 10000)}.${fileExt}`;
      const file = option.fileItem.file;
      if (file) {
        console.log(uploadFileName);
        new TencentCos().upload(uploadFileName, file, option.onProgress, (err: COS.CosError, data: COS.PutObjectResult) => {
          if (err) {
            Message.error(err.message);
          } else {
            option.onSuccess("http://" + data.Location);
          }
        });
      }
      return {
        abort() {
          console.log("abort");
        },
      };
    };
    const submit = () => {
      const close = Message.loading("上传图片中");
      return new Promise((resolve, reject) => {
        refUpload.value.submit();
        setTimeout(() => {
          close.close();
          reject("上传文件超时");
        }, 60000);
        let status = 0;
        theFileList.value.forEach((item) => {
          if (item.status === "done") {
            status++;
          }
        });
        if (status === theFileList.value.length) {
          close.close();
          resolve(true);
        } else {
          watch(theFileList, () => {
            let status = 0;
            theFileList.value.forEach((item) => {
              if (item.status === "done") {
                status++;
              }
            });
            emit("update:file-list", theFileList.value);
            if (status === theFileList.value.length) {
              close.close();
              resolve(true);
            }
          });
        }
      });
    };
    return {
      submit,
      refUpload,
      theFileList,
      fileStoreList,
      customRequest,
    };
  },
});
</script>

<style lang="scss" scoped>
.upload-component {
}
</style>
