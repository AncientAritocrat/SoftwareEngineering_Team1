<template>
    <div :class="container">
        <n-space style="margin: 8px;">
            <n-button @click="showSourcePropDlg = true">数据源设置</n-button>
            <n-button @click="showWmsLayerPropDlg = true">WMS图层设置</n-button>
            <n-button @click="showJsonCfgModal">JSON配置数据</n-button>
        </n-space>
        <div class="mapComp">
            <div class="wmsContainer">
                <n-tabs v-model:value="panelValueRef" type="card" :addable="true" :closable="true" @close="handleTabClose"
                    @add="handleTabAdd" tab-style="min-width: 80px;" class="fullContainer">
                    <n-tab-pane display-directive="show:lazy" v-for="panel in panelsRef" :key="panel" :name="panel.name"
                        class="fullContainer tabpane">
                        <div class="wmsmap_comp" :style="{ backgroundColor: backcolor }">
                            <MapContainer :id="panel.id" :mapParam="panel" @onMapMounted="onMapMounted"
                                @onMapUnmounted="onMapUnmounted"></MapContainer>
                        </div>
                        <div class="wmsui_comp">
                            <n-space style="margin: 8px;">
                                <n-button @click="showSelectMapDlg = true">选择地图</n-button>
                                <n-button @click="showMapStyleDlg = true">地图样式</n-button>
                                <n-radio-group v-model:value="overlayMapType" style="margin-left: 40px;">
                                    <n-radio-button key="none" value="none" label="不叠加" />
                                    <n-radio-button key="direct" value="direct" label="直接叠加" />
                                    <n-radio-button key="auto" value="auto" label="坐标系自动叠加" />
                                    <n-radio-button key="param" value="param" label="公共点手动叠加" />
                                </n-radio-group>
                            </n-space>
                            <OverlayAutoSet v-if="overlayMapType == 'auto'" :value="panel" @posToCad="posToCad"
                                @update-value="(val) => updatePanelAutoVal(panel, val)" 
                                :baseMapIsWeb="baseMapIsWeb">
                            </OverlayAutoSet>

                            <OverlayParamSet v-if="overlayMapType == 'param'" :value="panel"
                                @update-value="(val) => updatePanelParamVal(panel, val)" 
                                @add-marker="addMarker"
                                @remove-markers="removeMarkers"
                            ></OverlayParamSet>
                        </div>
                    </n-tab-pane>
                    <template #prefix>
                        要叠加的图
                    </template>
                </n-tabs>
            </div>
            <div id="map_container" :style="{ backgroundColor: backcolor, width: '50%' }">
            </div>
        </div>
        <n-modal v-model:show="showSelectMapDlg" preset="dialog" title="选择地图" :style="{ width: '880px' }">
            <SelectMapDlg @onClose="onCloseSelectMap" :hide-web="isHideWebInSelect" :hide-cad="isHideCadInSelect" />
        </n-modal>
        <n-modal v-model:show="showMapStyleDlg" preset="dialog" title="地图样式" :style="{ width: '500px' }">
            <MapStyleTab :ctxMapApp="getCurMapApp(true)" @onClose="onCloseStyleDlg" />
        </n-modal>
        <n-modal v-model:show="showJsonCfgDlg" preset="dialog" title="查看JSON数据配置" :style="{ width: '800px' }">
            <monaco-editor :style="{ height: '500px' }" v-model="mapJson" ref="mapCfgEditor"></monaco-editor>
        </n-modal>
        <n-modal v-model:show="showSourcePropDlg" preset="dialog" title="数据源设置" :style="{ width: '500px' }">
            <SourcePropDlg v-model="mapSourceProp" @onClose="showSourcePropDlg = false"></SourcePropDlg>
        </n-modal>
        <n-modal v-model:show="showWmsLayerPropDlg" preset="dialog" title="WMS图层属性设置" :style="{ width: '500px' }">
            <WmsLayerPropDlg v-model="wmsLayerProp" @onClose="showWmsLayerPropDlg = false"></WmsLayerPropDlg>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import 'vjmap/dist/vjmap.min.css'
