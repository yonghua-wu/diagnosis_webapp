import { Modal, ModalConfig } from "@arco-design/web-vue";

export default function useModal() {
  return {
    showModal(config: ModalConfig): Promise<void> {
      return new Promise((resolve, reject) => {
        Modal.warning({
          ...config,
          hideCancel: config.hideCancel || false,
          onOk() {
            config?.onOk?.();
            resolve();
          },
          onCancel() {
            config?.onCancel?.();
            reject();
          },
        });
      });
    },
  };
}
