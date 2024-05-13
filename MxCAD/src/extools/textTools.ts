///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxFun } from "mxdraw";
import {
    MxCADUiPrInt, MxCADUiPrEntity, McDbLine, McDbText, McDbMText, McGeVector3d, MxCpp, MxCADResbuf, MxCADUtility,
    MxCADUiPrString, McDb, MxCADUiPrKeyWord, MxCADUiPrPoint, McGePoint3d, McDbPolyline, MxCADUiPrDist, McDbEntity,
    McGeMatrix3d, MxCADSelectionSet, McObjectId, McDbArc
} from "mxcad";

// 按线对齐
async function Mx_AlignByLine() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("LINE");
    const getLineObj = new MxCADUiPrEntity();
    getLineObj.setMessage("请选择目标对齐线对象(选择直线)");
    getLineObj.setFilter(filter);
    const lineObj_id = await getLineObj.go();
    if (!lineObj_id.id) return;
    const lineObj = lineObj_id.getMcDbEntity() as McDbLine;
    const getTextObj = new MxCADUiPrEntity();

    let filter2 = new MxCADResbuf();
    filter2.AddMcDbEntityTypes("TEXT");
    getTextObj.setMessage("请选择目标文字对象");
    getTextObj.setFilter(filter2);
    const textObj_id = await getTextObj.go();
    if (!textObj_id.id) return;
    const textObj = textObj_id.getMcDbEntity() as McDbText;

    const line_v = lineObj.getFirstDeriv(lineObj.getStartPoint().val);// 直线初始点切向量
    let angle1 = line_v.val.angleTo2(McGeVector3d.kXAxis, McGeVector3d.kNegateZAxis);//直线与水平方向角度
    let angle2 = textObj.rotation;//文字初始角度
    textObj.rotate(textObj.position, angle1 - angle2)
    const mxcad = MxCpp.App.getCurrentMxCAD();
    mxcad.updateDisplay()
}

// 改字高
async function Mx_TextHeight() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT, MTEXT");
    const aryIds = await MxCADUtility.userSelect("选择文字对象", filter);
    if (aryIds.length == 0) {
        return;
    };
    const getHeight = new MxCADUiPrString();
    getHeight.setMessage("请设置字高");
    const height = await getHeight.go();
    if (!height || !Number(height)) return;
    aryIds.forEach(id => {
        const text = id.getMcDbEntity() as McDbText;
        text.height = Number(height);
    })
    MxCpp.getCurrentMxCAD().updateDisplay()
}

// 改字宽
async function Mx_TextWidth() {
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT, MTEXT");
    const aryIds = await MxCADUtility.userSelect("选择文字对象", filter);
    if (aryIds.length == 0) {
        return;
    };
    const getWidth = new MxCADUiPrString();
    getWidth.setMessage("请设置字宽");
    const width = await getWidth.go();
    if (!width || !Number(width)) return;
    aryIds.forEach(id => {
        const text = id.getMcDbEntity() as McDbText;
        text.widthFactor = Number(width);
    })
    MxCpp.getCurrentMxCAD().updateDisplay()
}

// 刷内容
async function Mx_BrushCon() {
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    const getCopyObj = new MxCADUiPrEntity();
    getCopyObj.setMessage("请选择源文字");
    getCopyObj.setFilter(filter);
    const copyObj_id = await getCopyObj.go();
    if (!copyObj_id?.id) return;
    const copyObj = copyObj_id.getMcDbEntity() as McDbText;
    let aryId = await MxCADUtility.userSelect("请选择目标文字", filter);
    if (aryId.length == 0) {
        return;
    }
    const mxcad = MxCpp.App.getCurrentMxCAD();
    aryId.forEach(id => {
        let event = id.getMcDbEntity();
        let event_clone = event.clone() as McDbText;
        event_clone.textString = copyObj.textString
        mxcad.drawEntity(event_clone);
        id.erase();
    })
}

