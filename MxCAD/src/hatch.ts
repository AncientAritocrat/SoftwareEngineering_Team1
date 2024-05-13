///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import { MxFun } from "mxdraw";
import { McGePoint3d, MxCADUiPrPoint, MxCADUtility, MxCpp } from "mxcad";
async function MxTest_DrawHatchFormPoint() {
  const getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\n指定填充区域内部一点:");
  getPoint.disableAllTrace(true);
  getPoint.setDisableOsnap(true);
  let pt = (await getPoint.go()) as McGePoint3d;
  if (!pt) return;

  let hatch = MxCADUtility.builderHatchFromPoint(pt);
  if (!hatch) {
    MxFun.acutPrintf("没有找到闭合区域\n")
    return;
  }

  let mxcad = MxCpp.getCurrentMxCAD();
  mxcad.drawEntity(hatch);
}

export function init() {
  MxFun.addCommand("MxTest_DrawHatchFormPoint", MxTest_DrawHatchFormPoint);
}
