import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: 'div覆盖物',
    title: 'div覆盖物设置',
    collapse: "其他图层",
    matchSource: [''], 
    icon: `M122.88 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384H122.88c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H137.216c-26.112 0-47.104 20.992-47.104 47.104v688.128z M336.384 651.264H243.2V344.576h91.648c92.672 2.048 140.288 53.248 142.336 154.112 1.024 103.424-46.08 154.624-140.8 152.576z m1.536-257.536h-43.008v211.456h44.544c59.392 2.048 88.064-33.28 87.552-106.496 0-70.144-29.696-104.96-89.088-104.96zM517.12 344.576h51.712v59.392H517.12V344.576z m0 78.848h51.712v227.84H517.12V423.424zM748.032 423.424h53.248l-81.408 227.84h-43.008l-76.8-227.84h53.248l46.08 162.816 48.64-162.816z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
            },
            rule: [
                ...basic(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'bounds',
                    title: '范围',
                    collapse: "绘制设置",
                    value: data.bounds,
                    info: `左上角和右下角坐标，如[[0,0],[1,2]]；或四个角的坐标如[[0,0],[1,2],[3,3],[4,4]]`,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: `如[[0,0],[1,2]]`,
                    }
                },
                {
                    type: 'InputNumber',
                    field: 'width',
                    title: 'div像素宽',
                    collapse: "绘制设置",  
                    value: data.width,
                    props: {
                        step: 1,
                    }
                },
                {
                    type: 'InputNumber',
                    field: 'height',
                    title: 'div像素高',
                    collapse: "绘制设置",  
                    value: data.height,
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
                    type: "InputNumber",
                    field: 'minZoom',
                    title: '最小级别',
                    collapse: "绘制设置",   
                    value: data.minZoom,
                    props: {
                        min: 0,
                        max: 24,
                        placeholder: '请输入0-24级别中的一个级别',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'maxZoom',
                    title: '最大级别',
                    collapse: "绘制设置",  
                    value: data.maxZoom,
                    props: {
                        min: 0,
                        max: 24,
                        placeholder: '请输入0-24级别中的一个级别',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'maxPitch',
                    title: '显示最大倾斜角',
                    collapse: "绘制设置",  
                    value: data.maxPitch,
                    props: {
                        min: 0,
                        max: 90,
                        placeholder: '请输入0-90',
                    }
                },
                {
                    type: 'select',
                    field: 'updateDivSize',
                    title: '自动更新div大小',
                    collapse: "绘制设置",
                    value: data.updateDivSize,
                    info: '自动更新div大小，（如果需要svg放大，需要设置为true)',
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
                    field: 'maxDivSize',
                    title: 'div最大像素尺寸',
                    collapse: "绘制设置",  
                    info: "放大div时，最大的div大小，超过了就像素放大了",
                    value: data.maxDivSize,
                    props: {
                        min: 0,
                        placeholder: '',
                    }
                },
            ]
        }
    }
};