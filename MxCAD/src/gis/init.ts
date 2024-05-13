///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import { McDbPolyline, McGePoint3d, MxCADPluginMapDefaultData, MxCADUiPrPoint, MxCpp, MxMap, MxMapAddGoogleCnLayer, mx_gcj02_To_gps84, mx_gps84_To_gcj02 } from "mxcad";
import mapboxgl from "mapbox-gl";
import { ThirdPartyMaps } from "./third_party_maps";
import axios from "axios";
import { add_geoserver_wmts_EPSG900913_ttif, mxtest_addTtifRaster } from "./ttif_demo";
import { DynamicInputType, MxFun} from "mxdraw";
import { getGoogleMapUrl, getMapProviders } from "./map_providers";
let map: mapboxgl.Map
let mxmap: MxMap;

function init_mouse_coord_tip(isLoad_googlecn_map: boolean) {
  map.on("click", async function (e) {
    let { lng, lat } = e.lngLat;
    if (isLoad_googlecn_map) {
      let gps84 = mx_gcj02_To_gps84(lng, lat);
      lng = gps84.lng;
      lat = gps84.lat;
    }

    console.log("经纬度坐标:", JSON.stringify([lng, lat]));
    let pt = mapboxgl.MercatorCoordinate.fromLngLat(
      [lng, lat],
      0
    );

    console.log("墨卡托坐标:", JSON.stringify(mxmap.map_lnglat_to_meters(lng, lat)))

    let ptCAD = mxmap.mercatorCoord2CAD(pt.x, pt.y);
    console.log("CAD坐标:", JSON.stringify(ptCAD));

  });
}
export function getMap(): mapboxgl.Map {
  return map;
}

export function getMxMap(): MxMap {
  return mxmap;
}


let isLoad_googlecn_map = false;
let isLoad_geoserver_wmts_EPSG900913_ttif = true;
isLoad_geoserver_wmts_EPSG900913_ttif = false;
if (isLoad_geoserver_wmts_EPSG900913_ttif) isLoad_googlecn_map = false;

// 返回地图加载的缺省数据.
export function getMapDefaultData(): MxCADPluginMapDefaultData {
  let map_default_data = new MxCADPluginMapDefaultData();
  // CAD图纸与地图的对齐点.
  map_default_data.cadOrigin = [116275.977014, 19273.279085];


  // 12698436.047373507,2575109.229937706,12698641.731873507,2575240.5864377064
  // 地图与CAD图纸的对齐位置 。
  map_default_data.mapOrigin = [114.06825863001939, 22.54283198132819];


  // CAD图上一个绘图单是地图上多少米.
  map_default_data.meterInCADUnits = 1.0;

  // 需要打开的cad图纸.
  map_default_data.openFile = './demo/road.dwg.mxweb'

  // 加载瓦片地图 。
  let mapType = MxFun.getQueryString("maptype");

  if (!isLoad_geoserver_wmts_EPSG900913_ttif) {
    if (mapType == "google") {
      let hx = mx_gps84_To_gcj02(map_default_data.mapOrigin[0], map_default_data.mapOrigin[1]);
      map_default_data.mapOrigin = [hx.lng, hx.lat];
      isLoad_googlecn_map = true;
      map_default_data.viewColor = { red: 0, green: 0, blue: 0 };
    }
    else {
      let rastermap: any = ThirdPartyMaps.gdslwzj();
      if (mapType == "gdslwzj") {
        rastermap = ThirdPartyMaps.gdslwzj()
      } else if (mapType == "gdyx") {
        rastermap = ThirdPartyMaps.gdyx();
      }
      else if (mapType == "tdtsl") {
        rastermap = ThirdPartyMaps.tdtsl();
      }
      else if (mapType == "bdsl") {
        rastermap = ThirdPartyMaps.bdsl();
      }
      else if (mapType == "geoq") {
        rastermap = ThirdPartyMaps.geoq();
      }
      map_default_data.rasterTileLayerList = rastermap.layers;
      if (rastermap.key) map_default_data.rasterTileKey = rastermap.key;

      map_default_data.providers = getMapProviders();
    }
  }

  return map_default_data;
}




