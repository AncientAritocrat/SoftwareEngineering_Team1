import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import breathingMarker from './breathingMarker'
export default {
    name: '旋转的文本框',
    title: '旋转的文本框设置',
    collapse: "点图层",
    icon: `M288.633235 288.699238l446.731484 0L735.364719 421.267533l-13.261025-0.088004c-7.720845-30.709419-16.270569-52.302203-25.91216-65.759703-9.639544-13.458523-22.638603-24.233937-39.127136-32.477692-9.16166-4.03285-25.345248-6.083555-48.682769-6.083555l-51.123354 0-0.611937 336.608388c-1.394766 23.839965 1.394766 18.059308 0 33.261545-0.611937 6.783497 13.173021 20.022009 21.375843 24.733311 8.28878 4.602831 33.500998 5.692652 47.63388 5.692652l19.107173 0 0 18.735713L378.145921 735.890186 378.145921 715.88762l21.98471 0c14.394848 0 31.495318-1.176802 40.045041-6.194072 6.457062-3.533476 26.959002-1.373277 27.176966-24.25338 0.87288-31.494295 2.7486-8.723685 0-31.974225L467.352639 316.857555l-50.906413 0c-33.414017 0-57.537438 6.957459-72.5432 21.00336-21.331841 19.629059-34.767851 47.197952-40.35101 83.491553l-15.485693 0L288.633235 288.699238zM958.709483 244.030899l0 536.025183c0 98.629321-79.960123 178.608887-178.718381 178.608887L243.964896 958.664969c-98.585319 0-178.674379-79.979566-178.674379-178.608887L65.290517 244.030899c0-98.717326 80.090083-178.696892 178.674379-178.696892l536.026206 0C878.74936 65.334008 958.709483 145.314597 958.709483 244.030899zM869.413737 288.699238c0-74.003458-60.067051-134.071532-134.049019-134.071532L288.633235 154.627706c-73.981968 0-133.919059 60.067051-133.919059 134.071532l0 446.601524c0 74.091462 59.937091 134.049019 133.919059 134.049019l446.731484 0c73.981968 0 134.049019-59.957557 134.049019-134.049019L869.413737 288.699238z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const breathinFactory = breathingMarker.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "动画设置", "绘制设置"],
            default: {
                text: "ID:${props.index}",
                width: 40,
                markerHeight: 20,
                color1: "#ff0000",
                color2: "#ffff00",
                textFontSize: 15,
                textColor: "#00ffff"
            },
            rule: [
                ...breathinFactory.rule
            ]
        }
    }
};