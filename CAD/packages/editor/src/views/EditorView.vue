<template>
  <n-layout class="layout-container">
    <n-layout-header class="layout-header" bordered>
      <editor-header/>
    </n-layout-header>
    <n-layout position="absolute" class="layout-content" has-sider>
      <n-layout-sider
        content-style="padding: 2px;"
        collapse-mode="width"
        :collapsed-width="0"
        :width="editorSiderLeftWidth"
        show-trigger="arrow-circle"
        :native-scrollbar="false"
        bordered
      >
        <editor-main-panel/>
      </n-layout-sider>
      <Resizer @change="changeLeft"></Resizer>
      <n-layout  :native-scrollbar="false">
        <map-container/>
      </n-layout>
    </n-layout>
  </n-layout>
  <n-modal 
    v-model:show="isShowModal" preset="dialog" :title="modalTitle" 
    :style="modelBodyStyle"
    :closeOnEsc="false"
    :maskClosable="false"
    :positive-text="modalPositiveText"
    :negative-text="modalNegativeText"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick">
    <component class="sider-panel" ref="modalComp" :is="modelCfg?.component" v-bind="modelCfg?.props || {}" v-on="modelCfg?.listeners || {}"> </component>
  </n-modal>
</template>

<script setup lang="ts">
import Resizer from '@/components/Resizer.vue';
import EditorHeader from '@/views/editor/header/EditorHeader.vue';
import EditorMainPanel from '@/views/editor/sidebar/MainPanel.vue'
import { useAppStore } from "@/stores/app";
import { computed, onMounted, provide, reactive, ref, watch } from 'vue'
import type { editorContext } from '@/types';
import editorUI from '@/lib/ui/editorUI';
import { MapApp } from '@vjmap/common';
import MapContainer from './editor/map/MapContainer.vue';
const app = useAppStore();
const modalComp = ref(null)
const isShowModal = ref(false);
const modelName = computed(() => editorUI.get("curModalName"));
const modalTitle = computed(() => editorUI.get("curModalTitle"));
const panelName = computed(() => editor?.uiApp.get('curPaneName'));
const editorSiderLeftWidth = computed(() => panelName.value == "program" ? 900 : app.editorSiderLeftWidth);
let modelCfg = reactive<any>({});
const modalPositiveText = ref("确定");
const modalNegativeText = ref("取消");
const modelBodyStyle = reactive<any>({
  width: '400px'
});
const changeLeft = (deltaX: number) => {
  if (panelName.value != "program") app.editorSiderLeftWidth += deltaX;
};
watch(() => editorUI.get("curModalName"), () => {
  isShowModal.value = modelName.value != "";
  modelCfg = editor?.uiApp.getCurModalComponent();
  modalPositiveText.value = '确定';
  if (modelCfg?.props?.positiveText !== undefined) {
    modalPositiveText.value = modelCfg?.props?.positiveText;
  }
  modalNegativeText.value = '取消';
  if (modelCfg?.props?.negativeText !== undefined) {
    modalNegativeText.value = modelCfg?.props?.negativeText;
  }
  if (modelCfg?.props?.bodyStyle) {
    delete modelBodyStyle.width;
    delete modelBodyStyle.height;
    for(let k in modelCfg?.props?.bodyStyle)   {
      modelBodyStyle[k] = modelCfg?.props?.bodyStyle[k];
    }
    
  } else {
    modelBodyStyle.width = '400px';
    if (modelCfg?.props?.width) {
      modelBodyStyle.width = modelCfg?.props?.width;
    }
    if (modelCfg?.props?.height) {
      modelBodyStyle.height = modelCfg?.props?.height;
    }
  }
});

watch(isShowModal, () => {
  if (!isShowModal.value) onNegativeClick();
});

const onPositiveClick = () => {
  // @ts-ignore
  if (typeof modalComp?.value?.beforeClose == 'function') {
    // @ts-ignore
    if (modalComp.value.beforeClose() === false) return false; // 关闭前回调，返回false的话将取消对话框的关闭
  }
  if (typeof(modelCfg?.listeners?.onClose) == 'function') {
    // @ts-ignore
    modelCfg?.listeners?.onClose(true, modalComp?.value?.getResult?.());
  }
  editor?.uiApp.closeModal();
}

const onNegativeClick = () => {
  // @ts-ignore
  if (typeof modalComp?.value?.onClose == 'function') {
    // @ts-ignore
    modalComp.value.onClose(); // 关闭回调
  }
  if (typeof(modelCfg?.listeners?.onClose) == 'function') {
    // @ts-ignore
    modelCfg?.listeners?.onClose(false);
  }
  editor?.uiApp.closeModal();
}

const editor: editorContext = {
  uiApp: editorUI,
  mapApp: new MapApp()
}
provide("editorContext", editor);


</script>

<style lang="scss" scoped>
.layout-container {
  height: calc(100vh - 37px);

  .layout-header {
    padding: 2px;
    height: 42px;
  }

  .layout-content {
    top: 42px;
    bottom: 0px;
  }
}
</style>