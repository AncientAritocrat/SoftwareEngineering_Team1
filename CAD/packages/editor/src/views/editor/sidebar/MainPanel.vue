<template>
  <n-layout has-sider class="sider-container">
    <n-layout-sider bordered :width="95" :native-scrollbar="false">
      <n-menu :options="menuOptions" @update:value="handleMenuClick" v-model:value="selectedMenuKey"/>
    </n-layout-sider>
    <n-layout class="sider-layout">
        <component class="sider-panel" v-if="panelName" :is="config?.component" v-bind="config?.props || {}" v-on="config?.listeners || {}"> </component>
    </n-layout>
  </n-layout>
  <float-panel></float-panel>
</template>
  
<script setup lang="ts">
import FloatPanel from './FloatPanel.vue';
import BaseMapMainPanel from './panels/basemap/BaseMapPanel.vue'
import SourceMainPanel from './panels/sources/SourcesPanel/index.vue'
import LayerMainPanel from './panels/layers/LayersPanel.vue'
import ControlsPanel from './panels/controls/ControlsPanel.vue'
import SetMainPanel from './panels/settings/SetPanel.vue'
import ProgramPanel from './panels/program/ProgramPanel.vue'
import { computed, ref, onMounted, reactive, watch, nextTick } from 'vue';
import { inject } from 'vue'
import type { editorContext } from '@/types';
import { useRoute } from 'vue-router';
import Storage, { IndexDbStorage } from '@/lib/storage'
import emitter from '@/lib/mitt';
import { map } from 'lodash';
import { Service } from 'vjmap';
import { APP_VISUAL_KEY, useAppStore } from '@/stores/app';
const app = useAppStore();
const route = useRoute()
const editor = inject<editorContext>('editorContext');
const panelName = computed(() => editor?.uiApp.get('curPaneName'));
let config = reactive<any>({});
watch(panelName, () => {
  config = editor?.uiApp.getCurPanelComponent();
});
const menuOptions: any  = [
  {
    label: '底图',
    key: 'basemap'
  },
  {
    label: '数据源',
    key: 'mapsources'
  },
  {
    label: '图层',
    key: 'maplayers'
  },
  {
    label: '控件',
    key: 'controls'
  },
  {
    label: '逻辑',
    key: 'program'
  },
  {
    label: '设置',
    key: 'settings'
  }
];
const selectedMenuKey = ref("basemap");
const handleMenuClick = (key: string) => {
  if (key == 'basemap') {
    editor?.uiApp.showPane("basemap", {
      component: BaseMapMainPanel
    })
  } else if (key == 'mapsources') {
    editor?.uiApp.showPane("sources", {
      component: SourceMainPanel
    })
  } else if (key == 'maplayers') {
    editor?.uiApp.showPane("layers", {
      component: LayerMainPanel
    })
  }  else if (key == 'controls') {
    editor?.uiApp.showPane("controls", {
      component: ControlsPanel
    })
  }  else if (key == 'program') {
    editor?.uiApp.showPane("program", {
      component: ProgramPanel
    })
  }  else if (key == 'settings') {
    editor?.uiApp.showPane("settings", {
      component: SetMainPanel
    })
  }
}

onMounted(async () => {
  // 初始时设置底图面板
  editor?.uiApp.showPane("");
  let isLocal = route.query?.isLocal === "true";
  if (route.query?.key) {
    if (editor) editor.mapApp.projectKey = route.query?.key as string;
    let record: any;
    let config: any;
    if (isLocal) {
      record = await Storage.getRecordByKey(route.query?.key as string);
      if (record.length > 0) {
        config = IndexDbStorage.toMapAppConfig(record[0].config);
      } else {
        config = {};
        const openMapParam = {
          mapid: 'sys_zp', // 地图ID,(请确保此ID已存在，可上传新图形新建ID)
          mapopenway: "GeomRender", // 以几何数据渲染方式打开
          version: '',
          workspace: '',
          isVectorStyle: false,
          accessKey: '',
          style: {
            backcolor: 0
          },
        };
        if (route.query?.mapid) {
          openMapParam.mapid = route.query.mapid as string;
        }
        if (route.query?.version) {
          openMapParam.version = route.query.version as string;
        }
        if (route.query?.workspace) {
            openMapParam.workspace = route.query.workspace as string;
        }
        if (route.query?.mapopenway) openMapParam.mapopenway = route.query.mapopenway as any;
        if (route.query?.vector) openMapParam.isVectorStyle = route.query.vector == 'true';
        if (route.query?.theme) {
          openMapParam.style.backcolor = route.query.theme as string == 'light' ? 0xFFFFFF : 0;
        } 
        if (route.query?.accessKey) openMapParam.accessKey = route.query.accessKey as any;
        config.mapOpenOptions = {...openMapParam};
      }
    } else {
      let svc = new Service(app.serviceUrl, app.accessToken);
      let keyInfo = APP_VISUAL_KEY + route.query?.key;
      let res = await svc.getCustomData(keyInfo, {retDataType: "value"});
      config = res.data;
    }
     
    if (config) {
      editor?.mapApp.setConfig(config).then(() => {
        emitter.emit("mapConfigLoaded", editor?.mapApp);
      });
    }
  } 
  nextTick(() => {
    handleMenuClick("basemap") ;
  });
 
})
</script>


<style lang="scss" scoped>
.sider-container {
  height: calc(100vh - 83px);

  .sider-panel {
    width: 100%;
    height: 100%;
  }

  .sider-layout {
    margin: 3px;
  }
}
</style>