// 换内容
async function Mx_ReplaceCon() {
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    const getFirstObj = new MxCADUiPrEntity();
    getFirstObj.setFilter(filter);
    getFirstObj.setMessage("请选择第一个文字");
    const firstObj_id = await getFirstObj.go();
    if (!firstObj_id?.id) return;
    const firstObj = firstObj_id.getMcDbEntity() as McDbText;
    const mxcad = MxCpp.App.getCurrentMxCAD();
    const getSecondObj = new MxCADUiPrEntity();
    getSecondObj.setFilter(filter);
    getSecondObj.setMessage("请选择第二个文字");
    const secondObj_id = await getSecondObj.go();
    if (!secondObj_id?.id) return;
    const secondObj = secondObj_id.getMcDbEntity() as McDbText;
    let str1 = firstObj.textString;
    let str2 = secondObj.textString;
    let event1 = firstObj.clone() as McDbText;
    let event2 = secondObj.clone() as McDbText;
    event1.textString = str2;
    event2.textString = str1;
    mxcad.drawEntity(event1)
    mxcad.drawEntity(event2)
    firstObj_id.erase();
    secondObj_id.erase();
}

// 左右对齐
async function Mx_AlignLeft() {
    // 选择对齐文字
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    let aryIds = await MxCADUtility.userSelect("请选择需要对齐的文字", filter);
    if (aryIds.length == 0) {
        return;
    };
    // 设置对齐选项
    const getKeyWord = new MxCADUiPrKeyWord();
    getKeyWord.setMessage("请选择对齐方式");
    getKeyWord.setKeyWords("[左(L)/中(M)/右(R)]");
    const keyWord = await getKeyWord.go();
    if (!keyWord) return;

    // 选择对齐基点
    const getBasePt = new MxCADUiPrPoint();
    getBasePt.setMessage("请选择对齐基点");
    const basePt = await getBasePt.go();
    if (!basePt) return;

    const mxcad = MxCpp.getCurrentMxCAD();
    if (keyWord === 'L') {
        // 左对齐
        aryIds.forEach(id => {
            const text = id.getMcDbEntity() as McDbText;
            const text_clone = text.clone() as McDbText;
            const aPt = text.alignmentPoint;
            const pt = text.position;
            text_clone.horizontalMode = McDb.TextHorzMode.kTextLeft;
            text_clone.alignmentPoint = new McGePoint3d(basePt.x, aPt.y);
            text_clone.position = new McGePoint3d(basePt.x, pt.y);
            mxcad.drawEntity(text_clone);
            id.erase();
        })
    } else if (keyWord === 'R') {
        // 右对齐
        aryIds.forEach(id => {
            const text = id.getMcDbEntity() as McDbText;
            const text_clone = text.clone() as McDbText;
            const aPt = text.alignmentPoint;
            const pt = text.position;
            text_clone.horizontalMode = McDb.TextHorzMode.kTextRight;
            text_clone.alignmentPoint = new McGePoint3d(basePt.x, aPt.y);
            text_clone.position = new McGePoint3d(basePt.x, pt.y);
            mxcad.drawEntity(text_clone);
            id.erase();
        })
    } else if (keyWord === 'M') {
        // 居中对齐
        aryIds.forEach(id => {
            const text = id.getMcDbEntity() as McDbText;
            const text_clone = text.clone() as McDbText;
            const aPt = text.alignmentPoint;
            const pt = text.position;
            text_clone.horizontalMode = McDb.TextHorzMode.kTextCenter;
            text_clone.alignmentPoint = new McGePoint3d(basePt.x, aPt.y);
            text_clone.position = new McGePoint3d(basePt.x, pt.y);
            mxcad.drawEntity(text_clone);
            id.erase();
        })
    }
}

// 上下对齐
async function Mx_AlignUp() {
    // 选择对齐文字
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    let aryIds = await MxCADUtility.userSelect("请选择需要对齐的文字", filter);
    if (aryIds.length == 0) {
        return;
    };

    // 选择对齐基点
    const getBasePt = new MxCADUiPrPoint();
    getBasePt.setMessage("请选择对齐基点");
    const basePt = await getBasePt.go();
    if (!basePt) return;

    aryIds.forEach(id=>{
        const text = id.getMcDbEntity() as McDbText;
        const pt = text.position;
        text.alignmentPoint = text.position = new McGePoint3d(pt.x,basePt.y);
    });

    MxCpp.getCurrentMxCAD().updateDisplay();

}

// 文字反转
async function Mx_TextReversal() {
    // 选择需要反转的文字
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    let aryIds = await MxCADUtility.userSelect("请选择需要反转的文字", filter);
    if (aryIds.length == 0) {
        return;
    };

    const mxcad = MxCpp.App.getCurrentMxCAD();
    aryIds.forEach(id => {
        const event = id.getMcDbEntity() as McDbText;
        const event_clone = event.clone() as McDbText;

        // 将文字中心点做旋转基点
        let bound = event.getBoundingBox();
        if (!bound.ret) return;
        const maxPt: McGePoint3d = bound.maxPt;
        const minPt: McGePoint3d = bound.minPt;
        const line = new McDbLine(minPt, maxPt);
        const midPt = line.getPointAtDist(line.getLength().val / 2).val;

        // 文字在自身旋转角度上再旋转180度
        const angle = McGeVector3d.kXAxis.angleTo1(new McGeVector3d(-1, 0, 0)) + event.rotation
        event_clone.rotate(midPt, angle);
        id.erase()
        mxcad.drawEntity(event_clone);
    })
}

