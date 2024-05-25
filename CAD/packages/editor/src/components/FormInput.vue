<template>
    <n-card>
        <FormCreate v-model="fApi" ref="form" :rule="rule" :option="option"></FormCreate>
    </n-card>
</template>

<script setup lang="ts">
import formCreate from "@form-create/naive-ui"
import { reactive, ref, toRaw } from "vue";
const FormCreate = formCreate.$form();
const form = ref<any>(null);
let fApi = reactive<any>({});
defineProps({
    option: {
        type: Object,
        required: false,
        default: () => {
            return {
                form: {
                    labelWidth: "auto",
                    size: 'small'
                },
                submitBtn: false
            }
        }
    },
    rule: {
        type: Object,
        required: true
    }
});

const getResult = () => {
    return toRaw(fApi);
}

// 如果对话框要返回值，则必须导出此方法
defineExpose({
   getResult
})
</script>