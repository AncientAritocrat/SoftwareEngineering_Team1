import vjmap, { type IDrawTool, type Map } from "vjmap";
import {
  selectRotate,
  toBezierCurve,
  deleteCadEntity,
  modifyCadEntity,
  loadDataToDraw,
  MapApp,
  cacheStorage,
  copyCadEntity
} from "@vjmap/common";
export const cmdToolButtons = [
  {
    id: "undo",
    title: "撤销",
    tooltip: "撤销上一个操作",
    icon: `M170.666667 682.666667h241.365333l-87.936-87.978667C363.904 525.909333 447.658667 469.333333 554.666667 469.333333c146.602667 0 213.333333 110.592 213.333333 213.333334h85.333333c0-148.437333-102.570667-298.666667-298.666666-298.666667-131.797333 0-235.392 64.469333-292.48 148.821333L170.666667 441.301333V682.666667z`,
  },
  {
    id: "redo",
    title: "重做",
    tooltip: "重做上一个操作",
    icon: "M256 682.666667c0-102.741333 66.730667-213.333333 213.333333-213.333334 107.008 0 190.762667 56.576 230.570667 125.354667L611.968 682.666667H853.333333v-241.365334l-91.562666 91.562667C704.768 448.469333 601.130667 384 469.333333 384c-196.096 0-298.666667 150.229333-298.666666 298.666667h85.333333z",
  },
  {
    id: "trash",
    title: "删除",
    tooltip: "删除所选择的",
  },
  {
    id: "scaleRotate",
    title: "缩放旋转",
    tooltip: "缩放旋转所选择的对象",
  },
  {
    id: "combine",
    title: "组合实体",
    tooltip:
      "把多条线组合成多线，或多个多边形组合成多多边形，请先选择多条线或多个多边形再点击此按钮操作",
  },
  {
    id: "unCombine",
    title: "取消组合实体",
    tooltip:
      "把多线拆分成多条线，或多多边形拆分成多个多边形，请先选择多线或多多多边形再点击此按钮操作",
  },
  {
    id: "splitLine",
    title: "分割线",
    tooltip:
      "(1)选中要裁剪的线，点击“分割线”，绘制一条临时线对选中的线分割。(2)分割线后，点击“取消组合实体”，这样分割线分成两部分了.(3)如要删除，选中要删除的，按delete键就可以了",
  },
  {
    id: "cutPolygon",
    title: "分割多边形",
    tooltip: "先选择要分割的多边形，再绘制一个多边形，对选择的多边形进行分割",
  },
  {
    id: "polygonToPolyline",
    title: "多边形转多段线",
    tooltip: "选择一个多边形，转为多段线",
  },
  {
    id: "toMultiPolygon",
    title: "转为多多边形",
    tooltip: "选择多个多边形，转成多多边形",
  },
  {
    id: "toBezierCurve",
    title: "转为曲线",
    tooltip: "选择一条线段，转为曲线",
  },
  {
    id: "selectRotate",
    title: "选择多个旋转",
    tooltip: "选择多个要旋转的对象，进行旋转操作",
  },
  {
    id: "hideSelected",
    title: "隐藏所选实体",
    tooltip: "隐藏所选实体",
  },
  {
    id: "showAllFeatures",
    title: "显示全部实体",
    tooltip: "显示全部实体",
  },
  {
    id: "lockedSelected",
    title: "锁定所选实体",
    tooltip: "锁定所选实体，锁定的实体将不允许进行编辑",
  },
  {
    id: "unLockedAllFeatures",
    title: "解锁全部实体",
    tooltip: "解锁全部实体，解锁的实体将允许进行编辑",
  },
  {
    id: "deleteAll",
    title: "清空全部实体",
    tooltip: "清空全部实体",
  },
  {
    id: "save",
    title: "保存至本地缓存",
    tooltip: "保存至localstroge缓存",
  },
  {
    id: "load",
    title: "从本地缓存加载",
    tooltip: "从本地缓存localstroge加载",
  },
  {
    id: "deleteCadEntity",
    title: "删除CAD图实体",
    tooltip: "删除CAD底图中的一个实体对象,点击按钮时按Shift键进行框选",
  },
  {
    id: "modifyCadEntity",
    title: "修改CAD图实体",
    tooltip: "修改CAD底图中的一个实体对象,点击按钮时按Shift键进行框选。选择结束后，如要选择多个实体，可按Shift在地图中拉框选择",
  },
  {
    id: "copyCadEntity",
    title: "复制CAD图实体",
    tooltip: "复制CAD底图中的一个实体对象,点击按钮时按Shift键进行框选。选择结束后，如要选择多个实体，可按Shift在地图中拉框选择",
  },
];

