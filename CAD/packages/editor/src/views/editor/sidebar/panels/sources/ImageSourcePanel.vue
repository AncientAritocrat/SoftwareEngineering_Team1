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
import { pickMapImageCoordinates } from "@/lib/map/pick";
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
        field: 'url',
        title: '图片地址',
        value: props.data?.url,
        props: {
            placeholder: '必填项',

        }
    },
    {
        type: 'input',
        field: 'coordinates',
        title: '图片范围',
        value: props.data?.coordinates ? JSON.stringify(props.data?.coordinates) : undefined,
        info: '按顺时针顺序排列的图像四个点的点坐标：[左上角，右上角，右下角，左下角]。',
        props: {
            placeholder: '必填项',
        },
        suffix:{
            type:'button', 
            children:['拾取图像范围'], 
            on:{
                click: async () => {
                    if (!fApi.url) {
                        window.$message.error("请先输入图像地址")
                        return;
                    }
                    let res = await pickMapImageCoordinates(mapApp, uiApp, "image_pickImageCoordinates", "请在地图上拖动标注的四个点做为图像的范围", 
                    "image", fApi.url, fApi.coordinates);
                    if (res) {
                        form.value.fapi.setValue({
                            coordinates: res,
                        });
                    }
                }
            }
        }
    }
]);

const getResult = () => {
    let data = toRaw(fApi);
    if (data.coordinates) {
        data.coordinates = JSON.parse(data.coordinates);
    } else {
        window.$message.error('没有输入图片坐标范围')
        return {};
    }
    if (!data.url) {
        window.$message.error('没有输入图片地址')
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