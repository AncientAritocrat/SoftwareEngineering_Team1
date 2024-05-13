///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McDbPolyline, McGePoint3d, McGeVector3d, MxCADUiPrDist, MxCADUiPrInt, MxCADUiPrKeyWord, MxCADUiPrPoint, MxCpp, _ML_String, drawPolygon } from "mxcad";
import { baseParams, mergeBaseMcDbEntityProps, parsePoint } from "./base";
import { MxAiModule } from "./MxAiModule";

/**
 * 计算多边形顶点坐标（基于中点）
 * @param {McGePoint3d} centerPoint - 多边形中心点
 * @param {McGePoint3d} edgeMidPoint - 多边形一条边的中点
 * @param {number} sides - 多边形边数（至少为3）
 * @returns {McGePoint3d[]} 多边形的顶点坐标数组
 */
function computePolygonVerticesFromMidpoint(centerPoint = new McGePoint3d(), edgeMidPoint = new McGePoint3d(), sides = 3): McGePoint3d[] {
  const midX = edgeMidPoint.x;
  const midY = edgeMidPoint.y;
  const centerX = centerPoint.x;
  const centerY = centerPoint.y;
  const numberOfSides = Math.max(3, sides);

  // 计算中点到多边形中心的距离
  const distanceToCenter = Math.sqrt((midX - centerX) ** 2 + (midY - centerY) ** 2);

  // 计算中点到多边形中心的半径
  const radius = distanceToCenter / Math.cos(Math.PI / numberOfSides);

  // 计算起始角度
  const startAngle = Math.atan2(midY - centerY, midX - centerX) - Math.PI / numberOfSides;

  const vertices = [];

  for (let i = 0; i < numberOfSides; i++) {
      // 计算当前顶点的角度
      const angle = startAngle + (i * 2 * Math.PI / numberOfSides);

      // 根据极坐标系转换成直角坐标系的坐标
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // 创建新的顶点对象并加入数组
      vertices.push(new McGePoint3d(x, y));
  }

  return vertices;
}

/**
 * 生成规则多边形的顶点坐标
 * @param {McGePoint3d} centerPoint - 多边形中心点
 * @param {McGePoint3d} vertexPoint - 多边形顶点
 * @param {number} sides - 多边形边数（至少为3）
 * @returns {McGePoint3d[]} 多边形的顶点坐标数组
 */
function computeRegularPolygonVertices(centerPoint = new McGePoint3d(), vertexPoint = new McGePoint3d(), sides = 3): McGePoint3d[] {
  const verticesArray: McGePoint3d[] = [];
  sides = Math.max(3, sides);
  verticesArray.push(vertexPoint);

  // 计算每个顶点的角度增量
  const angleIncrement = (Math.PI * 2) / sides;

  for (let i = 1; i < sides; i++) {
      // 计算当前顶点对应的角度上的余弦和正弦值
      const cosValue = Math.cos(angleIncrement * i),
          sinValue = Math.sin(angleIncrement * i);

      // 复制中心点和顶点，以免修改原始点的值
      const startPt = centerPoint.clone();
      const endPt = vertexPoint.clone();

      // 计算相对于中心点的偏移量
      const deltaX = endPt.x - startPt.x;
      const deltaY = endPt.y - startPt.y;

      // 根据旋转公式计算新的顶点坐标
      const newX = deltaX * cosValue - deltaY * sinValue + startPt.x;
      const newY = deltaX * sinValue + deltaY * cosValue + startPt.y;

      // 创建新的顶点对象并加入数组
      const point = new McGePoint3d(newX, newY);
      verticesArray.push(point);
  }

  return verticesArray;
}

/**
 * 计算多边形顶点坐标（基于边）
 * @param {McGePoint3d} startPoint - 多边形边的起始点
 * @param {McGePoint3d} endPoint - 多边形边的结束点
 * @param {number} sides - 多边形边数（至少为3）
 * @returns {McGePoint3d[]} 多边形的顶点坐标数组
 */
