///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import {
  MxFun,
} from "mxdraw";
import {McDbBlockReference,McDbBlockTableRecord,McDbEntity,McGePoint3d, MxCADSelectionSet, MxCpp} from "mxcad";

async function MxTest_SelectEntitysToBlock() {

  let ss = new MxCADSelectionSet();
  if(!await ss.userSelect("选择要做成块的对象:") ) return;
  if(ss.count() == 0) return;

  let mxcad = MxCpp.getCurrentMxCAD();
  let blkTable =  mxcad.getDatabase().getBlockTable();
  let blkRecId = blkTable.add(new McDbBlockTableRecord());
  let blkTableRecord:McDbBlockTableRecord = blkRecId.getMcDbBlockTableRecord() as any;
  if(blkTableRecord == null) return;

  let pt1x:any,pt1y:any,pt2x:any,pt2y:any;
  ss.forEach((id)=>{
    let ent = id.getMcDbEntity();
    if(!ent) return;

    let cent = ent.clone() as McDbEntity;
    blkTableRecord.appendAcDbEntity(cent);
    
    let entBox = ent.getBoundingBox();
    if(entBox.ret){
      if(!pt1x){
        pt1x = entBox.minPt.x;
        pt1y = entBox.minPt.y;
        pt2x = entBox.maxPt.x;
        pt2y = entBox.maxPt.y;
      }
      else {
        if(pt1x > entBox.minPt.x) pt1x= entBox.minPt.x;
        if(pt1y > entBox.minPt.y) pt1y= entBox.minPt.y;
        if(pt2x < entBox.maxPt.x) pt2x= entBox.maxPt.x;
        if(pt2y < entBox.maxPt.y) pt2y= entBox.maxPt.y;
      }
    }
  })
  if(pt1x === undefined){
    return;
  }
  let insertPtx =  pt1x + (pt2x - pt1x) * 0.5;
  let insertPty =  pt1y + (pt2y - pt1y) * 0.5;
  // 设置图块的插入基点，在图形对象的中心位置。
  blkTableRecord.origin = new McGePoint3d(insertPtx,insertPty,0);


  let blkRef = new McDbBlockReference();
  blkRef.blockTableRecordId = blkRecId;
  blkRef.position = new McGePoint3d(insertPtx,insertPty,0);

  mxcad.drawEntity(blkRef);

  ss.forEach((id)=>{
    let ent = id.getMcDbEntity();
    if(!ent) return;
    ent.erase();
  });
}



export function init() {
  MxFun.addCommand("MxTest_SelectEntitysToBlock", MxTest_SelectEntitysToBlock);
}
