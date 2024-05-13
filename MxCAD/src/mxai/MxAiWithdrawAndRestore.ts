///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxCpp } from "mxcad";
import { MxAiModule } from "./MxAiModule";
import { MxFun } from "mxdraw";

// 撤回2步 恢复1步
class MxAiWithdrawAndRestore {
  public call(param: any) {
    console.log(param)
    if(param.isWithdraw) {
      if(typeof param.withdrawNum !== "number") param.withdrawNum = 1
      for (let index = 0; index < param.withdrawNum; index++) {
        MxFun.sendStringToExecute("Mx_Undo")
      }
    }
    if(param.isRestore) {
      if(typeof param.restoreNum !== "number") param.restoreNum = 1
      for (let index = 0; index < param.restoreNum; index++) {
        MxFun.sendStringToExecute("Mx_Redo")
      }
    }
  }

  public regist_data() {
    return {
      filename: "call_withdraw_restore.json",
      name: "call_withdraw_restore",
      description: "撤回撤销和恢复",
      params: [
        {
          name: "isWithdraw", description: "是否要撤回或撤销", "type": "boolean", "required": true
        },
        {
          name: "isRestore", description: "是否要恢复", "type": "boolean", "required": true
        },
        {
          name: "withdrawNum", description: "撤回撤销(上)几步", "type": "int", "required": false
        },
        {
          name: "restoreNum", description: "恢复(前)几步", "type": "int", "required": false
        }
      ]
    }
  }

}

export function init() {
  MxAiModule.regist(MxAiWithdrawAndRestore);
}
