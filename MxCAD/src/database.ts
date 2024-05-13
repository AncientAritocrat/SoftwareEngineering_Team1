///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import * as THREE from "three";
import {
  MrxDbgUiPrPoint,
  MxDbImage,
  MxFun,
  MxType
} from "mxdraw";
import { McCmColor, McDbAlignedDimension, McDbArc, McDbAttribute, McDbAttributeDefinition, McDbBlockReference, McDbCircle, McDbDictionary, McDbDimension, McDbEntity, McDbHatch, McDbLayerTableRecord, McDbLine, McDbMText, McDbPolyline, McDbRasterImage, McDbRotatedDimension, McDbText, McDbTextStyleTableRecord, McDbXrecord, McGePoint3d, McObject, McObjectId, McObjectIdType, MxCADResbuf, MxCADSelectionSet, MxCADUI, MxCADUiPrEntity, MxCADUiPrPoint, MxCpp, MxTools } from "mxcad";
import { MxDrawTable } from "./drawTable";
import QRCode from 'qrcode-generator';
import { McGePoint3dToString } from ".";


function McDbEntityToJsonObject(ent: McDbEntity): object {
  let obj: any = {}
  obj.ObjectName = ent.objectName;


  obj.id = ent.getObjectID().id;
  obj.handle = ent.getHandle();
  obj.layer = ent.layer;
  obj.color = ent.trueColor.getColorString();
  obj.colorVal = ent.trueColor.getColorValue(ent.layerId);
  obj.linetype = ent.linetype;
  obj.textStyle = ent.textStyle;
  obj.type = ent.objectName;
  obj.dxf0 = ent.dxf0;

  if (ent instanceof McDbText) {
    let txt = (ent as McDbText);
    
    obj.position = McGePoint3dToString(txt.position);
    obj.textString = txt.textString;
  }
  else if (ent instanceof McDbMText) {
    let mtxt = (ent as McDbMText);
    obj.contents = mtxt.contents;
    obj.location = McGePoint3dToString(mtxt.location);
  }
  else if (ent instanceof McDbLine) {
    let line = (ent as McDbLine);
    obj.startPoint = McGePoint3dToString(line.startPoint);
    obj.endPoint = McGePoint3dToString(line.endPoint);
  }
  else if (ent instanceof McDbCircle) {
    let circle = (ent as McDbCircle);
    obj.center = McGePoint3dToString(circle.center);
    obj.radius = circle.radius;
  }
  else if (ent instanceof McDbArc) {
    let arc = (ent as McDbArc);
    obj.center = McGePoint3dToString(arc.center);
    obj.startAngle = arc.startAngle;
    obj.endAngle = arc.endAngle;
  }
  else if (ent instanceof McDbPolyline) {
    let polyline = (ent as McDbPolyline);
    let num = polyline.numVerts();
    obj.num = num;
    for (let i = 0; i < num; i++) {
      let pt = polyline.getPointAt(i);
      let bulge = polyline.getBulgeAt(i);
      obj["pt" + i] = McGePoint3dToString(pt.val);
      obj["bulge" + i] = bulge;
    }
  }
  else if (ent instanceof McDbBlockReference) {
    let blkRef = (ent as McDbBlockReference);
    obj.position = McGePoint3dToString(blkRef.position);
    obj.blockTransform = blkRef.blockTransform;
    obj.blockName = blkRef.blockName;
    //getBlockReferenceEntitys(blkRef);
  }
  else if (ent instanceof McDbAlignedDimension) {
    let alignedDim = (ent as McDbAlignedDimension);
    obj.xLine1Point = McGePoint3dToString(alignedDim.xLine1Point);
    obj.xLine2Point = McGePoint3dToString(alignedDim.xLine2Point);
    let txts = alignedDim.GetAllText();
    txts.forEach((val, index) => {
      obj["txt:" + index] = val;
    });
  }
  else if (ent instanceof McDbRotatedDimension) {
    let rotatedDim = (ent as McDbRotatedDimension);
    obj.xLine1Point = McGePoint3dToString(rotatedDim.xLine1Point);
    obj.xLine2Point = McGePoint3dToString(rotatedDim.xLine2Point);
    let txts = rotatedDim.GetAllText();
    txts.forEach((val, index) => {
      obj["txt:" + index] = val;
    });
  }
  else if (ent instanceof McDbDimension) {
    let dim = (ent as McDbDimension);
    let txts = dim.GetAllText();
    txts.forEach((val, index) => {
      obj["txt:" + index] = val;
    });
  }
  else if (ent instanceof McDbHatch) {
    let hatch = (ent as McDbHatch);
    obj.patternType = hatch.patternType();
    obj.patternName = hatch.patternName();
    obj.patternAngle = hatch.patternAngle;
    obj.patternScale = hatch.patternScale;
    obj.patternSpace = hatch.patternSpace;
    obj.patternDouble = hatch.patternDouble;
    obj.hatchStyle = hatch.hatchStyle();
    obj.isSolid = hatch.isSolid();
    obj.numLoops = hatch.numLoops;
    for (let i = 0; i < obj.numLoops; i++) {
      let loop: any = hatch.getLoopAt(i);
      loop.vertices.forEach((val: any, inidex: number) => {
        loop["pt:" + inidex] = {};
        loop["pt:" + inidex].x = val.x;
        loop["pt:" + inidex].y = val.y;
        loop["pt:" + inidex].z = val.z;
      })
      obj["loop:" + i] = loop;
    };
    obj.numPatternDefinitions = hatch.numPatternDefinitions;
    for (let i = 0; i < obj.numPatternDefinitions; i++) {
      obj["patternDefinitions:" + i] = hatch.getPatternDefinitionAt(i);
    };
  }
  else if (ent instanceof McDbRasterImage) {
    let image = (ent as McDbRasterImage);
    let orientation = image.getOrientation();
    obj.orientation = {};
    obj.orientation.origin = orientation.origin.toVector3();
    obj.orientation.uCorner = orientation.uCorner.toVector3();
    obj.orientation.vOnPlane = orientation.vOnPlane.toVector3();

    let clipBoundary = image.clipBoundary();
    obj.clipBoundary = {};
    clipBoundary.forEach((pt, index) => {
      obj.clipBoundary["pt" + index] = pt.toVector3();
    });

    obj.clipBoundaryType = image.clipBoundaryType();

    let imageDef = image.imageDefId().getMcDbRasterImageDef();
    if (imageDef) {
      obj.filePath = imageDef.sourceFileName;
    }
  }
  //...

  return obj;
}