import { useAppStore } from '@/stores/app';
import MonacoEditor from '@/components/MonacoEditor.vue';
import type { editorContext } from '@/types';
import { computed, inject, onMounted, onUnmounted, provide, reactive, ref, toRaw, watch } from 'vue';
import SelectMapDlg from '@/views/editor/sidebar/panels/basemap/SelectMapDlg.vue'
import MapStyleTab from '@/views/editor/sidebar/panels/basemap/MapStyleTab.vue'
import MapContainer from './MapContainer.vue'
import vjmap, { ButtonGroupControl, MousePositionControl, type IMapStyleParam } from 'vjmap';
import {MapApp, cad2webCoordinate, getWmsTileUrl, isWebBaseMap, WmsOverlayMapType, type WmsMapParam } from '@vjmap/common'
import SourcePropDlg from "./SourcePropDlg.vue"
import WmsLayerPropDlg from './WmsLayerPropDlg.vue'
import OverlayAutoSet from './OverlayAutoSet.vue';
import OverlayParamSet from './OverlayParamSet.vue';
const editorCxt = inject<editorContext>('editorContext') as editorContext ?? {};
const { mapApp, uiApp } = editorCxt;
const container = ref(mapApp ? "comp_container" : "comp_container_full");
const showSelectMapDlg = ref(false);
const showMapStyleDlg = ref(false);
const showJsonCfgDlg = ref(false);
const showSourcePropDlg = ref(false);
const showWmsLayerPropDlg = ref(false);
const mapJson = ref('');
const props = defineProps({
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
    value: {
        type: Object,
        required: false
    },
    cfg: {
        type: Object,
        required: false
    }
});
const app = useAppStore();
const mApp = new MapApp();
const cfg = props.cfg ?? mapApp?.getConfig() ?? {};
const propValue = ref(props.value);
const wmsValue = ref(propValue.value?.wms)
const isLoaded = ref(false);

const mapSourceProp = ref(propValue.value?.source);
const wmsLayerProp = ref(propValue.value?.wms?.param?.layerProps);
const baseMapXPrefix = ref(0);// 底图x前两位前缀
const baseMapIsWeb = ref(false);// 底图是否为互联网底图
const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
let panelId = 1;
const panelsRef = ref<{
    name: string;
    id: number;
    mapid?: string;
    version?: string;
    style?: IMapStyleParam,
    crs?: string;
    fourParameterX?: number;
    fourParameterY?: number;
    // 底图类型
    baseMapType?: "" | "CAD" | "WGS84" | "GCJ02"/*| "BD09"*/; // 底图为cad，或者为互联网地图的wgs84坐标（如osm、天地图)、或火星坐标如GCJ02(高德)。为空时默认为CAD图做为底图
    // 底图为互联网地图时，数据瓦片地址
    webMapTiles?: string[];
    isSetRotateZero?: boolean;
    coordinates?: {x1: number;y1: number;x2: number;y2: number;}[];
    coordxPrefix?: number; // x坐标前两位
}[]>([]);
if (wmsValue.value?.param?.maps && wmsValue.value?.param?.maps.length > 0) {
    for (let m of wmsValue.value.param.maps) {
        panelsRef.value.push({
            name: '图' + panelId,
            id: panelId,
            ...m
        });
        panelId++;
    }
} else {
    panelsRef.value.push({ name: '图1', id: panelId })
}
const panelValueRef = ref('图1');
const overlayMapType = ref(wmsValue.value?.overlayType ?? "none"); //叠加地图的方式 
const backcolor = ref(cfg.backgroundColor ?? '#161624');
const wmsMaps: Record<number, MapApp | undefined> = {};
const ui = {
    closeModal: () => { }
}
provide("interactiveMap", mApp); // 用于交互选择的地图对象
provide("interactiveUI", ui); // 用于交互选择的UI对象
onMounted(() => {
    setTimeout(() => loadMap(), 500);
})
const handleTabAdd = () => {
    const newValue = '图' + (Math.max(...panelsRef.value.map(p => +p.name.replace("图", ""))) + 1)
    panelsRef.value.push({
        name: newValue,
        id: ++panelId
    })
    panelValueRef.value = newValue
}

