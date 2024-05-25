<template>
    <div>
        <div class="drawbarSwitch">
            <n-tag :bordered="false" type="success" size="small" >
                绘图工具栏
            </n-tag>
            <n-switch v-model:value="showDrawBar" size="small" style="margin-top: 5px;" />
            <n-tag :bordered="false" type="success" style="margin-left: 10px;" size="small"  >
                命令工具栏
            </n-tag>
            <n-switch v-model:value="showCmdBar" size="small" style="margin-top: 5px;" />
        </div>
        <n-button-group vertical class="drawbar1" v-if="showDrawBar">
            <n-tooltip trigger="hover" placement="right" v-for="item in drawButtons" :key="item.id">
                <template #trigger>
                    <n-button size="small" ghost type="success" @click="clickDrawBarItem(item)">
                        <template #icon>
                            <n-icon v-if="item.icon" size="25">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                                    <path :d="item.icon" />
                                </svg>
                            </n-icon>
                        </template>
                        {{ item.title }}
                    </n-button>
                </template>
                {{ item.tooltip }}
            </n-tooltip>
        </n-button-group>
        <n-button-group vertical class="drawbar2" v-if="showCmdBar">
            <n-tooltip trigger="hover" placement="right" v-for="item in toolButtons" :key="item.id">
                <template #trigger>
                    <n-button size="small" ghost type="success" @click="clickToolBarItem(item)">
                        <template #icon>
                            <n-icon v-if="item.icon" size="25">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                                    <path :d="item.icon" />
                                </svg>
                            </n-icon>
                        </template>
                        {{ item.title }}
                    </n-button>
                </template>
                {{ item.tooltip }}
            </n-tooltip>
        </n-button-group>
        <div class="toolbar1">
            <n-tag :bordered="false" type="success">
                边框色
            </n-tag>
            <n-color-picker :show-alpha="false" style="width:120px" v-model:value="strokeColor" size="small" />
            <n-tag :bordered="false" type="success">
                填充色
            </n-tag>
            <n-color-picker :show-alpha="false" style="width:120px" size="small" v-model:value="fillColor" />
            <n-tag :bordered="false" type="success">
                透明度
            </n-tag>
            <n-slider size="small" :step="0.01" :max="1" v-model:value="fillOpacity" style="width:50px;margin-top: 5px;" />
            <n-tag :bordered="false" type="success">
                线宽
            </n-tag>
            <n-select v-model:value="lineWidth" :options="lineWidthoptions" size="small" style="width:70px;" />
            <n-tag :bordered="false" type="success">
                点半径
            </n-tag>
            <n-select v-model:value="pointPixel" :options="pointPixeloptions" size="small" style="width:70px;" />
            <n-tag :bordered="false" type="success">
                拉伸高度
            </n-tag>
            <n-input-number v-model:value="extrusionHeight" :step="10000" size="small" style="width:120px;" />
        </div>
        <div class="toolbar2">
            <n-tag :bordered="false" type="success">
                捕捉绘制的点
            </n-tag>
            <n-switch v-model:value="isSnap" size="small" style="margin-top: 5px;" />
            <n-tag :bordered="false" type="success">
                捕捉地图上点
            </n-tag>
            <n-switch v-model:value="isSnapMap" size="small" style="margin-top: 5px;" />

            <n-tag :bordered="false" type="success">
                模式切换
            </n-tag>
            <n-switch v-model:value="previewMode" size="small" style="margin-top: 5px;width:100px;"
                @update:value="handleModeChange">
                <template #checked>
                    编辑模式
                </template>
                <template #unchecked>
                    预览模式
                </template>
            </n-switch>
            <n-tag :bordered="false" type="success">
                右侧面板
            </n-tag>
            <n-switch v-model:value="showRightBar" size="small" style="margin-top: 5px;" />
            <n-tag :bordered="false" type="success" style="margin-left: 5px;">
                底图透明度
            </n-tag>
            <n-slider size="small" :step="0.01" :max="1" v-model:value="rasterOpacity"
                style="width:50px;margin-top: 5px;" />

        </div>
        <div class="toolbar3">
            <n-dropdown trigger="hover" :options="geoModelOptions" @select="(key: string) => geoModelHandleSelect(map, draw, key, getInputJsonValue, strokeColor)">
                <n-button size="small" ghost type="success">几何模型</n-button>
            </n-dropdown>
            <n-dropdown trigger="hover" :options="modelLayoutOptions" @select="(key: string) => modelLayoutHandleSelect(map, draw, key, getInputJsonValue)">
                <n-button size="small" ghost type="success" style="margin-left: 5px;">布局克隆</n-button>
            </n-dropdown>
        </div>
        <div class="rightBar" v-if="showRightBar">
            <n-card content-style="padding: 0;">
                <n-tabs type="line" size="large" :tabs-padding="1" pane-style="padding: 2px;">
                    <n-tab-pane name="所有绘制数据">
                        <n-tabs type="segment" :tabs-padding="1" pane-style="padding: 2px;">
                            <n-tab-pane name="alldata_table" tab="表格形式">
                                <n-data-table :columns="dataColumns" :data="drawData" max-height="calc(100vh - 268px)"
                                    virtual-scroll default-expand-all />
                            </n-tab-pane>
                            <n-tab-pane name="alldata_json" tab="JSON形式">
                                <monaco-editor :style="drawJsonStyle" :wordWrap="false" :lineNumbers="false"
                                    v-model="drawJson" ref="drawJsonEditor"></monaco-editor>
                            </n-tab-pane>
                        </n-tabs>
                    </n-tab-pane>
                    <n-tab-pane name="当前对象属性">
                        <monaco-editor :style="propsJsonStyle" :wordWrap="false" :lineNumbers="false" v-model="propsJson"
                            ref="propsJsonEditor"></monaco-editor>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </div>

        <n-modal v-model:show="drawTextShowModal" preset="dialog" title="绘制文本" positive-text="确认" negative-text="算了"
            @positive-click="drawTextSubmitCallback" @negative-click="drawTextCancelCallback">
            <FormCreate v-model="drawTextfApi" ref="drawSymbForm" :rule="drawTextRule" :option="formOption">
            </FormCreate>
        </n-modal>
        <n-modal v-model:show="jsonInputShowModal" preset="dialog" title="设置" positive-text="确认" negative-text="算了"
            @positive-click="inputJsonSubmitCallback">
            <monaco-editor :style="inputJsonStyle" :wordWrap="false" :lineNumbers="false" v-model="inputJson"
                ref="inputJsonEditor"></monaco-editor>
        </n-modal>
