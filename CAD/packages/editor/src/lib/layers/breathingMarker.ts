import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '呼吸的光圈',
    title: '呼吸的光圈设置',
    collapse: "点图层",
    icon: `M512 512m-165.577982 0a165.577982 165.577982 0 1 0 331.155964 0 165.577982 165.577982 0 1 0-331.155964 0Z M512 244.256881c147.963303 0 267.743119 119.779817 267.743119 267.743119S659.963303 780.917431 512 780.917431 243.082569 659.963303 243.082569 512 364.036697 244.256881 512 244.256881m0-66.93578c-184.366972 0-334.678899 150.311927-334.678899 334.678899s150.311927 334.678899 334.678899 334.678899 334.678899-150.311927 334.678899-334.678899-150.311927-334.678899-334.678899-334.678899z M512 66.93578c245.431193 0 446.238532 199.633028 446.238532 446.238532s-199.633028 446.238532-446.238532 446.238532-446.238532-199.633028-446.238532-446.238532 200.807339-446.238532 446.238532-446.238532m0-66.93578C228.990826 0 0 228.990826 0 512s228.990826 512 512 512 512-228.990826 512-512S795.009174 0 512 0z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
                text: "ID:${props.index}",
                width: 80,
                markerHeight: 80,
                color1: "#ff0000",
                color2: "#ffff00",
                textFontSize: 15,
                textColor: "#00ffff"
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
                    field: 'text',
                    title: '文本内容',
                    collapse: "绘制设置",   
                    value: data.text,
                    info: "请输入文本内容,props为内置属性变量，如id:${props.index}",
                    props: {
                        type: "textarea",
                        rows: 3,
                        placeholder: '请输入文本内容,props为内置属性变量',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'width',
                    title: '像素宽度',
                    collapse: "绘制设置",   
                    value: data.width,
                    props: {
                        step: 1
                    }
                },
                {
                    type: "InputNumber",
                    field: 'markerHeight',
                    title: '像素高度',
                    collapse: "绘制设置",   
                    value: data.markerHeight,
                    props: {
                        step: 1
                    }
                },
                {
                    type: 'exprComp',
                    field: 'color1',
                    title: '颜色值一',
                    collapse: "绘制设置",  
                    value: data.color1,
                    props: {
                        childType: "ColorPicker",
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: 'exprComp',
                    field: 'color2',
                    title: '颜色值二',
                    collapse: "绘制设置",  
                    value: data.color2,
                    props: {
                        childType: "ColorPicker",
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textFontSize',
                    title: '字体大小',
                    collapse: "绘制设置",   
                    value: data.textFontSize,
                    props: {
                        childType: "ColorPicker",
                        hideExprButton: true,
                        disableAutoSwitchComp: true,
                        step: 1
                    }
                },
                {
                    type: 'exprComp',
                    field: 'textColor',
                    title: '字体颜色',
                    collapse: "绘制设置",  
                    value: data.textColor,
                    props: {
                        childType: "ColorPicker",
                        hideExprButton: true,
                        disableAutoSwitchComp: true
                    }
                },
                {
                    type: "Input",
                    field: 'textField',
                    title: '属性字段值',
                    collapse: "绘制设置",  
                    value: data.textField,
                    info: '字段内容位于哪个属性数据中（默认为name属性中去获取)',
                    props: {
                        clearable: true
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
                }
            ]
        }
    }
};