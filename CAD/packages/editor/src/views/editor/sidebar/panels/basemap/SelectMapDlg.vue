<template>
    <n-space vertical class="container">
        <n-radio-group v-model:value="baseMapType" size="small">
            <n-radio-button key="CAD" value="CAD" label="CAD为底图" v-show="!hideCad"/>
            <n-radio-button key="WEB" value="WEB" label="互联网为底图" v-show="!hideWeb"/>
        </n-radio-group>
        <div v-if="baseMapType == 'CAD'" v-show="!hideCad">
            <n-space>
                <n-pagination v-model:page="page" v-model:page-size="pageSize"
                    :page-count="Math.floor(mapCards.length / pageSize)" show-size-picker
                    :page-sizes="[6, 12, 30, 60]" />
                <n-input-group>
                    <n-input :style="{ width: '50%' }" v-model:value="seachKey" placeholder="输入要搜索的图id" />
                    <n-button type="primary" ghost>
                        搜索
                    </n-button>
                </n-input-group>
            </n-space>

            <n-scrollbar style="max-height: 450px" trigger="none">
                <n-space>
                    <n-card :style="{ width: '260px', height: '220px' }" v-for="item in curPageMapCards"
                        :key="item.mapId">
                        <n-image class="img" preview-disabled width="180" height="180" :src="item.curImgUrl"
                            :fallback-src="emptyImage"/>
                        <div class="cardbar">
                            <n-dropdown trigger="hover"
                                :options="item.versions.map((e: any) => { return { label: e.version, key: e.version } })"
                                @select="(ver: string) => item.setVersion(ver)">
                                <n-button size="small" class="version">{{ item.curVersion }}</n-button>
                            </n-dropdown>
                            <n-radio-group v-model:value="item.curMapOpenway" size="small">
                                <n-radio-button key="内存" value="内存" label="内存" />
                                <n-radio-button key="栅格" value="栅格" label="栅格" />
                                <n-radio-button key="矢量" value="矢量" label="矢量" />
                            </n-radio-group>
                        </div>

                        <div class="cardName">
                            <div>
                                <n-ellipsis style="max-width: 200px">
                                    图名称: {{ item.mapId }}
                                </n-ellipsis>
                            </div>
                            <div>
                                <n-ellipsis style="max-width: 200px">
                                    文件名: {{ item.curUploadname }}
                                </n-ellipsis>
                            </div>
                            <div class="selectButton">
                                <n-button ghost color="#ff69b4" @click="() => selectMapItem(item)">
                                    选中
                                </n-button>
                            </div>
                            <div v-if="item.passwordProtection" class="imglock">
                                <LockClosed color="#00ffff17" />
                            </div>
                        </div>

                    </n-card>
                </n-space>
            </n-scrollbar>
        </div>
        <div v-else>
            <n-space vertical v-show="!hideWeb">
                <n-radio-group v-model:value="webMapType" size="small">
                    <n-radio key="WGS84" value="WGS84" label="WGS84坐标为底图(默认为天地图)" />
                    <n-radio key="GCJ02" value="GCJ02" label="GCJ02坐标为底图(默认为高德地图)" />
                </n-radio-group>
                地图URL地址:
                <n-dynamic-input v-if="webMapType == 'WGS84'" v-model:value="webWgs84Tiles" placeholder=""
                    show-sort-button :min="0" :max="10" />
                <n-dynamic-input v-if="webMapType == 'GCJ02'" v-model:value="webGcj02Tiles" show-sort-button
                    placeholder="" :min="0" :max="10" />
                <n-space justify="space-between">
                    <n-space>
                        <n-button type="info" @click="setRoadwayUrl()">
                            路网地址
                        </n-button>
                        <n-button type="info" @click="setImageUrl()">
                            影像地址
                        </n-button>
                    </n-space>
                    <n-button type="primary" @click="selectMapItem({})">
                        确定
                    </n-button>
                </n-space>

            </n-space>
        </div>
    </n-space>
</template>

