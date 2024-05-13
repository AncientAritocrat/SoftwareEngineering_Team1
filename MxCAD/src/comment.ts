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
    MxDbLeadComment, MxDbRectBoxLeadComment, MxDbArrow, MxDbCloudLine,
    MxFun, MrxDbgUiPrBaseReturn, MxDbArea
} from "mxdraw";
import { MxCpp } from "mxcad";

async function BR_Comment() {
    const getPoint = new MrxDbgUiPrPoint();
    getPoint.setMessage("\n指定第一点:");
    getPoint.go((status) => {
        if (status != 0) {
            return;
        }

        const pt1 = getPoint.value();

        let leadComment = new MxDbLeadComment();
        leadComment.point1 = pt1.clone();
        leadComment.textHeight = MxFun.screenCoordLong2Doc(50);
        leadComment.text = "测试Test1";
        leadComment.textWidth = MxFun.screenCoordLong2Doc(300);

        leadComment.fixedSize = true;
        if (leadComment.fixedSize) {
            leadComment.textHeight = 50;
            leadComment.textWidth = 250;
        }
        leadComment.color = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();

        const worldDrawComment = new McEdGetPointWorldDrawObject();
        worldDrawComment.setDraw(
            (currentPoint: THREE.Vector3, pWorldDraw) => {

                leadComment.point2 = currentPoint;
                pWorldDraw.drawCustomEntity(leadComment);

            }
        );

        getPoint.setBasePt(pt1);
        getPoint.setUseBasePt(true);

        getPoint.setUserDraw(worldDrawComment);
        getPoint.setMessage("\n指定第二点:");

        getPoint.go((status) => {
            if (status != 0) {
                console.log(status);
                return;
            }
            const currentPoint = getPoint.value();
            leadComment.point2 = currentPoint;
            MxFun.addToCurrentSpace(leadComment);

        });
    });
}


function BR_Print() {
    MxFun.getCurrentDraw().createCanvasImageData(
        (imageData: String) => {
            const newWindow: any = window.open();
            if (newWindow != null) {
                newWindow.document.write('<img src="' + imageData + '"/>');
                setTimeout(() => {
                    newWindow.print();
                }, 300);
            }
        },
        {
            width: 349,
            height: 536,
        }
    );
}





async function BR_CheckDraw() {
    let color = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
    const point = new MrxDbgUiPrPoint()
    const mxDraw = MxFun.getCurrentDraw()
    const worldDrawComment = new McEdGetPointWorldDrawObject()
    const mxCheckDraw = new MxDbRectBoxLeadComment()
    mxCheckDraw.color = color.getHex();
    if( mxCheckDraw.color == 0) mxCheckDraw.color = 0x010101;
    mxCheckDraw.radius = MxFun.screenCoordLong2Doc(8);
    mxCheckDraw.setLineWidth(3);
    mxCheckDraw.setLineWidthByPixels(true);
    point.setMessage("\n云线框起始点:");
    point.go((status) => {
        if (status != MrxDbgUiPrBaseReturn.kOk) {
            return
        }
        mxCheckDraw.point1 = point.value()
        worldDrawComment.setDraw((currentPoint) => {
            mxCheckDraw.point2 = currentPoint
            worldDrawComment.drawCustomEntity(mxCheckDraw)

        })

        point.setUserDraw(worldDrawComment)
        point.setMessage("\n云线框结束点:");
        point.go((status) => {
            if (status != MrxDbgUiPrBaseReturn.kOk) {
                return
            }
            mxCheckDraw.point2 = point.value()

            worldDrawComment.setDraw((currentPoint) => {
                mxCheckDraw.point3 = currentPoint
                worldDrawComment.drawCustomEntity(mxCheckDraw)
            })
            mxCheckDraw.text = "审图批注XXXXXXXXXX"

            //mxCheckDraw.text = "审图批注XXTest12345678901234567890123456789111111";
            mxCheckDraw.textWidth = MxFun.screenCoordLong2Doc(200);
            mxCheckDraw.textHeight = MxFun.screenCoordLong2Doc(50);

            mxCheckDraw.fixedSize = true;
            if (mxCheckDraw.fixedSize) {
                mxCheckDraw.textHeight = 20;
                mxCheckDraw.textWidth = 230;
            }


            point.setMessage("\n审图标注点:");
            point.go((status) => {
                if (status != MrxDbgUiPrBaseReturn.kOk) {
                    return
                }
                mxCheckDraw.point3 = point.value()
                mxDraw.addMxEntity(mxCheckDraw)
            })
        })
    })
}