function getBlockReferenceEntitys(blkRef: McDbBlockReference) {

  let blkRecrod = blkRef.blockTableRecordId.getMcDbBlockTableRecord();
  if (!blkRecrod) return;
  let aryId = blkRecrod.getAllEntityId();
  aryId.forEach((id) => {
    let ent: any = id.getMcDbEntity();
    if (!ent) return;
    ent = McDbEntityToJsonObject(ent);
    console.log(JSON.stringify(ent));
  })
}

async function TestGetAllEntity() {

  let ss = new MxCADSelectionSet();
  ss.allSelect();
  ss.forEach((id) => {
    let ent: any = id.getMcDbEntity();
    if (!ent) return;
    ent = McDbEntityToJsonObject(ent);
    console.log(JSON.stringify(ent));
  })
}

// 下面的代码，是得到0层上的填充对象.
async function TestGentEntityOnLayer() {
  let ss = new MxCADSelectionSet();
  let filter = new MxCADResbuf();
  filter.AddString("0", 8);
  ss.allSelect(filter);
  ss.forEach((id) => {
    let ent: any = id.getMcDbEntity();
    if (!ent) return;
    if (ent instanceof McDbHatch) {
      let obj: any = {};
      let hatch = (ent as McDbHatch);
      obj.patternType = hatch.patternType();
      obj.patternName = hatch.patternName();
      obj.patternAngle = hatch.patternAngle;
      obj.patternScale = hatch.patternScale;
      obj.patternSpace = hatch.patternSpace;
      obj.patternDouble = hatch.patternDouble;
      obj.hatchStyle = hatch.hatchStyle();
      obj.isSolid = hatch.isSolid();
      obj.numLoops = hatch.numLoops;
      for (let i = 0; i < obj.numLoops; i++) {
        let loop: any = hatch.getLoopAt(i);
        loop.vertices.forEach((val: any, inidex: number) => {
          loop["pt:" + inidex] = {};
          loop["pt:" + inidex].x = val.x;
          loop["pt:" + inidex].y = val.y;
          loop["pt:" + inidex].z = val.z;
        })
        obj["loop:" + i] = loop;
      };
      obj.numPatternDefinitions = hatch.numPatternDefinitions;
      for (let i = 0; i < obj.numPatternDefinitions; i++) {
        obj["patternDefinitions:" + i] = hatch.getPatternDefinitionAt(i);
      };

      console.log(obj)
    }



  })

}

