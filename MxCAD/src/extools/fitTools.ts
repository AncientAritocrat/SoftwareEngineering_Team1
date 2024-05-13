///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import { MxFun, MrxDbgUiPrBaseReturn, MxDbRect, DynamicInputType } from "mxdraw";
import {
    MxCpp, MxCADSelectionSet, MxCADUiPrPoint, MxCADUiPrInt, McDbEntity,
    MxCADResbuf, McGePoint3d, McGeMatrix3d, MxCADUtility, McDbArc, McDbCircle,
    McObjectId, MxCADUiPrAngle, McGeVector3d, McDbPolyline, McCmColor, McDbLine,
    McDb, McDbCurve, MxCADUiPrEntity, McDbObject, MxCADUiPrDist, MxCADUiPrKeyWord,
    MxCADUiPrString, McDbHatch
} from "mxcad";
// 多重复制
async function Mx_Multicopy() {
    // 选择集选择多重复制对象
    let ss = new MxCADSelectionSet();
    if (!await ss.userSelect("选择对象:")) return;
    if (ss.count() == 0) return;

    const objIds = [];
    const mxcad = MxCpp.getCurrentMxCAD();
    const getBasePt = new MxCADUiPrPoint();
    getBasePt.setMessage('指定基点');
    const basePt = await getBasePt.go();
    if (!basePt) return;
    while (true) {
        const getNextPt = new MxCADUiPrPoint();
        getNextPt.setMessage('指定第二个点\n');
        // 设置关键字列表
        if (objIds.length > 0) {
            getNextPt.setKeyWords('[阵列(A)/退出(E)/放弃(U)]');
        } else {
            getNextPt.setKeyWords('[阵列(A)/退出(E)]');
        }
        // 动态绘制
        getNextPt.setUserDraw((pt, pw) => {
            pw.drawLine(pt.toVector3(), basePt.toVector3())
            ss.forEach((id) => {
                let ent = id.getMcDbEntity();
                if (!ent) return;
                let ent_clone = ent.clone() as McDbEntity;
                ent_clone.move(basePt, pt);
                pw.drawMcDbEntity(ent_clone);
            })
        })
        const nextPt = await getNextPt.go();
        // 根据用户输入状态进行对应操作
        if (getNextPt.getStatus() === MrxDbgUiPrBaseReturn.kKeyWord) {
            // 输入关键字
            if (getNextPt.isKeyWordPicked("E")) {
                // 退出
                return;
            } else if (getNextPt.isKeyWordPicked("U")) {
                // 放弃、撤回
                if (objIds.length > 0) {
                    objIds[objIds.length - 1].forEach(id => {
                        id.erase()
                    });
                    objIds.pop();
                } else {
                    return;
                }
            } else if (getNextPt.isKeyWordPicked("A")) {
                // 阵列 即对目标对象多次平移
                const getNum = new MxCADUiPrInt();
                getNum.clearLastInputPoint()
                getNum.setMessage('输入要进行阵列的项目数\n');
                const num = await getNum.go() || 1;
                let arr: McGePoint3d[] = []
                getNextPt.setUserDraw((pt, pw) => {
                    pw.drawLine(pt.toVector3(), basePt.toVector3())
                    arr.length = 0;
                    let lastPt = pt.clone()
                    arr.push(lastPt)
                    for (let i = 0; i < num - 1; i++) {
                        lastPt = lastPt.clone().addvec(pt.sub(basePt))
                        arr.push(lastPt)
                    }
                    ss.forEach((id) => {
                        let ent = id.getMcDbEntity();
                        if (!ent) return;
                        arr.forEach(item => {
                            let matrix = new McGeMatrix3d();
                            let event_clone = ent.clone() as McDbEntity;
                            matrix.clone();
                            matrix.setToTranslation(item.sub(basePt));//平移
                            event_clone.transformBy(matrix);
                            pw.drawMcDbEntity(event_clone);
                        })
                    })
                })
                let nextPt = await getNextPt.go();
                if (!nextPt) return;
                objIds.push([])
                ss.forEach((id) => {
                    let ent = id.getMcDbEntity();
                    if (!ent) return;
                    arr.forEach(item => {
                        let matrix = new McGeMatrix3d();
                        let event_clone = ent.clone() as McDbEntity;
                        matrix.clone();
                        matrix.setToTranslation(item.sub(basePt));//平移
                        event_clone.transformBy(matrix);
                        objIds[objIds.length - 1].push(mxcad.drawEntity(event_clone));
                    })
                })
            }
        } else if (getNextPt.getStatus() === MrxDbgUiPrBaseReturn.kOk) {
            // 未输入关键字
            if (!nextPt) return
            objIds.push([])
            ss.forEach((id) => {
                let ent = id.getMcDbEntity();
                if (!ent) return;
                let ent_clone = ent.clone() as McDbEntity;
                ent_clone.move(basePt, nextPt);
                objIds[objIds.length - 1].push(mxcad.drawEntity(ent_clone))
            })
        } else {
            return
        }
    }

}

