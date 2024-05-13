///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

// 加载第三方地图
export const ThirdPartyMaps = {
  /** 加载天地图普通地图 */
  tdtsl(): any {
    return {
      layers: [
        ["tdtsl", "TianDiTu.Normal.Map"],
        ["tdtslzj", "TianDiTu.Normal.Annotion"]],
      key: "fb258b4c0bbf60ff7a0205b519ad9a96"
    }
  },

  /** 天地图影像 */
  tdtyx(): any {
    return {
      layers:
        [
          ["tdtyx", "TianDiTu.Satellite.Map"],
          ["tdtyxzj", "TianDiTu.Satellite.Annotion"],
        ],
      key: "fb258b4c0bbf60ff7a0205b519ad9a96"
    }
  },
  /** 天地图地形 */
  tdtdx(): any {
    return {
      layers:
        [
          ["tdtdx", "TianDiTu.Terrain.Map"],
          ["tdtdxzj", "TianDiTu.Terrain.Annotion"],
        ],
      key: "fb258b4c0bbf60ff7a0205b519ad9a96"
    }
  },

  /** 高德矢量 */
  gdsl(): any {
    return { layers: [["gdsl", "GaoDe.Normal.Map"]] }
  },

  /** 高德矢量,无注记版 */
  gdslwzj(): any {
    return { layers: [["gdslwzj", "GaoDe.Normal_NoTag.Map"]] }
  },

  /** 高德影像*/
  gdyx(): any {
    return {
      layers: [
        ["gdyx", "GaoDe.Satellite.Map"],
        ["gdyxzj", "GaoDe.Satellite.Annotion"],
      ]
    }
  },

  /** 百度矢量*/
  bdsl(): any {
    return { layers: [["bdsl", "Baidu.Normal.Map"]] }
  },

  /** 百度影像*/
  bdyx(): any {
    return {
      layers: [
        ["bdyx", "Baidu.Satellite.Map"],
        ["bdyxzj", "Baidu.Satellite.Annotion"],
      ]
    }
  },

  /** OSM地图 */
  osm(): any {
    return { layers: [["osm", "OSM.Normal.Map"]] }
  },

  /** GeoQ普通地图 */
  geoq(): any {
    return { layers: [["geoq", "Geoq.Normal.Map"]] }
  },

  /** GeoQ深蓝色地图 */
  geoqPurplishBlue(): any {
    return { layers: [["geoqPurplishBlue", "Geoq.Normal.PurplishBlue"]] }
  },
  /** GeoQ浅色地图 */
  geoqGray(): any {
    return { layers: [["geoqGray", "Geoq.Normal.Gray"]] }
  },

  /** GeoQ暖色调地图 */
  geoqWarm(): any {
    return { layers: [["geoqWarm", "Geoq.Normal.Warm"]] }
  },

  /** GeoQ冷色调地图 */
  geoqCold(): any {
    return { layers: [["geoqCold", "Geoq.Normal.Cold"]] }
  },

}