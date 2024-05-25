<template>
    <n-scrollbar :style="scrollStyle">
        <n-card size="small">
            <n-collapse :expanded-names="expandedNames" display-directive="show" :on-update:expanded-names="onUpdateExpandedNames">
                <n-collapse-item v-for="item in collapses" :key="item.name" :title="item.name" :name="item.name" display-directive="show" >
                    <FormCreate v-model="item.fApi"  :rule="item.rule" :ref="(el:any) => { if (el) item.form = el }" :option="item.option" @change="item.onChange"></FormCreate>
                </n-collapse-item>
                <n-collapse-item title="JSON" name="json">
                    <monaco-editor :style="{height: '150px'}" v-model="json"  ref="cfgJson" language=""></monaco-editor>
                </n-collapse-item>
            </n-collapse>
        </n-card>
    </n-scrollbar>
</template>

<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import { ref, reactive, toRaw, inject, onMounted, watch, nextTick } from 'vue';
import formCreate from "@form-create/naive-ui"
import type { editorContext } from '@/types';
import { isExprString } from '@/lib/utils';
import { useDebounceFn, useResizeObserver } from '@vueuse/core';
const { mapApp} = inject<editorContext>('editorContext') as editorContext;
const scrollStyle = reactive({ maxHeight: '500px' });
useResizeObserver(document.body, (entries) => {
  scrollStyle.maxHeight = (entries[0].contentRect.height - 150) + 'px';
});
const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    factory: {
        type: Function,
        required: true
    }
});
const cfgJson = ref();
let collapses = ref<any>([]);
let LayerProp: any;
let isNewAddLayer = false;
let initData: any = {...props.data}; // 初始化的数据
if (Object.keys(props.data).length == 0) {
    initData = {...props.factory({}).default};
    LayerProp = props.factory(initData, collapses, mapApp);
    isNewAddLayer = true; // 新加的图层
    mapApp.addLayer(initData, true);
} else {
    LayerProp = props.factory(props.data, collapses, mapApp);
}

for(let i = 0; i < LayerProp.rule.length; i++) {
    let idx = collapses.value.findIndex((c: any) => c.name == LayerProp.rule[i].collapse);
    if (idx == -1) {
        collapses.value.push({
            name: LayerProp.rule[i].collapse,
            fApi: ref<any>({}),
            option: LayerProp.option, 
            onChange: () => onChange()
        });
        idx = collapses.value.length - 1;

    }
    collapses.value[idx].rule = collapses.value[idx].rule || [];
    collapses.value[idx].rule.push(LayerProp.rule[i])
    if (LayerProp.rule[i].type == "exprComp") {
        if (isExprString(LayerProp.rule[i].value)) {
            LayerProp.rule[i].value = JSON.stringify(LayerProp.rule[i].value, null, 0);
        }
    }
}
const expandedNames = ref([...collapses.value.map((c:any) => c.name), 'json']);
nextTick(() => {
    // 先全部展开后，再用默认的展开，这样确保form对象都是有效的
    expandedNames.value = [...LayerProp.expanded, 'json'];
});
const onUpdateExpandedNames = (names: Array<string | number>) => {
    expandedNames.value = [...names]
}
const json = ref('');
const FormCreate = formCreate.$form();

let formDataChangeTime: any = new Date();
let editorDataChangeTime: any = new Date();
const onChange = useDebounceFn(() => {
    let value: any = {};
    for(let c in collapses.value) {
        value = {...value, ...toRaw(collapses.value[c].fApi)}
    }
    if ((new Date() as any) - editorDataChangeTime < 1500) return;
    formDataChangeTime = new Date();
    showEditorValue(value);
}, 600);

onMounted(() => {
    showEditorValue(initData);
})

const showEditorValue = (data: any) => {
    if (!cfgJson.value) return;
    let value: any = {};
    for(let k in data) {
        if (data[k] === '' || data[k] === null || data[k] === undefined) continue; // 去掉空项
        let item = LayerProp.rule.find((f : any) => {
            // 如果有关联控件
            let find = f.field == k;
            if (!find && f.control) {
                for(let c of f.control) {
                    find = c.rule.find((item: any) => item.field == k);
                    if (find) return find;
                }
            } 
            return find;
        });
        if (!item) continue;
        value[k] = data[k];
        if (item.type == "exprComp") {
            // 如果是表达式输入
            if (isExprString(data[k])) {
                // 如果是表达式
                try {
                    // 如果是数组
                    value[k] = value[k].trim();
                    if (value[k].charAt(0) == '[') {
                        value[k] = eval(data[k])
                    } else {
                        value[k] = JSON.parse(data[k])
                    }
                } catch (error) {
                    // console.warn(`表达式值 ${data[k]} 输入有误` + error );
                }
            }
        }
    }
    cfgJson.value.setValue(JSON.stringify(value, null, 4));
    mapApp.setLayerStyle(initData.layerId, value, true);
};

const setFormValue = (data: any) => {
    try {
        data = JSON.parse(data);
        console.log(collapses.value)
        for(let i = 0 ; i < collapses.value.length; i++) {
            let form = collapses.value[i].form;
            let formVal: any = {}
            
            for(let r = 0; r < collapses.value[i].rule.length; r++) {
                let item = collapses.value[i].rule[r];
                let val = data[item.field];
                if (val) {
                    if (item.type == "exprComp") {
                        if (isExprString(val)) {
                            val = JSON.stringify(val, null, 0);
                        }
                    }
                }
                form.fapi.setValue({
                    [item.field]: val
                })
                formVal[item.field] = val;

                // 关联组件
                if (item.control) {
                    for(let c of item.control) {
                        for(let k = 0; k < c.rule.length; k++) {
                            let subItem = c.rule[k];
                            let val = data[subItem.field];
                            if (val) {
                                if (subItem.type == "exprComp") {
                                    if (isExprString(val)) {
                                        val = JSON.stringify(val, null, 0);
                                    }
                                }
                            }
                            form.fapi.setValue({
                                [subItem.field]: val
                            })
                            formVal[subItem.field] = val;
                        }
                    }
                } 
             }
        }
    } catch(e) {
        console.warn(e);
    }
};

watch(json, useDebounceFn((val: string) => {
    if ((new Date() as any) - formDataChangeTime < 1500) return;
    if (!cfgJson.value) return;
    editorDataChangeTime = new Date();
    setFormValue(cfgJson.value.getValue());
    try {
        let data = JSON.parse(cfgJson.value.getValue());
        mapApp.setLayerStyle(initData.layerId, data, true);
        // eslint-disable-next-line no-empty
    } catch (error) {
        
    }
}, 600));

// 确定时获取结果回调
const getResult = () => {
    //let value = { ...toRaw(fApi3) as any };
    return {

    }
}

const onOK = () => {
    //let value = cfgJson.value.getValue();
    //mapApp.setLayerStyle(initData.layerId, JSON.parse(value))
}

// 关闭时回调
const onClose = () => {
    if (isNewAddLayer) {
        // 如果是新增的，取消的话，需要移除
        mapApp.removeLayer(initData.layerId, true);
    } else {
        // initData
        mapApp.setLayerStyle(initData.layerId, initData, true)
    }
}
// 如果对话框要返回值，则必须导出此方法
defineExpose({
    onOK,
    onClose,
    getResult
})
</script>