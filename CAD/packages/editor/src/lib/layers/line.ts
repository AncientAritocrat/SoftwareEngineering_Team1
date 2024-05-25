import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '线',
    title: '线图层设置',
    collapse: "线图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M162.304 893.952c-3.072 0-5.632-0.512-8.704-1.024-16.896-5.12-26.624-22.528-22.016-39.424l140.8-491.008c3.072-9.728 10.24-17.92 19.968-20.992 9.728-3.584 20.48-2.048 28.672 3.584l382.976 258.048L830.976 153.6c4.608-16.896 22.528-27.136 39.424-22.016 16.896 4.608 27.136 22.528 22.016 39.424l-139.264 491.52c-2.56 9.728-10.24 17.92-19.968 21.504s-20.48 2.048-28.672-3.584L321.536 421.888 193.024 870.4c-4.096 14.336-16.896 23.552-30.72 23.552z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
                lineColor: '#ff0000',
                lineWidth: 1
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'lineColor',
                    title: '颜色',
                    collapse: "绘制设置",
                    value: data.lineColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineWidth',
                    title: '线宽',
                    collapse: "绘制设置",
                    value: data.lineWidth,
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineOpacity',
                    title: '线透明度',
                    collapse: "绘制设置",
                    value: data.lineOpacity,
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
                    field: 'lineGapWidth',
                    title: '间隙宽度',
                    collapse: "绘制设置",
                    value: data.lineGapWidth,
                    info: '在线的实际路径之外绘制描边时，该值指示内部间隙的宽度。属于绘制属性。可选值为大于0的数字。单位是像素，默认值是1',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineOffset',
                    title: '线的偏移',
                    collapse: "绘制设置",
                    value: data.lineOffset,
                    info: "线的偏移量。对于线性要素，正值相对于线的方向向右偏移，负值向左偏移。对于多边形特征，正值表示向内偏移，负值表示向外偏移。线偏移了。可选值为大于0的数字。单位是像素，默认值是1",
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineBlur',
                    title: '线模糊度',
                    collapse: "绘制设置",
                    value: data.lineBlur,
                    info: '模糊度，和宽度配合使用，当宽度20，模糊度10时，出现边线模糊的效果，该值要小于线宽度',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineDasharray',
                    title: '虚线长度',
                    collapse: "绘制设置",
                    value: data.lineDasharray,
                    info: '数组格式如[1,1]表示实线、虚线的组合',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: '数组格式如[1,1]表示实线、虚线的组合',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineTranslate',
                    title: '平移量',
                    collapse: "绘制设置",
                    value: data.lineTranslate,
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
                    field: 'lineCap',
                    title: '线帽形状',
                    collapse: "绘制设置",
                    value: data.lineCap,
                    options:[
                        {value:"butt",label:"尖头"},
                        {value:"round",label:"圆头"},
                        {value:"square",label:"平头"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'lineJoin',
                    title: '拐角形状',
                    collapse: "绘制设置",
                    value: data.lineJoin,
                    options:[
                        {value:"bevel",label:"平拐"},
                        {value:"round",label:"圆拐"},
                        {value:"miter",label:"棱拐"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'linePattern',
                    title: '线图案',
                    collapse: "绘制设置",
                    value: data.linePattern,
                    info: '线的拉伸图片类型，一定要与地图之前加载的图片名字一一对应,图像宽度必须是2的系数（2、4、8、…、512',
                    props: {
                        childType: "select",
                        placeholder: '', 
                        options: listMapImages(mapApp?.map),
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineGradient',
                    title: '线渐变',
                    collapse: "绘制设置",
                    value: data.lineGradient,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: '',
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