async function MxTest_GetSysVars() {
  let mxcad = MxCpp.getCurrentMxCAD();
  let database = mxcad.getDatabase();
  // 栅格
  let grid = {};
  grid["name"] = "GRIDMODE";
  grid["isShow"] = mxcad.getSysVarLong("GRIDMODE");
  let ptSnapUnit = mxcad.getSysVarPoint("SNAPUNIT");
  grid["xdist"] = ptSnapUnit.x;
  grid["ydist"] = ptSnapUnit.x;
  console.log(grid);

  // 正交
  let ortho = {};
  ortho["name"] = "ORTHOMODE";
  ortho["isShow"] = mxcad.getSysVarLong("ORTHOMODE");
  console.log(ortho);

  // 极轴，
  let polarAxis = {};
  polarAxis["name"] = "AUTOSNAP";
  polarAxis["enable"] = (mxcad.getSysVarLong("AUTOSNAP") & 8) != 0;
  polarAxis["polarang"] = mxcad.getSysVarDouble("POLARANG");
  console.log(polarAxis);

  // 对象捕捉
  let osnap = {};
  osnap["name"] = "OSMODE";
  osnap["enable"] = (mxcad.getSysVarLong("OSMODE") & 16384) == 0;
  osnap["value"] = mxcad.getSysVarLong("OSMODE");
  osnap["End"] = (mxcad.getSysVarLong("OSMODE") & 1) != 0;
  osnap["Mid"] = (mxcad.getSysVarLong("OSMODE") & 2) != 0;
  osnap["Cen"] = (mxcad.getSysVarLong("OSMODE") & 4) != 0;
  osnap["Node"] = (mxcad.getSysVarLong("OSMODE") & 8) != 0;
  osnap["Quad"] = (mxcad.getSysVarLong("OSMODE") & 16) != 0;
  osnap["Int"] = (mxcad.getSysVarLong("OSMODE") & 32) != 0;
  osnap["Ins"] = (mxcad.getSysVarLong("OSMODE") & 64) != 0;
  osnap["Perp"] = (mxcad.getSysVarLong("OSMODE") & 128) != 0;
  osnap["Tan"] = (mxcad.getSysVarLong("OSMODE") & 256) != 0;
  osnap["Near"] = (mxcad.getSysVarLong("OSMODE") & 512) != 0;
  console.log(osnap);

  // 对象追踪
  let dyntrace = {};
  dyntrace["name"] = "DYNTRACE";
  dyntrace["enable"] = mxcad.getSysVarLong("DYNTRACE") != 0;
  console.log(dyntrace);

  // DYN
  let dyn = {};
  dyn["name"] = "DYNINPUT";
  dyn["enable"] = mxcad.getSysVarLong("DYNINPUT") != 0;
  console.log(dyn);

  let sysvar: any = {}

  // 全局线型比例
  sysvar.LTSCALE = mxcad.getSysVarDouble("LTSCALE");

  // 当前线型比例
  sysvar.CELTSCALE = mxcad.getSysVarDouble("CELTSCALE");

  // 当前线型
  sysvar.CELTYPE = mxcad.getSysVarString("CELTYPE");

  // 当前文字样式
  sysvar.TEXTSTYLE = mxcad.getSysVarString("TEXTSTYLE");

  // 当前布局名
  sysvar.CLAYOUTNAME = mxcad.getSysVarString("CLAYOUTNAME");

  // 当前层名
  sysvar.CLAYER = mxcad.getSysVarString("CLAYER");

  // 当前颜色
  sysvar.CECOLOR = database.getCurrentlyTrueColor().getColorValue();

  // 当前图纸的插入基点.
  sysvar.INSBASE = mxcad.getSysVarPoint("INSBASE");


  // 当前图纸线重
  sysvar.CELWEIGHT = mxcad.getSysVarLong("CELWEIGHT");

  // 当前点样式,百度PDMODE
  sysvar.PDMODE = mxcad.getSysVarLong("PDMODE");

  // 点大小 。 >0指定绝对尺寸, <0 指定视口尺寸的百分比 =0在绘图区域高度的 5% 处创建点
  sysvar.PDSIZE = mxcad.getSysVarDouble("PDSIZE");

  console.log(sysvar);
}

