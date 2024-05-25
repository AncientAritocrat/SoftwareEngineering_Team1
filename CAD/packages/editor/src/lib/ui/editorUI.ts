import { reactive } from 'vue';

import type { EditorUiComp, EditorUiState } from '@/types';
const state = reactive<EditorUiState>({
  curPaneName: '',
  curFloatPaneName: '',
  curFloatPaneTitle: '',
  curFloatChildPaneName: '',
  curFloatChildPaneTitle: '',
  curModalName: '',
  curModalTitle: '',
});

let curPanelComponent: EditorUiComp | undefined | null; // 当前面板的组件
let curFloatComponent: EditorUiComp | undefined | null; // 当前浮动的组件
let curFloatChildComponent: EditorUiComp | undefined | null; // 当前浮动的子组件
let curModalCompent: EditorUiComp | undefined | null; // 当前弹框组件

class EditorUi {
  constructor() {
  }

  public set<T = any>(name: keyof EditorUiState, value: T) {
    (state as any)[name] = value;
  }

  public get<T>(name: keyof typeof state): T {
    return (state as any)[name];
  }

  /** 显示浮动面板 */
  public showPane(name: string, uiComp?: EditorUiComp) {
    this.closeFloatComponent();
    curPanelComponent = uiComp;
    state.curPaneName = name;
  }

  /** 显示浮动面板 */
  public showFloatPane(name: string, title: string, uiComp?: EditorUiComp) {
    curFloatComponent = uiComp;
    state.curFloatPaneName = name;
    state.curFloatPaneTitle = title;
  }

  /** 显示浮动子面板 */
  public showFloatChildPane(name: string, title: string, uiComp?: EditorUiComp) {
    curFloatChildComponent = uiComp;
    state.curFloatChildPaneName = name;
    state.curFloatChildPaneTitle = title;
  }
  
  /** 获取当前面板组件 */
  public getCurPanelComponent() {
    return curPanelComponent;
  }

  /** 获取当前浮动面板组件 */
  public getCurFloatComponent() {
    return curFloatComponent;
  }

  /** 获取当前浮动子面板组件 */
  public getCurFloatChildComponent() {
    return curFloatChildComponent;
  }

  /** 关闭当前浮动面板组件 */
  public closeFloatComponent() {
    this.closeFloatChildComponent(); // 先关闭子浮动面板
    return this.showFloatPane('', '', undefined);
  }

  /** 关闭当前浮动子面板组件 */
  public closeFloatChildComponent() {
    return this.showFloatChildPane('', '', undefined);
  }
  

  /** 显示弹框 */
  public showModal(name: string, title: string, uiComp?: EditorUiComp) {
    curModalCompent = uiComp;
    state.curModalName = name;
    state.curModalTitle = title;
  }

  /** 异步显示弹框 */
  public showModalAsync(name: string, title: string, uiComp?: EditorUiComp): Promise<{
    isOk: boolean;
    result: any
  }> {
    return new Promise((resolve) => {
      let nativeClose: any;
      const onClose = (isOk: boolean, result: any) => {
        if (typeof nativeClose == 'function') nativeClose();
        resolve({
          isOk,
          result
        });
      }
    
      if (typeof(uiComp?.listeners?.onClose) != 'function') {
        // @ts-ignore
        uiComp.listeners = uiComp.listeners || {};
      } else {
        nativeClose = uiComp?.listeners?.onClose;
      }
      // @ts-ignore
      uiComp.listeners.onClose = onClose;
      this.showModal(name, title, uiComp);
    })
    
  }

  /** 关闭弹框 */
  public closeModal() {
    curModalCompent = null;
    state.curModalName = '';
    state.curModalTitle = '';
  }

  /** 获取弹出框组件 */
  public getCurModalComponent() {
    return curModalCompent;
  }

}

export { EditorUi };

export default new EditorUi();
