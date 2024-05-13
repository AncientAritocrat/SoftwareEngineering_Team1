///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
export function getMapProviders(){
    return {
        TianDiTu: {
            Normal: {
                Map: "http://t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
                Annotion: "http://t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}",
                minzoom: 0,
                maxzoom: 18
            },
            Satellite: {
                Map: "http://t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
                Annotion: "http://t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}",
                minzoom: 0,
                maxzoom: 18
            },
            Terrain: {
                Map: "http://t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
                Annotion: "http://t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}",
                minzoom: 0,
                maxzoom: 14
            },
            Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            key: ""
        },
        GaoDe: {
            Normal: {
                Map: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                minzoom: 0,
                maxzoom: 18
            },
            Normal_NoTag: {
                Map: 'https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&scl=1&ltype=11&x={x}&y={y}&z={z}',
                minzoom: 3,
                maxzoom: 18
            },
            Satellite: {
                Map: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                Annotion: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
                minzoom: 3,
                maxzoom: 18
            },
            Subdomains: ["1", "2", "3", "4"]
        },
        Baidu: {
            Normal: {
                Map: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1'
            },
            Satellite: {
                Map: 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
                Annotion: 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020'
            },
            Subdomains: '0123456789',
            tileType: 'bd09'
        },
        Geoq: {
            Normal: {
                Map: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
                PurplishBlue: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
                Gray: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
                Warm: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
                minzoom: 3,
                maxzoom: 16
            },
            Subdomains: []
        },
        OSM: {
            Normal: {
                Map: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
                minzoom: 0,
                maxzoom: 18
            },
            Subdomains: ['a', 'b', 'c']
        }
    };
}

export function getGoogleMapUrl(){
    return ["https://0pn.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}","https://0pn.cn/maps/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}"];
    //return ["https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}","https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}"];
}