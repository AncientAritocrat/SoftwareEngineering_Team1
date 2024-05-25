<template>
    <n-space justify="space-between">
        <n-space :size="25">
            <n-tooltip v-for="item in leftButtons" :key="item.id">
                <template #trigger>
                    <n-button size="small" ghost :type="item.type ?? 'primary'" @click="item.click">
                        <template #icon>
                            <n-icon>
                                <component :is="item.icon" :color="item.color ?? '#51d6a9'"></component>
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                {{ item.tooltip ?? '' }}
            </n-tooltip>
        </n-space>
        <n-space justify="center" :size="25">
            <n-tooltip v-for="item in middleButtons" :key="item.id">
                <template #trigger>
                    <n-button  v-if="item.icon" size="small" ghost :type="item.type ?? 'primary'" @click="item.click">
                        <template #icon>
                            <n-icon>
                                <component :is="item.icon" :color="item.color ?? '#51d6a9'"></component>
                            </n-icon>
                        </template>
                    </n-button>
                    <n-button  v-else size="small" ghost :type="item.type ?? 'primary'" @click="item.click">
                        {{ item.title }}
                    </n-button>
                </template>
                {{ item.tooltip ?? '' }}
            </n-tooltip>
        </n-space>
        <n-space justify="end" :size="25">
            <n-tooltip v-for="item in rightButtons" :key="item.id">
                <template #trigger>
                    <n-button size="small" ghost :type="item.type ?? 'primary'" @click="item.click">
                        <template #icon>
                            <n-icon>
                                <component :is="item.icon" :color="item.color ?? '#51d6a9'"></component>
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                {{ item.tooltip ?? '' }}
            </n-tooltip>
        </n-space>
    </n-space>
</template>

<script setup lang="ts">
import type { ButtonIconItem, editorContext } from '@/types';
import { Home, Code, ServerOutline, Scan, CloudUploadOutline, Navigate, Refresh } from '@vicons/ionicons5'
import { inject, reactive, shallowRef } from 'vue';
import MapConfigJson from '../map/MapConfigJson.vue';
import Storage, { IndexDbStorage } from '@/lib/storage'
import { getFormInput } from '@/lib/ui/form'
import router from '@/router';
import { APP_VISUAL_KEY } from '@/stores/app';
import vjmap from 'vjmap';
import { exportProject } from '@/lib/export';
const { uiApp, mapApp } = inject<editorContext>('editorContext') as editorContext;
const leftButtons = reactive<ButtonIconItem[]>([]);
const middleButtons = reactive<ButtonIconItem[]>([]);
const rightButtons = reactive<ButtonIconItem[]>([]);
leftButtons.push({
    id: 'home',
    icon: shallowRef(Home),
    tooltip: '回到首页',
    click: () => {
        router.push("/");
    }
});

middleButtons.push({
    id: 'zoomToExtent',
    icon: shallowRef(Scan),
    tooltip: '缩放至全图',
    click: () => {
        mapApp?.map.fitMapBounds();
    }
},{
    id: 'zoomToExtent',
    icon: shallowRef(Refresh),
    tooltip: '刷新',
    click: async () => {
        await mapApp.setConfig();
        mapApp.map?.resize();
    }
}, {
    id: 'preview',
    icon: shallowRef(Navigate),
    tooltip: '预览',
    click: async () => {
        let mapConfig = mapApp.getConfig();
        // 保存成临时的记录
        const key = "tmp_preview";
        const data = {
            key: key,
            title: mapConfig.title ?? '',
            mapid: mapConfig.mapOpenOptions?.mapid,
            version: mapConfig.mapOpenOptions?.version,
            thumbnail: mapConfig?.thumbnail,
            config: IndexDbStorage.toConfigStr(mapConfig)
        }
        await Storage.upsert(data);
        const url = router.resolve({
            path: `/preview`,
        });
        // 打开新窗口
        window.open(`${url.href}?key=${key}&isLocal=true`);
    }
},{
    id: 'exportHtml',
    title: "html",
    tooltip: '导出为html+js项目源码, 下载后直接双击index.html即可运行',
    click: async () => {
        await exportProject("download/html.zip", "config.js", "program.js", mapApp.config);
    }
},{
    id: 'exportVue3',
    title: "vue3",
    tooltip: '导出为vue3项目源码',
    click: async () => {
        await exportProject("download/vue3.zip", "packages/vue3/src/data/config.ts", "packages/vue3/src/lib/program.ts", mapApp.config);
    }
},{
    id: 'exportVue2',
    title: "vue2",
    tooltip: '导出为vue2项目源码',
    click: async () => {
        await exportProject("download/vue2.zip", "packages/vue2/src/data/config.js", "packages/vue2/src/lib/program.js", mapApp.config);
    }
},{
    id: 'exportReact',
    title: "react",
    tooltip: '导出为react项目源码',
    click: async () => {
        await exportProject("download/react.zip", "packages/react/src/data/config.ts", "packages/react/src/lib/program.ts", mapApp.config);
    }
});


