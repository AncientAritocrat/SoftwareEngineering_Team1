import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: 'svg覆盖物',
    title: 'svg覆盖物设置',
    collapse: "其他图层",
    matchSource: [''], 
    icon: `M290.559128 595.969284l20.991937-25.599923a87.551737 87.551737 0 0 0 60.15982 25.599923c27.391918 0 42.751872-12.799962 42.751872-31.999904s-15.359954-27.135919-36.351891-36.351891l-31.231907-13.567959a65.023805 65.023805 0 0 1-46.079861-59.135823 67.071799 67.071799 0 0 1 74.239777-62.207813 96.76771 96.76771 0 0 1 68.351795 28.671914l-18.687944 22.783932a71.935784 71.935784 0 0 0-49.663851-20.22394c-23.039931 0-38.143886 11.007967-38.143886 29.183913s18.175945 25.599923 36.60789 34.047897l30.975908 13.311961A62.975811 62.975811 0 0 1 450.302649 563.201382c0 36.351891-29.95191 65.791803-79.615761 65.791803a112.639662 112.639662 0 0 1-80.12776-33.023901zM462.846611 399.105875h37.887887l33.535899 116.991649c7.679977 25.599923 12.543962 47.871856 20.479939 73.983778h1.535995c7.679977-25.599923 13.31196-48.127856 20.479939-73.983778l33.535899-116.991649h36.351891l-70.655788 226.047322h-42.239873zM659.96602 512.001536c0-73.727779 45.567863-118.015646 105.215684-118.015646a90.11173 90.11173 0 0 1 67.327798 28.671914l-19.455941 22.783932a61.183816 61.183816 0 0 0-46.59186-20.22394c-41.983874 0-70.14379 32.511902-70.14379 85.759743s25.599923 86.52774 71.423786 86.52774a56.063832 56.063832 0 0 0 35.583893-11.007966v-52.479843h-44.543866v-29.183913h76.799769v98.047706a102.399693 102.399693 0 0 1-71.423785 25.599924c-60.15982 0.767998-104.191687-41.727875-104.191688-116.479651z M883.19735 1024h-639.99808A141.055577 141.055577 0 0 1 102.399693 883.200422v-742.397772A141.055577 141.055577 0 0 1 243.19927 0.003072h516.350451a89.087733 89.087733 0 0 1 63.231811 25.599923l189.695431 189.695431A38.399885 38.399885 0 0 1 1023.996928 243.202342v639.99808a141.055577 141.055577 0 0 1-140.799578 140.799578zM243.19927 76.802842A63.999808 63.999808 0 0 0 179.199462 140.80265v742.397772A63.999808 63.999808 0 0 0 243.19927 947.20023h639.99808a63.999808 63.999808 0 0 0 63.999808-63.999808V259.074295l-179.199462-179.199463a12.799962 12.799962 0 0 0-8.447975-3.07199z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置", "信息窗口"],
            default: {
              
            },
            rule: [
                ...basic(data, form, mapApp),
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
                {
                    type: 'select',
                    field: 'noUpdateBoundsWhenMoveend',
                    title: '不自动更新范围',
                    collapse: "绘制设置",
                    value: data.noUpdateBoundsWhenMoveend,
                    info: '当移动结束时不自动更新范围',
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
                    field: 'divClassName',
                    title: 'class类名称',
                    collapse: "绘制设置",   
                    value: data.divClassName,
                    props: {
                        placeholder: '',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'svgMaxWidth',
                    title: 'svg初始像素宽',
                    collapse: "绘制设置",  
                    info: "svg初始化时最大像素宽,默认1000",
                    value: data.svgMaxWidth,
                    props: {
                        placeholder: '1000',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'svgMaxHeight',
                    title: 'svg初始像素高',
                    collapse: "绘制设置",  
                    info: "svg初始化时最大像素高,默认1000",
                    value: data.svgMaxHeight,
                    props: {
                        placeholder: '1000',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'svgOffset',
                    title: 'svg初始偏移距离',
                    collapse: "绘制设置",  
                    info: "svg初始化时Offset像素距离,默认100 ",
                    value: data.svgOffset,
                    props: {
                        placeholder: '10',
                    }
                },
            ]
        }
    }
};