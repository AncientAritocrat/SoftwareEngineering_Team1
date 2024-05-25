<template>
    <n-space vertical class="container">
        <n-space justify="space-between">
            <n-space>
                <n-pagination v-model:page="page" v-model:page-size="pageSize" :page-count="pageCount" show-size-picker
                    :page-sizes="[12, 24, 48, 96]" />
                <n-input-group>
                    <n-input :style="{ width: '50%' }" v-model:value="seachKey" placeholder="输入要搜索的图id" size="small" />
                    <n-button type="primary" ghost size="small">
                        搜索
                    </n-button>
                </n-input-group>

                <n-radio-group v-model:value="sortType" size="small">
                    <n-radio-button value="更新时间" label="更新时间" />
                    <n-radio-button value="项目名称" label="项目名称" />
                    <n-radio-button value="图ID" label="图ID" />
                </n-radio-group>

                <n-radio-group v-model:value="sortOrder" size="small">
                    <n-radio-button value="正序" label="正序" />
                    <n-radio-button value="倒序" label="倒序" />
                </n-radio-group>

                <n-radio-group v-model:value="dataType" size="small">
                    <n-radio-button value="所有数据" label="所有数据" />
                    <n-radio-button value="服务端" label="服务端" />
                    <n-radio-button value="本地" label="本地" />
                </n-radio-group>

            </n-space>
            <n-space>
                <n-button type="info" round size="medium" @click="createNew">
                    新建项目
                </n-button>
            </n-space>
        </n-space>
        <n-scrollbar :style="scrollStyle" trigger="none">
            <n-space>
                <n-card size="small" v-for="card in curPageProjectCards" :key="card.id" class="card">
                    <n-image class="img" preview-disabled width="200" height="200" object-fit="fill"
                        :src="card.thumbnail || requireUrl('projectThumbnail.png')" :fallback-src="emptyImage"
                        @click="editHandle(card, !card.isServerData)" />
                    <template #action>
                        <n-space vertical>
                            <n-space justify="space-between">
                                <n-ellipsis style="max-width: 150px; width:150px">
                                    {{ card.title }}
                                </n-ellipsis>
                                <template v-for="item in fnBtnList" :key="item.key">
                                    <template v-if="item.key === 'select'">
                                        <n-dropdown trigger="hover" placement="bottom" :options="selectOptions"
                                            :show-arrow="true" @select="(key: any) => handleSelect(card, key)">
                                            <n-button size="small">
                                                <template #icon>
                                                    <component :is="item.icon"></component>
                                                </template>
                                            </n-button>
                                        </n-dropdown>
                                    </template>

                                    <n-tooltip v-else placement="bottom" trigger="hover">
                                        <template #trigger>
                                            <n-button size="small" @click="handleSelect(card, item.key)">
                                                <template #icon>
                                                    <component :is="item.icon"></component>
                                                </template>
                                            </n-button>
                                        </template>
                                        {{ item.label }}
                                    </n-tooltip>
                                </template>
                            </n-space>

                            <n-space justify="space-between">
                                <n-tooltip v-if="!!card.server" placement="bottom" trigger="hover">
                                    <template #trigger>
                                        <n-button size="small" :type="card.isServerData ? 'success' : 'tertiary'" secondary
                                            @click="editHandle(card, false)">
                                            服务端数据
                                        </n-button>
                                    </template>
                                    打开编辑服务端数据
                                </n-tooltip>
                                <div v-else></div>

                                <n-tooltip v-if="!!card.local" placement="bottom" trigger="hover">
                                    <template #trigger>
                                        <n-button size="small" :type="!card.isServerData ? 'success' : 'tertiary'" secondary
                                            @click="editHandle(card, true)">
                                            本地数据
                                        </n-button>
                                    </template>
                                    打开编辑本地数据
                                </n-tooltip>
                                <div v-else></div>

                            </n-space>
                        </n-space>

                    </template>
                </n-card>
            </n-space>
        </n-scrollbar>
    </n-space>
    <n-modal v-model:show="showModifyProjectIdModel" preset="dialog" title="修改项目ID" positive-text="确认" negative-text="算了"
        @positive-click="onModifyIdOk">
        <n-space vertical>
            项目ID<n-input v-model:value="selectCard.key" type="text" placeholder="" />
        </n-space>
    </n-modal>
