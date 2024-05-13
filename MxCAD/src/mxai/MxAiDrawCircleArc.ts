///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McDbArc, McGePoint3d, MxCADUiPrDist, MxCADUiPrPoint, MxCpp, _ML_String } from "mxcad";
import { baseParams, mergeBaseMcDbEntityProps, parsePoint } from "./base";
import { MxAiModule } from "./MxAiModule";
import { angleTo } from "./tools";
import { DetailedResult } from "mxdraw";

function createArc(center:McGePoint3d, radius: number, startAngle: number, endAngle: number) {
  const arc = new McDbArc()
  arc.center = center
  arc.radius = radius
  arc.startAngle = startAngle
  arc.endAngle = endAngle
  return arc
}

//绘制一个圆弧 圆心0，0 半径100 开始角30结束角180
// 三点绘制圆弧第一个点0，0第二个点10000，10000 第二个点180，-9000
class MxAiDrawCircleArc {
  async call(param: any) {
    console.log(param)
    let { center, radius, startAngle, endAngle, is3PDraw, point1, point2, point3 } =  param
    let mxcad = MxCpp.getCurrentMxCAD();
    mxcad.newFile()
    mxcad.zoomAll()
    const getPoint = new MxCADUiPrPoint()
    const getDist= new MxCADUiPrDist()
    if(is3PDraw) {
      if(point1) point1 = parsePoint(point1)
      if(point2) point2 = parsePoint(point2)
      if(point3) point3 = parsePoint(point3)
      getPoint.setKeyWords("")
      if(!point1) {
        getPoint.setMessage("指定圆弧起点")
        getPoint.setUserDraw((pt, pw)=> {
          if(!point2 || !point3) return
          const arc = new McDbArc()
          arc.computeArc(pt.x,pt.y, point2.x, point2.y, point3.x, point3.y)
          pw.drawMcDbEntity(arc)
        })
        point1 = await getPoint.go()
        if(!point1) return
      }
      if(!point2) {
        getPoint.setMessage("指定圆弧第二个点")
        getPoint.setUserDraw((pt, pw)=> {
          if(!point1 || !point3) return
          const arc = new McDbArc()
          arc.computeArc(point1.x,point1.y, pt.x, pt.y, point3.x, point3.y)

          pw.drawMcDbEntity(arc)
        })
        point2 = await getPoint.go()
        if(!point2) return
      }
      if(!point3) {

        getPoint.setMessage("指定圆弧的端点")
        getPoint.setUserDraw((pt, pw)=> {
          if(!point1 || !point2) return
          const arc = new McDbArc()
          arc.computeArc(point1.x,point1.y, point2.x, point2.y, pt.x, pt.y)
          pw.drawMcDbEntity(arc)
        })
        point3 = await getPoint.go()
        if(!point3) return
      }
      const arc = new McDbArc()
      console.log(point1.x,point1.y, point2.x, point2.y, point3.x, point3.y)
      arc.computeArc(point1.x,point1.y, point2.x, point2.y, point3.x, point3.y)
      mergeBaseMcDbEntityProps(arc, param)
      mxcad.drawEntity(arc)
      mxcad.updateDisplay()
    }else {
      if(center) center = parsePoint(center)
      if(startAngle) startAngle =  startAngle * (Math.PI / 180)
      if(endAngle) endAngle =  endAngle * (Math.PI / 180)

      if(!center) {
        getPoint.setMessage("指定圆弧圆心")
        getPoint.setKeyWords("")
        getPoint.setUserDraw((pt, pw)=> {
          if(!radius) return
          pw.drawMcDbEntity(createArc(pt, radius, startAngle || 0, endAngle || Math.PI * 2))
        })
        const point = await getPoint.go()
        if(!point) return
        center = point
      }
      if(!radius) {
        getDist.setBasePt(center)
        getDist.setMessage(_ML_String("MxAiDrawCircleArc_Radius", "指定圆弧半径"))
        getDist.setKeyWords("")
        getDist.setUserDraw((pt, pw)=> {
          if(!center) return
          const radius = pt.distanceTo(center)
          pw.drawMcDbEntity(createArc(center, radius, startAngle || 0, endAngle || Math.PI * 2))
        })
        radius = await getDist.go()
        if(!radius) return
      }
      if(!startAngle) {
        if(!center) return
        getDist.setBasePt(center)
        getDist.setMessage(_ML_String("MxAiDrawCircleArc_StartAngle", "指定圆弧开始角"))
        getDist.setKeyWords("")
        getDist.setUserDraw((pt, pw)=> {
          if(!center) return
          if(!radius) return
          startAngle = angleTo(center.x, center.y, pt.x, pt.y) - Math.PI
          pw.drawMcDbEntity(createArc(center, radius, startAngle || 0, endAngle || Math.PI * 2))
        })
        const val = await getDist.go()
        if(!val) return
        if(getDist.getDetailedResult() === DetailedResult.kCoordIn) {
          startAngle = val * (Math.PI / 180)
        }
      }
      if(!endAngle) {
        if(!center) return
        getDist.setBasePt(center)
        getDist.setMessage(_ML_String("MxAiDrawCircleArc_EndAngle", "指定圆弧结束角"))
        getDist.setKeyWords("")
        getDist.setUserDraw((pt, pw)=> {
          if(!center) return
          if(!radius) return
          endAngle = angleTo(center.x, center.y, pt.x, pt.y) - Math.PI
          pw.drawMcDbEntity(createArc(center, radius, startAngle || 0, endAngle || Math.PI * 2))
        })
        const val = await getDist.go()
        if(!val) return
        if(getDist.getDetailedResult() === DetailedResult.kCoordIn) {
          endAngle = val * (Math.PI / 180)
        }
      }
      const arc = createArc(center, radius, startAngle, endAngle)
      mergeBaseMcDbEntityProps(arc, param)
      mxcad.drawEntity(arc)
      mxcad.updateDisplay()
    }
  }

  public regist_data() {
    return {
      filename: "drawcirclearc.json",
      name: "draw_circle_arc",
      description: "绘制圆弧",
      params: [
        {
          name: "center", description: "圆弧圆心", "type": "tuple[float, float]", "required": true
        },
        {
          name: "radius", description: "圆弧半径", "type": "float", "required": true
        },
        {
          name: "startAngle", description: "圆弧开始角", "type": "float", "required": true
        },
        {
          name: "endAngle", description: "圆弧结束角", "type": "float", "required": true
        },
        {
          name: "is3PDraw", description: "是否三点绘制", "type": "boolean", "required": true
        },
        {
          name: "point1", description: "三点绘制圆弧的第一个点(起点)", "type": "tuple[float, float]", "required": true
        },
        {
          name: "point2", description: "三点绘制圆弧的第二个点", "type": "tuple[float, float]", "required": true
        },
        {
          name: "point3", description: "三点绘制圆弧的第三个点(终点)", "type": "tuple[float, float]", "required": true
        },
        ...baseParams,
      ]
    }

  }
}

export const init = ()=> {
  MxAiModule.regist(MxAiDrawCircleArc);
}
