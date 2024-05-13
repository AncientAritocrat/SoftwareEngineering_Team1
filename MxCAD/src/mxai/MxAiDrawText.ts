///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McDbMText, McDbText, McGePoint3d, McObjectId, MxCADUiPrDist, MxCADUiPrPoint, MxCADUiPrString, MxCpp } from "mxcad";
import { MxAiModule } from "./MxAiModule";
import { baseParams, mergeBaseMcDbEntityProps, parsePoint } from "./base";



//绘制插入单行文字"是否"文字位置0,0
class MxAiDrawText {
  async call(param: any) {
    let mxcad = MxCpp.getCurrentMxCAD();
    console.log(param)
    mxcad.newFile()
    let objId: McObjectId
    const isMText = typeof param.isMText === "undefined" ? false : param.isMText
    const createMText = () => {
      const mText = new McDbMText()
      mText.textHeight = param.textSize || 100
      mText.location = param.textPos || new McGePoint3d()
      mText.contents = param.textString || ""
      return mText
    }
    const createText = () => {
      const text = new McDbText()
      text.height = param.textSize || 100
      text.textString = param.textString || ""
      text.position = param.textPos || new McGePoint3d()
      return text
    }
    if (!param.textString) {
      const getStr = new MxCADUiPrString()
      getStr.setMessage("请输入文字")
      const text = await getStr.go()
      if (!text) return
      param.textString = text
    }
    if (!param.textPos) {
      const getPoint = new MxCADUiPrPoint()
      getPoint.clearLastInputPoint()
      getPoint.setMessage("请指定文字位置")
      const point = await getPoint.go()
      getPoint.setUserDraw((pt, pw) => {
        param.textPos = pt
        if (isMText) {
          const mText = createMText()
          pw.drawMcDbEntity(mText)
        } else {
          const text = createText()
          pw.drawMcDbEntity(text)
        }
      })
      if (!point) return
      param.textPos = point
    } else {
      param.textPos = parsePoint(param.textPos)
    }
    if (!param.textSize) {
      const getDist = new MxCADUiPrPoint()
      getDist.clearLastInputPoint()
      getDist.setMessage("通过线段长度确定文字高度")
      const point = await getDist.go()
      if (point) {
        getDist.setUserDraw((pt, pw) => {
          param.textSize = point.distanceTo(pt)
          if (isMText) {
            const mText = createMText()
            pw.drawMcDbEntity(mText)
          } else {
            const text = createText()
            pw.drawMcDbEntity(text)
          }
        })
        const point1 = await getDist.go()
        if (point1) {
          param.textSize = point1.distanceTo(point)
        }
      }
    }

    if (isMText) {
      const mText = createMText()
      objId = mxcad.drawEntity(mText)
    } else {
      const text = createText()
      objId = mxcad.drawEntity(text)
    }
    mergeBaseMcDbEntityProps(objId.getMcDbEntity(), param)
    mxcad.updateDisplay();
  }

  public regist_data() {
    return {
      filename: "drawText.json",
      name: "draw_text",
      description: "绘制或者插入文字或者多行文字(文本)",
      params: [
        {
          name: "isMText", description: "绘制的文字是否为多行文字", "type": "boolean", "required": true
        },
        {
          name: "textString", description: "绘制的文字的内容", "type": "str", "required": true
        },
        {
          name: "textPos", description: "绘制的文字的位置", "type": "tuple[float, float]", "required": true
        },
        {
          name: "textSize", description: "绘制的文字的高度", "type": "float", "required": true
        },
        ...baseParams,
      ]
    }
  }

}

export function init() {
  MxAiModule.regist(MxAiDrawText);
}


