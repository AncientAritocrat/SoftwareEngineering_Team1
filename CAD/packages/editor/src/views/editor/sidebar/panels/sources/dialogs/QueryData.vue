<template>
    <n-space vertical class="uicontainer">
        <n-card title="查询参数" size="small">
            <n-form ref="formRef" :model="model" size="small" label-placement="left">
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="19" label="条件">
                        <n-input v-model:value="model.condition" placeholder="请输入sql条件表达式" type="textarea"
                            :autosize="{ minRows: 3, maxRows: 3 }" clearable />
                    </n-form-item-gi>
                    <n-gi>
                        <n-button round type="primary" @click="sqlCondShowModal = true">
                            增加条件
                        </n-button>
                    </n-gi>
                </n-grid>
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="15" label="范围">
                        <n-input v-model:value="model.bounds" placeholder="请输入要查询的范围，为空表示不限制范围" clearable />
                    </n-form-item-gi>
                    <n-gi>
                        <n-button round type="info" ghost size="tiny" @click="pickBounds">
                            拾取范围
                        </n-button>
                    </n-gi>
                    <n-gi :offset="3">
                        <n-switch v-model:value="model.isContains" style="width:60px">
                            <template #checked>
                                包含
                            </template>
                            <template #unchecked>
                                相交
                            </template>
                        </n-switch>
                    </n-gi>
                </n-grid>
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="13" label="坐标">
                        <n-radio-group v-model:value="model.coordType" name="radiogroup">
                            <n-space>
                                <n-radio :value="0" name="posCoord">获取位置坐标</n-radio>
                                <n-radio :value="1" name="geomCoord">获取几何坐标</n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item-gi>
                    <n-gi>
                        <n-switch v-model:value="model.clearPropData" style="width:120px">
                            <template #checked>
                                不含属性数据
                            </template>
                            <template #unchecked>
                                包含属性数据
                            </template>
                        </n-switch>
                    </n-gi>
                    <n-gi :offset="5">
                        <n-button round color="#ff69b4" @click="queryData">
                            查询数据
                        </n-button>
                    </n-gi>
                </n-grid>
            </n-form>
        </n-card>
        <n-card title="查询结果" size="small">
            <monaco-editor :style="queryJsonStyle" :wordWrap="false" :lineNumbers="true" v-model="queryJson"
                ref="queryJsonEditor"></monaco-editor>
        </n-card>
    </n-space>
    <n-modal v-model:show="sqlCondShowModal" preset="dialog" title="增加SQL条件" positive-text="确认" negative-text="算了"
        @positive-click="sqlCondSubmitCallback" :style="{ width: '850px' }">
        <FormCreate v-model="sqlCondfApi" ref="sqlCondForm" :rule="sqlCondRule" :option="formOption"></FormCreate>
    </n-modal>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import MonacoEditor from "@/components/MonacoEditor.vue";
import { inject, onUnmounted, reactive, ref, toRaw } from 'vue';
import type MapApp from '@vjmap/common';
import { cacheStorage } from '@vjmap/common';
import vjmap, { GeoBounds } from 'vjmap';
import type { Map } from 'vjmap';
import formCreate from "@form-create/naive-ui"
import { clearHighlight, getHighlightEntities } from '@vjmap/common';
const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => {}
    }
})
const FormCreate = formCreate.$form();
const model = ref({
    condition: '',
    bounds: '',
    isContains: false,
    coordType: 1,
    clearPropData: false,
})
model.value = {...model.value, ...props.modelValue};
const queryJsonEditor = ref()
const queryJsonStyle = reactive({ height: '400px' });
const queryJson = ref('');
useResizeObserver(document.body, (entries) => {
    queryJsonStyle.height = (entries[0].contentRect.height - 400) + 'px';
})
const mMap = inject<MapApp>('interactiveMap');
const map = mMap?.map as Map;

const sqlCondShowModal = ref(false);
let sqlCondfApi = reactive<any>({});

const pickBounds = async () => {
    window.$message.info("请在地图上绘制一个区域做为要查询的范围!");
    clearHighlight(map); // 清除之前高亮的图层
    let actionRect = await vjmap.Draw.actionDrawRectangle(map, {});
    if (actionRect.cancel) {
        return;
    }
    let co = map.fromLngLat(actionRect.features[0].geometry.coordinates[0]);
    model.value.bounds = vjmap.GeoBounds.fromDataExtent(co).toString();

    drawPolygons(map, model.value.bounds);
}



