///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import { MxFun, MxDbRect, DynamicInputType } from "mxdraw";
import {
    MxCpp, MxCADUiPrPoint, MxCADUiPrInt, McDbEntity,
    MxCADResbuf, McGePoint3d, MxCADUtility, McDbArc, McDbCircle,
    McObjectId, McGeVector3d, McDbPolyline, McCmColor, McDbLine,
    McDb, McDbCurve, MxCADUiPrEntity, McDbObject, MxCADUiPrDist, MxCADUiPrKeyWord,
    McDbText, MxCADUiPrString, McDbBlockTableRecord, McDbBlockReference
} from "mxcad";

// 星形
async function Mx_DrawStart() {
    const starVert = new MxCADUiPrInt()
    starVert.setMessage("\n请输入星形顶点数：")
    const starNum = await starVert.go()
    if (!starNum) return;
    const getCenter = new MxCADUiPrPoint()
    getCenter.setMessage("\n指定星形中心点:")
    const center = await getCenter.go()
    if (!center) return;
    const getRadius1 = new MxCADUiPrPoint()
    getRadius1.setMessage('\n指定星形的内半径:')
    getRadius1.setUserDraw((pt, pw) => {
        let radius = pt.distanceTo(center)
        pw.drawMcDbEntity(new McDbCircle(center.x, center.y, center.z, radius))
        pw.drawMcDbEntity(new McDbLine(center, pt))
    })
    const pt1 = await getRadius1.go()
    if (!pt1) return;
    const radius1 = pt1.distanceTo(center)
    const circle1 = new McDbCircle(center.x, center.y, center.z, radius1)
    let pointsArr: McGePoint3d[] = []
    const getRadius2 = new MxCADUiPrPoint()
    getRadius2.setMessage('\n指定星形的外半径:')
    getRadius2.setUserDraw((pt, pw) => {
        let circle2 = new McDbCircle(center.x, center.y, center.z, pt.distanceTo(center));
        let length1 = circle1.getLength();
        let length2 = circle2.getLength();
        if (!length1 || !length2) return;
        let pointArr: McGePoint3d[] = [];
        for (let i = 0; i < starNum * 2; i++) {
            let point1 = circle1.getPointAtDist(length1.val / (starNum * 2) * i);
            if (!point1.ret) return
            let point2 = circle2.getPointAtDist(length2.val / (starNum * 2) * i);
            if (!point2.ret) return
            if (i % 2 === 0) {
                pointArr.push(point1.val)
            } else {
                pointArr.push(point2.val)
            }
        }
        let pl = new McDbPolyline();
        pointArr.forEach(pt => {
            pl.addVertexAt(pt)
        })
        pl.isClosed = true
        pw.drawMcDbEntity(pl)
        pointsArr = [...pointArr]
    })
    const pt2 = await getRadius2.go()
    if (!pt2) return;
    let mxcad = MxCpp.getCurrentMxCAD();
    let pl = new McDbPolyline();
    pointsArr.forEach(pt => {
        pl.addVertexAt(pt)
    })
    pl.isClosed = true;
    mxcad.drawEntity(pl)
}

// 凹凸线
async function Mx_ConcavoVex() {
    let width = 5;
    const getWidth = new MxCADUiPrDist();
    getWidth.setMessage("\n请输入凹凸线宽度<5>");
    const widthVal = await getWidth.go()
    if (widthVal) {
        width = getWidth.value()
    }

    let height = 10;
    const getHeight = new MxCADUiPrDist();
    getHeight.setMessage("\n请输入凹凸线高度<10>");
    const heightVal = await getHeight.go();
    if (heightVal) {
        height = getHeight.value()
    }

    let getFirstPoint = new MxCADUiPrPoint();
    getFirstPoint.setMessage("请点击确定起始点");
    let firstPoint: any = await getFirstPoint.go();
    if (!firstPoint) return
    let getSecondPoint = new MxCADUiPrPoint();
    getSecondPoint.setMessage("请点击确定终点");
    getSecondPoint.setUserDraw((pt, pw) => {
        let line = new McDbLine(firstPoint.x, firstPoint.y, firstPoint.z, pt.x, pt.y, pt.z);
        pw.drawMcDbEntity(line)
    });
    let secondPoint: any = await getSecondPoint.go();
    if (!secondPoint) return

    /**
     * 根据绘制直线上下偏移，并在两条偏移线上取点
     * 最终用Pl线连接
     */
    let line = new McDbLine(firstPoint.x, firstPoint.y, firstPoint.z, secondPoint.x, secondPoint.y, secondPoint.z);
    let line_clone = line.clone() as McDbLine;
    let length = line.getLength();
    let midPt = line.getPointAtDist(length.val / 2).val;
    let angle = McGeVector3d.kYAxis.angleTo1(McGeVector3d.kXAxis)
    line_clone.rotate(midPt, angle);
    let offPt1 = line_clone.getPointAtDist(length.val / 2 + height / 2).val;
    let offPt2 = line_clone.getPointAtDist(length.val / 2 - height / 2).val;
    let objArr1 = line.offsetCurves(height / 2, offPt1);
    let objArr2 = line.offsetCurves(height / 2, offPt2);
    let mxcad = MxCpp.App.getCurrentMxCAD();
    if (objArr1.length() === 0 || objArr2.length() === 0) return;
    let line_1: McDbLine
    let line_2: McDbLine
    objArr1.forEach((obj: McDbObject) => {
        line_1 = obj.clone() as McDbLine;
    });
    objArr2.forEach((obj: McDbObject) => {
        line_2 = obj.clone() as McDbLine;
    });
    let ptArr: McGePoint3d[] = [];
    let num = length.val / width;
    for (let i = 0; i < num; i++) {
        if (i % 2 === 0) {
            ptArr.push(line_1.getPointAtDist(width * i).val)
            ptArr.push(line_2.getPointAtDist(width * i).val)
        } else {
            ptArr.push(line_2.getPointAtDist(width * i).val)
            ptArr.push(line_1.getPointAtDist(width * i).val)
        }
    }
    let pl = new McDbPolyline;
    ptArr.forEach(pt => {
        pl.addVertexAt(pt)
    })
    let endPt = line.getPointAtDist(width * (parseInt(num.toString()))).val;
    pl.setPointAt(0, line.startPoint);
    pl.setPointAt(ptArr.length - 1, endPt);
    mxcad.drawEntity(pl)

}