</template>

<script setup lang="ts">
import Storage from '@/lib/storage'
import { h, computed, onMounted, reactive, ref, shallowRef, watch, type Component, toRaw } from 'vue';
import { EllipsisHorizontalCircleSharp, BrowsersOutline, Copy, Pencil, Trash } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui';
import { useRouter } from 'vue-router';
import { MapApp } from '~/MapApp';
import { APP_VISUAL_KEY, useAppStore } from "@/stores/app";
import { Service } from 'vjmap';
import { useResizeObserver } from '@vueuse/core';
import { getFormInput } from '@/lib/ui/form';
const app = useAppStore();
const page = ref(1);
const pageSize = ref(app.projectPageSize || 24);
const projectCards = ref<any>([]);
const projectInfos = reactive<any>({});
const seachKey = ref("");
const router = useRouter();
const pageCount = computed(() => Math.ceil(projectCards.value.length / pageSize.value));
const sortOrder = ref(app.projectSortOrder || "正序");
const sortType = ref(app.projectSortType || "更新时间");
const dataType = ref(app.projectDataType || "所有数据");
const scrollStyle = { maxHeight: (document.body.clientHeight - 95) + 'px' }
const showModifyProjectIdModel = ref(false);
const selectCard = ref({
    key: "",
    oldKey: ""
});
// 处理url获取
const requireUrl = (name: string) => {
    return new URL(`../../assets/images/${name}`, import.meta.url).href
}
useResizeObserver(document.body, (entries) => {
    scrollStyle.maxHeight = (entries[0].contentRect.height - 95) + 'px';
})
const renderIcon = (icon: Component) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}
const emptyImage = ref('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADHUlEQVR4nO3UMQEAIAzAMMC/5yFjRxMFvXpn5gBNbzsA2GMAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEGYAEPYB58oE/VhFU1IAAAAASUVORK5CYII=');
interface PropOptions {
    sortType?: String
    sortOrder?: String
    searchKey?: String
}
const listProjects = () => {
    let cards = [];
    let opts: PropOptions = {
        sortType: sortType.value,
        sortOrder: sortOrder.value,
        searchKey: seachKey.value
    }
    let infos = projectInfos.value;


    for (let m of infos) {
        if (seachKey.value) {
            if (m.key.indexOf(seachKey.value) == -1 &&
                m.mapid.indexOf(seachKey.value) == -1 &&
                m.title.indexOf(seachKey.value) == -1) {
                continue;
            }
        }
        cards.push({ ...m });
    }
    if (dataType.value == "服务端") {
        cards = cards.filter((p: any) => p.server);
        cards = cards.map(c => {
            return {
                ...c,
                ...c.server,
                isServerData: true,
            }
        })
    } else if (dataType.value == "本地") {
        cards = cards.filter((p: any) => p.local)
        cards = cards.map(c => {
            return {
                ...c,
                ...c.local,
                isServerData: false,
            }
        })
    }
    // 排序
    if (opts?.sortType == "更新时间") {
        cards.sort((a, b) => {
            if (+a.updatetime > +b.updatetime) {
                return -1;
            }
            if (+a.updatetime < +b.updatetime) {
                return 1;
            }
            return 0;
        });
    } else if (opts?.sortType == "项目名称") {
        cards.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });
    } else if (opts?.sortType == "图ID") {
        cards.sort((a, b) => {
            if (a.mapid < b.mapid) {
                return -1;
            }
            if (a.mapid > b.mapid) {
                return 1;
            }
            return 0;
        });
    }
    if (opts?.sortOrder == "倒序") {
        projectCards.value = cards.reverse();
    } else {
        projectCards.value = cards;
    }
}

