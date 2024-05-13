///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { DynamicInputType, MxFun } from "mxdraw";
import {
    MxCpp,
    McDbLine,
    McGePoint3d,
    McDbCustomEntity,
    IMcDbDwgFiler,
    MxCADWorldDraw,
    McGePoint3dArray,
    McDbPoint,
    MxCADUiPrPoint,
    McObjectId,
    McDbPolyline,
    McDbHatch,
    MxCADSelectionSet,
    MxCADResbuf,
} from "mxcad"

class McDbGisEntity extends McDbCustomEntity {
    public create(imp?: any): McDbCustomEntity {
        throw new Error("Method not implemented.");
    }
    public getTypeName(): string {
        throw new Error("Method not implemented.");
    }
    public dwgInFields(filter: IMcDbDwgFiler): boolean {
        throw new Error("Method not implemented.");
    }
    public dwgOutFields(filter: IMcDbDwgFiler): boolean {
        throw new Error("Method not implemented.");
    }
    public worldDraw(draw: MxCADWorldDraw): void {
        throw new Error("Method not implemented.");
    }
};

// Point
class McDbGisPoint extends McDbGisEntity {

    private pt: McGePoint3d = new McGePoint3d();


    constructor(imp?: any) {
        super(imp);
    }

    public create(imp: any) {
        return new McDbGisPoint(imp)
    }

    public getTypeName(): string {
        return "McDbGisPoint";
    }

    public dwgInFields(filter: IMcDbDwgFiler): boolean {
        this.pt = filter.readPoint("pt").val;
        return true;
    }

    public dwgOutFields(filter: IMcDbDwgFiler): boolean {
        filter.writePoint("pt", this.pt);
        return true;
    }


    public moveGripPointsAt(iIndex: number, dXOffset: number, dYOffset: number, dZOffset: number) {
        this.assertWrite();
        if (iIndex == 0) {
            this.pt.x += dXOffset;
            this.pt.y += dYOffset;
            this.pt.z += dZOffset;
        }

    };

    public getGripPoints(): McGePoint3dArray {
        let ret = new McGePoint3dArray()
        ret.append(this.pt);
        return ret;
    };



    public worldDraw(draw: MxCADWorldDraw): void {
        draw.drawEntity(new McDbPoint(this.pt));
    }

    //
    public setPoint(pt: McGePoint3d) {
        this.assertWrite();
        this.pt = pt.clone();
    }

    public getPoint(): McGePoint3d {
        return this.pt;
    }
}


// MultiPoint
class McDbGisMultiPoint extends McDbGisEntity {

    private pts: McGePoint3d[] = [];

    constructor(imp?: any) {
        super(imp);
    }

    public create(imp: any) {
        return new McDbGisMultiPoint(imp)
    }

    public getTypeName(): string {
        return "McDbGisMultiPoint";
    }

    public dwgInFields(filter: IMcDbDwgFiler): boolean {
        this.pts = filter.readPoints("pts").val;
        return true;
    }

    public dwgOutFields(filter: IMcDbDwgFiler): boolean {
        filter.writePoints("pts", this.pts);
        return true;
    }

    public moveGripPointsAt(iIndex: number, dXOffset: number, dYOffset: number, dZOffset: number) {
        this.assertWrite();
        if (iIndex >= 0 && iIndex < this.pts.length) {
            this.pts[iIndex].x += dXOffset;
            this.pts[iIndex].y += dYOffset;
            this.pts[iIndex].z += dZOffset;
        }
    };

    public getGripPoints(): McGePoint3dArray {
        let ret = new McGePoint3dArray()
        this.pts.forEach(val => {
            ret.append(val);
        })
        return ret;
    };



    public worldDraw(draw: MxCADWorldDraw): void {
        this.pts.forEach(val => {
            draw.drawEntity(new McDbPoint(val));
        })
    }

    //
    public setPoint(index: number, pt: McGePoint3d) {
        this.assertWrite();
        if (index >= 0 && index < this.pts.length) {
            this.pts[index] = pt.clone();
        }
    }