// 锯齿线
async function Mx_ZigzagLine() {
    let width = 5;
    const getWidth = new MxCADUiPrDist();
    getWidth.setMessage("\n请输入锯齿线宽度<5>");
    const widthVal = await getWidth.go();
    if (widthVal) {
        width = getWidth.value()
    }

    let height = 10;
    const getHeight = new MxCADUiPrDist();
    getHeight.setMessage("\n请输入锯齿线高度<10>");
    const heightVal = await getHeight.go();
    if (heightVal) {
        height = getHeight.value()
    }

    let getFirstPoint = new MxCADUiPrPoint();
    getFirstPoint.setMessage("请点击确定起始点");
    let firstPoint: any = await getFirstPoint.go();
    if (!firstPoint) return
    let getSecondPoint = new MxCADUiPrPoint();
    getSecondPoint.setMessage("请点击确定终点");
    getSecondPoint.setUserDraw((pt, pw) => {
        let line = new McDbLine(firstPoint.x, firstPoint.y, firstPoint.z, pt.x, pt.y, pt.z);
        pw.drawMcDbEntity(line)
    });
    let secondPoint: any = await getSecondPoint.go();
    if (!secondPoint) return
    let line = new McDbLine(firstPoint.x, firstPoint.y, firstPoint.z, secondPoint.x, secondPoint.y, secondPoint.z);
    let line_clone = line.clone() as McDbLine;
    let length = line.getLength();
    let midPt = line.getPointAtDist(length.val / 2).val;
    let angle = McGeVector3d.kYAxis.angleTo1(McGeVector3d.kXAxis)
    line_clone.rotate(midPt, angle);
    let offPt1 = line_clone.getPointAtDist(length.val / 2 + height / 2).val;
    let offPt2 = line_clone.getPointAtDist(length.val / 2 - height / 2).val;
    let objArr1 = line.offsetCurves(height / 2, offPt1);
    let objArr2 = line.offsetCurves(height / 2, offPt2);
    let mxcad = MxCpp.App.getCurrentMxCAD();
    if (objArr1.length() === 0 || objArr2.length() === 0) return;
    let line_1: McDbLine
    let line_2: McDbLine
    objArr1.forEach((obj: McDbObject) => {
        line_1 = obj.clone() as McDbLine;
    });
    objArr2.forEach((obj: McDbObject) => {
        line_2 = obj.clone() as McDbLine;
    });
    let ptArr: McGePoint3d[] = [];
    let num = length.val / (width / 2);
    for (let i = 0; i < num; i++) {
        if (i % 2 === 0) {
            ptArr.push(line_1.getPointAtDist(width / 2 * i).val)
        } else {
            ptArr.push(line_2.getPointAtDist(width / 2 * i).val)
        }
    }
    let pl = new McDbPolyline;
    ptArr.forEach(pt => {
        pl.addVertexAt(pt)
    })
    let endPt = line.getPointAtDist(width / 2 * (parseInt(num.toString()))).val;
    pl.setPointAt(0, line.startPoint);
    pl.setPointAt(ptArr.length - 1, endPt);
    mxcad.drawEntity(pl)
}

// 中心矩形
async function Mx_CenterRect() {
    let width = 5;
    const getWidth = new MxCADUiPrDist();
    getWidth.setMessage("\n请输入矩形宽度<5>");
    const widthVal = await getWidth.go();
    if (widthVal) {
        width = getWidth.value()
    }

    let height = 10;
    const getHeight = new MxCADUiPrDist();
    getHeight.setMessage("\n请输入矩形高度<10>");
    const heightVal = await getHeight.go();
    if (heightVal) {
        height = getHeight.value()
    }

    const getCenterPt = new MxCADUiPrPoint();
    getCenterPt.setMessage("请点击确定矩形中心");
    const centerPt = await getCenterPt.go();
    if (!centerPt) return;
    let pt1 = new McGePoint3d(centerPt.x + width / 2, centerPt.y + height / 2, centerPt.z)
    let pt2 = new McGePoint3d(centerPt.x - width / 2, centerPt.y + height / 2, centerPt.z)
    let pt3 = new McGePoint3d(centerPt.x - width / 2, centerPt.y - height / 2, centerPt.z)
    let pt4 = new McGePoint3d(centerPt.x + width / 2, centerPt.y - height / 2, centerPt.z)
    let pl = new McDbPolyline;
    pl.addVertexAt(pt1)
    pl.addVertexAt(pt2)
    pl.addVertexAt(pt3)
    pl.addVertexAt(pt4)
    const mxcad = MxCpp.App.getCurrentMxCAD();
    pl.isClosed = true;
    mxcad.drawEntity(pl);
}

// 折断线
async function Mx_BreakLine() {

    let width = 10;
    const getWidth = new MxCADUiPrDist();
    getWidth.setMessage("\n请设置断口宽度<10>");
    const widthVal = await getWidth.go();
    if (widthVal) {
        width = getWidth.value()
    }

    let dist = 5;
    const getDist = new MxCADUiPrDist();
    getDist.setMessage("\n请设置两头延长长度<5>");
    const distVal = await getDist.go();
    if (distVal) {
        dist = getDist.value()
    }

    console.log(dist)
    const getFristPoint = new MxCADUiPrPoint();
    getFristPoint.setMessage("请点击确定起点");
    const pt1 = await getFristPoint.go();
    if (!pt1) return
    const getNextPoint = new MxCADUiPrPoint();
    getNextPoint.setMessage('请点击下一个点');
    getNextPoint.setUserDraw((pt, pw) => {
        const line = new McDbLine(pt1.x, pt1.y, pt1.z, pt.x, pt.y, pt.z);
        pw.drawMcDbEntity(line)
    })
    const pt2 = await getNextPoint.go();
    if (!pt2) return
    const line = new McDbLine(pt1.x, pt1.y, pt1.z, pt2.x, pt2.y, pt2.z);
    const midPt = line.getPointAtDist(line.getLength().val / 2).val;
    let vec = line.getFirstDeriv(midPt);
    let vex_clone = vec.val.clone()
    if (!vec.ret) return;
    vec.val.normalize().mult(width / 2);//转换向量长度 断口宽度
    vex_clone.normalize().mult(dist);//转换向量长度 两头延长长度
    pt1.subvec(vex_clone)
    pt2.addvec(vex_clone)
    let pt3 = midPt.clone();
    pt3.addvec(vec.val);
    let pt4 = midPt.clone();
    pt4.subvec(vec.val);
    let line1 = new McDbLine(midPt.x, midPt.y, midPt.z, pt3.x, pt3.y, pt3.z);
    let angle = McGeVector3d.kXAxis.angleTo1(McGeVector3d.kYAxis);
    let line1_clone = line1.clone() as McDbLine;
    line1_clone.rotate(line1.getPointAtDist(line1.getLength().val / 2).val, angle);
    let pt5 = line1_clone.getPointAtDist(2 * line1_clone.getLength().val).val
    let line2 = new McDbLine(midPt.x, midPt.y, midPt.z, pt4.x, pt4.y, pt4.z);
    let line2_clone = line2.clone() as McDbLine;
    line2_clone.rotate(line2_clone.getPointAtDist(line2_clone.getLength().val / 2).val, angle);
    let pt6 = line2_clone.getPointAtDist(2 * line2_clone.getLength().val).val
    const pl = new McDbPolyline();
    pl.addVertexAt(pt1);
    pl.addVertexAt(pt4);
    pl.addVertexAt(pt6);
    pl.addVertexAt(pt5);
    pl.addVertexAt(pt3);
    pl.addVertexAt(pt2);
    const mxcad = MxCpp.App.getCurrentMxCAD();
    mxcad.drawEntity(pl);
}

