import { getFreq } from "../../src/utils/cronUtils";
import { metaType, MateType, findObject, getValueByPath } from "../../src/utils/utils";

describe("utils.ts", () => {
  it("[function metaType] 类型判断", () => {
    const type = [
      1,
      true,
      undefined,
      null,
      "ab",
      {},
      [],
      () => {
        /**/
      },
    ];
    const result: MateType[] = ["number", "boolean", "undefined", "null", "string", "object", "array", "function"];
    type.forEach((item, index) => {
      expect(metaType(item)).toMatch(result[index]);
    });
  });
  it("[function findObject]", () => {
    expect(findObject([{ a: 1 }, { a: 2 }, { a: 3 }], "a", 2)).toEqual({ a: 2 });
  });
  it("[function getValueByPath]", () => {
    expect(getValueByPath({ a: { b: { c: 1 } } }, "a.b.c")).toBe(1);
  });
});

describe("cronUtils.ts", () => {
  it("[function getFreq]", () => {
    const cronList = ["0 0 9 * * ?", "0 0 9 ? * 2", "0 0 9 1 * ?", "0 0 9 1 2,5,8,11 ?"];
    const result = ["每天", "每周", "每月", "每季"];
    cronList.forEach((item, index) => {
      expect(getFreq(item)).toMatch(result[index]);
    });
    //
  });
});
