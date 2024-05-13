///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import mapboxgl from "mapbox-gl";
/**
 * @param
 * map:mapbox里Map类的实例对象
 */
export function mxtest_addTtifRaster(map: mapboxgl.Map) {

    const url = './gis/radar.tiff'
    console.log(url)

    let w = (114.06825863001939 - 104.18084906665138) * 0.005;
    let h = (32.396413467808586 - 22.54283198132819) * 0.005;

    let cenx = 114.07867152431874;
    let ceny = 22.563727343812303;

    map.addSource('radar', {
        'type': 'image',
        'url': url,//加载的tiff文件路径
        'coordinates': [
            [cenx - w * 0.5, ceny + h * 0.5],
            [cenx + w * 0.5, ceny + h * 0.5],
            [cenx + w * 0.5, ceny - h * 0.5],
            [cenx - w * 0.5, ceny - h * 0.5],
        ]//文件展示的经纬度（四个角/顺时针）
    });
    map.addLayer({
        id: 'radar-layer',
        'type': 'raster',
        'source': 'radar',
        'paint': {
            'raster-fade-duration': 0
        }
    });

}


export function add_geoserver_wmts_EPSG900913_ttif(map: mapboxgl.Map){
    var vectorLayerUrl =  'http://192.168.5.19:8080/geoserver/gwc/service/wmts?layer=mytest%3Amxcadtest2&style=&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}'

    map.addSource('wmts-source', {
        'type': 'raster',
        'tiles': [
          vectorLayerUrl
        ],
        'tileSize': 256
      });

      map.addLayer({
        'id': 'wmts-layer',
        'type': 'raster',
        'source': 'wmts-source',
        'paint': {
          'raster-opacity': 0.95
        }
      });
}