    public getPoint(index: number): McGePoint3d {
        if (index >= 0 && index < this.pts.length) {
            return this.pts[index];
        }
        else {
            return new McGePoint3d();
        }
    }

    public addPoint(pt: McGePoint3d) {
        this.pts.push(pt.clone());
    }

    public removeAllPoint(): void {
        this.pts = [];
    }

    public getPointCount(): number {
        return this.pts.length;
    }
}



// LineString
class McDbGisLineString extends McDbGisEntity {

    private pts: McGePoint3d[] = [];

    constructor(imp?: any) {
        super(imp);
    }

    public create(imp: any) {
        return new McDbGisLineString(imp)
    }

    public getTypeName(): string {
        return "McDbGisLineString";
    }

    public dwgInFields(filter: IMcDbDwgFiler): boolean {
        this.pts = filter.readPoints("pts").val;
        return true;
    }

    public dwgOutFields(filter: IMcDbDwgFiler): boolean {
        filter.writePoints("pts", this.pts);
        return true;
    }

    public moveGripPointsAt(iIndex: number, dXOffset: number, dYOffset: number, dZOffset: number) {
        this.assertWrite();
        if (iIndex >= 0 && iIndex < this.pts.length) {
            this.pts[iIndex].x += dXOffset;
            this.pts[iIndex].y += dYOffset;
            this.pts[iIndex].z += dZOffset;
        }
    };

    public getGripPoints(): McGePoint3dArray {
        let ret = new McGePoint3dArray()
        this.pts.forEach(val => {
            ret.append(val);
        })
        return ret;
    };



    public worldDraw(draw: MxCADWorldDraw): void {
        let pl = new McDbPolyline();
        this.pts.forEach(val => {
            pl.addVertexAt(val);
        })
        draw.drawEntity(pl);
    }

    //
    public setPoint(index: number, pt: McGePoint3d) {
        this.assertWrite();
        if (index >= 0 && index < this.pts.length) {
            this.pts[index] = pt.clone();
        }
    }

    public getPoint(index: number): McGePoint3d {
        if (index >= 0 && index < this.pts.length) {
            return this.pts[index];
        }
        else {
            return new McGePoint3d();
        }
    }

    public addPoint(pt: McGePoint3d) {
        this.pts.push(pt.clone());
    }

    public removeAllPoint(): void {
        this.pts = [];
    }

    public getPointCount(): number {
        return this.pts.length;
    }
}




// MultiLineString
class McDbGisMultiLineString extends McDbGisEntity {
    private ptss: McGePoint3d[][] = [];

    constructor(imp?: any) {
        super(imp);
    }

    public create(imp: any) {
        return new McDbGisMultiLineString(imp)
    }

    public getTypeName(): string {
        return "McDbGisMultiLineString";
    }

    public dwgInFields(filter: IMcDbDwgFiler): boolean {
        this.ptss = [];
        let ptss_n = filter.readLong("ptss_n");
        for (let i = 0; i < ptss_n.val; i++) {
            let pts = filter.readPoints("ptss_" + i);
            if (pts.ret) {
                this.ptss.push(pts.val);
            }
        }
        return true;
    }

    public dwgOutFields(filter: IMcDbDwgFiler): boolean {
        filter.writeLong("ptss_n", this.ptss.length);
        this.ptss.forEach((pts, index) => {
            filter.writePoints("ptss_" + index, pts);
        })
        return true;
    }

    public moveGripPointsAt(iIndex: number, dXOffset: number, dYOffset: number, dZOffset: number) {
        this.assertWrite();
        let iCount = 0;
        for (let i = 0; i < this.ptss.length; i++) {
            let pts = this.ptss[i];
            for (let j = 0; j < pts.length; j++) {
                if (iCount == iIndex) {
                    this.ptss[i][j].x += dXOffset;
                    this.ptss[i][j].y += dYOffset;
                    this.ptss[i][j].z += dZOffset;
                    i = this.ptss.length;
                    break;
                }
                iCount++;
            }
        }
    };

