<template>
  <n-space vertical>
    <n-space  justify="space-between">
      <n-dropdown trigger="click" :options="sourceOptions" @select="handleAddSource">
      <n-button ghost type="primary" style="width:200px;">
        <template #icon>
          <n-icon>
            <Add />
          </n-icon>
        </template>
        添加数据源
      </n-button>
    </n-dropdown>
      <n-button ghost  @click="refreshSources">
        <template #icon>
          <n-icon>
            <Refresh />
          </n-icon>
        </template>
        刷新
      </n-button>
    </n-space>

   

    <n-scrollbar :style="scrollStyle" trigger="none">
      <n-list bordered hoverable clickable>
        <template #header>
          所有数据源
        </template>
        <n-empty v-if="!sources.length" description="还没有任何数据源">
          <template #icon>
            <n-icon>
              <BasketOutline />
            </n-icon>
          </template>
        </n-empty>
        <n-list-item v-for="item in sources" :key="item.id">
          <template #prefix>
            <n-tag style="width:82px" round :bordered="false" :type="item.tagType" size="small"
              @click="itemClick(item)">
              {{ item.tag }}
            </n-tag>
          </template>
          <template #suffix>
            <n-space style="width:60px">
              <n-button type="info" size="tiny" quaternary @click.prevent="itemVisible(item)">
                <template #icon>
                  <n-icon v-if="item.visibleOff">
                    <EyeOff />
                  </n-icon>
                  <n-icon v-else>
                    <Eye />
                  </n-icon>
                </template>
              </n-button>
              <n-dropdown trigger="hover" :options="menuOptions" @select="(key: string) => handleMenuSelect(item, key)">
                <n-button type="info" size="tiny" quaternary>
                  ...
                </n-button>
             </n-dropdown>
            </n-space>

          </template>
          <div @click="itemClick(item)">
            <n-ellipsis style="max-width: 100%;width:135px;">
              {{ item.memo ? `${item.memo} ${item.id}` : item.id }}
            </n-ellipsis>
          </div>
        </n-list-item>

      </n-list>
    </n-scrollbar>
  </n-space>
</template>

<script setup lang="ts">
import type { editorContext } from '@/types';
import { inject, ref, reactive } from 'vue';
import { Add, BasketOutline, Eye, EyeOff, Refresh } from '@vicons/ionicons5'
import { useResizeObserver } from '@vueuse/core';
import SourceIdDialog from '../SourceIdDialog.vue';
import vjmap from 'vjmap';
import emitter from '@/lib/mitt';
import { showGeoJsonStatic, drawGeoJson, queryGeoJson, changeGeoJson } from './geoJsonSetting'
import { showImageSourcePanel, showTileSourcePanel, showVideoSourcePanel, showWmsSourcePanel } from './sourceSetting'
import { mapSourceOptions, sourceTags, soutceTagTypes } from './define';
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
const scrollStyle = reactive({ maxHeight: '500px' });
useResizeObserver(document.body, (entries) => {
  scrollStyle.maxHeight = (entries[0].contentRect.height - 130) + 'px';
});

const menuOptions = ref([
  {
    label: '复制成新的数据源',
    key: 'copySource'
  },  
  {
    label: '删除数据源',
    key: 'deleteSource'
  },
  {
    label: '修改数据源ID及备注',
    key: 'modifyId'
  }
])
const sourceOptions = ref(mapSourceOptions);
const sources: any = ref([]);
const refreshSources = () => {
  let mapSources = mapApp.sources || [];
  sources.value = [];
  const tags: any = sourceTags;
  const tagTypes: any = soutceTagTypes;
  for (let idx = 0; idx < mapSources.length; idx++) {
    let mapSource = mapSources[idx];
    sources.value.push({
      id: mapSource.id,
      index: idx,
      type: mapSource.source.type,
      tag: tags[mapSource.source.type + (mapSource.tag ? `_${mapSource.tag}` : '')],
      tagType: tagTypes[mapSource.source.type],
      visibleOff: mapSource.visibleOff ?? false,
      memo: mapSource.memo
    })
  }
}
refreshSources();
emitter.on("mapConfigLoaded", () => {
  refreshSources();
});

const handleAddSource = (key: string) => {
  if (key == "geojson_static") {
    showGeoJsonStatic(mapApp, uiApp, undefined, refreshSources);
  } else if (key == "geojson_draw") {
    drawGeoJson(mapApp, uiApp, undefined, refreshSources);
  } else if (key == "geojson_query") {
    if (mapApp.isWebBaseMap()) {
      window.$message.warning('互联网底图不支持数据查询')
      return;
    }
    queryGeoJson(mapApp, uiApp, undefined, refreshSources);
  } else if (key == "geojson_change") {
    changeGeoJson(mapApp, uiApp, undefined, refreshSources);
  } else if (key == "wms") {
    showWmsSourcePanel(mapApp, uiApp, undefined, refreshSources);
  } else if (key == "raster") {
    showTileSourcePanel(mapApp, uiApp, false, undefined, refreshSources);
  } else if (key == "vector") {
    showTileSourcePanel(mapApp, uiApp, true, undefined, refreshSources);
  } else if (key == "image") {
    showImageSourcePanel(mapApp, uiApp, undefined, refreshSources);
  } else if (key == "video") {
    showVideoSourcePanel(mapApp, uiApp, undefined, refreshSources);
  }
}
const itemVisible = async (item: any) => {
  item.visibleOff = !item.visibleOff;
  mapApp.setSourceVisible(item.id, item.visibleOff, true);
}
const itemClick = (item: any) => {
  if (item.type == "geojson") {
    if (item.tag == 'geojson静态') {
      showGeoJsonStatic(mapApp, uiApp, item, refreshSources);
    } else if (item.tag == 'geojson绘制') {
      drawGeoJson(mapApp, uiApp, item, refreshSources);
    } else if (item.tag == 'geojson查询') {
      queryGeoJson(mapApp, uiApp, item, refreshSources);
    }  else if (item.tag == 'geojson动态') {
      changeGeoJson(mapApp, uiApp, item, refreshSources);
    }
  } else if (item.type == "raster") {
    if (item.tag == '栅格瓦片') {
      showTileSourcePanel(mapApp, uiApp, false, item, refreshSources);
    } else if (item.tag == 'WMS栅格') {
      showWmsSourcePanel(mapApp, uiApp, item, refreshSources);
    } 
  }  else if (item.type == "vector") {
    if (item.tag == '矢量瓦片') {
      showTileSourcePanel(mapApp, uiApp, true, item, refreshSources);
    } else if (item.tag == 'WMS矢量') {
      showWmsSourcePanel(mapApp, uiApp, item, refreshSources);
    } 
  }  else if (item.type == "image") {
    if (item.tag == '图像') {
      showImageSourcePanel(mapApp, uiApp, item, refreshSources);
    } 
  }  else if (item.type == "video") {
    if (item.tag == '视频') {
      showVideoSourcePanel(mapApp, uiApp, item, refreshSources);
    } 
  }
}

