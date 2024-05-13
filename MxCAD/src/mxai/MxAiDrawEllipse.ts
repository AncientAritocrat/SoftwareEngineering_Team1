///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McDbEllipse, MxCADUiPrDist, MxCADUiPrPoint, MxCpp, McGePoint3d, McGeVector3d, _ML_String } from "mxcad";
import { baseParams, mergeBaseMcDbEntityProps, parsePoint } from "./base";
import { MxAiModule } from "./MxAiModule";
import { DetailedResult } from "mxdraw";
import { angleTo } from "./tools";

const createEllipse = (endPoint1: McGePoint3d, endPoint2: McGePoint3d, halfAxisLength: number, startAngle: number, endAngle: number) => {
  const ellipse = new McDbEllipse()
  const center  = new McGePoint3d((endPoint1.x + endPoint2.x) / 2, (endPoint2.y + endPoint2.y) / 2)
  const majorAxis  = endPoint1.sub(endPoint2)
  const minorAxis  = majorAxis
  const xRadius = endPoint1.distanceTo(endPoint2) / 2
  const yRadius = halfAxisLength / 2
  const radiusRatio =  yRadius / xRadius
  ellipse.center = center
  ellipse.majorAxis = majorAxis
  ellipse.minorAxis = minorAxis
  ellipse.radiusRatio = radiusRatio
  ellipse.startAngle = startAngle
  ellipse.endAngle = endAngle
  return ellipse
}

//绘制椭圆，端点100,200，另一个端点1000,1000 半轴长1000
class MxAiDrawEllipse {
  async call(param: any) {
    let { endPoint1, endPoint2, halfAxisLength } = param
    const mxcad = MxCpp.getCurrentMxCAD();
    mxcad.newFile()
    const getPoint = new MxCADUiPrPoint()
    const getDist = new MxCADUiPrDist()
    if(endPoint1) endPoint1 = parsePoint(endPoint1)
    if(endPoint2) endPoint2 = parsePoint(endPoint2)
    if(!endPoint1) {
      getPoint.setMessage("指定椭圆的轴端点1")
      getPoint.setKeyWords("")

      getPoint.setUserDraw((pt, pw)=> {
        if(!endPoint2) return
        if(!halfAxisLength) return
        pw.drawMcDbEntity(createEllipse(pt, endPoint2, halfAxisLength, 0, Math.PI * 2))
      })
      endPoint1 = await getPoint.go()
      if(!endPoint1) return

    }
    if(!endPoint2) {
      getPoint.setMessage("指定椭圆的轴端点2")
      getPoint.setKeyWords("")

      getPoint.setUserDraw((pt, pw)=> {
        if(!endPoint1) return
        if(!halfAxisLength) return
        pw.drawMcDbEntity(createEllipse(endPoint1, pt, halfAxisLength, 0, Math.PI * 2))
      })
      endPoint2 = await getPoint.go()
      if(!endPoint2) return
    }
    if(!halfAxisLength) {
      getDist.setMessage("指定半轴长度")
      getDist.setKeyWords("")
      const center  = new McGePoint3d((endPoint1.x + endPoint2.x) / 2, (endPoint2.y + endPoint2.y) / 2)
      getDist.setBasePt(center)
      getDist.setUserDraw((pt, pw)=> {
        if(!endPoint1) return
        pw.drawMcDbEntity(createEllipse(endPoint1, endPoint2, center.distanceTo(pt), 0, Math.PI * 2))
      })
      halfAxisLength = await getDist.go()
      if(!halfAxisLength) return
    }
    const ellipse = createEllipse(endPoint1, endPoint2, halfAxisLength, 0, Math.PI * 2)
    mergeBaseMcDbEntityProps(ellipse, param)
    mxcad.drawEntity(ellipse)
  }

  public regist_data() {
    return {
      filename: "drawellipse.json",
      name: "draw_ellipse",
      description: "绘制椭圆",
      params: [
        {
          name: "endPoint1", description: "椭圆端点1", "type": "tuple[float, float]", "required": true
        },
        {
          name: "endPoint2", description: "椭圆端点2", "type": "tuple[float, float]", "required": true
        },
        {
          name: "halfAxisLength", description: "半轴长度", "type": "float", "required": true
        },
        ...baseParams,
      ]
    }
  }
}