// 去空格
async function Mx_TextTrim() {
    // 选择需要去空格的对象
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT, MTEXT");
    let aryIds = await MxCADUtility.userSelect("请选择需要去空格的文字", filter);
    if (aryIds.length == 0) {
        return;
    };

    // 去除文字空格
    aryIds.forEach(id => {
        const event = id.getMcDbEntity();
        let event_clone: McDbText | McDbMText;
        if (event instanceof McDbText) {
            event_clone = event.clone() as McDbText;
            event_clone.textString = event.textString.replace(/\s+/g, '');
        } else if (event instanceof McDbMText) {
            event_clone = event.clone() as McDbMText;
            event_clone.contents = event.contents.replace(/\s+/g, '');
        }
        id.erase()
        MxCpp.App.getCurrentMxCAD().drawEntity(event_clone);
    })
}

// 文字加框
async function Mx_TextTraming() {
    // 选择文字对象
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT, MTEXT");
    let aryIds = await MxCADUtility.userSelect("请选择文字对象", filter);
    if (aryIds.length == 0) {
        return;
    };

    aryIds.forEach(id => {
        const event = id.getMcDbEntity();
        // 获取文字的两个角点
        let bound = event.getBoundingBox();
        if (!bound.ret) return;
        const maxPt: McGePoint3d = bound.maxPt;
        const minPt: McGePoint3d = bound.minPt;
        //  多段线绘框
        const pl = new McDbPolyline();
        pl.addVertexAt(minPt);
        pl.addVertexAt(new McGePoint3d(minPt.x, maxPt.y));
        pl.addVertexAt(maxPt);
        pl.addVertexAt(new McGePoint3d(maxPt.x, minPt.y));
        pl.isClosed = true;
        MxCpp.getCurrentMxCAD().drawEntity(pl);
    })
}

// 下划线
async function Mx_Underline() {
    // 选择文字对象
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    let aryIds = await MxCADUtility.userSelect("请选择文字对象", filter);
    if (aryIds.length == 0) {
        return;
    };

    // 设置下划线宽度
    const getWidth = new MxCADUiPrInt();
    getWidth.setMessage("请输入下划线宽度\n");
    const width = await getWidth.go() || 0;

    // 设置下划线距离
    const getDist = new MxCADUiPrDist();
    getDist.setMessage("请设置下划线距离\n");
    const val = await getDist.go();
    let dist: number = 0;
    if (val) {
        dist = getDist.value();
    }

    // 设置下划线延长距离
    const getExDist = new MxCADUiPrDist();
    getExDist.setMessage("请设置下划线延长距离\n");
    const ex_val = await getExDist.go();
    let exDist: number = 0;
    if (ex_val) {
        exDist = getExDist.value();
    }

    aryIds.forEach(id => {
        const event = id.getMcDbEntity() as McDbText;
        // 获取文字的两个角点
        let bound = event.getBoundingBox();
        if (!bound.ret) return;
        const maxPt: McGePoint3d = bound.maxPt;
        const minPt: McGePoint3d = bound.minPt;

        // 延长下划线
        const line1 = new McDbLine(minPt.x, minPt.y, 0, maxPt.x, minPt.y, 0);
        const line2 = new McDbLine(maxPt.x, minPt.y, 0, minPt.x, minPt.y, 0);
        const length = line2.getLength().val;
        const pt1 = line1.getPointAtDist(length + exDist).val;
        const pt2 = line2.getPointAtDist(length + exDist).val;
        const pl = new McDbPolyline();
        pl.addVertexAt(pt1, 0, width, width);
        pl.addVertexAt(pt2, 0, width, width);

        // 平移
        const closePt = pl.getClosestPointTo(maxPt, true).val;
        // 转换向量长度
        const vex = closePt.clone().sub(maxPt);
        vex.normalize().mult(dist)
        const toPt = closePt.clone().addvec(vex);
        const matrix = new McGeMatrix3d();
        matrix.setToTranslation(toPt.sub(closePt));
        pl.transformBy(matrix)
        MxCpp.getCurrentMxCAD().drawEntity(pl)
    })

}

