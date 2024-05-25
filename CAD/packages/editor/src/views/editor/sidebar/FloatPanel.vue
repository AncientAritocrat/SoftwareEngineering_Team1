<template>
  <div class="editor-mapfloatpanel" v-if="cardName">
    <n-card class="box-card" :title="cardTitle" :closable="config?.props?.showCloseButton" @close="close()" size="small">
      <template #header-extra>
        <n-space>
          <n-button type="error" ghost size="tiny" v-if="!(config?.props?.hideOkButton)"  @click="close()">
            取消
          </n-button>
          <n-button type="info" ghost size="tiny" v-if="!(config?.props?.hideCancelButton)"  @click="onOK()">
            确定
          </n-button>
        </n-space>
      </template>
      <component :is="config?.component" ref="floatComp" v-bind="config?.props || {}" v-on="config?.listeners || {}"> </component>
    </n-card>
    <div class="editor-mapfloatchildpanel" v-if="childCardName">
      <n-card class="box-card" :title="childCardTitle" :closable="childConfig?.props?.showCloseButton" @close="closeChild()" size="small">
        <template #header-extra>
        <n-space>
          <n-button type="warning" ghost size="tiny" v-if="!(childConfig?.props?.hideOkButton)"  @click="closeChild()">
            取消
          </n-button>
          <n-button type="success" ghost size="tiny" v-if="!(childConfig?.props?.hideCancelButton)"  @click="onOKChild()">
            确定
          </n-button>
        </n-space>
      </template>
        <component :is="childConfig?.component" ref="floatChildComp"  v-bind="childConfig?.props || {}" v-on="childConfig?.listeners || {}">
        </component>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { inject } from 'vue'
import type { EditorUiComp, editorContext } from '@/types';
const editor = inject<editorContext>('editorContext');
const cardTitle = computed(() => editor?.uiApp.get('curFloatPaneTitle'));
const cardName = computed(() => editor?.uiApp.get('curFloatPaneName'));
const childCardName = computed(() => editor?.uiApp.get('curFloatChildPaneName'));
const childCardTitle = computed(() => editor?.uiApp.get('curFloatChildPaneTitle'));
const config = ref<EditorUiComp|undefined|null>();
const childConfig = ref<EditorUiComp|undefined|null>();
const floatComp = ref(null)
const floatChildComp = ref(null)
const close = () => {
  if (typeof(config.value?.listeners?.onClose) == 'function') {
    config.value.listeners.onClose(floatComp.value);
  }
   // @ts-ignore
   if (typeof floatComp?.value?.onClose == 'function') {
    // @ts-ignore
    floatComp.value.onClose(); // 
  }
  editor?.uiApp.closeFloatComponent();
}
const onOK = () => {
  // 确定
  if (typeof(config.value?.listeners?.onOK) == 'function') {
    config.value.listeners.onOK(floatComp.value);
  }
  // @ts-ignore
  if (typeof floatComp?.value?.onOK == 'function') {
    // @ts-ignore
    floatComp.value.onOK(); // 
  }
  editor?.uiApp.closeFloatComponent();
}
const closeChild = () => {
  if (typeof(childConfig.value?.listeners?.onClose) == 'function') {
    childConfig.value.listeners.onClose(floatChildComp.value);
  }
  // @ts-ignore
  if (typeof floatChildComp?.value?.onClose == 'function') {
    // @ts-ignore
    floatChildComp.value.onClose(); // 
  }
  editor?.uiApp.closeFloatChildComponent();
}
const onOKChild = () => {
  // 确定
  if (typeof(childConfig.value?.listeners?.onOK) == 'function') {
    childConfig.value.listeners.onOK(floatChildComp.value);
  }
   // @ts-ignore
   if (typeof floatChildComp?.value?.onOK == 'function') {
    // @ts-ignore
    floatChildComp.value.onOK(); // 
  }
  editor?.uiApp.closeFloatChildComponent();
}

watch(cardName, ()=> {
  if (cardName.value) {
    config.value = editor?.uiApp.getCurFloatComponent();
  } else {
    config.value = null;
  }
})
watch(childCardName, ()=> {
  if (childCardName.value) {
    childConfig.value = editor?.uiApp.getCurFloatChildComponent();
  } else {
    childConfig.value = null;
  }
})
</script>

<style lang="scss" scope>
.editor-mapfloatpanel {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 2px;
    height: 100%;
    z-index: 100;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .text {
      font-size: 14px;
    }
    
    .item {
      margin-bottom: 18px;
    }
    
    .box-card {
      width: 100%;
      height: 100%;
    }

    .el-card__header {
      padding: 0;
    }
  }

  
  .editor-mapfloatchildpanel {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 2px;
    height: 100%;
    z-index: 200;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .text {
      font-size: 14px;
    }
    
    .item {
      margin-bottom: 18px;
    }
    
    .box-card {
      width: 100%;
      height: 100%;
    }
  }
</style>