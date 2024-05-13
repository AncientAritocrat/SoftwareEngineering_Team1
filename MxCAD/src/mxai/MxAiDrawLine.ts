///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxCpp } from "mxcad";
import { MxAiModule } from "./MxAiModule";
import { baseParams, mergeBaseMcDbEntityProps, parsePoint } from "./base";


//绘制一个直线，开始点100，200，结束点499,121
class MxAiDrawLine {
  public call(param: any) {
    console.log(param)
    if (param && param.pt1 && param.pt2) {
      let mxcad = MxCpp.getCurrentMxCAD();
      if(param.pt1) param.pt1 = parsePoint(param.pt1)
      if(param.pt2) param.pt2 = parsePoint(param.pt2)

      const objId = mxcad.drawLine(param.pt1.x, param.pt1.y, param.pt2.x, param.pt2.y);
      mergeBaseMcDbEntityProps(objId.getMcDbEntity(), param)
      mxcad.updateDisplay();
    }
  }

  public regist_data() {
    return {
      filename: "drawline.json",
      name: "draw_line",
      description: "根据直线的开始点和结束点绘制一个直线段",
      params: [
        {
          name: "pt1", description: "直线开始点", "type": "tuple[float, float]", "required": true
        },
        {
          name: "pt2", description: "直线结束点", "type": "tuple[float, float]", "required": true
        },
        ...baseParams,
      ]
    }
  }

}

export function init() {
  MxAiModule.regist(MxAiDrawLine);
}

