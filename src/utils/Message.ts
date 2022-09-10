import { Message as ArcoMessage } from "@arco-design/web-vue";
import { MessageConfig, MessageReturn } from "@arco-design/web-vue/es/message/interface";
import { AppContext } from "vue";

export default class Message {
  public static success(config: string | MessageConfig, ctx?: AppContext) {
    if (typeof config === "string") {
      return ArcoMessage.success(
        {
          content: config,
          id: config,
        },
        ctx,
      );
    } else {
      return ArcoMessage.success(config, ctx);
    }
  }
  public static error(config: string | MessageConfig, ctx?: AppContext) {
    if (typeof config === "string") {
      return ArcoMessage.error(
        {
          content: config,
          id: config,
        },
        ctx,
      );
    } else {
      return ArcoMessage.error(config, ctx);
    }
  }
  public static warning(config: string | MessageConfig, ctx?: AppContext) {
    if (typeof config === "string") {
      return ArcoMessage.warning(
        {
          content: config,
          id: config,
        },
        ctx,
      );
    } else {
      return ArcoMessage.warning(config, ctx);
    }
  }
  public static info(config: string | MessageConfig, ctx?: AppContext) {
    if (typeof config === "string") {
      return ArcoMessage.info(
        {
          content: config,
          id: config,
        },
        ctx,
      );
    } else {
      return ArcoMessage.info(config, ctx);
    }
  }
  public static loading(config: string | MessageConfig, ctx?: AppContext) {
    return ArcoMessage.loading(config, ctx);
  }
  public static delayLoading(config: string | MessageConfig, delay: number, ctx?: AppContext) {
    let timer: number | undefined;
    let close: MessageReturn | undefined;
    let _config: MessageConfig;
    if (typeof config === "string") {
      _config = {
        content: config,
        id: config,
        duration: -1,
      };
    } else {
      _config = config;
    }

    timer = setTimeout(() => {
      timer = undefined;
      close = this.loading(_config, ctx);
    }, delay);

    return () => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      if (close !== undefined) {
        close.close();
        close = undefined;
      }
    };
  }
  public static clear(position?: "bottom" | "top") {
    return ArcoMessage.clear(position);
  }
}
