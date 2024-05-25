import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '多边形拉伸',
    title: '多边形拉伸图层设置',
    collapse: "面图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M913.322667 259.669333l-384-170.666666a42.709333 42.709333 0 0 0-34.688 0l-384 170.666666c-0.853333 0.384-1.450667 1.024-2.304 1.493334-1.194667 0.597333-2.474667 0.981333-3.584 1.706666-0.938667 0.64-1.664 1.450667-2.56 2.133334a37.12 37.12 0 0 0-8.106667 8.277333c-0.853333 1.194667-1.749333 2.261333-2.517333 3.456a47.744 47.744 0 0 0-3.242667 7.04c-0.384 1.152-0.981333 2.218667-1.322667 3.370667A43.221333 43.221333 0 0 0 85.333333 298.666667v426.666666c0 16.896 9.898667 32.128 25.344 38.997334l384 170.666666c5.546667 2.474667 11.434667 3.669333 17.322667 3.669334a42.538667 42.538667 0 0 0 17.152-4.096l0.170667 0.426666 384-170.666666A42.624 42.624 0 0 0 938.666667 725.333333V298.666667a42.624 42.624 0 0 0-25.344-38.997334zM512 174.72L790.954667 298.666667 512 422.613333l-55.808-24.789333L233.088 298.666667 512 174.72zM170.666667 697.642667V364.330667l298.666666 132.736v333.269333l-298.666666-132.693333z m384 132.693333V497.066667l298.666666-132.736v333.312l-298.666666 132.693333z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
                fillExtrusionColor: "#00ffff",
                fillExtrusionHeight: mapApp?.isWebBaseMap() ? 1000 : 1000000
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'fillExtrusionColor',
                    title: '拉伸颜色',
                    collapse: "绘制设置",
                    value: data.fillExtrusionColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillExtrusionOpacity',
                    title: '透明度',
                    collapse: "绘制设置",
                    value: data.fillExtrusionOpacity,
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
                    field: 'fillExtrusionHeight',
                    title: '拉伸高度',
                    collapse: "绘制设置",
                    value: data.fillExtrusionHeight,
                    info: '填充面拉伸高度。参数为大于等于0的数值型。单位是米，默认值是0',
                    props: {
                        childType: "InputNumber",
                        step: 0.00001,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillExtrusionBase',
                    title: '拉伸底部高度',
                    collapse: "绘制设置",
                    value: data.fillExtrusionBase,
                    info: '拉伸底部高度。参数为大于等于0的数值型。单位是米，默认值是0',
                    props: {
                        childType: "InputNumber",
                        step: 0.00001,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillExtrusionPattern',
                    title: '拉伸填充图案',
                    collapse: "绘制设置",
                    value: data.fillExtrusionPattern,
                    info: '接收的参数是雪碧图中用于填充面的图像的名称。对于无缝模式，图像宽度必须是2的系数（2、4、8、…、512）。请注意，缩放相关表达式将仅在整数缩放级别进行计算。',
                    props: {
                        childType: "select",
                        placeholder: '', 
                        options: listMapImages(mapApp?.map),
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillExtrusionTranslate',
                    title: '平移量',
                    collapse: "绘制设置",
                    value: data.fillExtrusionTranslate,
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
                    field: 'fillExtrusionTranslateAnchor',
                    title: '平移参考系',
                    collapse: "绘制设置",
                    value: data.fillExtrusionTranslateAnchor,
                    info: 'map表示该线相对于地图平移。viewport表示相对于视窗平移',
                    options:[
                        {value:"map",label:"相对于地图平移"},
                        {value:"viewport",label:"表示相对于视窗平移"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillExtrusionVerticalGradient',
                    title: '侧面应用垂直渐变',
                    collapse: "绘制设置",
                    value: data.fillExtrusionVerticalGradient,
                    info: "是否向填充延申图层的侧面应用垂直渐变。如果为true，则在靠下方的位置，侧面的阴影将略暗。",
                    props: {
                        childType: "select",
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