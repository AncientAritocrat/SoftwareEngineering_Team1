<template>
    <n-space vertical>
        <n-card>
            <FormCreate v-model="fApi" ref="form" :rule="rule" :option="option" @change="onChange"></FormCreate>
        </n-card>

        <n-button ghost type="primary" style="width:100%;" @click="setMapViewDefault">
            <template #icon>
                <n-icon>
                    <Add />
                </n-icon>
            </template>
            设置当前地图视图为初始视图
        </n-button>
    </n-space>

</template>

<script setup lang="ts">
import type { editorContext } from "@/types";
import formCreate from "@form-create/naive-ui"
import { useDebounceFn } from '@vueuse/core';
import { inject, reactive, ref, toRaw } from "vue";
import { toString } from '@/lib/utils'
import MapComp from '@/components/MapComp.vue'
import type MapApp from "~/MapApp";
import vjmap from "vjmap";
const { mapApp, uiApp } = inject<editorContext>('editorContext') as editorContext;
const FormCreate = formCreate.$form();
const form = ref<any>(null);
let fApi = reactive<any>({});
const mapOptions: any = mapApp?.getConfig().mapOptions || {};

const option = reactive({
    form: {
        labelWidth: "auto",
        size: 'small'
    },
    submitBtn: false
});
const rule = ref([
    {
        type: 'input',
        field: 'center',
        title: '初始中心点',
        value: mapOptions.center ? mapOptions.center.join(",") : '',
        props: {
            placeholder: 'lng,lat',
        },
        suffix:{
            type:'button', 
            children:['拾取'], 
            on:{
                click: async () => {
                    await pickCenter();
                }
            }
        }
    },
    {
        type: 'input',
        field: 'zoom',
        title: '初始级别',
        value: toString(mapOptions.zoom),
        props: {
            placeholder: '1',
        }
    },
    {
        type: 'input',
        field: 'bearing',
        title: '初始方位角',
        value: toString(mapOptions.bearing),
        props: {
            placeholder: '0',
        }
    },
    {
        type: 'input',
        field: 'pitch',
        title: '初始倾斜角',
        value: toString(mapOptions.pitch),
        props: {
            placeholder: '0',
        }
    },
    {
        type: "switch",
        title: "允许旋转",
        field: "dragRotate",
        value: mapOptions.dragRotate === false ? false : true,
    },
    {
        type: "switch",
        title: "允许倾斜",
        field: "pitchWithRotate",
        value: mapOptions.pitchWithRotate === false ? false : true,
    }
]);
const onChange = useDebounceFn(() => {
    let value = {...toRaw(fApi) as any};
    try {
        if (value.center == '') {
            delete value.center; // 如果没有设置
        } else {
            value.center = value.center.split(',');
        }
        if (value.zoom == '') {
            delete value.zoom; // 如果没有设置
        } else {
            value.zoom = parseFloat(value.zoom);
        }
        if (value.bearing == '') {
            delete value.bearing; // 如果没有设置
        } else {
            value.bearing = parseFloat(value.bearing);
        }
        if (value.pitch == '') {
            delete value.pitch; // 如果没有设置
        } else {
            value.pitch = parseFloat(value.pitch);
        }
        mapApp.setMapOptions(value);
    } catch (error: any) {
        window.$message.error(error);
    }

}, 1000);

const setMapViewDefault = () => {
    let center = mapApp.map.getCenter();
    form.value.fapi.setValue({
        center: `${center.lng.toFixed(6)},${center.lat.toFixed(6)}`,
        zoom: mapApp.map.getZoom().toFixed(2),
        bearing: mapApp.map.getBearing().toFixed(2),
        pitch: mapApp.map.getPitch().toFixed(2),
    });
}

const pickCenter = async () => {
    let res = await uiApp.showModalAsync("PickCenter", '请在地图上拾取一个点作为初始中心点坐标', {
        component: MapComp,
        props: {
            positiveText: '',
            negativeText: '',
            bodyStyle: {
                position: 'fixed',
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
                width: "100%"
            },
            methods: {
                onMounted: async (mApp: MapApp, close: Function, context: any) => {
                    // 把原来的中心点标志上
                    if (fApi.center) new vjmap.Marker().setLngLat(fApi.center.split(',')).addTo(mApp.map);
                    let marker: any;
                    let actionPoint = await vjmap.Draw.actionDrawPoint(mApp.map, {
                        updatecoordinate: (e: any) => {
                            if (!e.lnglat) return;
                            if (!marker) {
                                marker = new vjmap.Marker({color: '#63e2b7'});
                                marker.setLngLat(e.lnglat);
                                marker.addTo(mApp.map);
                            } else {
                                // 更新坐标
                                marker.setLngLat(e.lnglat);
                            }
                        }
                    });
                    if (actionPoint.cancel) {
                        close(false, null);
                        return;
                    }
                    let co = actionPoint.features[0].geometry.coordinates;
                    close(true, {
                        coordinate: co
                    });
                }
            }
            
        }
    })
    if (res.isOk) {
        form.value.fapi.setValue({
            center: `${res.result.coordinate[0].toFixed(6)},${res.result.coordinate[1].toFixed(6)}`,
        });
    }
}

</script>