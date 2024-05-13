///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxFun } from "mxdraw";
import {
    MxCpp,
    McDbLine,
    McGePoint3d,
    McDbCustomEntity,
    IMcDbDwgFiler,
    MxCADWorldDraw,
    McGePoint3dArray,
    MxCADUiPrPoint,
    McGeVector3d,
    McDbText,
    McDb,
    MxCADResbuf,
    MxCADSelectionSet,
    McObjectId,
    McDbCircle,

} from "mxcad"

// LineText
class McDbLineText extends McDbCustomEntity {

    private pt1: McGePoint3d = new McGePoint3d();
    private pt2: McGePoint3d = new McGePoint3d();
    private _text: string = "";
    private _textsize: number = 10;

    constructor(imp?: any) {
        super(imp);
    }

    public create(imp: any) {
        return new McDbLineText(imp)
    }

    public getTypeName(): string {
        return "McDbLineText";
    }

    public set text(val: string) {
        this._text = val;
    }

    public get text(): string {
        return this._text;
    }

    public set textsize(val: number) {
        this._textsize = val;
    }

    public get textsize(): number {
        return this._textsize;
    }


    public dwgInFields(filter: IMcDbDwgFiler): boolean {
        this.pt1 = filter.readPoint("pt1").val;
        this.pt2 = filter.readPoint("pt2").val;
        this._text = filter.readString("text").val;
        this._textsize = filter.readDouble("textsize").val;


        return true;
    }

    public dwgOutFields(filter: IMcDbDwgFiler): boolean {
        filter.writePoint("pt1", this.pt1);
        filter.writePoint("pt2", this.pt2);
        filter.writeString("text", this._text);
        filter.writeDouble("textsize", this._textsize);
        return true;
    }

    private fineLink(pt: McGePoint3d): any {
        let ret: any = {};
        let myId = this.getObjectID();
        let dSearch = this._textsize * 0.5;;
        let filter = new MxCADResbuf();
        filter.AddString("McDbCustomEntity", 5020);

        let ss = new MxCADSelectionSet();
        ss.crossingSelect(pt.x - dSearch, pt.y - dSearch, pt.x + dSearch, pt.y + dSearch, filter);
        ss.forEach((id) => {
            if (id == myId)
                return;
            let ent = id.getMcDbEntity();
            if (!ent) return;
            if (ent instanceof McDbLineText) {
                let line = (ent as McDbLineText);
                let linkPoint = line.getPoint1();
                let link_pos = 0;

                // 得到直线与图块连接的端点坐标.
                let dist = line.getPoint1().distanceTo(pt);
                if (dist > line.getPoint2().distanceTo(pt)) {
                    dist = line.getPoint2().distanceTo(pt);
                    linkPoint = line.getPoint2();
                    link_pos = 1;
                }
                if (dist < dSearch) {
                    ret[id.id] = { link_point: linkPoint,link_pos:link_pos };
                }
            }
        });
        return ret;
    }

    public moveGripPointsAt(iIndex: number, dXOffset: number, dYOffset: number, dZOffset: number) {
        this.assertWrite();

        let pt:McGePoint3d = this.pt1.clone();
        let new_pt:McGePoint3d = pt;
        if (iIndex == 0) {
            this.pt1.x += dXOffset;
            this.pt1.y += dYOffset;
            this.pt1.z += dZOffset;
            new_pt = this.pt1;
        }
        else if (iIndex == 1) {
            pt = this.pt2.clone();

            this.pt2.x += dXOffset;
            this.pt2.y += dYOffset;
            this.pt2.z += dZOffset;
            new_pt = this.pt2;
        }

        if (this.getObjectID().isValid()) {

            // 同步，与连接的其它对象。
            let linkobj = this.fineLink(pt)
            Object.keys(linkobj).forEach((id_val:any)=>{
                let idFind = new McObjectId(id_val);
                let lineFind = (idFind.getMcDbEntity() as McDbLineText);

                if(linkobj[id_val].link_pos == 0){
                    lineFind.setPoint1(new_pt);
                }
                else{
                    lineFind.setPoint2(new_pt);
                }
              });
        }
    };

    public getGripPoints(): McGePoint3dArray {
        let ret = new McGePoint3dArray()
        ret.append(this.pt1);
        ret.append(this.pt2);
        return ret;
    };



