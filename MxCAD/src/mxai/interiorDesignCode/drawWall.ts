
///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McCmColor, McDbLine, McDbPolyline, McGePoint3d, McGeVector3d, MxCADUiPrPoint, MxCpp, MxCADUtility, McObjectId } from "mxcad";
import { baseParams, mergeBaseMcDbEntityProps, parseParamPoints } from "../base";
import { findIntersection, getClosestPoint, insidePolygon } from "../tools";

class WallLine {
  static lines = new Set<WallLine>()
  outsidePoints: [McGePoint3d, McGePoint3d]
  insidePoints: [McGePoint3d, McGePoint3d]
  outsideLine: McDbLine
  insideLine: McDbLine
  startPoint: McGePoint3d
  endPoint: McGePoint3d
  width = 50
  startClosedLine: McDbLine;
  endClosedLine: McDbLine;
  startClosedId: McObjectId;
  endClosedId: McObjectId;
  outsideId: McObjectId;
  insideId: McObjectId;
  constructor(start: McGePoint3d, end: McGePoint3d, width = 50) {
    this.update(start, end, width)
  }
  update(start: McGePoint3d, end: McGePoint3d, width = this.width) {
    let dirVector = start.clone().sub(end).normalize()
    dirVector = new McGeVector3d(-dirVector.y, dirVector.x, 0).mult(width / 2)
    const negateDirVector = dirVector.clone().negate()
    this.outsidePoints = [start.clone().addvec(dirVector), end.clone().addvec(dirVector)];
    this.insidePoints = [start.clone().addvec(negateDirVector), end.clone().addvec(negateDirVector)]
    this.width = width
    this.startPoint = start.clone()
    this.endPoint = end.clone()
    if (!this.outsideLine) {
      this.outsideLine = new McDbLine(this.outsidePoints[0], this.outsidePoints[1])
    }
    else {
      this.outsideLine.startPoint = this.outsidePoints[0]
      this.outsideLine.endPoint = this.outsidePoints[1]
    }
    if (!this.insideLine) {
      this.insideLine = new McDbLine(this.insidePoints[0], this.insidePoints[1])
    } else {
      this.insideLine.startPoint = this.insidePoints[0]
      this.insideLine.endPoint = this.insidePoints[1]
    }
    if (!this.startClosedLine) {
      this.startClosedLine = new McDbLine(this.outsidePoints[0], this.insidePoints[0])
    } else {
      this.startClosedLine.startPoint = this.outsidePoints[0]
      this.startClosedLine.endPoint = this.insidePoints[0]
    }
    if (!this.endClosedLine) {
      this.endClosedLine = new McDbLine(this.outsidePoints[1], this.insidePoints[1])
    } else {
      this.endClosedLine.startPoint = this.outsidePoints[1]
      this.endClosedLine.endPoint = this.insidePoints[1]
    }
  }

  clone() {
    const line = new WallLine(this.startPoint, this.endPoint, this.width)
    line.insideLine = this.insideLine.clone() as McDbLine
    line.outsideLine = this.outsideLine.clone() as McDbLine
    return line
  }
  hiddenStartClosedLine() {
    this.startClosedLine.visible = false
  }
  hiddenEndClosedLine() {
    this.endClosedLine.visible = false
  }

