import vjgeo from "vjgeo";
import vjmap, { Map, type IDrawTool } from "vjmap";
import { interactiveCreateGeom } from "@vjmap/common";
export const geoModelHandleSelect = async (
  map: Map,
  draw: IDrawTool,
  modelName: string | number,
  inputFunc: Function,
  strokeColor: string
) => {
  // 先获取模型默认的参数
  // @ts-ignore
  let param = vjgeo.models[modelName].metaParameters;
  if (inputFunc) {
    const value = param.map((p: any) => {
      return {
        title: p.title,
        value: p.type == "select" ? p.value[0] : p.value,
      };
    });
    const content = await inputFunc(value);
    if (!content) return;
    param = content;
  }
  const args = param.map((p: any) => p.value); // 获取参数值
  // @ts-ignore
  const model = new vjgeo.models[modelName](...args);
  model.data = {
    ...model.data,
    color: vjmap.htmlColorToEntColor(strokeColor),
    isFill: vjmap.randInt(0, 3) == 0,
  };
  const dwgDoc = vjgeo.exporter.toDWG(model);
  await addDwgDocToMap(map, draw, dwgDoc);
};

const addDwgDocToMap = async (map: Map, draw: IDrawTool, doc: any) => {
  const dwgDoc = new vjmap.DbDocument();
  dwgDoc.entitys = doc.entitys;
  const geojson = await map.createDbGeomData(dwgDoc);
  const result = await interactiveCreateGeom(geojson, map);
  if (!(result && result.feature && result.feature.features)) return;
  const mapJson = draw.getAll();
  result.feature.features.forEach((f: any) => (f.id = vjmap.RandomID(10))); //防止加入后 id 重复
  mapJson.features.push(...result.feature.features);
  draw.set(mapJson);
};

export const modelLayoutOptions = [
  {
    label: "行布局",
    key: "cloneToRow",
  },
  {
    label: "列布局",
    key: "cloneToColumn",
  },
  {
    label: "网格布局",
    key: "cloneToGrid",
  },
  {
    label: "砖块布局",
    key: "cloneToBrick",
  },
  {
    label: "蜂窝布局",
    key: "cloneToHoneycomb",
  },
  {
    label: "径向布局",
    key: "cloneToRadial",
  },
];

export const modelLayoutHandleSelect = async (
  map: Map,
  draw: IDrawTool,
  methodName: string | number,
  inputFunc: Function,
  message: Function
) => {
  window.$message.info("请选择已绘制好的，要克隆的实体，按右键结束.");
  const selected = await vjmap.Draw.actionSelect(map, draw);
  if (selected.features.length == 0) {
    window.$message.info("您没有选择任何实体哦");
    return;
  }
  // 把查询的geojson转成几何模型
  const symbol = vjgeo.importer.fromGeoJsonData(map.fromLngLat(selected));
  // 获取符号的范围
  const extent = vjgeo.measure.modelExtents(symbol);
  // 对模型进行网格布局
  let param;
  const margin = +(extent.width / 2).toFixed(2);
  if (methodName == "cloneToRow" || methodName == "cloneToColumn") {
    param = [
      { title: "count", value: 4 },
      { title: "margin", value: margin },
    ];
  } else if (
    methodName == "cloneToGrid" ||
    methodName == "cloneToBrick" ||
    methodName == "cloneToHoneycomb"
  ) {
    param = [
      { title: "xCount", value: 4 },
      { title: "yCount", value: 3 },
      { title: "margin", value: margin },
    ];
  } else if (methodName == "cloneToRadial") {
    window.$message.info("请指定中心点");
    const origin = await vjmap.Draw.actionDrawPoint(map);
    const center = map.fromLngLat(origin.features[0].geometry.coordinates);
    param = [
      { title: "count", value: 8 },
      { title: "angleInDegrees", value: 45 },
      { title: "rotationOrigin", value: [center.x, center.y] },
    ];
  }
  if (!param) return;
  const content = await inputFunc(param);
  if (!content) return;
  param = content;
  const args = param.map((p: any) => p.value); // 获取参数值
  // @ts-ignore
  const model = vjgeo.layout[methodName](symbol, ...args);
  if (!model) return;
  // 直接转成geojson
  const json = vjgeo.exporter.toDWG(model, { isGeoJson: true });
  // 交互式绘制geojson
  const result = await interactiveCreateGeom(
    map.toLngLat(json),
    map,
    undefined,
    undefined,
    { disableScale: true, keepGeoSize: true }
  );
  if (!(result && result.feature && result.feature.features)) return;
  const mapJson = draw.getAll();
  result.feature.features.forEach((f: any) => (f.id = vjmap.RandomID(10))); //防止加入后 id 重复
  mapJson.features.push(...result.feature.features);
  draw.set(mapJson);
};
