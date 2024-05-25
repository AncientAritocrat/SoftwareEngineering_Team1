<template>
    <MapComp v-bind="props || {}"></MapComp>
</template>
<script setup lang="ts">
import MapComp from '@/components/MapComp.vue';
import DrawUI from '@/views/editor/sidebar/panels/sources/dialogs/DrawUI/index.vue'
import { onBeforeMount, provide, ref, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
provide("editorContext", {});
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
const serviceUrl = ref();
const accessToken = ref();
const backgroundColor = ref();
onBeforeMount(() => {
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
     if (route.query?.serviceUrl) serviceUrl.value = route.query.serviceUrl;
     if (route.query?.accessToken) accessToken.value = route.query.accessToken;
     if (route.query?.backgroundColor) backgroundColor.value = route.query.backgroundColor;
});
const props = ref({
    mapOpenOptions: openMapParam,
    mapOptions: {
        center: [0, 0],
        zoom: 1,
        bearing: 0,
        pitch: 0
    },
    isLoadImages: false,
    ui: {
        comp: shallowRef(DrawUI),
        value: {
        }
    },
    cfg: {
        serviceUrl: serviceUrl,
        serviceToken: accessToken,
        backgroundColor: backgroundColor
    }
});
</script>