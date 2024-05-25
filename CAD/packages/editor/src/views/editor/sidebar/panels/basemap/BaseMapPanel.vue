<template>
    <n-tabs type="line" animated class="tabs">
        <n-tab-pane name="mapOpen" tab="底图设置">
            <MapOpenTab></MapOpenTab>
        </n-tab-pane>
        <n-tab-pane name="mapStyle" tab="地图样式">
            <MapStyleTab></MapStyleTab>
        </n-tab-pane>
        <n-tab-pane name="mapOption" tab="地图选项">
            <MapOptionTab></MapOptionTab>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import MapOpenTab from './MapOpenTab.vue';
import MapOptionTab from './MapOptionTab.vue';
import MapStyleTab from './MapStyleTab.vue';
</script>

<style lang="scss" scoped>
.tabs {
    padding: 3px;
}
</style>