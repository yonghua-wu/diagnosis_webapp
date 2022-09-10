import { Modal } from "@arco-design/web-vue";
import { toRefs } from "@vueuse/core";
import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export type CUPageModel = "Add" | "Edit" | "View";

export function useDetailPage() {
  const route = useRoute();
  const pageModel = ref<CUPageModel>(route.params.model as CUPageModel);
  watch(
    () => route.params.model,
    () => {
      pageModel.value = route.params.model as CUPageModel;
    },
  );
  const pageModelName = computed(() => {
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
    pageModelName,
  };
}

/**
 * 创建数据、更新数据
 */
export default defineComponent({
  name: "CUComponent",
  props: {
    showModalTips: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { showModalTips } = toRefs(props);
    const router = useRouter();
    const route = useRoute();
    const goBack = () => {
      checkEdited().then((res) => {
        if (res) {
          if (history.state.back) {
            router.go(-1);
          } else {
            const toRouteName = (route.name as string).replace(/Detail*/, ""); // 去掉 route.name 的 Detail 后缀
            router.push({ name: toRouteName });
          }
        }
      });
    };
    const goEdit = () => {
      router.push({ name: route.name as string, params: { id: route.params.id, model: "Edit" } });
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
    const { pageModel, pageModelName } = useDetailPage();

    const cardTitleSlots = () => (
      <>
        <a-button shape="circle" type="text" onClick={() => goBack()}>
          <icon-left />
        </a-button>
        <span> {pageModelName.value} </span>
      </>
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
        return (
          <a-space>
            {slots.extra?.()}
            <div></div>
          </a-space>
        );
      }
    };

    // onMounted(() => {
    //   console.log("CU", (slots as any).default?.()[0]?.["children"]?.default?.());
    // });

    // const FormItems = (slots as any).default?.().map((slot: any) => {
    //   if (slot.type.name === "Form") {
    //     const Item = () => (
    //       <a-space direction="vertical" fill>
    //         <a-space direction="vertical" fill>
    //           <a-row class="section-body" gutter={24}>
    //             {slot.children.default?.().map((child: any) => {
    //               child.props !== null && (child.props["row-props"] = { gutter: 24 });
    //               return <a-col span={8}>{child}</a-col>;
    //             })}
    //           </a-row>
    //         </a-space>
    //       </a-space>
    //     );
    //     console.log(slot);

    //     slot.children = Item;
    //     return slot;
    //   } else {
    //     return slot;
    //   }
    // });

    return () => (
      <a-card
        v-slots={{
          title: cardTitleSlots,
          extra: cardExtraSlots,
        }}
      >
        {/* {FormItems} */}
        {slots.default?.({ pageModel, pageModelName })}
      </a-card>
    );
  },
});
