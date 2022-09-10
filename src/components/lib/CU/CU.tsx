import { Modal, ValidatedError } from "@arco-design/web-vue";
import { computed, defineComponent, PropType, Ref, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

export type CUModel = "Add" | "Edit" | "View";

export function useDetailPageModel() {
  const route = useRoute();
  const pageModel = ref(route.params.model as CUModel);
  watch(
    () => route.params.model,
    () => {
      pageModel.value = route.params.model as CUModel;
    },
  );
  const pageModelText = computed(() => {
    switch (pageModel.value) {
      case "Add":
        return "添加";
      case "Edit":
        return "编辑";
      default:
      case "View":
        return "详情";
    }
  });
  return {
    pageModel,
    pageModelText,
  };
}

export function useDetail<T = any, U = any>(
  refForm: Ref<any>,
  apiInstance?: { create: (data: T) => Promise<any>; update: (data: U) => Promise<any> },
) {
  const buttonLoading = ref(false);
  const { pageModel } = useDetailPageModel();
  const vaildate = () => {
    return new Promise((resolve, reject) =>
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          resolve(true);
        } else {
          reject(new Error("验证失败"));
        }
      }),
    );
  };
  const save = (data: T | U) => {
    return vaildate()
      .then(() => {
        if (apiInstance) {
          return Promise.resolve(apiInstance);
        } else {
          return Promise.reject();
        }
      })
      .then((_apiInstance) => {
        buttonLoading.value = true;
        if (pageModel.value === "Add") {
          return _apiInstance.create(data as T).finally(() => {
            buttonLoading.value = false;
          });
        } else {
          return _apiInstance.update(data as U).finally(() => {
            buttonLoading.value = false;
          });
        }
      });
  };
  const create = (data: T) => {
    return vaildate()
      .then(() => {
        if (apiInstance) {
          return Promise.resolve(apiInstance);
        } else {
          return Promise.reject();
        }
      })
      .then((_apiInstance) => {
        buttonLoading.value = true;
        return _apiInstance.create(data as T).finally(() => {
          buttonLoading.value = false;
        });
      });
  };
  const update = (data: U) => {
    return vaildate()
      .then(() => {
        if (apiInstance) {
          return Promise.resolve(apiInstance);
        } else {
          return Promise.reject();
        }
      })
      .then((_apiInstance) => {
        buttonLoading.value = true;
        return _apiInstance.update(data as U).finally(() => {
          buttonLoading.value = false;
        });
      });
  };
  return {
    buttonLoading,
    save,
    create,
    update,
    vaildate,
  };
}

type Props = InstanceType<typeof CuComponent>["$props"];

export function useRouterManager(props?: Props) {
  const checkEdited = async () => {
    if (props?.showModalTips) {
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
    } else {
      return true;
    }
  };
  const route = useRoute();
  const router = useRouter();
  const goBack = (_toRouteName?: string) => {
    if (history.state.back) {
      router.go(-1);
    } else {
      const toRouteName = _toRouteName || (route.name as string).replace(/Detail*/, ""); // 去掉 route.name 的 Detail 后缀
      router.push({ name: toRouteName });
    }
  };
  onBeforeRouteLeave(async () => {
    try {
      await checkEdited();
      return true;
    } catch {
      return false;
    }
  });
  const goEdit = () => {
    router.push({ name: route.name as string, params: { id: route.params.id, model: "Edit" } });
  };
  return {
    goBack,
    goEdit,
  };
}

const CuComponent = defineComponent({
  name: "cu-component",
  props: {
    showModalTips: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    loading: {
      tyep: Boolean,
      default: () => false,
    },
    pageModelText: {
      type: String,
    },
  },
  setup(props, { slots }) {
    const { pageModel, pageModelText } = useDetailPageModel();
    const { goBack, goEdit } = useRouterManager(props);
    const cardTitleSlots = () => (
      <div style="display: flex; flex-direction: row; align-items: center;">
        <a-button shape="circle" type="text" onClick={() => goBack()}>
          <icon-left />
        </a-button>
        <span> {props.pageModelText || pageModelText.value} </span>
        {slots.extraTitle?.()}
      </div>
    );
    const cardExtraSlots = () => {
      if (pageModel.value === "View") {
        return (
          <a-space>
            {slots.extra ? (
              slots.extra()
            ) : (
              <a-button type="primary" onClick={() => goEdit()}>
                <icon-edit /> 编辑
              </a-button>
            )}
          </a-space>
        );
      } else {
        return <a-space>{slots.extra?.()}</a-space>;
      }
    };
    return () => (
      <a-spin loading={props.loading} style="width: 100%">
        <a-card
          v-slots={{
            title: cardTitleSlots,
            extra: cardExtraSlots,
          }}
        >
          {slots.default?.()}
        </a-card>
      </a-spin>
    );
  },
});

export default CuComponent;
