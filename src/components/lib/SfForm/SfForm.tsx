import { Form } from "@arco-design/web-vue";
import { defineComponent, PropType, provide, ref, toRefs } from "vue";
import { CUModel } from "../CU/CU";
import { sfFormInjectKey } from "./context";
type FormProps = InstanceType<typeof Form>["$props"];

export default defineComponent({
  name: "sf-form",
  props: {
    model: {
      type: Object as PropType<any>,
    },
    layout: {
      type: String as PropType<FormProps["layout"]>,
    },
    size: {
      type: String as PropType<FormProps["size"]>,
    },
    labelColProps: {
      type: Object as PropType<FormProps["labelColProps"]>,
    },
    wrapperColProps: {
      type: Object as PropType<FormProps["wrapperColProps"]>,
    },
    labelAlign: {
      type: String as PropType<FormProps["labelAlign"]>,
    },
    disabled: {
      type: Boolean as PropType<FormProps["disabled"]>,
    },
    rules: {
      type: Object as PropType<FormProps["rules"]>,
    },
    autoLabelWidth: {
      type: Boolean as PropType<FormProps["autoLabelWidth"]>,
    },
    /**
     * 表单模式，同详情页模式
     */
    formModel: {
      type: String as PropType<CUModel>,
      default: () => "Edit",
    },
    /**
     * 标签的宽度，默认90px
     */
    labelWidth: {
      type: Number,
      default: () => 90,
    },
    formMaxWidth: {
      type: [Number, Boolean],
      default: () => 1500,
    },
  },
  setup(props, { slots }) {
    const { disabled: _disabled, formModel, labelWidth } = toRefs(props);
    const disabled = ref(_disabled.value);
    if (formModel.value === "View") {
      disabled.value = true;
    }
    console.log(formModel.value);
    provide(sfFormInjectKey, {
      disabled,
      formModel,
      labelWidth,
    });
    const refForm = ref();
    return {
      validate(cb: any) {
        return refForm.value.validate(cb);
      },
      render: () => (
        <a-form ref={refForm} {...props} disabled={disabled.value} style={props.formMaxWidth > 1 ? `max-width:${props.formMaxWidth}px` : ""}>
          <a-row gutter={8}>{slots.default?.()}</a-row>
        </a-form>
      ),
    };
  },
  render() {
    return this.render();
  },
});
