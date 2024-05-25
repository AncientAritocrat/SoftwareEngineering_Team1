<template>
    <div>
        <div :id = "id" :class = "mapClass" :style="{backgroundColor: backcolor}">
        </div>
        <div :class = "uiClass" v-if="(ui && isLoaded)">
            <component ref="uiComponent" v-model="value" :is="ui.comp" v-bind="ui?.props || {}" v-on="ui?.listeners || {}"></component>
        </div>
    </div>
</template>

<script setup lang="ts">
import 'vjmap/dist/vjmap.min.css'
import { useAppStore } from '@/stores/app';
import { MapApp } from '@vjmap/common';
import type { editorContext } from '@/types';
import { inject, onMounted, onUnmounted, provide, ref, toRaw } from 'vue';
const emit = defineEmits(["onClose"]);
const editorCxt = inject<editorContext>('editorContext') as editorContext ?? {};
const  { mapApp, uiApp } = editorCxt;
const uiClass = ref(mapApp ? "uicomp_container" : "uicomp_container_full");
const mapClass = ref(mapApp ? "mapcomp_container" : "mapcomp_container_full");
const uiComponent = ref(null)
const props = defineProps({
    methods: {
        type: Object,
        required: false
    },
    mapOpenOptions: {
        type: Object,
        required: false
    },
    mapOptions: {
        type: Object,
        required: false
    },
    isLoadImages: {
        type: Boolean,
        required: false
    },
    ui: {
        type: Object,
        required: false
    },
    cfg: {
        type: Object,
        required: false
    },
    id: {
        type: String,
        required: false,
        default: 'map_container'
    }
});
const app = useAppStore();
const mApp = new MapApp();
const cfg = props.cfg ?? mapApp?.getConfig() ?? {};
const value = ref(props.ui?.value);
const isLoaded = ref(false);
const backcolor = ref(cfg.backgroundColor ?? '#161624');
provide("interactiveMap", mApp); // 用于交互选择的地图对象
onMounted(() => {
    setTimeout(() => loadMap(), 500);
})
let context: any;
const loadMap = async () => {
    mApp.mount(props.id,  {
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
        mapOpenOptions: {...cfg.mapOpenOptions, ...props.mapOpenOptions},
        // 地图选项
        mapOptions: {...cfg.mapOptions, ...props.mapOptions},
        // 底图类型
        baseMapType: cfg.baseMapType,
        // 底图为互联网地图时，数据瓦片地址
        webMapTiles: cfg.webMapTiles ? [...cfg.webMapTiles] : undefined
    }
    if (props.isLoadImages) {
        config.mapImages = [...cfg.mapImages ?? []];
    }
    // @ts-ignore
    await mApp.setConfig(config);
    isLoaded.value = true; // 加载完才显示ui界面
    // @ts-ignore
    if (typeof props?.methods?.onMounted == 'function') {
        props.methods.onMounted(mApp, close, context, value.value);
    }
}
onUnmounted(() => {
    if (typeof props?.methods?.onUnmounted == 'function') {
        props.methods.onUnmounted(mApp);
    } 
    mApp.destory();
});
const close = (isOk: boolean, res: any) => {
    emit("onClose", isOk, res);
    uiApp?.closeModal(); 
}
const getResult = () => {
    let res: any;
    // @ts-ignore
    if (typeof props?.methods?.getResult == 'function') {
        res = props.methods.getResult(mApp, close, context, value.value);
        // @ts-ignore
    } else if (typeof uiComponent.value?.getResult == 'function') {
        // @ts-ignore
        res =  uiComponent.value?.getResult();
    } else {
        if (toRaw(value.value)) {
            // 如果没有返回值，但ui有值，则用ui的做为返回值
            res = {
                value: toRaw(value.value)
            }
        }
    }
    return res;
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
   getResult
})
</script>
<style scoped>
.mapcomp_container {
    position: fixed;
    left: 20px;
    top: 45px;
    right: 20px;
    bottom: 5px;
    background: #022b4f;
}

.uicomp_container {
    z-index: 2;
    position: fixed;
    left: 20px;
    top: 45px;
}

.mapcomp_container_full {
    position: fixed;
    left: 0px;
    top: 35px;
    right: 0px;
    bottom: 0px;
    background: #022b4f;
}

.uicomp_container_full {
    z-index: 2;
    position: fixed;
    left: 0px;
    top: 35px;
}
</style>
