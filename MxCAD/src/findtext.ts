///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import {
  MxFun,
} from "mxdraw";
import {McDbAttribute, McDbBlockReference,McDbMText,McDbProxyEntity,McDbText,McGePoint3d,MxCADResbuf, MxCADSelectionSet} from "mxcad";

async function MxTest_FindText() {

  
  //let sFindText1 = "STRAT";
  let sFindText1 = "0601";
  let sFindText2 = "001A";

  let ss = new MxCADSelectionSet();
  let filter = new MxCADResbuf();
  filter.AddMcDbEntityTypes("TEXT,MTEXT,INSERT,ACAD_PROXY_ENTITY");
  ss.allSelect(filter);
  let findPos: any;
  let entBox:any;
  let iCount = ss.count();
  for (let i = 0; i < iCount; i++) {
    let id = ss.item(i);
    let ent = id.getMcDbEntity();
    if (!ent) return;

    if (ent instanceof McDbText) {
      let txt = (ent as McDbText);
      if (txt.textString == sFindText1) {
        findPos = txt.position;
        entBox = txt.getBoundingBox();
        break;
      }

    }
    else if (ent instanceof McDbMText) {
      let mtxt = (ent as McDbMText);
      if (mtxt.contents == sFindText1) {
        findPos = mtxt.location;
        entBox = mtxt.getBoundingBox();
        break;
      }
    }

    else if (ent instanceof McDbBlockReference) {
      let blkRef: McDbBlockReference = ent;
      let aryId = blkRef.getAllAttribute();
      let iFind = 0;
      aryId.forEach((id) => {
        let attribt: McDbAttribute = id.getMcDbEntity() as any;
        if (attribt.textString == sFindText1) {
          iFind++;
         
        }
        else if(attribt.textString == sFindText2){
          iFind++;
        }
      })

      if(iFind == 2)
      {
        findPos = blkRef.position;
        entBox = blkRef.getBoundingBox();
        break;
      }
    }

    else if(ent instanceof McDbProxyEntity){
      let proxyEntity: McDbProxyEntity = ent;
      let aryText = proxyEntity.getAllTextContent();
      let iFind = 0;
      aryText.forEach((val)=>{
        if (val == sFindText1) {
          iFind++;
        }
      });

      if(iFind >= 1)
      {
        entBox = proxyEntity.getBoundingBox();
        if(entBox && entBox.ret){
          findPos = new McGePoint3d(entBox.minPt.x + (entBox.maxPt.x - entBox.minPt.x) * 0.5,entBox.minPt.y + (entBox.maxPt.y - entBox.minPt.y) * 0.5);
        }
        break;
      }
    }
  }

  if(entBox && entBox.ret){

    console.log(entBox);
    let len = entBox.minPt.distanceTo(entBox.maxPt) * 2;
    MxFun.getCurrentDraw().zoomW(new THREE.Vector3(entBox.minPt.x - len,entBox.minPt.y - len,0),
      new  THREE.Vector3(entBox.maxPt.x + len,entBox.maxPt.y + len,0));

  }
  else if(findPos){

    MxFun.getCurrentDraw().zoomCenter(findPos.x,findPos.y);
  }
  else{
    console.log("没有找到文字:" + sFindText1)
  }
}



export function init() {
  MxFun.addCommand("MxTest_FindText", MxTest_FindText);
}
