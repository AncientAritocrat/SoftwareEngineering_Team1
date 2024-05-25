import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import option  from './option';
import fillExtrusion from './fillExtrusion'
export default {
    name: '拉伸动画',
    title: '拉伸动画设置',
    collapse: "面图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M917.4 501l-168.8-63.3V248.1c0-26.2-16.3-49.6-40.9-58.9L533 123.7c-14.2-5.4-29.9-5.4-44.2 0l-174.7 65.5c-24.6 9.3-40.9 32.7-40.9 58.9v189.6L104.4 501c-24.5 9.3-40.7 32.7-40.7 58.9v192.4c0 23.8 13.5 45.6 34.8 56.3L273.2 896c17.6 8.9 38.6 8.9 56.3 0L511 805l181.5 90.9c17.6 8.9 38.6 8.9 56.3 0l174.7-87.4c21.3-10.7 34.8-32.5 34.8-56.3V559.9c0-26.2-16.2-49.7-40.9-58.9z m-228.2-61.9l-148.5 55.7V375.7L689.2 311v128.1zM332.8 245.7L511 179l178.2 66.7v1L511 319.1l-178.2-72.3v-1.1z m146.8 508.6L331 828.6V690.4l148.5-67.8v131.7z m0-195.7L301.3 631l-178.2-72.3v-1L301.3 491l178.2 66.7v0.9z m419.3 195.7l-148.5 74.3V690.4l148.5-67.8v131.7z m0-195.7L720.7 631l-178.2-72.3v-1L720.7 491l178.2 66.7v0.9z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const fillExtrusionFactory = fillExtrusion.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "动画设置", "绘制设置"],
            default: {
                fillExtrusionColor: "#00ffff",
                fillExtrusionHeight: 500000,
                anmiDuration: 2
            },
            rule: [
                ...fillExtrusionFactory.rule,
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