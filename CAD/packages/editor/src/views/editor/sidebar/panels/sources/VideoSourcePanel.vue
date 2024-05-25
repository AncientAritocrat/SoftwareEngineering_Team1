<template>
     <n-space vertical>
        视频URL地址:
        <n-dynamic-input v-model:value="urls" placeholder="请输入mp4或webm格式的视频地址"
            show-sort-button :min="1" :max="10" />
        视频范围:
        <n-input v-model:value="coordinates" placeholder="必填项。[左上角，右上角，右下角，左下角] 图像四个点坐标">
            <template #suffix>
                <n-button @click="pickCoordinates">拾取视频范围</n-button>
            </template>
        </n-input>
    </n-space>
</template>

<script setup lang="ts">
import type { editorContext } from "@/types";
import { inject, reactive, ref, toRaw } from "vue";
import { pickMapImageCoordinates } from "@/lib/map/pick";
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;

const props = defineProps({
    data: {
        type: Object,
        required: false,
        default: () => {
            return {
            }
        }
    }
});
const urls = ref(props.data.urls ?? ['']);
const coordinates = ref(props.data.coordinates ? JSON.stringify(props.data.coordinates, null, 0) : '');
const getVideoUrls = () => urls.value.filter((u: any) => !!u)
const pickCoordinates = async () => {
    let videoUrls = getVideoUrls();
    if (videoUrls.length == 0) {
        window.$message.error("请先输入视频地址")
        return;
    }
    let res = await pickMapImageCoordinates(mapApp, uiApp, "video_pickImageCoordinates", "请在地图上拖动标注的四个点做为视频的范围", 
    "video", toRaw(videoUrls), toRaw(coordinates.value));
    if (res) {
        coordinates.value = res;
    }
}

const getResult = () => {
    let data: any = {};
    if (coordinates.value) {
        data.coordinates = JSON.parse(coordinates.value);
    } else {
        window.$message.error('没有输入图片坐标范围')
        return {};
    }
    let videoUrls = getVideoUrls();
    if (videoUrls.length == 0) {
        window.$message.error('没有输入图片地址')
        return {};
    } else {
        data.urls = videoUrls;
    }
    return {
        data: toRaw(data)
    }
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
    getResult
})
</script>