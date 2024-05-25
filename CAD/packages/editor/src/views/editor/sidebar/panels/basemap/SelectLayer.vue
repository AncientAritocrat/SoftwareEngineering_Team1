<template>
    <n-data-table
    v-model:checked-row-keys="checkedRowKeysRef"
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :row-key="rowKey"
    @update:checked-row-keys="handleCheck"
  />
</template>

<script setup  lang="ts">
import {  inject, reactive, ref } from 'vue'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import type MapApp from '@vjmap/common';
import type { IMapLayer } from 'vjmap';
const emits = defineEmits(['update:modelValue']);
const mMap = inject<MapApp>('interactiveMap');
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => {}
  }
})
type RowData = {
  index: string
  layername: string
}
const createColumns = (): DataTableColumns<RowData> => [
  {
    type: 'selection',
  },
  {
    title: '图层索引',
    key: 'index'
  },
  {
    title: '图层名称',
    key: 'layername'
  }
]

const data = mMap?.map.getService().getMapLayers().map((layer: IMapLayer) => ({
  layername: layer.name,
  index: layer.index,
})) 
const checkedRowKeysRef = ref<DataTableRowKey[]>(props.modelValue.layers);
const columns = createColumns();
const pagination = reactive({
    pageSize: 8
});
const rowKey = (row: RowData) => row.index;
const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys;
    let config = mMap?.getConfig();
    // @ts-ignore
    config.mapOpenOptions.style.layeron = rowKeys;
    // @ts-ignore
    mMap.setMapOpenOptions(config.mapOpenOptions);
    emits("update:modelValue", {
      layers: rowKeys
    })
}
</script>