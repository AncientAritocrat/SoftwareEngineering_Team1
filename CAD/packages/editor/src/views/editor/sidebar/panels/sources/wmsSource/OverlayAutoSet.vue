<template>
    <n-card class="card">
        输入CAD图EPSG
        <n-input-number v-model:value="param.crs" :on-blur="onChange" placeholder="" :show-button="false">
          <template #prefix>
            EPSG:
            </template>
        </n-input-number>
        选择CAD图EPSG
        <n-cascader v-if="!(param.coordxPrefix >= 10 && param.coordxPrefix < 100)"
        placeholder=""
        :expand-trigger="'click'"
        :options="epsgOptions"
        :check-strategy="'child'"
        :show-path="false"
        @update:value="handleUpdateValue"
        />
        <n-select v-else :options="selectOptions" :on-update:value="onUpdateSelect" placeholder="" />
        <a :href="getHref()"  target="_blank" style="color: aquamarine;">
                根据CAD坐标或经纬度获取EPSG
        </a><br/>
        CAD图X坐标偏移
        <n-input-number v-model:value="param.fourParameterX" :on-blur="onChange"  placeholder="" :show-button="false">
        </n-input-number>

        CAD图Y坐标偏移
        <n-input-number v-model:value="param.fourParameterY" :on-blur="onChange"  placeholder="" :show-button="false">
        </n-input-number>

        <n-button type="info" quaternary v-if="baseMapIsWeb" @click="emit('posToCad')">定位至CAD图位置</n-button>
    </n-card>
</template>

<script setup lang="ts">
import { ref, toRaw } from "vue";
import { useDebounceFn } from '@vueuse/core';
import vjmap from "vjmap";
import { getEpsgRange } from "~/map/wms";
const emit = defineEmits(['updateValue', 'posToCad']);
const props = defineProps({
  value: {
    type: Object,
    required: false,
    default: ()=>{}
  },
  baseMapIsWeb: {
    type: Boolean,
    required: false,
    default: false
  }
})
const param = ref(props.value ?? {});
if (param.value.crs && typeof(param.value.crs) == "string") {
    param.value.crs = +param.value.crs.replace("EPSG:", "")
}
const getEpsgChild = (type: string)=>  {
    let epsgs = getEpsgRange(type as any)
    let result = [];
    for(let epsg of epsgs) {
        result.push({
            value: epsg,
            label: epsg
        })
    }
    return result
}
const epsgOptions = ref([{
    value: `北京54三度带坐标系`,
    label: `北京54三度带坐标系`,
    children: getEpsgChild("BEIJING54_3")
},{
    value: `北京54六度带坐标系`,
    label: `北京54六度带坐标系`,
    children: getEpsgChild("BEIJING54_6")
},{
    value: `西安80三度带坐标系`,
    label: `西安80三度带坐标系`,
    children: getEpsgChild("XIAN80_3")
},{
    value: `西安80六度带坐标系`,
    label: `西安80六度带坐标系`,
    children: getEpsgChild("XIAN80_6")
},{
    value: `CGCS2000三度带坐标系`,
    label: `CGCS2000三度带坐标系`,
    children: getEpsgChild("CGCS2000_3")
},{
    value: `CGCS2000六度带坐标系`,
    label: `CGCS2000六度带坐标系`,
    children: getEpsgChild("CGCS2000_6")
}])

const selectOptions = ref([{
        label: '北京54',
        value: '北京54'
    },{
        label: '西安80',
        value: '西安80'
    },{
        label: 'CGCS2000',
        value: 'CGCS2000'
    }]);

const handleUpdateValue = (val: string)=>{
    param.value.crs = +val.replace("EPSG:", "")
    onChange();
}

const onUpdateSelect = (val: string) => {
    let crs;
    if (val == 'CGCS2000') {
        crs = vjmap.transform.getEpsgParam(vjmap.transform.EpsgCrsTypes.CGCS2000, props.value.coordxPrefix)?.epsg;
    } else if (val == '西安80') {
        crs = vjmap.transform.getEpsgParam(vjmap.transform.EpsgCrsTypes.Xian80, props.value.coordxPrefix)?.epsg;
    } else if (val == '北京54') {
        crs = vjmap.transform.getEpsgParam(vjmap.transform.EpsgCrsTypes.Beijing54, props.value.coordxPrefix)?.epsg;
    }
    if (crs) {
        param.value.crs = +crs.replace("EPSG:", "")
        onChange();
    }
}

const onChange = useDebounceFn(() => {
    let res = toRaw(param.value);
    emit("updateValue", res)
}, 200);

const getHref = () => {
   let href = window.location.origin + window.location.pathname;
   if (href.indexOf("visual") >= 0) {
      href = href.replace("app/visual", "demo");
      href = href.replace("visual", "demo");
   } else {
      href = "https://vjmap.com/demo/";
   }
   href += "#/demo/map/web/03webzgetepsg"
   return href;
}

</script>

<style scoped>
.card {
    position: absolute;
    width: 200px;
    height: 300px;
}
</style>