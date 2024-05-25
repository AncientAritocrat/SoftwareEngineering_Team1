<template>
    <n-space vertical >
        <n-button ghost type="primary" style="width:100%;" @click="selectMap">
            <template #icon>
                <n-icon>
                <Add />
                </n-icon>
            </template>
            选择地图
        </n-button>

        <n-card v-if="!baseMapType || baseMapType == 'CAD'">
            <FormCreate v-model="fApi" ref="form" :rule="rule" :option="option" @change="onChange"></FormCreate>
        </n-card>
        <n-card v-else>
            <n-space vertical >
               <n-tag :bordered="false" type="success">
                    互联网地图
               </n-tag>
               <n-tag :bordered="false" type="info">
                {{  baseMapType  }}
               </n-tag>
              
                <n-text type="success" v-for="item in mapTiles" :key="item">
                    {{ item  }}
               </n-text>
            </n-space >
        </n-card>
  </n-space>
</template>

<script setup lang="ts">
import type { editorContext } from '@/types';
import { inject, ref, reactive, toRaw, nextTick } from 'vue';
import { Add } from '@vicons/ionicons5'
import formCreate from "@form-create/naive-ui"
import { useDebounceFn } from '@vueuse/core';
import SelectMapDlg from './SelectMapDlg.vue';
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
const FormCreate = formCreate.$form();
const form = ref<any>(null);
let fApi = reactive<any>({});
const baseMapType = ref(mapApp?.getConfig().baseMapType);
const mapOpenOptions: any = mapApp?.getConfig().mapOpenOptions || {};
const mapTiles = ref<string[]>( mapApp?.getConfig().webMapTiles ?? []);
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
    field:'mapid',
    title:'图ID',
    value: mapOpenOptions.mapid,
    props: {
        placeholder: '',
    }
  },
  {
    type:'input',
    field:'version',
    title:'版本',
    value: mapOpenOptions.version,
    props: {
        placeholder: '',
    }
  },
  {
    type:"radio",
    title:"打开方式",
    field:"mapopenway",
    value: mapOpenOptions.mapopenway ?? "GeomRender",
    options:[
        {value:"GeomRender",label:"几何渲染"},
        {value:"Memory",label:"内存模式"},
        ],
    },
    {
        type:"switch",
        title:"矢量样式",
        field:"isVectorStyle",
        value: mapOpenOptions.isVectorStyle
    }
]);
const onChange = useDebounceFn(() => {
    let value = toRaw(fApi) as any;
    mapApp.setMapOpenOptions(value);
}, 1000);


const selectMap = async () => {
    
    let res = await uiApp.showModalAsync("SelectMapDlg", '选择地图', {
            component: SelectMapDlg,
            props: {
                positiveText: '',
                negativeText: '',
                width: '880px'
            }
        })
        if (res.isOk) {
            const isWebBaseMapOld = mapApp.isWebBaseMap();
            mapApp.config.baseMapType = res.result?.baseMapType;
            mapApp.config.webMapTiles = res.result?.webMapTiles;
            baseMapType.value = mapApp.config.baseMapType as any;
            mapTiles.value = res.result?.webMapTiles;
            await nextTick();
            const isWebBaseMapNew = mapApp.isWebBaseMap();
            if (isWebBaseMapNew != isWebBaseMapOld) {
                // 底图变了，中心点参数需要改下
                if (mapApp.config.mapOptions) {
                    delete mapApp.config.mapOptions.center;
                    delete mapApp.config.mapOptions.zoom;
                    delete mapApp.config.mapOptions.bearing;
                    delete mapApp.config.mapOptions.pitch;
                }
            }
            let value = {
                mapid: res.result?.mapid,
                version: res.result?.version,
                mapopenway: res.result?.mapopenway,
                isVectorStyle: res.result?.isVectorStyle
            };
            form.value?.fapi.setValue(value);
            await mapApp.setMapOpenOptions(value);
            if (isWebBaseMapNew != isWebBaseMapOld && !isWebBaseMapNew && mapApp.config.mapOptions) {
                // 底图变了，如果是cad底图，默认缩放至全图
                mapApp?.map.fitMapBounds();
            }
        }
}
</script>