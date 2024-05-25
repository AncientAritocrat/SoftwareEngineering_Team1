import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '多边形',
    title: '多边形图层设置',
    collapse: "面图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M518.4 70.83l407.26 295.89c5.61 4.07 7.95 11.3 5.81 17.89L775.92 863.38a16.01 16.01 0 0 1-15.22 11.06H257.3c-6.93 0-13.07-4.46-15.22-11.06L86.52 384.62c-2.14-6.59 0.2-13.81 5.81-17.89L499.6 70.83a16 16 0 0 1 18.8 0z m-9.4 87.11L172.27 402.59l128.62 395.85h416.22l128.62-395.85L509 157.94z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
                fillColor: "#00ffff",
                fillOutlineColor: "#00ff00",
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'exprComp',
                    field: 'fillColor',
                    title: '填充颜色',
                    collapse: "绘制设置",
                    value: data.fillColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillOutlineColor',
                    title: '边框颜色',
                    collapse: "绘制设置",
                    value: data.fillOutlineColor,
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillOpacity',
                    title: '填充透明度',
                    collapse: "绘制设置",
                    value: data.fillOpacity,
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
                    field: 'fillPattern',
                    title: '填充图案',
                    collapse: "绘制设置",
                    value: data.fillPattern,
                    info: '填充图片类型，一定要与地图之前加载的图片名字一一对应,图像宽度必须是2的系数（2、4、8、…、512',
                    props: {
                        childType: "select",
                        placeholder: '', 
                        options: listMapImages(mapApp?.map),
                    }
                },
                {
                    type: 'exprComp',
                    field: 'fillTranslate',
                    title: '平移量',
                    collapse: "绘制设置",
                    value: data.fillTranslate,
                    info: '几何体的平移量。属于绘制属性。接收的参数是一个数组[x，y] ，其中负数分别表示左和上 。单位是像素,默认值是[0,0]',
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '数组格式如[1,1],表示左和上',
                    }
                },
                {
                    type: 'radio',
                    field: 'fillTranslateAnchor',
                    title: '平移参考系',
                    collapse: "绘制设置",
                    value: data.fillTranslateAnchor,
                    info: 'map表示该线相对于地图平移。viewport表示相对于视窗平移',
                    options:[
                        {value:"map",label:"相对于地图平移"},
                        {value:"viewport",label:"表示相对于视窗平移"},
                    ],
                    props: {
                    }
                },
                {
                    type: 'Switch',
                    field: 'fillAntialias',
                    title: '填充反锯齿',
                    collapse: "绘制设置",
                    value: data.fillAntialias,
                    props: {
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