</div>
</template>

<script setup lang="ts">
import { inject, reactive, ref, toRaw, watch } from 'vue';
import type MapApp from '@vjmap/common';
import MonacoEditor from "@/components/MonacoEditor.vue";
import { cancelDraw, createHatch, createLineTypeCurve, modifyDrawText, createLineTypePolyline, createOutSymbol, createUpdateMapStyleObj, drawArrow, drawCircle, drawEllipseArc, drawEllipseEdge, drawEllipseFill, drawEllipseFillArc, drawLineSting, drawPoint, drawPolygon, drawRectangle, drawSlantRectangle, drawText, exportDwg, selectRotate, setLayerOpacity, toBezierCurve } from '@vjmap/common';
import vjmap, { pixelValue, type IDrawTool } from 'vjmap';
import type { Map } from 'vjmap';
import { getMapSnapPoints } from '@vjmap/common';
import formCreate from "@form-create/naive-ui"
import { listMapImages } from '@/lib/utils';
import type { DataTableColumns } from 'naive-ui';
import { useDebounceFn, useResizeObserver } from '@vueuse/core';
import { drawToolButtons } from './draw';
import { cmdToolButtons, runToolBarItem } from './cmd';
import vjgeo from 'vjgeo'
import { geoModelHandleSelect, modelLayoutOptions, modelLayoutHandleSelect } from './geomodel'
const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => { }
    }
})
const FormCreate = formCreate.$form();
const mMap = inject<MapApp>('interactiveMap');
const map = mMap?.map as Map;
const isSnap = ref(true);
const isSnapMap = ref(false);
const lineWidth = ref(1);
const lineWidthoptions: any = ref([]);
const strokeColor = ref("#ff0000");
const fillColor = ref("#00ffff");
const fillOpacity = ref(1.0);
const pointPixel = ref(5);
const rasterOpacity = ref(1.0);
const pointPixeloptions: any = ref([]);
const extrusionHeight = ref(500000);
const drawSymbForm = ref<any>(null);
let drawTextfApi = reactive<any>({});
const previewMode = ref(false);
const showRightBar = ref(true);
const showDrawBar = ref(true);
const showCmdBar = ref(true);
const drawJson = ref('');
const drawJsonStyle = reactive({ height: '400px' });
const drawJsonEditor = ref()
const propsJson = ref('');
const propsJsonStyle = reactive({ height: '400px' });
const propsJsonEditor = ref()
const inputJson = ref('');
const inputJsonStyle = reactive({ height: '350px' });
const inputJsonEditor = ref();
const inputJsonResult = ref();
const updateMapStyleObj = createUpdateMapStyleObj(map);
const geoModelOptions = Object.keys(vjgeo.models).sort().map(modelName => {
    return {
        label: modelName,
        key: modelName
    }
})
useResizeObserver(document.body, (entries) => {
    drawJsonStyle.height = (entries[0].contentRect.height - 220) + 'px';
    propsJsonStyle.height = (entries[0].contentRect.height - 180) + 'px';
})
for (let i = 1; i <= 30; i++) {
    lineWidthoptions.value.push({
        label: i,
        value: i,
    })
    pointPixeloptions.value.push({
        label: i,
        value: i,
    })
}
const formOption = reactive({
    form: {
        labelWidth: "auto",
        size: 'small'
    },
    submitBtn: false
});
const drawTextRule = ref([
    {
        type: 'input',
        field: 'text',
        title: '文本内容',
        value: "",
        props: {
        }
    },
    {
        type: 'InputNumber',
        field: 'height',
        title: '文本初始像素高',
        value: 50,
        props: {
        }
    },
    {
        type: 'switch',
        field: 'disableScale',
        title: '不指定缩放',
        value: false,
        props: {
        }
    },
    {
        type: 'switch',
        field: 'disableRotate',
        title: '不指定旋转',
        value: false,
        props: {
        }
    }
]);
type RowData = {
    key: number
    id: string
    type: string
    coord: string
    props: string
}
const dataColumns: DataTableColumns<RowData> = [
    {
        type: 'expand',
        renderExpand: (rowData) => {
            return `
            ID: ${rowData.id}
            坐标: ${rowData.coord}
            属性：${rowData.props}
        `
        }
    },
    {
        title: '索引',
        key: 'key',
        width: 50,
        ellipsis: true
    },
    {
        title: '类型',
        key: 'type',
        width: 80
    },
    {
        title: 'ID',
        key: 'id',
        width: 60,
        ellipsis: true
    }
]


