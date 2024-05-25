import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import symbol from './symbol'
import line from './line'
export default {
    name: '符号路径动画',
    title: '符号路径动画设置',
    collapse: "线图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M870.4 0a153.6 153.6 0 0 0-153.6 153.6c0 133.632 153.6 307.2 153.6 307.2s153.6-173.568 153.6-307.2a153.6 153.6 0 0 0-153.6-153.6z m0 230.4A76.8 76.8 0 1 1 947.2 153.6 76.8 76.8 0 0 1 870.4 230.4zM256 256a256 256 0 0 0-256 256c0 222.72 256 512 256 512s256-289.28 256-512a256 256 0 0 0-256-256z m0 384A128 128 0 1 1 384 512 128 128 0 0 1 256 640zM669.184 538.624a204.8 204.8 0 0 0-13.312 81.408v14.848h51.2v-13.312a159.232 159.232 0 0 1 9.216-61.44 129.024 129.024 0 0 1 5.632-11.776l-45.056-24.576q-4.096 6.656-7.68 14.848zM713.728 475.648l34.304 37.888a174.08 174.08 0 0 1 79.36-38.912l-11.264-51.2a224.768 224.768 0 0 0-102.4 52.224zM319.488 972.8l4.608 51.2c36.864-3.072 71.68-7.68 102.4-12.8l-8.704-51.2c-29.184 5.632-62.976 9.728-98.304 12.8zM606.72 892.928l-6.656 5.12 30.72 40.96 9.216-7.168a194.56 194.56 0 0 0 59.904-86.016l-48.64-16.896a141.824 141.824 0 0 1-44.544 64zM467.968 950.784l11.264 51.2a530.944 530.944 0 0 0 102.4-33.28l-20.992-47.104a487.424 487.424 0 0 1-92.672 29.184zM658.944 687.104c0 20.48 3.072 41.472 3.072 62.464v35.328l51.2 5.12a403.456 403.456 0 0 0 0-40.448c0-22.016 0-44.544-3.072-66.048z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const symbolFactory = symbol.factory(data, form, mapApp);
        const lineFactory = line.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "动画设置", "图标设置","文本设置","符号设置","绘制设置"],
            default: {
                drawPath: true,
                anmiDuration: 5,
                lineColor: '#75E7EF',
                lineOpacity: 0.4,
                lineWidth: 20,
                iconAllowOverlap: true,
                textAllowOverlap: true,
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'select',
                    field: 'drawPath',
                    title: '绘制路径线',
                    collapse: "动画设置",
                    value: data.drawPath,
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
                ...symbolFactory.rule.filter((r: any) => (r.collapse == "图标设置" || r.collapse == "文本设置" || r.collapse == "符号设置")),
                ...lineFactory.rule.filter((r: any) => (r.collapse == "绘制设置")),
            ]
        }
    }
};