import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '箭头线',
    title: '箭头线设置',
    collapse: "线图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M1001.6 452.8l-120-140.8c-17.6-17.6-43.2-20.8-59.2-4.8-17.6 17.6-20.8 43.2-4.8 59.2l84.8 102.4H43.2C17.6 468.8 0 486.4 0 512s17.6 43.2 43.2 43.2h860.8l-84.8 102.4c-17.6 17.6-12.8 46.4 4.8 59.2 8 8 17.6 8 25.6 8 12.8 0 25.6-4.8 33.6-17.6l120-140.8c28.8-27.2 28.8-78.4-1.6-113.6z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置", "箭头设置", "线设置", "线边框设置"],
            default: {
                lineWidth: 10,
                showDir: true,
                showBorder: true,
                borderColor: "#f00",
                lineColor: '#FF9900'
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'lineColor',
                    title: '颜色',
                    collapse: "线设置",
                    value: data.lineColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineWidth',
                    title: '线宽',
                    collapse: "线设置",
                    value: data.lineWidth,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineOpacity',
                    title: '线透明度',
                    collapse: "线设置",
                    value: data.lineOpacity,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
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
                    collapse: "线设置",
                    value: data.lineGapWidth,
                    info: '在线的实际路径之外绘制描边时，该值指示内部间隙的宽度。属于绘制属性。可选值为大于0的数字。单位是像素，默认值是1',
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineOffset',
                    title: '线的偏移',
                    collapse: "线设置",
                    value: data.lineOffset,
                    info: "线的偏移量。对于线性要素，正值相对于线的方向向右偏移，负值向左偏移。对于多边形特征，正值表示向内偏移，负值表示向外偏移。线偏移了。可选值为大于0的数字。单位是像素，默认值是1",
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineBlur',
                    title: '线模糊度',
                    collapse: "线设置",
                    value: data.lineBlur,
                    info: '模糊度，和宽度配合使用，当宽度20，模糊度10时，出现边线模糊的效果，该值要小于线宽度',
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'radio',
                    field: 'strokeStyle',
                    title: '实线或虚线',
                    collapse: "线设置",
                    value: data.strokeStyle,
                    options:[
                        {value:"solid",label:"实线"},
                        {value:"dashed",label:"虚线"}
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'lineDasharray',
                    title: '虚线长度',
                    collapse: "线设置",
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
                    collapse: "线设置",
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
                    collapse: "线设置",
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
                    collapse: "线设置",
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
                    field: 'strokeImage',
                    title: '线图案',
                    collapse: "线设置",
                    value: data.strokeImage,
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
                    collapse: "线设置",
                    value: data.lineGradient,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: '',
                    }
                },
                {
                    type: 'radio',
                    field: 'showBorder',
                    title: '显示线边框',
                    collapse: "线边框设置",
                    value: data.showBorder,
                    options:[
                        {value:true,label:"是"},
                        {value:false,label:"否"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'borderColor',
                    title: '颜色',
                    collapse: "线边框设置",
                    value: data.borderColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: 'exprComp',
                    field: 'borderWidth',
                    title: '线宽',
                    collapse: "线边框设置",
                    value: data.borderWidth,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'borderOpacity',
                    title: '线透明度',
                    collapse: "线设置",
                    value: data.borderOpacity,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 0.01,
                        min: 0,
                        max: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'borderGapWidth',
                    title: '间隙宽度',
                    collapse: "线边框设置",
                    value: data.borderGapWidth,
                    info: '在线的实际路径之外绘制描边时，该值指示内部间隙的宽度。属于绘制属性。可选值为大于0的数字。单位是像素，默认值是1',
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'borderOffset',
                    title: '线的偏移',
                    collapse: "线边框设置",
                    value: data.borderOffset,
                    info: "线的偏移量。对于线性要素，正值相对于线的方向向右偏移，负值向左偏移。对于多边形特征，正值表示向内偏移，负值表示向外偏移。线偏移了。可选值为大于0的数字。单位是像素，默认值是1",
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'borderBlur',
                    title: '线模糊度',
                    collapse: "线边框设置",
                    value: data.borderBlur,
                    info: '模糊度，和宽度配合使用，当宽度20，模糊度10时，出现边线模糊的效果，该值要小于线宽度',
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'borderGradient',
                    title: '线渐变',
                    collapse: "线边框设置",
                    value: data.borderGradient,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: '',
                    }
                },
                {
                    type: 'radio',
                    field: 'showDir',
                    title: '显示箭头',
                    collapse: "箭头设置",
                    value: data.showDir,
                    options:[
                        {value:true,label:"是"},
                        {value:false,label:"否"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'dirSize',
                    title: '箭头大小',
                    collapse: "箭头设置",
                    value: data.dirSize,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                
               
                {
                    type: 'exprComp',
                    field: 'dirSpacing',
                    title: '箭头间距',
                    collapse: "箭头设置",
                    value: data.dirSpacing,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'dirImageWidth',
                    title: '箭头图像宽',
                    collapse: "箭头设置",
                    value: data.dirImageWidth,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'dirImageHeight',
                    title: '箭头图像高',
                    collapse: "箭头设置",
                    value: data.dirImageHeight,
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'dirImageColor',
                    title: '箭头图像颜色',
                    collapse: "箭头设置",
                    value: data.dirImageColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: 'exprComp',
                    field: 'dirIconColor',
                    title: '箭头图标颜色',
                    collapse: "箭头设置",
                    value: data.dirIconColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: 'exprComp',
                    field: 'dirLayout',
                    title: '箭头布局',
                    collapse: "箭头设置",
                    value: data.dirLayout,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: '',
                    }
                },
                {
                    type: "Input",
                    field: 'cursor',
                    title: '光标形状',
                    collapse: "绘制设置",  
                    value: data.cursor,
                    props: {
                    }
                },
            ]
        }
    }
};