// 读取扩展数据。
async function MxTest_ReadxData() {
  let selEntity = new MxCADUiPrEntity();
  selEntity.setMessage("选择对象");
  let id = await selEntity.go();
  if (!id.isValid()) return;

  let ent = id.getMcDbEntity();
  if (ent === null) return;

  let data = ent.getxData();
  //data.PrintData();
  data.forEach((val, type, dxf) => {
    console.log(JSON.stringify({ val: val, type: type, dxf: dxf }));
  })

  //let data = ent.getxDataString("DataName");
  //MxFun.acutPrintf(data.val + "\n");
}


// 写取扩展数据。
async function MxTest_WritexData() {
  let selEntity = new MxCADUiPrEntity();
  selEntity.setMessage("选择对象");
  let id = await selEntity.go();
  if (!id.isValid()) return;

  let ent = id.getMcDbEntity();
  if (ent === null) return;
  ent.setxDataString("DataName", "xxxxx");
  //ent.setxData(new MxCADResbuf([{type:MxCADResbufDataType.kExDataName,val:"DataName"},{type:MxCADResbufDataType.kString,val:"yyyyy"}]));
}

export async function MxTest_DrawLine() {
  const getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\n指定第一点:");
  let prvPoint = await getPoint.go();
  if (!prvPoint) return;
  getPoint.setMessage("\n指定下一个点:");
  while (true) {
    getPoint.setBasePt(prvPoint as any);
    let pt = await getPoint.go();
    if (!pt) return;
    let line = new McDbLine(prvPoint, pt);
    MxCpp.getCurrentMxCAD().drawEntity(line);
    prvPoint = pt;
  }
}



function getHostUrl(): string {
  let host = window.location.hostname;
  if (host.substring(0, 4) != "http") {
    host = document.location.protocol + "//" + host;
  }
  return host;
}

