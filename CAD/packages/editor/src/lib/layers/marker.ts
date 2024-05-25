import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '点标记',
    title: '点标记设置',
    collapse: "点图层",
    icon: `M658.285714 365.714286c0-80.566857-65.718857-146.285714-146.285714-146.285715s-146.285714 65.718857-146.285714 146.285715 65.718857 146.285714 146.285714 146.285714 146.285714-65.718857 146.285714-146.285714z m146.285715 0c0 34.852571-3.986286 70.838857-18.870858 102.290285L577.682286 910.299429C565.686857 935.460571 539.392 950.857143 511.963429 950.857143s-53.723429-15.433143-65.133715-40.557714L238.262857 468.004571C223.414857 436.589714 219.392 400.566857 219.392 365.714286c0-161.718857 130.852571-292.571429 292.571429-292.571429s292.571429 130.852571 292.571428 292.571429z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置", "信息窗口"],
            default: {
                color: '#3FB1CE',
                closeButton: true,
                closeOnClick: true
            },
            rule: [
                ...basic(data, form, mapApp),
                {
                    type: "InputNumber",
                    field: 'minzoom',
                    title: '最小级别',
                    collapse: "数据设置",   
                    value: data.minzoom,
                    props: {
                        min: 0,
                        max: 24,
                        placeholder: '请输入0-24级别中的一个级别',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'maxzoom',
                    title: '最大级别',
                    collapse: "数据设置",  
                    value: data.maxzoom,
                    props: {
                        min: 0,
                        max: 24,
                        placeholder: '请输入0-24级别中的一个级别',
                    }
                },
                {
                    type: 'select',
                    field: 'disableTimerUpdate',
                    title: '不允许动态更新',
                    collapse: "数据设置",
                    value: data.disableTimerUpdate,
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
                    type: 'select',
                    field: 'isDrawLinePoint',
                    title: '绘制点时包括线上所有点',
                    collapse: "数据设置",
                    value: data.isDrawLinePoint,
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
                    props: {
                       
                    }
                },
                {
                    type: 'exprComp',
                    field: 'color',
                    title: '颜色',
                    collapse: "绘制设置",  
                    value: data.color || '#3FB1CE',
                    props: {
                        childType: "ColorPicker",
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: 'exprComp',
                    field: 'offset',
                    title: '偏离XY像素值',
                    collapse: "绘制设置",
                    value: data.offset,
                    info: `以像素为单位的偏移量，对象相对于元素的中心。负数表示向左和向上。`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: `如[0,0]`,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'rotation',
                    title: '旋转角度',
                    collapse: "绘制设置",  
                    value: data.rotation,
                    info: '标记相对于其各自rotationAlignment设置的旋转角度（以度为单位）。正值将顺时针旋转标记。（可选，默认0）',
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 0.0001,
                    }
                },
                {
                    type: 'radio',
                    field: 'anchor',
                    title: '标记锚点位置',
                    collapse: "绘制设置",
                    value: data.anchor,
                    info: '缺省为center',
                    options:[
                        {value:"center",label:"center"},
                        {value:"top",label:"top"},
                        {value:"bottom",label:"bottom"},
                        {value:"left",label:"left"},
                        {value:"right",label:"right"},
                        {value:"top-left",label:"top-left"},
                        {value:"top-right",label:"top-right"},
                        {value:"bottom-left",label:"bottom-left"},
                        {value:"bottom-right",label:"bottom-right"}
                    ],
                    props: {
                    }
                },
                {
                    type: 'select',
                    field: 'draggable',
                    title: '是否可拖动',
                    collapse: "绘制设置",
                    value: data.draggable,
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
                    props: {
                       
                    }
                },
                {
                    type: 'select',
                    field: 'animationType',
                    title: '动画类型',
                    collapse: "绘制设置",
                    value: data.animationType,
                    options: [{
                        label: "",
                        value: undefined
                    },{
                        label: "无动画",
                        value: "MAP_ANIMATION_NONE"
                    },{
                        label: "弹跳",
                        value: "MAP_ANIMATION_BOUNCE"
                    },{
                        label: "坠落",
                        value: "MAP_ANIMATION_DROP"
                    }],
                    props: {
                      
                    }
                },
                {
                    type: 'radio',
                    field: 'rotationAlignment',
                    title: '旋转对齐',
                    collapse: "绘制设置",
                    value: data.rotationAlignment,
                    info: `map将 与Marker地图平面对齐。viewport将 与Marker视口平面对齐。auto自动匹配 的值rotationAlignment。（可选，默认'auto'）`,
                    options:[
                        {value:"auto",label:"自动"},
                        {value:"map",label:"相对于地图"},
                        {value:"viewport",label:"相对于视口"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'radio',
                    field: 'pitchAlignment',
                    title: '倾斜对齐',
                    collapse: "绘制设置",
                    value: data.pitchAlignment,
                    info: `map对齐Marker相对于地图的旋转，在地图旋转时保持方位角。相对于视口viewport对齐Marker的旋转，与地图旋转无关。auto相当于viewport。（可选，默认'auto'）`,
                    options:[
                        {value:"auto",label:"自动"},
                        {value:"map",label:"相对于地图"},
                        {value:"viewport",label:"相对于视口"},
                    ],
                    props: {
                    }
                },
                {
                    type: "InputNumber",
                    field: 'scale',
                    title: '缩放比例',
                    collapse: "绘制设置",  
                    value: data.scale,
                    info: '则用于默认标记的比例。默认比例对应于 的高度41px和宽度27px。（可选，默认1）',
                    props: {
                       step: 0.0001,
                    }
                },
                {
                    type: "InputNumber",
                    field: 'scaleMaxZoom',
                    title: '能缩放的最大级别',
                    collapse: "绘制设置",  
                    value: data.scaleMaxZoom,
                    info: '设置能缩放的最大级别。如果小于这个级别，div将根据缩小级别自动缩小比例。默认不会自动缩放',
                    props: {
                        min: 0,
                        max: 24,
                        placeholder: '请输入0-24级别中的一个级别',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'height',
                    title: '高度值',
                    collapse: "绘制设置",  
                    value: data.height,
                    info: '单位m，如1000000',
                    props: {
                        childType: "InputNumber",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1,
                    }
                },
                {
                    type: 'select',
                    field: 'removeWhenNoInMapView',
                    title: '视图范围内自动显隐',
                    collapse: "绘制设置",
                    value: data.removeWhenNoInMapView,
                    info: '设置当marker不在当前地图视图范围内时，将自动移除。进入视图范围内时，将自动增加上',
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
                    field: 'removeWhenNoInMapViewPadding',
                    title: '视图范围内自动显隐Padding像素范围',
                    collapse: "绘制设置",  
                    value: data.removeWhenNoInMapViewPadding,
                    info: '设置当marker不在当前地图视图范围内时，将自动移除。范围向外扩的像素范围，默认500px，向视图范围往外扩些像素，在平移的时候，能看到marker，体验效果好些',
                    props: {
                        step: 1,
                    }
                },
                {
                    type: "InputNumber",
                    field: 'clickTolerance',
                    title: '点击像素容差',
                    collapse: "绘制设置",  
                    value: data.clickTolerance,
                    info: '用户在点击标记期间可以移动鼠标指针的最大像素数，以便将其视为有效点击（与标记拖动相反）。默认是继承地图的clickTolerance。（可选，默认0）',
                    props: {
                        step: 1,
                    }
                },
                {
                    type: "Input",
                    field: 'customImage',
                    title: '自定义图片地址',
                    collapse: "绘制设置",  
                    value: data.customImage,
                    info: '图片地址或base64图片内容或svg内容',
                    props: {
                        clearable: true
                    }
                },
                {
                    type: 'InputNumber',
                    field: 'customImageWidth',
                    title: '自定义图片宽',
                    collapse: "绘制设置",  
                    value: data.customImageWidth,
                    props: {
                        step: 1,
                    }
                },
                {
                    type: 'InputNumber',
                    field: 'customImageHeight',
                    title: '自定义图片高',
                    collapse: "绘制设置",  
                    value: data.customImageHeight,
                    props: {
                        step: 1,
                    }
                },
                {
                    type: 'monacoEditor',
                    field: 'customHtml',
                    title: '自定义Html元素',
                    collapse: "绘制设置",  
                    value: data.customHtml ?? '',
                    info: `写js创建自定义html,如let el = document.createElement('div');el.style.backgroundImage = 'url("image");return el;`,
                    style: {
                        height: '150px',
                        width: '100%'
                    },
                    props: {
                        language: 'javascript'
                    }
                },
                {
                    type: "Input",
                    field: 'popupHtml',
                    title: 'HTML内容',
                    collapse: "信息窗口",   
                    value: data.popupHtml,
                    props: {
                        type: "textarea",
                        rows: 3,
                        placeholder: '请输入信息窗口的html内容,props为内置属性变量',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'popupOffset',
                    title: '偏离XY像素值',
                    collapse: "信息窗口",
                    value: data.popupOffset,
                    info: `以像素为单位的偏移量，对象相对于元素的中心。负数表示向左和向上。`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: `如[0,0]`,
                    }
                },
                {
                    type: 'radio',
                    field: 'popupAnchor',
                    title: '信息窗口锚点位置',
                    collapse: "信息窗口",
                    value: data.popupAnchor,
                    info: '缺省为center',
                    options:[
                        {value:"center",label:"center"},
                        {value:"top",label:"top"},
                        {value:"bottom",label:"bottom"},
                        {value:"left",label:"left"},
                        {value:"right",label:"right"},
                        {value:"top-left",label:"top-left"},
                        {value:"top-right",label:"top-right"},
                        {value:"bottom-left",label:"bottom-left"},
                        {value:"bottom-right",label:"bottom-right"}
                    ],
                    props: {
                    }
                },
                {
                    type: 'select',
                    field: 'closeButton',
                    title: '显示关闭按钮',
                    collapse: "信息窗口",
                    value: data.closeButton,
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
                    type: 'select',
                    field: 'closeOnClick',
                    title: '单击地图时将关闭弹出窗口',
                    collapse: "信息窗口",
                    value: data.closeOnClick,
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
                    type: 'select',
                    field: 'closeOnMove',
                    title: '地图移动后关闭信息窗口',
                    collapse: "信息窗口",
                    value: data.closeOnMove,
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
                    type: 'select',
                    field: 'focusAfterOpen',
                    title: '尝试聚焦弹出窗口内的第一个可聚焦元素',
                    collapse: "信息窗口",
                    value: data.focusAfterOpen,
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
                    type: "Input",
                    field: 'className',
                    title: 'CSS类名称',
                    collapse: "信息窗口",   
                    value: data.className,
                    props: {
                        placeholder: '添加到弹出容器的以空格分隔的 CSS 类名',
                    }
                },
                {
                    type: "Input",
                    field: 'maxWidth',
                    title: '弹出窗口最大宽度的CSS属性的字符串',
                    collapse: "信息窗口",   
                    value: data.maxWidth,
                    info: `设置弹出窗口最大宽度的 CSS 属性的字符串，例如'300px'. 要确保弹出窗口调整大小以适合其内容，请将此属性设置为'none',可选，默认'240px'`,
                    props: {
                        placeholder: '',
                    }
                },
            ]
        }
    }
};