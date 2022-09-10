import moment from "moment";
import CryptoJS from "crypto-js";

/**
 * 解码VBPG
 * @param buf ArrayBuffer
 * @returns 返回VBPG信息和图片
 */
export function decodeVBPG(buf: ArrayBuffer) {
  const blob = new Blob([buf], { type: "application/octet-stream" });
  const headerLength = new DataView(buf, 0, 4).getInt32(0, false); // 从前4个字节获取头信息长度
  const packageInfoStrArr = new Uint8Array(buf, 4, headerLength - 4); // 从第4个字节开始，获取头信息长度-4的信息
  const packageInfoStr = new TextDecoder().decode(packageInfoStrArr); // 转字符串
  const packageInfo: any = JSON.parse(packageInfoStr); // 字符串转json
  const res: any[] = packageInfo.resources; // resources 保存了图片信息
  const imgUrls = [];
  for (const i in res) {
    const imgInfo: any = res[i];
    // 图片信息中的起始下标加头信息长度就是图片在buf中的下标，结束下标同理
    const imgBlob = blob.slice(imgInfo.fromPos + headerLength, imgInfo.toPos + headerLength, imgInfo.type + "/" + imgInfo.fileType);
    // 创建 blob url 用于页面访问
    imgUrls.push(URL.createObjectURL(imgBlob));
  }
  // console.log(imgUrls);
  return {
    packageInfo,
    imgUrls,
  };
}

export type MateType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "undefined"
  | "symbol"
  | "bigInt"
  | "object"
  | "function"
  | "array"
  | "date"
  | "regExp"
  | "error";

/**
 * 判断类型
 * @param obj 待判断的变量
 * @returns 类型名
 */
export function metaType(obj: any): MateType {
  const MAP = {
    "[object String]": "string",
    "[object Number]": "number",
    "[object Boolean]": "boolean",
    "[object Null]": "null",
    "[object Undefined]": "undefined",
    "[object Symbol]": "symbol",
    "[object BigInt]": "bigInt",
    "[object Object]": "object",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Error]": "error",
  };
  const type = Object.prototype.toString.call(obj);
  return (MAP as any)[type];
}

/**
 * 对象深拷贝
 * @param data .
 * @returns .
 */
export function deepClone(data: any): any {
  const type = metaType(data);
  let obj: any = null;
  if (type === "array") {
    obj = [];
    for (let i = 0; i < data.length; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    obj = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        obj[key] = deepClone(data[key]);
      }
    }
  } else {
    return data;
  }
  return obj;
}

/**
 * 判断空对象或空数组
 * @param obj .
 * @returns true / false
 */
export function isEmpty(obj: any) {
  for (const _ in obj) {
    return false;
  }
  return true;
}

/**
 * 寻找列表对象中的值
 * @param list list
 * @param key 寻找的值的键名
 * @param value 寻找的值
 * @returns 返回寻找到的对象，没找到返回 null
 */
export function findObject(list: any[], key: string, value: any) {
  for (const index in list) {
    if (list[index][key] === value) {
      return list[index];
    }
  }
  return null;
}

/**
 * 寻找树中节点中的值
 * @param tree 树
 * @param key 寻找的值的键名
 * @param value 寻找的值
 * @param childrenName 子节点键名
 * @returns 返回寻找到的节点，没找到返回 null
 */
export function findTreeObject(tree: any[], key: string, value: any, childrenName = "children"): any {
  for (const index in tree) {
    if (tree[index][key] === value) {
      return tree[index];
    }
    if (tree[index][childrenName]?.length > 0) {
      const res = findTreeObject(tree[index][childrenName], key, value, childrenName);
      if (res !== null) {
        return res;
      }
    }
  }
  return null;
}

/**
 * 列表结构转树形结构
 * @param list list
 * @param parentIdKey list 中父节点唯一ID的键名
 * @param rowIdKey list 中节点唯一ID的键名
 * @param childrenKey 设置的子节点的键名
 * @returns 返回构建好的树
 */
