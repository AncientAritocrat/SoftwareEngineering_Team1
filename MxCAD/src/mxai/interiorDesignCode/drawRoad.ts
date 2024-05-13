///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McGePoint3d, MxCpp, McDbPolyline, McGeVector3d, MxCADUtility, McCmColor, McDbLine, McDb, McGePoint3dArray, McObjectId, McGeLongArray, MxCADSelectionSet } from "mxcad";
import { baseParams, parseParamPoints } from "../base";
import { findIntersection } from "../tools";


function getMidPoint(x: number, y: number, x1: number, y1: number) {
  return new McGePoint3d((x + x1) / 2, (y + y1) / 2)
}
type McGePointAndBulge = (McGePoint3d & { bulge?: number })
class RoadLine {
  outsidePoints: [McGePointAndBulge, McGePointAndBulge]
  insidePoints: [McGePointAndBulge, McGePointAndBulge]
  startPint: McGePoint3d
  endPint: McGePoint3d

  width = 50
  constructor(start: McGePoint3d, end: McGePoint3d, width = 50) {
    this.update(start, end, width)
  }
  update(start: McGePoint3d, end: McGePoint3d, width = this.width) {
    let dirVector = start.sub(end).normalize()
    dirVector = new McGeVector3d(-dirVector.y, dirVector.x, 0).mult(width / 2)
    const negateDirVector = dirVector.clone().negate()
    this.outsidePoints = [start.clone().addvec(dirVector), end.clone().addvec(dirVector)];
    this.insidePoints = [start.clone().addvec(negateDirVector), end.clone().addvec(negateDirVector)]
    this.width = width
    this.startPint = start.clone()
    this.endPint = end.clone()
  }
  calcBulge(nextLine: RoadLine, lienPointsName: "insidePoints" | "outsidePoints") {
    const firstPoint = this[lienPointsName][1]
    const nextPoint = nextLine[lienPointsName][0]
    const vecArcTangent = nextLine[lienPointsName][0].sub(nextLine[lienPointsName][1])
    if (firstPoint.isEqualTo(nextPoint)) return 0

    const midPt = firstPoint.c().addvec(nextPoint.c().sub(firstPoint).mult(0.5));

    const vecMid = nextPoint.c().sub(firstPoint);
    vecMid.rotateBy(Math.PI / 2.0, McGeVector3d.kZAxis);

    const tmpMidLine = new McDbLine(midPt, midPt.c().addvec(vecMid));

    const vecVertical: McGeVector3d = vecArcTangent.c();
    vecVertical.rotateBy(Math.PI / 2.0, McGeVector3d.kZAxis);

    const tmpVerticalLine = new McDbLine(firstPoint, firstPoint.c().addvec(vecVertical));

    const aryPoint: McGePoint3dArray = tmpMidLine.IntersectWith(tmpVerticalLine, McDb.Intersect.kExtendBoth);
    if (aryPoint.isEmpty())
      return 0.0;

    const arcCenPoint = aryPoint.at(0);

    const dR = arcCenPoint.distanceTo(firstPoint);

    vecMid.normalize();
    vecMid.mult(dR);

    const arcMidPt1 = arcCenPoint.c().addvec(vecMid);
    const arcMidPt2 = arcCenPoint.c().subvec(vecMid);
    const vecArcDir1 = arcMidPt1.c().sub(firstPoint);
    const vecArcDir2 = arcMidPt2.c().sub(firstPoint);
    let arcMidPt = arcMidPt1;
    if (vecArcDir1.angleTo1(vecArcTangent) < vecArcDir2.angleTo1(vecArcTangent)) {
      arcMidPt = arcMidPt2;
    }
    return MxCADUtility.calcBulge(firstPoint, arcMidPt, nextPoint).val;
  }

  draw() {
    const pl = new McDbPolyline()
    pl.addVertexAt(this.insidePoints[0])
    pl.addVertexAt(this.insidePoints[1])
    pl.addVertexAt(this.outsidePoints[1])
    pl.addVertexAt(this.outsidePoints[0])
    pl.isClosed = true
    pl.trueColor = new McCmColor(255, 0, 0)
    MxCpp.getCurrentMxCAD().drawEntity(pl)
    return pl
  }
  clone() {
    return new RoadLine(this.startPint, this.endPint, this.width)
  }
  findIntersectionPoint(lien: RoadLine, lienPointsName: "insidePoints" | "outsidePoints") {
    return findIntersection(this[lienPointsName][0], this[lienPointsName][1], lien[lienPointsName][0], lien[lienPointsName][1])
  }
  findInterPoints(line: RoadLine) {
    return [
      findIntersection(this.insidePoints[0], this.insidePoints[1], line.insidePoints[0], line.insidePoints[1]),
      findIntersection(this.insidePoints[0], this.insidePoints[1], line.outsidePoints[0], line.outsidePoints[1]),
      findIntersection(this.outsidePoints[0], this.outsidePoints[1], line.outsidePoints[0], line.outsidePoints[1]),
      findIntersection(this.outsidePoints[0], this.outsidePoints[1], line.insidePoints[0], line.insidePoints[1])
    ]
  }

}


