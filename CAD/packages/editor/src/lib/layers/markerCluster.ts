import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import marker from './marker'
export default {
    name: '点标记聚合',
    title: '点标记聚合设置',
    collapse: "点图层",
    icon: `M512 64a448 448 0 0 1 448 448c0 247.424-200.576 448-448 448S64 759.424 64 512 264.576 64 512 64z m0 64c-212.064 0-384 171.936-384 384s171.936 384 384 384 384-171.936 384-384a384 384 0 0 0-384-384z M380.256 728.16h-56V365.28l-67.776 74.496L224 406.144l108.64-112h47.616v433.984z m249.76 7.84c-118.72 0-168-118.72-168-224s47.04-224 168-224c120.96 0 168 117.6 168 224s-49.856 224-168 224z m0-399.84c-82.336 0-112 89.024-112 175.84 0 86.784 28 176.384 112 176.384s112-89.6 112-176.384c0-86.816-29.696-175.84-112-175.84z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const markerFactory = marker.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "聚合设置", "绘制设置"],
            default: {
                textStyle: {
                    cursor: "pointer",
                    opacity: 0.8,
                    padding: "6px",
                    "border-radius": "12px",
                    "border-width": 0,
                    "box-shadow": "0px 2px 6px 0px rgba(97,113,166,0.2)",
                    "text-align": "center",
                    "font-size": "14px",
                },
                textColors: [
                    [0, "#00FFFF", "#00FFFF"],
                    [5, "#F0F", "#80FF00"],
                    [10, "#00F", "#FFFF00"],
                    [1000, "#FFF", "#FF3D3D"]
                ],
                popupHtml: "<h3 style='color:red'>index ${props.index}</h3>",
                popupOffset: [0, -28]
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'select',
                    field: 'allowOverlap',
                    title: '允许重叠',
                    collapse: "聚合设置",
                    value: data.allowOverlap,
                    options: [{
                        label: "",
                        value: undefined
                    },{
                        label: "是",
                        value: true
                    },{
                        label: "否",
                        value: false
                    }],
                },
                {
                    type: "InputNumber",
                    field: 'allowOverlapMaxZoom',
                    title: '允许重叠的最大缩放级别',
                    collapse: "聚合设置",  
                    value: data.allowOverlapMaxZoom,
                    info: "允许重叠的最大缩放级别，小于或等于此级别才会处理重叠，超过此级时会全部显示当前所有的(如果不允许重叠时有效).默认4级",
                    props: {
                        min: 0,
                        max: 24,
                        step: 1,
                        placeholder: '请输入0-24级别中的一个级别',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'markerWidth',
                    title: '标记像素宽',
                    collapse: "聚合设置",  
                    value: data.markerWidth,
                    info: "marker div的像素宽，用于计算重叠时需要，默认40. 如果在data的properties设置了属性markerWidth，则以data设置的为准",
                    props: {
                        step: 1
                    }
                },
                {
                    type: "InputNumber",
                    field: 'markerHeight',
                    title: '标记像素高',
                    collapse: "聚合设置",  
                    value: data.markerHeight,
                    info: "marker div的像素高，用于计算重叠时需要，默认40. 如果在data的properties设置了属性markerHeight，则以data设置的为准",
                    props: {
                        step: 1
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textStyle',
                    title: '聚合文本样式',
                    collapse: "聚合设置",
                    value: data.textStyle,
                    info: `json字符串，css样式`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textColors',
                    title: '聚合文本颜色',
                    collapse: "聚合设置",
                    value: data.textColors,
                    info: `格式为[[值1,文本颜色，背景色], [值2,文本颜色，背景色], ...]`,
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