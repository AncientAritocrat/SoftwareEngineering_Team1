///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/

import { init as init_getdata } from "./getdata"
import { init as linetext_custom } from "./linetext_custom/entity"
///////////////////////////////////////////////////////////////////////////////
export function init() {
  init_getdata();
  linetext_custom();
}
