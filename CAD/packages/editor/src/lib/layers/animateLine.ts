import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import line from './line'
export default {
    name: '动画线',
    title: '动画线设置',
    collapse: "线图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M544 522.666667c0-8.533333-4.266667-17.066667-10.666667-23.466667L192 189.866667c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733334 285.866667L149.333333 808.533333c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466667 10.666667 8.533333 0 14.933333-2.133333 21.333333-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666z M864 499.2l-341.333333-309.333333c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733333 285.866667-315.733333 285.866666c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466666 10.666667 8.533333 0 14.933333-2.133333 21.333334-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666 0-8.533333-4.266667-17.066667-10.666667-23.466667z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const lineFactory = line.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "动画设置", "绘制设置"],
            default: {
                lineColor: '#ff0000',
                lineWidth: 10,
                animateImagesType: "arrow",
                animateImages_arrowFillColor: "#22B14C",
                animateImages_arrowStrokeColor: "#fff",
                animateImages_arrowStrokeWidth: 6,
                animateImages_canvasWidth: 128,
                animateImages_canvasHeight: 32,
                animateImages_arrowWidth: 16,
                animateImages_frameCount: 4,
                animateImages_fillColor1: "#f0fb",
                animateImages_fillColor2: "#0ffb"
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                {
                    type: 'select',
                    field: 'animateImagesType',
                    title: '动画类型',
                    collapse: "动画设置",
                    value: data.animateImagesType,
                    options: [{
                        label: "箭头动画",
                        value: "arrow"
                    },{
                        label: "蚂蚁线动画",
                        value: "antpath"
                    },{
                        label: "自定义图片",
                        value: "customImage"
                    },{
                        label: "多个图片生成动画",
                        value: "animateImages"
                    },{
                        label: "同一个图片精灵动画集",
                        value: "imageSprites"
                    }],
                    control:[
                        {
                          handle: (val: string) =>val == "arrow",
                          rule:[
                            {
                                type: "ColorPicker",
                                field: 'animateImages_arrowFillColor',
                                title: '箭头填充颜色',
                                collapse: "动画设置",  
                                value: data.animateImages_arrowFillColor || '#22B14C',
                                props: {
                                }
                            },
                            {
                                type: "ColorPicker",
                                field: 'animateImages_arrowStrokeColor',
                                title: '箭头颜色',
                                collapse: "动画设置",  
                                value: data.animateImages_arrowStrokeColor || '#fff',
                                props: {
                                }
                            },
                            {
                                type: "InputNumber",
                                field: 'animateImages_arrowStrokeWidth',
                                title: '箭头线宽',
                                collapse: "动画设置",  
                                value: data.animateImages_arrowStrokeWidth,
                                props: {
                                    step: 1,
                                }
                            },
                            {
                                type: "InputNumber",
                                field: 'animateImages_arrowWidth',
                                title: '箭头大小',
                                collapse: "动画设置",  
                                value: data.animateImages_arrowWidth,
                                props: {
                                    step: 1,
                                }
                            }
                          ]
                        },
                        {
                            handle: (val: string) =>val == "antpath",
                            rule:[
                              {
                                  type: "ColorPicker",
                                  field: 'animateImages_fillColor1',
                                  title: '蚂蚁线填充颜色1',
                                  collapse: "动画设置",  
                                  value: data.animateImages_fillColor1,
                                  props: {
                                  }
                              },
                              {
                                type: "ColorPicker",
                                field: 'animateImages_fillColor2',
                                title: '蚂蚁线填充颜色2',
                                collapse: "动画设置",  
                                value: data.animateImages_fillColor2,
                                props: {
                                }
                            }
                            ]
                        },
                        {
                            handle: (val: string) =>val == "customImage",
                            rule:[
                              {
                                  type: "Input",
                                  field: 'customImageUrl',
                                  title: '自定义图片URL或base64',
                                  collapse: "动画设置",  
                                  value: data.customImageUrl,
                                  props: {
                                  }
                              },
                            ]
                        },
                        {
                            handle: (val: string) =>val == "animateImages",
                            rule:[
                                {
                                    type:'group',
                                    field:'animateImageUrls',
                                    title:'图片集',
                                    value: data.animateImageUrls || [''],
                                    props:{
                                        rule: [
                                            {type:'input', field:'field1',title:'图片'},
                                        ],
                                        field: 'field1'
                                    },
                                }
                            ]
                        },
                        {
                            handle: (val: string) =>val == "imageSprites",
                            rule:[
                              {
                                  type: "Input",
                                  field: 'imageSpriteUrl',
                                  title: '图片动画集URL或base64',
                                  collapse: "动画设置",  
                                  value: data.imageSpriteUrl,
                                  props: {
                                  }
                              },
                              {
                                type: "InputNumber",
                                field: 'animateImages_spriteWidth',
                                title: '来源图片中精灵图所占宽',
                                collapse: "动画设置",  
                                value: data.animateImages_spriteWidth,
                                props: {
                                    step: 1
                                }
                              },
                              {
                                type: "InputNumber",
                                field: 'animateImages_spriteHeight',
                                title: '来源图片中精灵图所占高',
                                collapse: "动画设置",  
                                value: data.animateImages_spriteHeight,
                                props: {
                                    step: 1
                                }
                              },
                            ]
                        },
                        {
                            handle: (val: string) =>val == "arrow" || val == "antpath"  || val == "customImage"  || val == "imageSprites",
                            rule: [
                                {
                                    type: "InputNumber",
                                    field: 'animateImages_canvasWidth',
                                    title: '画布宽',
                                    collapse: "动画设置",  
                                    value: data.animateImages_canvasWidth,
                                    props: {
                                        step: 1,
                                    }
                                },
                                {
                                    type: "InputNumber",
                                    field: 'animateImages_canvasHeight',
                                    title: '画布高',
                                    collapse: "动画设置",  
                                    value: data.animateImages_canvasHeight,
                                    props: {
                                        step: 1,
                                    }
                                },
                                {
                                    type: "InputNumber",
                                    field: 'animateImages_frameCount',
                                    title: '动画帧数',
                                    collapse: "动画设置",  
                                    value: data.animateImages_frameCount,
                                    props: {
                                        step: 1,
                                    }
                                },
                                {
                                    type: 'select',
                                    field: 'animateImages_directionReverse',
                                    title: '方向是否反向',
                                    collapse: "动画设置",
                                    value: data.animateImages_directionReverse,
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
                                    props: {
                                       
                                    }
                                },
                            ]
                        }
                    ]
                },
                {
                    type: "InputNumber",
                    field: 'speed',
                    title: '速度',
                    collapse: "动画设置",  
                    value: data.speed,
                    props: {
                        step: 0.1,
                    }
                },
                {
                    type: 'select',
                    field: 'startAutoAnimation',
                    title: '开始时自动动画',
                    collapse: "动画设置",
                    value: data.startAutoAnimation,
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
                    props: {
                       
                    }
                },
                ...lineFactory.rule.filter((r: any) => r.collapse == "绘制设置"),
            ]
        }
    }
};