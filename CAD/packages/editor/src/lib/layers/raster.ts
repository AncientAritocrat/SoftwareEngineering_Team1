import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '栅格瓦片图像',
    title: '栅格瓦片图像',
    collapse: "其他图层",
    matchSource: ['raster','image','video'], /* 匹配栅格图层的数据源 */
    icon: `M912 252.032V179.968h-68.032V112h-71.936v68.032h-224V112H475.968v68.032h-224V112H180.032v68.032H112v71.936h68.032v224H112v72h68.032v224H112v72.064h68.032v67.968h71.936v-68.032h224v68.032h72v-68.032h224v68.032h72.064v-68.032h67.968v-71.936h-68.032v-224h68.032V475.968h-68.032v-224h68.032z m-660.032 0h224v224h-224v-224z m0 519.936v-224h224v224h-224z m520.064 0h-224v-224h224v224z m0-295.936h-224v-224h224v224z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "图层设置"],
            default: {
                
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp, false, true),
                {
                    type: "InputNumber",
                    field: 'rasterOpacity',
                    title: '图片的不透明度',
                    collapse: "图层设置",  
                    value: data.rasterOpacity,
                    info: '图片的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）',
                    props: {
                        min: 0,
                        max: 1,
                        step: 0.01,
                        placeholder: '可为空,默认为1',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'rasterHueRotate',
                    title: '旋转色相的角度',
                    collapse: "图层设置",  
                    value: data.rasterHueRotate,
                    info: '在色轮上旋转色相的角度（可选，默认值为 0，单位：角度）',
                    props: {
                        min: 0,
                        step: 1,
                        placeholder: '可为空,默认为0',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'rasterBrightnessMin',
                    title: '图片的最小亮度',
                    collapse: "图层设置",  
                    value: data.rasterBrightnessMin,
                    info: '图片的最小亮度（可选，取值范围为 0 ~ 1，默认值为 0）',
                    props: {
                        min: 0,
                        max: 1,
                        step: 0.01,
                        placeholder: '可为空,默认为0',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'rasterBrightnessMax',
                    title: '图片的最大亮度',
                    collapse: "图层设置",  
                    value: data.rasterBrightnessMax,
                    info: '图片的最大亮度（可选，取值范围为 0 ~ 1，默认值为 1）',
                    props: {
                        min: 0,
                        max: 1,
                        step: 0.01,
                        placeholder: '可为空,默认为1',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'rasterSaturation',
                    title: '图片的饱和度',
                    collapse: "图层设置",  
                    value: data.rasterSaturation,
                    info: '图片的饱和度（可选，取值范围为 -1 ~ 1，默认值为 0）',
                    props: {
                        min: -1,
                        max: 1,
                        step: 0.01,
                        placeholder: '可为空,默认为0',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'rasterContrast',
                    title: '图片的对比度',
                    collapse: "图层设置",  
                    value: data.rasterContrast,
                    info: '图片的对比度（可选，取值范围为 -1 ~ 1，默认值为 0）',
                    props: {
                        min: -1,
                        max: 1,
                        step: 0.01,
                        placeholder: '可为空,默认为0',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'rasterFadeDuration',
                    title: '切换瓦片渐隐时间',
                    collapse: "图层设置",  
                    value: data.rasterFadeDuration,
                    info: '切换瓦片时的渐隐时间（可选，默认值为 300，单位：毫秒）',
                    props: {
                        min: 0,
                        step: 1,
                        placeholder: "可为空,默认为300",
                    }
                },
                {
                    type: 'select',
                    field: 'rasterResampling',
                    title: '采样方式',
                    collapse: "图层设置",
                    value: data.rasterResampling,
                    info: "采样方式（可选，可选值为 linear、nearest，默认值为 linear） ",
                    options: [{
                        label: "",
                        value: undefined
                    },{
                        label: "linear",
                        value: "linear"
                    },{
                        label: "nearest",
                        value: "nearest"
                    }],
                    props: {
                        placeholder: '可为空,默认为linear',
                    }
                },
            ],
            
        }
    }
};