export function init(map_val: MxMap) {
  mxmap = map_val;
  map = map_val.getMapbox();

  if (isLoad_googlecn_map) {
    MxMapAddGoogleCnLayer(map, ["Image", "Lable"],getGoogleMapUrl());
  }

  init_mouse_coord_tip(isLoad_googlecn_map);

  if (isLoad_geoserver_wmts_EPSG900913_ttif) {
    add_geoserver_wmts_EPSG900913_ttif(map);
  }
  else {
    mxtest_addTtifRaster(map);
  }

}


// 地图下载
export async function MxTest_Map_Download() {

  // 选择下载范围.
  let getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\n指定下载范围第一点:");
  let pt1 = await getPoint.go();
  if (!pt1) return;

  getPoint.setMessage("\n指定下载范围第二点:");
  getPoint.setUserDraw((currentPoint: McGePoint3d, worldDraw) => {
    worldDraw.setColor(0xFF0000);
    let pl = new McDbPolyline();
    pl.addVertexAt(pt1);
    pl.addVertexAt(new McGePoint3d(pt1.x, currentPoint.y))
    pl.addVertexAt(currentPoint);
    pl.addVertexAt(new McGePoint3d(currentPoint.x, pt1.y))
    pl.constantWidth = MxFun.screenCoordLong2Doc(2);
    pl.isClosed = true;

    worldDraw.drawMcDbEntity(pl);

    let points: THREE.Vector3[] = [];
    points.push(pt1.toVector3());
    points.push(new THREE.Vector3(pt1.x, currentPoint.y));
    points.push(currentPoint.toVector3());
    points.push(new THREE.Vector3(currentPoint.x, pt1.y))

    worldDraw.setColor(0x003244);
    worldDraw.drawSolid(points, 0.5)

  });

  getPoint.setDisableOsnap(true);
  getPoint.setDisableOrthoTrace(true);
  getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
  let pt2 = await getPoint.go();
  if (!pt2) {
    return;
  }

  let lnglat1 = mxmap.cadTolnglat(pt1.toVector3());
  let lnglat2 = mxmap.cadTolnglat(pt2.toVector3());

  let map_pt1 = mxmap.map_lnglat_to_meters(lnglat1[0], lnglat1[1]);
  let map_pt2 = mxmap.map_lnglat_to_meters(lnglat2[0], lnglat2[1]);

  if(isLoad_googlecn_map)
  {
    if(!(mxmap.outOfChina(lnglat1[0], lnglat1[1]) && mxmap.outOfChina(lnglat2[0], lnglat2[1]) )){
      let lnglat_gps841 = mx_gcj02_To_gps84(lnglat1[0], lnglat1[1])
      let lnglat_gps842 = mx_gcj02_To_gps84(lnglat2[0], lnglat2[1]) 
      map_pt1 = mxmap.map_lnglat_to_meters(lnglat_gps841.lng, lnglat_gps841.lat);
      map_pt2 = mxmap.map_lnglat_to_meters(lnglat_gps842.lng, lnglat_gps842.lat);
    }
  }
  

  let map_download_param = {
    //url: "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}",
    url: "https://0pn.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}",
    polygon: [map_pt1[0], map_pt1[1], map_pt2[0], map_pt2[1]],
    zoom: 18,
    auto_close: false,
    no_repeated_download: true,
    download_dir: "",
    thread_count: 32,
  };
  MxFun.acutPrintf("\n 使用教程:https://help.mxdraw.com/?pid=111");
  MxFun.acutPrintf("\n 复制下面的范围,到下载器下载地图,下载范围:");
  let sbound = "\n" +JSON.stringify([map_pt1[0], map_pt1[1], map_pt2[0], map_pt2[1]]);
  MxFun.acutPrintf(sbound);
  MxFun.acutPrintf("\n");

  axios({
    method: "post",
    url: "http://localhost:1337/users/mxgis/download",
    data: map_download_param
  }).then((ret) => {
    console.log(ret.data)
    alert(JSON.stringify(ret.data))
  }).catch((err) => { console.log("网络错误") })

}