class RoadBody {
  public call(param: any) {
    let width = 50
    if (param && param.points) {
      let mxcad = MxCpp.getCurrentMxCAD();
      const points = parseParamPoints(param.points)
      if (points.length < 2) return
      mxcad.newFile()
      const wallLines: RoadLine[] = []
      let i = 0

      while (i < points.length) {
        const point = points[i]
        i++
        const nextPoint = points[i]
        if (!nextPoint) {
          const line = new RoadLine(point, points[i - 1], width)
          wallLines.push(line)
          // line.draw()
          break;
        }
        const line = new RoadLine(point, nextPoint, width)
        wallLines.push(line)
        // line.draw()
      }
      let j = 0
      const insidePoints: McGePointAndBulge[] = []
      const outsidePoints: McGePointAndBulge[] = []

      while (j < wallLines.length) {
        const line = wallLines[j]
        j++
        const nextLine = wallLines[j]
        if (!nextLine) break;
        ;["insidePoints", "outsidePoints"].forEach((key: "insidePoints" | "outsidePoints") => {
          const points = key === "insidePoints" ? insidePoints : outsidePoints
          if (points.length === 0 || !points[points.length - 1].isEqualTo(line[key][0])) {
            points.push(line[key][0])
          }
          const intersectionPoint = line.findIntersectionPoint(nextLine, key)
          if (intersectionPoint) {
            nextLine[key][0] = line[key][1] = intersectionPoint
          } else {
            const bulge = line.calcBulge(nextLine, key)
            nextLine[key][0].bulge = bulge
            points.push(line[key][1], nextLine[key][0])
          }

        })
      }
      const pl = new McDbPolyline()
      pl.isClosed = true
      for (let i = 0; i < insidePoints.length; i++) {
        const point = insidePoints[i]
        pl.addVertexAt(point, point.bulge || 0)
      }
      for (let j = outsidePoints.length - 1; j >= 0; j--) {
        const point = outsidePoints[j]
        pl.addVertexAt(point, point.bulge || 0)
      }

      const plId = mxcad.drawEntity(pl)
      let plIdLong = new McGeLongArray();
      plIdLong.copyFormAryId([plId])

      wallLines.forEach((wall1, index1) => {
        wallLines.forEach((wall2, index2) => {

          if (index1 === index2) return
          const [p1, p2, p3, p4] = wall1.findInterPoints(wall2)
          if (!p1 || !p2 || !p3 || !p4) return
          let aryIdLong = new McGeLongArray();
          const line1 = new McDbLine(wall1.outsidePoints[0], wall1.outsidePoints[1])
          const line2 = new McDbLine(wall1.insidePoints[0], wall1.insidePoints[1])
          const line3 = new McDbLine(wall2.outsidePoints[0], wall2.outsidePoints[1])
          const line4 = new McDbLine(wall2.insidePoints[0], wall2.insidePoints[1])
          if (index1 === 0) line1.trueColor = line2.trueColor = line3.trueColor = line4.trueColor = new McCmColor(255, 0, 0)
          const mcLine1Id = mxcad.drawEntity(line1)
          const mcLine2Id = mxcad.drawEntity(line2)
          const mcLine3Id = mxcad.drawEntity(line3)
          const mcLine4Id = mxcad.drawEntity(line4)


          let mxcadTrimAssert = new MxCpp.mxcadassemblyimp.MxDrawTrimAssist()
          aryIdLong.copyFormAryId([mcLine1Id, mcLine2Id, mcLine3Id, mcLine4Id])

          if (!mxcadTrimAssert.Init(aryIdLong.imp)) return
          const midPoint1 = getMidPoint(p1.x, p1.y, p4.x, p4.y)
          const midPoint2 = getMidPoint(p2.x, p2.y, p3.x, p3.y)
          const midPoint3 = getMidPoint(p1.x, p1.y, p2.x, p2.y)
          const midPoint4 = getMidPoint(p3.x, p3.y, p4.x, p4.y)
          let ss = new MxCADSelectionSet();
          ss.isWhileSelect = false;
          ss.isSelectHighlight = false;
        })
      })


      mxcad.zoomAll()
      mxcad.updateDisplay()
    }
  }

  public regist_data() {
    return {
      filename: "drawRoadBody.json",
      name: "drawRoadBody",
      description: "根据坐标点合集绘制道路",
      params: [
        {
          name: "points", description: "绘制道路的坐标点", "type": "str", "required": true
        },
        ...baseParams,
      ]
    }
  }
}

export function init() {
  setTimeout(() => {
    new RoadBody().call({
      points: "0,0,999,888, 1000, 1000, 800, 900, 400, 200, 999, 10"
    })
  }, 2000)
}
