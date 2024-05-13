///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McDb, McDbLine, McDbPolyline, McGePoint3d, McGePoint3dArray, McGeVector3d, MxCADUiPrPoint, MxCADUtility, MxCpp } from "mxcad";
import { MxAiModule } from "./MxAiModule";
import { baseParams, mergeBaseMcDbEntityProps, parsePoint } from "./base";
const rotatePoint = (center: McGePoint3d, point: McGePoint3d, angle: number): McGePoint3d => {
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;
  const x = translatedX * cosAngle - translatedY * sinAngle + center.x;
  const y = translatedX * sinAngle + translatedY * cosAngle + center.y;
  const z = point.z;
  return new McGePoint3d(x, y, z);
};
const getRectPoints = (pt1: McGePoint3d, pt3: McGePoint3d, angle = 0)=> {
  const center = new McGePoint3d((pt1.x + pt3.x) / 2, (pt1.y + pt3.y) / 2, (pt1.z + pt3.z) / 2);
  const pt2 = new McGePoint3d(pt1.x, pt3.y, pt1.z);
  const pt4 = new McGePoint3d(pt3.x, pt1.y, pt3.z);
  const rotatedPt2 = rotatePoint(center, pt2, angle);
  const rotatedPt4 = rotatePoint(center, pt4, angle);
  return [pt1, rotatedPt2, pt3, rotatedPt4];
}
// 象限
const getQuadrant = (pt1: McGePoint3d, pt3: McGePoint3d) => {
  return [(pt3.x >= pt1.x && pt3.y >= pt1.y), (pt3.x < pt1.x && pt3.y >= pt1.y), (pt3.x < pt1.x && pt3.y < pt1.y), (pt3.x >= pt1.x && pt3.y < pt1.y)] as [boolean, boolean, boolean, boolean]
}
// 倒角
function calculateRoundedRectangleVertices(points: McGePoint3d[], chamferDistance1: number, chamferDistance2: number) {
  if (chamferDistance1 === 0 && chamferDistance2 === 0) return points
  const [pt1, pt2, pt3, pt4] = points

  const width = pt1.distanceTo(pt4)
  const height = pt1.distanceTo(pt2)
  const [_, isPt3InQuadrant2, isPt3InQuadrant3, isPt3InQuadrant4] = getQuadrant(pt1, pt3)
  const chamferDistanceX = isPt3InQuadrant2 || isPt3InQuadrant3 ? -chamferDistance1 : chamferDistance1;
  const chamferDistanceY = isPt3InQuadrant3 || isPt3InQuadrant4 ? -chamferDistance2 : chamferDistance2;
  if ((width - Math.abs(chamferDistanceX) * 2) <= 0) return points
  if ((height - Math.abs(chamferDistanceY) * 2) <= 0) return points

  const chamferedPt1 = new McGePoint3d(pt1.x + chamferDistanceX, pt1.y, pt1.z);
  const chamferedPt2 = new McGePoint3d(pt1.x, pt1.y + chamferDistanceY, pt1.z);
  const chamferedPt3 = new McGePoint3d(pt2.x, pt2.y - chamferDistanceY, pt2.z);
  const chamferedPt4 = new McGePoint3d(pt2.x + chamferDistanceX, pt2.y, pt2.z);
  const chamferedPt5 = new McGePoint3d(pt3.x - chamferDistanceX, pt3.y, pt3.z);
  const chamferedPt6 = new McGePoint3d(pt3.x, pt2.y - chamferDistanceY, pt3.z);
  const chamferedPt7 = new McGePoint3d(pt4.x, pt4.y + chamferDistanceY, pt4.z);
  const chamferedPt8 = new McGePoint3d(pt4.x - chamferDistanceX, pt4.y, pt4.z);
  const chamferedPolygon = [
      chamferedPt1,
      chamferedPt2,
      chamferedPt3,
      chamferedPt4,
      chamferedPt5,
      chamferedPt6,
      chamferedPt7,
      chamferedPt8,
  ];
  return chamferedPolygon;
}

