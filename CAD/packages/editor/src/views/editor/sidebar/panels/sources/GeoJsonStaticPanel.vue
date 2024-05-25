<template>
    <n-space vertical>
        <n-space class="buttons">
            <n-button size="small" :type="button.type ?? 'primary'" ghost v-for="button in buttons" :key="button.title"
                @click="button.click">
                {{ button.title }}
            </n-button>
        </n-space>
        <n-input v-model:value="sourceId" placeholder="数据源id,为空的话自动生成" size="small" :disabled="id != ''">
            <template #prefix>
                数据源ID:
            </template>
        </n-input>
        <monaco-editor :style="editorStyle" v-model="json" ref="mapJsonEditor"
            @change="editorJsonChange"></monaco-editor>
        属性设置:
        <monaco-editor style="height:100px" v-model="jsonsetting" ref="setJsonEditor"
            :readOnly="id != ''"></monaco-editor>
        <n-modal v-model:show="showMapModel" preset="dialog" title="查看地图" :style="{ width: '850px' }">
            <MapDataPreview :data="mapGeoJsonData" />
        </n-modal>
    </n-space>
</template>

<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import type { editorContext } from '@/types';
import { useResizeObserver } from '@vueuse/core';
import { inject, reactive, ref, shallowRef } from 'vue';
import vjmap from 'vjmap';
import RandomGeojsonDlg from './dialogs/RandomGeojsonDlg.vue';
import MapComp from '@/components/MapComp.vue'
import type MapApp from '~/MapApp';
import { getMapSnapPoints } from '@vjmap/common';
import { selectFeatures } from '@vjmap/common';
import { ButtonControl } from '@/lib/map/buttonCtrl';
import MapDataPreview from './dialogs/MapDataPreview.vue';
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
const mapJsonEditor = ref<any>(null);
const setJsonEditor = ref<any>(null);
const editorStyle = reactive({ height: '300px' });
const showMapModel = ref(false);
const mapGeoJsonData = ref({});
const isWebBaseMap = ref(mapApp.isWebBaseMap());
useResizeObserver(document.body, (entries) => {
    editorStyle.height = (entries[0].contentRect.height - 350) + 'px';
})
const props = defineProps({
    data: {
        type: Object,
        required: false,
        default: () => {
            return {
            }
        }
    },
    prop: {
        type: Object,
        required: false,
        default: () => {
            return {
            }
        }
    },
    id: {
        type: String,
        required: false,
        default: ''
    }
});


const sourceId = ref(props.id);
const json = ref(JSON.stringify(props.data, null, 4));
const jsonsetting = ref(JSON.stringify(props.prop, null, 4));
const buttons = ref([{
    title: "随机数据",
    type: "primary",
    click: () => {
        createRandomGeojson();
    }
}]);

