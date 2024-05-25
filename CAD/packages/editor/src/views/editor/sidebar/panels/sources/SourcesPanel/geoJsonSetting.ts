import { shallowRef } from 'vue';
import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { getMapSnapPoints } from '@vjmap/common';
import MapComp from '@/components/MapComp.vue'
import DrawUI from '../dialogs/DrawUI/index.vue'
import QueryData from '../dialogs/QueryData.vue'
import HttpData from '../dialogs/HttpData.vue'
import GeoJsonStaticPanel from '../GeoJsonStaticPanel.vue'
import type { EditorUi } from '@/lib/ui/editorUI';

export const showGeoJsonStatic = (mapApp: MapApp, uiApp: EditorUi, item?: any, refreshSources?: Function) => {
  const mapSources = mapApp.sources || [];
  // @ts-ignore
  const sourceData = item ? mapSources[item.index].source.data : undefined;
  const sourceProp = item ? mapSources[item.index].props : undefined;
  uiApp.showFloatPane("geojson_static", "geojson静态数据源", {
    component: shallowRef(GeoJsonStaticPanel),
    props: {
      data: sourceData,
      prop: sourceProp,
      id: item ? item.id : ''
    },
    listeners: {
      onOK: async (comp: any) => {
        // eslint-disable-next-line prefer-const
        let { data, id, prop } = comp.getResult();
        if (!data) return;
        data = JSON.parse(data);
        if (item) {
          await mapApp.setSourceData(id, data, true);
        } else {
          // 新增
          const sid = (id != '' ? id : "geojson_" + vjmap.RandomID(8));
          if (!await mapApp.addSource({
            id: sid,
            tag: "static",
            source: {
              type: "geojson",
              data: data,
            },
            // @ts-ignore
            props: JSON.parse(prop)
          }, true)) {
            window.$message.error(`数据源id ${sid} 已存在，新增失败！`);
            return;
          }
        }
        if (refreshSources) refreshSources();
      }
    }
  })
}


export const drawGeoJson = async (mapApp: MapApp, uiApp: EditorUi, item?: any, refreshSources?: Function) => {
    const res = await uiApp.showModalAsync("drawGeoJson", '绘制图形', {
        component: MapComp,
        props: {
            positiveText: '确定',
            negativeText: '取消',
            bodyStyle: {
              position: 'fixed',
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
                width: "100%"
            },
            mapOptions: !mapApp.isWebBaseMap() ? {
                center: [0, 0],
                zoom: 1,
                bearing: 0,
                pitch: 0
            } : {
              center: mapApp.map.getCenter(),
              zoom: mapApp.map.getZoom(),
              bearing: mapApp.map.getBearing(),
              pitch: mapApp.map.getPitch()
            },
            mapOpenOptions: {
                style: {
                    backcolor: mapApp.getConfig().mapOpenOptions?.style?.backcolor ?? 0
                }
            },
            methods: {
                onMounted: async (mApp: MapApp, close: Function, context: any) => {
                    const map = mApp.map;
                    
                    const opts = vjmap.cloneDeep(vjmap.Draw.defaultOptions());
                    opts.isActionDrawMode = true; // 按钮都隐藏，界面用自己的

                    const snapObj = {};
                    if (!mApp.isWebBaseMap()) {
                      // 如果是为cad为底图，则可以捕捉dwg图上的点
                      getMapSnapPoints(map, snapObj);
                    }
                    
                    // @ts-ignore
                    const draw = map.getDrawLayer({
                        ...opts,
                        api: {
                            getSnapFeatures: snapObj //要捕捉的数据项在后面，通过属性features赋值
                        }
                    });
                    
                    // 增加之前的数据
                    const mapSources = mapApp.sources || [];
                    // @ts-ignore
                    const sourceData = item ? mapSources[item.index].source.data : undefined;
                    if (sourceData) {
                        draw.set(map.toLngLat(sourceData));
                    }
                },
                getResult: (mApp: MapApp, close: Function, context: any) => {
                    const map = mApp.map;
                    return map.fromLngLat(map.getDrawLayer().getAll());
                }
            },
            isLoadImages: true,
            ui: {
                comp: DrawUI,
                value: {
                }
            }
        }
    })
    if (res.isOk) {
        const data = res.result;
        if (item) {
          mapApp.setSourceData(item.id, data, true);
        } else {
          // 新增
          const sid = "draw_" + vjmap.RandomID(8);
          if (!mapApp.addSource({
            id: sid,
            tag: "draw",
            source: {
              type: "geojson",
              data: data,
            }
          }, true)) {
            window.$message.error(`数据源id ${sid} 已存在，新增失败！`);
            return;
          }
        }
        if (refreshSources) refreshSources();
    }
}



export const queryGeoJson = async (mapApp: MapApp, uiApp: EditorUi, item?: any, refreshSources?: Function) => {
    const idx = item ? mapApp.sources.findIndex((s) => s.id === item.id) : -1;
    const res = await uiApp.showModalAsync("queryGeoJson", '查询图形数据', {
        component: MapComp,
        props: {
            positiveText: '确定',
            negativeText: '取消',
            bodyStyle: {
              position: 'fixed',
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
                width: "100%"
            },
            mapOptions: {
                center: [0, 0],
                zoom: 1,
                bearing: 0,
                pitch: 0
            },
            mapOpenOptions: {
                style: {
                    backcolor: mapApp.getConfig().mapOpenOptions?.style?.backcolor ?? 0
                }
            },
            methods: {
            },
            ui: {
                comp: QueryData,
                value: idx >= 0 ? mapApp.sources[idx]?.query : {}
            }
        }
    })
    if (res.isOk) {
        const data = res.result;
        if (item) {
          await mapApp.setSourceData(item.id, data, true);
        } else {
          // 新增
          const sid = "query_" + vjmap.RandomID(8);
          if (!await mapApp.addSource({
            id: sid,
            tag: "query",
            query: data,
            source: {
              type: "geojson",
              data: {
                "type": "FeatureCollection",
                "features": []
              }
            }
          }, true)) {
            window.$message.error(`数据源id ${sid} 已存在，新增失败！`);
            return;
          }
        }
        if (refreshSources) refreshSources();
    }
} 

export const changeGeoJson = async (mapApp: MapApp, uiApp: EditorUi, item?: any, refreshSources?: Function) => {
    const idx = item ? mapApp.sources.findIndex((s: any) => s.id === item.id) : -1;
    const initValue = idx >= 0 ? mapApp.sources[idx]?.change : {};
    const sources: any = [];
    for(const k in mapApp.sources) {
      if (idx == +k) continue; // 自己不显示出来
      sources.push({
          label: `${mapApp.sources[k].memo ?? ''}${mapApp.sources[k].id} - ${mapApp.sources[k].tag}`,
          value: mapApp.sources[k].id
      })
    }
    const res = await uiApp.showModalAsync("changeGeoJson", '动态获取GeoJson数据', {
          component: HttpData,
          props: {
              width: '1200px',
              height: '650px',
              change: initValue,
              sources: sources
          }
      })
    if (res.isOk) {
      const data = res.result;
        if (item) {
          await mapApp.setSourceData(item.id, data, true);
        } else {
          // 新增
          const sid = "change_" + vjmap.RandomID(8);
          if (!await mapApp.addSource({
            id: sid,
            tag: "change",
            change: data,
            source: {
              type: "geojson",
              data: {
                "type": "FeatureCollection",
                "features": []
              }
            }
          }, true)) {
            window.$message.error(`数据源id ${sid} 已存在，新增失败！`);
            return;
          }
        }
        if (refreshSources) refreshSources();
    }
}