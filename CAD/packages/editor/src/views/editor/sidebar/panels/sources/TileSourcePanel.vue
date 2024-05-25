<template>
    <n-space vertical>
            <n-card>
                <FormCreate v-model="fApi" ref="form" :rule="rule" :option="option"></FormCreate>
            </n-card>
    </n-space>
</template>

<script setup lang="ts">
import type { editorContext } from "@/types";
import formCreate from "@form-create/naive-ui"
import { inject, reactive, ref, toRaw } from "vue";
import { pickMapBounds } from "@/lib/map/pick";
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
const FormCreate = formCreate.$form();
const form = ref<any>(null);
let fApi = reactive<any>({});
const props = defineProps({
    data: {
        type: Object,
        required: false,
        default: () => {
            return {
            }
        }
    },
    isVector: {
        type: Boolean,
        required: false,
        default: false
    }
});

const option = reactive({
    form: {
        labelWidth: "auto",
        size: 'small'
    },
    submitBtn: false
});
const rule = ref([
    {
        type: 'input',
        field: 'id',
        title: '数据源ID',
        value: props.data?.id,
        props: {
            placeholder: '为空的话，则自动生成',
            disabled: !!(props.data?.id)
        }
    },
    {
        type: 'input',
        field: 'tiles',
        title: '瓦片地址',
        value: props.data?.tiles,
        info: '格式如 https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z} 内置变量还有服务地址 {serviceUrl} ,token {accessToken}',
        props: {
            placeholder: '必填项',

        }
    },
    {
        type: "InputNumber",
        field: 'tileSize',
        title: '瓦片大小',
        value: props.data?.tileSize,
        info: '缺省瓦片大小为512',
        props: {
            min: 0,
            placeholder: '可为空。默认为512'
        }
    },
    {
        type: 'input',
        field: 'bounds',
        title: '瓦片范围',
        value: props.data?.bounds ? JSON.stringify(props.data?.bounds, null, 0) : undefined,
        info: '默认为全图范围。可指定左下角和右上角的坐标，顺序如下：[左下角x, 左下角y, 右上角x, 右上角y]。当此属性包含在源中时，将不请求在给定边界之外的瓦片',
        props: {
            placeholder: '可为空。格式为[minx, miny, maxx, maxxy]',
        },
        suffix:{
            type:'button', 
            children:['拾取'], 
            on:{
                click: async () => {
                    let res = await pickMapBounds(mapApp, uiApp, "raster_pickbounds", "请在地图上绘制一个区域做为瓦片的范围", fApi.bounds);
                    if (res) {
                        form.value.fapi.setValue({
                            bounds: res,
                        });
                    }
                }
            }
        }
    },
    {
        type: "InputNumber",
        field: 'minzoom',
        title: '最小级别',
        value: props.data?.minzoom,
        info: '缺省最小级别为0级',
        props: {
            min: 0,
            max: 24,
            placeholder: '可为空。请输入0-24级别中的一个级别',
        }
    },
    {
        type: "InputNumber",
        field: 'maxzoom',
        title: '最大级别',
        value: props.data?.maxzoom,
        info: '缺省最大级别为22级',
        props: {
            min: 0,
            max: 24,
            placeholder: '可为空。请输入0-24级别中的一个级别',
        }
    },
    {
        type: 'select',
        field: 'scheme',
        title: '瓦片y方向',
        value: props.data?.scheme,
        info: '影响瓦片坐标的y方向,默认xyz。“xyz”和“tms”。XYZ中，Y从顶部开始，而在TMS中，Y从底部开始',
        options: [{
            label: "",
            value: undefined
        },{
            label: "xyz(Y从顶部开始)[缺省]",
            value: "xyz"
        },{
            label: "tms(Y从底部开始)",
            value: "tms"
        }],
        props: {
            placeholder: '可为空。默认为xyz(Y从顶部开始)',
        }
    },
]);

if (props.isVector) {
    // 如果是矢量瓦片
    rule.value.push({
        type: 'input',
        field: 'promoteId',
        title: '属性ID字段',
        value: props.data?.promoteId,
        info: '可把属性中的某个字段值做为ID',
        props: {
            placeholder: '可为空',
        }
    })
}

const getResult = () => {
    let data = toRaw(fApi);
    if (data.bounds) {
        data.bounds = JSON.parse(data.bounds);
    }
    if (!data.tiles) {
        window.$message.error('没有输入瓦片地址')
        return {};
    }
    return {
        data: Object.keys(data).reduce((obj: any, key) => {
            if (data[key] !== undefined) {
                obj[key] = data[key];
            }
            return obj;
        }, {})
    }
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
    getResult
})
</script>