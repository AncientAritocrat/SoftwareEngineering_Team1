///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import { ColorIndexType, McCmColor, McDb, McGePoint3d, McGeVector3d, McObject, MxCpp } from "mxcad";
export class MxDrawTableData {
  public m_aryColumn: { name: string, w: number }[] = [];
  public m_allData: string[][] = [];

  public m_dColumnHeight: number = 14;
  public m_dRowHeight: number = 10;

  public m_dRowLineWdith: number = 0.0;
  public m_dColumnLineWidth: number = 0.5;

  public m_dRowTextHeight: number = 6;
  public m_dColumnTextHeight: number = 10;

  public addColumn(sName: string, dW: number) {
    this.m_aryColumn.push({ name: sName, w: dW });
  }

  public addRow(ary: string[]) {
    this.m_allData.push(ary);
  }
};

export class MxDrawTable {
  public data: MxDrawTableData = new MxDrawTableData;
  public pt: McGePoint3d = new McGePoint3d;
  public dScale: number = 1.0;
  public mxcad: McObject = MxCpp.getCurrentMxCAD();

  public draw(pt: McGePoint3d, dScale: number): boolean {
    this.pt = pt;
    this.dScale = dScale;
    if (this.data.m_aryColumn.length == 0)
      return false;
    if (this.data.m_allData.length == 0)
      return false;
    this.DrawTableHead();

    this.DrawContent();
    return true;
  }

  private DrawTableHead() {
    let m_data = this.data;
    let m_instPt = this.pt.clone();
    let curPt = this.pt.clone();
    let vecTmp = new McGeVector3d(0, 1, 0).mult(this.Scale(this.data.m_dColumnHeight))
    console.log(vecTmp)
    let dLineWidth = this.Scale(this.data.m_dColumnLineWidth);

    let dAllW = 0.0;
    let kXAxis = new McGeVector3d(1, 0, 0);
    for (let i = 0; i < m_data.m_aryColumn.length; i++) {
      let col = m_data.m_aryColumn[i];
      this.DrawLine(curPt, curPt.clone().subvec(vecTmp), dLineWidth);
      this.DrawMCText(curPt.clone().addvec(kXAxis.clone().mult(this.Scale(col.w) * 0.5)).subvec(vecTmp.clone().mult(0.5)), col.name, this.Scale(m_data.m_dColumnTextHeight));
      curPt.addvec(kXAxis.clone().mult(this.Scale(col.w)));
      dAllW += this.Scale(col.w);
    }
    this.DrawLine(curPt, curPt.clone().subvec(vecTmp), dLineWidth);
    this.DrawLine(m_instPt, m_instPt.clone().addvec(kXAxis.clone().mult(dAllW)), dLineWidth);
    this.DrawLine(m_instPt.clone().subvec(vecTmp), m_instPt.addvec(kXAxis.clone().mult(dAllW)).subvec(vecTmp), dLineWidth);
    return true;
  }

  private DrawContent() {

    let m_data = this.data;
    let m_instPt = this.pt;


    let dAllW = 0.0;
    for (let i = 0; i < m_data.m_aryColumn.length; i++) {
      dAllW += this.Scale(m_data.m_aryColumn[i].w);
    }
    let dLineWidth = this.Scale(this.data.m_dRowLineWdith);

    let kXAxis = new McGeVector3d(1, 0, 0);
    let kYAxis = new McGeVector3d(0, 1, 0);
    let instPt = m_instPt.clone().subvec(kYAxis.clone().mult(this.Scale(m_data.m_dColumnHeight)));
    let vecTmp = kYAxis.clone().mult(this.Scale(m_data.m_dRowHeight));

    for (let i = 0; i < m_data.m_allData.length; i++) {
      let curPt = instPt.clone();

      for (let j = 0; j < m_data.m_aryColumn.length; j++) {
        let col = m_data.m_aryColumn[j];
        this.DrawLine(curPt, curPt.clone().subvec(vecTmp), dLineWidth);
        this.DrawMCText(curPt.clone().addvec(kXAxis.clone().mult(this.Scale(col.w * 0.5))).subvec(vecTmp.clone().mult(0.5)), m_data.m_allData[i][j], this.Scale(m_data.m_dRowTextHeight));
        curPt.addvec(kXAxis.clone().mult(this.Scale(col.w)));
      }
      this.DrawLine(curPt, curPt.clone().subvec(vecTmp), dLineWidth);
      this.DrawLine(instPt, instPt.clone().addvec(kXAxis.clone().mult(dAllW)), dLineWidth);
      this.DrawLine(instPt.clone().subvec(vecTmp), instPt.clone().addvec(kXAxis.clone().mult(dAllW)).subvec(vecTmp), dLineWidth);
      instPt.subvec(vecTmp);
    }
    return true;
  }

  private DrawLine(pt1: McGePoint3d, pt2: McGePoint3d, dLineWidth: number) {
    this.mxcad.drawLineWidth = dLineWidth;
    this.mxcad.drawColorIndex = ColorIndexType.kMagenta;
    this.mxcad.drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
  }

  private DrawMCText(pt1: McGePoint3d, sTxt: string, dTextHeight: number) {
    this.mxcad.drawColorIndex = 0;
    this.mxcad.drawColor = new McCmColor(0,255,0);
    this.mxcad.drawText(pt1.x, pt1.y, sTxt, dTextHeight, 0,McDb.TextHorzMode.kTextMid,McDb.TextVertMode.kTextVertMid);
  }

  private Scale(dL: number): number {
    return dL * this.dScale;
  }
};
