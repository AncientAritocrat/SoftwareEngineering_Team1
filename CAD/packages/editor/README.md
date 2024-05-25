# 唯杰地图可视化工程代码

在线预览体验地址： https://vjmap.com/app/visiual

此工程代码基于[唯杰地图](https://vjmap.com/)二次开发的产品，末经许可，不可将代码应于商业用途(已购买唯杰地图私有化部署除外)。

# 运行

```
yarn
yarn dev
```

# 目录说明

- packages/common

  通用库

  主要是对唯杰地图常用的功能做了一定程度的封装，方便其他工程共用

  如果此工程需要在其他项目中引用，可进入`packages/common`运行 `npm run build`在 html 中引入`vjcommon.min.js`即可，或`npm install vjcommon`通过`import vjcommon from 'vjcommon'`引入

  此工程不能单独运行，主要是用于其他工程代码的共享用途

  如果要更新`vjmap`库，请进入此目录，运行

  ```
  yarn add vjmap
  ```

- packages/editor

  唯杰地图可视化平台

  实现了对地图可视化编辑功能。

# vscode 开发时建议安装的插件

- Volar

# 唯杰地图介绍

`唯杰地图VJMAP`为`CAD`图或`自定义地图格式`WebGIS`可视化`显示开发提供的一站式解决方案，支持的格式如常用的`AutoCAD`的`DWG`格式文件、`GeoJSON`等常用`GIS`文件格式，它使用 WebGL`矢量图块`和`自定义样式`呈现交互式地图, 提供了全新的`大数据可视化`、`实时流数据`可视化功能，通过本产品可快速实现浏览器和移动端上美观、流畅的地图呈现与空间分析，可帮助您在网站中构建功能丰富、交互性强、可定制的地图应用。

[唯杰地图](https://vjmap.com/)官网地址：https://vjmap.com/

# 唯杰地图特点

- 完全兼容`AutoCAD`格式的`DWG`文件，无需转换
- 绘图技术先进：采用 WebGL 技术，支持`矢量地图`渲染，支持栅格、图片、视频等图形渲染，支持 3D 模型渲染；
- 个性化地图：服务端渲染和前端渲染都支持自定义样式表达式，灵活强大；
- 多视角模式：支持 2D、3D 视角，支持垂直视角、360 度旋转视角；
- 视觉特性：支持无极缩放、支持粒子、航线等动画效果、支持飞行、平移等运动特效；
- 功能完善：支持所有常见的地图功能，提供丰富的 js 接口；
- 交互控制：支持鼠标/单指拖拽、上下左右按键进行地图平移，支持鼠标滚轮、双击、双指进行地图缩放，支持 Shift+拉框放大；
- 大数据可视化：性能卓越，支持大数据可视化展示
- 可导出`Autodesk Forge`的 f2d 格式，利用 Forge 的生态圈进行开发，并可离线部署.[示例](/guide/forgeviewer.html)；
- 跨平台支持(支持`windows`,`linux`); 支持`docker`部署;支持`私有化`部署;支持桌面端语言开发(如`C#`、`Java`、`C++`语言)

# 唯杰地图快速入门

## 通过服务打开地图

通过`Service`对象的`openMap`方法可打开服务器上面已存在的地图，或者通过`fileid`传入`http`网络路径或服务器本地路径打开一幅`DWG`格式的`CAD图形`.

```js
// 新建地图服务对象，传入服务地址和token
let svc = new vjmap.Service(env.serviceUrl, env.accessToken);
// 打开地图
let res = await svc.openMap({
  mapid: "sys_world", // 地图ID (上传图形时，取的图名称)
  mapopenway: vjmap.MapOpenWay.GeomRender, // 以几何数据渲染方式打开
  style: vjmap.openMapDarkStyle(), // 服务器渲染样式
});
if (res.error) {
  message.error(res.error);
}
```

## 建立地图对象

获取上面打开地图返回的`地理范围`建立`坐标系`，然后创建`地图对象`

```js
// 根据地图范围建立几何投影坐标系
let prj = new vjmap.GeoProjection(res.bounds);

// 地图对象
let map = new vjmap.Map({
  container: "map", // DIV容器ID
  style: svc.vectorStyle(), // 样式，这里是矢量瓦片样式
  center: prj.toLngLat(prj.getMapExtent().center()), // 设置地图中心点
  zoom: 2, // 设置地图缩放级别
  pitch: 60, // 倾斜角度
  renderWorldCopies: false, // 不显示多屏地图
});

// 关联服务对象和投影对象
map.attach(svc, prj);
```

## 地图交互

当鼠标在地图的某个实体上面时，需要高亮显示或者点击查看，在`矢量瓦片`模式下可调用 `enableVectorLayerHoverHighlight`；在`栅格瓦片`下，可调用 `enableLayerClickHighlight`

```js
// 获取所有图层
const layers = svc.getMapLayers();
// 实体类型ID和名称映射
const { entTypeIdMap } = await svc.getConstData();

// 有高亮状态（鼠标在地图元素上时，会高亮)
map.enableVectorLayerHoverHighlight((event, feature, layer) => {
  // 点击高亮实体回调事件
  const prop = feature.properties;
  let content = `event: ${event}; feature: ${feature.id}; layer: ${
    layers[prop.layer].name
  }; type: ${entTypeIdMap[prop.type]}`;
  message.info({ content, key: "info", duration: 5 });
});
```

## 增加覆盖物或其它图层

地图提供了在地图之上绘制覆盖物的能力，比如点标记、纯文本标记、折线、圆、多边形、矩形等图形，在绘制中可以对点标记进行标题、图标等进行设置，对折线可以进行颜色、宽度等属性进行设置，对于面（圆、多边形、矩形）同样可以进行填充色、边框色、宽度等很多自定义属性进行设置。

增加一个 marker 覆盖物

```js
const mapBounds = map.getGeoBounds(0.6); // 获取地图地理范围，并进行比例缩放
let position = mapBounds.randomPoint(); // 在此地理范围内生成一个随机点坐标
let latLng = map.toLngLat(position); // 地理坐标转经纬度
let marker = new vjmap.Marker(); // 新建一个Marker
marker.setLngLat(latLng).addTo(map); // 设置坐标并加入地图
```

创建很多正方形拉伸图层

```js
let lengthMin = mapBounds.width() / 200; // 随机生成正方形边长的最小长度
let lengthMax = mapBounds.width() / 100; // 随机生成正方形边长的最大长度
let geoDatas = []; // 数据
for (let i = 0; i < 100; i++) {
  const pts = [];
  const len = vjmap.randInt(lengthMin, lengthMax); // 在两个范围内随机生成一个长度
  const p1 = mapBounds.randomPoint(); // 在此范围内随机生成一个点，做为正方形的右下角的点
  const p2 = vjmap.geoPoint([p1.x, p1.y + len]);
  const p3 = vjmap.geoPoint([p1.x + len, p1.y + len]);
  const p4 = vjmap.geoPoint([p1.x + len, p1.y]);
  pts.push(p1, p2, p3, p4); // 正方形的四个点坐标
  geoDatas.push({
    points: map.toLngLat(pts), // 需要把地理坐标转化成经纬度去绘制
    properties: {
      name: "square" + (i + 1),
      color: vjmap.randomColor(),
      type: "square",
      baseHeight: 0,
      height: prj.toMeter(vjmap.randInt(lengthMin * 10, lengthMax * 10)), // 高度，这里根据上面设置的最小和最大长度的十倍随机生成一个高度值
    },
  });
}

// 创建拉伸对象图层
let fillExtrusions = new vjmap.FillExtrusion({
  data: geoDatas, // 数据
  // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
  fillExtrusionColor: [
    "case",
    ["to-boolean", ["feature-state", "hover"]],
    "red",
    ["get", "color"],
  ],
  fillExtrusionOpacity: 0.8, // 透明度
  fillExtrusionHeight: ["get", "height"], // 高度值
  fillExtrusionBase: ["get", "baseHeight"], // 基点高度，如需悬空，可改变此值
  isHoverPointer: true, // 鼠标在上面时会改变鼠标形状
  isHoverFeatureState: true, // 鼠标在上面时会改变状态值，从而有高亮效果
});
fillExtrusions.addTo(map); // 增加至地图
// 点击事件
fillExtrusions.clickLayer((e) =>
  message.info(
    `您点击了第 ${e.features[0].id} 个，名称为 ${e.features[0].properties.name}，颜色为 ${e.features[0].properties.color} 的 ${e.features[0].properties.type}`
  )
);
// 悬浮事件
fillExtrusions.hoverPopup(
  (f) => `<h3>ID: ${f.properties.name}</h3>Color: ${f.properties.color}`,
  { anchor: "bottom" }
);
```

效果如下:

![image-20211015195337555](https://vjmap.com/blogimages/image-20211015195337555.png)

[demo 地址](https://vjmap.com/demo/#/demo/map/overlay/fillextrusion/fillextrusion) 可访问 https://vjmap.com/demo/#/demo/map/overlay/fillextrusion/fillextrusion

[唯杰地图文档](https://vjmap.com/) https://vjmap.com
