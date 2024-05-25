<template>
    <div id="mapContainer"></div>
</template>

<script setup lang="ts">
import 'vjmap/dist/vjmap.min.css'
import { inject, onMounted, onUnmounted } from 'vue'
import type { editorContext } from '@/types';
import { useAppStore } from '@/stores/app';
const editor = inject<editorContext>('editorContext');
const app = useAppStore();
onMounted(() => {
    if (editor?.mapApp && editor?.mapApp) editor.mapApp.isEditorMode = true;// 编辑模式
    editor?.mapApp.mount("mapContainer",  {
        serviceUrl: app.serviceUrl,
        serviceToken: app.accessToken
    });
    if (editor?.mapApp.map) {
        setTimeout(() => editor?.mapApp.map.resize(), 100);
    }
})
onUnmounted(() => {
    editor?.mapApp.destory();
});
</script>

<style lang="scss" scoped>
#mapContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #022b4f;
}
</style>