const getProjectInfos = async () => {
    try {
        let localProjectInfos = await Storage.getAll(); // 本地的
        let data: any = {};
        try {
            let svc = new Service(app.serviceUrl, app.accessToken);
            let res = await svc.getCustomDataKeysByPrefix(APP_VISUAL_KEY);
            let keys = res.keys ?? [];
            if (keys.length > 0) {
                data = await svc.getCustomData(keys, { retDataType: "prop" }); // 只获取属性数据
            }
        } catch (err: any) {
            window.$message.error(err)
        }
        let serverInfo = data.props || [];
        localProjectInfos = localProjectInfos || [];
        // 过滤掉临时数据
        localProjectInfos = localProjectInfos.filter(p => p.key.indexOf("tmp_") != 0);
        let allProjects = [];
        for (let i = 0; i < localProjectInfos.length; i++) {
            const idx = serverInfo.findIndex((m: any) => m.key == localProjectInfos[i].key);
            allProjects.push({
                ...localProjectInfos[i],
                local: localProjectInfos[i],
                server: idx != -1 ? serverInfo[idx] : undefined
            })
        }
        for (let i = 0; i < serverInfo.length; i++) {
            if (allProjects.findIndex((m: any) => m.key == serverInfo[i].key) >= 0) continue; // 已存在
            allProjects.push({
                ...serverInfo[i],
                server: serverInfo[i]
            })
        }

        // 如果本地或服务端都有，则哪个更新时间新就用哪个
        for (let i = 0; i < allProjects.length; i++) {
            if (allProjects[i].server && allProjects[i].local) {
                if (+allProjects[i].server.updatetime > +allProjects[i].local.updatetime) {
                    allProjects[i] = {
                        ...allProjects[i],
                        ...allProjects[i].server,
                        isServerData: true
                    }
                } else {
                    allProjects[i] = {
                        ...allProjects[i],
                        ...allProjects[i].local,
                        isServerData: false
                    }
                }
            } else if (allProjects[i].server) {
                allProjects[i].isServerData = true;
            } else {
                allProjects[i].isServerData = false;
            }
        }

        projectInfos.value = allProjects;
    } catch (error: any) {
        window.$message.error(error)
    }
}


const curPageProjectCards = computed(() => {
    let offset = (page.value - 1) * pageSize.value;
    return (offset + pageSize.value >= projectCards.value.length) ? projectCards.value.slice(offset, projectCards.value.length) : projectCards.value.slice(offset, offset + pageSize.value);
});

const refresh = async () => {
    await getProjectInfos();
    listProjects();
}
onMounted(async () => {
    await refresh();
});

watch(seachKey, () => {
    listProjects();
})

watch(sortOrder, () => {
    app.projectSortOrder = sortOrder.value;
    listProjects();
})

watch(sortType, () => {
    app.projectSortType = sortType.value;
    listProjects();
})

watch(dataType, () => {
    app.projectDataType = dataType.value;
    listProjects();
})

watch(pageSize, () => {
    app.projectPageSize = pageSize.value;
})

const createNew = () => {
    router.push("/edit");
}
const fnBtnList = reactive([
    {
        label: '更多',
        key: 'select',
        icon: shallowRef(EllipsisHorizontalCircleSharp)
    }
])

const selectOptions = ref([
    {
        label: '预览服务端数据',
        key: 'previewServer',
        icon: renderIcon(BrowsersOutline)
    },
    {
        label: '克隆服务端数据',
        key: 'copyServer',
        icon: renderIcon(Copy)
    },
    {
        label: '删除服务端数据',
        key: 'deleteServer',
        icon: renderIcon(Trash)
    },
    {
        type: 'divider',
        key: 'd1'
    },
    {
        label: '预览本地数据',
        key: 'previewLocal',
        icon: renderIcon(BrowsersOutline)
    },
    {
        label: '克隆本地数据',
        key: 'copyLocal',
        icon: renderIcon(Copy)
    },
    {
        label: '删除本地数据',
        key: 'deleteLocal',
        icon: renderIcon(Trash)
    }, {
        type: 'divider',
        key: 'd1'
    },
    {
        label: '修改项目ID',
        key: 'modifyProjectId',
        icon: renderIcon(Pencil)
    }
])