// 弧转圆
async function Mx_ArcToCircle() {
    // 筛选圆弧
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("ARC");
    let aryId = await MxCADUtility.userSelect("选择圆弧对象", filter);
    if (aryId.length == 0) {
        return;
    }
    // 获取圆弧圆心、半径
    aryId.forEach(async (id) => {
        let event: any = await id.getMcDbEntity();
        let arc = event as McDbArc;
        let centerPt = arc.center;
        let radius = arc.radius;
        let cricle = new McDbCircle();
        cricle.center = centerPt;
        cricle.radius = radius;
        event.erase();
        let mxcad = MxCpp.getCurrentMxCAD();
        mxcad.drawEntity(cricle);
    })
}

// 复制旋转
async function Mx_CopyRotation() {
    const mxcad = MxCpp.getCurrentMxCAD();
    // 选择复制对象
    let ss = new MxCADSelectionSet();
    if (!await ss.userSelect("选择复制旋转对象:")) return;
    if (ss.count() == 0) return;
    const getBasePt = new MxCADUiPrPoint();
    getBasePt.setMessage('指定基点');
    const basePt = await getBasePt.go();
    const getNextPt = new MxCADUiPrPoint();
    getNextPt.setMessage('请指定目标点\n');
    getNextPt.setUserDraw((pt, pw) => {
        pw.drawLine(pt.toVector3(), basePt.toVector3())
        ss.forEach((id) => {
            let ent = id.getMcDbEntity();
            if (!ent) return;
            let ent_clone = ent.clone() as McDbEntity;
            ent_clone.move(basePt, pt);
            pw.drawMcDbEntity(ent_clone);
        })
    })
    const nextPt = await getNextPt.go();
    if (!nextPt) return;
    let objs: McObjectId[] = [];
    ss.forEach((id) => {
        let ent = id.getMcDbEntity();
        if (!ent) return;
        let ent_clone = ent.clone() as McDbEntity;
        ent_clone.move(basePt, nextPt);
        objs.push(mxcad.drawEntity(ent_clone));
    })

    // 指定旋转角度
    let getAngle = new MxCADUiPrAngle();
    getAngle.setMessage('请指定旋转角度')
    getAngle.setBasePt(nextPt);
    getAngle.setUserDraw((pt, pw) => {
        pw.drawLine(pt.toVector3(), nextPt.toVector3())
        objs.forEach(id => {
            let ent = id.getMcDbEntity();
            if (!ent) return;
            let event_clone = ent.clone() as McDbEntity;
            let a = pt.sub(nextPt).angleTo2(McGeVector3d.kXAxis, McGeVector3d.kNegateZAxis)
            event_clone.rotate(nextPt, a)
            pw.drawMcDbEntity(event_clone);
        })
    })
    let val = await getAngle.go();
    if (!val) return;
    const angle = getAngle.value();
    objs.forEach(id => {
        let ent = id.getMcDbEntity();
        if (!ent) return;
        let event_clone = ent.clone() as McDbEntity;
        event_clone.rotate(nextPt, angle)
        mxcad.drawEntity(event_clone);
        ent.erase();
    })
}

// 圆转多边
async function Mx_CricleTotoll() {
    // 选中圆
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("CIRCLE");
    let aryId = await MxCADUtility.userSelect("选择要转成多边形的对象", filter);
    if (aryId.length == 0) {
        return;
    }

    // 设置多边形
    let getNum = new MxCADUiPrInt();
    getNum.setMessage('设置多边形边数');
    let num = await getNum.go() || 5;
    getNum.clearLastInputPoint()
    if (!num) return;
    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("\n输入选项")
    getPoint.setKeyWords("[内接于圆(I)/外切于圆(C)]")
    getPoint.clearLastInputPoint()
    await getPoint.go();
    let tollType = 'inside'
    if (getPoint.isKeyWordPicked("i")) tollType = 'inside'
    if (getPoint.isKeyWordPicked("c")) tollType = 'outside'
    let mxcad = MxCpp.getCurrentMxCAD();
    aryId.forEach(async (id) => {
        let event: any = await id.getMcDbEntity();
        let cricle = event as McDbCircle;
        let arr1: McGePoint3d[] = [];
        if (tollType === 'inside') {
            //    多边形内切圆
            for (let i = 0; i < num; i++) {
                let point = cricle.getPointAtDist(cricle.getLength().val / num * i);
                if (point.ret) arr1.push(point.val)
            }
            let pl1 = new McDbPolyline();
            arr1.forEach(i => {
                pl1.addVertexAt(i)
            })
            pl1.isClosed = true;
            mxcad.drawEntity(pl1);
        } else if (tollType === 'outside') {
            //  多边形外切圆
            /**
             * 知道三个角加一条边求其他两边
             * 一条边：r
             * 三个角 90 360/num*2 
             */
            let angle = 90 - (360 / (num * 2))
            let sinValue = Math.sin(angle * Math.PI / 180); // 返回0.5
            let R = cricle.radius / sinValue;
            let r = new McDbCircle();
            r.center = cricle.center;
            r.radius = R;
            let arr2: McGePoint3d[] = [];
            for (let i = 0; i < num; i++) {
                let point = r.getPointAtDist(r.getLength().val / num * i);
                if (point.ret) arr2.push(point.val)
            }
            let pl2 = new McDbPolyline();
            arr2.forEach(i => {
                pl2.addVertexAt(i)
            })
            pl2.isClosed = true;
            mxcad.drawEntity(pl2);
        }
        event.erase()
    })
}

