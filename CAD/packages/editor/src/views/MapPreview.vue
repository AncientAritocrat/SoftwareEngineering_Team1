<template>
  <div>
    <div id="mapPreivewContainer"></div>
    <div class="uiContainer" v-if="isLoaded">
      <div class="rt-card">
        <n-space>
          <n-button-group size="small" v-if="!app.previewHideControl" class="toolbar">
            <n-popover placement="bottom" width="200" trigger="click">
              <template #trigger>
                <n-button type="primary" round>数据图层</n-button>
              </template>
              <LayerManage :layers="dataLayers" @change="changeDataLayer" />
            </n-popover>
            <n-popover placement="top" width="200" trigger="click">
              <template #trigger>
                <n-button type="info">CAD图层</n-button>
              </template>
              <LayerManage :layers="cadLayers" @change="changeCadLayer" />
            </n-popover>
            <n-dropdown :options="measureOptions" @select="handleMeasureSelect">
              <n-button type="success">测量</n-button>
            </n-dropdown>
          </n-button-group>
          <n-tooltip :style="{ maxWidth: '800px' }" trigger="hover">
            <template #trigger>
              <n-button color="#54B365" size="small" circle @click="app.previewHideControl = !app.previewHideControl">
                <template #icon>
                  <n-icon v-if="!app.previewHideControl">
                    <Eye />
                  </n-icon>
                  <n-icon v-else>
                    <EyeOff />
                  </n-icon>
                </template>
              </n-button>
            </template>
            显示或隐藏右侧工具栏
          </n-tooltip>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vjmap/dist/vjmap.min.css'
import { MapApp, runMeasureCmd, switchCadLayers } from '@vjmap/common'
import { onMounted, onUnmounted, ref } from 'vue'
import { APP_VISUAL_KEY, useAppStore } from '@/stores/app';
import LayerManage from '@/components/LayerManage.vue'
import { useRoute } from 'vue-router';
import { Map, Service } from 'vjmap';
import Storage, { IndexDbStorage } from '@/lib/storage'
import { Eye, EyeOff } from '@vicons/ionicons5'
import vjmap from 'vjmap';
import { onMapLoaded } from '@/lib/program';
const route = useRoute();
const app = useAppStore();
const dataLayers = ref<{ index: string; color: string; name: string; isOff?: boolean }[]>([]);
const cadLayers = ref<{ index: string; color: string; name: string; isOff?: boolean }[]>([]);
const mapApp = new MapApp();
const isLoaded = ref(false);
onMounted(async () => {
  mapApp.mount("mapPreivewContainer");
  let isLocal = route.query?.isLocal === "true";
  let key = route.query?.key ?? '';
  if (!key) return;
  let record: any;
  let config: any;
  if (isLocal) {
    record = await Storage.getRecordByKey(key as string);
    if (record.length > 0) {
      config = IndexDbStorage.toMapAppConfig(record[0].config);
    }
  } else {
    let svc = new Service(app.serviceUrl, app.accessToken);
    let keyInfo = APP_VISUAL_KEY + key;
    let res = await svc.getCustomData(keyInfo, { retDataType: "value" });
    config = res.data;
  }

  let cfg = config;
  cfg.serviceUrl = cfg.serviceUrl ?? app.serviceUrl;
  cfg.serviceToken = cfg.serviceToken ?? app.accessToken;
  mapApp.isDisableRunProgram = false;
  await mapApp.setConfig(cfg);
  
  if (mapApp.isDisableRunProgram) {
    // 测试代码，方便在这里写代码，然后复制到配置中的逻辑代码中去
    await onMapLoaded(mapApp.map, mapApp);
  }
  
  
  getLayerData();
  isLoaded.value = true;
})
onUnmounted(() => {
  mapApp.destory();
});

const getLayerData = () => {
  const map = mapApp?.map as Map;
  let svc = map.getService();
  // 获取数据图层
  for (let i = 0; i < mapApp.layers.length; i++) {
    dataLayers.value.push({
      index: mapApp.layers[i].layerId,
      color: vjmap.randomColor(),
      name: `${mapApp.layers[i].memo ?? ''} ${mapApp.layers[i].layerId}`,
      isOff: mapApp.layers[i].visibleOff
    })
  }

  cadLayers.value = [];
  if (!mapApp.isWebBaseMap() && mapApp.config.mapOpenOptions?.mapid) {
    // 获取cad图层
    cadLayers.value = svc.getMapLayers().map(m => {
        return {
          index: m.index + '',
          color: vjmap.randomColor(),
          name: m.name,
          isOff: m.isOff
        }
      })
  }
}


const changeDataLayer = (layers: any) => {
  for (let i = 0; i < layers.length; i++) {
    let idx = mapApp.layers.findIndex(m => m.layerId == layers[i].index);
    if (idx == -1) continue;
    if (mapApp.layers[idx].visibleOff != layers[i].isOff) {
      mapApp.setLayerVisible(mapApp.layers[idx].layerId, layers[i].isOff);
    }
  }
}

const changeCadLayer = async (layers: any) => {
  const map = mapApp?.map as Map;
  await switchCadLayers(map, layers, mapApp.config.mapOpenOptions?.isVectorStyle ?? false);
}

const measureOptions = ref([
  {
    label: '测量距离',
    key: 'measureDist'
  }, {
    label: '测量面积',
    key: 'measureArea'
  }, {
    label: '测量角度',
    key: 'measureAngle'
  }, {
    label: '测量坐标',
    key: 'measureCoordinate'
  }, {
    label: '取消测量',
    key: 'measureCancel'
  }
])

const handleMeasureSelect = (key: string) => {
  const map = mapApp?.map as Map;
  runMeasureCmd(map, key);
}
</script>

<style lang="scss">
/* 把这里面的样式做为全局样式，以供例子中演示调用 */
.my-custom-popup .vjmapgis-popup-content {
  background-color: #57ffffbd;
}

.my-custom-popup .vjmapgis-popup-tip {
  border-top-color: #57ffffbd !important;
}

#mapPreivewContainer {
  position: fixed;
  left: 0px;
  top: 35px;
  right: 0px;
  bottom: 0px;
  background: #022b4f;
}

.uiContainer {
  z-index: 2;

  .rt-card {
    position: fixed;
    top: 40px;
    right: 70px;
  }

  .toolbar {
    opacity: 0.7;
  }
}
</style>