export function listToTree(list: any[], parentIdKey = "parentId", rowIdKey = "id", childrenKey = "children") {
  const map: any = {};
  let node: any;
  const roots: any[] = [];
  let i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i][rowIdKey]] = i;
    list[i][childrenKey] = null;
    list[i].isLeaf = true;
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node[parentIdKey] != "0" && node[parentIdKey] !== null) {
      if (list[map[node[parentIdKey]]]) {
        list[map[node[parentIdKey]]][childrenKey] = list[map[node[parentIdKey]]][childrenKey] || [];
        list[map[node[parentIdKey]]][childrenKey].push(node);
        list[map[node[parentIdKey]]].isLeaf = false;
      }
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/**
 * 防抖
 * @returns 函数闭包
 */
export function debounce() {
  let timeout: number;
  return function (func: () => void, wait: number) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(func, wait);
  };
}

/**
 * 格式化时间戳
 * @param t 时间戳
 * @returns 格式化后的时间
 */
export function formatDateTime(t: moment.MomentInput) {
  return moment(t).format("YYYY-MM-DD HH:mm:ss");
}

export function encryptAES(s: string) {
  const key = CryptoJS.enc.Utf8.parse("seeingflow123456");
  const iv = CryptoJS.enc.Utf8.parse("16-Bytes--String");
  return CryptoJS.AES.encrypt(s, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
}

/**
 * 获取字符串的md5
 * @param s 字符串
 */
export function getMd5(s: string) {
  return CryptoJS.MD5(s).toString();
}

const opt = Object.prototype.toString;
export function isObject(obj: any): obj is Record<string, unknown> {
  return opt.call(obj) === "[object Object]";
}
export function isArray(obj: any): obj is any[] {
  return opt.call(obj) === "[object Array]";
}

/**
 *
 * @param obj
 * @param path
 * @returns
 */
export const getValueByPath = <T = any>(obj: Record<string, any> | undefined, path: string | undefined): T | undefined => {
  if (!obj || !path) {
    return undefined;
  }

  const keys = path.split(".");
  if (keys.length === 0) {
    return undefined;
  }

  let temp = obj;

  for (let i = 0; i < keys.length; i++) {
    if ((!isObject(temp) && !isArray(temp)) || !keys[i]) {
      return undefined;
    }
    if (i !== keys.length - 1) {
      temp = temp[keys[i]] as T;
    } else {
      return temp[keys[i]] as T;
    }
  }

  return undefined;
};

export function generatorAvator(username: string, size = 512, bgColor = undefined): Promise<Blob | null> {
  let name: string;
  if (/^[a-zA-Z]+$/.test(username.slice(0, 4))) {
    name = username.slice(0, 4);
  } else {
    name = username.slice(-2);
  }
  const colors = [
    "247,114,52",
    "245,63,63",
    "255,125,0",
    "247,186,30",
    "159,219,29",
    "20,201,201",
    "52,145,250",
    "114,46,209",
    "217,26,217",
    "245,49,157",
    "134,144,156",
  ];
  const setColor = bgColor ? bgColor : `rgb(${colors[parseInt(String(Math.random() * colors.length))]})`;
  const setFontSize = size / 3;
  const canv = document.createElement("canvas");
  canv.setAttribute("width", String(size));
  canv.setAttribute("height", String(size));
  const canvCtx = canv.getContext("2d");
  if (canvCtx) {
    canvCtx.fillStyle = setColor;
    canvCtx.fillRect(0, 0, size, size);
    canvCtx.fillStyle = "#ffffff";
    canvCtx.font = `normal ${setFontSize}px sans-serif`;
    canvCtx.textAlign = "center";
    canvCtx.textBaseline = "middle";
    canvCtx.fillText(name, size / 2, size / 2);
    return new Promise((resolve) => {
      canv.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  } else {
    return Promise.resolve(null);
  }
}

/**
 * 数组对象转 Map
 * @param list 数组类型的对象
 * @param key 对象中的 key
 * @returns 返回 Map
 */
export function listObjToMap<T = Record<string, any>>(list: T[], key: keyof T) {
  const m = new Map();
  list.forEach((item) => {
    m.set((item as any)[key], item);
  });
  return m;
}