// 改颜色
async function Mx_ChangeColor() {
    let aryId = await MxCADUtility.userSelect("选择要修改颜色的对象");
    if (aryId.length == 0) {
        return;
    }
    const getColor = new MxCADUiPrInt();
    getColor.setMessage('输入颜色索引(0~256)');
    let colorNum = await getColor.go() || 20;
    let color = new McCmColor();
    color.setColorIndex(colorNum);
    aryId.forEach(async (id) => {
        let event = id.getMcDbEntity() as McDbEntity;
        event.trueColor = color;
    })
}

// 圆弧切角
async function Mx_ArcToAngle() {
    // 选中圆弧
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("ARC");
    let aryId = await MxCADUtility.userSelect("选择圆弧对象", filter);
    if (aryId.length == 0) {
        return;
    };

    aryId.forEach(async (id) => {
        // 获取圆弧实体
        let event = await id.getMcDbEntity();
        if (!event) return
        let arc = (event.clone()) as McDbArc
        /**
        * 获取圆弧开始点与结束点
        * 并根据两点获取切向量
        */
        let dist = arc.getLength();
        let startPt = arc.getStartPoint().val;
        let mxcad = MxCpp.getCurrentMxCAD();
        let circle = new McDbCircle();
        circle.center = arc.center;
        circle.radius = arc.radius;
        let d = circle.getDistAtPoint(startPt);
        let endPt = circle.getPointAtDist(dist.val + d.val).val;
        let vec_start = arc.getFirstDeriv(startPt);
        if (!vec_start.ret) return;
        let pt1 = startPt.clone();
        pt1.addvec(vec_start.val);
        let vec_end = arc.getFirstDeriv(endPt);
        if (!vec_end.ret) return;
        let pt2 = endPt.clone();
        pt2.addvec(vec_end.val);

        // 延长两条切向量取交点
        let line_1 = new McDbLine();
        line_1.startPoint = startPt;
        line_1.endPoint = pt1;
        let line_2 = new McDbLine();
        line_2.startPoint = endPt;
        line_2.endPoint = pt2;
        let intPt = line_1.IntersectWith(line_2, McDb.Intersect.kExtendBoth);
        if (intPt.length() === 0) return
        let lastPt = intPt.at(0)
        line_1.endPoint = lastPt;
        line_2.endPoint = lastPt;
        mxcad.drawEntity(line_1)
        mxcad.drawEntity(line_2)
    })
}

// 临时隐藏
async function Mx_TemHiding() {
    let mxcad = MxCpp.getCurrentMxCAD();
    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("\n输入选项")
    getPoint.setKeyWords("[隐藏(A)/隐藏未选(B)/全部显示(C)]")
    getPoint.clearLastInputPoint()
    await getPoint.go();
    if (getPoint.isKeyWordPicked("A") || getPoint.isKeyWordPicked("B")) {
        let aryId = await MxCADUtility.userSelect("选择目标的对象");
        if (aryId.length == 0) {
            return;
        }
        let arr: number[] = [];
        aryId.forEach((obj_id: McObjectId) => arr.push(obj_id.id))
        if (getPoint.isKeyWordPicked("A")) {
            aryId.forEach(async (id) => {
                let event = await id.getMcDbEntity() as McDbEntity;
                let event_clone = event.clone() as McDbEntity;
                event_clone.visible = false;
                mxcad.drawEntity(event_clone);
                event.erase()
            })
        } else if (getPoint.isKeyWordPicked("B")) {
            // 获取图纸所有对象id，遍历筛除选择对象的id
            let selectArr = new MxCADSelectionSet();
            selectArr.allSelect();
            selectArr.forEach(async obj_id => {
                if (!arr.includes(obj_id.id)) {
                    let event = await obj_id.getMcDbEntity();
                    let event_clone = event.clone() as McDbEntity;
                    event_clone.visible = false;
                    mxcad.drawEntity(event_clone);
                    event.erase()
                }
            })
        }
    } else if (getPoint.isKeyWordPicked("C")) {
        let selectArr = new MxCADSelectionSet();
        selectArr.allSelect();
        selectArr.forEach(async id => {
            let event: any = await id.getMcDbEntity();
            let event_clone = event.clone()
            if (event_clone.visible === false) {
                event_clone.visible = true;
                mxcad.drawEntity(event_clone);
                event.erase()
            }
        })
    } else {
        return;
    }

}

