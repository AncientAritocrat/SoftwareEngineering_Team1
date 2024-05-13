///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxCpp } from "mxcad";
import { baseParams, mergeBaseMcDbEntityProps, parsePoint } from "./base";
import { MxAiModule } from "./MxAiModule";

//绘制一个圆，圆心100，200，半径499
class MxAiDrawCircle {
  public call(param: any) {
    console.log(param)
    if (param && param.cen && param.radius) {
      if(param.cen) param.center = parsePoint(param.cen)
      let mxcad = MxCpp.getCurrentMxCAD();
      const objId = mxcad.drawCircle(param.center.x, param.center.y,param.radius);
      mergeBaseMcDbEntityProps(objId.getMcDbEntity(), param);
      mxcad.updateDisplay();
    }
  }

  public regist_data() {
    return {
      filename: "drawcircle.json",
      name: "draw_circle",
      description: "根据圆心和半径绘制一个圆",
      params: [
        {
          name: "center", description: "圆的中心点", "type": "tuple[float, float]", "required": true
        },
        {
          name: "radius", description: "圆的半径", "type": "float", "required": true
        },
        ...baseParams,
      ]
    }

  }
}

export const init = ()=> {
  MxAiModule.regist(MxAiDrawCircle);
}
