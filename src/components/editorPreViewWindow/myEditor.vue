<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid var(--color-border-2)" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="min-height: 400px" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
  </div>
</template>

<script lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, watch, defineComponent } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import TencentCos from "@/utils/tencentCos";
import COS from "cos-js-sdk-v5";
import Message from "@/utils/Message";

export default defineComponent({
  name: "my-editor",
  props: {
    contentUrl: {
      type: String,
    },
    isReadOnly: {
      type: Boolean,
    },
    scroll: {
      type: Boolean,
    },
  },
  components: { Editor, Toolbar },
  emit: ["update:contentUrl", "change"],
  setup(props: any, { emit }) {
    // ts使用图片需要先定义类型
    // type ImageElement = SlateElement & {
    //   src: string;
    //   alt: string;
    //   url: string;
    //   href: string;
    // };
    type InsertFnType = (url: string, alt: string, href: string) => void;
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();

    //存储blob url和文件本身
    let fileMap: Map<string, File> = new Map();

    // 内容 HTML
    //const valueHtml = ref(props.queryData.contentUrl);
    const valueHtml = ref(props.contentUrl);
    watch(valueHtml, () => {
      emit("update:contentUrl", valueHtml.value);
    });

    // 模拟 ajax 异步获取内容
    // onMounted(() => {
    //   setTimeout(() => {
    //     valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
    //   }, 1500);
    // });

    const toolbarConfig: Partial<IToolbarConfig> = {};
    toolbarConfig.excludeKeys = ["group-image", "group-video", "insertVideo", "uploadVideo", "fullScreen"];
    toolbarConfig.insertKeys = {
      index: 22,
      keys: ["uploadImage"],
    };
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: "请输入内容...",
      MENU_CONF: {},
      readOnly: props.isReadOnly,
      scroll: props.scroll,
    };

    editorConfig?.MENU_CONF &&
      (editorConfig.MENU_CONF["uploadImage"] = {
        //自定义图片插入
        customInsert(res: any, insertFn: InsertFnType) {
          // TS 语法
          // customInsert(res, insertFn) {                  // JS 语法
          // res 即服务端的返回结果
          // 从 res 中找到 url alt href ，然后插图图片
          //insertFn(url, alt, href);
        },
        // 自定义上传
        async customUpload(file: File, insertFn: InsertFnType) {
          // TS 语法
          // file 即选中的文件
          // 自己实现上传，并得到图片 url alt href
          // 最后插入图片
          window.URL = window.URL || window.webkitURL;
          let blobURL = window.URL.createObjectURL(file);
          fileMap.set(blobURL, file);
          insertFn(blobURL, "", "");
        },
      });

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor: any) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };

    async function submit() {
      const blobImgs: string[] = [];
      for (let key of fileMap.keys()) {
        blobImgs.push(key);
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("上传文件超时");
        }, 60000);
        if (blobImgs) {
          Promise.all(
            blobImgs.map((iter: any, index: any) => {
              return imageUploadTecent(iter).then((res) => {
                return res;
              });
            }),
          ).then((res) => {
            let i = 0;
            for (let fileKey of fileMap.keys()) {
              while (valueHtml.value.match(fileKey)) {
                valueHtml.value = valueHtml.value.replace(fileKey, res[i]);
              }
              i += 1;
            }
            //在获取html字符串后将其转换为blob存储形式
            const html_content = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + valueHtml.value + "</body></html>";
            const blobHtml = new Blob([html_content], { type: "text/html,charset=UTF-8" });
            window.URL = window.URL || window.webkitURL;
            //上传html
            const htmlUrl = uploadHTML(blobHtml);
            htmlUrl.then((res) => {
              blobImgs.forEach((iter: any, index: any) => {
                //去除url
                window.URL.revokeObjectURL(iter);
              });
              resolve(res);
              //console.log("res", res); //返回的html链接
            });
          });
        }
      });
    }

    //将整合的html上传到服务器并返回地址
    async function uploadHTML(htmlBlob: Blob) {
      const uploadBlobName = `${new Date().getTime()}_${Math.ceil(Math.random() * 10000)}`;
      return new Promise((resolve, reject) => {
        new TencentCos().upload(uploadBlobName, htmlBlob, undefined, (err: COS.CosError, data: COS.PutObjectResult) => {
          if (err) {
            Message.error(err.message);
            reject(err);
          } else {
            //console.log("http://" + data.Location);
            resolve("http://" + data.Location);
          }
        });
      });
    }

    async function imageUploadTecent(imgBlobUrl: string) {
      //通过blob url查询对应的文件
      const tempFile = fileMap.get(imgBlobUrl);
      if (tempFile) {
        const fileName = tempFile.name.split(".");
        const fileExt = fileName?.[fileName.length - 1];
        const uploadFileName = `${new Date().getTime()}_${Math.ceil(Math.random() * 10000)}.${fileExt}`;
        //上传成功，将需要返回的值用resolve包裹
        return new Promise((resolve, reject) => {
          new TencentCos().upload(uploadFileName, tempFile, undefined, (err: COS.CosError, data: COS.PutObjectResult) => {
            if (err) {
              Message.error(err.message);
              reject(err);
            } else {
              //console.log("http://" + data.Location);
              resolve("http://" + data.Location);
            }
          });
        });
      }
    }

    return {
      editorRef,
      valueHtml,
      mode: "simple",
      toolbarConfig,
      editorConfig,
      handleCreated,
      fileMap,
      submit,
    };
  },
});
</script>