// 方框删除
async function Mx_BoxDel() {
    // 绘制方框
    const getPoint = new MxCADUiPrPoint();
    let drawColor = MxCpp.getCurrentMxCAD().getCurrentDatabaseDrawColor();
    getPoint.setMessage("\n指定删除方框第一点:");
    let pt1 = await getPoint.go();
    if (!pt1) {
        return;
    }
    let mxcad = MxCpp.getCurrentMxCAD();
    let rect = new MxDbRect();
    rect.pt1 = pt1.toVector3();
    // 在点取第二点时，设置动态绘制.
    getPoint.setUserDraw((currentPoint: McGePoint3d, worldDraw) => {
        rect.pt2 = currentPoint.toVector3();
        rect.setColor(drawColor);
        worldDraw.drawCustomEntity(rect);
    });
    getPoint.setMessage("\n指定删除方框第二点:");
    getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
    let pt2 = await getPoint.go();
    if (!pt2) {
        return;
    }
    rect.pt2 = pt2.toVector3();
    let pl = new McDbPolyline();
    pl.addVertexAt(pt1);
    pl.addVertexAt(new McGePoint3d(pt1.x, pt2.y));
    pl.addVertexAt(pt2);
    pl.addVertexAt(new McGePoint3d(pt2.x, pt1.y));
    pl.isClosed = true;
    let d_id = mxcad.drawEntity(pl);

    // 根据方框角点设置选择集删除对象
    const ss = new MxCADSelectionSet();
    ss.crossingSelect(pt1.x, pt1.y, pt2.x, pt2.y);
    ss.getIds().forEach(id => {
        if (id && id.id !== d_id.id) {
            // 获取并打断与方框相交的对象，删除框内对象
            let event = id.getMcDbEntity() as McDbCurve;
            let points = event.IntersectWith(pl, McDb.Intersect.kOnBothOperands);
            if (points.length() === 0) {
                id.erase()
            } else {
                let PointsArr: McGePoint3d[] = []
                points.forEach(val => PointsArr.push(val))
                event.splitCurves(PointsArr).forEach(e => {
                    mxcad.drawEntity(e as McDbEntity)
                })
                id.erase()
            }
        }
    })

    // 累加选择，精确删除方框内的实体
    while (true) {
        const getPoint = new MxCADUiPrPoint()
        getPoint.setMessage("\n选择需要精确删除的实体")
        const point = await getPoint.go()
        if (!point) break;
        let objId = MxCADUtility.findEntAtPoint(point.x, point.y, point.z, -1)
        mxcad.addCurrentSelect(objId)
    }
    const objIds = MxCADUtility.getCurrentSelect()
    objIds.forEach((objId: McObjectId) => {
        objId.erase()
    })
    mxcad.mxdraw.clearMxCurrentSelect()

}

// 角度复制
async function Mx_AngleCopy() {
    const mxcad = MxCpp.getCurrentMxCAD();
    const angleCopyObj = new MxCADUiPrEntity();//角度复制对象
    angleCopyObj.setMessage("\n请选择角度复制对象")
    const angleCopyObj_id = await angleCopyObj.go();
    if (angleCopyObj_id === null) return;
    const angleCopyEvent = (await angleCopyObj_id.getMcDbEntity()) as McDbEntity;//角度复制的实例对象

    const getNum = new MxCADUiPrInt();
    getNum.setMessage("\n请输入角度复制数量");
    const num = await getNum.go() || 1;

    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("\n请输入角度复制的基点");
    const point = await getPoint.go(); //角度复制的基点
    if (!point) return;

    const getAngle = new MxCADUiPrAngle();
    getAngle.setMessage("\n请输入复制角度");
    getAngle.setBasePt(point);
    getAngle.setUserDraw((pt, pw) => {
        const angle = pt.sub(point).angleTo2(McGeVector3d.kXAxis, McGeVector3d.kNegateZAxis);
        for (let i = 1; i < num + 1; i++) {
            let event_clone = angleCopyEvent.clone() as McDbEntity;
            event_clone.rotate(point, angle * i);
            pw.drawMcDbEntity(event_clone)
        }
    })
    let a = await getAngle.go();
    if (!a) return;
    const angle = getAngle.value();
    for (let i = 1; i < num + 1; i++) {
        let event_clone = angleCopyEvent.clone() as McDbEntity;
        event_clone.rotate(point, angle * i);
        mxcad.drawEntity(event_clone)
    }
}

// 顶点复制
async function Mx_VertexRep() {
    // 选择顶点对象
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LWPOLYLINE");
    let aryIds = await MxCADUtility.userSelect("请选择顶点对象", filter);
    if (aryIds.length == 0) return;

    // 选择复制对象
    let copyIds = await MxCADUtility.userSelect("请选择复制对象");
    if (copyIds.length == 0) return;

    // 选择复制基点
    const getBasePt = new MxCADUiPrPoint();
    getBasePt.setMessage("请确定复制基点");
    const basePt = await getBasePt.go();
    if (!basePt) return;

    // 平移对象到顶点
    const mxcad = MxCpp.getCurrentMxCAD()
    aryIds.forEach(id => {
        let event = id.getMcDbEntity() as McDbPolyline;
        if (!event) return
        let num = event.numVerts();
        for (let i = 0; i < num; i++) {
            const pt = event.getPointAt(i).val;
            copyIds.forEach(obj_id => {
                const e = obj_id.getMcDbEntity() as McDbEntity;
                const e_clone = e.clone() as McDbEntity;
                e_clone.move(basePt, pt);
                mxcad.drawEntity(e_clone)
            })
        }
    })
}