export const runToolBarItem = async (
  item: any,
  map: Map,
  draw: IDrawTool,
  getDrawOptions: Function,
  refreshData: Function,
  updateMapStyleObj: any,
  mMap: MapApp
) => {
  if (item.id == "undo") {
    draw.undo();
  } else if (item.id == "redo") {
    draw.redo();
  } else if (item.id == "trash") {
    draw.trash();
  } else if (item.id == "scaleRotate") {
    draw.changeMode("scaleRotateMode");
  } else if (item.id == "combine") {
    draw.combineFeatures();
  } else if (item.id == "unCombine") {
    draw.uncombineFeatures();
  } else if (item.id == "splitLine") {
    draw.changeMode("splitLineMode");
  } else if (item.id == "cutPolygon") {
    draw.changeMode("cutPolygonMode");
  } else if (item.id == "toMultiPolygon") {
    draw.doAction("toMultiPolygon");
  } else if (item.id == "polygonToPolyline") {
    const sels = draw.getSelectedIds();
    if (sels.length == 0) return;
    const ents = draw.getAll();
    for (let i = 0; i < sels.length; i++) {
      const idx = ents.features.findIndex((f) => f.id == sels[i]);
      if (idx == -1) continue;
      const feature = ents.features[idx];
      if (feature.geometry.type != "Polygon") continue;
      feature.geometry.type = "LineString";
      // @ts-ignore
      feature.geometry.coordinates = feature.geometry.coordinates[0];
    }
    const newEnts = vjmap.cloneDeep(ents);
    draw.deleteAll();
    draw.set(newEnts);
  } else if (item.id == "toBezierCurve") {
    toBezierCurve(map, draw);
  } else if (item.id == "selectRotate") {
    selectRotate(map, draw, getDrawOptions(), window.$message.info);
  } else if (item.id == "hideSelected") {
    const sels = draw.getSelectedIds();
    if (sels.length == 0) return;
    for (const featureId of sels) {
      draw.setFeatureProperty(featureId, "isOff", true); // isOff属性设置为true，即为隐藏了
    }
    draw.changeMode("simple_select");
  } else if (item.id == "showAllFeatures") {
    const ents = draw.getAll();
    if (ents.features.length == 0) return;
    for (const feature of ents.features) {
      // @ts-ignore
      draw.setFeatureProperty(feature.id, "isOff", undefined); // isOff属性移除了。默认就是显示
    }
    // 刷新下
    draw.forceRefresh();
  } else if (item.id == "lockedSelected") {
    const sels = draw.getSelectedIds();
    if (sels.length == 0) return;
    for (const featureId of sels) {
      draw.setFeatureProperty(featureId, "isLocked", true);
    }
    draw.changeMode("simple_select");
  } else if (item.id == "unLockedAllFeatures") {
    const ents = draw.getAll();
    if (ents.features.length == 0) return;
    for (const feature of ents.features) {
      // @ts-ignore
      draw.setFeatureProperty(feature.id, "isLocked", undefined); //属性移除了。默认就是不锁定
    }
    draw.changeMode("simple_select");
  } else if (item.id == "deleteAll") {
    window.$dialog.warning({
      title: "提示",
      content: `你确定要清空所有绘制的对象?`,
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        draw.deleteAll(); // 不能撤销还原
        refreshData();
      },
    });
  } else if (item.id == "save") {
    let entsJson = draw.getAll();
    // 转成地理坐标
    entsJson = map.fromLngLat(entsJson);
    const curParam = map.getService().currentMapParam() || {};
    // 用地图的mapid和版本号做为key值，把数据保存起来，这里演示只是做数据保存到了localStorage,实际中请保存至后台数据库中
    const key = `map_drawdata_${curParam.mapid}_${curParam.version}${map
      .getService()
      .getCurWorkspaceName()}`;
    await cacheStorage.setValueByKey(key, entsJson, true)
    window.$message.info("保存成功");
  } else if (item.id == "load") {
    // 用地图的mapid和版本号做为key值, 这里演示只是从localStorage去加载,实际中请从后台去请求数据加载
    const curParam = map.getService().currentMapParam() || {};
    const key = `map_drawdata_${curParam.mapid}_${curParam.version}${map
      .getService()
      .getCurWorkspaceName()}`;
    const data = await cacheStorage.getValueByKey(key, false) as string;
    if (data && data != "") {
      const load = async () => {
        try {
          loadDataToDraw(map, draw, data, updateMapStyleObj)
          window.$message.info("加载成功");
        } catch (error) {
          window.$message.error(error as any);
        }
      };
      if (draw.getAll().features.length > 0) {
        window.$dialog.warning({
          title: "提示",
          content: `您确定要从本地缓存加载吗？加载的话，之前绘制的将被清空?`,
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            load();
          },
        });
      } else {
        load();
      }
    }
  } else if (item.id == "deleteCadEntity") {
    deleteCadEntity(map, draw, updateMapStyleObj,  window.$message.info, async (content: string) => {
      return new Promise((resolve) => {
        window.$dialog.warning({
          title: "提示",
          content: content,
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            resolve(true);
          },
          onNegativeClick: async () => {
            resolve(false);
          },
          onClose: () => {
            resolve(false);
          },
        });
      })
    }, mMap?.keyEvent?.isShiftKey());
  } else if (item.id == "modifyCadEntity") {
    await modifyCadEntity(map, draw, updateMapStyleObj,  window.$message.info, async (content: string) => {
      return new Promise((resolve) => {
        window.$dialog.warning({
          title: "提示",
          content: content,
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            resolve(true);
          },
          onNegativeClick: async () => {
            resolve(false);
          },
          onClose: () => {
            resolve(false);
          },
        });
      })
    }, mMap?.keyEvent?.isShiftKey());
    if (refreshData) refreshData()
  } else if (item.id == "copyCadEntity") {
    await copyCadEntity(map, draw, updateMapStyleObj,  window.$message.info, async (content: string) => {
      return new Promise((resolve) => {
        window.$dialog.warning({
          title: "提示",
          content: content,
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            resolve(true);
          },
          onNegativeClick: async () => {
            resolve(false);
          },
          onClose: () => {
            resolve(false);
          },
        });
      })
    }, mMap?.keyEvent?.isShiftKey());
    if (refreshData) refreshData()
  }
};
