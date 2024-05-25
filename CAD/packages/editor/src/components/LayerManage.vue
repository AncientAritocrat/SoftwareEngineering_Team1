<template>
    <div class="listPanel">
        <div class="header">
            <div>全部图层</div>
            <n-switch v-model:value="allLayerOff" @update:value="doSwitchAllLayer" :rail-style="railStyle"></n-switch>
        </div>
        <n-scrollbar style="max-height: 400px">
            <div v-for="item in allLayers" :key="item.index" class="layeritem">
                <div class="layer-colorBlock" :style="'background:' + item.color"></div>
                <div class="layer-text" :title="item.name">{{ item.name }}</div>
                <n-switch v-model:value="item.isOff" @update:value="doSwitchLayer" :rail-style="railStyle"></n-switch>
            </div>
        </n-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRaw } from 'vue';

const props = defineProps({
    layers: {
        type: Array,
        required: false
    }
})
const allLayerOff = ref(true);
const emit = defineEmits(['change']);
const allLayers = ref<{ index: string; color: string; name: string; isOff: boolean }[]>(props.layers as any)
const doSwitchAllLayer = () => {
    allLayers.value.forEach(e => e.isOff = allLayerOff.value);
    doSwitchLayer();
}
const doSwitchLayer = () => {
    emit("change", toRaw(allLayers.value))
}
const railStyle = ({
    focused,
    checked
}: {
    focused: boolean
    checked: boolean
}) => {
    const style: any = {}
    if (checked) {
        style.background = '#C0C0C0'
        if (focused) {
            style.boxShadow = '0 0 0 2px #808080'
        }
    } else {
        style.background = '#2A947D'
        if (focused) {
            style.boxShadow = '0 0 0 2px #183E0C'
        }
    }
    return style
}
</script>

<style scoped lang="scss">
.listPanel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid #989898;
        align-items: center;
    }

    .layeritem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 5px;
        height: 40px;
        line-height: 40px;
        align-items: center;
        border-bottom: 1px solid #989898;
        position: relative;


        .layer-colorBlock {
            border: 1px solid #989898;
            display: inline-block;
            width: 16px;
            height: 100%;
        }
    }


    .layer-text {
        flex: 1;
        text-align: left;
        margin-left: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
    }
}
</style>