export async function MxTest_InsertBlock() {
  let baseUrl = "http://localhost:3000/mxcad/"
  if (baseUrl.substring(0, 16) == "http://localhost") {
    baseUrl = getHostUrl() + baseUrl.substring(16);
  }

  let blkFilePath = baseUrl + "tree.mxweb";
  let mxcad = MxCpp.App.getCurrentMxCAD();
  let blkrecId = await mxcad.insertBlock(blkFilePath, "tree");
  if (!blkrecId.isValid()) {
    // 插入图块
    return;
  }

  let blkRef = new McDbBlockReference();
  blkRef.blockTableRecordId = blkrecId;
  let box = blkRef.getBoundingBox();
  if (box.ret) {
    let dLen = box.maxPt.distanceTo(box.minPt);
    if (dLen > 0.00001) {
      blkRef.setScale(mxcad.getMxDrawObject().screenCoordLong2Doc(100) / dLen);
    }
  }

  let getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\指定插入基点");

  getPoint.setUserDraw((v, worldDraw) => {
    blkRef.position = v;
    worldDraw.drawMcDbEntity(blkRef);
  });

  let pt = await getPoint.go();
  if (!pt) return;
  blkRef.position = pt;
  let newBlkRefId = mxcad.drawEntity(blkRef);
  if (!newBlkRefId.isValid) {
    console.log("insert error");
    return;
  }

  blkRef = newBlkRefId.getMcDbEntity() as McDbBlockReference;

  // 如果块有属性定义，下面为块引创建属性定义。
  blkRef.disableDisplay(true);
  let blkRecord: any = blkrecId.getMcDbBlockTableRecord();
  let ids = blkRecord.getAllEntityId();
  ids.forEach((id: any, index: any) => {
    if (!id.isKindOf("McDbAttributeDefinition")) return;
    let attribDef = id.getMcDbEntity() as McDbAttributeDefinition;
    let tag = attribDef.tag;
    let txt = attribDef.textString;

    let attrib = new McDbAttribute();
    attrib.position = attribDef.position;
    attrib.alignmentPoint = attribDef.alignmentPoint
    attrib.height = attribDef.height
    attrib.trueColor = attribDef.trueColor
    attrib.widthFactor = attribDef.widthFactor
    if (txt.length > 0) attrib.textString = txt;
    else attrib.textString = "test" + index;
    attrib.tag = tag;
    attrib.isInvisible = attribDef.isInvisible;
    attrib.transformBy(blkRef.blockTransform);
    attrib = blkRef.appendAttribute(attrib).getMcDbEntity() as McDbAttribute;
    attrib.textStyle = attribDef.textStyle
    attrib.layer = attribDef.layer
  })
  blkRef.disableDisplay(false);

}

export function MxTest_GetAllLayer() {
  let mxcad = MxCpp.App.getCurrentMxCAD();
  let layerTable = mxcad.getDatabase().getLayerTable();
  let aryId = layerTable.getAllRecordId();
  let ret = [];
  aryId.forEach((id) => {
    let layerRec = id.getMcDbLayerTableRecord();
    if (layerRec === null) return;

    console.log(layerRec);
    console.log("layerRec.color:" + layerRec.color.getColorString());
    console.log("layerRec.name:" + layerRec.name);
    let layer: any = {};
    layer.name = layerRec.name;

    layer.color = layerRec.color.getColorString();
    ret.push(layer);
  });

  MxFun.postMessageToParentFrame(ret);
  return ret;
}


export function MxTest_AddLayer() {
  let mxcad = MxCpp.App.getCurrentMxCAD();
  let layerTable = mxcad.getDatabase().getLayerTable();
  if (!layerTable.has("xxx11")) {
    let newLayer = new McDbLayerTableRecord();
    newLayer.name = "xxx11";
    layerTable.add(newLayer);
  }

  if (layerTable.has("xxx11")) {
    console.log("add layer ok");
  }
}



export function MxTest_GetAllLinetype() {
  let mxcad = MxCpp.App.getCurrentMxCAD();
  let linetypeTable = mxcad.getDatabase().getLinetypeTable();
  let aryId = linetypeTable.getAllRecordId();
  aryId.forEach((id) => {
    let linetypeRec = id.getMcDbLinetypeTableRecord();
    if (linetypeRec === null) return;
    console.log(linetypeRec);
  });
}

export function MxTest_GetAllTextStyle() {
  let mxcad = MxCpp.getCurrentMxCAD();
  let textSyleTable = mxcad.getDatabase().getTextStyleTable();
  let aryId = textSyleTable.getAllRecordId();
  aryId.forEach((id) => {
    let textSyleRec = id.getMcDbTextStyleTableRecord();
    if (textSyleRec === null) return;
    let out: any = {};
    out.name = textSyleRec.name;
    out.font = textSyleRec.font();
    out.fileName = textSyleRec.fileName;
    out.bigFontFileName = textSyleRec.bigFontFileName;
    out.textSize = textSyleRec.textSize;
    out.xScale = textSyleRec.xScale;
    console.log(out);
  });
}