const handleMenuSelect = async (item: any, key: string ) => {
  if (key == "copySource") {
    let idx = mapApp.sources.findIndex(source => source.id == item.id);
    if (idx < 0) return;
    let res = await uiApp.showModalAsync("SourceIdDialog", '复制数据源', {
        component: SourceIdDialog,
        props: {
            positiveText: '确定',
            negativeText: '取消',
            width: '400px',
            height: '300px'
        }
    })
    if (res.isOk) {
        let opts = res.result || {};
        if (!opts.id) {
          // 随机生成
          opts.id = item.id.substring(0, item.id.indexOf("_") + 1) + vjmap.RandomID(8);
        }
        let findIdx = mapApp.sources.findIndex(source => opts.id == source.id);
        if (findIdx >= 0) {
          window.$message.error("数据源id重复了！");
          return
        }
        mapApp.addSource({
          ...mapApp.sources[idx],
          ...opts
        }, true)
        refreshSources();
    }
  } else if (key == "deleteSource") {
    window.$dialog.warning({
        title: '提示',
        content: `你确定要删除  ${item.id} 的数据源?`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {

          let layerCount = 0;
          for (let k = 0; k < mapApp.layers.length; k++) {
            if (mapApp.layers[k].sourceId == item.id) {
              layerCount++;
            }
          }
          if (layerCount) {
            window.$dialog.warning({
                title: '提示',
                content: `总共有 ${layerCount} 相关的图层用到了此数据源？ 你确定要删除  ${item.id} 的数据源和相关的所有图层?`,
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: () => {
                  mapApp.removeSource(item.id, true);
                  refreshSources();
                }
            })
          } else {
            mapApp.removeSource(item.id, true);
            refreshSources();
          }
          
        }
    })
  } else if (key == "modifyId") {
    let idx = mapApp.sources.findIndex(source => source.id == item.id);
    if (idx < 0) return;
    let res = await uiApp.showModalAsync("SourceIdDialog", '修改', {
        component: SourceIdDialog,
        props: {
            positiveText: '确定',
            negativeText: '取消',
            width: '400px',
            height: '250px',
            id: item.id,
            memo: item.memo
        }
    })
    if (res.isOk) {
        let opts = res.result || {};
        if (!opts.id) {
          // 随机生成
          opts.id = item.id.substring(0, item.id.indexOf("_") + 1) + vjmap.RandomID(8);
        }
        let cfgIdx = mapApp.config.mapSources?.findIndex(source => source.id == item.id) ?? -1;
        let isNeedRefresh = false;
        if (opts.memo != item.memo) {
            mapApp.sources[idx].memo = opts.memo;
            if (cfgIdx >= 0) {
              // @ts-ignore
              mapApp.config.mapSources[cfgIdx].memo = opts.memo;
            }
            isNeedRefresh = true;
        }
        if (opts.id == item.id) {
          if (isNeedRefresh) {
            refreshSources();
          }
          return
        } else {
          let findIdx = mapApp.sources.findIndex(source => opts.id == source.id);
          if (findIdx >= 0) {
            if (isNeedRefresh) {
              refreshSources();
            }
            window.$message.error("数据源id重复了！");
            return
          }
          let layerCount = 0;
          for (let k = 0; k < mapApp.layers.length; k++) {
            if (mapApp.layers[k].sourceId == item.id) {
              mapApp.layers[k].sourceId = opts.id;
              layerCount++;
            }
          }
          mapApp.sources[idx].id = opts.id;

          if (cfgIdx >= 0 && mapApp.config.mapLayers && mapApp.config.mapSources) { 
              for (let k = 0; k < mapApp.config.mapLayers.length; k++) {
              if (mapApp.config.mapLayers[k].sourceId == item.id) {
                mapApp.config.mapLayers[k].sourceId = opts.id;
              }
            }
            mapApp.config.mapSources[cfgIdx].id = opts.id;
          }
          
          refreshSources();
          if (layerCount) {
            window.$message.warning(`有 ${layerCount} 个图层用到了此数据源id, 请先保存，再刷新页面，否则有可能导致绘制不正确。`)
          }
        }
    }
  }
}


</script>

<style lang="scss" scoped>

</style>