// 图名线
async function Mx_TitleLine() {
    // 选择文字对象
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    let aryIds = await MxCADUtility.userSelect("请选择文字对象", filter);
    if (aryIds.length == 0) {
        return;
    };

    aryIds.forEach(id => {
        const event = id.getMcDbEntity();
        // 获取文字的两个角点
        let bound = event.getBoundingBox();
        if (!bound.ret) return;
        const maxPt: McGePoint3d = bound.maxPt;
        const minPt: McGePoint3d = bound.minPt;
        // 利用多段线绘制图名线
        const pl1 = new McDbPolyline();
        pl1.addVertexAt(minPt, 0, 2, 2);
        pl1.addVertexAt(new McGePoint3d(maxPt.x, minPt.y), 0, 2, 2);
        const pl2 = new McDbPolyline();
        pl2.addVertexAt(minPt);
        pl2.addVertexAt(new McGePoint3d(maxPt.x, minPt.y));
        // 平移
        const closePt = pl1.getClosestPointTo(maxPt, true).val;
        // 转换向量长度
        const vex1 = closePt.clone().sub(maxPt);
        const vex2 = closePt.clone().sub(maxPt);
        vex1.normalize().mult(2)
        vex2.normalize().mult(4)
        const toPt1 = closePt.clone().addvec(vex1);
        const toPt2 = closePt.clone().addvec(vex2);
        const matrix1 = new McGeMatrix3d();
        const matrix2 = new McGeMatrix3d();
        matrix1.setToTranslation(toPt1.sub(closePt));
        pl1.transformBy(matrix1);
        matrix2.setToTranslation(toPt2.sub(closePt));
        pl2.transformBy(matrix2);
        MxCpp.getCurrentMxCAD().drawEntity(pl1);
        MxCpp.getCurrentMxCAD().drawEntity(pl2);
    })
}

// 大小写
async function Mx_Case() {
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    let aryIds = await MxCADUtility.userSelect("请选择文字对象", filter);
    if (aryIds.length == 0) {
        return;
    };
    // 设置关键词列表
    const getKey = new MxCADUiPrKeyWord;
    getKey.setMessage('请选择操作选项\n');
    getKey.setKeyWords("[大写(C)/小写(S)/句首大写(I)]");
    const key = await getKey.go();
    if (!key) return;

    const mxcad = MxCpp.getCurrentMxCAD();
    if (key === 'C') {
        aryIds.forEach(id => {
            const event = id.getMcDbEntity() as McDbText;
            const str = event.textString;
            const event_clone = event.clone() as McDbText;
            event_clone.textString = str.toUpperCase();
            console.log(event_clone.textString)
            event.erase();
            mxcad.drawEntity(event_clone)
        })
    } else if (key === 'S') {
        aryIds.forEach(id => {
            const event = id.getMcDbEntity() as McDbText;
            const str = event.textString;
            const event_clone = event.clone() as McDbText;
            event_clone.textString = str.toLowerCase();
            console.log(event_clone.textString)
            event.erase();
            mxcad.drawEntity(event_clone)
        })
    } else if (key === 'I') {
        aryIds.forEach(id => {
            const event = id.getMcDbEntity() as McDbText;
            const str = event.textString;
            const event_clone = event.clone() as McDbText;
            event_clone.textString = str.charAt(0).toUpperCase() + str.slice(1);
            event.erase();
            mxcad.drawEntity(event_clone)
        })
    }
}

// 数字求和
async function Mx_NumSum() {
    const filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("TEXT");
    let aryIds = await MxCADUtility.userSelect("请选择数字对象", filter);
    if (aryIds.length == 0) {
        return;
    };
    let num_arr: number[] = []
    aryIds.forEach(id => {
        const text = id.getMcDbEntity() as McDbText;
        const num = Number(text.textString);
        if (isNaN(num)) return;
        num_arr.push(num);
    })

    if (num_arr.length !== aryIds.length) return;
    let sum = num_arr.reduce((acc, curr) => acc + curr, 0);

    const getPoint = new MxCADUiPrPoint();
    const text = new McDbText();
    text.textString = sum.toString();
    text.height = 10;
    getPoint.setMessage('请选择文字插入点\n');
    getPoint.setUserDraw((pt, pw) => {
        text.position = pt;
        text.alignmentPoint = pt;
        pw.drawMcDbEntity(text);
    })
    const point = await getPoint.go();
    if (!point) return;
    const mxcad = MxCpp.getCurrentMxCAD();
    text.position = point;
    text.alignmentPoint = point;
    mxcad.drawEntity(text);
}

