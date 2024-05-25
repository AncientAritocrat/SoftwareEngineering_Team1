<template>
  <n-space vertical>
    <n-scrollbar style="max-height: 440px;height:440px" trigger="none">
      <n-collapse :default-expanded-names="defaultExpandedNames">
        <n-collapse-item :title="item.collapse" :name="item.collapse" v-for="item in collapses" :key="item.collapse">
          <n-space>
            <n-button size="small" :tertiary="!(curSelectLayer == layer.type)" :type="layer.color ?? 'primary'"
              v-for="layer in item.layers" :key="layer.name" @click="clickLayerItem(layer)">
              <template #icon>
                <n-icon v-if="layer.icon" size="25">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path :d="layer.icon" />
                  </svg>
                </n-icon>
              </template>
              {{ layer.name }}
            </n-button>
          </n-space>
        </n-collapse-item>
      </n-collapse>
    </n-scrollbar>
    <n-divider />
    <n-form ref="formRef" inline :label-width="80" :model="formValue" label-placement="left" size="tiny">
      <n-form-item label="图层ID" style="width:25%">
        <n-input v-model:value="formValue.layerId" placeholder="为空将随机生成" />
      </n-form-item>
      <n-form-item label="图层备注" style="width:20%">
        <n-input v-model:value="formValue.memo" placeholder="可为空" />
      </n-form-item>
      <n-form-item label="数据源ID" style="width:55%">
        <n-select v-model:value="formValue.sourceId" :options="sourceOptions" :render-label="renderLabel" />
      </n-form-item>
    </n-form>
  </n-space>
</template>
  
<script setup lang="ts">
import { h, inject, ref } from 'vue'
import allLayers from '@/lib/layers';
import type { editorContext } from '@/types';
import { NGradientText, NText, type SelectRenderLabel } from 'naive-ui';
import { sourceTags } from '../sources/SourcesPanel/define'
import vjmap from 'vjmap';
import { getSources } from './util';
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
const layers = ref<{
  name: string;
  icon?: string;
  matchSource?: string;
  type: string;
  collapse: string;
  SourceIdCanNull?: boolean;
  color?: string
}[]>([]);
for (let k in allLayers) {
  layers.value.push({
    type: k,
    name: allLayers[k].name,
    collapse: allLayers[k].collapse,
    icon: allLayers[k].icon,
    matchSource: allLayers[k].matchSource,
    SourceIdCanNull: allLayers[k].matchSource && allLayers[k].matchSource.length == 1 && allLayers[k].matchSource[0] === ""
  });
}
const curSelectLayer = ref("");
const collapses = ref<any>([]);
const defaultExpandedNames = ref<string[]>([]);
const types = ['info', 'success', 'warning', 'error']
for (let i = 0; i < layers.value.length; i++) {
  let idx = collapses.value.findIndex((c: any) => c.collapse == layers.value[i].collapse);
  if (idx == -1) {
    collapses.value.push({
      collapse: layers.value[i].collapse
    });
    idx = collapses.value.length - 1;
    defaultExpandedNames.value.push(layers.value[i].collapse);
  }
  collapses.value[idx].layers = collapses.value[idx].layers || [];
  layers.value[i].color = types[idx % types.length]
  collapses.value[idx].layers.push(layers.value[i])
}

const formValue = ref({
  layerId: '',
  sourceId: '',
  memo: ''
});
const tags = sourceTags;
const sourceOptions = ref<any>([]);
const updatSource = (matchSource?: string | string[]) => {
  sourceOptions.value = [];
  sourceOptions.value = getSources(mapApp, matchSource, tags);
}
updatSource();

const renderLabel: SelectRenderLabel = (option) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    },
    [
      h(
        'span',
        {
          style: {
            marginLeft: '2px',
            padding: '4px 0'
          }
        },
        [
          h('span', null, [option.memo ? `${option.memo} ${option.id}` : option.id as string]),
          h(
            NGradientText,
            {
              tag: 'span', type: "info", style: {
                marginLeft: '10px',
                padding: '4px 0'
              }
            },
            {
              default: () => option.tag
            }
          )
        ]
      )
    ]
  )
}
const clickLayerItem = (item: any) => {
  if (item.type == curSelectLayer.value) {
    curSelectLayer.value = ''
  } else {
    curSelectLayer.value = item.type
  }
  updatSource(item.matchSource ?? 'geojson');
}

// 关闭前回调，返回false的话将取消对话框的关闭
const beforeClose = () => {
  if (!curSelectLayer.value) {
    window.$message.error('您还没有选择要创建图层的类型');
    return false;
  }
  let layer = layers.value.find((layer: any) => layer.type == curSelectLayer.value);
  if (layer && !layer.SourceIdCanNull && formValue.value.sourceId == "") {
    window.$message.error('您还没有选择数据源ID');
    return false;
  }
  return true;
}

const getResult = () => {
  let type = curSelectLayer.value;
  let layerId = formValue.value.layerId;
  if (!layerId) {
    layerId = curSelectLayer.value + "_" + vjmap.RandomID(8);
  }
  let initData = { ...allLayers[type].factory({}, null, mapApp).default };
  return {
    layerId,
    sourceId: formValue.value.sourceId,
    memo: formValue.value.memo,
    type: type,
    ...initData
  }
}
defineExpose({
  beforeClose,
  getResult
})

</script>