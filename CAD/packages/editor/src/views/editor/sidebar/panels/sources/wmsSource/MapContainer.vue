<template>
    <div :id = "'map_container' + id" class = "mapContainer" :style="{backgroundColor: backcolor}">
    </div>
</template>

<script setup lang="ts">
import 'vjmap/dist/vjmap.min.css'
import { useAppStore } from '@/stores/app';
import { MapApp } from "~/MapApp";
import type { editorContext } from '@/types';
import { inject, onMounted, onUnmounted, ref } from 'vue';
import vjmap, { ButtonGroupControl, geoPoint, MousePositionControl } from 'vjmap';
import { getEpsgRange, isWebBaseMap } from '~/export';
const emit = defineEmits(["onMapMounted", "onMapUnmounted"]);
const editorCxt = inject<editorContext>('editorContext') as editorContext ?? {};
const  { mapApp } = editorCxt;
const props = defineProps({
    id: {
        type: Number,
        required: false,
        default: 0
    },
    mapParam: {
        type: Object,
        required: false,
    }
});
const app = useAppStore();
const mApp = new MapApp();
const cfg = mapApp?.getConfig() ?? {};
const isLoaded = ref(false);
const backcolor = ref(cfg.backgroundColor ?? '#161624');
onMounted(() => {
    setTimeout(() => loadMap(), 500);
})
const loadMap = async () => {
    mApp.mount('map_container' + props.id,  {
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
        // 地图缺省范围
        mapInitBounds: cfg.mapInitBounds,
        // div背景色
        backgroundColor: cfg.backgroundColor,
        // 地图打开
        mapOpenOptions: {...props.mapParam},
        // 地图选项
        mapOptions: {...cfg.mapOptions},
        // 底图类型
        baseMapType: props.mapParam?.baseMapType,
        // 底图为互联网地图时，数据瓦片地址
        webMapTiles: props.mapParam?.webMapTiles ? [...props.mapParam.webMapTiles] : undefined
    }
   
    // @ts-ignore
    await mApp.setConfig(config);
    if (!mApp.isWebBaseMap()) {
        mApp.map.fitMapBounds();
    }
    
    const mousePositionControl = new MousePositionControl({
        showZoom: true
    });
    mApp.map.addControl(mousePositionControl, "bottom-left");

    let options = {
        buttons: [{
            id: "full",
            title: "全图显示",
            text: "全图",
            onActivate: () => {
                mApp.map.fitMapBounds()
            }
        }]
    };
    let btnGroupCtrl = new ButtonGroupControl(options);
    mApp.map.addControl(btnGroupCtrl, 'bottom-right');

    isLoaded.value = true; // 加载完才显示ui界面
    emit("onMapMounted", {
        id: props.id,
        mApp
    })
}
onUnmounted(() => {
    mApp.destory();
    emit("onMapUnmounted", {
        id: props.id,
        mApp
    })
});
</script>
<style scoped>
.mapContainer {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
