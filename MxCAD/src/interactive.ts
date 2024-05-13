///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import {    
    MxFun
} from "mxdraw";
import { McDbBlockReference, McDbPolyline, MxCADResbuf, MxCADUiPrEntity } from "mxcad";
import { McGePoint3dToString } from ".";

async function MxTest_SelectEntity() {
    let getEnt = new MxCADUiPrEntity();
    getEnt.setMessage("select entity:");
    let id = await getEnt.go();
    let ent = id.getMcDbEntity();
    if (ent === null) return;

    console.log("ent.objectName",ent.objectName);
    if (ent instanceof McDbBlockReference) {
        let blkRef: McDbBlockReference = ent;
        let retExplode: MxCADResbuf = blkRef.explode();
        if (retExplode.GetCount() == 0) return;
        let iExplodeConut = retExplode.GetCount();
        for (let j = 0; j < iExplodeConut; j++) {
            let tmpobj = retExplode.AtObject(j).val;
            if(tmpobj instanceof McDbPolyline){
                let polyline:McDbPolyline = tmpobj;
                let num = polyline.numVerts();
                for (let i = 0; i < num; i++) {
                  let pt = polyline.getPointAt(i);
                  let bulge = polyline.getBulgeAt(i);
                  console.log("polyline.pt" + i + ":" + McGePoint3dToString(pt.val));
                  console.log("polyline.bulge" + i + ":" + bulge);
                }
            }
        }
    }
    else if(ent instanceof McDbPolyline){
        let polyline:McDbPolyline = ent;
        let num = polyline.numVerts();
        for (let i = 0; i < num; i++) {
          let pt = polyline.getPointAt(i);
          let bulge = polyline.getBulgeAt(i);
          console.log("polyline.pt" + i + ":" + McGePoint3dToString(pt.val));
          console.log("polyline.bulge" + i + ":" + bulge);
        }
    }
}

export function init() {
    MxFun.addCommand("MxTest_SelectEntity", MxTest_SelectEntity);
}