// 圆中心线
async function Mx_CCLine() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("CIRCLE");
    let aryId = await MxCADUtility.userSelect("选择目标对象", filter);
    if (aryId.length == 0) {
        return;
    };
    aryId.forEach(async (id) => {
        let event = (await id.getMcDbEntity()) as McDbCircle;
        let center = event.center;
        let radius = event.radius;
        let mxcad = MxCpp.App.getCurrentMxCAD();
        let line1 = new McDbLine(center.x + radius * 1.3, center.y, center.z, center.x - radius * 1.3, center.y, center.z);
        line1.trueColor = new McCmColor(255, 0, 0)
        let line2 = new McDbLine(center.x, center.y + radius * 1.3, center.z, center.x, center.y - radius * 1.3, center.z);
        line2.trueColor = new McCmColor(255, 0, 0);
        mxcad.drawEntity(line1)
        mxcad.drawEntity(line2)
    })
}

// 管道
async function Mx_Piping() {

    let diameter = 10
    const getDiameter = new MxCADUiPrDist();
    getDiameter.setMessage("\n请输入管径<10>");
    const diameterVal = await getDiameter.go();
    if (diameterVal) {
        diameter = getDiameter.value()
    }

    let outLen = 10
    const getOutLen = new MxCADUiPrDist();
    getOutLen.setMessage("\n请输入长出管口长度<5>");
    const outLenVal = await getOutLen.go();
    if (outLenVal) {
        outLen = getOutLen.value()
    }

    let getFristPoint = new MxCADUiPrPoint();
    getFristPoint.setMessage("请点击确定起点");
    const fristPt = await getFristPoint.go();
    if (!fristPt) return;
    const getSecondPoint = new MxCADUiPrPoint();
    getSecondPoint.setMessage("请点击确定终点");
    getSecondPoint.setUserDraw((pt, pw) => {
        const line = new McDbLine(fristPt.x, fristPt.y, fristPt.z, pt.x, pt.y, pt.z);
        pw.drawMcDbEntity(line)
    })
    const secondPt = await getSecondPoint.go();
    if (!secondPt) return

    // 上下偏移取线
    const line = new McDbLine(fristPt.x, fristPt.y, fristPt.z, secondPt.x, secondPt.y, secondPt.z);
    const mxcad = MxCpp.App.getCurrentMxCAD();
    let length = line.getLength().val;
    let startPt = line.getPointAtDist(length + outLen);
    let endPt = line.getPointAtDist(0 - outLen);
    let midPt = line.getPointAtDist(length / 2).val;
    let angle = McGeVector3d.kXAxis.angleTo1(McGeVector3d.kYAxis);
    let line_clone = line.clone() as McDbLine;
    line_clone.rotate(midPt, angle);
    let pt1 = line_clone.getPointAtDist(length / 2 + diameter / 2).val
    let pt2 = line_clone.getPointAtDist(length / 2 - diameter / 2).val
    line.offsetCurves(diameter / 2, pt1).forEach(e => {
        (e as McDbEntity).trueColor = new McCmColor(0, 255, 0)
        mxcad.drawEntity(e as McDbEntity)
    })
    line.offsetCurves(diameter / 2, pt2).forEach(e => {
        (e as McDbEntity).trueColor = new McCmColor(0, 255, 0)
        mxcad.drawEntity(e as McDbEntity)
    })

    // 设置中线的线型
    let lintype = mxcad.addLinetypeEx("TestMyLine", '25,-5');
    if (!lintype.isValid()) return;
    line.linetypeId = lintype;
    line.endPoint = endPt.val;
    line.startPoint = startPt.val;
    line.trueColor = new McCmColor(255, 0, 0);
    mxcad.drawEntity(line);
}