const drawData: any = ref([]);
map.doubleClickZoom.disable(); // 禁止双击放大
const opts = vjmap.cloneDeep(vjmap.Draw.defaultOptions());
opts.isActionDrawMode = true; // 按钮都隐藏，界面用自己的
let snapObj = {};
if (!mMap?.isWebBaseMap()) {
    // 如果是为cad为底图，则可以捕捉dwg图上的点
    getMapSnapPoints(map, snapObj);
}
const draw = mMap?.map.getDrawLayer() as IDrawTool;
const getDrawOptions = () => {
    let mapSnapFeatures = [];
    if (isSnapMap.value) {
        // @ts-ignore
        mapSnapFeatures = snapObj.features;
    }
    let drawFeatures: any = [];
    if (typeof draw != 'undefined') {
        drawFeatures = draw.getAll().features;
    }
    return {
        ...opts,
        snap: isSnap.value ? true : false, // 是否启用捕捉节点
        guides: isSnap.value ? true : false,// 是否启用捕捉网格
        api: {
            getSnapFeatures: isSnap.value ? {
                ...snapObj,
                features: [
                    ...mapSnapFeatures,
                    ...drawFeatures
                ]
            } : {} //捕捉地图上的数据点 要捕捉的数据项在后面，通过属性features赋值
        }
    }
}
const drawButtons: any = ref(drawToolButtons);
const toolButtons: any = ref(cmdToolButtons);

