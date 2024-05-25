<template>
    <div id="mapdata_preview" :style="{ backgroundColor: backcolor }">
    </div>
</template>

<script setup lang="ts">
import 'vjmap/dist/vjmap.min.css'
import { useAppStore } from '@/stores/app';
import { MapApp, setLayerOpacity } from "@vjmap/common";
import type { editorContext } from '@/types';
import { inject, onMounted, onUnmounted, ref } from 'vue';
const editorCxt = inject<editorContext>('editorContext') as editorContext ?? {};
const { mapApp } = editorCxt;
const props = defineProps({
    data: {
    }
});

const app = useAppStore();
const mApp = new MapApp();
const cfg = mapApp?.getConfig() ?? {};
const backcolor = ref(cfg.backgroundColor ?? '#161624');
onMounted(() => {
    setTimeout(() => loadMap(), 500);
})
const loadMap = async () => {
    mApp.mount("mapdata_preview", {
        serviceUrl: app.serviceUrl,
        serviceToken: app.accessToken
    });
    let config: any = {
        // 服务地址
        serviceUrl: cfg.serviceUrl ?? app.serviceUrl,
        // 服务token
        serviceToken: cfg.serviceToken ?? app.accessToken,
        // 访问key,[如果多个时用;分开。访问有密码保护的图如果key正确将不会弹密码输入框]
        accessKey: cfg.accessKey,
        // 工作区名称
        workspace: cfg.workspace,
        // div背景色
        backgroundColor: cfg.backgroundColor,
        // 地图缺省范围
        mapInitBounds: cfg.mapInitBounds,
        // 地图打开
        mapOpenOptions: { ...cfg.mapOpenOptions },
        // 地图选项
        mapOptions: { ...cfg.mapOptions },
        // 底图类型
        baseMapType: cfg.baseMapType,
        // 底图为互联网地图时，数据瓦片地址
        webMapTiles: cfg.webMapTiles ? [...cfg.webMapTiles] : undefined
    }
    // @ts-ignore
    await mApp.setConfig(config);
    await mApp.addSource({
        "id": "geojson",
        "tag": "static",
        "source": {
            "type": "geojson",
              "data": props.data ?? {}
        },
        "props": {}
    }, true);
    await mApp.addLayer({
        "layerId": "geojson",
        "sourceId": "geojson",
        "memo": "",
        "type": "geojson",
        "fillColor": "#00ffff",
        "fillOutlineColor": "#00ff00",
        "lineColor": "#ff0000",
        "lineWidth": 1,
        "circleRadius": 5,
        "circleColor": "#ffff00"
    }, true);
    setLayerOpacity(mApp.map, 0.6, mapApp.isWebBaseMap() ? "_base_webmap_" : ""); // 设置透明度，方便查看数据
}
onUnmounted(() => {
    mApp.destory();
});
</script>
<style scoped>
#mapdata_preview {
    width: 800px;
    height: 500px;
}
</style>