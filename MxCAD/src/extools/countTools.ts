///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxFun } from "mxdraw";
import {
    MxCADUiPrEntity, MxCpp, MxCADResbuf, MxCADUiPrPoint, McDb,
    McDbText, McDbCurve, McGePoint3d, MxCADUtility, McDbLine, McDbMText,
    McDbPolyline, MxCADUiPrDist, McDbBlockReference, McDbBlockTableRecord,
    MxCADUiPrString
} from "mxcad";

// 统计长度
async function Mx_StaLength() {
    const mxcad = MxCpp.App.getCurrentMxCAD();
    const strLen = new McDbText();
    strLen.height = 10;
    let pt = new McGePoint3d();

    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("CIRCLE,ARC,LINE,LWPOLYLINE,ELLIPSE");
    let aryId = await MxCADUtility.userSelect("选择目标曲线", filter);
    if (aryId.length == 0) {
        return;
    }
    let length = 0;
    aryId.forEach(async (id) => {
        let event = id.getMcDbEntity() as McDbCurve;
        length += event.getLength().val
    });
    strLen.textString = length.toFixed(2).toString();
    const getSumPoint = new MxCADUiPrPoint();
    getSumPoint.setMessage('指定长度标注点');
    getSumPoint.setUserDraw((pt, pw) => {
        strLen.position = pt;
        strLen.alignmentPoint = pt;
        pw.drawMcDbEntity(strLen);
    })
    pt = await getSumPoint.go();
    if (!pt) return;
    strLen.alignmentPoint = pt;
    strLen.position = pt;
    mxcad.drawEntity(strLen)
}

// 统计面积
async function Mx_StaArea() {
    const mxcad = MxCpp.App.getCurrentMxCAD();
    const strLen = new McDbText();
    strLen.height = 10;
    let pt = new McGePoint3d();

    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("CIRCLE,LWPOLYLINE,ELLIPSE");
    let aryId = await MxCADUtility.userSelect("选择目标对象", filter);
    if (aryId.length == 0) {
        return;
    }
    let area = 0;
    aryId.forEach(async (id) => {
        let event = id.getMcDbEntity() as McDbCurve;
        area += event.getArea().val
    });
    strLen.textString = area.toFixed(2).toString();
    const getSumPoint = new MxCADUiPrPoint();
    getSumPoint.setMessage('指定长度标注点');
    getSumPoint.setUserDraw((pt, pw) => {
        strLen.position = pt;
        strLen.alignmentPoint = pt;
        pw.drawMcDbEntity(strLen);
    })
    pt = await getSumPoint.go();
    if (!pt) return;
    strLen.alignmentPoint = pt;
    strLen.position = pt;
    mxcad.drawEntity(strLen)
}

// 标斜率
async function Mx_StandardSlope() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LINE");

    const getLine = new MxCADUiPrEntity();
    getLine.setFilter(filter);
    getLine.setMessage("请选择目标斜率对象");
    const line_id = await getLine.go();
    if (!line_id.id) return;
    const line = line_id.getMcDbEntity() as McDbLine;

    const getHeight = new MxCADUiPrDist();
    getHeight.setMessage("请设置标注文字高度");
    const val = await getHeight.go();
    if (!val) return;
    const height = getHeight.value();

    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage('指定斜率标注点');
    let blkRef = new McDbBlockReference();
    const mxcad = MxCpp.getCurrentMxCAD();
    getPoint.setUserDraw((pt, pw) => {
        const pt1 = line.getClosestPointTo(pt, true).val;
        const pt2 = new McGePoint3d(pt1.x, pt1.y + height * 4);
        const l = new McDbLine(pt1, pt2);
        const l_clone = l.clone() as McDbLine;
        l_clone.rotate(pt2, Math.PI * 1 / 2);
        const pt3 = line.IntersectWith(l_clone, McDb.Intersect.kExtendBoth).at(0);
        const pt0 = line.getClosestPointTo(pt1, false).val
        const pl = new McDbPolyline();
        pl.isClosed = true;
        pl.addVertexAt(pt0);
        pl.addVertexAt(pt1);
        pl.addVertexAt(pt2);
        pl.addVertexAt(pt3);

        const text = new McDbText();
        text.height = height;
        text.position = l.getPointAtDist(l.getLength().val / 2).val;
        text.alignmentPoint = text.position;
        text.rotation = - Math.PI / 2;
        text.horizontalMode = McDb.TextHorzMode.kTextMid;
        text.textString = '1000';//基准数字

        const text1 = new McDbText();
        const l1 = new McDbLine(pt3, pt2);
        text1.height = height;
        text1.position = l1.getPointAtDist(pt3.distanceTo(pt2) / 2).val;
        text1.alignmentPoint = text1.position;
        text1.horizontalMode = McDb.TextHorzMode.kTextMid;
        text1.textString = (1000 * pt3.distanceTo(pt2) / l.getLength().val).toFixed(0).toString();

        // 整装成块
        let blkTable = mxcad.getDatabase().getBlockTable();
        let blkRecId = blkTable.add(new McDbBlockTableRecord());//图块记录
        let blkTableRecord: McDbBlockTableRecord = blkRecId.getMcDbBlockTableRecord() as any;
        if (blkTableRecord == null) return;
        blkTableRecord.appendAcDbEntity(pl);
        blkTableRecord.appendAcDbEntity(text);
        blkTableRecord.appendAcDbEntity(text1);
        blkTableRecord.name = '斜率test'

        blkTableRecord.origin = pt1;
        blkRef.blockTableRecordId = blkRecId;
        blkRef.position = pt1;
        pw.drawMcDbEntity(blkRef)
    });
    const pt = await getPoint.go();
    if (!pt) return;
    mxcad.drawEntity(blkRef);
}