function getScreenPixel(pixel: number, isFontSize?: boolean): number {
    let _pixel = MxFun.screenCoordLong2World(isFontSize ? pixel : pixel - pixel / 3)
    _pixel = MxFun.worldCoordLong2Doc(_pixel)
    return _pixel
}
export function BR_Arrow() {
    const worldDraw = new McEdGetPointWorldDrawObject()
    const lines = new MxDbArrow()
    const mxDraw = MxFun.getCurrentDraw();
    const point = new MrxDbgUiPrPoint();
    point.setUserDraw(worldDraw)
    lines.setLineWidth(10)
    lines.innerOffset = getScreenPixel(10)
    lines.outerOffset = getScreenPixel(22)
    lines.topOffset = getScreenPixel(36)
    lines.color = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
    point.go(() => {

        lines.startPoint = point.value()
        worldDraw.setDraw((v) => {
            lines.endPoint = v
            worldDraw.drawCustomEntity(lines)
        })
        point.go(async (status) => {
            lines.endPoint = point.value()

            mxDraw.addMxEntity(lines)

        })
    })
}

export default function BR_CloudLine() {
    const point = new MrxDbgUiPrPoint()
    const mxDraw = MxFun.getCurrentDraw()
    const worldDrawComment = new McEdGetPointWorldDrawObject()

    // 屏幕坐标半径
    const radius = MxFun.screenCoordLong2Doc(16);

    point.setMessage("\n点击开启绘制云线:");

    point.go(() => {
        let pt = point.value()
        // 云线实例
        const mxCloudLine = new MxDbCloudLine()
        mxCloudLine.setRadius(radius);
        mxCloudLine.addPoint(pt);
        mxCloudLine.color = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
        worldDrawComment.setDraw((
            currentPoint,
        ) => {
            if (pt.distanceTo(currentPoint) > radius) {
                pt = currentPoint.clone();
                mxCloudLine.addPoint(currentPoint, true);
            }

            worldDrawComment.drawCustomEntity(mxCloudLine)
        })
        point.setUserDraw(worldDrawComment)
        point.setMessage("\n再次点击结束绘制云线:");
        point.go(() => {
            mxDraw.addMxEntity(mxCloudLine)
        })
    })

}


let sSaveData = "";
export function BR_SaveAllMxEntity() {
    let mxobj = MxFun.getCurrentDraw();
    sSaveData = mxobj.saveMxEntityToJson();
    console.log(sSaveData);

}


export async function BR_LoadAllMxEntity() {
    if (sSaveData.length == 0) return;
    let mxobj = MxFun.getCurrentDraw();
    await mxobj.loadMxEntityFromJson(sSaveData, ["models/svg/mark.svg"]);
    mxobj.updateDisplay();
}

export function BR_Area() {
    const getPoint = new MrxDbgUiPrPoint()
    getPoint.setMessage('\n指定第一点:')
    getPoint.go(status => {
      if (status != 0) {
        return
      }
      const pt1 = getPoint.value()
      let area = new MxDbArea()
      area.addPoint(pt1)
      area.color = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
      const worldDrawComment = new McEdGetPointWorldDrawObject()
      worldDrawComment.setDraw((currentPoint: THREE.Vector3, pWorldDraw) => {
        let tmp: MxDbArea = area.clone() as MxDbArea
        tmp.addPoint(currentPoint)
        worldDrawComment.drawCustomEntity(tmp)
      })
      getPoint.setUserDraw(worldDrawComment)
      getPoint.setMessage('\n指定下一点:')
      getPoint.goWhile(
        status => {
          if (status == 0) {
            const pt2 = getPoint.value()
            area.addPoint(pt2)
          }
        },
        status => {
          area.isFill = true
          area.fillOpacity = 0.7
          area.fillColor = 0x663244
          MxFun.getCurrentDraw().addMxEntity(area)
        }
      )
    })
}

export function init() {
    MxFun.addCommand("BR_Comment", BR_Comment);
    MxFun.addCommand("BR_CheckDraw", BR_CheckDraw);
    MxFun.addCommand("BR_Arrow", BR_Arrow);
    MxFun.addCommand("BR_CloudLine", BR_CloudLine);
    MxFun.addCommand("BR_Print", BR_Print);
    MxFun.addCommand("BR_SaveAllMxEntity", BR_SaveAllMxEntity);
    MxFun.addCommand("BR_LoadAllMxEntity", BR_LoadAllMxEntity);
    MxFun.addCommand("BR_Area", BR_Area);

}