    public worldDraw(draw: MxCADWorldDraw): void {

        let circle_r = this._textsize * 0.4;
        let vec2 = this.pt2.sub(this.pt1);
        vec2.normalize().mult(circle_r);

        let tmpline = new McDbLine(this.pt1.clone().addvec(vec2), this.pt2.clone().subvec(vec2));
        draw.drawEntity(tmpline);

        let vec = this.pt2.sub(this.pt1).mult(0.5);
        let midpt = this.pt1.clone().addvec(vec);


        if (vec.dotProduct(McGeVector3d.kXAxis) < 0) {
            vec.negate();
        }

        let ange = vec.angleTo2(McGeVector3d.kXAxis, McGeVector3d.kNegateZAxis);

        let str = this._text;
        if (str.length == 0) {
            str = this.pt1.distanceTo(this.pt2).toFixed(2);
        }
        vec.perpVector();
        if (vec.dotProduct(McGeVector3d.kYAxis) < 0) {
            vec.negate();
        }
        vec.normalize().mult(this._textsize * 0.2);

        let text = new McDbText();
        text.textString = str;
        text.position = midpt.clone().addvec(vec);
        text.alignmentPoint = midpt.clone().addvec(vec);
        text.rotation = ange;
        text.verticalMode = McDb.TextVertMode.kTextBottom;
        text.horizontalMode = McDb.TextHorzMode.kTextCenter;
        text.height = this._textsize;

        draw.drawEntity(text)


        let circle1 = new McDbCircle();
        circle1.center = this.pt1;
        circle1.radius = circle_r;
        draw.drawEntity(circle1);

        let circle2= new McDbCircle();
        circle2.center = this.pt2;
        circle2.radius = circle_r;
        draw.drawEntity(circle2);

    }

    //
    public setPoint1(pt1: McGePoint3d) {
        this.assertWrite();
        this.pt1 = pt1.clone();
    }

    public setPoint2(pt2: McGePoint3d) {
        this.assertWrite();
        this.pt2 = pt2.clone();
    }

    public getPoint1() {
        return this.pt1;
    }

    public getPoint2() {
        return this.pt2;
    }
}

export async function MxTest_LineText() {
    /*
    let mxcad = MxCpp.getCurrentMxCAD();
    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("\n指定一点:");
    let pt1 = (await getPoint.go());
    if (!pt1) return;

    getPoint.setBasePt(pt1);
    getPoint.setUseBasePt(true);

    getPoint.setMessage("\n指定二点:");
    let pt2 = (await getPoint.go());
    if (!pt2) return;

    let myline = new McDbLineText();
    myline.setPoint1(pt1);
    myline.setPoint2(pt2);
    myline.textsize = mxcad.mxdraw.screenCoordLong2Doc(10);

    mxcad.drawEntity(myline);
    */
    let mxcad = MxCpp.getCurrentMxCAD();
    //清空当前显示内容
    mxcad.newFile();

    let pt1 = new McGePoint3d(100,100,0);
    let pt2 = new McGePoint3d(200,150,0);
    let pt3 = new McGePoint3d(400,50,0);
    let pt4 = new McGePoint3d(600,60,0);
    let pt5 = new McGePoint3d(200,300,0);

    let textsize = 5;

    let myline1 = new McDbLineText();
    myline1.setPoint1(pt1);
    myline1.setPoint2(pt2);
    myline1.textsize = textsize;
    myline1.text = "xxxx";
    mxcad.drawEntity(myline1);


    let myline2 = new McDbLineText();
    myline2.setPoint1(pt2);
    myline2.setPoint2(pt3);
    myline2.textsize = textsize;
    mxcad.drawEntity(myline2);

    let myline3 = new McDbLineText();
    myline3.setPoint1(pt3);
    myline3.setPoint2(pt4);
    myline3.textsize = textsize;
    mxcad.drawEntity(myline3);


    let myline4 = new McDbLineText();
    myline4.setPoint1(pt2);
    myline4.setPoint2(pt5);
    myline4.textsize = textsize;
    mxcad.drawEntity(myline4);


    //把所有的实体都放到当前显示视区
    mxcad.zoomW(new McGePoint3d(-300,-300,0),new McGePoint3d(650,500,0));

    //更新视区显示
    mxcad.updateDisplay();
}



export function init() {

    MxFun.addCommand("MxTest_LineText", MxTest_LineText);
    new McDbLineText().rxInit();
}