if (!isWebBaseMap.value) {
    // 如果是cad为底图
    buttons.value.push(
        {
            title: "采集点线面",
            type: "primary",
            click: () => {
                pickPointLinePolygons();
            }
        }, {
        title: "选择实体[位置坐标]",
        type: "primary",
        click: () => {
            pickFeatures(false)
        }
    }, {
        title: "选择实体[几何坐标]",
        type: "primary",
        click: () => {
            pickFeatures(true)
        }
    })
}
buttons.value.push({
    title: "在地图上查看数据",
    type: "info",
    click: () => {
        showMapModel.value = true;
    }
});
buttons.value.push({
    title: "查看数据范围",
    type: "info",
    click: () => {
        const value = mapJsonEditor?.value?.getValue();
        try {
            const features = JSON.parse(value);
            let bounds = vjmap.getGeoBounds(features);
            
            console.log("数据范围", `[${bounds.toString()}]`);
            console.log("数据正方形范围", `[${bounds.square().toString()}]`);
            console.log("数据两倍范围", `[${bounds.scale(2).toString()}]`);
            console.log("数据两倍正方形范围", `[${bounds.scale(2).square().toString()}]`);
            let tip = `
            "数据范围": [${bounds.toString()}]
            "数据正方形范围": [${bounds.square().toString()}]
            "数据两倍范围": [${bounds.scale(2).toString()}]
            "数据两倍正方形范围": [${bounds.scale(2).square().toString()}]
            查看具体数据请按F12, 控制台中查看
            `
            window.$message.info(tip)
        } catch(e: any) {
            window.$message.error(e)
        }
    }
});
const createRandomGeojson = async () => {
    uiApp.showFloatChildPane("createRandomGeojson", "随机Geojson数据", {
        component: shallowRef(RandomGeojsonDlg),
        props: {
            hideCloseButton: true,
            showOkButton: true,
            showCancelButton: true,
        },
        listeners: {
            onOK: (comp: any) => {
                let { FeatureCollection } = comp.getResult();
                if (!FeatureCollection) return;
                let value = JSON.stringify(FeatureCollection, null, 4);
                mapJsonEditor?.value?.setValue(value);
            }
        }
    })
}
const pickPointLinePolygons = async () => {
    let res = await uiApp.showModalAsync("pickPointLinePolygons", '请在地图上拾取点线面做为Geojson数据', {
        component: MapComp,
        props: {
            positiveText: '确定',
            negativeText: '取消',
            bodyStyle: {
                position: 'fixed',
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
                width: "100%"
            },
            mapOptions: {
                center: [0, 0],
                zoom: 1,
                bearing: 0,
                pitch: 0
            },
            mapOpenOptions: {
                style: {
                    backcolor: mapApp.getConfig().mapOpenOptions?.style?.backcolor ?? 0
                }
            },
            methods: {
                onMounted: async (mApp: MapApp, close: Function, context: any) => {
                    let map = mApp.map;

                    const opts = vjmap.cloneDeep(vjmap.Draw.defaultOptions());
                    // https://vjmap.com/guide/draw.html
                    // 可以隐藏默认的按钮
                    opts.controls.cutPolygon = false;//不显示裁剪多边形
                    opts.controls.splitLine = false;
                    opts.controls.combine_features = false;
                    opts.controls.uncombine_features = false;

                    let snapObj = {};
                    if (!mApp.isWebBaseMap()) {
                      // 如果是为cad为底图，则可以捕捉dwg图上的点
                      getMapSnapPoints(map, snapObj);
                    }
                   
                    // @ts-ignore
                    const draw = new vjmap.Draw.Tool({
                        ...opts,
                        api: {
                            getSnapFeatures: snapObj //要捕捉的数据项在后面，通过属性features赋值
                        }
                    });
                    map.addControl(draw, 'top-left');
                    // 增加之前的数据
                    let geojson = mapJsonEditor?.value?.getValue();
                    if (geojson && geojson != "{}") {
                        geojson = JSON.parse(geojson);
                        draw.set(map.toLngLat(geojson));
                    }
                    // @ts-ignore
                    map._curDraw = draw;
                },
                getResult: (mApp: MapApp, close: Function, context: any) => {
                    let map = mApp.map;
                    // @ts-ignore
                    if (!map._curDraw) return;
                    // @ts-ignore
                    return map.fromLngLat(map._curDraw.getAll());
                }
            }

        }
    })
    if (res.isOk) {
        let value = JSON.stringify(res.result, null, 4);
        mapJsonEditor?.value?.setValue(value);
    }
}
const pickFeatures = async (useGeomCoord?: boolean) => {
    let res = await uiApp.showModalAsync("pickFeatures", '请在图上选择图上实体, 按右键 或回车 或 ESC 键退出选择!', {
        component: MapComp,
        props: {
            positiveText: '确定',
            negativeText: '取消',
            bodyStyle: {
                position: 'fixed',
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
                width: "100%"
            },
            mapOptions: {
                center: [0, 0],
                zoom: 1,
                bearing: 0,
                pitch: 0
            },
            mapOpenOptions: {
                style: {
                    backcolor: mapApp.getConfig().mapOpenOptions?.style?.backcolor ?? 0
                }
            },
            methods: {
                onMounted: async (mApp: MapApp, close: Function, context: any) => {
                    let map = mApp.map;
                    let pointSelButtonCtrl = new ButtonControl({
                        text: "此次选择结束切换为点选",
                        onClick: () => {
                            // @ts-ignore
                            map._isPointSel = true;
                        }
                    });
                    map.addControl(pointSelButtonCtrl);
                    let rectSelButtonCtrl = new ButtonControl({
                        text: "此次选择结束切换为框选",
                        onClick: () => {
                            // @ts-ignore
                            map._isPointSel = false;
                        }
                    });
                    map.addControl(rectSelButtonCtrl);
                    let checkboxCtrl1 = new ButtonControl({
                        type: "checkbox",
                        text: "不需要属性数据",
                        onClick: () => {
                            // @ts-ignore
                            map._noNeedPropsData = !map._noNeedPropsData;
                        }
                    });
                    map.addControl(checkboxCtrl1);
                    let checkboxCtrl2 = new ButtonControl({
                        type: "checkbox",
                        text: "需要选择整个实体对象",
                        onClick: () => {
                            // @ts-ignore
                            map._includeWholeEntity = !map._includeWholeEntity;
                        }
                    });
                    map.addControl(checkboxCtrl2);
                    // @ts-ignore
                    selectFeatures(map, useGeomCoord, map._includeWholeEntity);
                },
                onUnmounted(mApp: MapApp) {
                    let map = mApp.map;
                    map.fire("keyup", { keyCode: 27 });
                },
                getResult: (mApp: MapApp, close: Function, context: any) => {
                    let map = mApp.map;
                    // 给地图发送Enter键消息即可取消，模拟按Enter键
                    map.fire("keyup", { keyCode: 13 });
                    // @ts-ignore
                    let features = map._selectFeatures ?? [];
                    // @ts-ignore
                    if (map._noNeedPropsData) {
                        // 如果不需要属性数据
                        features.forEach((f: any) => f.properties = {})
                    }
                    // @ts-ignore
                    return map.fromLngLat({
                        "type": "FeatureCollection",
                        "features": features
                    });
                }
            }

        }
    })
    if (res.isOk) {
        let value = JSON.stringify(res.result, null, 4);
        mapJsonEditor?.value?.setValue(value);
    }
}

const editorJsonChange = () => {
    try {
        mapGeoJsonData.value = JSON.parse(mapJsonEditor?.value?.getValue());
    } catch (e) { /* empty */ }
}
const getResult = () => {
    return {
        data: mapJsonEditor?.value?.getValue(),
        id: sourceId.value.trim(),
        prop: setJsonEditor?.value?.getValue(),
    }
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
    getResult
})
</script>