// 剖管符
async function Mx_CutPipeline() {

    const getFirstPoint = new MxCADUiPrPoint();
    getFirstPoint.setMessage('指定剖管线起点');
    const pt1 = await getFirstPoint.go();
    if (!pt1) return
    const getNextPoint = new MxCADUiPrPoint();
    getNextPoint.setMessage('指定剖管线终点');
    getNextPoint.setUserDraw((pt, pw) => {
        let line = new McDbLine(pt1.x, pt1.y, pt1.z, pt.x, pt.y, pt.z);
        pw.drawMcDbEntity(line)
    })
    const pt2 = await getNextPoint.go();
    if (!pt2) return;
    const line = new McDbLine(pt1.x, pt1.y, pt1.z, pt2.x, pt2.y, pt2.z);
    const length = line.getLength().val;
    const dist = length / 8;
    const midPt = line.getPointAtDist(length / 2).val;
    const line_clone = line.clone() as McDbLine;
    line_clone.rotate(midPt, Math.PI / 2);
    const offPt1 = line_clone.getPointAtDist(length / 2 + dist).val;
    const offPt2 = line_clone.getPointAtDist(length / 2 - dist).val;
    const mxcad = MxCpp.App.getCurrentMxCAD();
    let line_1: McDbLine
    (line.clone() as McDbLine).offsetCurves(dist, offPt1).forEach(event => {
        line_1 = event as McDbLine;
    })//偏移距离，偏移点
    let line_2: any
    (line.clone() as McDbLine).offsetCurves(dist, offPt2).forEach(event => {
        line_2 = event as McDbLine;
    })//偏移距离，偏移点
    const pointArr1: McGePoint3d[] = [];
    const pointArr2: McGePoint3d[] = [];
    for (let i = 0; i < 4; i++) {
        if (i % 2 !== 0) {
            pointArr1.push(line_1.getPointAtDist(i * dist * 2).val)
            pointArr2.push(line_2.getPointAtDist(i * dist * 2).val)
        }
    }
    let objectId: McObjectId
    let arc1 = new McDbArc()
    arc1.computeArc(pt1.x, pt1.y, pointArr1[0].x, pointArr1[0].y, midPt.x, midPt.y);
    mxcad.drawEntity(arc1);
    let arc2 = new McDbArc()
    arc2.computeArc(pt1.x, pt1.y, pointArr2[0].x, pointArr2[0].y, midPt.x, midPt.y);
    mxcad.drawEntity(arc2)
    let arc3 = new McDbArc()
    arc3.computeArc(midPt.x, midPt.y, pointArr2[1].x, pointArr2[1].y, pt2.x, pt2.y);
    objectId = mxcad.drawEntity(arc3)
    let getKey = new MxCADUiPrKeyWord;
    while (true) {
        getKey.setMessage("选择剖管线圆弧方向")
        getKey.setKeyWords("[左边(L)/右边(R)]")
        const keyWord = await getKey.go();
        if (!keyWord) return;
        if (keyWord == 'L') {
            let arc3 = new McDbArc()
            objectId.erase();
            arc3.computeArc(midPt.x, midPt.y, pointArr2[1].x, pointArr2[1].y, pt2.x, pt2.y);
            objectId = mxcad.drawEntity(arc3)
        } else if (keyWord == 'R') {
            objectId.erase();
            let arc3 = new McDbArc()
            arc3.computeArc(midPt.x, midPt.y, pointArr1[1].x, pointArr1[1].y, pt2.x, pt2.y);
            objectId = mxcad.drawEntity(arc3);
        }
    }
}

// 焊缝线
async function Mx_WelLine() {
    // 选择模式
    const getKeyWord = new MxCADUiPrKeyWord();
    getKeyWord.setMessage("选择模式");
    getKeyWord.setKeyWords("[直线焊缝(L)/弧线焊缝(A)]");
    const keyWord = await getKeyWord.go();
    if (!keyWord) return;

    // 获取焊缝半径
    let radius = 5;
    const getRadius = new MxCADUiPrDist();
    getRadius.setMessage("\n请输入焊缝半径<5>");
    const radiusVal = await getRadius.go();
    if (radiusVal) {
        radius = getRadius.value()
    }

    // 根据选择模式绘制曲线
    let curve = new McDbCurve()
    if (keyWord === 'L') {
        let getFirstPoint = new MxCADUiPrPoint();
        getFirstPoint.setMessage("请点击确定起始点");
        let firstPoint: any = await getFirstPoint.go();
        if (!firstPoint) return;
        let getSecondPoint = new MxCADUiPrPoint();
        getSecondPoint.setMessage("请点击确定终点");
        getSecondPoint.setUserDraw((pt, pw) => {
            let line = new McDbLine(firstPoint.x, firstPoint.y, firstPoint.z, pt.x, pt.y, pt.z);
            pw.drawMcDbEntity(line)
        });
        let secondPoint = await getSecondPoint.go();
        if (!secondPoint) return
        curve = new McDbLine(firstPoint.x, firstPoint.y, firstPoint.z, secondPoint.x, secondPoint.y, secondPoint.z);
    } else if (keyWord === 'A') {
        let getFristPoint = new MxCADUiPrPoint();
        getFristPoint.setMessage('指定起点');
        let fristPoint = (await getFristPoint.go()) as McGePoint3d;
        if (!fristPoint) return
        let getSecondPoint = new MxCADUiPrPoint();
        getSecondPoint.setMessage('指定圆弧的第二个点')
        getSecondPoint.setUserDraw((pt, pw) => {
            pw.drawLine(fristPoint.toVector3(), pt.toVector3())
        })
        let secondPoint = await getSecondPoint.go();
        if (!secondPoint) return;
        let getThirdPoint = new MxCADUiPrPoint();
        getThirdPoint.setMessage('指定圆弧的端点')
        getThirdPoint.setUserDraw((pt, pw) => {
            let arc = new McDbArc();
            arc.computeArc(fristPoint.x, fristPoint.y, secondPoint.x, secondPoint.y, pt.x, pt.y);//三点画圆弧
            pw.drawMcDbEntity(arc)
        });
        let thirdPoint = await getThirdPoint.go();
        if (!thirdPoint) return
        let arc = new McDbArc();
        arc.computeArc(fristPoint.x, fristPoint.y, secondPoint.x, secondPoint.y, thirdPoint.x, thirdPoint.y);//三点画圆弧
        curve = arc;
    }

    // 将曲线转化为焊缝线
    const mxcad = MxCpp.App.getCurrentMxCAD()
    let length = curve.getLength().val;
    let num = length / radius;
    let arcArr: McDbCurve[] = [];
    let center: McGePoint3d;
    let r: number;
    if (keyWord === 'A') {
        center = (curve as McDbArc).center;
        r = (curve as McDbArc).radius;
    }
    for (let i = 0; i < num; i++) {
        let pt = curve.getPointAtDist(radius * i).val;
        let circle = new McDbCircle(pt.x, pt.y, pt.z, radius);
        const intPts = circle.IntersectWith(curve, McDb.Intersect.kExtendBoth);
        if (!intPts.length()) return;
        let ptArr: McGePoint3d[] = [];
        intPts.forEach(pt => { ptArr.push(pt) });
        // 如果是圆弧模式,取远离圆心的那一段圆弧;
        let mergeArr: McDbCurve[] = [];
        let res: McDbCurve[] = [];
        circle.splitCurves(ptArr).forEach((obj: McDbCurve, index: number) => {
            if (keyWord === 'L') {
                if (index % 2 !== 0) {
                    arcArr.push(obj)
                }
            } else if (keyWord === 'A') {
                let c = obj.clone() as McDbCurve;
                let midPt = c.getPointAtDist(c.getLength().val / 2).val;
                if (midPt.distanceTo(center) > r) {
                    mergeArr.push(c);
                } else {
                    res.push(c)
                }
            }
        });
        if (mergeArr.length === 1 && keyWord === 'A') {
            arcArr.push(mergeArr[0]);
        } else if (keyWord === 'A' && mergeArr.length > 1) {
            res[0].rotate(circle.center, Math.PI);
            arcArr.push(res[0])
        }
    }
    arcArr.forEach((item, index) => {
        if (index === 0) {
            mxcad.drawEntity(item)
        } else {
            let intPts = item.IntersectWith(arcArr[index - 1], McDb.Intersect.kExtendThis);
            if (intPts.length() === 0) return;
            let arr: McGePoint3d[] = [];
            intPts.forEach(pt => { arr.push(pt) });
            let objArr = []
            item.splitCurves(arr).forEach((obj: McDbCurve, index: number) => {
                objArr.push({ obj_cur: obj, lenth: obj.getLength().val })
            })
            let lengthArr = objArr.map(item => item.lenth)
            mxcad.drawEntity(objArr[lengthArr.indexOf(Math.max(...lengthArr))].obj_cur)
        }
    })

}