    public getGripPoints(): McGePoint3dArray {
        let ret = new McGePoint3dArray()
        this.ptss.forEach(pts => {
            pts.forEach((pt) => {
                ret.append(pt);
            })
        })
        return ret;
    };



    public worldDraw(draw: MxCADWorldDraw): void {

        for (let i = 0; i < this.ptss.length; i++) {
            let pts = this.ptss[i];
            let pl = new McDbPolyline();
            pts.forEach(val => {
                pl.addVertexAt(val);
            })
            draw.drawEntity(pl);
        }
    }

    public addPoints(pts: McGePoint3d[]) {
        this.ptss.push(pts);
    }

    public removeAllPoint(): void {
        this.ptss = [];
    }

    public getPointsCount(): number {
        return this.ptss.length;
    }

    public getPoints(index: number): McGePoint3d[] {
        if (index >= 0 && index < this.ptss.length) {
            return this.ptss[index];
        }
        else {
            return [];
        }
    }
}

// Polygon
class McDbGisPolygon extends McDbGisEntity {
    private ptss: McGePoint3d[][] = [];

    constructor(imp?: any) {
        super(imp);
    }

    public create(imp: any) {
        return new McDbGisPolygon(imp)
    }

    public getTypeName(): string {
        return "McDbGisPolygon";
    }

    public dwgInFields(filter: IMcDbDwgFiler): boolean {
        this.ptss = [];
        let ptss_n = filter.readLong("ptss_n");
        for (let i = 0; i < ptss_n.val; i++) {
            let pts = filter.readPoints("ptss_" + i);
            if (pts.ret) {
                this.ptss.push(pts.val);
            }
        }
        return true;
    }

    public dwgOutFields(filter: IMcDbDwgFiler): boolean {
        filter.writeLong("ptss_n", this.ptss.length);
        this.ptss.forEach((pts, index) => {
            filter.writePoints("ptss_" + index, pts);
        })
        return true;
    }

    public moveGripPointsAt(iIndex: number, dXOffset: number, dYOffset: number, dZOffset: number) {
        this.assertWrite();
        let iCount = 0;
        for (let i = 0; i < this.ptss.length; i++) {
            let pts = this.ptss[i];
            for (let j = 0; j < pts.length; j++) {
                if (iCount == iIndex) {
                    this.ptss[i][j].x += dXOffset;
                    this.ptss[i][j].y += dYOffset;
                    this.ptss[i][j].z += dZOffset;
                    i = this.ptss.length;
                    break;
                }
                iCount++;
            }
        }
    };

    public getGripPoints(): McGePoint3dArray {
        let ret = new McGePoint3dArray()
        this.ptss.forEach(pts => {
            pts.forEach((pt) => {
                ret.append(pt);
            })
        })
        return ret;
    };



    public worldDraw(draw: MxCADWorldDraw): void {
        let solid = new McDbHatch();
        for (let i = 0; i < this.ptss.length; i++) {
            let pts = this.ptss[i];
            if (pts.length > 2) {
                solid.appendLoop(new McGePoint3dArray(pts));
            }
        }
        if (solid.numLoops > 0) {
            draw.drawEntity(solid);
        }
    }

    public addPoints(pts: McGePoint3d[]) {
        this.ptss.push(pts);
    }

    public removeAllPoint(): void {
        this.ptss = [];
    }

    public getPointsCount(): number {
        return this.ptss.length;
    }

    public getPoints(index: number): McGePoint3d[] {
        if (index >= 0 && index < this.ptss.length) {
            return this.ptss[index];
        }
        else {
            return [];
        }
    }
}


//
export async function MxGis_DrawPoint() {
    let mxcad = MxCpp.getCurrentMxCAD();
    let getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("点取一个点坐标");
    let pt = await getPoint.go();
    if (pt) {
        let point = new McDbGisPoint();
        point.setPoint(pt);
        mxcad.drawEntity(point);
    }
}