const queryData = async () => {
    if (!model.value.condition && !model.value.bounds) {
        window.$message.warning("请输入查询条件或范围再进行查询");
        return
    }
    clearHighlight(map); // 清除之前高亮的图层
    let bounds: any;
    if (model.value.bounds) {
        bounds = vjmap.GeoBounds.fromString(model.value.bounds).toArray();
    }
    let svc = map.getService();
    // 先从缓存中去查询。如果缓存中有，则直接从缓存中获取就可能了
    const cacheKey = {
        ...model.value,
        mapId: svc.currentMapParam()?.mapid,
        version: svc.currentMapParam()?.version,
        workspace: svc.getCurWorkspaceName()
    };
    let geom = await getHighlightEntities(map, bounds, model.value.coordType == 1, {
        condition: model.value.condition ?? '',
        isContains: model.value.isContains
    })
    if (model.value.clearPropData) {
        // 如果不需要属性数据
        geom.features.forEach((f: any) => f.properties = {})
    }
    geom = map.fromLngLat(geom)
    await cacheStorage.setValueByKey(cacheStorage.toStringKey(cacheKey, "query_"), geom, true);
   
    
    queryJsonEditor.value.setValue(JSON.stringify(geom, null, 4));
    window.$message.info(`共查询到 ${geom.features.length} 个实体对象`)
}

let drawBounds: any;
const drawPolygons = (map: Map, strBounds?: string) => {
    if (drawBounds) {
        drawBounds.remove();
        drawBounds = null;
    }
    let bounds: any;
    if (strBounds) {
        bounds = vjmap.GeoBounds.fromString(model.value.bounds);
    }
    if (!bounds) return;
    let points = [bounds.toPointArray()];
    points.forEach((p: any) => p.push(p[0]));// 闭合
    let polygons = points.map((p: any) => {
        return {
            points: map.toLngLat(p),
            properties: {
                color: "#f00"
            }
        }
    })
    drawBounds = vjmap.createAntPathAnimateLineLayer(map, polygons, {
        fillColor1: "#f00",
        fillColor2: "#0ffb",
        canvasWidth: 128,
        canvasHeight: 32,
        frameCount: 4,
        lineWidth: 4,
        lineOpacity: 0.2
    });
}
if (model.value.bounds) {
    drawPolygons(map, model.value.bounds);
}
const formOption = reactive({
    form: {
        labelWidth: "100px",
        size: 'small'
    },
    submitBtn: false
});

const numSqlCondOptions = [{
    label: "=",
    value: "="
}, {
    label: "!=",
    value: "!="
}, {
    label: ">",
    value: ">"
}, {
    label: "<",
    value: "<"
}, {
    label: "in",
    value: "in"
}, {
    label: "not in",
    value: "not in"
}, {
    label: "",
    value: ""
}];

