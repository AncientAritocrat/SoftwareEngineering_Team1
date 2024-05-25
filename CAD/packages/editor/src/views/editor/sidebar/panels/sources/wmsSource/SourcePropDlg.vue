<template>
    <n-card>
        <FormCreate v-model="fApi" ref="form" :rule="rule" :option="option"></FormCreate>
        <n-space justify="end">
            <n-button type="primary" @click="onOK">确定</n-button>
            <n-button  @click="onCancel">取消</n-button>
        </n-space>
    </n-card>
</template>

<script setup lang="ts">
import formCreate from "@form-create/naive-ui"
import { reactive, ref, toRaw } from "vue";
const emit = defineEmits(['update:modelValue', "onClose"]);
const FormCreate = formCreate.$form();
const form = ref<any>(null);
let fApi = reactive<any>({});
const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => { }
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
        field: 'bounds',
        title: '瓦片范围',
        value: props.modelValue?.bounds ? JSON.stringify(props.modelValue?.bounds, null, 0) : undefined,
        info: '默认为全图范围。可指定左下角和右上角的坐标，顺序如下：[左下角x, 左下角y, 右上角x, 右上角y]。当此属性包含在源中时，将不请求在给定边界之外的瓦片',
        props: {
            placeholder: '为空时自动计算。格式为[minx, miny, maxx, maxxy]',
        }
    },
    {
        type: "InputNumber",
        field: 'minzoom',
        title: '最小级别',
        value: props.modelValue?.minzoom,
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
        value: props.modelValue?.maxzoom,
        info: '缺省最大级别为22级',
        props: {
            min: 0,
            max: 24,
            placeholder: '可为空。请输入0-24级别中的一个级别',
        }
    },
])

const onCancel = () => {
    emit("onClose", {})
}

const onOK = () => {
    emit('update:modelValue', toRaw(fApi));
    emit("onClose", {})
}
</script>