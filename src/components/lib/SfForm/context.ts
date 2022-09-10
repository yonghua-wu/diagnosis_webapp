import { inject, InjectionKey, Ref } from "vue";
import { CUModel } from "../CU/CU";

export interface SfFormContext {
  disabled?: Ref<boolean | undefined>;
  labelWidth?: Ref<number | undefined>;
  formModel?: Ref<CUModel | undefined>;
}

export function useSfFormItem() {
  const sfFormContext = inject(sfFormInjectKey);
  return {
    sfFormContext,
  };
}

export const sfFormInjectKey: InjectionKey<SfFormContext> = Symbol("sfFormInjectKey");
