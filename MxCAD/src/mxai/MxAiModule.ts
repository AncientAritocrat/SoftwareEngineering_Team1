///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxCADUiPrString, MxCpp } from "mxcad";
import { MxFun } from "mxdraw";


export class MxAiModuleType {

  private aryRegData = [];
  public regist(type: any) {
    let fun = new type();
    let regdata = fun.regist_data();
    MxCpp.Ai.addFunction(regdata.name, fun.call);
    this.aryRegData.push(regdata);
  }

  public regist_server(operation_code:string) {
    this.aryRegData.forEach((val) => {
      val.operation_code = operation_code;
      MxCpp.Ai.registTool(val);
    })
    MxCpp.Ai.reloadTools({operation_code:operation_code});
  }

}
export let MxAiModule: MxAiModuleType = new MxAiModuleType();


async function Mx_Ai() {
  let getString = new MxCADUiPrString();
  getString.setMessage("\n human:");
  let str = await getString.go();
  if (!str) return;
  MxCpp.Ai.chat_tool(str);
}

async function Mx_AiRegistServer() {
  let getString = new MxCADUiPrString();
  getString.setMessage("\n 输入 server_operate_code:");
  let str = await getString.go();
  if (!str) return;
  MxAiModule.regist_server(str);
}


import { init as line_init } from "./MxAiDrawLine"
import { init as circle_init } from "./MxAiDrawCircle"
import { init as circle_arc_init } from "./MxAiDrawCircleArc"

import { init as polygon_init } from "./MxAiDrawPolygon"
import { init as rect_init } from "./MxAiDrawRect"

import { init as ellipse_init } from "./MxAiDrawEllipse"

import { init as interiorDesign_init } from "./interiorDesignCode"
import { init as text_init } from "./MxAiDrawText"
import { init as withdrawOrRestore_init } from "./MxAiWithdrawAndRestore"

export function init() {
  MxFun.addCommand("Mx_Ai", Mx_Ai);
  MxFun.addCommand("Mx_AiRegistServer", Mx_AiRegistServer);
  line_init();
  circle_init()
  circle_arc_init()
  polygon_init()
  ellipse_init()
  interiorDesign_init()
  text_init()
  withdrawOrRestore_init()
  rect_init()
}