export function CMxDrawPolylineDragArcDraw_CalcArcBulge(firstPoint: McGePoint3d, nextPoint: McGePoint3d, vecArcTangent: McGeVector3d): number {
  if (firstPoint.isEqualTo(nextPoint))
    return 0.0;
  let midPt = firstPoint.c().addvec(nextPoint.c().sub(firstPoint).mult(0.5));

  let vecMid = nextPoint.c().sub(firstPoint);
  vecMid.rotateBy(Math.PI / 2.0, McGeVector3d.kZAxis);

  let tmpMidLine = new McDbLine(midPt, midPt.c().addvec(vecMid));

  let vecVertical: McGeVector3d = vecArcTangent.c();
  vecVertical.rotateBy(Math.PI / 2.0, McGeVector3d.kZAxis);

  let tmpVerticalLine = new McDbLine(firstPoint, firstPoint.c().addvec(vecVertical));

  let aryPoint: McGePoint3dArray = tmpMidLine.IntersectWith(tmpVerticalLine, McDb.Intersect.kExtendBoth);
  if (aryPoint.isEmpty())
    return 0.0;

  let arcCenPoint = aryPoint.at(0);

  let dR = arcCenPoint.distanceTo(firstPoint);

  vecMid.normalize();
  vecMid.mult(dR);

  let arcMidPt1 = arcCenPoint.c().addvec(vecMid);
  let arcMidPt2 = arcCenPoint.c().subvec(vecMid);
  let vecArcDir1 = arcMidPt1.c().sub(firstPoint);
  let vecArcDir2 = arcMidPt2.c().sub(firstPoint);
  let arcMidPt = arcMidPt1;
  if (vecArcDir1.angleTo1(vecArcTangent) > vecArcDir2.angleTo1(vecArcTangent)) {
    arcMidPt = arcMidPt2;
  }
  return MxCADUtility.calcBulge(firstPoint, arcMidPt, nextPoint).val;
}

// 绘制矩形两个对角点0， 0， 100, 100
// 绘制矩形第一个对角点0，0 第二个对角点 800， 800
// 绘制矩形第一个对角点0，0 第二个对角点 800， 800 倒角50
// 绘制矩形第一个对角点0，0 第二个对角点 800， 800 第一个倒角50第二个倒角100
// 绘制矩形第一个对角点0，0 第一个倒角50第二个倒角100
// 绘制矩形第一个对角点0，0,  第二个对角点 800， 800 圆角50
// 绘制矩形两个对角点0， 0， 100, 100圆角20
// 绘制矩形两个对角点0， 0， 100, 100圆角20 线宽10
// 绘制矩形 矩形面积1000 矩形长度200
// 绘制矩形第一个对角点0， 0, 面积1000宽度200
// 绘制矩形第一个对角点0， 0, 长度300 宽度200
// 绘制矩形两个对角点0， 0， 100, 100旋转角度30度
// 绘制一个第一个对角点为0，0面积为800长度50的红色矩形