export async function MxTest_AddTextStyleTable() {
  let mxcad = MxCpp.getCurrentMxCAD();
  let textSyleTable = mxcad.getDatabase().getTextStyleTable();

  let sMyTextStyle = "MyTextStyle";
  if (textSyleTable.has(sMyTextStyle, false)) {
    let id = textSyleTable.get(sMyTextStyle, false);
    id.erase(false);
  };

  let newTextStyleRecord = new McDbTextStyleTableRecord();
  newTextStyleRecord.fileName = "txt.shx";
  newTextStyleRecord.bigFontFileName = "hztxt.shx";
  newTextStyleRecord.textSize = 10;
  newTextStyleRecord.name = sMyTextStyle;
  newTextStyleRecord.xScale = 0.7;
  if (textSyleTable.add(newTextStyleRecord).isValid()) {
    console.log("add ok");
  }
}



export function MxTest_GetAllBlock() {
  let mxcad = MxCpp.App.getCurrentMxCAD();
  let blockTable = mxcad.getDatabase().getBlockTable();
  let aryId = blockTable.getAllRecordId();
  aryId.forEach((id) => {
    let blkRec = id.getMcDbBlockTableRecord();
    if (blkRec === null) return;
    console.log(blkRec);
    console.log("blkRec.name:" + blkRec.name);
    console.log("blkRec.origin:" + blkRec.origin);
  });
}


async function Mx_Test_DrawTable() {
  let draw = new MxDrawTable();
  draw.data.addColumn("序号", 30);
  draw.data.addColumn("名称", 45);
  draw.data.addColumn("材料", 60);
  draw.data.addColumn("长度", 50);
  for (let i = 0; i < 10; i++) {
    let sT = "" + i;
    draw.data.addRow([sT, "AAAA", "BBBB", "1000"])
  }

  let getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\n指定表格插入点:");
  let pt = await getPoint.go();
  if (!pt) return;

  let lScale = MxFun.screenCoordLong2Doc(100) / 200;
  draw.draw(pt, lScale);
}


async function Mx_Test_QRCode() {
  const getPoint = new MrxDbgUiPrPoint()
  getPoint.setMessage('\n指定插入点:')
  let pt = await getPoint.go();
  if (!pt) return;

  let mxobj = MxFun.getCurrentDraw()
  // 创建一个二维码生成器
  const qr = QRCode(5, 'L');

  // 设置二维码的内容
  qr.addData('https://www.mxdraw3d.com');

  // 生成二维码图像
  qr.make();

  // 获取二维码的数据URL
  const qrDataURL = qr.createDataURL();

  // 创建一个纹理对象
  const texture = new THREE.TextureLoader().load(qrDataURL);

  // 创建一个材质对象并将纹理赋值给它
  const material = new THREE.MeshBasicMaterial({ map: texture });
  let w = MxFun.screenCoordLong2Doc(80)
  let h = MxFun.screenCoordLong2Doc(80)

  let image = new MxDbImage()
  image.setRenderOrder(MxType.MxDefaultRenderOrder.kCADMeshRenderOrder - 1)
  image.setPoint1(pt)
  let pt2 = new THREE.Vector3(pt.x + w, pt.y + h, pt.z)
  image.setPoint2(pt2)

  image.setMaterial(material as any);
  mxobj.addMxEntity(image);

  setInterval(() => {
    mxobj.updateDisplay();
  }, 100)
}



export async function MxTest_InsertStamp() {
  let baseUrl = "http://localhost:3000/mxcad/"
  if (baseUrl.substring(0, 16) == "http://localhost") {
    baseUrl = getHostUrl() + baseUrl.substring(16);
  }

  let blkFilePath = baseUrl + "stamp.mxweb";
  let mxcad = MxCpp.App.getCurrentMxCAD();
  let blkrecId = await mxcad.insertBlock(blkFilePath, "stamp");
  if (!blkrecId.isValid()) {
    // 插入图块
    return;
  }

  let blkRef = new McDbBlockReference();
  blkRef.blockTableRecordId = blkrecId;
  let box = blkRef.getBoundingBox();
  if (box.ret) {
    let dLen = box.maxPt.distanceTo(box.minPt);
    if (dLen > 0.00001) {
      blkRef.setScale(mxcad.getMxDrawObject().screenCoordLong2Doc(100) / dLen);
    }
  }

  let getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\指定插入基点");

  getPoint.setUserDraw((v, worldDraw) => {
    blkRef.position = v;
    worldDraw.drawMcDbEntity(blkRef);
  });

  let pt = await getPoint.go();
  if (!pt) return;
  blkRef.position = pt;
  mxcad.drawEntity(blkRef);
}


