/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '@ckpack/vue-color';
declare module '@arco-design/color';
declare module "@/components/bpmnProcessDesigner/package/designer/plugins/content-pad";
declare module "@/components/bpmnProcessDesigner/package/designer/plugins/palette";
declare module "@/components/bpmnProcessDesigner/package/palette/ProcessPalette";

declare interface Window {
  JAnalyticsInterface: any;
  seeingflow: {
    version: {
      commitDate: string;
      commitHash: string;
      buildDate: string;
      tag: string;
      version: string;
    }
  }
}