// 中垂线
async function Mx_PerpLine() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LINE,LWPOLYLINE");
    let aryId = await MxCADUtility.userSelect("选择对象", filter);
    if (aryId.length == 0) {
        return;
    };
    aryId.forEach(async (id) => {
        let event = await id.getMcDbEntity();
        if (!event) return
        let line = (event.clone()) as McDbLine
        let dist = line.getLength();
        let minPt = line.getPointAtDist(dist.val / 2).val;
        let vec = line.getFirstDeriv(minPt);
        if (!vec.ret) return;
        let angle1 = McGeVector3d.kYAxis.angleTo1(McGeVector3d.kXAxis);
        line.rotate(minPt, angle1)
        let mxcad = MxCpp.App.getCurrentMxCAD();
        line.trueColor = new McCmColor(255, 0, 0);
        mxcad.drawEntity(line)
    })
}

// 楼梯
async function Mx_StairLine() {
    let width = 25;
    const getWidth = new MxCADUiPrDist();
    getWidth.setMessage("请输入宽度<25>");
    const widthval = await getWidth.go();
    if (widthval) {
        width = getWidth.value()
    }

    let height = 15;
    const getHeight = new MxCADUiPrDist();
    getHeight.setMessage("请输入高度<15>");
    const heightVal = await getHeight.go();
    if (heightVal) {
        height = getHeight.value()
    }

    const getNum = new MxCADUiPrInt();
    getNum.setMessage("请输入楼梯级数<10>");
    const num = await getNum.go() || 10;

    const l = Math.sqrt(width * width + height * height);
    const getFristPoint = new MxCADUiPrPoint();
    getFristPoint.setMessage("请点击确定起点");
    const fristPt = await getFristPoint.go();
    if (!fristPt) return;
    const getSecondPoint = new MxCADUiPrPoint();
    getSecondPoint.setMessage("请点击确定终点");
    getSecondPoint.setUserDraw((pt, pw) => {
        const line = new McDbLine(fristPt.x, fristPt.y, fristPt.z, pt.x, pt.y, pt.z);
        pw.drawMcDbEntity(line)
    })
    const secondPt = await getSecondPoint.go();
    if (!secondPt) return
    const line = new McDbLine(fristPt.x, fristPt.y, fristPt.z, secondPt.x, secondPt.y, secondPt.z);
    const pointArr: McGePoint3d[] = []
    for (let i = 0; i < num + 1; i++) {
        let pt = line.getPointAtDist(l * i).val;
        pointArr.push(pt);
    }
    const pl = new McDbPolyline;
    pointArr.forEach((pt, index) => {
        pl.addVertexAt(pt)
        if (index != pointArr.length - 1) {
            let nextPt = new McGePoint3d(pt.x, pointArr[index + 1].y, pt.z)
            pl.addVertexAt(nextPt)
        }
    })
    const mxcad = MxCpp.App.getCurrentMxCAD();
    mxcad.drawEntity(pl)
}

// 实心圆
async function Mx_SolidCircle() {
    const getCenter = new MxCADUiPrPoint();
    getCenter.setMessage('请确定圆心位置\n');
    const center = await getCenter.go();
    if (!center) return;
    const getRadius = new MxCADUiPrDist();
    getRadius.setBasePt(center);
    getRadius.setMessage('请输入圆半径');
    getRadius.setUserDraw((pt, pw) => {
        const r = pt.distanceTo(center);
        const circle = new McDbCircle();
        circle.center = center;
        circle.radius = r;
        pw.drawMcDbEntity(circle)
    })
    const radiusVal = await getRadius.go();
    if (!radiusVal) return;
    const radius = getRadius.value();
    const mxcad = MxCpp.getCurrentMxCAD();
    mxcad.pathCircle(center.x, center.y, radius);
    mxcad.drawPathToHatch();
}