// 交点打断
async function Mx_IntersectBreak() {
    // 选择参考曲线
    let eventObj = new MxCADUiPrEntity();
    eventObj.setMessage("请选择参考曲线");
    let eventObj_id = await eventObj.go();
    let event = await eventObj_id.getMcDbEntity()//获取实例对象
    if (event === null) return;
    const mxcad = MxCpp.App.getCurrentMxCAD();
    let curve = event.clone();
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("CIRCLE,ARC,LINE,LWPOLYLINE,ELLIPSE");
    let aryId = await MxCADUtility.userSelect("选择打断对象", filter);//选中对象的id
    if (aryId.length == 0) return
    aryId.forEach(async (id) => {
        if (id.id !== eventObj_id.id) {
            let breakEvent: McDbCurve = (await id.getMcDbEntity()) as McDbCurve;
            let breakArr = breakEvent.IntersectWith(curve as McDbEntity, McDb.Intersect.kOnBothOperands);//与实体相交的点集合
            if (breakArr.length() != 0) {
                //有交点的对象
                let arr: McGePoint3d[] = [];//交点数组
                breakArr.forEach((item: McGePoint3d) => {
                    arr.push(item)
                })
                let breakPoint: McGePoint3d[] = [];
                arr.forEach(pt => {
                    let closePoint = breakEvent.getClosestPointTo(pt, false);//曲线上离鼠标位置最近的点
                    if (!closePoint.ret) return;
                    let vec = breakEvent.getFirstDeriv(closePoint.val);//断点所在位置的向量
                    if (!vec.ret) return;
                    vec.val.normalize().mult(MxFun.viewCoordLong2Cad(10));//断开的距离
                    let pt1 = closePoint.val.clone();
                    pt1.addvec(vec.val);
                    let pt2 = closePoint.val.clone();
                    pt2.subvec(vec.val);
                    breakPoint.push(pt1);
                    breakPoint.push(pt2);
                });
                let breakcurve = breakEvent.splitCurves(breakPoint);
                if (breakcurve.empty()) {
                    breakEvent.highlight(false);
                    return;
                }
                breakcurve.forEach((obj: McDbObject, index: number) => {
                    if (index % 2 == 0) mxcad.drawEntity(obj as McDbEntity);
                });
                breakEvent.erase()
            }
        }
    })
}

// 双向偏移
async function Mx_DoubleOff() {
    let mxcad = MxCpp.App.getCurrentMxCAD();

    //获取偏移对象
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("CIRCLE,ARC,LINE,LWPOLYLINE,ELLIPSE");
    let getEvent = new MxCADUiPrEntity();
    getEvent.setFilter(filter);
    getEvent.setMessage('指定偏移对象');
    let event_id = await getEvent.go();
    if (!event_id) return;

    //获取偏移距离
    const getOffDist = new MxCADUiPrDist();
    getOffDist.setMessage('请输入偏移距离');
    const distVal = await getOffDist.go();
    if (!distVal) return;
    const offDist = getOffDist.value();
    let event = (await event_id.getMcDbEntity()) as McDbCurve;
    // 获取曲线两侧的点作为偏移点
    const startPt = event.getStartPoint().val;
    const vec = event.getFirstDeriv(startPt).val;
    const vecP = vec.rotateBy(McGeVector3d.kYAxis.angleTo1(McGeVector3d.kXAxis))
    const nextPt1 = startPt.clone().addvec(vecP)
    const nextPt2 = startPt.clone().subvec(vecP)
    let objArr1 = event.offsetCurves(offDist, nextPt1);
    if (objArr1.length() === 0) return;
    objArr1.forEach((obj: McDbObject) => {
        mxcad.drawEntity(obj as McDbEntity);
    });
    let objArr2 = event.offsetCurves(offDist, nextPt2);
    if (objArr2.length() === 0) return;
    objArr2.forEach((obj: McDbObject) => {
        mxcad.drawEntity(obj as McDbEntity);
    });
}

