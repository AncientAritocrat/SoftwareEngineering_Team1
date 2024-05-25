import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '信息窗口',
    title: '信息窗口设置',
    collapse: "点图层",
    icon: `M979.269891 84.667707H43.132605C17.572543 84.667707 0 102.24025 0 127.800312v682.134165c0 25.560062 17.572543 43.132605 43.132605 43.132606h306.720749l127.800312 153.360374c7.98752 7.98752 20.767551 17.572543 33.547582 17.572543s25.560062-4.792512 33.547582-17.572543l127.800312-153.360374h306.720749c25.560062 0 43.132605-17.572543 43.132605-43.132606V127.800312c0-25.560062-17.572543-43.132605-43.132605-43.132605zM937.734789 766.801872H664.561622c-20.767551 0-38.340094 7.98752-51.120124 20.767551 0 0 0 4.792512-4.792512 4.792511L511.201248 912.174727l-97.447738-119.812793s0-4.792512-4.792512-4.792511c-12.780031-12.780031-33.547582-20.767551-51.120124-20.767551H84.667707V170.932917h851.469578V766.801872z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置", "信息窗口"],
            default: {
                color: '#3FB1CE',
                html: "<span style='color:#0000ff'>index:${props.index}</span>",
                closeButton: true
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
                    type: "Input",
                    field: 'html',
                    title: 'HTML内容',
                    collapse: "绘制设置",   
                    value: data.html,
                    props: {
                        type: "textarea",
                        rows: 3,
                        placeholder: '请输入信息窗口的html内容,props为内置属性变量',
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
                    type: 'radio',
                    field: 'anchor',
                    title: '信息窗口锚点位置',
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
                    field: 'closeButton',
                    title: '显示关闭按钮',
                    collapse: "绘制设置",
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
                    collapse: "绘制设置",
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
                    collapse: "绘制设置",
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
                    collapse: "绘制设置",
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
                    collapse: "绘制设置",   
                    value: data.className,
                    props: {
                        placeholder: '添加到弹出容器的以空格分隔的 CSS 类名',
                    }
                },
                {
                    type: "Input",
                    field: 'maxWidth',
                    title: '弹出窗口最大宽度的CSS属性的字符串',
                    collapse: "绘制设置",   
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