const drawTextShowModal = ref(false);
const jsonInputShowModal = ref(false);
const drawTextCancelCallback = () => {
    // window.$message.success('Cancel')
}
const drawTextSubmitCallback = () => {
    let param = toRaw(drawTextfApi);
    drawText(map, draw, {
        ...getDrawOptions(),
    }, {
        "color": fillColor.value,// 颜色
        ...param
    }, window.$message.info);
}
const inputJsonSymbolCancelCallback = () => {
    // window.$message.success('Cancel')
    inputJsonResult.value = null;
}
const inputJsonSubmitCallback = () => {
    try {
        inputJsonResult.value = JSON.parse(inputJsonEditor.value.getValue());
        // eslint-disable-next-line no-empty
    } catch (error) {
    }
}
const getInputJsonValue = (param?: any) => {
    inputJsonResult.value = undefined;
    jsonInputShowModal.value = true;
    inputJson.value = param ? JSON.stringify(param, null, 4) : '';
    return new Promise((resolve, reject) => {
        let timeId = setInterval(() => {
            if (inputJsonResult.value === null) {
                clearInterval(timeId);
                resolve(null)
            } else if (inputJsonResult.value) {
                clearInterval(timeId);
                resolve(toRaw(inputJsonResult.value))
            }
        }, 10)
    })
}
let cacheData: any = {};
const clickDrawBarItem = async (item: any) => {
    // 先取消之前的绘制，有可能之前还在绘制，会导致重复绘制
    cancelDraw(map);
    if (item.id == "point") {
        drawPoint(map, draw, {
            ...getDrawOptions(),
        }, {
            "color_inactive": fillColor.value,// 编辑模式活动状态下点的颜色
            "color_static": fillColor.value,// 预览模式活动状态下点的颜色
            "radius_inactive": pointPixel.value,// 编辑模式活动状态下点的半径
            "radius_static": pointPixel.value // 预览模式活动状态下点的半径
        });
    } else if (item.id == "line") {
        drawLineSting(map, draw, getDrawOptions(), {
            "color": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
        });
    } else if (item.id == "polygon") {
        drawPolygon(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        });
    } else if (item.id == "fillExtrusion") {
        drawPolygon(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
            "extrusionHeight": extrusionHeight.value, // 拉伸高度
        });
    } else if (item.id == "circle" || item.id == "fillcircle") {
        drawCircle(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, item.id == "fillcircle");
    } else if (item.id == "rectangle" || item.id == "fillRectangle") {
        drawRectangle(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, item.id == "fillRectangle");
    } else if (item.id == "slantRectangle" || item.id == "fillSlantRectangle") {
        drawSlantRectangle(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, item.id == "fillSlantRectangle");
    } else if (item.id == "text") {
        drawTextShowModal.value = true;
    } else if (item.id == "fillEllipse") {
        drawEllipseFill(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, window.$message.info);
    } else if (item.id == "ellipse") {
        drawEllipseEdge(map, draw, getDrawOptions(), {
            "color": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
        }, window.$message.info);
    } else if (item.id == "fillEllipseArc") {
        drawEllipseFillArc(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, window.$message.info);
    } else if (item.id == "ellipseArc") {
        drawEllipseArc(map, draw, getDrawOptions(), {
            "color": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
        }, window.$message.info);
    } else if (item.id == "arrow") {
        let param = await getInputJsonValue(cacheData["arrow"] ?? {
            lineWidth: 50,
            contents: "箭头",
            noLineType: false,
            noText: false,
            textPositon: [100, 70],
            textHeight: 20,
            arrowShape: [
                [10, 60],
                [150, 20],
                [140, 40],
                [190, 0],
                [140, -40],
                [150, -20],
                [10, -40],
                [10, 60],
            ]
        });
        if (!param) return;
        cacheData["arrow"] = param;
        drawArrow(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, window.$message.info, param);
    } else if (item.id == "lineTypePolyline") {
        let param = await getInputJsonValue(cacheData["lineTypePolyline"] ?? {
            mapid: "sys_symbols",
            version: "v1",
            linetypeScale: 100,
            objectid: '40D'
        });
        if (!param) return;
        cacheData["lineTypePolyline"] = param;
        createLineTypePolyline(map, draw, getDrawOptions(), {
            "color": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
        }, window.$message.info, param);
    } else if (item.id == "lineTypeCurve") {
        let param = await getInputJsonValue(cacheData["lineTypeCurve"] ?? {
            mapid: "sys_symbols",
            version: "v1",
            linetypeScale: 100,
            objectid: '40E'
        });
        if (!param) return;
        cacheData["lineTypeCurve"] = param;
        createLineTypeCurve(map, draw, getDrawOptions(), {
            "color": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
        }, window.$message.info, param);
    } else if (item.id == "symbolHatch") {
        let param = await getInputJsonValue(cacheData["symbolHatch"] ?? {
            mapid: "sys_symbols",
            version: "v1",
            patternScale: 400,
            objectid: '42F'
        });
        if (!param) return;
        cacheData["symbolHatch"] = param;
        createHatch(map, draw, getDrawOptions(), {
            "color": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "outlineColor": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, window.$message.info, param);
    } else if (item.id == "insertOutSymbol") {
        let param = await getInputJsonValue(cacheData["insertOutSymbol"] ?? {
            mapid: "sys_symbols",
            version: "v1",
            condition: 'layerindex=1'
        });
        if (!param) return;
        cacheData["insertOutSymbol"] = param;
        createOutSymbol(map, draw, getDrawOptions(), {
            "fillColor": fillColor.value,// 颜色
            "opacity": fillOpacity.value, // 透明度
            "color": strokeColor.value,// 颜色
            "line_width": lineWidth.value, // 线宽
            "line_opacity": fillOpacity.value, // 透明度
        }, window.$message.info, param);
    }  else if (item.id == "modifyDrawText") {
        await modifyDrawText(map, draw, undefined, window.$message.info);
    } else if (item.id == "exportDwg") {
        window.$message.info("正在导出dwg并打开，请稍候...")
        const res = await exportDwg(map, draw);
        if (res.error) {
            window.$message.error(res.error);
            return;
        }
        const isCloud = map.getService().serverUrl.indexOf("vjmap.com") >= 0;
        const host = isCloud ? "https://vjmap.com/app/cloud" : (window.location.origin + "/_cloud");
        const url = host + `/#/map/${res.mapid}?mapopenway=Memory&version=${res.version}`;
        window.open(url);
    }
}

