import type { EditorUi } from "../ui/editorUI";
import MapComp from '@/components/MapComp.vue'
import type MapApp from "~/MapApp";
import vjmap from "vjmap";
import { map } from "lodash";
export const pickMapBounds = async (mapApp: MapApp, uiApp: EditorUi, name: string, title: string, initBounds?: string) => {
    const res = await uiApp.showModalAsync(name, title, {
        component: MapComp,
        props: {
            positiveText: '',
            negativeText: '',
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
                onMounted: async (mApp: MapApp, close: Function, context: any) => {
                    const map = mApp.map;
                    // 把原来的范围标志上
                     if (initBounds) {
                        initBounds = initBounds.replace("[", "");
                        initBounds = initBounds.replace("]", "");
                        const coords = initBounds.split(",");
                        if (coords.length == 4) {
                            const path = [];
                            path.push([+coords[0], +coords[1]]);
                            path.push([+coords[0], +coords[3]]);
                            path.push([+coords[2], +coords[3]]);
                            path.push([+coords[2], +coords[1]]);
                            const polygon = new vjmap.Polygon({
                                data: mApp.map.toLngLat(path),
                                fillColor: 'yellow',
                                fillOpacity: 0.3,
                                fillOutlineColor: "#f00"
                            });
                            polygon.addTo(mApp.map);
                        }
                    }
                    const actionRect = await vjmap.Draw.actionDrawRectangle(mApp.map);
                    if (actionRect.cancel) {
                        close(false, null);
                        return;
                    }
                    const co = actionRect.features[0].geometry.coordinates[0];
                    close(true, {
                        coordinate: map.fromLngLat(co)
                    });
                }
            }
            
        }
    })
    if (res.isOk) {
        const coordinate = vjmap.GeoBounds.fromDataExtent(res.result.coordinate).toArray();
        return JSON.stringify(coordinate, null, 0);
    }
}


export const pickMapImageCoordinates = async (mapApp: MapApp, uiApp: EditorUi, name: string, title: string, type: string, url: string | string[], initCoordinates?: string) => {
    const res = await uiApp.showModalAsync(name, title, {
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
                onMounted: async (mApp: MapApp, close: Function, context: any) => {
                    const map = mApp.map;
                    let coordinates: any;
                    // 把原来的范围标志上
                     if (initCoordinates) {
                        try {
                            coordinates = JSON.parse(initCoordinates)
                        // eslint-disable-next-line no-empty
                        } catch(e) {
                        }
                    }
                    if (!initCoordinates) {
                        coordinates = map.getGeoBounds(0.05).toPointArray();
                    }
                    const coords = map.toLngLat(coordinates);
                    if (type == "image") {
                        map.addImageSource("source", {
                            type: "image",
                            url: url as string,
                            coordinates: coords
                        })
                    } else {
                        map.addVectorSource("source", {
                            type: "video",
                            urls: url as string[],
                            coordinates: coords
                        }, {});
                    }
                    
                    map.addRasterLayer("layer", "source", {
                        rasterOpacity: 0.7
                    })

                    // 增加四个覆盖物用来调节位置
                    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
                    const markers: any = [];
                    const updateBounds = () => {
                        // 更新位置
                        // @ts-ignore
                        map.getSource("source").setCoordinates(markers.map(m => {
                            const lngLat = m.getLngLat();
                            return [lngLat.lng,lngLat.lat]
                        }));
                    }
                    for(let c = 0; c <  colors.length; c++) {
                        const marker = new vjmap.Marker({
                            color: colors[c],
                            draggable: true
                        });
                        marker.setLngLat(coords[c]).addTo(map);
                        marker.on('drag', () => {
                            updateBounds();
                        });
                        markers.push(marker);
                    }
                },
                getResult: (mApp: MapApp, close: Function, context: any) => {
                    const map = mApp.map;
                    const markers = map.getMarkers();
                    const coordinates = [];
                    for(let i = 0; i < 4; i++) {
                        const co = map.fromLngLat(markers[i].getLngLat())
                        coordinates.push([co.x, co.y]);
                    }
                    return JSON.stringify(coordinates, null, 0);
                }
            }
            
        }
    })
    if (res.isOk) {
        return res.result;
    }
}