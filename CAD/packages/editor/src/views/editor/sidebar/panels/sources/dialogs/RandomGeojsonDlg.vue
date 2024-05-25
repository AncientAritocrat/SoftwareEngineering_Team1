<template>
    <n-space vertical>
        <n-card>
            <n-radio-group v-model:value="randType">
                <n-radio-button value="0" label="随机点线面" />
                <n-radio-button value="1" label="随机点" />
                <n-radio-button value="2" label="随机线" />
                <n-radio-button value="3" label="随机多边形" />
            </n-radio-group>
        </n-card>
        <n-card>
            <FormCreate v-model="fApi" ref="form" :rule="rule" :option="option"></FormCreate>
        </n-card>
    </n-space>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw, inject, watch } from 'vue';
import formCreate from "@form-create/naive-ui"
import type { editorContext } from '@/types';
import MapComp from '@/components/MapComp.vue'
import type MapApp from '~/MapApp';
import vjmap from 'vjmap';
import { pickMapBounds } from '@/lib/map/pick';
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
const randType = ref("0");
const FormCreate = formCreate.$form();
const form = ref<any>(null);
let fApi = reactive<any>({});
const option = reactive({
    form: {
        labelWidth: "200px",
        size: 'small'
    },
    submitBtn: false
});
const rule = ref([
    {
        type: 'input',
        field: 'bounds',
        title: '要模拟的数据范围区域',
        value: '',
        props: {
            placeholder: 'x1,y1,x2,y2',
            clearable: true
        },
        suffix: {
            type: 'button',
            children: ['拾取'],
            on: {
                click: async () => {
                    await pickBounds();
                }
            }
        }
    },
    {
        type: 'input',
        field: 'pointCount',
        title: '模拟点的数目',
        value: '10',
        props: {
            placeholder: '',
        }
    },
    {
        type: 'input',
        field: 'lines',
        title: '模拟线的数目',
        value: '3',
        props: {
            placeholder: '',
        }
    }, {
        type: 'input',
        field: 'linePoints',
        title: '每条线点的数目',
        value: '3',
        props: {
            placeholder: '',
        }
    }, {
        type: 'input',
        field: 'polygons',
        title: '模拟多边形的数目',
        value: '2',
        props: {
            placeholder: '',
        }
    }, {
        type: 'input',
        field: 'polygonPoints',
        title: '每个多边形上点的数目',
        value: '3',
        props: {
            placeholder: '',
        }
    }
]);

watch(randType, () => {
    if (randType.value == "0") {
        form.value.fapi.hidden(false, 'pointCount');
        form.value.fapi.hidden(false, 'lines');
        form.value.fapi.hidden(false, 'linePoints');
        form.value.fapi.hidden(false, 'polygons');
        form.value.fapi.hidden(false, 'polygonPoints');
    } else if (randType.value == "1") {
        form.value.fapi.hidden(false, 'pointCount');
        form.value.fapi.hidden(true, 'lines');
        form.value.fapi.hidden(true, 'linePoints');
        form.value.fapi.hidden(true, 'polygons');
        form.value.fapi.hidden(true, 'polygonPoints');
    } else if (randType.value == "2") {
        form.value.fapi.hidden(true, 'pointCount');
        form.value.fapi.hidden(false, 'lines');
        form.value.fapi.hidden(false, 'linePoints');
        form.value.fapi.hidden(true, 'polygons');
        form.value.fapi.hidden(true, 'polygonPoints');
    } else if (randType.value == "3") {
        form.value.fapi.hidden(true, 'pointCount');
        form.value.fapi.hidden(true, 'lines');
        form.value.fapi.hidden(true, 'linePoints');
        form.value.fapi.hidden(false, 'polygons');
        form.value.fapi.hidden(false, 'polygonPoints');
    }
})
const pickBounds = async () => {
    let res = await pickMapBounds(mapApp, uiApp, "geojson_PickBounds", "请在地图上绘制一个矩形做为要模拟的数据范围区域", fApi.bounds);
    if (res) {
        form.value.fapi.setValue({
            bounds: res,
        });
    }
}

const getResult = () => {
    let value = { ...toRaw(fApi) as any };
    // 互联网地图用当前可视范围，dwg图用全图范围
    const defaultBounds = mapApp.isWebBaseMap() ? mapApp.map.fromLngLat(mapApp.map.getBounds()) : mapApp.map.getGeoBounds(0.4);
    let mapBounds = value.bounds == "" ? defaultBounds : vjmap.GeoBounds.fromString(value.bounds);
    let pointCount = +value.pointCount;
    let maxLineCount = +value.lines;
    let maxLinePointCount = +value.linePoints;
    let maxPolygonCount = +value.polygons;
    let maxPolygonPointCount = +value.polygonPoints;
    if (randType.value == "1") {
        maxLineCount = 0;
        maxPolygonCount = 0;
    } else if (randType.value == "2") {
        pointCount = 0;
        maxPolygonCount = 0;
    } else if (randType.value == "3") {
        pointCount = 0;
        maxLineCount = 0;
    }

    let FeatureCollection: any = {
        type: "FeatureCollection",
        features: []
    };

    if (pointCount > 0) {
        let coll = mapBounds.randomGeoJsonPointCollection(Math.max(pointCount, 2));
        if (pointCount == 1) {
            // @ts-ignore
            FeatureCollection.features.push(coll.features[0]);
        } else {
            // @ts-ignore
            FeatureCollection.features.push(...coll.features);
        }

    }
    if (maxLineCount > 0) {
        let coll = mapBounds.randomGeoJsonLineCollection(maxLineCount, maxLinePointCount, undefined, undefined, undefined, maxLineCount, maxLinePointCount);
        // @ts-ignore
        FeatureCollection.features.push(...coll.features);
    }
    if (maxPolygonCount > 0) {
        let coll = mapBounds.randomGeoJsonPolygonCollection(maxPolygonCount, maxPolygonPointCount, undefined, undefined, undefined, maxPolygonCount, maxPolygonPointCount);
        // @ts-ignore
        FeatureCollection.features.push(...coll.features);
    }
    return {
        FeatureCollection
    }
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
    getResult
})
</script>