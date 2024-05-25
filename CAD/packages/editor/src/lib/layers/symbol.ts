import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '点符号',
    title: '点符号图层设置',
    collapse: "点图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M707.008 359.04H316.992a8 8 0 0 0-8 7.936v48c0 4.48 3.584 8 8 8H480v305.024c0 4.416 3.584 8 8 8h48a8 8 0 0 0 8-8V422.976h163.008a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8z m217.792-21.44a449.344 449.344 0 1 0-828.288 348.8 449.344 449.344 0 0 0 828.288-348.8z m-149.76 437.376A372.032 372.032 0 1 1 883.968 512a369.536 369.536 0 0 1-109.056 263.04z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置","图标设置","文本设置","符号设置"],
            default: {
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'iconImage',
                    title: '图标名称',
                    collapse: "图标设置",
                    value: data.iconImage,
                    info: '用于绘制图像背景的图像的名称, 请先在设置中增加图像资源',
                    props: {
                        childType: "select",
                        placeholder: '', 
                        options: listMapImages(mapApp?.map),
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconRotate',
                    title: '图标旋转角度',
                    collapse: "图标设置",
                    value: data.iconRotate,
                    info: '顺时针转动图标的角度。参数为数字，单位为角度。默认值是0。需要icon-image属性',
                    props: {
                        childType: "InputNumber",
                        step: 0.000001,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconOffset',
                    title: '图标与其锚点偏移距离',
                    collapse: "图标设置",
                    value: data.iconOffset,
                    info: '图标与其锚点的偏移距离。正值表示向右和向下，负值表示向左和向上.将每个组件乘以icon-size的值以获得以像素为单位的最终偏移。当与图标旋转相结合时，偏移将视旋转方向为向上。接收参数为一个数组。默认值为[0,0]需要icon-image。',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '数组格式如[1,1],正值表示向右和向下',
                    }
                },
                {
                    type: 'radio',
                    field: 'iconAnchor',
                    title: '图标锚定位置',
                    collapse: "图标设置",
                    value: data.iconAnchor,
                    info: '决定图标锚定的位置。可选值有"center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"。默认值为“center”需要icon-image属性',
                    options:[
                        {value:"center",label:"center"},
                        {value:"left",label:"left"},
                        {value:"right",label:"right"},
                        {value:"top",label:"top"},
                        {value:"bottom",label:"bottom"},
                        {value:"top-left",label:"top-left"},
                        {value:"top-right",label:"top-right"},
                        {value:"bottom-left",label:"bottom-left"},
                        {value:"bottom-right",label:"bottom-right"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'iconRotationAlignment',
                    title: '图标旋转对齐',
                    collapse: "图标设置",
                    value: data.iconRotationAlignment,
                    info: '结合symbol-placement，确定图标的旋转。可选值为”map”,”viewport”,”auto”。“map” 将symbol placement设定为point时，图标将东西向对齐。当symbol placement设置为“line”或“line-center”时，将图标x轴与直线对齐。“viewport” 生成其x轴与视口的x轴对齐的图标，而不考虑symbol-placement的值。"auto":当“symbol-placement”设置为“点”时，效果等同于viewport。当“symbol-placement”设置为“line”或“line-center”时，效果等同于“map”。',
                    options:[
                        {value:"map",label:"地图"},
                        {value:"viewport",label:"视口"},
                        {value:"auto",label:"自动"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'iconPitchAlignment',
                    title: '地图倾斜时图标的方向',
                    collapse: "图标设置",
                    value: data.iconPitchAlignment,
                    info: '决定地图倾斜时图标的方向',
                    options:[
                        {value:"map",label:"图标与地图平面对齐"},
                        {value:"viewport",label:"图标与视口平面对齐"},
                        {value:"auto",label:"根据图标旋转对齐值自动匹配"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconAllowOverlap',
                    title: '图标允许重叠',
                    collapse: "图标设置",
                    value: data.iconAllowOverlap,
                    info: '如果为true，则即使图标与以前绘制的其他符号冲突，图标也将可见。默认值为false.需要icon-image',
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
                    type: 'exprComp',
                    field: 'iconOpacity',
                    title: '图标透明度',
                    collapse: "图标设置",
                    value: data.iconOpacity,
                    info: '图标绘制的透明度。可选值在0到1之间。默认值为1.需要icon-image。',
                    props: {
                        childType: "InputNumber",
                        step: 0.000001,
                        min: 0,
                        max: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconIgnorePlacement',
                    title: '图标忽略碰撞',
                    collapse: "图标设置",
                    value: data.iconIgnorePlacement,
                    info: '如果为true，则即使其他符号与图标发生碰撞，也可以看到它们。默认值为false.需要icon-image',
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
                    type: 'exprComp',
                    field: 'iconOptional',
                    title: '图标重叠选项',
                    collapse: "图标设置",
                    value: data.iconOptional,
                    info: '如果为true，则当图标与其他符号冲突但文本没有冲突时，将显示文本而不显示相应的图标。默认值为false.同时需要icon-image，text-field属性',
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
                    type: 'exprComp',
                    field: 'iconSize',
                    title: '缩放图标大小',
                    collapse: "图标设置",
                    value: data.iconSize,
                    info: '按提供的因子缩放图标的原始大小。图像的新像素大小将是原始像素大小乘以icon-size。例如1为原尺寸；3为原始图像放大三倍。可选值大于等于1，默认值为1，需要icon-image属性',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'radio',
                    field: 'iconTextFit',
                    title: '缩放图标以适应相关文本',
                    collapse: "图标设置",
                    value: data.iconTextFit,
                    info: '缩放图标以适应相关文本。可选值有”none”,”width”,”height”,”both”.默认值为”none”。需要 icon-image，text-field属性。',
                    options:[
                        {value:"none",label:"图标以其固有的纵横比显示"},
                        {value:"width",label:"图标在x维中缩放以适应文本的宽度"},
                        {value:"height",label:"图标在y维度中缩放以适应文本的高度"},
                        {value:"both",label:"图标在x和y两个维度上都进行缩放"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconTextFitPadding',
                    title: '图标文本匹配尺寸Padding大小',
                    collapse: "图标设置",
                    value: data.iconTextFitPadding,
                    info: '添加到由图标文本匹配确定的尺寸的附加区域的大小，按顺时针顺序：顶部、右侧、底部、左侧。接收数组形式的参数。单位是像素。默认值是[0,0,0,0].需要icon-image，text-field.icon-text-fit设为”both”,or “width”,”height”',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '数组格式如[0,0,0,0],表示顶部、右侧、底部、左侧',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconPadding',
                    title: '图标边界填充大小',
                    collapse: "图标设置",
                    value: data.iconPadding,
                    info: '用于检测符号冲突的图标边界框周围的附加区域的大小。可选值大于等于1.单位是像素默认值为1.需要icon-image',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconKeepUpright',
                    title: '图标防止颠倒呈现',
                    collapse: "图标设置",
                    value: data.iconKeepUpright,
                    info: '如果为true，则翻转图标以防止其颠倒呈现。默认值为false.需要icon-image，需要icon-rotation-alignment设置为”map”。需要symbol-placement设置为”line”或者”line-center”',
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
                    type: 'exprComp',
                    field: 'iconColor',
                    title: 'SDF图标颜色',
                    collapse: "图标设置",
                    value: data.iconColor,
                    info: '只用于sdf图标，决定了图表的颜色。默认值为"#000000".需要icon-image。',
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconHaloColor',
                    title: 'SDF图标光圈颜色',
                    collapse: "图标设置",
                    value: data.iconHaloColor,
                    info: '仅用于SDF图标，决定图标光圈的颜色。默认值为"rgba(0, 0, 0, 0)"。需要icon-image。',
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconHaloWidth',
                    title: '光圈到图标轮廓的距',
                    collapse: "图标设置",
                    value: data.iconHaloWidth,
                    info: '光圈到图标轮廓的距离。参数为大于等于0的数值型。单位为像素。默认值为0.需要icon-image',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconHaloBlur',
                    title: '图标的光晕模糊宽度',
                    collapse: "图标设置",
                    value: data.iconHaloBlur,
                    info: '图标的光晕模糊宽度,往外淡出光环。参数为大于等于0的数值型。单位为像素。默认值为0.需要icon-image。',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'iconTranslate',
                    title: '图标平移距离',
                    collapse: "图标设置",
                    value: data.iconTranslate,
                    info: '图标的定位点从其原始位置移动的距离。正值表示向右和向下，负值表示向左和向上。接收数值型组成的数组。单位为像素。默认值为[0,0]需要icon-image。',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: '数组格式如[0,0],正值表示向右和向下',
                    }
                },
                {
                    type: 'radio',
                    field: 'iconTranslateAnchor',
                    title: '图标平移锚点',
                    collapse: "图标设置",
                    value: data.iconTranslateAnchor,
                    info: '控制icon-translatede的参考系。可选值有”map”,”viewport”。默认值是map。“map”表示该线相对于地图平移。”viewport”表示相对于视窗平移。',
                    options:[
                        {value:"map",label:"相对于地图平移"},
                        {value:"viewport",label:"相对于视口平移"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textField',
                    title: '文本标签字段',
                    collapse: "文本设置",
                    value: data.textField,
                    info: `用于文本标签的值。如['get','text']，如果提供了纯字符串，它将被视为使用默认/继承格式选项格式化的字符串。`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: `用于文本标签的值。如['get','text']`,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textFont',
                    title: '文本字体',
                    collapse: "文本设置",
                    value: data.textFont,
                    info: `用于显示文本的字体堆栈。接收的参数为字符串组成的数组。默认值为 ["Open Sans Regular","Arial Unicode MS Regular"]，需要text-field`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: ``,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textSize',
                    title: '文本字体大小',
                    collapse: "文本设置",
                    value: data.textSize,
                    info: '文本字体大小。可选值大于等于0单位为像素。默认值为16.需要text-field.',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textAllowOverlap',
                    title: '文本允许重叠',
                    collapse: "文本设置",
                    value: data.textAllowOverlap,
                    info: '如果为true，则即使文本与以前绘制的其他符号冲突，文本也将可见。默认值为false。需要text-field',
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
                    type: 'exprComp',
                    field: 'textColor',
                    title: '文本颜色',
                    collapse: "文本设置",
                    value: data.textColor,
                    info: '文本绘制的颜色。属于绘制属性。默认值为"#000000"，需要text-field',
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textOpacity',
                    title: '文本透明度',
                    collapse: "文本设置",
                    value: data.textOpacity,
                    info: '文本绘制的透明度。可选值在0到1之间。默认值为1.需要text-field。',
                    props: {
                        childType: "InputNumber",
                        step: 0.000001,
                        min: 0,
                        max: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textOffset',
                    title: '文本与其锚点偏移距离',
                    collapse: "文本设置",
                    value: data.textOffset,
                    info: '文本与其锚点的偏移距离。正值表示向右和向下，负值表示向左和向上。接收参数为一个数组。默认值为[0,0]需要text-field。设置text-radial-offset时失效。',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '数组格式如[1,1],正值表示向右和向下',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textRotate',
                    title: '文本顺时针旋转角度',
                    collapse: "文本设置",
                    value: data.textRotate,
                    info: '文本顺时针旋转的角度。可选值为数数值型。单位为角度.默认值为0.需要text-field属性',
                    props: {
                        childType: "InputNumber",
                        step: 0.00001,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textPadding',
                    title: '文本填充间距',
                    collapse: "文本设置",
                    value: data.textPadding,
                    info: '可选值大于等于0.单位是像素，默认值为2。需要text-field属性。',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textKeepUpright',
                    title: '文本防止颠倒呈现',
                    collapse: "文本设置",
                    value: data.textKeepUpright,
                    info: '如果为true，则翻转text以防止其颠倒呈现。属于布局属性，默认值为true.需要text-field，需要text-rotation-alignment设置为”map”。需要symbol-placement设置为”line”或者”line-center”',
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
                    type: 'exprComp',
                    field: 'textMaxWidth',
                    title: '文本换行最大线宽',
                    collapse: "文本设置",
                    value: data.textMaxWidth,
                    info: '文本换行的最大线宽。可选值为大于等于的数。单位为ems.默认值为10.需要text-field',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textLineHeight',
                    title: '文本行高',
                    collapse: "文本设置",
                    value: data.textLineHeight,
                    info: '参数为数值型。单位为字符。默认值为1.2需要text-field。',
                    props: {
                        childType: "InputNumber",
                        step: 0.0001,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textLetterSpacing',
                    title: '文本字间距',
                    collapse: "文本设置",
                    value: data.textLetterSpacing,
                    info: '参数为数值型。单位是字符。默认值为0.需要text-field。',
                    props: {
                        childType: "InputNumber",
                        step: 0.01,
                        placeholder: '',
                    }
                },
                {
                    type: 'radio',
                    field: 'textJustify',
                    title: '文本对齐选项',
                    collapse: "文本设置",
                    value: data.textJustify,
                    info: '文本对齐选项。可选值为"auto", "left", "center", "right".默认值为“center”需要text-field',
                    options:[
                        {value:"auto",label:"文本与定位点位置对齐"},
                        {value:"left",label:"文本左对齐"},
                        {value:"center",label:"文本居中对齐"},
                        {value:"right",label:"文本右对齐"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'textAnchor',
                    title: '文本锚定位置',
                    collapse: "文本设置",
                    value: data.textAnchor,
                    info: '决定文本锚定的位置。属于布局属性。可选值有"center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right".默认值为“center”需要text-field',
                    options:[
                        {value:"center",label:"center"},
                        {value:"left",label:"left"},
                        {value:"right",label:"right"},
                        {value:"top",label:"top"},
                        {value:"bottom",label:"bottom"},
                        {value:"top-left",label:"top-left"},
                        {value:"top-right",label:"top-right"},
                        {value:"bottom-left",label:"bottom-left"},
                        {value:"bottom-right",label:"bottom-right"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'textRotationAlignment',
                    title: '文本旋转对齐',
                    collapse: "文本设置",
                    value: data.textRotationAlignment,
                    info: '结合symbol-placement，确定形成文本的各个图示符的旋转行为。可选值为”map”,”viewport”,”auto”。需要text-field.',
                    options:[
                        {value:"map",label:"地图"},
                        {value:"viewport",label:"视口"},
                        {value:"auto",label:"自动"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'textPitchAlignment',
                    title: '地图倾斜时文本的方向',
                    collapse: "文本设置",
                    value: data.textPitchAlignment,
                    info: '决定地图倾斜时文本的方向',
                    options:[
                        {value:"map",label:"文本与地图平面对齐"},
                        {value:"viewport",label:"文本与视口平面对齐"},
                        {value:"auto",label:"根据文本旋转对齐值自动匹配"},
                    ],
                    props: {
                    }
                },
               
                {
                    type: 'exprComp',
                    field: 'textMaxAngle',
                    title: '相邻字符之间的最大角度',
                    collapse: "文本设置",
                    value: data.textMaxAngle,
                    info: '相邻字符之间的最大角度变化。属于布局属性。参数为数值型，单位是角度。默认值为45°。需要text-field，并且需要symbol-placement设置为”line”或”line-center”。',
                    props: {
                        childType: "InputNumber",
                        step: 0.0001,
                        placeholder: '',
                    }
                },
                {
                    type: 'radio',
                    field: 'textWritingMode',
                    title: '文本书写模式',
                    collapse: "文本设置",
                    value: data.textWritingMode,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: "数组格式如['horizontal','vertical']",
                    }
                },
                {
                    type: 'radio',
                    field: 'textTransform',
                    title: '文本平移',
                    collapse: "文本设置",
                    value: data.textTransform,
                    info: '指定如何将文本大写，类似于CSS text-transform属性。可选值为"none", "uppercase", "lowercase"默认值为"none"。需要text-field。',
                    options:[
                        {value:"none",label:"none"},
                        {value:"uppercase",label:"uppercase"},
                        {value:"lowercase",label:"lowercase"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textRadialOffset',
                    title: '文字径向偏移',
                    collapse: "文本设置",
                    value: data.textRadialOffset,
                    info: '文字在符号定位方向上的径向偏移。与text-variable-anchor结合使用非常有用。参数为数值型。单位为字符。默认值为0.当设置text-offset时失效。',
                    props: {
                        childType: "InputNumber",
                        step: 0.01,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textVariableAnchor',
                    title: '文本动态选择的可能锚点列表',
                    collapse: "文本设置",
                    value: data.textVariableAnchor,
                    info: `要增加在地图上放置高优先级标签的机会，可以提供一个文本锚定位置数组：渲染将按顺序在每个位置放置标签，然后再移动到下一个标签。可选值为数组，可选的值有"center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"。需要symbol-placement为“point”.当设置text-anchor.text-offset时无效.若要使用偏移，请使用text-radial-offset，而不是text-offset。`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        placeholder: ``,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textIgnorePlacement',
                    title: '文本忽略碰撞',
                    collapse: "文本设置",
                    value: data.textIgnorePlacement,
                    info: '如果为true，则即使其他符号与文本冲突，也可以看到它们。默认值为false.需要text-field',
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
                    type: 'exprComp',
                    field: 'textOptional',
                    title: '文本重叠选项',
                    collapse: "文本设置",
                    value: data.textOptional,
                    info: '如果为true，则当文本与其他符号冲突且图标没有冲突时，图标将显示而不显示相应的文本。默认值为false.需要icon-image。',
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
                    type: 'exprComp',
                    field: 'textHaloColor',
                    title: '文本光圈颜色',
                    collapse: "文本设置",
                    value: data.textHaloColor,
                    info: '文本的光圈的颜色，有助于在背景上突出显示。属于绘制属性，默认值为"rgba(0, 0, 0, 0)"。需要text-field。',
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textHaloWidth',
                    title: '光圈到字体轮廓的距离',
                    collapse: "文本设置",
                    value: data.textHaloWidth,
                    info: '光圈到字体轮廓的距离。光圈最大宽度不能超过字体的四分之一。参数为大于等于0的数值型。单位为像素。默认值为0。需要text-field。',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textHaloBlur',
                    title: '文本的光晕模糊宽度',
                    collapse: "文本设置",
                    value: data.textHaloBlur,
                    info: '文本的光晕模糊宽度,往外淡出光环。参数为大于等于0的数值型。单位为像素。默认值为0.需要text-field。',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textTranslate',
                    title: '文本平移距离',
                    collapse: "文本设置",
                    value: data.textTranslate,
                    info: '文本的定位点从其原始位置移动的距离。正值表示向右和向下，负值表示向左和向上。属于绘制属性，接收数值型组成的数组。单位为像素。默认值为[0,0]。需要text-filed。',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '数组格式如[0,0],正值表示向右和向下',
                    }
                },
                {
                    type: 'radio',
                    field: 'textTranslateAnchor',
                    title: '文本平移锚点',
                    collapse: "文本设置",
                    value: data.textTranslateAnchor,
                    info: '控制text-translatede的参考系。可选值有”map”,”viewport”。默认值是map。“map”表示该线相对于地图平移。”viewport”表示相对于视窗平移。',
                    options:[
                        {value:"map",label:"相对于地图平移"},
                        {value:"viewport",label:"相对于视口平移"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'symbolPlacement',
                    title: '符号放置位置',
                    collapse: "符号设置",
                    value: data.symbolPlacement,
                    info: '决定标签相对于几何体的位置。属于布局属性。可选值”point””line””line-center”默认值为”point”，“point”: 标签放置在几何图形所在的点上。"line":标签沿几何图形的直线放置。只能用于线和多边形几何图形。"line-center":标签放置在几何图形线的中心。只能用于线型和多边形几何体。',
                    options:[
                        {value:"point",label:"几何图形所在的点上"},
                        {value:"line",label:"几何图形的直线上放置"},
                        {value:"line-center",label:"几何图形线的中心"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'exprComp',
                    field: 'symbolSpacing',
                    title: '两个符号距离',
                    collapse: "符号设置",
                    value: data.symbolSpacing,
                    info: '决定两个符号中心点之间的距离。可选值大于等于1.单位是像素。默认值为250.需要symbol-placement属性设置为”line”',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'symbolAvoidEdges',
                    title: '符号避免碰撞',
                    collapse: "符号设置",
                    value: data.symbolAvoidEdges,
                    info: "若该值true，为了避免碰撞，符号将不会穿过瓦片边缘。建议在矢量瓦片中没有足够的填充来防止冲突的图层中使用，或者如果是放置在线符号层之后的点符号层中使用。默认值为false",
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
                    type: 'radio',
                    field: 'symbolZOrder',
                    title: '重叠符号顺序',
                    collapse: "符号设置",
                    value: data.symbolZOrder,
                    info: '控制渲染同一层中重叠符号的顺序。可选值为”auto”,”viewpoprt-y”,”source”，默认值为”auto”。"auto":如果设置了符号排序键，则根据该键进行排序。否则，按符号相对于视口的y位置对符号进行排序。"viewport-y":按符号相对于视口的y位置对符号进行排序。"source":符号将以与源数据相同的顺序呈现，而不应用排序',
                    options:[
                        {value:"auto",label:"自动"},
                        {value:"viewport-y",label:"相对于视口的y位置"},
                        {value:"source",label:"与源数据相同的顺序呈现"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'Switch',
                    field: 'isHoverPointer',
                    title: '鼠标悬浮事件',
                    collapse: "符号设置",
                    value: data.isHoverPointer,
                    props: {
                    }
                },
                {
                    type: 'Switch',
                    field: 'isHoverFeatureState',
                    title: '悬浮实体状态',
                    collapse: "符号设置",
                    value: data.isHoverFeatureState,
                    props: {
                    }
                }
            ]
        }
    }
};