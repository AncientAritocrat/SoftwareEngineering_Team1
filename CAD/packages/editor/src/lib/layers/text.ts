import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import marker from './marker'
export default {
    name: '文本',
    title: '文本设置',
    collapse: "点图层",
    icon: `M853.333333 138.666667H170.666667c-17.066667 0-32 14.933333-32 32v128c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V202.666667h277.333333v618.666666H384c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h256c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-96v-618.666666h277.333333V298.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V170.666667c0-17.066667-14.933333-32-32-32z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const markerFactory = marker.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", '文本设置', "绘制设置"],
            default: {
                text: "ID:${props.index}",
                style: {
                    'cursor': 'pointer',
                    'opacity': 1,
                    'padding': '12px',
                    'border-radius': '4px',
                    'background-color': '#0ff',
                    'border-width': 0,
                    'box-shadow': '0px 2px 6px 0px rgba(97,113,166,0.2)',
                    'text-align': 'center',
                    'font-size': '14px',
                    'color': '#F33'
                }
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp, true),
                {
                    type: "Input",
                    field: 'text',
                    title: '文本内容',
                    collapse: "文本设置",   
                    value: data.text,
                    info: "请输入文本内容,props为内置属性变量，如id:${props.index}",
                    props: {
                        type: "textarea",
                        rows: 3,
                        placeholder: '请输入文本内容,props为内置属性变量',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'style',
                    title: '文本样式',
                    collapse: "文本设置",
                    value: data.style,
                    info: `json字符串，css样式`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                    }
                },
                ...markerFactory.rule.filter((r: any) => (r.collapse != "通用设置" && r.collapse != "数据设置" && r.field.indexOf("custom") == -1)),
             ]
        }
    }
};