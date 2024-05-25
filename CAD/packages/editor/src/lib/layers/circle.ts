import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '圆',
    title: '圆图层设置',
    collapse: "点图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M512 960c247.42 0 448-200.58 448-448S759.42 64 512 64 64 264.58 64 512s200.58 448 448 448z m0-76c-205.45 0-372-166.55-372-372s166.55-372 372-372 372 166.55 372 372-166.55 372-372 372z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
                circleRadius: 5,
                circleColor: "#ffff00",
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'circleRadius',
                    title: '圆半径',
                    collapse: "绘制设置",
                    value: data.circleRadius,
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        min: 0,
                        max: 10000,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'circleColor',
                    title: '圆填充颜色',
                    collapse: "绘制设置",
                    value: data.circleColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'circleOpacity',
                    title: '圆填充透明度',
                    collapse: "绘制设置",
                    value: data.circleOpacity,
                    props: {
                        childType: "InputNumber",
                        step: 0.01,
                        min: 0,
                        max: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'circleStrokeColor',
                    title: '圆边框颜色',
                    collapse: "绘制设置",
                    value: data.circleStrokeColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'circleStrokeWidth',
                    title: '圆边框宽度',
                    collapse: "绘制设置",
                    value: data.circleStrokeWidth,
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'circleStrokeOpacity',
                    title: '圆边框透明度',
                    collapse: "绘制设置",
                    value: data.circleStrokeOpacity,
                    props: {
                        childType: "InputNumber",
                        step: 0.01,
                        min: 0,
                        max: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'circleBlur',
                    title: '圆模糊度',
                    collapse: "绘制设置",
                    value: data.circleBlur,
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'circleTranslate',
                    title: '平移量',
                    collapse: "绘制设置",
                    value: data.circleTranslate,
                    info: '几何体的平移量。属于绘制属性。接收的参数是一个数组[x，y] ，其中负数分别表示左和上 。单位是像素,默认值是[0,0]',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '数组格式如[1,1],表示左和上',
                    }
                },
                {
                    type: 'radio',
                    field: 'circleTranslateAnchor',
                    title: '平移参考系',
                    collapse: "绘制设置",
                    value: data.circleTranslateAnchor,
                    info: 'map表示该线相对于地图平移。viewport表示相对于视窗平移',
                    options:[
                        {value:"map",label:"相对于地图平移"},
                        {value:"viewport",label:"表示相对于视窗平移"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'circlePitchScale',
                    title: '倾斜时缩放对齐',
                    collapse: "绘制设置",
                    value: data.circlePitchScale,
                    info: 'map表示该线相对于地图。viewport表示相对于视窗',
                    options:[
                        {value:"map",label:"相对于地图移"},
                        {value:"viewport",label:"表示相对于视窗"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'circlePitchAlignment',
                    title: '倾斜时对齐',
                    collapse: "绘制设置",
                    value: data.circlePitchAlignment,
                    info: 'map表示该线相对于地图。viewport表示相对于视窗',
                    options:[
                        {value:"map",label:"相对于地图移"},
                        {value:"viewport",label:"表示相对于视窗"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'Switch',
                    field: 'isHoverPointer',
                    title: '鼠标悬浮事件',
                    collapse: "绘制设置",
                    value: data.isHoverPointer,
                    props: {
                    }
                },
                {
                    type: 'Switch',
                    field: 'isHoverFeatureState',
                    title: '悬浮实体状态',
                    collapse: "绘制设置",
                    value: data.isHoverFeatureState,
                    props: {
                    }
                }
            ]
        }
    }
};