const clickToolBarItem = (item: any) => {
    runToolBarItem(item, map, draw, getDrawOptions, refreshData, updateMapStyleObj,mMap);
}
let popup: any;
const handleModeChange = () => {
    if (previewMode.value) {
        draw.changeMode('static');
        // 预览模式下响应事件
        if (!popup) {
            popup = new vjmap.Popup({
                closeButton: false
            });
            // 非编辑模式下，鼠标悬浮时，显示信息提示内容
            map.on("draw.static.mouseenter", e => {
                if (e.event.featureTarget) {
                    console.log(e)
                    popup.setLngLat(e.event.lngLat);
                    popup.setHTML(`<span style="color:blue">${JSON.stringify(e.event.featureTarget.properties, null, 4)}</span>`);
                    popup.addTo(map);
                }
            });

            map.on("draw.static.mouseleave", e => {
                if (popup) popup.remove();
            });

            map.on("draw.static.click", e => {
                if (e.event.featureTarget) {
                    window.$message.info(`您点击了id为：${e.event.featureTarget.properties.id} 的实体`)
                }
            });
        }

    } else {
        draw.changeMode("simple_select");
    }
}
const refreshData = useDebounceFn(() => {
    refreshAllDrawDataTable();
}, 1000);
let allPropsSet = new Set(); // 所的要素中的所有属性集合
let refreshDrawDataTime: any = new Date();
const refreshAllDrawDataTable = () => {
    let data = map.fromLngLat(draw.getAll());
    drawJson.value = JSON.stringify(data, null, 4);
    if (drawJsonEditor.value) {
        refreshDrawDataTime = new Date();
        drawJsonEditor.value?.setValue(drawJson.value);
    }
    drawData.value = []
    allPropsSet.clear();
    data = draw.getAll();
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        drawData.value.push({
            key: i + 1,
            type: feature.geometry.type,
            id: feature.id,
            // @ts-ignore
            coord: JSON.stringify(feature.geometry.coordinates, null, 0),
            props: JSON.stringify(feature.properties, null, 0),
        })
        Object.keys(feature.properties || {}).forEach((k: string) => allPropsSet.add(k))
    }
}