// 伸缩
async function Mx_Telescoping() {
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("ARC,LINE,LWPOLYLINE");
    const getEvent = new MxCADUiPrEntity();
    getEvent.setFilter(filter);
    getEvent.setMessage('指定伸缩对象(选择直线、多段线、圆弧)');
    const event_id = await getEvent.go();
    if (!event_id) return;
    const mxcad = MxCpp.App.getCurrentMxCAD();
    const event = event_id.getMcDbEntity();
    if (event instanceof McDbArc) {
        // 圆弧
        const event_clone = event.clone() as McDbArc;
        const center = event_clone.center;
        const getPoint = new MxCADUiPrPoint();
        getPoint.setMessage('伸缩至');
        event.visible = false;
        getPoint.setUserDraw((pt, pw) => {
            event_clone.endAngle = pt.sub(center).angleTo2(McGeVector3d.kXAxis, McGeVector3d.kNegateZAxis);
            pw.drawMcDbEntity(event_clone)
        })
        const point = await getPoint.go();
        event.visible = true;
        if (!point) return
        event.endAngle = point.sub(center).angleTo2(McGeVector3d.kXAxis, McGeVector3d.kNegateZAxis);
        mxcad.updateDisplay();
    } else if (event instanceof McDbLine) {
        // 直线
        const event_clone = event.clone() as McDbLine;
        const getPoint = new MxCADUiPrPoint();
        getPoint.setMessage('伸缩至');
        event.visible = false;
        let endPt: McGePoint3d;
        getPoint.setUserDraw((pt, pw) => {
            endPt = event_clone.getClosestPointTo(pt, true).val
            event_clone.endPoint = endPt;
            pw.drawMcDbEntity(event_clone)
        })
        const point = await getPoint.go();
        event.visible = true;
        if (!point) return
        event.endPoint = endPt;
        mxcad.updateDisplay();
    } else if (event instanceof McDbPolyline) {
        // 多段线
        const event_clone = event.clone() as McDbPolyline;
        const getPoint = new MxCADUiPrPoint();
        getPoint.setMessage('伸缩至');
        event.visible = false;
        let endPt: McGePoint3d;
        const num = event.numVerts()
        const bulge = event.getBulgeAt(num - 1)
        const widths = event.getWidthsAt(num - 1)
        getPoint.setUserDraw((pt, pw) => {
            endPt = event_clone.getClosestPointTo(pt, true).val;
            event_clone.setPointAt(num - 1, endPt);
            event_clone.setBulgeAt(num - 1, bulge);
            event_clone.setWidthsAt(num - 1, widths.val1, widths.val2);
            pw.drawMcDbEntity(event_clone)
        });
        const point = await getPoint.go();
        event.visible = true;
        if (!point) return
        event.setPointAt(num - 1, endPt);
        event.setBulgeAt(num - 1, bulge);
        event.setWidthsAt(num - 1, widths.val1, widths.val2);
        mxcad.updateDisplay();
    }
    // else if (event instanceof McDbEllipse) {
    //     // 椭圆弧
    //     // const getPoint = new MxCADUiPrPoint();
    //     // getPoint.setMessage('伸缩至');
    //     // const center = event.center;
    //     // const event_clone = event.clone() as McDbEllipse;
    //     // getPoint.setUserDraw((pt, pw) => {
    //     //     let closePt = event_clone.getClosestPointTo(pt, true).val;
    //     // })
    //     // const point = await getPoint.go();
    // }
}

// 改圆大小
async function Mx_EitCircle() {
    // 框选圆
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("CIRCLE");
    let aryIds = await MxCADUtility.userSelect("选择对象", filter);
    if (aryIds.length == 0) {
        return;
    };
    // 设置圆半径
    const getRadius = new MxCADUiPrDist();
    getRadius.setMessage('请输入圆半径');
    // 动态绘制圆
    // 以选中的第一个圆为参考圆
    const c = aryIds[0].getMcDbEntity() as McDbCircle;
    getRadius.setBasePt(c.center)
    getRadius.setUserDraw((pt, pw) => {
        const r = pt.distanceTo(c.center);
        aryIds.forEach((id: McObjectId) => {
            const circle = id.getMcDbEntity();
            const circle_clone = circle.clone() as McDbCircle;
            circle_clone.radius = r;
            pw.drawMcDbEntity(circle_clone)
        })
    })
    const radiusVal = await getRadius.go();
    if (!radiusVal) return;
    const radius = getRadius.value();
    aryIds.forEach((id: McObjectId) => {
        const circle = id.getMcDbEntity() as McDbCircle;
        circle.radius = radius;
    })
}

// 线型比例
async function Mx_LayerTypeScale() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LWPOLYLINE,ARC,LINE,CIRCLE,ELLIPSE");
    let aryId = await MxCADUtility.userSelect("选择要修改线型比例的对象", filter);
    if (aryId.length == 0) {
        return;
    }
    const getScale = new MxCADUiPrString();
    getScale.setMessage('请输入线型比例');
    const scaleVal = await getScale.go();
    if (!scaleVal) return;
    const scale = Number(getScale.value());
    if (!scale) return;
    aryId.forEach(async (id) => {
        let event = id.getMcDbEntity();
        event.linetypeScale = scale;
    })
}

// 按弧阵列
/**
 * 指定对象的平移和旋转
 * 平移距离：指定对象到指定圆弧位置的距离
 * 旋转方向：阵列点垂直向量与Y轴的夹角
 */
