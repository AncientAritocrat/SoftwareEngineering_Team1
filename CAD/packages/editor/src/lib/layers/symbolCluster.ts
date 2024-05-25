import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import symbol from './symbol'
import marker from './marker'
export default {
    name: '点符号聚合',
    title: '点符号聚合设置',
    collapse: "点图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M694.879891 329.119949A73.119989 73.119989 0 1 1 767.99988 255.99996a73.279989 73.279989 0 0 1-73.119989 73.119989z m0-109.759983A36.639994 36.639994 0 1 0 731.359886 255.99996a36.799994 36.799994 0 0 0-36.479995-36.639994zM530.239917 585.119909a127.99998 127.99998 0 1 1 127.99998-127.99998 127.99998 127.99998 0 0 1-127.99998 127.99998z m0-219.359966a91.519986 91.519986 0 1 0 91.519986 91.359986 91.359986 91.359986 0 0 0-91.519986-91.359986zM639.9999 841.119869a91.519986 91.519986 0 1 1 91.359986-91.359986A91.359986 91.359986 0 0 1 639.9999 841.119869z m0-146.239978a54.879991 54.879991 0 1 0 54.879991 54.879992A55.039991 55.039991 0 0 0 639.9999 694.879891zM383.99994 658.239897a54.879991 54.879991 0 1 1 54.879991-54.879991A55.039991 55.039991 0 0 1 383.99994 658.239897z m0-73.119988a18.399997 18.399997 0 1 0 18.239997 18.239997A18.239997 18.239997 0 0 0 383.99994 585.119909zM493.759923 109.759983a54.879991 54.879991 0 1 1 54.879991-54.879992 55.039991 55.039991 0 0 1-54.879991 54.879992z m0-73.119989A18.239997 18.239997 0 1 0 511.99992 54.879991a18.399997 18.399997 0 0 0-18.239997-18.239997zM347.359946 1023.99984a91.519986 91.519986 0 1 1 91.519985-91.359986A91.359986 91.359986 0 0 1 347.359946 1023.99984z m0-146.239977a54.879991 54.879991 0 1 0 54.879991 54.879991 54.879991 54.879991 0 0 0-54.879991-54.879991zM219.359966 329.119949A73.119989 73.119989 0 1 1 292.639954 255.99996a73.279989 73.279989 0 0 1-73.279988 73.119989z m0-109.759983A36.639994 36.639994 0 1 0 255.99996 255.99996a36.639994 36.639994 0 0 0-36.639994-36.639994zM932.639854 511.99992A91.519986 91.519986 0 1 1 1023.99984 420.639934 91.519986 91.519986 0 0 1 932.639854 511.99992z m0-146.239977a54.879991 54.879991 0 1 0 54.719992 54.879991 55.039991 55.039991 0 0 0-54.719992-54.879991zM877.759863 914.239857a73.119989 73.119989 0 1 1 73.119988-73.119988 73.279989 73.279989 0 0 1-73.119988 73.119988z m0-109.599983a36.639994 36.639994 0 1 0 36.479994 36.479995 36.639994 36.639994 0 0 0-36.479994-36.479995zM73.119989 694.879891a73.119989 73.119989 0 1 1 73.119988-73.119988 73.279989 73.279989 0 0 1-73.119988 73.119988z m0-109.759982a36.639994 36.639994 0 1 0 36.639994 36.639994 36.639994 36.639994 0 0 0-36.639994-36.639994z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const symbolFactory = symbol.factory(data, form, mapApp);
        const markerFactory = marker.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "聚合设置", "绘制设置"],
            default: {
                clusterMaxZoom: 10,
                clusterRadius: 60,
                outerColors: [[1000, 'rgba(253, 156, 115, 0.6)'], [100, 'rgba(241, 211, 87, 0.6)'], [0, 'rgba(181, 226, 140, 0.6)']],
                outerCircleRadius: 20,
                innerColors: [[1000, 'rgba(241, 128, 23, 0.6)'], [100, 'rgba(240, 194, 12, 0.6)'], [0, 'rgba(110, 204, 57, 0.6)']],
                innerCircleRadius: 15,
                clusterTextSize: 12,
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: "InputNumber",
                    field: 'clusterMaxZoom',
                    title: '聚合最大级别',
                    collapse: "聚合设置",  
                    value: data.clusterMaxZoom,
                    props: {
                        min: 0,
                        max: 24,
                        step: 1,
                    }
                },
                {
                    type: "InputNumber",
                    field: 'clusterRadius',
                    title: '聚合的半径',
                    collapse: "聚合设置",  
                    value: data.clusterRadius,
                    props: {
                        step: 1,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'outerColors',
                    title: '聚合外部圆值和颜色分级设置',
                    collapse: "聚合设置",
                    value: data.outerColors,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                    }
                },
                {
                    type: "InputNumber",
                    field: 'outerCircleRadius',
                    title: '聚合外部圆半径',
                    collapse: "聚合设置",  
                    value: data.outerCircleRadius,
                    props: {
                        step: 1,
                    }
                },
                {
                    type: 'exprComp',
                    field: 'innerColors',
                    title: '聚合内部圆值和颜色分级设置',
                    collapse: "聚合设置",
                    value: data.innerColors,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                    }
                },
                {
                    type: "InputNumber",
                    field: 'innerCircleRadius',
                    title: '聚合内部圆半径',
                    collapse: "聚合设置",  
                    value: data.innerCircleRadius,
                    props: {
                        step: 1,
                    }
                },
                {
                    type: "InputNumber",
                    field: 'clusterTextSize',
                    title: '聚合文本大小',
                    collapse: "聚合设置",  
                    value: data.clusterTextSize,
                    props: {
                        step: 1,
                    }
                },
                ...symbolFactory.rule.filter((r: any) => (r.collapse != "通用设置" && r.collapse != "数据设置")),
                ...markerFactory.rule.filter((r: any) => (r.collapse == "信息窗口")),
            ]
        }
    }
};