///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import {  DynamicInputType, MxFun } from "mxdraw";
import { McDbPolyline, McGePoint3d, MxCADUiPrPoint, MxCpp, MxTools } from "mxcad";
import { getMxCADUi } from ".";

export async function Mx_Export_DWG() {
  let {
    baseUrl = "",
    saveDwgUrl = "",
    mxfilepath = ""
  } = getMxCADUi().getUploadFileConfig();
  // 把mxweb文件 ，保存到服务器上，然后转换成 dwg文件 ，再下载。
  MxCpp.getCurrentMxCAD().saveFileToUrl(saveDwgUrl, (iResult: number, sserverResult: string) => {
    try {
      let ret = JSON.parse(sserverResult);
      if (ret.ret == "ok") {
        let filePath = baseUrl + mxfilepath + ret.file;
        fetch(filePath).then(async (res)=> {
          const blob = await res.blob()
          MxTools.saveAsFileDialog({
            blob,
            filename: ret.file,
            types: [{
              description: "dwg图纸",
              accept: {
                  "application/octet-stream": [".dwg"],
              },
            }]
          })
        })
      }
      else {
        console.log(sserverResult);
      }
    } catch {
      console.log("Mx: sserverResult error");
    }
  });
}

export async function Mx_Export_MxWeb() {
  let {
    baseUrl = "",
    mxfilepath = "",
    saveUrl = ""
  } = getMxCADUi().getUploadFileConfig();

  // 把mxweb文件 ，保存到服务器上，再下载。
  MxCpp.getCurrentMxCAD().saveFileToUrl(saveUrl, (iResult: number, sserverResult: string) => {
    try {
      let ret = JSON.parse(sserverResult);
      if (ret.ret == "ok") {
        let filePath = baseUrl + mxfilepath + ret.file;
        MxTools.downloadFileFromUrl(filePath, ret.file);
      }
      else {
        console.log(sserverResult);
      }
    } catch {
      console.log("Mx: sserverResult error");
    }
  });
}


// 直接打开个网上的mxweb文件。
export async function Mx_Open_MxWeb() {
  MxCpp.getCurrentMxCAD().openWebFile("http://localhost:1337/mxcad/file/8c79da20e232495888dbb0da17459399.mxweb");
}


export async function MxTest_NewFile() {
  let mxcad = MxCpp.getCurrentMxCAD();
  mxcad.newFile();
}



// 指定范围输出pdf
export async function Mx_Export_Pdf() {

  // 选择范围.
  let getPoint = new MxCADUiPrPoint();
  getPoint.setMessage("\n指定输出范围第一点:");
  let pt1 = await getPoint.go();
  if (!pt1) return;

  getPoint.setMessage("\n指定输出范围第二点:");
  getPoint.setUserDraw((currentPoint: McGePoint3d, worldDraw) => {
    worldDraw.setColor(0xFF0000);
    let pl = new McDbPolyline();
    pl.addVertexAt(pt1);
    pl.addVertexAt(new McGePoint3d(pt1.x, currentPoint.y))
    pl.addVertexAt(currentPoint);
    pl.addVertexAt(new McGePoint3d(currentPoint.x, pt1.y))
    pl.constantWidth = MxFun.screenCoordLong2Doc(2);
    pl.isClosed = true;

    worldDraw.drawMcDbEntity(pl);

    let points: THREE.Vector3[] = [];
    points.push(pt1.toVector3());
    points.push(new THREE.Vector3(pt1.x, currentPoint.y));
    points.push(currentPoint.toVector3());
    points.push(new THREE.Vector3(currentPoint.x, pt1.y))

    worldDraw.setColor(0x003244);
    worldDraw.drawSolid(points, 0.5)

  });

  getPoint.setDisableOsnap(true);
  getPoint.setDisableOrthoTrace(true);
  getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
  let pt2 = await getPoint.go();
  if (!pt2) {
    return;
  }

  let {
    baseUrl = "",
    mxfilepath = "",
    printPdfUrl = ""
  } = getMxCADUi().getUploadFileConfig();

  console.log(getMxCADUi().getUploadFileConfig() );
  let param = {
    width: "2100",
    height: "2970",
    bd_pt1_x: "" + pt1.x,
    bd_pt1_y: "" + pt1.y,
    bd_pt2_x: "" + pt2.x,
    bd_pt2_y: "" + pt2.y
  };

  // 把mxweb文件 ，保存到服务器上,再转成pdf。
  MxCpp.getCurrentMxCAD().saveFileToUrl(printPdfUrl, (iResult: number, sserverResult: string) => {
    try {
      let ret = JSON.parse(sserverResult);
      if (ret.ret == "ok") {
        let filePath = baseUrl + mxfilepath + ret.file;
        MxTools.downloadFileFromUrl(filePath, ret.file);
      }
      else {
        console.log(sserverResult);
      }
    } catch {
      console.log("Mx: sserverResult error");
    }
  }, undefined, JSON.stringify(param));

}


export function init() {
  MxFun.addCommand("Mx_Export_DWG", Mx_Export_DWG);
  MxFun.addCommand("Mx_Export_MxWeb", Mx_Export_MxWeb);
  MxFun.addCommand("Mx_Open_MxWeb", Mx_Open_MxWeb);
  MxFun.addCommand("MxTest_NewFile", MxTest_NewFile);
  MxFun.addCommand("Mx_Export_Pdf", Mx_Export_Pdf);

}
