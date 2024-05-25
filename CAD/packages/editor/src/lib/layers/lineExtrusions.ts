import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import fillExtrusion from './fillExtrusion'
export default {
    name: '线拉伸',
    title: '线拉伸设置',
    collapse: "线图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M417.28 969.386667a79.189333 79.189333 0 0 1-35.413333-8.533334L123.306667 832a126.634667 126.634667 0 0 1-69.973334-113.493333v-244.053334a78.762667 78.762667 0 0 1 37.546667-67.413333 80.469333 80.469333 0 0 1 41.728-11.861333 78.805333 78.805333 0 0 1 35.498667 8.533333l258.56 128.853333a126.506667 126.506667 0 0 1 69.973333 113.493334v244.053333a79.402667 79.402667 0 0 1-79.36 79.274667zM132.693333 459.178667a18.048 18.048 0 0 0-8.106666 2.133333 15.232 15.232 0 0 0-7.253334 13.226667v244.053333a62.506667 62.506667 0 0 0 34.56 56.32l258.133334 129.237333a15.488 15.488 0 0 0 6.954666 1.706667 17.365333 17.365333 0 0 0 7.978667-2.133333 15.146667 15.146667 0 0 0 7.253333-13.226667V646.4a62.421333 62.421333 0 0 0-34.56-56.277333L139.52 460.8a14.762667 14.762667 0 0 0-6.826667-1.621333zM606.677333 969.386667a79.445333 79.445333 0 0 1-79.36-79.36v-244.053334a126.506667 126.506667 0 0 1 69.973334-113.493333l258.133333-129.194667a80.213333 80.213333 0 0 1 35.626667-8.533333 79.232 79.232 0 0 1 79.146666 79.274667v244.053333a126.634667 126.634667 0 0 1-69.973333 113.493333l-258.133333 129.28a74.666667 74.666667 0 0 1-35.413334 8.533334z m284.586667-510.293334a14.805333 14.805333 0 0 0-6.826667 1.706667l-258.133333 129.28a62.464 62.464 0 0 0-34.56 56.405333v244.053334a15.061333 15.061333 0 0 0 7.253333 13.226666 13.738667 13.738667 0 0 0 7.594667 2.261334 16.298667 16.298667 0 0 0 7.338667-1.834667l258.133333-129.365333a62.549333 62.549333 0 0 0 34.56-56.32v-244.053334a15.232 15.232 0 0 0-7.253333-13.269333 18.901333 18.901333 0 0 0-8.106667-2.090667z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const fillExtrusionFactory = fillExtrusion.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "动画设置", "绘制设置"],
            default: {
                fillExtrusionColor: "#00ffff",
                fillExtrusionHeight: 500000,
                anmiDuration: 0,
                offsetLine: 10,
            },
            rule: [
                ...fillExtrusionFactory.rule,
                {
                    type: 'InputNumber',
                    field: 'offsetLine',
                    title: '线扩展大小',
                    collapse: "绘制设置",
                    value: data.offsetLine,
                    props: {
                        step: 0.0001
                    }
                },
                {
                    type: 'Switch',
                    field: 'isBreakLine',
                    title: '打散成线段',
                    collapse: "绘制设置",
                    value: data.isBreakLine,
                    props: {
                    }
                },
                {
                    type: 'InputNumber',
                    field: 'anmiDuration',
                    title: '动画持续时长(秒)',
                    collapse: "动画设置",
                    value: data.anmiDuration,
                    props: {
                        step: 1,
                        placeholder: '时长为0表示没有动画',
                    }
                },
                {
                    type: 'InputNumber',
                    field: 'anmiRepeat',
                    title: '动画持续次数',
                    collapse: "动画设置",
                    value: data.anmiRepeat,
                    props: {
                        step: 1,
                        placeholder: '次数为0表示无限循环',
                    }
                },
                {
                    type: 'radio',
                    field: 'anmiRepeatType',
                    title: '动画重复类型',
                    collapse: "动画设置",
                    value: data.anmiRepeatType,
                    options:[
                        {value:"reverse",label:"reverse"},
                        {value:"loop",label:"loop"},
                        {value:"mirror",label:"mirror"}
                    ],
                    props: {
                    }
                },
            ]
        }
    }
};