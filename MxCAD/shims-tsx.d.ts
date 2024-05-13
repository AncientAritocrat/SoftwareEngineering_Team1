import Vue, { VNode } from 'vue'



declare global {
  const MxPluginContext: typeof import("./MxPluginContext").default
  interface Window {
    MxPluginContext: typeof import("./MxPluginContext").default
  }
  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

}