  /** 开始点闭合线与比较墙体内线的交点 (开始-内)*/
  getClosedStartLineToDiffWallInsideLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.startClosedLine.visible ? findIntersection(diffLine.insideLine.startPoint, diffLine.insideLine.endPoint, this.startClosedLine.startPoint, this.startClosedLine.endPoint, is) : null
  }
  /** 开始点闭合线与比较墙体外线的交点 (开始-外)*/
  getClosedStartLineToDiffWallOutsideLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.startClosedLine.visible ? findIntersection(diffLine.outsideLine.startPoint, diffLine.outsideLine.endPoint, this.startClosedLine.startPoint, this.startClosedLine.endPoint, is) : null
  }
  /** 结束点闭合线与比较墙体内线的交点 (结束-内)*/
  getClosedEndLineToDiffWallInsideLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.endClosedLine.visible ? findIntersection(diffLine.insideLine.startPoint, diffLine.insideLine.endPoint, this.endClosedLine.startPoint, this.endClosedLine.endPoint, is) : null
  }
  /** 开始点闭合线与比较墙体外线的交点 (结束-外)*/
  getClosedEndLineToDiffWallOutsideLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.endClosedLine.visible ? findIntersection(diffLine.outsideLine.startPoint, diffLine.outsideLine.endPoint, this.endClosedLine.startPoint, this.endClosedLine.endPoint, is) : null
  }

  /** 内线与比较墙体的内线交点 (内-内)*/
  getInsideToDiffInsideIntersectionPoint(diffLine: WallLine, is = false) {
    return findIntersection(diffLine.insideLine.startPoint, diffLine.insideLine.endPoint, this.insideLine.startPoint, this.insideLine.endPoint, is)
  }

  /** 外线与比较墙体的外线交点 (外-外)*/
  getOutsideToDiffOutsideIntersectionPoint(diffLine: WallLine, is = false) {
    return findIntersection(diffLine.outsideLine.startPoint, diffLine.outsideLine.endPoint, this.outsideLine.startPoint, this.outsideLine.endPoint, is)
  }

  /** 内线与比较墙体的外线交点 (内-外)*/
  getInsideToDiffOutsideIntersectionPoint(diffLine: WallLine, is = false) {
    return findIntersection(diffLine.outsideLine.startPoint, diffLine.outsideLine.endPoint, this.insideLine.startPoint, this.insideLine.endPoint, is)
  }

  /** 外线与比较墙体的内线交点 (外-内)*/
  getOutsideToDiffInsideIntersectionPoint(diffLine: WallLine, is = false) {
    return findIntersection(diffLine.insideLine.startPoint, diffLine.insideLine.endPoint, this.outsideLine.startPoint, this.outsideLine.endPoint, is)
  }
  /** 开始闭合线与比较墙体开始闭合线交点 (开始-开始)*/
  getClosedStartLineToDiffLineClosedStartLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.startClosedLine.visible ? findIntersection(diffLine.startClosedLine.startPoint, diffLine.startClosedLine.endPoint, this.startClosedLine.startPoint, this.startClosedLine.endPoint, is) : null
  }
  /** 开始闭合线与比较墙体结束闭合线交点 (开始-结束)*/
  getClosedStartLineToDiffLineClosedEndLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.startClosedLine.visible ? findIntersection(diffLine.endClosedLine.startPoint, diffLine.endClosedLine.endPoint, this.startClosedLine.startPoint, this.startClosedLine.endPoint, is) : null
  }
  /** 结束点闭合线与比较墙体开始闭合线交点 (结束-开始)*/
  getClosedEndLineToDiffLineClosedStartLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.endClosedLine.visible ? findIntersection(diffLine.startClosedLine.startPoint, diffLine.startClosedLine.endPoint, this.endClosedLine.startPoint, this.endClosedLine.endPoint, is) : null
  }
  /** 结束点闭合线与比较墙体结束点闭合线交点 (结束-结束)*/
  getClosedEndLineToDiffLineClosedEndLineIntersectionPoint(diffLine: WallLine, is = false) {
    return this.endClosedLine.visible ? findIntersection(diffLine.endClosedLine.startPoint, diffLine.endClosedLine.endPoint, this.endClosedLine.startPoint, this.endClosedLine.endPoint, is) : null
  }

  // 是否拐角
  isCorner(diffLine: WallLine) {
    const v = diffLine.startPoint.sub(diffLine.endPoint).normalize()
    const v1 = v.clone().mult(diffLine.width)
    const v2 = v.clone().mult(-diffLine.width)
    const pt1 = diffLine.insideLine.startPoint.clone().addvec(v1)
    const pt2 = diffLine.insideLine.startPoint.clone().addvec(v2)
    const pt3 = diffLine.outsideLine.startPoint.clone().addvec(v2)
    const pt4 = diffLine.outsideLine.startPoint.clone().addvec(v1)
    const pt5 = diffLine.insideLine.endPoint.clone().addvec(v1)
    const pt6 = diffLine.insideLine.endPoint.clone().addvec(v2)
    const pt7 = diffLine.outsideLine.endPoint.clone().addvec(v2)
    const pt8 = diffLine.outsideLine.endPoint.clone().addvec(v1)
    const start = insidePolygon([pt1, pt2, pt3, pt4], this.startPoint)
    const end = insidePolygon([pt1, pt2, pt3, pt4], this.endPoint)
    const start1 = insidePolygon([pt5, pt6, pt7, pt8], this.startPoint)
    const end1 = insidePolygon([pt5, pt6, pt7, pt8], this.endPoint)
    return [{
      start,
      end
    }, {
      start: start1,
      end: end1
    }]
  }
  // 处理拐角
  handlingCorners(diffLine: WallLine) {
    const [startCorner, endCorner] = this.isCorner(diffLine)
    if (endCorner.start) {
      this.outsideLine.startPoint = diffLine.outsideLine.endPoint = this.getOutsideToDiffOutsideIntersectionPoint(diffLine, true)
      this.insideLine.startPoint = diffLine.insideLine.endPoint = this.getInsideToDiffInsideIntersectionPoint(diffLine, true)
      this.hiddenStartClosedLine()
      diffLine.hiddenEndClosedLine()
      return
    }
    else if (endCorner.end) {
      this.outsideLine.endPoint = diffLine.insideLine.endPoint = this.getOutsideToDiffInsideIntersectionPoint(diffLine, true)
      this.insideLine.endPoint = diffLine.outsideLine.endPoint = this.getInsideToDiffOutsideIntersectionPoint(diffLine, true)
      this.hiddenEndClosedLine()
      diffLine.hiddenEndClosedLine()
      return
    }
    else if (startCorner.start) {
      this.insideLine.startPoint = diffLine.outsideLine.startPoint = this.getInsideToDiffOutsideIntersectionPoint(diffLine, true)
      this.outsideLine.startPoint = diffLine.insideLine.startPoint = this.getOutsideToDiffInsideIntersectionPoint(diffLine, true)
      this.hiddenStartClosedLine()
      diffLine.hiddenStartClosedLine()
      return
    }
    else if (startCorner.end) {
      this.outsideLine.endPoint = diffLine.outsideLine.startPoint = this.getOutsideToDiffOutsideIntersectionPoint(diffLine, true)
      this.insideLine.endPoint = diffLine.insideLine.startPoint = this.getInsideToDiffInsideIntersectionPoint(diffLine, true)
      this.hiddenEndClosedLine()
      diffLine.hiddenStartClosedLine()
      return
    }
  }
  // 交集处理
  processingIntersection() {
    const diffUpdate: {
      diffLine: WallLine,
      /** ii, io, oo, oi */
      intersectionPoints: (null | McGePoint3d)[]
    }[] = []
    WallLine.lines.forEach((diffLine) => {
      const point = this.getInsideToDiffInsideIntersectionPoint(diffLine)
      const point1 = this.getInsideToDiffOutsideIntersectionPoint(diffLine)
      const point2 = this.getOutsideToDiffOutsideIntersectionPoint(diffLine)
      const point3 = this.getOutsideToDiffInsideIntersectionPoint(diffLine)
      if (point || point1 || point2 || point3) {
        diffUpdate.push({
          diffLine,
          intersectionPoints: [point, point1, point2, point3]
        })
      }
    })
    diffUpdate.forEach(({ diffLine, intersectionPoints }) => {
      const [startCorner, endCorner] = this.isCorner(diffLine)
      const isCorner = startCorner.end || startCorner.start || endCorner.start || endCorner.start
      const [ii, io, oo, oi] = intersectionPoints
      const points = [diffLine.insideLine.startPoint, diffLine.insideLine.endPoint, diffLine.outsideLine.endPoint, diffLine.outsideLine.startPoint]
      const isStart = insidePolygon(points, this.startPoint)
      const isEnd = insidePolygon(points, this.endPoint)

      const xiufu = ()=> {
        if (endCorner.start) {
          console.log("endCorner.start")
          if (oo) {
            diffLine.outsideLine.endPoint = this.outsideLine.startPoint = oo
          }
          if (ii) {
            diffLine.insideLine.endPoint = this.insideLine.startPoint = ii
          }
          this.hiddenStartClosedLine()
          diffLine.hiddenEndClosedLine()

        }
        else if (endCorner.end) {
          console.log("endCorner.end")
          if (oi) {
            diffLine.insideLine.endPoint = this.outsideLine.endPoint = oi
          }
          if (io) {
            diffLine.outsideLine.endPoint = this.insideLine.endPoint = io
          }
          this.hiddenEndClosedLine()
          diffLine.hiddenEndClosedLine()
        }
        else if (startCorner.start) {
          console.log("startCorner.start")
          if (io) {
            diffLine.outsideLine.startPoint = this.insideLine.startPoint = io
          }
          if (oi) {
            diffLine.insideLine.startPoint = this.outsideLine.startPoint = oi
          }

          diffLine.hiddenStartClosedLine()
          this.hiddenStartClosedLine()
        }
        else if (startCorner.end) {
          console.log("startCorner.end")
          if (oo) {
            diffLine.outsideLine.startPoint = this.outsideLine.endPoint = oo
          }
          if (ii) {
            diffLine.insideLine.startPoint = this.insideLine.endPoint = ii
          }
          diffLine.hiddenStartClosedLine()
          this.hiddenEndClosedLine()
        }
      }
      if (ii && io && oo && oi) {
        const point = findIntersection(this.startPoint, this.endPoint, diffLine.startPoint, diffLine.endPoint)
        const wall1 = new WallLine(this.startPoint, point, this.width)
        const wall2 = new WallLine(point, this.endPoint, this.width)
        const diffWall1 = new WallLine(diffLine.startPoint, point, diffLine.width)
        const diffWall2 = new WallLine(point, diffLine.endPoint, diffLine.width)
        wall1.insideLine.startPoint = this.insideLine.startPoint
        wall1.outsideLine.startPoint = this.outsideLine.startPoint
        wall2.insideLine.endPoint = this.insideLine.endPoint
        wall2.outsideLine.endPoint = this.outsideLine.endPoint

        diffLine.remove()
        this.remove()
        wall1.draw()
        wall2.draw()
        diffWall1.draw()
        diffWall2.draw()
      } else if ((oo && io) || (ii && oi)) {
        const point = findIntersection(this.startPoint, this.endPoint, diffLine.startPoint, diffLine.endPoint, true)
        const wall1 = new WallLine(diffLine.startPoint, point, diffLine.width)
        wall1.hiddenEndClosedLine()
        const wall2 = new WallLine(point, diffLine.endPoint, diffLine.width)
        wall2.hiddenStartClosedLine()
        diffLine.remove()
        wall1.draw()
        wall2.draw()
      } else {
        if(diffUpdate.length === 1) return this.handlingCorners(diffLine)
        if (endCorner.start) {
          console.log("endCorner.start")
          if (oo) {
            diffLine.outsideLine.endPoint = this.outsideLine.startPoint = oo
          }
          if (ii) {
            diffLine.insideLine.endPoint = this.insideLine.startPoint = ii
          }
          this.hiddenStartClosedLine()
          diffLine.hiddenEndClosedLine()

        }
        else if (endCorner.end) {
          console.log("endCorner.end")
          if (oi) {
            diffLine.insideLine.endPoint = this.outsideLine.endPoint = oi
          }
          if (io) {
            diffLine.outsideLine.endPoint = this.insideLine.endPoint = io
          }
          this.hiddenEndClosedLine()
          diffLine.hiddenEndClosedLine()
        }
        else if (startCorner.start) {
          console.log("startCorner.start")
          if (io) {
            diffLine.outsideLine.startPoint = this.insideLine.startPoint = io
          }
          if (oi) {
            diffLine.insideLine.startPoint = this.outsideLine.startPoint = oi
          }

          diffLine.hiddenStartClosedLine()
          this.hiddenStartClosedLine()
        }
        else if (startCorner.end) {
          console.log("startCorner.end")
          if (oo) {
            diffLine.outsideLine.startPoint = this.outsideLine.endPoint = oo
          }
          if (ii) {
            diffLine.insideLine.startPoint = this.insideLine.endPoint = ii
          }
          diffLine.hiddenStartClosedLine()
          this.hiddenEndClosedLine()
        }
      }

    })
  }
  private isDraw = false;
  draw(isIntersection = true) {
    if (this.isDraw) return
    const mxcad = MxCpp.getCurrentMxCAD();
    if (this.outsideLine) {
      this.outsideLine.erase()
    }
    if (this.insideLine) {
      this.insideLine.erase()
    }
    if (!mxcad) return
    this.outsideLine.trueColor = new McCmColor(255, 0, 0)
    this.outsideId = mxcad.drawEntity(this.outsideLine)
    this.insideLine.trueColor = new McCmColor(0, 255, 255)
    this.insideId = mxcad.drawEntity(this.insideLine)
    const outsideLine = this.outsideId.getMcDbEntity() as McDbLine
    if (outsideLine) this.outsideLine = outsideLine
    const insideLine = this.insideId.getMcDbEntity() as McDbLine
    if (insideLine) this.insideLine = insideLine
    this.startClosedId = mxcad.drawEntity(this.startClosedLine)
    this.endClosedId = mxcad.drawEntity(this.endClosedLine)
    const startClosedLine = this.startClosedId.getMcDbEntity() as McDbLine
    if (startClosedLine) this.startClosedLine = startClosedLine
    const endClosedLine = this.endClosedId.getMcDbEntity() as McDbLine
    if (endClosedLine) this.endClosedLine = endClosedLine
    mxcad.updateDisplay()
    WallLine.lines.add(this)
    this.isDraw = true
    if (isIntersection) this.processingIntersection()
  }

  remove() {
    this.endClosedId && this.endClosedId.erase()
    this.startClosedId && this.startClosedId.erase()
    this.insideId && this.insideId.erase()
    this.outsideId && this.outsideId.erase()
    WallLine.lines.delete(this)
  }
}