// 选特定字
async function Mx_SSWords() {
    const filter = new MxCADResbuf();
    // 添加对象类型，选择集只选择文字类型的对象
    filter.AddMcDbEntityTypes("TEXT")
    let ss = new MxCADSelectionSet();
    if (!await ss.userSelect("选择要查找的范围:", filter)) return;
    if (ss.count() == 0) return;
    // 设置查找模式
    const getKey = new MxCADUiPrKeyWord();
    getKey.setMessage('请选择查找模式\n');
    getKey.setKeyWords("[等于(A)/包含(B)/前缀为(C)/后缀为(D)]");
    const key = await getKey.go();
    if (!key) return;
    // 设置关键字
    const getStr = new MxCADUiPrString();
    getStr.setMessage('请输入关键字\n');
    const string = await getStr.go();
    if (!string) return;

    // 选中对象
    const mxcad = MxCpp.getCurrentMxCAD();
    let objArr: McObjectId[] = [];
    ss.forEach((id: McObjectId) => {
        const obj = id.getMcDbEntity() as McDbText;
        const str = obj.textString;
        if (key === 'A') {
            if (str === string) {
                objArr.push(id);
            }
        } else if (key === 'B') {
            if (str.includes(string)) {
                objArr.push(id);
            }
        } else if (key === 'C') {
            if (str.startsWith(string)) {
                objArr.push(id);
            }
        } else if (key === 'D') {
            if (str.endsWith(string)) {
                objArr.push(id);
            }
        }
    });
    if (objArr.length > 0) {
        objArr.forEach(id => {
            mxcad.addCurrentSelect(id)
        })
    }
}

// 前后缀
async function Mx_Prefix() {
    const filter = new MxCADResbuf();
    // 添加对象类型，选择集只选择文字类型的对象
    filter.AddMcDbEntityTypes("TEXT")
    let ss = new MxCADSelectionSet();
    if (!await ss.userSelect("选择要操作的范围:", filter)) return;
    if (ss.count() == 0) return;
    // 设置操作方式
    const getPrefType = new MxCADUiPrKeyWord();
    getPrefType.setMessage("选择操作方式");
    getPrefType.setKeyWords("[添加(A)/删除(D)]");
    let type = await getPrefType.go();
    if (!type) return;

    // 设置模式
    const getPrefModel = new MxCADUiPrKeyWord();
    getPrefModel.setMessage("选择操作位置");
    getPrefModel.setKeyWords("[前缀(P)/后缀(S)]");
    let model = await getPrefModel.go();
    if (!model) return;

    // 设置内容
    const getPrefixStr = new MxCADUiPrString();
    getPrefixStr.setMessage("请输入内容");
    const string = await getPrefixStr.go();
    if (!string) return;

    // 开始操作
    ss.forEach(id => {
        const obj = id.getMcDbEntity() as McDbText;
        const str = obj.textString;
        if (type === 'A') {
            // 添加
            if (model === 'P') {
                // 前缀
                obj.textString = string + str;
            } else if (model === 'S') {
                // 后缀
                obj.textString = str + string;
            }
        } else if (type === 'D') {
            // 删除
            if (model === 'P') {
                // 前缀
                if (str.startsWith(string)) {
                    obj.textString = str.slice(string.length)
                }
            } else if (model === 'S') {
                // 后缀
                if (str.endsWith(string)) {
                    obj.textString = str.slice(0, -string.length);
                }
            }
        }
    });
}

// 连接文字
async function Mx_ConnectText() {
    const filter = new MxCADResbuf();
    // 添加对象类型，选择集只选择文字类型的对象
    filter.AddMcDbEntityTypes('TEXT');
    const mxcad = MxCpp.getCurrentMxCAD();
    while (true) {
        const getPoint = new MxCADUiPrPoint();
        getPoint.setMessage('请选择文本\n');
        const point = await getPoint.go();
        if (!point) break;
        let objId = MxCADUtility.findEntAtPoint(point.x, point.y, point.z, -1, filter);
        mxcad.addCurrentSelect(objId);
    }

    const objIds = MxCADUtility.getCurrentSelect();
    if (!objIds.length) return;
    let str: string = '';
    objIds.forEach((objId: McObjectId, index: number) => {
        const text = objId.getMcDbEntity() as McDbText;
        str += text.textString;
        if (index !== 0) {
            objId.erase()
        }
    })
    const event = objIds.at(0).getMcDbEntity() as McDbText;
    event.textString = str;
    // 清除选择
    mxcad.mxdraw.clearMxCurrentSelect()
}

