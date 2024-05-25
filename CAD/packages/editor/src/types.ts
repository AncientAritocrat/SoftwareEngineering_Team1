import type MapApp from "~/MapApp";
import type { EditorUi } from "./lib/ui/editorUI";

export interface ButtonIconItem {
    id?: string;
    title?: string;
    icon?: any;
    tooltip?: string;
    type?: string;
    color?: string;
    click: Function;
    switchIcon?: boolean;
    icon2?: any;
}

export interface EditorUiState {
    /** 当前面板名称 */
    curPaneName?: string;
    /** 当前浮动的面板名称 */
    curFloatPaneName?: string;
    /** 当前浮动的面板标题 */
    curFloatPaneTitle?: string;
    /** 当前浮动的子面板名称 */
    curFloatChildPaneName?: string;
    /** 当前浮动的子面板标题 */
    curFloatChildPaneTitle?: string;
    /** 当前弹框名称 */
    curModalName?: string;
    /** 当前弹框标题 */
    curModalTitle?: string;
  }
  
  export interface EditorUiComp {
    /** 组件 */
    component?: any;
    /** 传入组件的props对象 */
    props?: Record<string, any>;
    /** 组件监听的事件对象，如：{ click: () => { console.log('click'); } } */
    listeners?: Record<string, Function>;
    slots?: Record<string, any>;
  }
  

  export interface editorContext {
    uiApp: EditorUi; 
    mapApp: MapApp;
  }