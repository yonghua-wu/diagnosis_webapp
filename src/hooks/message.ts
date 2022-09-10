import { Message as ArcoMessage } from "@arco-design/web-vue";
import { MessageConfig } from "@arco-design/web-vue/es/message/interface";

export default class Message1 {
  public static success(config: string | MessageConfig) {
    ArcoMessage.success(config);
  }
}
