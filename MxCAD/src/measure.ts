///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import * as THREE from "three";
import {
  McEdGetPointWorldDrawObject,
  MrxDbgUiPrPoint,
  MxDb2LineAngularDimension,
  MxDbAlignedDimension,
  MxDbCoord,
  MxFun,
  MxType
} from "mxdraw";
import { MxCpp } from "mxcad";

export class MyAlignedDimension extends MxDbAlignedDimension {
  constructor() {
    super()
  }
  public getDimText(): string {
    var v2ndPtTo1stPt = new THREE.Vector3(this.point1.x - this.point2.x, this.point1.y - this.point2.y, 0);
    var fLen = v2ndPtTo1stPt.length()
    return fLen.toFixed(2)
  }

  public create() {
    return new MyAlignedDimension();
  }

  public getTypeName(): string {
    return this.constructor.name
  }
}

async function Mx_Linear() {
  // 让用户在图上点取第一点.
  let myThis = this;
  const getPoint = new MrxDbgUiPrPoint();
  getPoint.setMessage("\n指定第一点:");
  getPoint.go((status) => {
    if (status != 0) {
      return;
    }
    const pt1 = getPoint.value();

    // 定义一个尺寸对象.
    //let dim = new MxDbAlignedDimension();
    let dim = new MyAlignedDimension();

    dim.setPoint1(pt1);
    dim.setColor(0xff22);

    // 在点取第二点时，设置动态绘制.
    const worldDrawComment = new McEdGetPointWorldDrawObject();
    worldDrawComment.setDraw((currentPoint: THREE.Vector3) => {
      // 动态绘制调用。
      dim.setPoint2(currentPoint);
      worldDrawComment.drawCustomEntity(dim);
    });

    getPoint.setBasePt(pt1);

    getPoint.setUseBasePt(true);
    getPoint.setUserDraw(worldDrawComment);
    getPoint.setMessage("\n指定第二点:");

    getPoint.setInputToucheType(MxType.InputToucheType.kGetEnd);
    getPoint.go((status) => {
      if (status != 0) {
        console.log(status);
        return;
      }

      // 成功取到第二点.
      const pt2 = getPoint.value();

      // 得到尺寸线的第二个点.
      dim.setPoint2(pt2);

      // 绘制自定义实体到图上.
      MxFun.getCurrentDraw().addMxEntity(dim);

      //计算长度.
      alert("测试长度是：" + dim.getDimText());

    });
  });
}

// 测量角度
function BR_AngleMeasure() {
  // 动态点对象 存储顶点数组
  const point = new MrxDbgUiPrPoint()
  // 绘制控件
  const mxDraw = MxFun.getCurrentDraw()

  const angleDim = new MxDb2LineAngularDimension()

  angleDim.color = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
  // 开启连续点击
  const worldDraw = new McEdGetPointWorldDrawObject()
  worldDraw.setColor(MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor());
  point.setMessage("\n指定第一点:");
  point.go((status) => {
    if (status !== 0) {
      return
    }
    point.setMessage("\n指定第二个角度点:");
    angleDim.point1 = point.value()
    worldDraw.setDraw((currentPoint, pWorldDraw) => {
      angleDim.point2 = currentPoint
      pWorldDraw.drawLine(angleDim.point1, currentPoint)
    })
    point.setUserDraw(worldDraw)
    point.go((status) => {
      point.setMessage("\n指定最后一个点:");
      if (status !== 0) {
        return
      }
      angleDim.point2 = point.value()
      worldDraw.setDraw((currentPoint, pWorldDraw) => {
        angleDim.point3 = currentPoint
        worldDraw.drawCustomEntity(angleDim);
      })
      point.go((status) => {
        if (status !== 0) {
          return
        }
        mxDraw.addMxEntity(angleDim)
      })
    })
  })
}

function BR_CoordMeasure() {
  // 让用户在图上点取第一点.
  let myThis = this;
  const getPoint = new MrxDbgUiPrPoint();
  getPoint.setMessage("\n指定坐标点:");
  getPoint.go((status) => {
    if (status != 0) {
      return;
    }

    const pt1 = getPoint.value();

    let mxCoord = new MxDbCoord();
    mxCoord.point1 = pt1;
    mxCoord.point2 = pt1.clone();
    mxCoord.color = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
    
    getPoint.setBasePt(pt1);
    getPoint.setUseBasePt(true);

    getPoint.setUserDraw((curPoint, pWorldDraw) => {
      mxCoord.point2 = curPoint;
      pWorldDraw.drawCustomEntity(mxCoord);
    });

    getPoint.setMessage("\n指定标注点:");

    getPoint.go((status) => {
      if (status != 0) {
        console.log(status);
        return;
      }
      mxCoord.point2 = getPoint.value();
      MxFun.addToCurrentSpace(mxCoord);
    });
  });
}


export function init() {
  new MyAlignedDimension().rxInit();
  MxFun.addCommand("Mx_Linear", Mx_Linear);
  MxFun.addCommand("BR_AngleMeasure", BR_AngleMeasure);
  MxFun.addCommand("BR_CoordMeasure", BR_CoordMeasure);

}