// 文字竖向
async function Mx_VerticalText() {
    const filter = new MxCADResbuf();
    // 添加对象类型，选择集只选择文字类型的对象
    filter.AddMcDbEntityTypes('TEXT');
    const getEvent = new MxCADUiPrEntity();
    getEvent.setMessage('请选择文本\n');
    const ent_id = await getEvent.go();
    if (!ent_id) return;

    const text = ent_id.getMcDbEntity() as McDbText;
    const str = text.textString.split('').join('\\P');

    const mText = new McDbMText();
    mText.contents = str;
    mText.textHeight = text.height;
    mText.location = text.position;
    mText.trueColor = text.trueColor;
    mText.colorIndex = text.colorIndex;
    mText.layerId = text.layerId;

    const mxcad = MxCpp.getCurrentMxCAD();
    ent_id.erase();
    mxcad.drawEntity(mText);

}

// 按弧对齐
async function Mx_AlignByArc(){
    // 获取目标文本
    const filter = new MxCADResbuf();
    // 添加对象类型，选择集只选择文字类型的对象
    filter.AddMcDbEntityTypes('TEXT');
    const getText = new MxCADUiPrEntity();
    getText.setFilter(filter);
    getText.setMessage('请选择文本\n');
    const ent_id = await getText.go();
    if (!ent_id.id) return;
    const text = ent_id.getMcDbEntity() as McDbText;
    text.highlight(true);


    // 获取参考圆弧
    const filter2 = new MxCADResbuf();
    filter2.AddMcDbEntityTypes('ARC');
    const getArc = new MxCADUiPrEntity();
    getArc.setFilter(filter2);
    getArc.setMessage('请选择圆弧\n');
    const arc_id = await getArc.go();
    if (!arc_id.id) return;
    const arc = arc_id.getMcDbEntity() as McDbArc;
    arc.highlight(true);

    // 切割文字，并在圆弧上取点
    const textArr:string[] = text.textString.split('');
    textArr.reverse();
    const dist:number = arc.getLength().val/(textArr.length-1);
    const mxcad = MxCpp.getCurrentMxCAD();
    for(let i = 0; i < textArr.length; i++){
        const point = arc.getPointAtDist(dist*i).val;
        const t = new McDbText();
        t.textString = textArr[i];
        t.position = t.alignmentPoint = point;
        t.horizontalMode = McDb.TextHorzMode.kTextMid;
        t.trueColor = text.trueColor;
        t.colorIndex = text.colorIndex;
        t.height = text.height;
        t.widthFactor = text.widthFactor;
        t.rotation = text.rotation;
        mxcad.drawEntity(t)
    };
    text.highlight(false);
    arc.highlight(false);
}

export function init() {
    MxFun.addCommand("Mx_AlignByLine", Mx_AlignByLine);
    MxFun.addCommand("Mx_TextHeight", Mx_TextHeight);
    MxFun.addCommand("Mx_TextWidth", Mx_TextWidth);
    MxFun.addCommand("Mx_BrushCon", Mx_BrushCon);
    MxFun.addCommand("Mx_ReplaceCon", Mx_ReplaceCon);
    MxFun.addCommand("Mx_AlignLeft", Mx_AlignLeft);
    MxFun.addCommand("Mx_AlignUp", Mx_AlignUp);
    MxFun.addCommand("Mx_TextReversal", Mx_TextReversal);
    MxFun.addCommand("Mx_TextTrim", Mx_TextTrim);
    MxFun.addCommand("Mx_TextTraming", Mx_TextTraming);
    MxFun.addCommand("Mx_Underline", Mx_Underline);
    MxFun.addCommand("Mx_TitleLine", Mx_TitleLine);
    MxFun.addCommand("Mx_Case", Mx_Case);
    MxFun.addCommand("Mx_NumSum", Mx_NumSum);
    MxFun.addCommand("Mx_SSWords", Mx_SSWords);
    MxFun.addCommand("Mx_Prefix", Mx_Prefix);
    MxFun.addCommand("Mx_ConnectText", Mx_ConnectText);
    MxFun.addCommand("Mx_VerticalText", Mx_VerticalText);
    MxFun.addCommand("Mx_AlignByArc", Mx_AlignByArc);
}