async function Mx_ArcOrder() {
    const mxcad = MxCpp.App.getCurrentMxCAD();

    // 设置阵列间距
    const getDist = new MxCADUiPrDist();
    getDist.setMessage('请输入阵列间距');
    const distVal = await getDist.go();
    if (!distVal) return;
    const dist = getDist.value();

    // 指定圆弧
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("ARC");
    const arcEventObj = new MxCADUiPrEntity();
    arcEventObj.setFilter(filter);
    arcEventObj.setMessage('请选择圆弧')
    const arcEvent_id = await arcEventObj.go();
    if (!arcEvent_id.id) return;
    const arcEvent: McDbArc = arcEvent_id.getMcDbEntity() as McDbArc;

    // 指定排列对象
    const aryIds = await MxCADUtility.userSelect("选择排列对象");
    if (aryIds.length == 0) {
        return;
    }
    // 指定排列基点
    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage('指定排列基点')
    const point = await getPoint.go();
    if (!point) return;

    // 排列
    aryIds.forEach(async (orderObj_id) => {
        let orderEvent = orderObj_id.getMcDbEntity() as McDbEntity;
        let eventInd = arcEvent.getLength().val / dist;// 根据阵列距离得出阵列数
        if (eventInd < 1) return;
        for (let i = 0; i < eventInd; i++) {
            let orderEvent_clone = orderEvent.clone() as McDbEntity;
            let evePt = arcEvent.getPointAtDist(i * dist);
            if (!evePt.ret) return;
            let v = evePt.val.sub(point)//平移距离和方向
            let matrix = new McGeMatrix3d();
            matrix.setToTranslation(v);
            orderEvent_clone.transformBy(matrix);
            let tangentV = arcEvent.getFirstDeriv(evePt.val).val;//曲线阵列点切向量
            let verticalV = tangentV.rotateBy(McGeVector3d.kYAxis.angleTo1(McGeVector3d.kXAxis));//阵列点垂直向量
            let angle = verticalV.negate().angleTo2(McGeVector3d.kYAxis, McGeVector3d.kNegateZAxis);//旋转角度
            orderEvent_clone.rotate(evePt.val, angle)
            mxcad.drawEntity(orderEvent_clone);
        }
    })
}

// pl圆角
/**
 * 将pl打断成n段直线
 * 根据圆角半径求圆心
 */
async function Mx_PlRoundCorners() {
    // 选择目标pl
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LWPOLYLINE");
    let ss = new MxCADSelectionSet();
    if (!await ss.userSelect("选择目标多段线:", filter)) return;
    if (ss.count() == 0) return;

    // 设置圆角半径s
    const getRadius = new MxCADUiPrDist();
    getRadius.setMessage('请输入圆角半径<5>');
    let radius: number = 5;
    const radiusVal = await getRadius.go();
    if (radiusVal) {
        radius = getRadius.value();
    }

    const mxcad = MxCpp.getCurrentMxCAD();
    ss.forEach(id => {
        const pl = id.getMcDbEntity() as McDbPolyline;

        const pl_new = new McDbPolyline();
        pl_new.trueColor = pl.trueColor;
        pl_new.isClosed = pl.isClosed;
        pl_new.colorIndex = pl.colorIndex;
        pl_new.layerId = pl.layerId;
        const num = pl.numVerts();
        const vertPts: McGePoint3d[] = [];
        for (let i = 0; i < num; i++) {
            vertPts.push(pl.getPointAt(i).val);
        };

        if (pl.isClosed === true) {
            // 闭合曲线多一条线
            vertPts.push(...[vertPts[0], vertPts[1]])
        }
        vertPts.forEach((pt1, index) => {
            if (index + 2 >= vertPts.length) return;
            const pt2 = vertPts[index + 1];
            const pt3 = vertPts[index + 2];
            const line1 = new McDbLine(pt2, pt1);
            const line2 = new McDbLine(pt2, pt3);

            // 获取圆角起始点
            const angle = pt1.sub(pt2).angleTo2(pt3.sub(pt2), McGeVector3d.kNegateZAxis);
            let b = radius * Math.sin(Math.PI / 2 - angle / 2) / Math.sin(angle / 2);
            if (b < 0) b = -b;
            const p1 = line1.getPointAtDist(b).val;
            const p2 = line2.getPointAtDist(b).val;

            // 获取圆角中点
            line1.rotate(p1, Math.PI / 2);
            line2.rotate(p2, Math.PI / 2);
            const pointsVal = line1.IntersectWith(line2, McDb.Intersect.kExtendBoth);
            if (!pointsVal.length()) return;
            const center = pointsVal.at(0);

            const line = new McDbLine(center, pt2);
            const midPt = line.getPointAtDist(radius).val;

            let retB = MxCADUtility.calcBulge(p1, midPt, p2).val;//三点计算当前弧线的凸度

            if (index === 0 && pl.isClosed === false) {
                let w = pl.getWidthsAt(index)
                pl_new.addVertexAt(pt1, 0, w.val1, w.val2);
            }
            let widths;
            if (pl.isClosed === true && index + 2 === vertPts.length - 1) {
                widths = pl.getWidthsAt(index);
            } else {
                widths = pl.getWidthsAt(index + 1);
            }
            pl_new.addVertexAt(p1, retB, widths.val1, widths.val2);
            pl_new.addVertexAt(p2, 0, widths.val1, widths.val2);

            if (index + 2 === vertPts.length - 1 && pl.isClosed === false) {
                pl_new.addVertexAt(pt3, 0, widths.val1, widths.val2);
            }
        })
        pl.erase();
        mxcad.drawEntity(pl_new);
    })
}

