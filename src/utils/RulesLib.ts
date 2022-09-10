import { FieldRule } from "@arco-design/web-vue/es/form/interface";

export default class RulesLib {
  public rules: FieldRule[];
  constructor() {
    this.rules = [];
  }

  /**
   * 生成rules
   * @returns RulesLib生成rules
   */
  public done() {
    if (this.rules.length === 0) {
      return [{ required: false }];
    } else {
      return this.rules;
    }
  }

  /**
   * 必填
   * @param message 提示
   * @returns RulesLibRulesLib
   */
  public required(message?: string) {
    this.rules.push({
      required: true,
      message: message || "此字段必须",
    });
    return this;
  }

  /**
   * 校验数据类型
   * @param v 类型
   * @param message 提示
   * @returns RulesLibRulesLib
   */
  public type(v: "string" | "number" | "boolean" | "array" | "object" | "email" | "url" | "ip", message?: string) {
    this.rules.push({
      type: v,
      message: message || "数据类型不正确",
    });
    return this;
  }

  /**
   * 必须长度等于
   * @param v 长度
   * @param message 提示
   * @returns RulesLibRulesLib
   */
  public length(v: number, message?: string) {
    this.rules.push({
      length: v,
      message: message || "长度必须等于" + v,
    });
    return this;
  }

  /**
   * 最大长度
   * @param v 长度
   * @param message 提示
   * @returns RulesLibRulesLib
   */
  public maxLength(v: number, message?: string) {
    this.rules.push({
      maxLength: v,
      message: message || "长度不能超过" + v,
    });
    return this;
  }

  /**
   * 最小长度
   * @param v 长度
   * @param message 提示
   * @returns RulesLib
   */
  public minLength(v: number, message?: string) {
    this.rules.push({
      minLength: v,
      message: message || "长度不能小于" + v,
    });
    return this;
  }

  /**
   * 正则匹配
   * @param v 正则表达式
   * @param message 提示
   * @returns RulesLib
   */
  public match(v: RegExp, message?: string) {
    this.rules.push({
      match: v,
      message: message || "正则匹配失败",
    });
    return this;
  }

  /**
   * 必须大写
   * @param v 是否
   * @param message 提示
   * @returns RulesLib
   */
  public uppercase(v: boolean, message?: string) {
    this.rules.push({
      uppercase: v,
      message: message || "必须大写",
    });
    return this;
  }

  /**
   * 必须小写
   * @param v 是否
   * @param message 提示
   * @returns RulesLib
   */
  public lowercase(v: boolean, message?: string) {
    this.rules.push({
      lowercase: v,
      message: message || "必须小写",
    });
    return this;
  }

  /**
   * 最小值
   * @param v 数字值
   * @param message 提示
   * @returns RulesLib
   */
  public min(v: number, message?: string) {
    this.rules.push({
      min: v,
      message: message || "数值不能小于" + v,
    });
    return this;
  }

  /**
   * 最大值
   * @param v 数字值
   * @param message 提示
   * @returns RulesLib
   */
  public max(v: number, message?: string) {
    this.rules.push({
      max: v,
      message: message || "数值不能大于" + v,
    });
    return this;
  }

  /**
   * 校验数值
   * @param v 数字值
   * @param message 提示
   * @returns RulesLib
   */
  public equal(v: number, message?: string) {
    this.rules.push({
      equal: v,
      message: message || "数值必须等于" + v,
    });
    return this;
  }

  /**
   * 必须正数
   * @param v 是否
   * @param message 提示
   * @returns RulesLib
   */
  public positive(v: boolean, message?: string) {
    this.rules.push({
      positive: v,
      message: message || "必须正数",
    });
    return this;
  }

  /**
   * 必须负数
   * @param v 是否
   * @param message 提示
   * @returns RulesLib
   */
  public negative(v: boolean, message?: string) {
    this.rules.push({
      negative: v,
      message: message || "必须负数",
    });
    return this;
  }

  /**
   * 必须为 true
   * @param v 是否
   * @param message 提示
   * @returns RulesLib
   */
  public true(v: boolean, message?: string) {
    this.rules.push({
      true: v,
      message: message || "必须为 true",
    });
    return this;
  }

  /**
   * 必须为 false
   * @param v 是否
   * @param message 提示
   * @returns RulesLib
   */
  public false(v: boolean, message?: string) {
    this.rules.push({
      false: v,
      message: message || "必须为 false",
    });
    return this;
  }

  /**
   * 必须在其中
   * @param v 匹配数组
   * @param message 提示
   * @returns RulesLib
   */
  public includes(v: any[], message?: string) {
    this.rules.push({
      includes: v,
      message: message || "匹配失败，必须是给定值之一",
    });
    return this;
  }

  /**
   * 数组元素是否相等
   * @param v 任意值
   * @param message 提示
   * @returns RulesLib
   */
  public deepEqual(v: any, message?: string) {
    this.rules.push({
      deepEqual: v,
      message: message || "匹配失败，必须是给定值",
    });
    return this;
  }

  /**
   * 必须为空
   * @param v 是否
   * @param message 提示
   * @returns RulesLib
   */
  public empty(v: boolean, message?: string) {
    this.rules.push({
      empty: v,
      message: message || "必须为空",
    });
    return this;
  }

  /**
   * 包含指定属性
   * @param v key list
   * @param message 提示
   * @returns RulesLib
   */
  public hasKeys(v: string[], message?: string) {
    this.rules.push({
      hasKeys: v,
      message: message || "必须包含指定属性",
    });
    return this;
  }
  /**
   * 自定义校验
   * @param callback 校验函数
   * @returns RulesLib
   */
  public validator(callback: (value: any | undefined, callback: (error?: string) => void) => void) {
    this.rules.push({
      validator: callback,
    });
    return this;
  }
  /**
   * 校验手机号
   * @param message 提示
   * @returns RulesLib
   */
  public phone(message?: string) {
    this.match(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message || "手机号码格式不正确");
    return this;
  }

  /**
   * 校验身份证号
   * @param message 提示
   * @returns RulesLib
   */
  public idCard(message?: string) {
    this.match(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message || "身份证号码格式不正确");
    return this;
  }
  public numbersAndLetters(message?: string) {
    this.match(/^[a-z0-9A-Z]+$/, message || "只能由数字和字母组成");
    return this;
  }
}