// 保温棉
async function Mx_CottonInsulation() {
    let width = 5;
    const getWidth = new MxCADUiPrDist();
    getWidth.setMessage("\n请输入保温棉宽度<5>");
    const widthVal = await getWidth.go();
    if (widthVal) {
        width = getWidth.value()
    }

    let height = 10;
    const getHeight = new MxCADUiPrDist();
    getHeight.setMessage("\n请输入保温棉高度<10>");
    const heightVal = await getHeight.go();
    if (heightVal) {
        height = getHeight.value()
    }
    const getFristPoint = new MxCADUiPrPoint();
    getFristPoint.setMessage("请点击确定起点");
    const fristPt = await getFristPoint.go();
    if (!fristPt) return
    const getNextPoint = new MxCADUiPrPoint();
    getNextPoint.setMessage('请点击下一个点');
    getNextPoint.setUserDraw((pt, pw) => {
        const line = new McDbLine(fristPt.x, fristPt.y, fristPt.z, pt.x, pt.y, pt.z);
        pw.drawMcDbEntity(line)
    })
    const nextPt = await getNextPoint.go();
    if (!nextPt) return
    const line = new McDbLine(fristPt.x, fristPt.y, fristPt.z, nextPt.x, nextPt.y, nextPt.z);
    if (fristPt.y < nextPt.y) {
        line.startPoint = new McGePoint3d(nextPt.x, nextPt.y, nextPt.z);
        line.endPoint = new McGePoint3d(fristPt.x, fristPt.y, fristPt.z);;
    }
    const midPt = line.getPointAtDist(line.getLength().val / 2).val;
    const line_clone = line.clone() as McDbLine;
    line_clone.rotate(midPt, Math.PI / 2);
    const pt1 = line_clone.getPointAtDist(line.getLength().val / 2 + height / 2).val;
    const pt2 = line_clone.getPointAtDist(line.getLength().val / 2 - height / 2).val;
    let line1: any;
    let line2: any;
    line.offsetCurves(height / 2, pt1).forEach(e => {
        line1 = e;
    })
    line.offsetCurves(height / 2, pt2).forEach(e => {
        line2 = e;
    })
    let num = line.getLength().val / width * 2;
    let ptArr: McGePoint3d[] = [];
    let center1: McGePoint3d[] = [];
    let center2: McGePoint3d[] = [];
    for (let i = 0; i < num; i++) {
        if (i % 2 == 0) {
            let pt = line2.getPointAtDist(i * (width / 2)).val;
            let center = line1.getPointAtDist(i * (width / 2)).val;
            center1.push(center);
            ptArr.push(pt);
        } else {
            let pt = line1.getPointAtDist(i * (width / 2)).val;
            let center = line2.getPointAtDist(i * (width / 2)).val;
            center2.push(center);
            ptArr.push(pt);
        }
    };
    const pl = new McDbPolyline();
    ptArr.forEach(pt => {
        pl.addVertexAt(pt)
    })
    const mxcad = MxCpp.App.getCurrentMxCAD();
    mxcad.drawEntity(pl);
    center1.forEach(pt => {
        const arc = new McDbArc();
        arc.center = pt;
        arc.radius = width / 2;
        arc.startAngle = -(new McGeVector3d(line.endPoint.x - line.startPoint.x, line.endPoint.y - line.startPoint.y)).angleTo1(McGeVector3d.kXAxis);
        arc.endAngle = (new McGeVector3d(line.startPoint.x - line.endPoint.x, line.startPoint.y - line.endPoint.y)).angleTo1(McGeVector3d.kXAxis);
        mxcad.drawEntity(arc);
    })
    center2.forEach(pt => {
        const arc = new McDbArc();
        arc.center = pt;
        arc.radius = width / 2;
        arc.startAngle = (new McGeVector3d(line.startPoint.x - line.endPoint.x, line.startPoint.y - line.endPoint.y)).angleTo1(McGeVector3d.kXAxis);
        arc.endAngle = -(new McGeVector3d(line.endPoint.x - line.startPoint.x, line.endPoint.y - line.startPoint.y)).angleTo1(McGeVector3d.kXAxis);
        mxcad.drawEntity(arc)
    })
}

// 中心线
async function Mx_CenterLine() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LINE");
    const obj1 = new MxCADUiPrEntity();
    obj1.setFilter(filter);
    obj1.setMessage("请选择第一条线");
    const line1_id = await obj1.go();
    if (!line1_id.id) return;
    const line1 = line1_id.getMcDbEntity() as McDbLine;
    const line1_clone = new McDbLine(line1.startPoint, line1.endPoint)


    const obj2 = new MxCADUiPrEntity();
    obj2.setFilter(filter);
    obj2.setMessage("请选择第二条线");
    const line2_id = await obj2.go();
    if (!line2_id.id) return;
    const line2 = line2_id.getMcDbEntity() as McDbLine;
    const line2_clone = new McDbLine(line2.startPoint, line2.endPoint)

    const mxcad = MxCpp.getCurrentMxCAD();
    let points = line1.IntersectWith(line2_clone, McDb.Intersect.kExtendBoth);
    console.log(points.length())
    if (points.length() === 0) {
        /**
         * 若两条线段平行，选最短的一条线段旋转90度与另一条直线相交
         * 得到两条直线间距离dist
         * 最短的直线偏移 1/2dist
         */
        const l1 = line1.getLength().val > line2.getLength().val ? line2.clone() as McDbLine : line1.clone() as McDbLine;
        const l2 = line1.getLength().val > line2.getLength().val ? line1_clone : line2_clone;
        const l_clone = l1.clone() as McDbLine;
        const midPt = l1.getPointAtDist(l1.getLength().val / 2).val
        l1.rotate(midPt, Math.PI / 2);
        points = l1.IntersectWith(l2, McDb.Intersect.kExtendBoth);
        if (!points.length()) return;
        // 偏移距离
        const offDist = points.at(0).distanceTo(midPt) / 2;
        l_clone.offsetCurves(offDist, points.at(0)).forEach((obj: McDbEntity) => {
            obj.trueColor = new McCmColor(255, 0, 0);
            mxcad.drawEntity(obj);
        })
    } else {
        // 若两条线段相交，中心线即为两条直线的角平分线
        /**
         * 求两直线交点，短直线长为圆半径画圆
         * 若两条直线已经相交，取长度长的那一边做角平分线
         */
        const circle = new McDbCircle();
        let radius: number;
        let event: McDbLine;
        let dist_1 = line1_clone.endPoint.distanceTo(points.at(0));
        let dist_2 = line1_clone.startPoint.distanceTo(points.at(0));
        if (dist_1 !== 0 && dist_2 !== 0) {
            if (dist_1 > dist_2) {
                line1_clone.startPoint = points.at(0);
            } else {
                line1_clone.endPoint = points.at(0);
            }
        }
        let dist_3 = line2_clone.endPoint.distanceTo(points.at(0));
        let dist_4 = line2_clone.startPoint.distanceTo(points.at(0));
        if (dist_3 !== 0 && dist_4 !== 0) {
            if (dist_4 > dist_3) {
                line2_clone.startPoint = points.at(0);
            } else {
                line2_clone.endPoint = points.at(0);
            }
        }
        if (line1_clone.getLength().val > line2_clone.getLength().val) {
            radius = line2_clone.getLength().val;
            event = new McDbLine(line2.startPoint, line2_clone.endPoint);
        } else {
            radius = line1.getLength().val;
            event = new McDbLine(line1_clone.startPoint, line1_clone.endPoint);
        }

        circle.center = points.at(0);
        circle.radius = radius;

        /**
         * 圆与直线交点形成的圆弧中点与直线交点即为角平分线
         */
        let pt1 = circle.IntersectWith(line1_clone, McDb.Intersect.kOnBothOperands);
        let pt2 = circle.IntersectWith(line2_clone, McDb.Intersect.kOnBothOperands);
        if (!pt1.length() || !pt2.length()) return;
        let startAngle = pt1.at(0).sub(points.at(0)).angleTo2(McGeVector3d.kXAxis)
        let endAngle = pt2.at(0).sub(points.at(0)).angleTo2(McGeVector3d.kXAxis)
        let arc = new McDbArc();
        arc.center = points.at(0);
        arc.radius = radius;
        arc.startAngle = startAngle;
        arc.endAngle = endAngle;
        const pt = arc.getPointAtDist(arc.getLength().val / 2).val
        const centerLine = new McDbLine(points.at(0), pt);

        const getPt = new MxCADUiPrPoint();
        getPt.setMessage("请选择终点");
        getPt.setUserDraw((pt, pw) => {
            let p = centerLine.getClosestPointTo(pt, true).val;
            let _clone = centerLine.clone() as McDbLine;
            _clone.endPoint = p;
            pw.drawMcDbEntity(_clone)
        });
        const point = await getPt.go();
        if (!point) return;
        centerLine.endPoint = centerLine.getClosestPointTo(point, true).val;
        centerLine.trueColor = new McCmColor(255, 0, 0);
        mxcad.drawEntity(centerLine)
    }
}

