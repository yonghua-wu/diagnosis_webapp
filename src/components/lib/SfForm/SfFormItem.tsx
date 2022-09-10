import { Col, FieldRule } from "@arco-design/web-vue";
import { defineComponent, inject, PropType, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import { sfFormInjectKey } from "./context";

type ColProp = InstanceType<typeof Col>["$props"];

export default defineComponent({
  name: "sf-form-item",
  props: {
    field: {
      type: String as PropType<string>,
    },
    label: {
      type: String as PropType<string>,
    },
    showColon: {
      type: Boolean as PropType<boolean>,
    },
    noStyle: {
      type: Boolean as PropType<boolean>,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
    },
    help: {
      type: String as PropType<string>,
    },
    extra: {
      type: String as PropType<string>,
    },
    required: {
      type: Boolean as PropType<boolean>,
    },
    rules: {
      type: Object as PropType<FieldRule | FieldRule[]>,
    },
    validateStatus: {
      type: String as PropType<"success" | "warning" | "error" | "validating">,
    },
    validateTrigger: {
      type: String as PropType<"change" | "input" | "focus" | "blur">,
    },
    labelColProps: {
      type: Object as PropType<any>,
    },
    wrapperColProps: {
      type: Object as PropType<any>,
    },
    hideLabel: {
      type: Boolean as PropType<boolean>,
    },
    hideAsterisk: {
      type: Boolean as PropType<boolean>,
    },
    labelColStyle: {
      type: Object as PropType<any>,
    },
    wrapperColStyle: {
      type: Object as PropType<any>,
    },
    rowProps: {
      type: Object as PropType<any>,
    },
    rowClass: {
      type: Object as PropType<string | string[] | any>,
    },
    contentClass: {
      type: Object as PropType<string | string[] | any>,
    },
    contentFlex: {
      type: Boolean as PropType<boolean>,
    },
    mergeProps: {
      type: Boolean as PropType<boolean | ((props: Record<string, any>) => Record<string, any>)>,
    },
    labelColFlex: {
      type: [Number, String] as PropType<number | string>,
    },
    feedback: {
      type: Boolean as PropType<boolean>,
    },
    labelComponent: {
      type: String as PropType<string>,
    },
    labelAttrs: {
      type: Object as PropType<any>,
    },
    colProps: {
      type: Object as PropType<ColProp>,
      default: () => {
        return {
          xs: 24,
          sm: 24,
          md: 12,
          lg: 12,
          xl: 8,
        };
      },
    },
  },
  setup(props, { slots }) {
    const sfFormContext = inject(sfFormInjectKey);
    const labelColFlex = props.labelColFlex || (sfFormContext?.labelWidth?.value || 130) + "px";
    const route = useRoute();
    const { rules: _rules } = toRefs(props);
    const rules = ref(_rules.value);
    if (sfFormContext?.formModel?.value === "View") {
      rules.value = [];
    }
    const Slot = () => {
      if (sfFormContext?.formModel?.value === "View" && slots.view) {
        return slots.view();
      } else if (slots.default) {
        return slots.default();
      } else {
        return <div></div>;
      }
    };
    return () => (
      <a-col {...props.colProps}>
        <a-form-item
          id={String(route.name) + "-" + props.field}
          {...props}
          rules={rules.value}
          disabled={sfFormContext?.disabled?.value || props.disabled}
          labelColFlex={labelColFlex}
        >
          {Slot()}
        </a-form-item>
      </a-col>
    );
  },
});
