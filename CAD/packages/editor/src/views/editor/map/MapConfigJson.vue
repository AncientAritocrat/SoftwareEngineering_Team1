<template>
    <div>
        <monaco-editor :style="{height: '500px'}" v-model="json"  ref="mapCfgEditor"></monaco-editor>
    </div>
</template>

<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor.vue';
import type { editorContext } from '@/types';
import { inject, ref } from 'vue';
const { mapApp } = inject<editorContext>('editorContext') as editorContext;
const config = mapApp.getConfig();
const json = JSON.stringify(config, null, 4);
let mapCfgEditor = ref(null);

const getResult = () => {
    let value = (mapCfgEditor.value as any).getValue();
    let obj;
    try {
        obj = JSON.parse(value);
    } catch (error: any) {
        window.$message.error(error);
    }
    return obj;
}

// 如果对话框要返回值，则必须导出此方法
defineExpose({
   getResult
})
</script>