class MxAiDrawRect {
  async call(param: any) {
    console.log(param)
    MxCpp.getCurrentMxCAD().newFile()
    let { pt1, pt2:pt3, chamfer1Length, chamfer2Length, filletRadius, lineWidth, area, rectLength, rectWidth, rotationAngle } = param
    const createRect = (pt1: McGePoint3d, pt3: McGePoint3d) => {
      const [_pt1, pt2, _pt3, pt4] = getRectPoints(pt1, pt3, rotationAngle)
      const rect = new McDbPolyline()
      rect.addVertexAt(_pt1, 0, lineWidth, lineWidth)
      rect.addVertexAt(pt2, 0, lineWidth, lineWidth)
      rect.addVertexAt(_pt3, 0, lineWidth, lineWidth)
      rect.addVertexAt(pt4, 0, lineWidth, lineWidth)
      rect.isClosed = true
      if(lineWidth) rect.constantWidth = lineWidth
      return rect
    }
    const create = (pt1: McGePoint3d, pt3: McGePoint3d)=> {
      let rect: McDbPolyline
      if(filletRadius) {
        const points = calculateRoundedRectangleVertices(getRectPoints(pt1, pt3, rotationAngle), filletRadius, filletRadius)
        const [_, isPt3InQuadrant2, isPt3InQuadrant3, isPt3InQuadrant4] = getQuadrant(pt1, pt3)
        if (points.length === 8) {
            if(!rect) rect = new McDbPolyline()
            const addArc = (startPoint: McGePoint3d, endPoint: McGePoint3d, key?: McGeVector3d) => {
                let vecArcTangent: McGeVector3d = new McGeVector3d(key);
                const bulge = CMxDrawPolylineDragArcDraw_CalcArcBulge(startPoint, endPoint, vecArcTangent)
                rect.addVertexAt(startPoint, bulge, lineWidth, lineWidth)
                rect.addVertexAt(endPoint, 0, lineWidth, lineWidth)
            }
            const vec1 = new McGeVector3d(-1, 0)
            const vec2 = new McGeVector3d(0, 1)
            const vec3 = new McGeVector3d(1, 0)
            const vec4 = new McGeVector3d(0, -1)
            if (isPt3InQuadrant4) {
                vec2.y = -1
                vec3.x = 1
                vec4.y = 1
            }
            if (isPt3InQuadrant2) {
                vec1.x = 1
                vec2.y = 1
                vec3.x = -1
                vec4.y = -1
            }
            if (isPt3InQuadrant3) {
                vec1.x = 1
                vec2.y = -1
                vec3.x = -1
                vec4.y = 1
            }
            addArc(points[0], points[1], vec1)

            addArc(points[2], points[3], vec2)

            addArc(points[4], points[5], vec3)

            addArc(points[6], points[7], vec4)
            rect.isClosed = true
        }
      }
      else if(chamfer1Length || chamfer2Length) {
        if(!rect) rect = new McDbPolyline()
        const points = calculateRoundedRectangleVertices(getRectPoints(pt1, pt3, rotationAngle), chamfer1Length || chamfer2Length, chamfer2Length || chamfer1Length)
        points.forEach((point)=> {
          rect.addVertexAt(point)
        })
        rect.isClosed = true
      }
      if(!rect) rect = createRect(pt1, pt3)
      if(lineWidth) rect.constantWidth = lineWidth
      return rect
    }
    if(!pt1) {
      const getPoint = new MxCADUiPrPoint()
      getPoint.setMessage("指定第一个角点")
      getPoint.setKeyWords("")
      pt1 = await getPoint.go()
      if(!pt1) return
    }else {
      pt1 = parsePoint(pt1)
    }
    if(area) {
      if(rectLength) {
        rectWidth = area / rectLength
      }
      if(rectWidth) {
        rectLength = area / rectWidth
      }
    }
    if(rectLength && rectWidth) {
      pt3 = new McGePoint3d(pt1.x + rectWidth, pt1.y + rectLength, 0)
    }
    if(!pt3) {
      const getPoint = new MxCADUiPrPoint()
      getPoint.setMessage("指定第二个角点")
      getPoint.setKeyWords("")
      getPoint.setUserDraw((pt, pw)=> {
        pw.drawMcDbEntity(create(pt1, pt))
      })
      pt3 = await getPoint.go()
      if(!pt3) return
    }else {
      pt3 = parsePoint(pt3)
    }
    const rect = create(pt1, pt3)
    mergeBaseMcDbEntityProps(rect, param)
    MxCpp.getCurrentMxCAD().drawEntity(rect)
  }

  public regist_data() {
    return {
      filename: "drawRect.json",
      name: "draw_rect",
      description: "根据一些信息绘制矩形",
      params: [
        {
          name: "pt1", description: "一个对角点", "type": "tuple[float, float]", "required": true
        },
        {
          name: "pt2", description: "另一个对角点", "type": "tuple[float, float]", "required": true
        },
        {
          name: "lineWidth", description: "矩形线的宽", "type": "float", "required": true
        },
        {
          name: "filletRadius", description: "圆角半径", "type": "float", "required": true
        },
        {
          name: "chamfer1Length", description: "第一个倒角距离", "type": "float", "required": true
        },
        {
          name: "chamfer2Length", description: "第二个倒角距离", "type": "float", "required": true
        },
        {
          name: "rectLength", description: "长度", "type": "float", "required": true
        },
        {
          name: "rectWidth", description: "矩形宽度", "type": "float", "required": true
        },
        {
          name: "area", description: "面积", "type": "float", "required": true
        },
        {
          name: "rotationAngle", description: "旋转角度", "type": "float", "required": true
        },
        ...baseParams,
      ]
    }
  }

}

export function init() {
  MxAiModule.regist(MxAiDrawRect);
}
