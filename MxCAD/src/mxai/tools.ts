///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McGePoint3d } from "mxcad";

/**
 * 获取两线之间的交点
 * @param isExtending 为true 得到两条线段无限延伸下的交点
 * */
export function findIntersection(p1: McGePoint3d, p2: McGePoint3d, p3: McGePoint3d, p4: McGePoint3d, isExtending?: boolean) {
  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;
  const x4 = p4.x, y4 = p4.y;

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (denominator === 0) {
    return null; // 线段平行或共线
  }

  const t =
    ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;

  const u =
    -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
  const intersectionX = x1 + t * (x2 - x1);
  const intersectionY = y1 + t * (y2 - y1);
  const point = new McGePoint3d(intersectionX, intersectionY, 0);
  if (isExtending) return point
  if (t > 0 && t < 1 && u > 0 && u < 1) {
    return point
  } else {
    return null;
  }
}


/** 取最近点 */
export function getClosestPoint(comparisonPoint: McGePoint3d, p1: McGePoint3d, p2: McGePoint3d) {
  return comparisonPoint.distanceTo(p1) < comparisonPoint.distanceTo(p2) ? p1 : p2
}


// 查看点是否在多边形内
export function insidePolygon(points: McGePoint3d[], point: McGePoint3d){
  const x = point.x,  y = point.y;
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;

      const intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}

/** 计算两个坐标的角度 */
export function angleTo(x1: number, y1: number, x2: number, y2: number) {
  const x = x1 - x2;
  const y = y1 - y2;
  let angle_temp = 0;
  if (x == 0) {
    angle_temp = Math.PI / 2;
  } else {
    angle_temp = Math.atan(Math.abs(y / x));
  }

  if (x < 0 && y >= 0) {
    angle_temp = Math.PI - angle_temp;
  } else if (x < 0 && y < 0) {
    angle_temp = Math.PI + angle_temp;
  } else if (x >= 0 && y < 0) {
    angle_temp = Math.PI * 2.0 - angle_temp;
  }

  return angle_temp;
}