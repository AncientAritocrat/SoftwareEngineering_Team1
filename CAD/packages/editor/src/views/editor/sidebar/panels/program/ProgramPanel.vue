<template>
    <monaco-editor :style="{ height: '100%' }" :minimap="false" :wordWrap="true" :lineNumbers="true" v-model="codeValue"
        ref="codeEditor" language="javascript" @change="programChanged"></monaco-editor>
</template>
<script lang="ts" setup>
import type { editorContext } from '@/types';
import { inject, onMounted, onBeforeUnmount, ref } from 'vue';
import MonacoEditor from '@/components/MonacoEditor.vue';
const { mapApp } = inject<editorContext>('editorContext') as editorContext;
const codeEditor = ref(null);
const codeValue = mapApp.config.program?.onMapLoaded ?? '';
let program = codeValue;
onMounted(() => {
    // @ts-ignore
    codeEditor.value?.setValue(program);
})

const updateProgram = (isExec?: boolean) => {
    // @ts-ignore
    const val = codeEditor.value?.getValue();
    if (val != (mapApp.config.program?.onMapLoaded ?? '')) {
        mapApp.config.program = mapApp.config.program || {}
        mapApp.config.program.onMapLoaded = val;
        if (isExec) mapApp.execProgram();
    }
};

const programChanged = () => {
    updateProgram(false)
}

onBeforeUnmount(() => {
    updateProgram(true)
});

</script>