// 坐标标注
async function Mx_CoordAnnotation() {
    const getPoint1 = new MxCADUiPrPoint();
    getPoint1.setMessage('指定第一点');
    const pt1 = await getPoint1.go();
    if (!pt1) return;

    const getPoint2 = new MxCADUiPrPoint();
    getPoint2.setMessage('指定第二点');

    const mxcad = MxCpp.getCurrentMxCAD();
    const text = new McDbMText();
    text.textHeight = 10;
    text.attachment = McDb.AttachmentPoint.kMiddleLeft;
    text.contents = `X=${(pt1.x).toFixed(2)}\\PY=${(pt1.y).toFixed(2)}`;
    text.location = pt1;

    const id = mxcad.drawEntity(text);
    mxcad.updateDisplay();
    if (!id) return;
    let w: number;
    let pl: McDbPolyline;
    let _clone: McDbMText
    setTimeout(async () => {
        const minBox = id.getMcDbEntity().getBoundingBox();
        w = minBox.maxPt.distanceTo(new McGePoint3d(minBox.minPt.x, minBox.maxPt.y));
        id.erase();

        getPoint2.setUserDraw((pt, pw) => {
            _clone = text.clone() as McDbMText;
            _clone.location = pt;
            const pt3 = new McGePoint3d(pt.x + w, pt.y);
            pw.drawMcDbEntity(_clone);
            pl = new McDbPolyline();
            pl.addVertexAt(pt1);
            pl.addVertexAt(pt);
            pl.addVertexAt(pt3);
            pw.drawMcDbEntity(pl);
        });

        const pt2 = await getPoint2.go();
        if (!pt2) return;
        mxcad.drawEntity(_clone);
        mxcad.drawEntity(pl);
    }, 0);

}

