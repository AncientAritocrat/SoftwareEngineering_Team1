import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '矢量瓦片',
    title: '矢量瓦片',
    collapse: "其他图层",
    matchSource: ['vector'], /* 匹配栅格图层的数据源 */
    icon: `M778.24 0H0v1024h1024V0zM491.52 491.52h-204.8v-204.8h204.8z m0 40.96v204.8h-204.8v-204.8z m40.96 0h204.8v204.8h-204.8z m0-40.96v-204.8h204.8v204.8z m204.8-454.88v209.12h-204.8V36.64z m-245.76 0v209.12h-204.8V36.64z m-454.88 0h209.12v209.12H36.64z m0 250.08h209.12v204.8H36.64z m0 245.76h209.12v204.8H36.64z m0 454.88V778.24h209.12v209.12z m250.08 0V778.24h204.8v209.12z m245.76 0V778.24h204.8v209.12z m454.88 0H778.24V778.24h209.12z m0-250.08H778.24v-204.8h209.12z m0-245.76H778.24v-204.8h209.12zM778.24 245.76V36.64h209.12v209.12z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "图层设置"],
            default: {
                
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp, false, true),
                
            ],
            
        }
    }
};