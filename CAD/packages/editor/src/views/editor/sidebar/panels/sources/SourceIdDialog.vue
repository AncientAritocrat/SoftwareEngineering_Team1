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
const props = defineProps({
    id: {
        type: String,
        required: false,
        default: ""
    },
    memo: {
        type: String,
        required: false,
        default: ""
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
    type:'input',
    field:'id',
    title:'数据源ID',
    value: props.id,
    props: {
        placeholder: '为空将随机生成',
    }
  },
  {
    type:'input',
    field:'memo',
    title:'备注',
    value: props.memo,
    props: {
        placeholder: '',
    }
  }
])
const getResult = () => {
    let value = toRaw(fApi) as any;
    return value;
}

// 如果对话框要返回值，则必须导出此方法
defineExpose({
   getResult
})
</script>