function computePolygonVerticesFromEdge(startPoint: McGePoint3d, endPoint: McGePoint3d, sides: number): McGePoint3d[] {
  // 计算边的长度和角度
  let dx = endPoint.x - startPoint.x;
  let dy = endPoint.y - startPoint.y;
  let length = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx);

  // 计算每个顶点的角度增量
  let angleIncrement = (2 * Math.PI) / Math.max(3, sides);

  let polygonVertices = [startPoint, endPoint];

  for (let i = 0; i < sides; i++) {
    // 计算当前顶点的坐标
    let x = startPoint.x + length * Math.cos(angle + i * angleIncrement);
    let y = startPoint.y + length * Math.sin(angle + i * angleIncrement);

    // 更新起始点并加入数组
    startPoint = new McGePoint3d(x, y);
    polygonVertices.push(startPoint);
  }

  return polygonVertices;
}
//绘制一个正六边形边的开始点0, 0 结束点100，100
//用圆心绘制一个外切于圆的正五边形 圆心0，0 半径100
class MxAiDrawPolygon {
  async call(param: any) {
    MxCpp.getCurrentMxCAD().newFile()
    console.log(param)
    let { isDrawToCenter, sideNum, startPoint, endPoint, radius, centerPoint, isTangentToTheCircle } = param
    if (!sideNum) {
      const getInt = new MxCADUiPrInt()
      getInt.setMessage("输入边的数目<5>")
      getInt.setKeyWords("")
      getInt.clearLastInputPoint()
      sideNum = await getInt.go() || 5 as number
    }
    if(isDrawToCenter) {
      if (!centerPoint) {
        const getPoint = new MxCADUiPrPoint()
        getPoint.setMessage("\n指定正多变形的中心点")
        getPoint.setKeyWords("")
        getPoint.clearLastInputPoint()
        centerPoint = await getPoint.go()
        if (!centerPoint) return
      } else {
        centerPoint = parsePoint(centerPoint)
      }
      let vet = McGeVector3d.kXAxis
      let vertexPoint: McGePoint3d
      if (!radius) {
        const getPoint = new MxCADUiPrDist()
        getPoint.setMessage(_ML_String("MxAiDrawPolygon_radius", "指定圆的半径"))
        getPoint.setKeyWords("")
        getPoint.setBasePt(centerPoint)
        getPoint.setUserDraw((pt, pw) => {
          if(isTangentToTheCircle) {
            const _radius = pt.distanceTo(centerPoint)
            vet = pt.sub(centerPoint)
            const midPoint = centerPoint.clone().addvec(pt.sub(centerPoint).normalize().mult(_radius))
            const points = computePolygonVerticesFromMidpoint(centerPoint, midPoint, sideNum)
            const polygon = new McDbPolyline()
            points.forEach((point)=> {
              polygon.addVertexAt(point)
            })
            polygon.isClosed = true
            pw.drawMcDbEntity(polygon)
          }else {
            vertexPoint = pt
            const polygon = new McDbPolyline()
            computeRegularPolygonVertices(centerPoint, pt, sideNum).forEach((point)=> {
              polygon.addVertexAt(point)
            })
            polygon.isClosed = true
            pw.drawMcDbEntity(polygon)
          }

        })
        const _radius = await getPoint.go()
        if (!_radius) return
        radius = _radius
      }
      // 外切于圆
      const polygon = new McDbPolyline()
      polygon.isClosed = true
      if (isTangentToTheCircle) {
        const midPoint = centerPoint.clone().addvec(vet.normalize().mult(radius))
        const points = computePolygonVerticesFromMidpoint(centerPoint, midPoint, sideNum)
        points.forEach((point)=> {
          polygon.addVertexAt(point)
        })
      } else {
        if(!vertexPoint) {
          const vet = McGeVector3d.kXAxis.clone().rotateBy(Math.PI / sideNum).mult(radius)
          vertexPoint = centerPoint.clone().addvec(vet)
        }
        computeRegularPolygonVertices(centerPoint, vertexPoint, sideNum).forEach((point)=> {
          polygon.addVertexAt(point)
        })
      }

      MxCpp.getCurrentMxCAD().drawEntity(polygon)
    }else {
      const createStarEndPointPolygon = (currentPoint: McGePoint3d) => {
        const pPolyline = new McDbPolyline()
        const points = computePolygonVerticesFromEdge(startPoint as McGePoint3d, currentPoint, sideNum || 5)
        points.forEach((point) => {
          pPolyline.addVertexAt(point)
        })
        pPolyline.isClosed = true
        return pPolyline
      }
      if (!startPoint) {
        const getPoint = new MxCADUiPrPoint()
        getPoint.clearLastInputPoint()
        getPoint.setMessage("\n指定边的第一个端点");
        getPoint.setKeyWords("")
        startPoint = await getPoint.go()
        if (!startPoint) return
        getPoint.setUserDraw((currentPoint, pWorldDraw) => {
          pWorldDraw.drawMcDbEntity(createStarEndPointPolygon(currentPoint))
        })
      }else {
        startPoint = parsePoint(startPoint)
      }
      if (!endPoint) {
        const getPoint = new MxCADUiPrPoint()
        getPoint.setBasePt(startPoint)
        getPoint.setMessage("\n指定边的第二个端点")
        endPoint = await getPoint.go()
      }else {
        endPoint = parsePoint(endPoint)
      }
      if (!endPoint) return
      const polygon = createStarEndPointPolygon(endPoint)
      MxCpp.getCurrentMxCAD().drawEntity(polygon)
    }

  }

  public regist_data() {
    return {
      filename: "DrawPolygon.json",
      name: "draw_polygon",
      description: "绘制正多边形",
      params: [
        {
          name: "isDrawToCenter", description: "是否用圆绘制多边形", "type": "boolean", "required": true
        },
        {
          name: "sideNum", description: "边数", type: "int", "required": true
        },
        {
          name: "startPoint", description: "边绘制提供开始点", "type": "tuple[float, float]", "required": true
        },
        {
          name: "endPoint", description: "边绘制提供结束点", "type": "tuple[float, float]", "required": true
        },
        {
          name: "radius", description: "圆的半径", type: "number", "required": true
        },
        {
          name: "centerPoint", description: "圆心", "type": "tuple[float, float]", "required": true
        },
        {
          name: "isTangentToTheCircle", description: "外切于圆", "type": "boolean", "required": true
        }
      ]
    }

  }
}


// setTimeout(()=> {
//   new MxAiDrawPolygon().call({
//     sideNum: 6,
//     centerPoint: [0, 0],
//     // radius: 100,
//     isTangentToTheCircle: false
//   })
// }, 2000)
export const init = () => {
  MxAiModule.regist(MxAiDrawPolygon);

}