const handleSelect = (card: any, key: string) => {
    switch (key) {
        case 'deleteServer':
            deleteHanlde(card, false)
            break
        case 'deleteLocal':
            deleteHanlde(card, true)
            break
        case 'copyServer':
            copyHandle(card, false)
            break;
        case 'copyLocal':
            copyHandle(card, true)
            break;
        case 'previewServer':
            previewHandle(card, false)
            break;
        case 'previewLocal':
            previewHandle(card, true)
            break;
        case 'modifyProjectId':
            modifyProjectId(card);
            break;
    }
}

const hasData = (card: any, isLocal?: boolean) => {
    if (isLocal && !card.local) {
        window.$message.error("没有本地数据");
        return false;
    }
    if (!isLocal && !card.server) {
        window.$message.error("没有服务端数据");
        return false;
    }
    return true;
}
// 预览处理
const previewHandle = (card: any, isLocal?: boolean) => {
    if (!hasData(card, isLocal)) return;
    const url = router.resolve({
        path: `/preview`,
    });
    // 打开新窗口
    window.open(`${url.href}?key=${card.key}&isLocal=${isLocal ?? false}`);
}

// 删除处理
const deleteHanlde = (card: any, isLocal?: boolean) => {
    if (!hasData(card, isLocal)) return;
    window.$dialog.warning({
        title: '提示',
        content: `你确定要删除 ${card.title} ${card.key} ?`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            if (isLocal) {
                await Storage.deleteRecord(card.key);
            } else {
                let svc = new Service(app.serviceUrl, app.accessToken);
                let keyInfo = APP_VISUAL_KEY + card.key;
                await svc.deleteCustomData(keyInfo);
            }
            refresh();
        }
    })
}

// 编辑处理
const editHandle = (card: any, isLocal?: boolean) => {
    if (!hasData(card, isLocal)) return;
    router.push(`/edit?key=${card.key}&isLocal=${isLocal ?? false}`)
}

// 克隆处理
const copyHandle = async (card: any, isLocal?: boolean) => {
    if (!hasData(card, isLocal)) return;
    let record: any;
    if (isLocal) {
        let records = await Storage.getRecordByKey(card.key);
        if (records.length == 0) return;
        record = records[0];
    } else {
        let svc = new Service(app.serviceUrl, app.accessToken);
        let keyInfo = APP_VISUAL_KEY + card.key;
        let res = await svc.getCustomData(keyInfo, { retDataType: "value" });
        let config = res.data;
        record = {
            ...card,
            config
        }
    }
    record.key = MapApp.guid();
    record.title = (record.title ?? "") + "-副本"
    delete record.id;
    delete record.local;
    delete record.server;
    await Storage.upsert(record);
    refresh();
}

const modifyProjectId = async (card: any) => {
    selectCard.value = {
        ...toRaw(card),
        key: card.key,
        oldKey: card.key
    }
    showModifyProjectIdModel.value = true;
}

const onModifyIdOk = async () => {
    let card = toRaw(selectCard.value) as any;
    let oldKey = card.oldKey;
    let newKey = card.key;
    if (oldKey == newKey || !newKey) return;

    try {
        if (card.server) {
            // 如果有服务端数据
            let svc = new Service(app.serviceUrl, app.accessToken);
            let keyInfo = APP_VISUAL_KEY + oldKey;
            let res = await svc.getCustomData(keyInfo);
            // 删除之前的
            const oldKeyInfo = keyInfo;
            // 保存成新的
            keyInfo = APP_VISUAL_KEY + newKey;
            // 数据和属性分开保存，这样全部获取时只先要获取属性，加载少
            await svc.saveCustomData(keyInfo, res.data, {
                ...res.prop,
                key: newKey
            });
            await svc.deleteCustomData(oldKeyInfo);
        }
        if (card.local) {
            let records = await Storage.getRecordByKey(oldKey);
            if (records.length == 0) return;
            let record = records[0];
            await Storage.deleteRecord(oldKey);
            record.key = newKey;
            await Storage.upsert(record);
        }
        refresh();
        window.$message.info("修改成功！");
    } catch (error: any) {
        window.$message.error(error?.response ?? error);
    }

}

</script>

<style lang='scss' scoped>
.container {
    height: 100%;

    .cards {
        width: 100%;
        height: 100%;
        max-height: 100%;
    }

    .img {
        cursor: pointer;
    }
}</style>