// 智能标高
async function Mx_Elevation() {

    const getPoint1 = new MxCADUiPrPoint();
    getPoint1.setMessage('指定起点');
    const pt1 = await getPoint1.go();
    if (!pt1) return;

    // 标注文字
    const height = 10;
    const mxcad = MxCpp.getCurrentMxCAD();
    const text = new McDbText();
    text.height = height;
    text.textString = pt1.y.toFixed(2);
    text.position = pt1;
    const id = mxcad.drawEntity(text);

    let line1: McDbLine;
    let pl: McDbPolyline;
    let textHt: McDbText;
    setTimeout(async () => {
        // 获取标注文字长度
        const minBox = id.getMcDbEntity().getBoundingBox();
        const w = minBox.maxPt.distanceTo(new McGePoint3d(minBox.minPt.x, minBox.maxPt.y));
        id.erase();

        const getPoint2 = new MxCADUiPrPoint();
        getPoint2.setMessage('指定终点');
        getPoint2.setUserDraw((pt, pw) => {
            line1 = new McDbLine(pt1, new McGePoint3d(pt1.x + height, pt1.y, 0));
            line1.startPoint = pt1;
            line1.endPoint = line1.getClosestPointTo(pt, true).val;
            pw.drawMcDbEntity(line1);

            const p1 = new McGePoint3d(pt.x, pt1.y + height, 0);
            const p2 = line1.getPointAtDist(line1.getLength().val - height).val;
            const p3 = line1.getPointAtDist(line1.getLength().val - height * 2).val;
            pl = new McDbPolyline();
            pl.addVertexAt(p1);
            pl.addVertexAt(p2);
            pl.addVertexAt(new McGePoint3d(p3.x, p3.y + height, 0));
            if (pt.x > pt1.x) {
                pl.addVertexAt(new McGePoint3d(p1.x + w, p1.y, 0));
            } else {
                pl.addVertexAt(new McGePoint3d(p1.x - w, p1.y, 0));
            }
            pw.drawMcDbEntity(pl);

            textHt = text.clone() as McDbText;
            textHt.position = textHt.alignmentPoint = p1;
            // 根据文字所在位置确定文字对齐方式
            if (pt.x > pt1.x) {
                text.horizontalMode = McDb.TextHorzMode.kTextLeft;
            } else {
                text.horizontalMode = McDb.TextHorzMode.kTextRight;
            }
            pw.drawMcDbEntity(textHt);
        })
        const pt2 = await getPoint2.go();
        if (!pt2) return;

        const getPosition = new MxCADUiPrPoint();
        getPosition.setMessage('指定标注方向');
        getPosition.setUserDraw((pt, pw) => {
            const pl_clone = pl.clone() as McDbPolyline;
            const text_clone = textHt.clone() as McDbText;
            if (pt.y < line1.endPoint.y) {
                pl_clone.mirror(pl.getPointAt(1).val, line1.endPoint);
                const p = pl_clone.getPointAt(0).val;
                text_clone.position = text_clone.alignmentPoint = new McGePoint3d(p.x, p.y - height, 0)
            }
            pw.drawMcDbEntity(text_clone);
            pw.drawMcDbEntity(pl_clone);
            pw.drawMcDbEntity(line1);
        })

        const position = await getPosition.go();
        if (!position) return;
        // 设置标注方向
        if (position.y < line1.endPoint.y) {
            pl.mirror(pl.getPointAt(1).val, line1.endPoint);
            const p = pl.getPointAt(0).val;
            textHt.position = textHt.alignmentPoint = new McGePoint3d(p.x, p.y - height, 0)
        }

        mxcad.drawEntity(line1);
        mxcad.drawEntity(textHt);
        mxcad.drawEntity(pl);

    }, 0)
}

// 粗糙度
async function Mx_Roughness() {
    // 设置标注文字内容
    const getStr = new MxCADUiPrString();
    getStr.setMessage('请设置文字内容');
    const str = await getStr.go();
    if (!str) return;
    const text = new McDbText();
    text.textString = str;
    text.height = 10;
    text.position = text.alignmentPoint = new McGePoint3d(0, 0, 0);
    text.horizontalMode = McDb.TextHorzMode.kTextMid;
    const mxcad = MxCpp.getCurrentMxCAD();
    const id = mxcad.drawEntity(text);

    setTimeout(async () => {
        // 获取文字宽度
        const minBox = id.getMcDbEntity().getBoundingBox();
        const w = minBox.maxPt.distanceTo(new McGePoint3d(minBox.minPt.x, minBox.maxPt.y));
        id.erase();

        const getPoint = new MxCADUiPrPoint();
        getPoint.setMessage('请指定标注位置');
        let pl: McDbPolyline;
        let _clone: McDbText;
        getPoint.setUserDraw((pt, pw) => {
             const midPt = new McGePoint3d(pt.x, pt.y + w, 0);
             const startPt = new McGePoint3d(midPt.x - w/2, midPt.y, 0);
             const endPt = new McGePoint3d(midPt.x + w/2, midPt.y, 0);
             const line = new McDbLine(pt, endPt);
             const lastPt = line.getPointAtDist(line.getLength().val + w).val;
             pl = new McDbPolyline();
             pl.addVertexAt(endPt);
             pl.addVertexAt(startPt);
             pl.addVertexAt(pt);
             pl.addVertexAt(lastPt);
             pw.drawMcDbEntity(pl);
            
             _clone = text.clone() as McDbText;
             _clone.position = _clone.alignmentPoint = midPt;
             pw.drawMcDbEntity(_clone)
        });

        const pt = await getPoint.go();
        if (!pt) return;

        mxcad.drawEntity(pl);
        mxcad.drawEntity(_clone);
    }, 0)

}

export function init() {
    MxFun.addCommand("Mx_StaLength", Mx_StaLength);
    MxFun.addCommand("Mx_StaArea", Mx_StaArea);
    MxFun.addCommand("Mx_StandardSlope", Mx_StandardSlope);
    MxFun.addCommand("Mx_CoordAnnotation", Mx_CoordAnnotation);
    MxFun.addCommand("Mx_Elevation", Mx_Elevation);
    MxFun.addCommand("Mx_Roughness", Mx_Roughness);
}