// 填充比例
async function Mx_FillRatio() {
    const mxcad = MxCpp.getCurrentMxCAD();

    const ss = new MxCADSelectionSet();
    if (!await ss.userSelect("选择填充对象")) return;
    if (ss.count() == 0) return;

    // 获取填充比例
    const getRatio = new MxCADUiPrString();
    getRatio.setMessage('请输入填充比例');
    const ratioVal = await getRatio.go();
    if (!ratioVal) return;
    const ratio = Number(getRatio.value());
    if (!ratio) return;

    ss.forEach(id => {
        const tmp = id.getMcDbEntity();
        if (tmp instanceof McDbHatch) {
            let tmp_clone = tmp.clone() as McDbHatch;
            tmp_clone.patternScale = tmp_clone.patternSpace = ratio;
            const num = tmp_clone.numPatternDefinitions;
            for (let i = 0; i < num; i++) {
                const def = tmp_clone.getPatternDefinitionAt(i);
                const strArr = Object.values(def);
                strArr.shift();
                const str = strArr.toString();
                mxcad.addPatternDefinition(`test${i}`, `((${str}))`);
                mxcad.drawPatternDefinition = `test${i}`;
            };
            mxcad.drawHatch(tmp_clone, ratio);
            tmp.erase();
        }
    });
    mxcad.updateDisplay();
}

// 继承填充
async function Mx_InheritanceFill() {
    const getEnt = new MxCADUiPrEntity();
    getEnt.setMessage('请选择原填充图形');
    const entId = await getEnt.go();
    if (!entId.id) return;
    const mxcad = MxCpp.getCurrentMxCAD();
    const ent = entId.getMcDbEntity();
    if (ent instanceof McDbHatch) {
        const patternName = ent.patternName();
        const type = ent.patternType();
        console.log(patternName)
        while (true) {
            const getPoint = new MxCADUiPrPoint();
            getPoint.setMessage('请点击填充图形内部任意一点');
            const point = await getPoint.go();
            if (!point) return;
            const hatch = MxCADUtility.builderHatchFromPoint(point);
            if (!hatch) {
                MxFun.acutPrintf("没有找到闭合区域\n")
                return;
            }
            hatch.setPattern(type, patternName);
            hatch.patternScale = ent.patternScale;
            hatch.patternAngle = ent.patternAngle;
            mxcad.drawEntity(hatch);
            console.log(111, hatch)
        }

    }
}

// pl线反向
async function Mx_PlReverse() {
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes('LWPOLYLINE');

    const getEntity = new MxCADUiPrEntity();
    getEntity.setMessage('请选择线对象');
    getEntity.setFilter(filter);
    const entId = await getEntity.go();
    console.log(entId)
    if (!entId.id) return;
    const ent = entId.getMcDbEntity() as McDbPolyline;
    const vertNum = ent.numVerts();
    const pl = new McDbPolyline();
    for (let i = vertNum - 1; i >= 0; i--) {
        const pt = ent.getPointAt(i).val;
        if (i > 0) {
            const widths = ent.getWidthsAt(i - 1);
            const bulge = ent.getBulgeAt(i - 1);
            pl.addVertexAt(pt, -bulge, widths.val2, widths.val1);
        } else {
            const widths = ent.getWidthsAt(i);
            const bulge = ent.getBulgeAt(i);
            pl.addVertexAt(pt, -bulge, widths.val2, widths.val2);
        }
    }
    const mxcad = MxCpp.getCurrentMxCAD();
    pl.isClosed = ent.isClosed;
    mxcad.drawEntity(pl);
    ent.erase()
}

// 路径阵列
async function Mx_PathArray(){
    MxFun.getCurrentDraw().getSelectPoints()
}
export function init() {
    MxFun.addCommand("Mx_Multicopy", Mx_Multicopy);
    MxFun.addCommand("Mx_ArcToCircle", Mx_ArcToCircle);
    MxFun.addCommand("Mx_CopyRotation", Mx_CopyRotation);
    MxFun.addCommand("Mx_CricleTotoll", Mx_CricleTotoll);
    MxFun.addCommand("Mx_ChangeColor", Mx_ChangeColor);
    MxFun.addCommand("Mx_ArcToAngle", Mx_ArcToAngle);
    MxFun.addCommand("Mx_TemHiding", Mx_TemHiding);
    MxFun.addCommand("Mx_BoxDel", Mx_BoxDel);
    MxFun.addCommand("Mx_AngleCopy", Mx_AngleCopy);
    MxFun.addCommand("Mx_VertexRep", Mx_VertexRep);
    MxFun.addCommand("Mx_IntersectBreak", Mx_IntersectBreak);
    MxFun.addCommand("Mx_DoubleOff", Mx_DoubleOff);
    MxFun.addCommand("Mx_Telescoping", Mx_Telescoping);
    MxFun.addCommand("Mx_EitCircle", Mx_EitCircle);
    MxFun.addCommand("Mx_LayerTypeScale", Mx_LayerTypeScale);
    MxFun.addCommand("Mx_ArcOrder", Mx_ArcOrder);
    MxFun.addCommand("Mx_PlRoundCorners", Mx_PlRoundCorners);
    MxFun.addCommand("Mx_PlReverse", Mx_PlReverse);
    // MxFun.addCommand("Mx_FillRatio", Mx_FillRatio);
    // MxFun.addCommand("Mx_InheritanceFill", Mx_InheritanceFill);
}
