///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import { MxFun } from "mxdraw";
import { McDbAttribute, McDbBlockReference, McDbLine, McGePoint3d, MxCADResbuf, MxCADSelectionSet, MxCADUiPrPoint, MxCADUtility, MxCpp } from "mxcad";

function  FindBlock(pt:McGePoint3d,blks:any):any{
  let dSearch = 40;
  let filter = new MxCADResbuf();
  filter.AddString("电杆层", 0);
  filter.AddString("INSERT", 5020);
  let ss = new MxCADSelectionSet();

  // 得到pt位置，范围为dSearch内的图块,图层为"电杆层"
  ss.crossingSelect(pt.x - dSearch,pt.y - dSearch,pt.x + dSearch,pt.y + dSearch,filter);
  let aryFind:any[] = [];

  // 遍历每个图块，得到图位置，放到一个数组中。
  ss.forEach((id) => {
    let ent = id.getMcDbEntity();
    if (ent) {
      let blkRef = (ent as McDbBlockReference);
      if(blks[blkRef.getObjectID().id]){
        aryFind.push({dist:blkRef.position.distanceTo(pt),blk:blks[blkRef.getObjectID().id]});
      }
    }
  });

  if(aryFind.length == 0) return undefined;

  // 对数组按查找点到图块位置的距离排序.
  aryFind.sort((a,b)=>{
    return a.dist - b.dist;
  });

  // 得到与查找点最近的图块，并返回.
  if(aryFind[0].dist < dSearch){
    return aryFind[0].blk;
  }
  return false;
}

function  FindLine(key:any,blks:any,lines:any){

  let blkdata = blks[key];
  let blkref:McDbBlockReference = blkdata.ref;

  let dSearch = 40;
  let filter = new MxCADResbuf();
  filter.AddString("0", 0);
  filter.AddString("LINE", 5020);
  let ss = new MxCADSelectionSet();

  // 得到图块位置，范围为dSearch内的直线。
  ss.crossingSelect(blkref.position.x - dSearch,blkref.position.y - dSearch,blkref.position.x + dSearch,blkref.position.y + dSearch,filter);

  // 遍历每个直线 。
  ss.forEach((id) => {
    let ent = id.getMcDbEntity();
    if (ent) {
      let line = (ent as McDbLine);
      let nexPoint:McGePoint3d = line.endPoint;

      // 得到直线与图块连接的端点坐标.
      let dist = line.startPoint.distanceTo(blkref.position);
      if(dist > line.endPoint.distanceTo(blkref.position)){
        dist = line.endPoint.distanceTo(blkref.position);
        nexPoint = line.startPoint;
      }

      if(dist < dSearch){
        if(!line[line.getObjectID().id] ){
          // 查找直线另一端的图块.
          let nexBlk = FindBlock(nexPoint,blks);
          if(nexBlk ){
            // 两端都找到图块，就算找到一个目标直线了.
            lines[line.getObjectID().id] = {tag1:blkdata.tag,tag2:nexBlk.tag,handle:line.getHandle()};
          }
        }
      }
    }
  });

}

// demo/test_search.dwg
async function MxTest_UserGetData() {

  let ss = new MxCADSelectionSet();
  let filter = new MxCADResbuf();
  filter.AddString("电杆层", 0);
  filter.AddString("INSERT", 5020);

  // 得到图上所在"电杆层"上的图块。
  ss.allSelect(filter);

  let blks:any = {};

  // 遍历每个图块.
  ss.forEach((id) => {
    let ent = id.getMcDbEntity();
    if (ent) {
      let blkRef = (ent as McDbBlockReference);
      let aryId = blkRef.getAllAttribute();
      let obj:any = {};
      aryId.forEach((id) => {
        let attribt: McDbAttribute = id.getMcDbEntity() as any;
        // 得到杆号
        if (attribt.tag == "杆号") {
          obj.tag = attribt.textString;
        }
      });

      if(obj.tag){
        // 得到一个目标图块 。
        obj.handle = blkRef.getHandle();
        blks[id.id]= {ref:blkRef,tag:obj.tag};
        console.log(obj);
      }
    }
  })

  let lines:any = {};
  Object.keys(blks).forEach((key)=>{
    // 根所图块位置，查找与它连接的直线 。
    FindLine(key,blks,lines);
  });

  Object.keys(lines).forEach((key)=>{
    console.log(lines[key]);
  });

}

export function init() {
  MxFun.addCommand("MxTest_UserGetData", MxTest_UserGetData);
}