export async function MxGis_DrawMultiPoint() {
    let mxcad = MxCpp.getCurrentMxCAD();
    let getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("点取一个点坐标");
    let points = new McDbGisMultiPoint();
    let aryTmpEntityId: McObjectId[] = [];
    while (true) {
        getPoint.clearLastInputPoint();
        getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
        let pt = await getPoint.go();
        if (pt) {
            points.addPoint(pt);
            let point = new McDbPoint(pt);
            aryTmpEntityId.push(mxcad.drawEntity(point));
        }
        else {
            break;
        }
    }

    if (points.getPointCount() > 0) {
        mxcad.drawEntity(points)
    }

    aryTmpEntityId.forEach(id => {
        id.erase();
    })
}

export async function MxGis_DrawLineString() {
    let mxcad = MxCpp.getCurrentMxCAD();
    let getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("点取一个点坐标");
    let lines = new McDbGisLineString();
    let aryTmpEntityId: McObjectId[] = [];
    let prvPoint: any = undefined;
    while (true) {
        if (prvPoint) {
            getPoint.setBasePt(prvPoint);
            getPoint.setUseBasePt(true);
        }
        getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
        let pt = await getPoint.go();
        if (pt) {
            lines.addPoint(pt);

            if (prvPoint) {
                let line = new McDbLine();
                line.startPoint = prvPoint;
                line.endPoint = pt;
                aryTmpEntityId.push(mxcad.drawEntity(line));
            }
            prvPoint = pt;
        }
        else {
            break;
        }
    }

    if (lines.getPointCount() > 1) {
        mxcad.drawEntity(lines)
    }

    aryTmpEntityId.forEach(id => {
        id.erase();
    })
}

export async function MxGis_DrawMultiLineString() {
    let mxcad = MxCpp.getCurrentMxCAD();
    let getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("点取一个点坐标");
    getPoint.setKeyWords("[下一段线(N)]")
    let lines = new McDbGisMultiLineString();

    let pts: McGePoint3d[] = [];
    let aryTmpEntityId: McObjectId[] = [];
    let prvPoint: any = undefined;

    while (true) {
        if (prvPoint) {
            getPoint.setBasePt(prvPoint);
        }
        else {
            getPoint.setUseBasePt(false);
        }

        getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
        let pt = await getPoint.go();

        if (getPoint.isKeyWordPicked("N")) {
            if (pts.length > 1) {
                lines.addPoints(pts);
            }
            pts = [];
            prvPoint = undefined;
        }
        else {
            if (pt) {
                pts.push(pt);

                if (prvPoint) {
                    let line = new McDbLine();
                    line.startPoint = prvPoint;
                    line.endPoint = pt;
                    aryTmpEntityId.push(mxcad.drawEntity(line));
                }
                prvPoint = pt;
            }
            else {
                break;
            }
        }

    }

    if (pts.length > 1) {
        lines.addPoints(pts);
    }

    if (lines.getPointsCount() > 0) {
        mxcad.drawEntity(lines);
    }

    aryTmpEntityId.forEach(id => {
        id.erase();
    })
}

export async function MxGis_DrawPolygon() {
    let mxcad = MxCpp.getCurrentMxCAD();
    let getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("点取一个点坐标");
    let polygon = new McDbGisPolygon();

    let pts: McGePoint3d[] = [];
    let aryTmpEntityId: McObjectId[] = [];
    let prvPoint: any = undefined;

    while (true) {
        if (prvPoint) {
            getPoint.setBasePt(prvPoint);
        }
        else {
            getPoint.setUseBasePt(false);
        }
        if (pts.length > 2) {
            getPoint.setKeyWords("[闭合(C)/退出(E)]")
        }

        getPoint.setDynamicInputType(DynamicInputType.kXYCoordInput);
        let pt = await getPoint.go();

        if (getPoint.isKeyWordPicked("C")) {

            let line = new McDbLine();
            line.startPoint = pts[0];
            line.endPoint = pts[pts.length - 1];
            aryTmpEntityId.push(mxcad.drawEntity(line));

            if (pts.length > 2) {
                polygon.addPoints(pts);
            }
            pts = [];
            prvPoint = undefined;
        }
        else if (getPoint.isKeyWordPicked("E")) {
            break;
        }
        else {
            if (pt) {
                pts.push(pt);

                if (prvPoint) {
                    let line = new McDbLine();
                    line.startPoint = prvPoint;
                    line.endPoint = pt;
                    aryTmpEntityId.push(mxcad.drawEntity(line));
                }
                prvPoint = pt;
            }
            else {
                break;
            }
        }

    }

    if (pts.length > 2) {
        polygon.addPoints(pts);
    }

    if (polygon.getPointsCount() > 0) {
        mxcad.drawEntity(polygon);
    }

    aryTmpEntityId.forEach(id => {
        id.erase();
    })

}