export async function MxTest_LineTypeTest() {
  let mxcad = MxCpp.getCurrentMxCAD();

  // 把当图上，已经存的"TestMyLine"线型删除，为了mxcad.addLinetypeEx重新添加定义线型.
  let linetypeRecord = mxcad.database.getLinetypeTable().get("TestMyLine");
  if (!linetypeRecord.isErase()) {
    linetypeRecord.erase();
  }
  let lintype = mxcad.addLinetypeEx("TestMyLine", '.5,-.2,["HW",STANDARD,S=.1,R=0.0,X=-0.1,Y=-.05],-.2', "");
  if (!lintype.isValid()) return;

  let getEnt = new MxCADUiPrEntity();
  let entId = await getEnt.go();
  let ent = entId.getMcDbEntity();
  if (!ent) return;
  ent.linetypeId = lintype;

}




function MxTest_DictionaryData(dict: McDbDictionary) {
  let aryName = dict.getAllObjectName();
  aryName.forEach((name) => {
    console.log(name);
    let id = dict.getAt(name);
    let obj = id.getMcDbObject();
    if (obj instanceof McDbDictionary) {
      let dict: McDbDictionary = obj;
      console.log(dict);
      MxTest_DictionaryData(dict);
    }
    else if (obj instanceof McDbXrecord) {
      let xrec: McDbXrecord = obj;
      let data = xrec.getData()
      data.PrintData();
    }
  })
}

async function MxTest_GetObjectExDictionaryData() {

    let selEntity = new MxCADUiPrEntity();
    selEntity.setMessage("选择标注对象");
    let id = await selEntity.go();
    if (!id.isValid()) return;
    let ent = id.getMcDbEntity();
    if(ent && ent.isHaveExtensionDictionary()){
        let dict = ent.getExtensionDictionary();
        MxTest_DictionaryData(dict);
    }
  }



export async function MxTest_GetNamedObjectsDictionary() {
  let mxcad = MxCpp.getCurrentMxCAD();
  let dict = mxcad.getDatabase().getNamedObjectsDictionary();
  let aryName = dict.getAllObjectName();
  aryName.forEach((name) => {
    console.log(name);
    let id = dict.getAt(name);
    let obj = id.getMcDbObject();
    if (obj instanceof McDbDictionary) {
      let dict: McDbDictionary = obj;
      console.log(dict);
      MxTest_DictionaryData(dict);
    }
  })

}


export async function MxTest_WriteXRecord() {
  let mxcad = MxCpp.getCurrentMxCAD();
  let dict = mxcad.getDatabase().getNamedObjectsDictionary();

  let sName = "MyDict";
  let idDict = dict.getAt(sName);
  if (idDict.isNull()) {
    let newDict = new McDbDictionary;
    idDict = dict.addObject(sName, newDict);
  }
  let myDict = idDict.getMcDbDictionary();
  if (myDict) {

    let xrec = new McDbXrecord();
    let data = new MxCADResbuf();
    data.AddString("TestData");
    xrec.setData(data);
    myDict.addObject("MyRecord", xrec);
    console.log("write xrecord ok");
  }
}

// 修改对象颜色
async function Mx_Test_ChangeColor() {
  let getEntity = new MxCADUiPrEntity();


  getEntity.setMessage("选择标注对象");
  let id = await getEntity.go();
  if (!id.isValid()) return;

  let ent = id.getMcDbEntity();
  if (!ent) return;
  ent.trueColor = new McCmColor(255, 0, 255);
}