//绘制椭圆弧，端点100,200，另一个端点1000,1000 半轴长1000开始角30 结束角120
class MxAiDrawEllipseArc {
  async call(param: any) {
    let { endPoint1, endPoint2, halfAxisLength, startAngle, endAngle } = param
    const mxcad = MxCpp.getCurrentMxCAD();
    mxcad.newFile()
    const getPoint = new MxCADUiPrPoint()
    const getDist = new MxCADUiPrDist()
    if(endPoint1) endPoint1 = parsePoint(endPoint1)
    if(endPoint2) endPoint2 = parsePoint(endPoint2)
    if(startAngle) startAngle = startAngle * (Math.PI / 180)
    if(endAngle) endAngle = endAngle * (Math.PI / 180)
    if(!endPoint1) {
      getPoint.setMessage("指定椭圆的轴端点1")
      getPoint.setKeyWords("")

      getPoint.setUserDraw((pt, pw)=> {
        if(!endPoint2) return
        if(!halfAxisLength) return
        pw.drawMcDbEntity(createEllipse(pt, endPoint2, halfAxisLength, 0, Math.PI * 2))
      })
      endPoint1 = await getPoint.go()
      if(!endPoint1) return

    }
    if(!endPoint2) {
      getPoint.setMessage("指定椭圆的轴端点2")
      getPoint.setKeyWords("")

      getPoint.setUserDraw((pt, pw)=> {
        if(!endPoint1) return
        if(!halfAxisLength) return
        pw.drawMcDbEntity(createEllipse(endPoint1, pt, halfAxisLength, 0, Math.PI * 2))
      })
      endPoint2 = await getPoint.go()
      if(!endPoint2) return
    }
    const center  = new McGePoint3d((endPoint1.x + endPoint2.x) / 2, (endPoint2.y + endPoint2.y) / 2)
    if(!halfAxisLength) {
      getDist.setMessage("指定半轴长度")
      getDist.setKeyWords("")
      getDist.setBasePt(center)
      getDist.setUserDraw((pt, pw)=> {
        if(!endPoint1) return
        pw.drawMcDbEntity(createEllipse(endPoint1, endPoint2, center.distanceTo(pt), 0, Math.PI * 2))
      })
      halfAxisLength = await getDist.go()
      if(!halfAxisLength) return
    }
    const angle = angleTo(center.x, center.y, endPoint1.x, endPoint1.y)
    if(!startAngle) {
      getDist.setMessage(_ML_String("EllipticalArc_startAngle","指定起点角度"))
      getDist.setKeyWords("")
      getDist.setUserDraw((currentPoint, pWorldDraw) => {
        startAngle = angleTo(center.x, center.y, currentPoint.x, currentPoint.y) - angle - Math.PI
        pWorldDraw.drawMcDbEntity(createEllipse(endPoint1, endPoint2, halfAxisLength, startAngle, Math.PI * 2))
      })
      const val = await getDist.go()
      if (!val) return
      if(getDist.getDetailedResult() == DetailedResult.kCoordIn) {
        startAngle = val * (180 / Math.PI)
      }
    }
    if(!endAngle) {
      getDist.setLastInputPoint(center)
      getDist.setMessage(_ML_String("EllipticalArc_endAngle","指定端点角度"))
      getDist.setKeyWords("")
      getDist.setUserDraw((currentPoint, pWorldDraw) => {
        endAngle = angleTo(center.x, center.y, currentPoint.x, currentPoint.y) - angle - Math.PI
        pWorldDraw.drawMcDbEntity(createEllipse(endPoint1, endPoint2, halfAxisLength, startAngle, endAngle))
      })
      const val1 = await getDist.go()
      if(!val1) return
      if(getDist.getDetailedResult() === DetailedResult.kCoordIn) {
        endAngle = val1 * (180 / Math.PI)
      }
    }
    const ellipse = createEllipse(endPoint1, endPoint2, halfAxisLength, startAngle, endAngle)
    mergeBaseMcDbEntityProps(ellipse, param)
    mxcad.drawEntity(ellipse)
  }

  public regist_data() {
    return {
      filename: "drawellipseArc.json",
      name: "draw_ellipse_arc",
      description: "绘制椭圆弧",
      params: [
        {
          name: "endPoint1", description: "椭圆弧端点1", "type": "tuple[float, float]", "required": true
        },
        {
          name: "endPoint2", description: "椭圆弧端点2", "type": "tuple[float, float]", "required": true
        },
        {
          name: "halfAxisLength", description: "半轴长度", "type": "float", "required": true
        },
        {
          name: "startAngle", description: "开始角度", "type": "float", "required": true
        },
        {
          name: "endAngle", description: "结束角度", "type": "float", "required": true
        },
        ...baseParams,
      ]
    }
  }
}
export const init = ()=> {
  MxAiModule.regist(MxAiDrawEllipse);
  MxAiModule.regist(MxAiDrawEllipseArc);
}