export function MxGis_Get_geojson() {
    let ss = new MxCADSelectionSet();
    let filter = new MxCADResbuf();
    filter.AddMcDbEntityTypes("McDbCustomEntity");
    ss.allSelect(filter);
    let genjson = { "type": "FeatureCollection", "features": [] };

    ss.forEach((id) => {
        let ent = id.getMcDbEntity();
        if (!ent) return;

        if (ent instanceof McDbGisPoint) {
            let point = (ent as McDbGisPoint);
            let pt = point.getPoint();
            let feature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [pt.x, pt.y, pt.z]
                }
            };
            genjson.features.push(feature);
        }
        else if (ent instanceof McDbGisMultiPoint) {
            let points = (ent as McDbGisMultiPoint);
            let pts = [];
            let len = points.getPointCount();
            for (let i = 0; i < len; i++) {
                let pt = points.getPoint(i);
                pts.push([pt.x, pt.y, pt.z]);
            }

            let feature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "MultiPoint",
                    "coordinates": pts
                }
            };
            genjson.features.push(feature);
        }
        else if (ent instanceof McDbGisLineString) {
            let line = (ent as McDbGisLineString);

            let pts = [];
            let len = line.getPointCount();
            for (let i = 0; i < len; i++) {
                let pt = line.getPoint(i);
                pts.push([pt.x, pt.y, pt.z]);
            }

            let feature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": pts
                }
            };
            genjson.features.push(feature);
        }
        else if (ent instanceof McDbGisMultiLineString) {
            let lines = (ent as McDbGisMultiLineString);
            let ptss = [];
            let len = lines.getPointsCount();
            for (let i = 0; i < len; i++) {
                let pts = lines.getPoints(i);
                let ary = [];
                for (let j = 0; j < pts.length; j++) {
                    let pt = pts[j];
                    ary.push([pt.x, pt.y, pt.z]);
                }
                ptss.push(ary);
            }

            let feature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "MultiLineString",
                    "coordinates": ptss
                }
            };
            genjson.features.push(feature);
        }
        else if (ent instanceof McDbGisPolygon) {
            let lines = (ent as McDbGisPolygon);
            let ptss = [];
            let len = lines.getPointsCount();
            for (let i = 0; i < len; i++) {
                let pts = lines.getPoints(i);
                let ary = [];
                for (let j = 0; j < pts.length; j++) {
                    let pt = pts[j];
                    ary.push([pt.x, pt.y, pt.z]);
                }
                ptss.push(ary);
            }

            let feature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": ptss
                }
            };
            genjson.features.push(feature);
        }
    })
    console.log(JSON.stringify(genjson));
}




export function init() {
    MxFun.addCommand("MxGis_DrawPoint", MxGis_DrawPoint);
    MxFun.addCommand("MxGis_DrawMultiPoint", MxGis_DrawMultiPoint);
    MxFun.addCommand("MxGis_DrawLineString", MxGis_DrawLineString);
    MxFun.addCommand("MxGis_DrawMultiLineString", MxGis_DrawMultiLineString);
    MxFun.addCommand("MxGis_DrawPolygon", MxGis_DrawPolygon);
    MxFun.addCommand("MxGis_Get_geojson", MxGis_Get_geojson);

    new McDbGisPoint().rxInit();
    new McDbGisMultiPoint().rxInit();
    new McDbGisLineString().rxInit();
    new McDbGisMultiLineString().rxInit();
    new McDbGisPolygon().rxInit();
}