<script setup lang="ts">
import type { editorContext } from '@/types';
import { LockClosed } from '@vicons/ionicons5'
import vjmap from 'vjmap';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import {MapApp, gaodeProviderTiles, tiandituProviderTiles } from '@vjmap/common';
const props = defineProps({
    hideCad: {
        type: Boolean,
        required: false,
        default: false
    },
    hideWeb: {
        type: Boolean,
        required: false,
        default: false
    }
});
let { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
if (!mapApp) {
    mapApp = inject<MapApp>('interactiveMap') as MapApp;
}
let ui = inject<any>('interactiveUI');
if (ui) {
    // 不是panel页面，是wms sourcepanel
    uiApp = ui;
}
const emit = defineEmits(["onClose"]);
const page = ref(1);
const pageSize = ref(12);
const mapCards = ref<any>([]);
const mapInfos = reactive<any>({});
const seachKey = ref("");
const baseMapType = ref(mapApp?.isWebBaseMap() ? "WEB" : "CAD");
const webMapType = ref(mapApp?.config.baseMapType == "GCJ02" ? "GCJ02" : "WGS84");
const webWgs84Tiles = ref<string[]>(mapApp?.config.baseMapType == "GCJ02" ? [] : (mapApp?.config.webMapTiles ?? []));
const webGcj02Tiles = ref<string[]>(mapApp?.config.baseMapType == "GCJ02" ? (mapApp?.config.webMapTiles ?? []) : []);
const emptyImage = ref('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADHUlEQVR4nO3UMQEAIAzAMMC/5yFjRxMFvXpn5gBNbzsA2GMAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEPYB58oE/VhFU1IAAAAASUVORK5CYII=');
if (props.hideCad && baseMapType.value == "CAD") {
    baseMapType.value = "WEB";
}
if (props.hideWeb && baseMapType.value == "WEB") {
    baseMapType.value = "CAD";
}
interface PropOptions {
    sortType?: String
    sortOrder?: String
    searchKey?: String
}
const listMap = (opts?: PropOptions) => {
    let cards = [];
    let infos = mapInfos.value;
    let svc = mapApp.svc;
    for (let m in infos) {
        let item: any = {};
        item.mapId = m;

        // 搜索
        if (opts?.searchKey) {
            if (item.mapId.indexOf(opts.searchKey) < 0) continue;
        }
        item.versions = infos[m].sort((a: any, b: any) => {
            let av = +a.version.substring(1); // 把版本前端的v去了，然后转为数字
            let bv = +b.version.substring(1);
            return bv - av;
        }); // 根据版本号排序，把最新的版本放前面
        let maxVersion = item.versions[0];

        item.setVersion = function (ver: string) {
            let findVer = this.versions.find((v: any) => v.version == ver);
            this.curVersion = findVer.version; // 版本号
            this.curGeom = findVer.geom; // 几何渲染打开
            this.curStatus = findVer.status; // 状态 working(正在处理),  finish(处理完成), error(处理错误)
            this.curImgUrl = svc.thumbnailUrl(this.mapId, this.curVersion == "_" ? maxVersion.version : this.curVersion, 200, 200) + "&darkTheme=true"; // 图片地址
            this.curUploadname = findVer.uploadname; // 上传文件名
            this.curMtime = findVer.mtime; // 最近修改时间
            this.curErrMsg = findVer.errmsg // 如有错误，错误内容
            this.key = item.mapId + "_" + item.curVersion;
            this.mapdependencies = findVer.mapdependencies;//地图依赖
            this.passwordProtection = findVer.passwordProtection === true ? true : false; // 是否有密码保护

            this.curMapOpenway = this.curGeom ? '栅格' : '内存'; //  打开方式
        }
        item.setVersion(maxVersion.version); // 把最新的版本做为当前版本

        // 如果是协同图形，还需要加一个自动更新的最新版本，这样打开的时候，如果依赖的有变化，就会自动更新至最新版本
        if (item.mapdependencies) {
            let updateMaxVer = { ...maxVersion, version: "_" };// 版本号改了就可以，改成_，表示用自动更新至最新版本，其他数据和当前最新版本的数据一样
            item.versions = [updateMaxVer, ...item.versions]; //放到最前面
            item.setVersion(updateMaxVer.version); // 把自动更新的最新版本做为当前版本
        }

        // 打开地图的地址
        item.url = function () {
            let mapopenway = vjmap.MapOpenWay.GeomRender;
            let isVector = false;
            if (this.curMapOpenway == '内存') {
                mapopenway = vjmap.MapOpenWay.Memory;
            } else if (this.curMapOpenway == '矢量') {
                isVector = true;
            }
            let workspace = "";
            if (mapApp.config.workspace) {
                workspace = `&workspace=${mapApp.config.workspace}`
            }
            return `/map/${this.mapId}?version=${this.curVersion}&mapopenway=${mapopenway}&vector=${isVector}${workspace}`
        }

        cards.push(item);
    }

    // 排序
    if (opts?.sortType == "更新时间") {
        cards.sort((a, b) => {
            if (a.curMtime < b.curMtime) {
                return 1;
            }
            if (a.curMtime > b.curMtime) {
                return -1;
            }
            return 0;
        });
    } else if (opts?.sortType == "文件名称") {
        cards.sort((a, b) => {
            if (a.mapId < b.mapId) {
                return -1;
            }
            if (a.mapId > b.mapId) {
                return 1;
            }
            return 0;
        });
    }
    if (opts?.sortOrder == "倒序") {
        mapCards.value = cards.reverse();
    } else {
        mapCards.value = cards;
    }
}

const getMapInfos = async () => {
    try {
        let svc = mapApp.svc;
        // 切换至指定工作区
        if (mapApp.config?.workspace) svc.switchWorkspace(mapApp.config?.workspace);
        if (svc.serverUrl) {
            mapInfos.value = await svc.listMaps("", "*");
        }
    } catch (error) {
        console.error(error)
    }
}


const curPageMapCards = computed(() => {
    let offset = (page.value - 1) * pageSize.value;
    return (offset + pageSize.value >= mapCards.value.length) ? mapCards.value.slice(offset, mapCards.value.length) : mapCards.value.slice(offset, offset + pageSize.value);
});

onMounted(async () => {
    await getMapInfos();
    listMap({
        sortType: '更新时间'
    });
});

watch(seachKey, () => {
    listMap({
        sortType: '更新时间',
        searchKey: seachKey.value
    });
})


watch(webMapType, () => {
    if (webMapType.value == "WGS84") {
        if (webWgs84Tiles.value.length == 0) {
            webWgs84Tiles.value = tiandituProviderTiles();
        }
    } else if (webMapType.value == "GCJ02") {
        if (webGcj02Tiles.value.length == 0) {
            webGcj02Tiles.value = gaodeProviderTiles();
        }
    }
}, { immediate: true })

const setRoadwayUrl = () => {
    if (webMapType.value == "WGS84") {
        webWgs84Tiles.value = tiandituProviderTiles();
    } else if (webMapType.value == "GCJ02") {
        webGcj02Tiles.value = gaodeProviderTiles();
    }
}

const setImageUrl = () => {
    if (webMapType.value == "WGS84") {
        webWgs84Tiles.value = tiandituProviderTiles(true);
    } else if (webMapType.value == "GCJ02") {
        webGcj02Tiles.value = gaodeProviderTiles(true);
    }
}

const selectMapItem = (item: any) => {
    let basemap = baseMapType.value;
    let tiles: string[] = [];
    if (basemap == "WEB") {
        basemap = webMapType.value;
        if (basemap == "WGS84") {
            tiles = webWgs84Tiles.value
        } else if (basemap == "GCJ02") {
            tiles = webGcj02Tiles.value;
        }
    } else {
        basemap = "";
    }
    emit("onClose", true, {
        mapid: item.mapId,
        version: item.curVersion,
        mapopenway: item.curMapOpenway == "内存" ? 'Memory' : 'GeomRender',
        isVectorStyle: item.curMapOpenway == "矢量",
        baseMapType: basemap,
        webMapTiles: tiles
    });
    uiApp?.closeModal();
}

</script>

<style lang='scss' scoped>
.container {
    height: 530px;

    .card {
        width: 100%;
        height: 100%;

        .img {
            width: 200px;
            height: 200px;
        }
    }
}

.cardbar {
    margin-top: -25px;
    display: flex;
    justify-content: space-around;
}

.cardName {
    margin-top: -210px;
}

.version {
    margin-left: -10px;
}

.selectButton {
    margin-top: 40px;
    margin-left: 170px;
}

.imglock {
    width: 100px;
    margin-left: 50px;
    margin-top: -60px;
}
</style>