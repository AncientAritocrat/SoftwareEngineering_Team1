///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { IMcDbDwgFiler, McDbCustomEntity, McDbLine, McDbPolyline, McGePoint3d, McGePoint3dArray, MxCADUiPrPoint, MxCADWorldDraw, MxCpp } from "mxcad";
import {
  MxFun,
} from "mxdraw";


class McDbTestLineCustomEntity extends McDbCustomEntity {

  private pt1: McGePoint3d = new McGePoint3d();
  private pt2: McGePoint3d = new McGePoint3d();

  constructor(imp?: any) {
    super(imp);
  }

  public create(imp: any) {
    return new McDbTestLineCustomEntity(imp)
  }

  public getTypeName(): string {
    return "McDbTestLineCustomEntity";
  }

  public dwgInFields(filter: IMcDbDwgFiler): boolean {
    this.pt1 = filter.readPoint("pt1").val;
    this.pt2 = filter.readPoint("pt2").val;
    return true;
  }

  public dwgOutFields(filter: IMcDbDwgFiler): boolean {
    filter.writePoint("pt1", this.pt1);
    filter.writePoint("pt2", this.pt2);
    return true;
  }


  public moveGripPointsAt(iIndex: number, dXOffset: number, dYOffset: number, dZOffset: number) {
    this.assertWrite();
    if (iIndex == 0) {
      this.pt1.x += dXOffset;
      this.pt1.y += dYOffset;
      this.pt1.z += dZOffset;
    }
    else if (iIndex == 1) {
      this.pt2.x += dXOffset;
      this.pt2.y += dYOffset;
      this.pt2.z += dZOffset;
    }
  };

  public getGripPoints(): McGePoint3dArray {
    let ret = new McGePoint3dArray()
    ret.append(this.pt1);
    ret.append(this.pt2);
    return ret;
  };



  public worldDraw(draw: MxCADWorldDraw): void {
    // let tmpline = new McDbLine(this.pt1, this.pt2);
    let pl= new McDbPolyline()
    pl.addVertexAt(this.pt1)
    pl.addVertexAt(this.pt2)
    pl.addVertexAt(new McGePoint3d())
    draw.drawEntity(pl);
  }

  //
  public setPoint1(pt1: McGePoint3d) {
    this.assertWrite();
    this.pt1 = pt1.clone();
  }

  public setPoint2(pt2: McGePoint3d) {
    this.assertWrite();
    this.pt2 = pt2.clone();
  }

  public getPoint1() {
    return this.pt1;
  }

  public getPoint2() {
    return this.pt2;
  }
}


export async function MxTest_DrawCustomEntity() {
  let mxcad = MxCpp.getCurrentMxCAD();
  const getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\n指定一点:");
  let pt1 = (await getPoint.go());
  if (!pt1) return;

  getPoint.setBasePt(pt1);
  getPoint.setUseBasePt(true);

  getPoint.setMessage("\n指定二点:");
  let pt2 = (await getPoint.go());
  if (!pt2) return;

  let myline = new McDbTestLineCustomEntity();
  myline.setPoint1(pt1);
  myline.setPoint2(pt2);
  mxcad.drawEntity(myline);
}


export function init() {
  new McDbTestLineCustomEntity().rxInit();
  MxFun.addCommand("MxTest_DrawCustomEntity", MxTest_DrawCustomEntity);
}
