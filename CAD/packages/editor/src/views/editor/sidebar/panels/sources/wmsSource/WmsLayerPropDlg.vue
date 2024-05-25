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
        type: 'Switch',
        field: 'transparent',
        title: '是否透明',
        value: props.modelValue?.transparent ?? true,
        props: {
        }
    },
    {
        type: "ColorPicker",
        field: 'backgroundColor',
        title: '瓦片背景色',
        value: props.modelValue?.backgroundColor,
        props: {
        }
    },
    {
        type: 'Switch',
        field: 'mvt',
        title: '获取为矢量瓦片',
        value: props.modelValue?.mvt,
        props: {
        }
    },
    {
        type: 'Switch',
        field: 'useImageRotate',
        title: '是否考虑旋转',
        value: props.modelValue?.useImageRotate,
        props: {
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