watch(drawJson, () => {
    try {
        if ((new Date() as any) - refreshDrawDataTime < 3000) return; // 防止循环刷新
        let data = JSON.parse(drawJsonEditor.value.getValue());
        draw.set(map.toLngLat(data));
        refreshAllDrawDataTable();
        // eslint-disable-next-line no-empty
    } catch (error) {

    }
})

refreshData();
map.on('draw.create', refreshData);
map.on('draw.delete', refreshData);
map.on('draw.update', refreshData);
map.on('draw.modechange', refreshData);

const refreshProps = useDebounceFn(() => {
    refreshPropsEditor();
}, 500);
let refreshPropsTime: any = new Date();
const refreshPropsEditor = () => {
    refreshPropsTime = new Date();
    let data = draw.getSelected();
    let propsKeys = Array.from(allPropsSet).sort();
    let propValues: any = {};

    for (let k of propsKeys) {
        propValues[k as string] = undefined;
    }
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        for (let key in propValues) {
            let properties = feature.properties || {};
            if (propValues[key] !== undefined && properties[key] !== propValues[key]) {
                propValues[key] = "**多种**"
            } else {
                propValues[key] = properties[key] || null
            }
        }
    }
    let jsonValues: any = {};
    jsonValues["__selectCount__"] = data.features.length;
    for (let k in propValues) {
        // 有值的先显示
        if (propValues[k] !== null) {
            jsonValues[k] = propValues[k];
        }
    }
    for (let k in propValues) {
        // 没有值的放后面，用户可以设置
        if (propValues[k] === null) {
            jsonValues[k] = propValues[k];
        }
    }
    if (propsJsonEditor?.value && propsJsonEditor?.value?.setValue) propsJsonEditor?.value?.setValue(JSON.stringify(jsonValues, null, 4))
}
watch(propsJson, () => {
    if ((new Date() as any) - refreshPropsTime < 500) return;
    try {
        let propValues = JSON.parse(propsJsonEditor.value?.getValue());
        if (propValues['__selectCount__'] == 0) return;
        // 修改属性
        let data = draw.getSelected();
        for (let i = 0; i < data.features.length; i++) {
            let feature = data.features[i];
            let properties = feature.properties || {};
            for (let key in propValues) {
                if (key == "__selectCount__") continue;
                if (propValues[key] == "**多种**") continue;
                if (propValues[key] === null || propValues[key] === undefined) continue;
                draw.setFeatureProperty(feature.id as string, key, propValues[key]);
            }
            for (let k in properties) {
                if (!(k in propValues)) {
                    draw.setFeatureProperty(feature.id as string, k, undefined);
                }
            }
        }
        map.triggerRepaint();
        refreshData();
        // eslint-disable-next-line no-empty
    } catch (error) {

    }
});
map.on('draw.selectionchange', refreshProps);