//绘制墙壁，1000，1000，3000, 1000, 3000, -1000, 1000, -1000, 1000, 1000 墙宽100
export class Wall {
  public call(param: any) {
    if (param && param.points) {
      let mxcad = MxCpp.getCurrentMxCAD();
      const points = parseParamPoints(param.points)
      if (points.length < 2) return
      points.forEach((point, index) => {
        const nextLine = points[index + 1]
        if (!nextLine) return
        const wall = new WallLine(point, nextLine, param.width)
        wall.draw()
      })
      mxcad.updateDisplay()
    }
  }

  public regist_data() {
    return {
      filename: "drawWall.json",
      name: "drawWall",
      description: "根据坐标点合集绘制墙",
      params: [
        {
          name: "points", description: "绘制墙的坐标点", "type": "str", "required": true
        },
        {
          name: "width", description: "绘制墙的宽度", "type": "float", "required": false
        },
        ...baseParams,
      ]
    }
  }
}

/*
setTimeout(async () => {
  MxCpp.getCurrentMxCAD().newFile()
  const getPoint = new MxCADUiPrPoint()
  let oldPoint
  const lines: WallLine[] = []
  const mxcad = MxCpp.getCurrentMxCAD()
  const line = new WallLine(new McGePoint3d(), new McGePoint3d(), 5000)
  let oldLine: WallLine
  let linePoints: McGePoint3d[] = []
  let i = 0
  while (true) {
    const point = await getPoint.go()
    getPoint.setUserDraw((currentPoint, pW) => {
      if (linePoints.length === 0) {
        return
      }
      line.update(point, currentPoint, 5000)
      pW.setColor("#ff0000")
      pW.drawLine(line.outsidePoints[0].toVector3(), line.outsidePoints[1].toVector3())
      pW.setColor("#00ffff")
      pW.drawLine(line.insidePoints[0].toVector3(), line.insidePoints[1].toVector3())
      pW.setColor("#fff")
      pW.drawLine(line.startPoint.toVector3(), line.endPoint.toVector3())
    })
    linePoints.push(point)
    if (linePoints.length === 2) {
      const [pt1, pt2] = linePoints
      const line = new WallLine(pt1, pt2, 5000)
      // line.processingIntersection()
      line.draw()
      linePoints = []
      getPoint.clearLastInputPoint()
    }

    // if (oldPoint) {
    //   const line = new WallLine(oldPoint, point, 5000)
    //   line.draw()
    //   oldLine = line
    // }
    // oldPoint = point.clone()
    mxcad.updateDisplay()
  }

  // new Wall().call({
  //   points: "100,200,300,800,600,600, -100, 100, 300, 200, 1000, -200",
  //   width: 100
  // })
  // new Wall().call({
  //   points: "33, 66, 88, 777, 965",
  //   width: 100
  // })
}, 1000)

*/
