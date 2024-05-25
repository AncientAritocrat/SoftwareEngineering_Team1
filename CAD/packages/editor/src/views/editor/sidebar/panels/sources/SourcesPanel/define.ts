
export const mapSourceOptions = [
    {
      label: 'GeoJson数据源-静态数据',
      key: "geojson_static"
    },
    {
      label: 'GeoJson数据源-图形查询数据',
      key: "geojson_query"
    },
    {
      label: 'GeoJson数据源-图形绘制数据',
      key: "geojson_draw"
    },
    {
      label: 'GeoJson数据源-动态数据',
      key: "geojson_change"
    },
    {
      label: 'WMS数据源-叠加CAD或互联网图',
      key: "wms"
    },
    {
      label: '栅格瓦片数据源',
      key: "raster"
    },
    {
      label: '矢量瓦片数据源',
      key: "vector"
    },
    {
      label: '图像数据源',
      key: "image"
    },
    {
      label: '视频数据源',
      key: "video"
    },
]

export const sourceTags: any = {
    "geojson": 'geojson',
    "geojson_static": 'geojson静态',
    "geojson_change": 'geojson动态',
    "geojson_draw": 'geojson绘制',
    "geojson_query": 'geojson查询',
    "raster_wms": 'WMS栅格',
    "vector_wms": 'WMS矢量',
    "raster_raster": '栅格瓦片',
    "vector_vector": '矢量瓦片',
    "image_image": '图像',
    "video_video": '视频'
  }

export const soutceTagTypes: any = {
    "geojson": 'success',
    "raster": 'warning',
    "vector": 'error',
    "image": 'info',
    "video": 'default'
}