// 查看设置变化 
watch(strokeColor, () => {
    // 修改属性
    let data = draw.getSelected();
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        if (feature.geometry.type == "LineString" || feature.geometry.type == "MultiLineString") {
            draw.setFeatureProperty(feature.id as string, "color", strokeColor.value);
        } else if (feature.geometry.type == "Polygon" || feature.geometry.type == "MultiPolygon") {
            draw.setFeatureProperty(feature.id as string, "outlineColor", strokeColor.value);
        } else if (feature.geometry.type == "GeometryCollection") {
            draw.setFeatureProperty(feature.id as string, "color", strokeColor.value);
        }
    }
    map.triggerRepaint();
    draw.forceRefresh();
    refreshData();
})
watch(fillColor, () => {
    // 修改属性
    let data = draw.getSelected();
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        if (feature.geometry.type == "Polygon"  || feature.geometry.type == "MultiPolygon") {
            draw.setFeatureProperty(feature.id as string, "color", fillColor.value);
        } else if (feature.geometry.type == "GeometryCollection" ) {
            draw.setFeatureProperty(feature.id as string, "fillColor", fillColor.value);
        } else if (feature.geometry.type == "Point" || feature.geometry.type == "MultiPoint") {
            draw.setFeatureProperty(feature.id as string, "color_inactive", fillColor.value);
            draw.setFeatureProperty(feature.id as string, "color_static", fillColor.value);
        }
    }
    map.triggerRepaint();
    draw.forceRefresh();
    refreshData();
})
watch(lineWidth, () => {
    // 修改属性
    let data = draw.getSelected();
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        draw.setFeatureProperty(feature.id as string, "line_width", lineWidth.value)
    }
    map.triggerRepaint();
    draw.forceRefresh();
    refreshData();
})
watch(fillOpacity, () => {
    // 修改属性
    let data = draw.getSelected();
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        if (feature.geometry.type == "Polygon" || feature.geometry.type == "MultiPolygon" || feature.geometry.type == "GeometryCollection") {
            draw.setFeatureProperty(feature.id as string, "opacity", fillOpacity.value);
            draw.setFeatureProperty(feature.id as string, "line_opacity", fillOpacity.value);
        }
    }
    map.triggerRepaint();
    draw.forceRefresh();
    refreshData();
})

watch(pointPixel, () => {
    // 修改属性
    let data = draw.getSelected();
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        if (feature.geometry.type == "Point" || feature.geometry.type == "MultiPoint") {
            draw.setFeatureProperty(feature.id as string, "radius_inactive", pointPixel.value);
            draw.setFeatureProperty(feature.id as string, "radius_static", pointPixel.value);
        }
    }
    map.triggerRepaint();
    draw.forceRefresh();
    refreshData();
})
watch(extrusionHeight, () => {
    // 修改属性
    let data = draw.getSelected();
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        let properties = feature.properties || {};
        if (feature.geometry.type == "Polygon" && "extrusionHeight" in properties || feature.geometry.type == "MultiPolygon" || feature.geometry.type == "GeometryCollection") {
            draw.setFeatureProperty(feature.id as string, "extrusionHeight", extrusionHeight.value);
        }
    }
    map.triggerRepaint();
    draw.forceRefresh();
    refreshData();
})

watch(rasterOpacity, () => {
    setLayerOpacity(map, rasterOpacity.value, mMap?.isWebBaseMap() ? "_base_webmap_" : "");
});
</script>

<style scoped>
.drawbarSwitch {
    position: absolute;
    left: 10px;
    top: 10px;
    display: flex;
    user-select: none;
    background-color: rgb(46, 46, 58);
}

.drawbar1 {
    position: absolute;
    left: 10px;
    top: 43px;
    display: flex;
    user-select: none;
    background-color: rgb(46, 46, 58);
}

.drawbar2 {
    position: absolute;
    left: 120px;
    top: 43px;
    display: flex;
    user-select: none;
    background-color: rgb(46, 46, 58);
}

.toolbar1 {
    position: absolute;
    left: 243px;
    top: 8px;
    display: flex;
    user-select: none;
    background-color: rgb(46, 46, 58);
}

.toolbar2 {
    position: absolute;
    left: 243px;
    top: 43px;
    display: flex;
    user-select: none;
    background-color: rgb(46, 46, 58);
}


.toolbar3 {
    position: absolute;
    left: 243px;
    top: 78px;
    display: flex;
    user-select: none;
    background-color: rgb(46, 46, 58);
}

.rightBar {
    position: fixed;
    bottom: 15px;
    right: 25px;
    width: 305px;
    top: 103px;
    display: flex;
    background-color: rgb(46, 46, 58);
    opacity: 0.95;
}
</style>