rightButtons.push({
    id: 'mapConfig',
    icon: shallowRef(Code),
    tooltip: '地图配置',
    click: async () => {
        let res = await uiApp.showModalAsync("mapconfig", '地图配置', {
            component: MapConfigJson,
            props: {
                width: '800px',
                height: '600px'
            }
        })
        if (res.isOk) {
            mapApp.setConfig(res.result);
        }
    }
});

rightButtons.push({
    id: 'saveMapCfgToIndexDb',
    icon: shallowRef(ServerOutline),
    tooltip: '保存到本地缓存',
    click: async () => {
        saveData(true)
    }
});

rightButtons.push({
    id: 'saveMapCfgToCloudServer',
    icon: shallowRef(CloudUploadOutline),
    tooltip: '保存数据至服务端',
    click: async () => {
        saveData(false)
    }
});

const saveData = async (isLocal?: boolean) => {
    try {
        let mapConfig = mapApp.getConfig();
        if (!mapConfig.title) {
            // 如果还没有名
            let res = await getFormInput(uiApp, '请输入要保存的名称', {
                rule: [{
                    type: 'input',
                    field: 'title',
                    title: '名称',
                    value: '',
                    props: {
                        placeholder: '输入项目名称',
                    }
                }]
            }, null, '300px', '200px');
            if (!res.isOk) {
                return;
            }
            mapConfig.title = res.result.title;
        }
        mapApp.projectKey = mapApp.projectKey || IndexDbStorage.guid();
        const data = {
            key: mapApp.projectKey,
            title: mapConfig.title ?? '',
            mapid: mapConfig.mapOpenOptions?.mapid,
            version: mapConfig.mapOpenOptions?.version,
            thumbnail: mapConfig?.thumbnail,
            config: IndexDbStorage.toConfigStr(mapConfig)
        }
        if (isLocal) {
            await Storage.upsert(data);
            window.$message.success('保存到本地缓存成功！');
        } else {
            let keyInfo = APP_VISUAL_KEY + data.key;
            // 保存至服务端时，如果图有密码保护的，不应该把secretKey保存进去
            let config = vjmap.cloneDeep(mapConfig);
            if (config?.mapOpenOptions?.secretKey) {
                delete config?.mapOpenOptions?.secretKey;
                // @ts-ignore
                delete config?.mapOpenOptions?.tryPasswordCount;
            }
            // 数据和属性分开保存，这样全部获取时只先要获取属性，加载少
            await mapApp.map.getService().saveCustomData(keyInfo, config, {
                key: data.key,
                title: mapConfig.title ?? '',
                mapid: mapConfig.mapOpenOptions?.mapid,
                version: mapConfig.mapOpenOptions?.version,
                thumbnail: mapConfig?.thumbnail,
                workspace: mapConfig?.workspace,
                updatetime: new Date().getTime() + "",
            });
            window.$message.success('成功保存数据至服务端！');
        }
    } catch (err: any) {
        window.$message.error(JSON.stringify(err));
    }
}
</script>

<style lang="scss" scoped>

</style>