// 设置对象不可见
let idVisible: any;
async function Mx_Test_ChangeVisible() {
  if (!idVisible) {
    let getEntity = new MxCADUiPrEntity();


    getEntity.setMessage("选择标注对象");
    let id = await getEntity.go();
    if (!id.isValid()) return;

    let ent = id.getMcDbEntity();
    if (!ent) return;
    ent.visible = false;
    idVisible = id;
  }
  else {
    let ent = idVisible.getMcDbEntity();
    if (!ent) return;
    ent.visible = true;
  }

}


async function Mx_Test_ChangeEntityLayer() {

  let newLayerName = "WALL";
  let mxcad = MxCpp.getCurrentMxCAD();
  if (!mxcad.database.layerTable.has(newLayerName)) {
    console.log("no have layer:" + newLayerName)
  }

  let getEntity = new MxCADUiPrEntity();


  getEntity.setMessage("选择对象");
  let id = await getEntity.go();
  if (!id.isValid()) return;

  let ent = id.getMcDbEntity();
  if (!ent) return;

  ent.layer = newLayerName;

}

async function Mx_ChaneEntityDrawOrder() {
  let ss = new MxCADSelectionSet();
  if (!await ss.userSelect("\n选择对象")) return;
  //得到当前图上对象的最大，小最显示顺序.
  let minmaxOrder = MxCpp.getCurrentDatabase().currentSpace.getMinMaxDrawOrder();
  // 把对象放到最上面。
  let lOrder = minmaxOrder.maxDrawOrder + 1;
  ss.forEach((id) => {
    let ent = id.getMcDbEntity();
    if (ent) {
      ent.drawOrder = lOrder;
    }
  })
}

export function init() {
  MxFun.addCommand("TestGetAllEntity", TestGetAllEntity);
  MxFun.addCommand("MxTest_GetSysVars", MxTest_GetSysVars);
  MxFun.addCommand("MxTest_ReadxData", MxTest_ReadxData);
  MxFun.addCommand("MxTest_WritexData", MxTest_WritexData);
  MxFun.addCommand("MxTest_DrawLine", MxTest_DrawLine);
  MxFun.addCommand("MxTest_InsertBlock", MxTest_InsertBlock);

  MxFun.addCommand("MxTest_GetAllLayer", MxTest_GetAllLayer);
  MxFun.addCommand("MxTest_AddLayer", MxTest_AddLayer);
  MxFun.addCommand("MxTest_GetAllTextStyle", MxTest_GetAllTextStyle);
  MxFun.addCommand("MxTest_GetAllBlock", MxTest_GetAllBlock);
  MxFun.addCommand("MxTest_GetAllLinetype", MxTest_GetAllLinetype);

  MxFun.addCommand("Mx_Test_DrawTable", Mx_Test_DrawTable);
  MxFun.addCommand("Mx_Test_QRCode", Mx_Test_QRCode);
  MxFun.addCommand("MxTest_InsertStamp", MxTest_InsertStamp);
  MxFun.addCommand("MxTest_LineTypeTest", MxTest_LineTypeTest);
  MxFun.addCommand("TestGentEntityOnLayer", TestGentEntityOnLayer);

  MxFun.addCommand("MxTest_GetNamedObjectsDictionary", MxTest_GetNamedObjectsDictionary);
  MxFun.addCommand("MxTest_GetObjectExDictionaryData", MxTest_GetObjectExDictionaryData);
  
  MxFun.addCommand("MxTest_WriteXRecord", MxTest_WriteXRecord);
  MxFun.addCommand("MxTest_AddTextStyleTable", MxTest_AddTextStyleTable);
  MxFun.addCommand("Mx_Test_ChangeColor", Mx_Test_ChangeColor);
  MxFun.addCommand("Mx_Test_ChangeVisible", Mx_Test_ChangeVisible);
  MxFun.addCommand("Mx_Test_ChangeEntityLayer", Mx_Test_ChangeEntityLayer);
  MxFun.addCommand("Mx_ChaneEntityDrawOrder", Mx_ChaneEntityDrawOrder);

}
