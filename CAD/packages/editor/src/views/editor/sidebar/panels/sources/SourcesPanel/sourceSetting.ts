import { shallowRef } from 'vue';
import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import type { EditorUi } from '@/lib/ui/editorUI';
import TileSourcePanel from '../TileSourcePanel.vue'
import ImageSourcePanel from '../ImageSourcePanel.vue'
import VideoSourcePanel from '../VideoSourcePanel.vue'
import WmsSourcePanel  from '../wmsSource/WmsSourcePanel.vue'
export const showTileSourcePanel = (mapApp: MapApp, uiApp: EditorUi, isVerctor: boolean, item?: any, refreshSources?: Function) => {
    const mapSources = mapApp.sources || [];
    const nameEn = isVerctor ? 'vector' : 'raster';
    const nameCn = isVerctor ? '矢量' : '栅格';
    // @ts-ignore
    const sourceData = item ? mapSources[item.index].source : undefined;
    uiApp.showFloatPane(nameEn + "_source", nameCn + "瓦片设置", {
      component: shallowRef(TileSourcePanel),
      props: {
        data: {
            id: item ? item.id : undefined,
            ...sourceData
        },
        isVector: isVerctor
      },
      listeners: {
        onOK: async (comp: any) => {
          // eslint-disable-next-line prefer-const
          let { data } = comp.getResult();
          if (!data) return;
          if (item) {
            const sid = data.id;
            delete data.id;
            await mapApp.setSourceData(sid, data, true);
          } else {
            // 新增
            const sid = (data.id ? data.id : nameEn + "_" + vjmap.RandomID(8));
            delete data.id;
            if (!await mapApp.addSource({
              id: sid,
              tag: nameEn,
              source: {
                ...data,
                type: nameEn
              }
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


  export const showImageSourcePanel = (mapApp: MapApp, uiApp: EditorUi, item?: any, refreshSources?: Function) => {
    const mapSources = mapApp.sources || [];
    // @ts-ignore
    const sourceData = item ? mapSources[item.index].source : undefined;
    uiApp.showFloatPane("image_source", "图像数据源设置", {
      component: shallowRef(ImageSourcePanel),
      props: {
        data: {
            id: item ? item.id : undefined,
            ...sourceData
        }
      },
      listeners: {
        onOK: async (comp: any) => {
          // eslint-disable-next-line prefer-const
          let { data } = comp.getResult();
          if (!data) return;
          if (item) {
            const sid = data.id;
            delete data.id;
            await mapApp.setSourceData(sid, data, true);
          } else {
            // 新增
            const sid = (data.id ? data.id : "image_" + vjmap.RandomID(8));
            delete data.id;
            if (!await mapApp.addSource({
              id: sid,
              tag: "image",
              source: {
                ...data,
                type: "image"
              }
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

  
  export const showVideoSourcePanel = (mapApp: MapApp, uiApp: EditorUi, item?: any, refreshSources?: Function) => {
    const mapSources = mapApp.sources || [];
    // @ts-ignore
    const sourceData = item ? mapSources[item.index].source : undefined;
    uiApp.showFloatPane("video_source", "视频数据源设置", {
      component: shallowRef(VideoSourcePanel),
      props: {
        data: {
            id: item ? item.id : undefined,
            ...sourceData
        }
      },
      listeners: {
        onOK: async (comp: any) => {
          // eslint-disable-next-line prefer-const
          let { data } = comp.getResult();
          if (!data) return;
          if (item) {
            const sid = data.id;
            delete data.id;
            await mapApp.setSourceData(sid, data, true);
          } else {
            // 新增
            const sid = (data.id ? data.id : "video_" + vjmap.RandomID(8));
            delete data.id;
            if (!await mapApp.addSource({
              id: sid,
              tag: "video",
              source: {
                ...data,
                type: "video"
              }
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


  
export const showWmsSourcePanel = async (mapApp: MapApp, uiApp: EditorUi, item?: any, refreshSources?: Function) => {
  const idx = item ? mapApp.sources.findIndex((s) => s.id === item.id) : -1;
    const res = await uiApp.showModalAsync("wmsSource", 'WMS叠加地图', {
        component: WmsSourcePanel,
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
                bearing: 0,
                pitch: 0
            },
            mapOpenOptions: {
                style: {
                    backcolor: mapApp.getConfig().mapOpenOptions?.style?.backcolor ?? 0
                }
            },
            value: idx >= 0 ? mapApp.sources[idx]: {}
        }
    })
    if (res.isOk) {
        const data = res.result;
        if (item) {
          await mapApp.setSourceData(item.id, data, true);
        } else {
          // 新增
          const sid = "wms_" + vjmap.RandomID(8);
          if (!await mapApp.addSource({
            id: sid,
            tag: "wms",
            wms: data.wms,
            source: {
              ...data.source
            }
          }, true)) {
            window.$message.error(`数据源id ${sid} 已存在，新增失败！`);
            return;
          }
        }
        if (refreshSources) refreshSources();
    }
}
