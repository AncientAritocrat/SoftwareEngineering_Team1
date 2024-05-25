<template>
    <n-scrollbar :style="scrollStyle">
        <n-space vertical>
            <n-card>
                <n-form :model="model">
                    控件:
                    <n-dynamic-input v-model:value="model.controlValue" item-style="margin-bottom: 0;"
                        :on-create="onCreate" #="{ index, value }">
                        <div  class="dataitem" >
                            <div style="display: flex;">
                                <span class="dataitem" style="width:40px;">名称</span>
                                <n-select  class="dataitem" placeholder="" v-model:value="model.controlValue[index].name" :options="nameOptions" />
                            </div>
                            <div style="display: flex;">
                                <span  class="dataitem"  style="width:40px;">位置</span>
                                <n-select  class="dataitem"  placeholder="" v-model:value="model.controlValue[index].position" :options="positionOptions" />
                            </div>
                            <div style="display: flex;">
                                <span  class="dataitem"  style="width:40px;">选项</span>
                                <n-tooltip :style="{ maxWidth: '800px' }" trigger="hover">
                                    <template #trigger>
                                        <n-input v-model:value="model.controlValue[index].options"
                                            placeholder="选项json格式" @keydown.enter.prevent class="dataitem"
                                            clearable />
                                    </template>
                                    {{ model.controlValue[index].options }}
                                </n-tooltip>
                            </div>
                        </div>
                    </n-dynamic-input>
                </n-form>
            </n-card>
        </n-space>
    </n-scrollbar>
</template>

<script setup lang="ts">
import type { editorContext } from "@/types";
import { useDebounceFn, useResizeObserver } from '@vueuse/core';
import { inject, onUnmounted, reactive, ref, toRaw, watch } from "vue";

const { mapApp } = inject<editorContext>('editorContext') as editorContext;
const scrollStyle = reactive({ maxHeight: '500px' });
useResizeObserver(document.body, (entries) => {
    scrollStyle.maxHeight = (entries[0].contentRect.height - 90) + 'px';
});
let controlValue = mapApp.config.controls || [];
if (controlValue.length == 0) {
    controlValue.push({
        name: "",
        position: "",
        options: ""
   });
}
const model = ref({
    controlValue: controlValue
})
const nameOptions: any = ref([{
    label: "导航条",
    value: "NavigationControl"
}, {
    label: "鼠标位置",
    value: "MousePositionControl"
}, {
    label: "比例尺",
    value: "ScaleControl"
}, {
    label: "全屏",
    value: "FullscreenControl"
}, {
    label: "小地图",
    value: "MiniMapControl"
}, {
    label: "绘图",
    value: "DrawTool"
}, {
    label: "自定义",
    value: "Custom"
}])
const positionOptions: any = ref([{
    label: "左上",
    value: "top-left"
}, {
    label: "左下",
    value: "bottom-left"
}, {
    label: "右上",
    value: "top-right"
},{
    label: "右下",
    value: "bottom-right"
}])

const onCreate = () => {
    return {
        name: '',
        position: '',
        options: ""
    }
}
watch(
    () => model,
    () => {
        onChange()
    },
    { deep: true}
)

const onChange = useDebounceFn(() => {
    let controls = toRaw(model.value.controlValue);
    mapApp.config.controls = controls.filter(c => c.name && c.position)
    mapApp.addControls();
}, 500);
</script>

<style scoped>
.dataitem {
    margin-top: 8px;
}
</style>