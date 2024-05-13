///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxCpp, McDbBlockReference, McGePoint3d } from "mxcad"


// 放置树，位置66，1000
export class Bock {
   async call(param: any) {
    let mxcad = MxCpp.App.getCurrentMxCAD();

    if (param.name) {
      const table = mxcad.getDatabase().getBlockTable()
      const blkrecId = table.get(param.name)
      if (!blkrecId) return
      if(!blkrecId.isValid()) return
      let blkRef = new McDbBlockReference();
      blkRef.blockTableRecordId = blkrecId;
      let box = blkRef.getBoundingBox();
      let oldScale = 0
      if (box.ret) {
        let dLen = box.maxPt.distanceTo(box.minPt);
        if (dLen > 0.00001) {
          oldScale = mxcad.getMxDrawObject().screenCoordLong2Doc(100) / dLen
          blkRef.setScale(oldScale);
        }
      }
      blkRef.position = new McGePoint3d(param.pos[0], param.pos[1])
      mxcad.drawEntity(blkRef);
      mxcad.updateDisplay()
    }
  }

  public regist_data() {
    return {
      filename: "insertBock.json",
      name: "insertBock",
      description: "放置插入某个物品",
      params: [
        {
          name: "name", description: "要放置插入的物品名称", "type": "str", "required": true
        },
        {
          name: "pos", description: "要放置插入物品的位置", "type": "tuple[float, float]", "required": true
        }
      ]
    }
  }
}

