import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import breathingMarker from './breathingMarker'
export default {
    name: '荧光点',
    title: '荧光点设置',
    collapse: "点图层",
    icon: `M510.894829 509.878686m-445.630407 0a435.481 435.481 0 1 0 891.260813 0 435.481 435.481 0 1 0-891.260813 0Z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const breathinFactory = breathingMarker.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "动画设置", "绘制设置"],
            default: {
                text: "ID:${props.index}",
                width: 20,
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