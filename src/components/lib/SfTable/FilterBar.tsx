import { metaType } from "@/utils/utils";
import { computed, defineComponent, inject } from "vue";
import { SfTableFilterable } from ".";
import { SfTableContext, sfTableInjectKey } from "./context";

export default defineComponent({
  setup(props, { slots }) {
    const sfTableCtx = inject(sfTableInjectKey);
    const filterFormItemList = computed(() => {
      return sfTableCtx?.tableColumns.value
        ?.filter((col) => {
          const fieldName = col.filterable?.queryField || col.dataIndex || col.slotName;
          const colName = col.dataIndex || col.slotName;
          if (col.filterable === undefined) {
            return false;
          }
          if (metaType(fieldName) !== "string" || fieldName === "") {
            return false;
          }
          if (sfTableCtx.displayColumnKeys.value.some((k) => k === colName)) {
            return true;
          } else {
            // 不显示该列的情况下清除筛选条件
            if (sfTableCtx?.queryData.value) {
              if (sfTableCtx.queryData.value[fieldName as string] !== (col.filterable?.defaultValue || undefined)) {
                // 只有在不等于默认值的情况下清除，否则就算没有设置筛选也会触发 loadData
                sfTableCtx.queryData.value[fieldName as string] = col.filterable?.defaultValue || undefined;
              }
            }
            return false;
          }
        })
        .slice() // 不让排序影响原数组
        .sort((a, b) => {
          const as = a.filterable?.sort || 0;
          const bs = b.filterable?.sort || 0;
          return as - bs;
        })
        .map((col) => {
          const filterable = col.filterable as SfTableFilterable;
          // const queryData = sfTableCtx.queryData.value as Record<string, any>;
          const fieldName = (filterable.queryField || col.dataIndex || col.slotName) as string;
          let render;
          switch (filterable.type) {
            case "checkbox":
              render = (queryData: Record<string, any>) => (
                <a-checkbox-group v-model={queryData[fieldName]} type="button">
                  {filterable.filters?.map((f) => (
                    <a-checkbox value={f.value}>{f.text}</a-checkbox>
                  ))}
                </a-checkbox-group>
              );
              break;
            case "radio":
              render = (queryData: Record<string, any>) => (
                <a-radio-group v-model={queryData[fieldName]} type="button">
                  {filterable.filters?.map((f) => (
                    <a-radio value={f.value}>{f.text}</a-radio>
                  ))}
                </a-radio-group>
              );
              break;
            case "select":
              render = (queryData: Record<string, any>) => (
                <a-select placeholder={"选择"} v-model={queryData[fieldName]} onClear={() => (queryData[fieldName] = undefined)} allow-clear={true}>
                  {filterable.filters?.map((f) => (
                    <a-option value={f.value}>{f.text}</a-option>
                  ))}
                </a-select>
              );
              break;
            case "search":
              render = (queryData: Record<string, any>) => (
                <a-input
                  max-length={50}
                  placeholder={"搜索"}
                  v-model={queryData[fieldName]}
                  onClear={() => (queryData[fieldName] = undefined)}
                  allow-clear={true}
                ></a-input>
              );
              break;
            case "range-picker":
              render = (queryData: Record<string, any>) => <a-range-picker showConfirmBtn={false} v-model={queryData[fieldName]}></a-range-picker>;
              break;
            case "range-picker-time":
              render = (queryData: Record<string, any>) => (
                <a-range-picker showTime showConfirmBtn={false} v-model={queryData[fieldName]}></a-range-picker>
              );
              break;
            case "slot":
              render = (queryData: Record<string, any>) => slots[filterable.slotName as string]?.({ queryData });
              break;
          }
          return {
            ...col,
            filterable: {
              ...col.filterable,
              render,
            },
          };
        });
    });
    const groupFormItemMapList = computed(() => {
      const groups: Record<number, typeof filterFormItemList.value> = {};
      filterFormItemList.value?.forEach((col) => {
        if (groups[col.filterable?.group || 99] !== undefined) {
          (groups[col.filterable?.group || 99] as typeof filterFormItemList.value).push(col);
        } else {
          groups[col.filterable?.group || 99] = [col];
        }
      });
      return Object.keys(groups)
        .sort((a, b) => Number(a) - Number(b))
        .map((g) => groups[Number(g)]);
    });
    const queryData = sfTableCtx?.queryData.value as Record<string, any>;
    const changedQueryData = computed(() => {
      return filterFormItemList.value
        ?.map((item) => {
          const fieldName = item.filterable?.queryField || item.dataIndex || item.slotName;
          if (fieldName) {
            if (queryData[fieldName]) {
              if (queryData[fieldName] !== item.filterable?.defaultValue) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
        .reduce((a, b) => a || b, false);
    });
    const clearQueryData = () => {
      sfTableCtx?.tableColumns.value?.forEach((col) => {
        const fieldName = col.filterable?.queryField || col.dataIndex || col.slotName;
        if (sfTableCtx?.queryData.value) {
          if (sfTableCtx.queryData.value[fieldName as string] !== (col.filterable?.defaultValue || undefined)) {
            sfTableCtx.queryData.value[fieldName as string] = col.filterable?.defaultValue || undefined;
          }
        }
      });
    };
    return () => (
      <a-form model={(sfTableCtx as SfTableContext).queryData.value} layout="inline">
        {slots["filter-pre-extra"]?.({
          formItemAttr: {
            "label-col-style": { "min-width": "100px" },
            style: {
              width: "100%",
              "max-width": `${354 - 24}px`,
            },
          },
        })}
        {groupFormItemMapList.value.map((formItemList, groupIndex) => {
          return (
            <div style="display: inline-flex; flex-wrap: wrap; width: 100%;">
              {formItemList?.map((col) => {
                const filterable = col.filterable;
                const fieldName = (filterable.queryField || col.dataIndex || col.slotName) as string;
                return (
                  <a-form-item
                    label-col-style={{ "min-width": "100px" }}
                    style={{
                      width: "100%",
                      "max-width": `${354 * (filterable.ratio || 1) - 24}px`,
                    }}
                    label={filterable?.label || col.title}
                    field={fieldName}
                  >
                    {filterable.render(queryData)}
                  </a-form-item>
                );
              })}
              {groupIndex === groupFormItemMapList.value.length - 1 && changedQueryData.value ? (
                <a-form-item
                  label-col-style={{ "min-width": "100px" }}
                  style={{
                    width: "100%",
                    "max-width": `${354 - 24}px`,
                  }}
                >
                  <a-button type="outline" onClick={clearQueryData}>
                    清除筛选条件
                  </a-button>
                </a-form-item>
              ) : null}
            </div>
          );
        })}
        {slots["filter-after-extra"]?.()}
      </a-form>
    );
  },
});