const strSqlCondOptions = [{
    label: "=",
    value: "="
}, {
    label: "!=",
    value: "!="
}, {
    label: "like",
    value: "like"
}, {
    label: "not like",
    value: "not like"
}, {
    label: "in",
    value: "in"
}, {
    label: "not in",
    value: "not in"
}, {
    label: "",
    value: ""
}];
const getLayerProps = () => {
    let layers = map.getService().getMapLayers();
    return layers.map(ly => {
        return {
            label: ly.name,
            value: ly.index
        }
    })
}
const getEntnameTypeProps = () => {
    return [{
        label: "直线(1)",
        value: "1"
    },
    {
        label: "多段线(2)",
        value: "2"
    },
    {
        label: "二维折线(3)",
        value: "3"
    },
    {
        label: "三维多段线(4)",
        value: "4"
    },
    {
        label: "样条曲线(5)",
        value: "5"
    },
    {
        label: "圆弧(6)",
        value: "6"
    },
    {
        label: "圆(7)",
        value: "7"
    },
    {
        label: "椭圆(8)",
        value: "8"
    },
    {
        label: "曲线(9)",
        value: "9"
    },
    {
        label: "块参照(10)",
        value: "10"
    },
    {
        label: "填充(11)",
        value: "11"
    },
    {
        label: "多行文本(12)",
        value: "12"
    },
    {
        label: "单行文本(13)",
        value: "13"
    },
    {
        label: "型实体(14)",
        value: "14"
    },
    {
        label: "栅格图片(15)",
        value: "15"
    },
    {
        label: "遮罩实体(16)",
        value: "16"
    },
    {
        label: "角度标注[两条线](17)",
        value: "17"
    },
    {
        label: "角度标注[三点](18)",
        value: "18"
    },
    {
        label: "对齐标注(19)",
        value: "19"
    },
    {
        label: "圆弧标注(20)",
        value: "20"
    },
    {
        label: "直径标注(21)",
        value: "21"
    },
    {
        label: "坐标标注(22)",
        value: "22"
    },
    {
        label: "半径标注(23)",
        value: "23"
    },
    {
        label: "半径折线标注(24)",
        value: "24"
    },
    {
        label: "转角标注(25)",
        value: "25"
    },
    {
        label: "属性注记(26)",
        value: "26"
    },
    {
        label: "块属性(27)",
        value: "27"
    }]
}
const sqlCondRule = ref([{
    type: 'select',
    field: 'id',
    title: '数据库id(id)',
    options: numSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 'id_value',
    title: '值',
    value: '',
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
}, {
    type: 'switch',
    field: 'id_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
}, {
    type: 'select',
    field: 'objectid',
    title: '实体ID(objectid)',
    options: strSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 'objectid_value',
    title: '值',
    value: '',
    info: "模糊查找可能like中的匹配符%查找。%符号用于在模式的前后定义通配符。like '%k'查找以字母 'k' 结尾的",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
}, {
    type: 'switch',
    field: 'objectid_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
}, {
    type: 'select',
    field: 'layerindex',
    title: '图层索引(layerindex)',
    options: numSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
}, {
    type: 'select',
    field: 'layerindex_value',
    title: '值',
    options: getLayerProps(),
    value: "",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
        multiple: true
    }
}, {
    type: 'switch',
    field: 'layerindex_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
}, {
    type: 'select',
    field: 'name',
    title: '实体类型(name)',
    options: strSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
}, {
    type: 'select',
    field: 'name_value',
    title: '值',
    options: getEntnameTypeProps(),
    value: "",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
        multiple: true
    }
}, {
    type: 'switch',
    field: 'name_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
},{
    type: 'select',
    field: 'color',
    title: '实体颜色(color)',
    options: numSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 'color_value',
    title: '值',
    value: '',
    info: "颜色(根据rgb颜色计算此值，例如黑色为0x000000,加上透明度为0xFF000000, 变成无符号 0xff000000<<0结果为 -16777216)",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
}, {
    type: 'switch',
    field: 'color_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
}, {
    type: 'select',
    field: 's2',
    title: '扩展字典数据(s2)',
    options: strSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 's2_value',
    title: '值',
    value: '',
    info: "模糊查找可能like中的匹配符%查找。%符号用于在模式的前后定义通配符。like '%k'查找以字母 'k' 结尾的",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
}, {
    type: 'switch',
    field: 's2_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
}, {
    type: 'select',
    field: 's3',
    title: '坐标数据(s3)',
    options: strSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 's3_value',
    title: '值',
    value: '',
    info: "x1,y1;x2,y2;...格式",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
}, {
    type: 'switch',
    field: 's3_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
}, {
    type: 'select',
    field: 's4',
    title: '文字内容(s4)',
    options: strSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 's4_value',
    title: '值',
    value: '',
    info: "单行文本为文字内容，多行文本为包含文字样式的文字内容。模糊查找可能like中的匹配符%查找。%符号用于在模式的前后定义通配符。like '%k'查找以字母 'k' 结尾的",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
}, {
    type: 'switch',
    field: 's4_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
}, {
    type: 'select',
    field: 's5',
    title: '多行文字内容(s5)',
    options: strSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 's5_value',
    title: '值',
    value: '',
    info: "单行文本为空，多行文本为不包含文字样式的文字内容。模糊查找可能like中的匹配符%查找。%符号用于在模式的前后定义通配符。like '%k'查找以字母 'k' 结尾的",
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
}, {
    type: 'switch',
    field: 's5_cond',
    title: '或',
    value: false,
    info: "fasle为‘或’; true为‘与’",
    col: {
        span: 4
    }
},{
    type: 'select',
    field: 'n1',
    title: '颜色索引(n1)',
    options: numSqlCondOptions,
    value: "",
    col: {
        span: 8
    }
},
{
    type: "Input",
    field: 'n1_value',
    title: '值',
    value: '',
    col: {
        span: 12
    },
    props: {
        placeholder: '',
    }
},
])

const sqlCondSubmitCallback = () => {
    let param = toRaw(sqlCondfApi);
    let sql= "";
    let items = ['id', 'objectid', 'layerindex', 'name', 'color', 's2', 's3', 's4', 's5', 'n1'];
    let lastJoin;
    for(let key of items) {
        let cond = param[key];
        let val = param[key + "_value"];
        let join = param[key + "_cond"];
        if (!cond || !val) continue;
        val = toRaw(val);
        if (Array.isArray(val)) {
            // 如果是数组，则只能于用in和not in。如果不是的话，则只取第一个
            if (!(cond == "in" || cond == "not in")) {
                val = val[0]
                if (typeof val == "string") {
                    val = `"${val}"`
                }
            } else {
                val = JSON.stringify(val, null, 0).replace("[", "(").replace("]", ")")
            }
        } else if (typeof val == "string") {
            val = `"${val}"`
        }
        if (lastJoin) {
            sql += " " + lastJoin + " ";
        }
        sql += ` ${key} ${cond} ${val}`;
        lastJoin = join ? "and" : "or";
    }
    model.value.condition = model.value.condition + " " + sql;
}

onUnmounted(() => {
    if (drawBounds) {
        drawBounds.remove();
        drawBounds = null;
    }
})
const getResult = () => {
    return toRaw(model.value);
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
    getResult
})
</script>

<style>
.uicontainer {
    opacity: 0.9;
    width: 600px;
}

.model {
    width: 500px;
}
</style>