const handleTabClose = (name: string) => {
    const { value: panels } = panelsRef
    const nameIndex = panels.findIndex((panel) => panel.name === name)
    if (!~nameIndex) return
    if (panels.length == 1) {
        window.$message.error("最后一个不能删除")
        return;
    }
    panels.splice(nameIndex, 1)
    if (name === panelValueRef.value) {
        panelValueRef.value = panels[Math.min(nameIndex, panels.length - 1)].name
    }
}
const loadMap = async () => {
    mApp.mount("map_container", {
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
        mapOpenOptions: { ...cfg.mapOpenOptions, ...props.mapOpenOptions },
        // 地图选项
        mapOptions: { ...cfg.mapOptions, ...props.mapOptions },
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
    let x = 0;
    const center = mApp.map.fromLngLat(mApp.map.getCenter());
    if (center.x >= 10000000 && center.x < 100000000) {
        // x是八位取前两位
        x = +((center.x + '').substring(0, 2))
    }
    baseMapXPrefix.value = x;
    baseMapIsWeb.value = mApp.isWebBaseMap();
    refreshMap();
}

const showJsonCfgModal = () => {
    const config = mApp.getConfig();
    mapJson.value = JSON.stringify(config, null, 4);
    showJsonCfgDlg.value = true;
}
const getCurPanel = () => {
    return panelsRef.value.find(v => v.name == panelValueRef.value)
}
const getCurMapApp = (isCopy?: boolean) => {
    const panel = panelsRef.value.find(v => v.name == panelValueRef.value)
    if (!panel) return;
    let mp = wmsMaps[panel.id];
    if (isCopy) {
        let newMapApp = new MapApp();
        // @ts-ignore
        newMapApp.config = vjmap.cloneDeep(mp?.config);
        return newMapApp;
    }
    return mp;
}
const onMapMounted = (param: { id: number, mApp: MapApp }) => {
    wmsMaps[param.id] = param.mApp;
    const smApp = param.mApp;
    if (!smApp || !smApp.map) return;
    const panel = panelsRef.value.find(v => v.id == param.id)
    if (!panel) return;
    if (isWebBaseMap(panel.baseMapType)) {
        // 如果是互联网地图
        panel.coordxPrefix = baseMapXPrefix.value;
    } else {
        let x = 0;
        const center = smApp.map.fromLngLat(smApp.map.getCenter());
        if (center.x >= 10000000 && center.x < 100000000) {
            // x是八位取前两位
            x = +((center.x + '').substring(0, 2))
        }
        panel.coordxPrefix = x;
    }
    refreshOverlayMarkers(panel, smApp);
}

const onMapUnmounted = (param: { id: number, mApp: MapApp }) => {
    wmsMaps[param.id] = undefined;
}

const onCloseSelectMap = async (isOk: Boolean, item: Record<string, any>) => {
    showSelectMapDlg.value = false;
    if (!isOk) return;
    const panel = getCurPanel();
    if (panel) {
        panel.mapid = item.mapid,
            panel.version = item.version
        panel.baseMapType = item.baseMapType;
        panel.webMapTiles = item.webMapTiles;
    }
    const smApp = getCurMapApp();
    if (!smApp) return;

    smApp.config.mapOpenOptions = {
        ...smApp.config.mapOpenOptions,
        mapid: item.mapid,
        version: item.version,
        mapopenway: item.mapopenway,
        isVectorStyle: item.isVectorStyle,
    }
    smApp.config.baseMapType = item.baseMapType;
    smApp.config.webMapTiles = item.webMapTiles;
    await smApp.setConfig();
    if (!smApp.isWebBaseMap()) {
        smApp.map.fitMapBounds();
        let x = 0;
        const center = smApp.map.fromLngLat(smApp.map.getCenter());
        if (center.x >= 10000000 && center.x < 100000000) {
            // x是八位取前两位
            x = +((center.x + '').substring(0, 2))
        }
        if (panel) panel.coordxPrefix = x;
    } else {
        // 如果是互联网地图
        if (panel) panel.coordxPrefix = baseMapXPrefix.value;
    }
    removeMarkers();
}

const onCloseStyleDlg = (param: any = {}) => {
    showMapStyleDlg.value = false;
    const panel = getCurPanel();
    if (panel) {
        panel.style = param.config.mapOpenOptions?.style
    }
    const curMapApp = getCurMapApp();
    if (!curMapApp) return;
    // @ts-ignore
    curMapApp.config.mapOpenOptions = curMapApp.config.mapOpenOptions || {};
    // @ts-ignore
    curMapApp.config.mapOpenOptions.style = param.config.mapOpenOptions?.style;
    curMapApp.setConfig(undefined, true);
}
watch(panelValueRef, () => {
    refreshMakers();
});

watch(overlayMapType, () => {
    refreshMap();
})

watch(
    () => panelsRef,
    () => {
        refreshMap();
    },
    { deep: true }
)

watch(
    () => mapSourceProp,
    () => {
        refreshMap();
    },
    { deep: true }
)

watch(
    () => wmsLayerProp,
    () => {
        refreshMap();
    },
    { deep: true }
)
const getWmsSourceParam = () => {
    let layerProp = toRaw(wmsLayerProp.value)
    layerProp= layerProp ?? {}
    if (overlayMapType.value == WmsOverlayMapType.Direct) {
        // 直接叠加
        let overMapParams: WmsMapParam[] = [];
        for (let i = 0; i < panelsRef.value.length; i++) {
            if (panelsRef.value[i]?.mapid) {
                overMapParams.push({
                    mapid: panelsRef.value[i].mapid || "",
                    version: panelsRef.value[i]?.version,
                    // @ts-ignore
                    style: panelsRef.value[i]?.style ?? {
                        backcolor: mapApp?.config?.backgroundColor ?? 0
                    }
                })
            }
        }
        return {
            overlayType: WmsOverlayMapType.Direct,
            param: {
                maps: overMapParams,
                layerProps: layerProp
            }
        }
    } else if (overlayMapType.value == WmsOverlayMapType.Auto) {
        // 自动叠加
        let overMapParams: WmsMapParam[] = [];
        for (let i = 0; i < panelsRef.value.length; i++) {
            if (panelsRef.value[i]?.mapid || isWebBaseMap(panelsRef.value[i].baseMapType)) {
                overMapParams.push({
                    mapid: panelsRef.value[i].mapid || "",
                    version: panelsRef.value[i]?.version,
                    // @ts-ignore
                    style: panelsRef.value[i]?.style ?? {
                        backcolor: mapApp?.config?.backgroundColor ?? 0
                    },
                    crs: getEpsg(panelsRef.value[i].crs),
                    fourParameterX: panelsRef.value[i].fourParameterX,
                    fourParameterY: panelsRef.value[i].fourParameterY,
                    // 底图类型
                    baseMapType: panelsRef.value[i].baseMapType,
                    // 底图为互联网地图时，数据瓦片地址
                    webMapTiles: panelsRef.value[i].webMapTiles,
                })
            }
        }
        return {
            overlayType: WmsOverlayMapType.Auto,
            param: {
                maps: overMapParams,
                layerProps: layerProp
            }
        }
    } else if (overlayMapType.value == WmsOverlayMapType.Param) {
        // 参数叠加
        let overMapParams: WmsMapParam[] = [];
        for (let i = 0; i < panelsRef.value.length; i++) {
            if (panelsRef.value[i]?.mapid || isWebBaseMap(panelsRef.value[i].baseMapType)) {
                overMapParams.push({
                    mapid: panelsRef.value[i].mapid || "",
                    version: panelsRef.value[i]?.version,
                    // @ts-ignore
                    style: panelsRef.value[i]?.style ?? {
                        backcolor: mapApp?.config?.backgroundColor ?? 0
                    },
                    // 底图类型
                    baseMapType: panelsRef.value[i].baseMapType,
                    // 底图为互联网地图时，数据瓦片地址
                    webMapTiles: panelsRef.value[i].webMapTiles,
                    isSetRotateZero: panelsRef.value[i].isSetRotateZero,
                    coordinates: vjmap.cloneDeep(panelsRef.value[i].coordinates)
                })
            }
        }
        return {
            overlayType: WmsOverlayMapType.Param,
            param: {
                maps: overMapParams,
                layerProps: layerProp
            }
        }
    }
}
const getEpsg = (crs?: string | number) => {
    if (typeof (crs) == "number") {
        return "EPSG:" + crs;
    }
    return crs
}
const getSourceParam = () => {
    return {
        ...mapSourceProp.value,
        type: wmsLayerProp.value?.mvt === true ? "vector" : "raster",
    }
}

const refreshMakers = () => {
    mApp.map.removeMarkers();
    const curMapApp = getCurMapApp();
    const panel = getCurPanel();
    if (!panel || !curMapApp) return;
    if (overlayMapType.value != WmsOverlayMapType.Param) return;
    if (!panel.coordinates) return;
    let basePoints = panel.coordinates.map(w => vjmap.geoPoint([w.x1, w.y1]));
    let cadPoints = panel.coordinates.map(w => vjmap.geoPoint([w.x2, w.y2]));
    if (mApp.isWebBaseMap()) {
        basePoints = panel.coordinates.map(w => vjmap.geoPoint(vjmap.Projection.lngLat2Mercator([w.x1, w.y1])));
    }
    if (cadPoints.length == 0 || basePoints.length == 0) return;
    let param = vjmap.coordTransfromGetFourParamter(cadPoints, basePoints, panel.isSetRotateZero ?? false);
    for(let i = 0; i < panel.coordinates.length; i++) {
        let marker = new vjmap.Marker({
            color: colors[i % colors.length],
            draggable: true
        });
        marker.on('dragend', () => {
            let pt = mApp.map.fromLngLat(marker.getLngLat());
            // @ts-ignore
            panel.coordinates[i].x1 = pt.x;
            // @ts-ignore
            panel.coordinates[i].y1 = pt.y;
        });
        marker.setLngLat(mApp.map.toLngLat([panel.coordinates[i].x1, panel.coordinates[i].y1]));
        marker.addTo(mApp.map);
        // @ts-ignore
        let co = vjmap.coordTransfromByFourParamter(vjmap.geoPoint([panel.coordinates[i].x2, panel.coordinates[i].y2]), param);
        let marker2 = new vjmap.Marker({
            color: colors[i % colors.length],
        });
        if (mApp.isWebBaseMap()) {
            co = vjmap.geoPoint(vjmap.Projection.mercator2LngLat(co));
        }
        marker2.setLngLat(mApp.map.toLngLat([co.x, co.y]));
        marker2.addTo(mApp.map);
        marker2.getElement().style.opacity = "0.2";
        marker2.getElement().style.pointerEvents = 'none';
    }
}

const refreshMap = async () => {
    // 先清空所有数据源
    mApp.config.mapSources = [];
    await mApp.setConfig(undefined, true); // 每次刷新时不让位置发生变化
    let sid = "wms_" + vjmap.RandomID();
    let layerid = "wms_" + vjmap.RandomID();
    const wms = getWmsSourceParam();
    if (!wms) {
        return;
    }
    if (!mApp.map) return;
    let tiles = await getWmsTileUrl(mApp.svc, 
        {
        baseMapType: mApp.config.baseMapType,
        mapid: mApp.config.mapOpenOptions?.mapid,
        version: mApp.config.mapOpenOptions?.version,
        mapbounds: mApp.map.getGeoBounds(1.0).toString()
        },
        wms?.overlayType,
        wms?.param
    );
    refreshMakers();
    if (!tiles || tiles.length == 0 || (tiles.length == 1 && !tiles[0])) {
        return
    }

    await mApp.addSource({
        id: sid,
        tag: "wms",
        wms: getWmsSourceParam(),
        // @ts-ignore
        source: {
            ...getSourceParam()
        }
    }, true);
    let isWebMapOverlay = wms.param.maps.findIndex(m => isWebBaseMap(m.baseMapType)) >= 0;
    await mApp.addLayer({
        "layerId": layerid,
        "sourceId": sid,
        "type": wmsLayerProp.value?.mvt === true ? "vector" : "raster",
        isLowest: isWebMapOverlay // 如果互联网图层要放最下面
    }, true);
   
}

const isHideWebInSelect = computed(() => {
    if (mApp.isWebBaseMap()) {
        return true;
    } else {
        return false;
    }
})

const isHideCadInSelect = computed(() => {
    if (mApp.isWebBaseMap()) {
        return false;
    } else {
        if (overlayMapType.value == "auto") {
            if (!mApp.isWebBaseMap()) {
                return true;
            }
        }
        return false;
    }
})


const updatePanelAutoVal = (panel: any, val: any) => {
    if (val) {
        panel.crs = val.crs;
        panel.fourParameterX = val.fourParameterX;
        panel.fourParameterY = val.fourParameterY;
        let idx = panelsRef.value.findIndex(v => v.name == panel.name);
        if (idx >= 0) {
            panelsRef.value[idx] = {
                ...panelsRef.value[idx],
                ...panel
            }
        }
    }
}

const updatePanelParamVal = (panel: any, val: any) => {
    if (val) {
        panel.isSetRotateZero = val.isSetRotateZero;
        panel.coordinates = val.coordinates;
        let idx = panelsRef.value.findIndex(v => v.name == panel.name);
        if (idx >= 0) {
            panelsRef.value[idx] = {
                ...panelsRef.value[idx],
                ...panel
            }
        }
    }
}
const posToCad = async ()=>{
    const curMapApp = getCurMapApp();
    const panel = getCurPanel();
    if (!panel || !curMapApp) return;
    let fourParam = panel.fourParameterX !== undefined ? [panel.fourParameterX ?? 0, panel.fourParameterY ?? 0, 1, 0].join(",") : ''
    const co = await cad2webCoordinate(curMapApp.svc, curMapApp.map.fromLngLat(curMapApp.map.getCenter()), 
    "EPSG:" +panel.crs, fourParam, curMapApp.config.baseMapType == "WGS84");
    mApp.map.setCenter(mApp.map.toLngLat(co));
}

const refreshOverlayMarkers = (panel: any, curMapApp: any)=> {
    curMapApp.map.removeMarkers();
    if (!panel.coordinates) return;
    for(let i = 0; i < panel.coordinates.length; i++) {
        let marker = new vjmap.Marker({
            color: colors[i % colors.length],
            draggable: true
        });
        marker.setLngLat(curMapApp.map.toLngLat([panel.coordinates[i].x2, panel.coordinates[i].y2]));
        marker.addTo(curMapApp.map);
        let idx = i;
        marker.on('dragend', () => {
            let pt = curMapApp.map.fromLngLat(marker.getLngLat());
            // @ts-ignore
            panel.coordinates[idx].x2 = pt.x;
            // @ts-ignore
            panel.coordinates[idx].y2 = pt.y;
        });
    }
   
}
const addMarker = () => {
    const curMapApp = getCurMapApp();
    const panel = getCurPanel();
    if (!panel || !curMapApp) return;
    panel.coordinates = panel.coordinates || [];
    let center1 = mApp.map.fromLngLat(mApp.map.getCenter());
    let center2 = curMapApp.map.fromLngLat(curMapApp.map.getCenter());
  
    panel.coordinates.push({
        x1: center1.x,
        y1: center1.y,
        x2: center2.x,
        y2: center2.y
    })
    refreshOverlayMarkers(panel, curMapApp);
}
const removeMarkers = ()=> {
    const curMapApp = getCurMapApp();
    const panel = getCurPanel();
    if (!panel || !curMapApp) return;
    panel.coordinates = [];
    curMapApp.map.removeMarkers();
}
onUnmounted(() => {
    mApp.destory();
});

const getResult = () => {
    return {
        wms: getWmsSourceParam(),
        source: getSourceParam()
    };
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
    getResult
})
</script>
<style scoped>
.comp_container {
    position: fixed;
    left: 20px;
    top: 45px;
    right: 20px;
    bottom: 5px;
    display: flex;
    flex-direction: column;
}

.comp_container_full {
    position: fixed;
    left: 0px;
    top: 35px;
    right: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
}

.wmsContainer {
    width: 50%;
    border-right: 2px solid rgb(100, 77, 100);
    ;
}

.mapComp {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    flex: 1
}

.fullContainer {
    width: 100%;
    height: 100%;
}

.tabpane {
    position: relative;
}

.wmsmap_comp {
    position: absolute;
    width: 100%;
    height: 100%;
}

.wmsui_comp {
    position: absolute;
    background-color: #161624;
}
</style>
