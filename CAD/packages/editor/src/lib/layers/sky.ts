import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import basic from './basic';
import common from './data'
import option  from './option';
export default {
    name: '天空图层',
    title: '天空图层',
    collapse: "其他图层",
    matchSource: [''], 
    icon: `M811.4 418.7C765.6 297.9 648.9 212 512.2 212S258.8 297.8 213 418.6C127.3 441.1 64 519.1 64 612c0 110.5 89.5 200 199.9 200h496.2C870.5 812 960 722.5 960 612c0-92.7-63.1-170.7-148.6-193.3z m36.3 281c-23.4 23.4-54.5 36.3-87.6 36.3H263.9c-33.1 0-64.2-12.9-87.6-36.3-23.4-23.4-36.3-54.6-36.3-87.7 0-28 9.1-54.3 26.2-76.3 16.7-21.3 40.2-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4 14.9-19.2 32.6-35.9 52.4-49.9 41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10c54.3 14.5 92.1 63.8 92.1 120 0 33.1-12.9 64.3-36.3 87.7z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        return {
            option: {...option},
            expanded: ["通用设置", "绘制设置"],
            default: {
                skyType: 'gradient',
                skyGradient: [
                    'interpolate',
                    ['linear'],
                    ['sky-radial-progress'],
                    0.8,
                    'rgba(135, 206, 235, 1.0)',
                    1,
                    'rgba(0,0,0,0.1)'
                ],
                skyGradientCenter: [0, 0],
                skyGradientRadius: 90,
                skyOpacity: [
                    'interpolate',
                    ['exponential', 0.1],
                    ['zoom'],
                    0,
                    0.3,
                    22,
                    1
                ]
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp, false, true),
                {
                    type: 'select',
                    field: 'skyType',
                    title: '天空类型',
                    collapse: "绘制设置",
                    value: data.skyType,
                    options: [{
                        label: "",
                        value: undefined
                    },{
                        label: "渐变",
                        value: "gradient"
                    },{
                        label: "模拟大气",
                        value: "atmosphere"
                    }],
                    props: {
                        placeholder: '可为空,默认为atmosphere',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'skyGradient',
                    title: '渐变色',
                    collapse: "绘制设置",
                    value: data.skyGradient,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'skyGradientCenter',
                    title: '渐变中心点',
                    collapse: "绘制设置",
                    value: data.skyGradientCenter,
                    props: {
                        childType: "Input",
                        onlyExprInput: true,
                        hideExprButton: true,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'skyGradientRadius',
                    title: '渐变半径',
                    collapse: "绘制设置",
                    value: data.skyGradientRadius,
                    info: "梯度延伸到的角距离（以度为单位）,0-180度。默认90",
                    props: {
                        childType: "InputNumber",
                        min: 0,
                        max: 180,
                        hideExprButton: true,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'skyOpacity',
                    title: '天空透明度',
                    collapse: "绘制设置",
                    value: data.skyOpacity,
                    info: "天空透明度,0-1。默认1",
                    props: {
                        childType: "InputNumber",
                        min: 0,
                        max: 1,
                        hideExprButton: true,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'skyAtmosphereColor',
                    title: '大气颜色',
                    collapse: "绘制设置",
                    value: data.skyAtmosphereColor,
                    info: '用于调整主要大气散射系数的颜色。默认为白色',
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: 'exprComp',
                    field: 'skyAtmosphereHaloColor',
                    title: '大气光晕颜色',
                    collapse: "绘制设置",
                    value: data.skyAtmosphereHaloColor,
                    info: '应用于大气太阳光晕的颜色。默认为白色',
                    props: {
                        childType: "ColorPicker",
                        showAlpha: false,
                        placeholder: '',
                    }
                },
                {
                    type: "InputNumber",
                    field: 'skyAtmosphereSunIntensity',
                    title: '大气太阳光强度',
                    collapse: "绘制设置",  
                    value: data.skyAtmosphereSunIntensity,
                    info: '太阳作为大气中光源的强度（范围从 0 到 100）。设置更高的值将使天空变亮。',
                    props: {
                        min: 0,
                        max: 100,
                        step: 1,
                        placeholder: '可为空,默认为10',
                    }
                },
            ]
            
        }
    }
};