// 开洞
/**
 * 选中矩形
 * 将离鼠标点设为最近的顶点index
 */
async function Mx_DoHole() {
    // 获取目标矩形
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LWPOLYLINE");
    const getObj = new MxCADUiPrEntity();
    getObj.setFilter(filter);
    getObj.setMessage("请选择目标矩形");
    const rect_id = await getObj.go();
    if (!rect_id.id) return;

    // 遍历回去顶点
    const rect = rect_id.getMcDbEntity() as McDbPolyline;
    let pointsArr: McGePoint3d[] = []
    const num: number = rect.numVerts()
    for (let i = 0; i < num; i++) {
        pointsArr.push(rect.getPointAt(i).val)
    }

    // 获取最近顶点
    const getPoint = new MxCADUiPrPoint()
    let index: number;
    getPoint.setUserDraw((pt, pw) => {
        let disArr: number[] = []
        pointsArr.forEach(point => {
            disArr.push(point.distanceTo(pt))
        })
        index = disArr.findIndex(value => value === Math.min(...disArr))
        let obj_clone = rect.clone() as McDbPolyline
        obj_clone.setPointAt(index, pt)
        pw.drawMcDbEntity(obj_clone)
    })
    const point = await getPoint.go()
    if (!point) return
    let obj_clone = rect.clone() as McDbPolyline
    obj_clone.setPointAt(index, point)
    MxCpp.getCurrentMxCAD().drawEntity(obj_clone);
}

// 指北针
async function Mx_Compass() {
    const getCenter = new MxCADUiPrPoint();
    getCenter.setMessage('设置指北针中心点');
    const center = await getCenter.go();
    if (!center) return;

    // 获取指北针半径
    const getRadius = new MxCADUiPrDist();
    getRadius.setMessage('设置指北针半径');
    getRadius.setBasePt(center);
    getRadius.setUserDraw((pt, pw) => {
        const r = pt.distanceTo(center);
        pw.drawCircle(center.toVector3(), r);
    })
    const radiusVal = await getRadius.go();
    if (!radiusVal) return;
    const radius = getRadius.value();

    // 圆盘
    const mxcad = MxCpp.App.getCurrentMxCAD();
    const cricle = new McDbCircle();
    cricle.trueColor = new McCmColor(0, 255, 0)
    cricle.center = center;
    cricle.radius = radius;
    mxcad.drawEntity(cricle);

    // 指针
    const pt1 = new McGePoint3d(center.x, center.y + radius);
    const pt2 = new McGePoint3d(center.x, center.y - radius);
    const line = new McDbLine();
    line.startPoint = pt1;
    line.endPoint = pt2;
    const line_clone1 = line.clone() as McDbLine;
    line_clone1.rotate(pt1, Math.PI / 30);
    const line_clone2 = line.clone() as McDbLine;
    line_clone2.rotate(pt1, -Math.PI / 30);
    let pt3: McGePoint3d;
    let pt4: McGePoint3d;
    line_clone1.IntersectWith(cricle, McDb.Intersect.kOnBothOperands).forEach(pt => {
        if (pt.x !== pt1.x && pt.y !== pt1.y) {
            pt3 = pt
        }
    })
    line_clone2.IntersectWith(cricle, McDb.Intersect.kOnBothOperands).forEach(pt => {
        if (pt.x !== pt1.x && pt.y !== pt1.y) {
            pt4 = pt
        }
    })
    let dBulge = MxCADUtility.calcBulge(pt3, pt2, pt4)
    mxcad.pathMoveToEx(pt3.x, pt3.y, 0, 0, dBulge.val);
    //路径的一下个点
    mxcad.pathLineTo(pt4.x, pt4.y);
    //路径的一下个点
    mxcad.pathLineTo(pt1.x, pt1.y);
    //路径的一下个点
    mxcad.pathLineTo(pt3.x, pt3.y);
    mxcad.drawColor = new McCmColor(25, 255, 0);
    //把路径变成一个填充
    mxcad.drawPathToHatch(1);
    const text = new McDbText();
    text.height = radius / 3;
    text.position = new McGePoint3d(center.x, center.y + radius * 1.2);
    text.alignmentPoint = text.position;
    text.textString = 'N';
    text.horizontalMode = McDb.TextHorzMode.kTextMid;
    text.trueColor = new McCmColor(25, 255, 0);
    mxcad.drawEntity(text)
}

