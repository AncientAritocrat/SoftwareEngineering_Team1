<template>
    <n-card class="card">
        <n-space vertical>
            <n-button type="primary" ghost @click="emit('addMarker')">
                增加对应点
            </n-button>
            <n-button type="warning" ghost @click="emit('removeMarkers')">
                删除所有对应点
            </n-button>
            <n-checkbox v-model:checked="param.isSetRotateZero" :on-update:checked="(v: Boolean) => {param.isSetRotateZero = v; onChange()}">
                不允许旋转
            </n-checkbox>
            <n-data-table :columns="dataColumns" :data="param.coordinates"  max-height="200px"
               default-expand-all />
        </n-space>
    </n-card>
</template>
<script setup lang="ts">
import { ref, toRaw } from 'vue';
import type { DataTableColumns } from 'naive-ui';
const emit = defineEmits(['updateValue', 'addMarker', 'removeMarkers']);
const props = defineProps({
  value: {
    type: Object,
    required: false,
    default: ()=>{}
  }
})
const param = ref(props.value ?? {});
type RowData = {
    x1: number
    y1: number
    x2: number
    y2: number
}
const dataColumns: DataTableColumns<RowData> = [
    {
        type: 'expand',
        renderExpand: (rowData) => {
            return `
            ${rowData.x2.toFixed(2)},${rowData.y2.toFixed(2)}; ${rowData.x1.toFixed(2)},${rowData.y1.toFixed(2)}
        `
        }
    },
    {
        title: '对应点坐标x',
        key: 'x2',
        width: 120
    },
    {
        title: '对应点坐标y',
        key: 'y2',
        width: 120,
        ellipsis: true
    },
    {
        title: '底图点坐标x',
        key: 'x1',
        width: 120
    },
    {
        title: '底图点坐标y',
        key: 'y1',
        width: 120,
        ellipsis: true
    }
]
const onChange =() => {
    let res = toRaw(param.value);
    emit("updateValue", res)
};
</script>
<style scoped>
.card {
    position: absolute;
    width: 200px;
    height: 450px;
}
</style>
