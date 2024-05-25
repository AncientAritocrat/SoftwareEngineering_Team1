import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '热力图',
    title: '热力图图层设置',
    collapse: "其他图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M781.981888 1014.033538C649.277769 945.497049 431.312619 990.61918 298.608501 972.93895 165.904382 955.25872 80.23377 832.725854 35.111639 706.301971-80.32183 383.00634 113.136746 295.287826 270.483965 302.387223 427.899447 309.691411 362.093496 148.180122 582.720919 27.558632 803.348343-93.062859 862.874059 217.126192 838.367485 287.574057 813.792648 358.021923 796.863316 425.32967 963.357836 601.858915 1129.852355 778.456422 914.686006 1082.706555 781.981888 1014.033538ZM891.408175 606.432565C745.66574 458.778754 743.413046 396.044657 768.397464 329.692597 789.900446 272.214785 777.886081 13.22331 589.478999 113.229243 401.071917 213.30344 457.730569 374.746465 324.207289 370.650659 190.615746 366.554852 7.601475 440.279363 102.28286 701.250477 139.281642 803.236049 225.976205 884.810855 338.474347 897.644381 450.972489 910.54617 634.259813 878.735409 746.211847 932.868314 858.163882 987.069481 1031.0069 747.874403 891.408175 606.432565ZM650.09693 792.51869C581.014333 766.646848 565.723324 679.337914 586.270618 607.388253 606.886175 535.302065 543.947288 435.773976 514.730537 379.866222 485.58205 323.753678 553.708959 197.671113 626.068201 178.352561 743.549573 146.95138 684.365175 331.7405 689.280142 455.092528 694.331636 578.444556 870.314773 658.79062 868.47166 734.28998 866.628548 809.789339 719.111263 818.458796 650.09693 792.51869ZM471.997627 693.058865C411.379696 748.01093 334.105487 776.886363 255.943853 750.604941 177.918747 724.255255 125.902009 596.124786 186.519939 541.991882 310.076758 431.541643 323.04681 547.179903 423.803641 498.098493 524.492209 449.085346 532.547294 638.106799 471.997627 693.058865Z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
                // heatmapWeight：表示一个点对热力图权重的贡献，在贡献越大的地方热力图显示应该越明显
                heatmapWeight:  [
                    'interpolate',
                    ['linear'],
                    ['get', 'value'],
                    0, // 因为上面用了0,100，最小和最大值，把这两个最小和最大值归化到0,1区间
                    0,
                    100,
                    1
                ],
                // heatmapRadius：热力图的一个点计算权重的时候计算的点的半径，单位为像素，默认为30
                heatmapRadius: [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, //0级别
                    10, //半径10
                    9, // 9级别 (其余级别，线性插值)
                    50 // 半径50
                ],
                // heatmapColor：热力图的颜色，设置在各个热力图的数值上是什么颜色
                heatmapColor: [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,
                    'rgba(33,102,172,0)',
                    0.2,
                    'rgb(103,169,207)',
                    0.4,
                    'rgb(209,229,240)',
                    0.6,
                    'rgb(253,219,199)',
                    0.8,
                    'rgb(239,138,98)',
                    1,
                    'rgb(178,24,43)'
                ],
                //heatmapIntensity：热力图强度，有点类似于heatmapWeight属性，但是该属性是设置整体上热力图的强度
                heatmapIntensity: [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    1,
                    9,
                    3
                ],
                //heatmapOpacity：热力图的透明度
                heatmapOpacity: [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    1,
                    9,
                    0
                ]
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'heatmapColor',
                    title: '热力图颜色',
                    collapse: "绘制设置",
                    value: data.heatmapColor,
                    info: '热力图的颜色，设置在各个热力图的数值上是什么颜色',
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'heatmapRadius',
                    title: '热力图半径',
                    collapse: "绘制设置",
                    value: data.heatmapRadius,
                    info: '热力图的一个点计算权重的时候计算的点的半径，单位为像素，默认为30',
                    props: {
                        childType: "InputNumber",
                        step: 1,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'heatmapOpacity',
                    title: '热力图透明度',
                    collapse: "绘制设置",
                    value: data.heatmapOpacity,
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
                    field: 'heatmapWeight',
                    title: '热力图权重',
                    collapse: "绘制设置",
                    value: data.heatmapWeight,
                    info: '表示一个点对热力图权重的贡献，在贡献越大的地方热力图显示应该越明显',
                    props: {
                        childType: "InputNumber",
                        step: 0.00001,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'heatmapIntensity',
                    title: '热力图强度',
                    collapse: "绘制设置",
                    value: data.heatmapIntensity,
                    info: '热力图强度，有点类似于heatmap-weight属性，但是该属性是设置整体上热力图的强度',
                    props: {
                        childType: "InputNumber",
                        step: 0.00001,
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