// 提示框
async function Mx_MassegeBox() {

    // 选择提示框指向
    const getType = new MxCADUiPrKeyWord();
    getType.setMessage('选择提示框指向');
    getType.setKeyWords('[向上(U)/向下(D)]');
    const keyWord = await getType.go();
    if (!keyWord) return;

    // 绘制方框
    const getPoint = new MxCADUiPrPoint();
    let drawColor = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
    getPoint.setMessage("\n指定消息框第一点:");
    let pt1 = await getPoint.go();
    if (!pt1) {
        return;
    }
    let mxcad = MxCpp.getCurrentMxCAD();
    let rect = new MxDbRect();
    rect.pt1 = pt1.toVector3();
    // 在点取第二点时，设置动态绘制矩形
    getPoint.setUserDraw((currentPoint: McGePoint3d, worldDraw) => {
        rect.pt2 = currentPoint.toVector3();
        rect.setColor(drawColor);
        worldDraw.drawCustomEntity(rect);
    });
    getPoint.setMessage("\n指定消息框第二点:");
    getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
    let pt2 = await getPoint.go();
    if (!pt2) {
        return;
    }
    rect.pt2 = pt2.toVector3();

    // 根据绘制方向确定指向点
    let pl = new McDbPolyline();
    pl.isClosed = true;
    let line: McDbLine;
    if ((pt1.y > pt2.y && keyWord === 'U') || (pt1.y < pt2.y && keyWord === 'D')) {
        line = new McDbLine(pt1, new McGePoint3d(pt2.x, pt1.y));
        pl.addVertexAt(new McGePoint3d(pt2.x, pt1.y));
        pl.addVertexAt(pt2);
        pl.addVertexAt(new McGePoint3d(pt1.x, pt2.y));
        pl.addVertexAt(pt1);
    } else if ((pt1.y > pt2.y && keyWord === 'D') || (pt1.y < pt2.y && keyWord === 'U')) {
        line = new McDbLine(pt2, new McGePoint3d(pt1.x, pt2.y));
        pl.addVertexAt(new McGePoint3d(pt1.x, pt2.y));
        pl.addVertexAt(pt1);
        pl.addVertexAt(new McGePoint3d(pt2.x, pt1.y));
        pl.addVertexAt(pt2);
    }
    const dist = pt1.distanceTo(pt2) / 6 //指向缺口，可自定义
    const p1 = line.getPointAtDist(dist).val;
    const p2 = line.getPointAtDist(line.getLength().val - dist).val;
    line.startPoint = p1;
    line.endPoint = p2;
    const getEndPoint = new MxCADUiPrPoint();
    getEndPoint.setMessage("\n设置消息框指向:");

    let pt3, pt4: McGePoint3d
    getEndPoint.setUserDraw((pt, pw) => {
        const closePt = line.getClosestPointTo(pt, false).val;
        let vec = pl.getFirstDeriv(closePt);
        if (!vec.ret) return;
        vec.val.normalize().mult(dist / 4);
        pt3 = closePt.clone();
        pt3.addvec(vec.val);
        pt4 = closePt.clone();
        pt4.subvec(vec.val);
        let _clone = pl.clone() as McDbPolyline;
        _clone.addVertexAt(pt4);
        _clone.addVertexAt(pt);
        _clone.addVertexAt(pt3);
        pw.drawMcDbEntity(_clone)
    })
    let endPt = await getEndPoint.go();
    if (!endPt) return;
    pl.addVertexAt(pt4);
    pl.addVertexAt(endPt);
    pl.addVertexAt(pt3);
    mxcad.drawEntity(pl);
}

// 基准符
async function Mx_DatumSymbol() {

    const getString = new MxCADUiPrString;
    getString.setMessage("请设置基准符文字");
    const str = await getString.go();
    if (!str) return;

    const getDist = new MxCADUiPrDist();
    getDist.setMessage("请设置文字高度");
    const heightVal = await getDist.go();
    if (!heightVal) return;
    const height = getDist.value();

    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("请设置基准符位置");

    const mxcad = MxCpp.getCurrentMxCAD();

    let blkRef = new McDbBlockReference();

    getPoint.setUserDraw((pt, pw) => {
        // 基线
        const baseLine = new McDbPolyline();
        baseLine.addVertexAt(new McGePoint3d(pt.x + height, pt.y, 0), 0, 2, 2);
        baseLine.addVertexAt(new McGePoint3d(pt.x - height, pt.y, 0));
        // 竖线
        const line = new McDbLine(pt, new McGePoint3d(pt.x, pt.y + height * (8 / 7), 0));
        const circle = new McDbCircle();
        circle.center = new McGePoint3d(pt.x, pt.y + height * (15 / 7), 0);
        circle.radius = height;
        // 文字
        const text = new McDbText();
        text.textString = str;
        text.height = height;
        text.position = text.alignmentPoint = new McGePoint3d(pt.x, pt.y + height * (25 / 14), 0);
        text.horizontalMode = McDb.TextHorzMode.kTextMid;
        // 整装成块
        let blkTable = mxcad.getDatabase().getBlockTable();
        let blkRecId = blkTable.add(new McDbBlockTableRecord());//图块记录
        let blkTableRecord: McDbBlockTableRecord = blkRecId.getMcDbBlockTableRecord() as any;
        if (blkTableRecord == null) return;

        blkTableRecord.appendAcDbEntity(baseLine);
        blkTableRecord.appendAcDbEntity(line);
        blkTableRecord.appendAcDbEntity(circle);
        blkTableRecord.appendAcDbEntity(text);
        blkTableRecord.name = '基准符'

        blkTableRecord.origin = pt;
        blkRef.blockTableRecordId = blkRecId;
        blkRef.position = pt;
        pw.drawMcDbEntity(blkRef)
    })
    const pt = await getPoint.go();
    if (!pt) return;
    mxcad.drawEntity(blkRef);
}

export function init() {
    MxFun.addCommand("Mx_DrawStart", Mx_DrawStart);
    MxFun.addCommand("Mx_ConcavoVex", Mx_ConcavoVex);
    MxFun.addCommand("Mx_ZigzagLine", Mx_ZigzagLine);
    MxFun.addCommand("Mx_CenterRect", Mx_CenterRect);
    MxFun.addCommand("Mx_BreakLine", Mx_BreakLine);
    MxFun.addCommand("Mx_CCLine", Mx_CCLine);
    MxFun.addCommand("Mx_Piping", Mx_Piping);
    MxFun.addCommand("Mx_CutPipeline", Mx_CutPipeline);
    MxFun.addCommand("Mx_WelLine", Mx_WelLine);
    MxFun.addCommand("Mx_PerpLine", Mx_PerpLine);
    MxFun.addCommand("Mx_StairLine", Mx_StairLine);
    MxFun.addCommand("Mx_SolidCircle", Mx_SolidCircle);
    MxFun.addCommand("Mx_CottonInsulation", Mx_CottonInsulation);
    MxFun.addCommand("Mx_CenterLine", Mx_CenterLine);
    MxFun.addCommand("Mx_DoHole", Mx_DoHole);
    MxFun.addCommand("Mx_Compass", Mx_Compass);
    MxFun.addCommand("Mx_MassegeBox", Mx_MassegeBox);
    MxFun.addCommand("Mx_DatumSymbol", Mx_DatumSymbol);
}
