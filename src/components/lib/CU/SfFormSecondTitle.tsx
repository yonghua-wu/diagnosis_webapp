import { defineComponent } from "vue";

export default defineComponent({
  name: "sf-form-second-title",
  setup(props, { slots }) {
    return () => (
      <a-col span={24} style="font-size: 14px;font-weight: bold;color: var(--color-text-3);margin: 8px;">
        {slots.default?.()}
      </a-col>
    );
  },
});
