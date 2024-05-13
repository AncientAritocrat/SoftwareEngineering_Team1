///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { MxFun, MxDbRectBoxLeadComment, MrxDbgUtils, MxDrawObject } from "mxdraw"
import { DxfCode, McCmColor, McDb, McDbCurve, McDbEntity, McDbLine, McDbPolyline, McDbRasterImage, McDbRasterImageDef, McGeBound, MxCADPluginBase, MxCADPluginMapDefaultData, MxCADResbuf, MxCADSelectionSet, MxCADUiPrEntity, MxCADUiPrPoint, MxPropertiesWindowCustomValueType, MxTools } from "mxcad"
import { createApp } from "vue";
import Test from "./Test.vue"
import { useModalVisible } from "./Modal/hooks";
import { McDbAttribute, McDbBlockReference, McDbText, McGePoint3d, McObject, McObjectId, MxCADUI, MxCpp } from "mxcad";
import { init as iframeinit } from "./iframe"
import { init as commentinit } from "./comment"
import { init as paramdrawinit } from "./paramdraw"
import { init as measureinit } from "./measure"
import { init as interactiveinit } from "./interactive"
import { init as databaseinit } from "./database"
import { init as cadfileinit } from "./cadfile"
import { init as findtextinit } from "./findtext"
import { init as drawcustomtinit } from "./customEntity"
import { init as makeblock } from "./makeblock"
import { init as hatchinit } from "./hatch"
import { init as aiinit } from "./mxai/MxAiModule"
import { init as init_userdemo } from "./userdemo"
import { init as init_gis_entity } from "./gis/gis_entity"
import { init as toolsinit } from "./extools/fitTools"
import { init as textToolsinit } from "./extools/textTools"
import { init as blockToolsinit } from "./extools/blockTools"
import { init as countToolsinit } from "./extools/countTools"
import { init as drawToolsinit } from "./extools/drawTools"
import { MxTest_Map_Download, getMapDefaultData, init as gisinit } from "./gis/init"
import "./icon/index.js"
import { mxtest_add_3d_model } from "./gis/add_3d_model";


//@ts-ignore
if (import.meta.env.MODE === "debug") {
    const ws = new WebSocket('ws://localhost:24678');
    ws.addEventListener('message', (event) => {
        const info = JSON.parse(event.data)
        if (info.type === "full-reload") location.reload();
    });
}

class MxCADPlugin extends MxCADPluginBase {
    constructor() {
        super()
        this.map_default_data = getMapDefaultData();
        //this.openFile = "test3.mxweb";
        //this.openFile = "testcad.dwg.mxweb";
        //this.openFile = "http://localhost:1337/mxcad/file/a9cbed3d3a351b79f24484e87bd78338.DWG.mxweb"
    }
}

let mxcadui: MxCADUI;
const { showModal, hideModal, showTools } = useModalVisible()

async function My_PluginTest() {
    showModal({
        title: "My Test Draw",
        text: "测试Modal",
        oncancel: () => {
            // 取消
            hideModal()
        },
        onsubmit: () => {
            // 确定
            hideModal()
        },
        ongetallentity: () => {
            // 确定
            hideModal()
            MxFun.sendStringToExecute("TestGetAllEntity")
        },
        ondrawline: () => {
            // 确定
            hideModal()
            MxFun.sendStringToExecute("Mx_Circle")
        },
        docommand: (cmd) => {
            hideModal()
            MxFun.sendStringToExecute(cmd)
        }
    })
}
async function My_Extool() {
  showTools({
    title: "My Extension Tools",
    text: "扩展工具",
    oncancel: () => {
      // 取消
      hideModal()
    },
    docommand: (cmd) => {
      hideModal()
      MxFun.sendStringToExecute(cmd)
    }
  })
}

const div = document.createElement("div")
document.body.appendChild(div)
const app = createApp(Test)
app.mount(div)
iframeinit();


// cad应用加载开始。
MxFun.on("mxcadApplicationStart", async (mxcaduiimp: MxCADUI) => {
    mxcadui = mxcaduiimp;
    mxcadui.init(new MxCADPlugin());
});

MxFun.on("mxcadApplicationInitMap", () => {
    gisinit(mxcadui.mxmap);
});





// MxCAD创建成功
MxFun.on("mxcadApplicationCreatedMxCADObject", (param) => {

    MxCpp.App.addNetworkLoadingFont( ["txt.shx","simplex.shx","aaa.shx","ltypeshp.shx","complex.shx"]);
    MxCpp.App.addNetworkLoadingBigFont(["hztxt.shx", "gbcbig.shx"])
    MxCpp.App.addNetworkLoadingTrueTypeFont(["simsun","syadobe"],["思原宋体","思原黑体"],["stadobe.otf","syadobe.otf"]);

    let mxcad: McObject = param.mxcad;

    //mxcad.setViewBackgroundColor(255, 255, 255);
    // 对象选择事件
    mxcad.on("selectChange", (ids: McObjectId[]) => {
        if (ids.length == 0) return;
        let id = ids[0];
        let mxent = id.getMxDbEntity();
        if (mxent !== null) {
            console.log(mxent.getTypeName());
            if (mxent instanceof MxDbRectBoxLeadComment) {
                let comment: MxDbRectBoxLeadComment = mxent;
                console.log(comment.text);
                //comment.text = "xxxx";
                //comment.setNeedUpdateDisplay();
            }
            //...
            return;
        }
        let ent = id.getMcDbEntity();
        if (ent !== null) {
            console.log(ent.objectName);
            if (ent instanceof McDbText) {
                let text: McDbText = ent;
                console.log(text.textString);
            }
            else if (ent instanceof McDbBlockReference) {
                let blkRef: McDbBlockReference = ent;
                let aryId = blkRef.getAllAttribute();
                aryId.forEach((id) => {
                    let attribt: McDbAttribute = id.getMcDbEntity() as any;
                    console.log(attribt.textString);
                    console.log(attribt.tag);
                })
            }
            //...
        }
    });



    // 属性界面上，得到对象属性事件。
    MxCpp.PropertiesWindow.onEvent_getProperties((id: McObjectId) => {
        let ent = id.getMcDbEntity();
        if (!ent) return [];
        let dn = ent.getxDataDouble("DN");
        let len = ent.getxDataDouble("LEN");
        let ret = [];

        if (dn.ret) {
            ret.push({
                sVarName: "DN",
                iVarType: MxPropertiesWindowCustomValueType.kDouble,
                val: dn.val,
                isOnlyRead: false
            });
        }

        if (len.ret) {
            ret.push({
                sVarName: "LEN",
                iVarType: MxPropertiesWindowCustomValueType.kDouble,
                val: len.val,
                isOnlyRead: false
            });
        }
        return ret;
    })

    // 属性界面上，对象属性被修改事件。
    MxCpp.PropertiesWindow.onEvent_setProperties((id: McObjectId, prop: any) => {
        let ent = id.getMcDbEntity();
        if (!ent) return;
        if (prop.sVarName == "DN") {
            ent.setxDataDouble("DN", prop.val);
        }
        else if (prop.sVarName == "LEN") {
            ent.setxDataDouble("LEN", prop.val);
        }
    });

});


export function getMxCADUi(): MxCADUI {
    return mxcadui;
}

export function McGePoint3dToString(pt: McGePoint3d): string {
    return "x=" + pt.x + ",y=" + pt.y + ",z=" + pt.z;
}


// test command
function Mx_Open_DemoCode() {
    window.open("https://demo.mxdraw3d.com:3562/MxCADCode.7z")
}

function Mx_Open_DevInstall() {
    window.open("https://demo.mxdraw3d.com:3562/MxDrawCloudServer1.0TryVersion.7z")
}

function getMapUrl(type) {
    var url = window.location.href;
    if (url.indexOf("?") != -1) {
        url = url.replace(/(\?|#)[^'"]*/, '');
    }
    return `${url}?map=true&maptype=${type}`
}

function Mx_Open_Map_gdslwzj() {

    window.open(getMapUrl("gdslwzj"))
}


function Mx_Open_Map_googlecn() {

    window.open(getMapUrl("google"))
}


function Mx_Open_Map_gdyx() {
    window.open(getMapUrl("gdyx"))
}

function Mx_Open_Map_tdtsl() {
    window.open(getMapUrl("tdtsl"))
}

function Mx_Open_Map_bdsl() {
    window.open(getMapUrl("bdsl"))
}

function Mx_Open_Map_geoq() {
    window.open(getMapUrl("geoq"))
}


function Mx_ViewBackgroundColor() {
    MxCpp.getCurrentMxCAD().setViewBackgroundColor(255, 255, 255);
    MxFun.callEvent("updateBackgroundColor", new McCmColor(255, 255, 255))
}


async function Mx_TestExProp() {
    let selEntity1 = new MxCADUiPrEntity();

    selEntity1.setMessage("选择要需要开启自定义属性的对象");
    let idText = await selEntity1.go();
    if (!idText.isValid()) return;

    let ent = idText.getMcDbEntity();
    MxCpp.PropertiesWindow.setEntitySupportCustom(idText);

    // 设置对象扩展属性值。
    ent.setxDataDouble("DN", 100);
    ent.setxDataDouble("LEN", 2000);
}

function Mx_Test_OpenFile() {
    let mxcad = MxCpp.getCurrentMxCAD();
    mxcad.openWebFile("http://localhost:1337/mxcad/file/a9cbed3d3a351b79f24484e87bd78338.DWG.mxweb");

    //
}

async function Mx_Test_GetFile() {
    //let pat = await MxTools.getFileFromUrl("fonts/mx.pat");
    //console.log(pat.text());

    //MxFun.isRunningCommand()
    //MxFun.sendStringToExecute("Mx_Pan");
    //MxFun.stopRunCommand();
}

async function Mx_SelectEntitHideLayer() {
    let selEntity1 = new MxCADUiPrEntity();

    selEntity1.setMessage("选择要隐藏的对象");
    let id = await selEntity1.go();
    if (!id.isValid()) return;

    let ent = id.getMcDbEntity();
    let mxcad = MxCpp.getCurrentMxCAD();
    let layerTable = mxcad.getDatabase().getLayerTable();
    let layerId = layerTable.get(ent.layer);
    let layerRec = layerId.getMcDbLayerTableRecord();
    if (layerRec === null) return;
    layerRec.isOff = true;
    mxcad.updateLayerDisplayStatus();
    mxcad.updateDisplay()
}


function getHostUrl(): string {
    return window.location.origin;
}

function getCurrentPagePath() {
    return window.location.origin + window.location.pathname
}


let idImage:any;
async function Mx_Test_DrawImage() {
    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("\n指定插入点:");
    let pt = await getPoint.go();
    if (!pt) return;

    let mxcad = MxCpp.getCurrentMxCAD();
    //let imagUrl = "https://cdn.pixabay.com/photo/2022/11/15/12/23/winter-7593872_960_720.jpg";

    let imagUrl = getCurrentPagePath() + "mxcad.jpg"
    mxcad.loadImage(imagUrl, (image) => {
        if (!image) {
            console.log("loadImage failed");
            return;
        }
        let width = mxcad.mxdraw.viewCoordLong2Cad(100);
        let height = (image.height / image.width) * width;
        idImage = mxcad.drawImage((pt as any).x, (pt as any).y, width, height, 0, imagUrl,true);
        mxcad.updateDisplay();
    });

}

function Mx_Test_ModifyImage(){
    if(!idImage) return;
    let mxcad = MxCpp.getCurrentMxCAD();
    let imagUrl = "https://cdn.pixabay.com/photo/2022/11/15/12/23/winter-7593872_960_720.jpg";
    mxcad.loadImage(imagUrl, (imagedata) => {
        if (!imagedata) {
            console.log("loadImage failed");
            return;
        }
        let imagedefid = mxcad.addImageDefine(imagUrl,"winter-7593872_960_720.jpg",true);
        let image = idImage.getMcDbEntity() as McDbRasterImage;
        if(image){
            image.setImageDefId(imagedefid);
        }
        mxcad.updateDisplay();
    });
}


export async function MxTest_TestAddCurrentSelect() {
    let mxcad = MxCpp.getCurrentMxCAD();
    let getPoint = new MxCADUiPrPoint();
    let pt1 = await getPoint.go();
    if (pt1 == null) return;

    getPoint.setBasePt(pt1);
    let pt2 = await getPoint.go();
    if (pt2 == null) return;

    let id = mxcad.drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
    mxcad.addCurrentSelect(id);
}

let lAng = 0;
export async function MxTest_TestSetViewAngle() {
    lAng += Math.PI * 0.5;
    let mxcad = MxCpp.getCurrentMxCAD()
    mxcad.zoomAngle(lAng);
}

export function MxText_ZoomCenter() {
    let mxcad = MxCpp.getCurrentMxCAD();
    mxcad.zoomCenter(900, 900);
}

function Mx_Test_Draw3DPolyline() {
    let mxcad = MxCpp.getCurrentMxCAD();
    //清空当前显示内容
    mxcad.newFile();

    let pl = new McDbPolyline();
    pl.setType(McDb.PolylineType.k3dPolyline);
    pl.addVertexAt(new McGePoint3d(100, 100, 100));
    pl.addVertexAt(new McGePoint3d(200, 100, 500));
    pl.addVertexAt(new McGePoint3d(300, 400, 200));

    mxcad.drawEntity(pl);

    //把所有的实体都放到当前显示视区
    mxcad.zoomAll();
    //更新视区显示
    mxcad.updateDisplay();
}

function MxTemp_Test() {
    const filter = new MxCADResbuf();
    // 添加对象类型，选择集只选择文字类型的对象
    filter.AddMcDbEntityTypes("INSERT")

    let ss = new MxCADSelectionSet();
    //选择所有文本对象
    ss.allSelect(filter);

    let count = ss.count();
    console.log(count);
}

async function Mx_Test_IntersectWith() {

    let mxcad = MxCpp.getCurrentMxCAD();
    const getPoint = new MxCADUiPrPoint();
    getPoint.setMessage("\n指定第一点:");
    let pt1 = await getPoint.go();
    if (!pt1) return;
    getPoint.setMessage("\n指定第二点:");
    getPoint.setBasePt(pt1);
    let pt2 = await getPoint.go();
    if (!pt2) return;

    // 通过两点构造一个搜索矩形范围.
    let vec = pt2.sub(pt1);
    vec.rotateBy(Math.PI * 0.5).normalize().mult(MxFun.screenCoordLong2Doc(10));
    let p1 = pt1.clone().addvec(vec);
    let p2 = pt1.clone().subvec(vec);
    let p3 = pt2.clone().addvec(vec);
    let p4 = pt2.clone().subvec(vec);

    let bound = new McGeBound([p1,p2,p3,p4]);
    let minPt = bound.minPoint;
    let maxPt = bound.maxPoint;
    let ss = new MxCADSelectionSet();

    // 根据搜索框，选择框内的对象。
    ss.crossingSelect(minPt.x, minPt.y, maxPt.x, maxPt.y,
          new MxCADResbuf([DxfCode.kEntityType,"LINE,ARC,CIRCLE,LWPOLYLINE"]));

    let dR = MxFun.screenCoordLong2Doc(5);
    let line = new McDbLine(pt1, pt2);
    ss.forEach(id => {
        let ent = id.getMcDbEntity() as McDbCurve;
        // 与直线求交点 。
        let points = ent.IntersectWith(line, McDb.Intersect.kOnBothOperands);
        if (points.length() != 0) {
            let inpt = points.at(0);
            mxcad.drawCircle(inpt.x, inpt.y, dR);
        }
    })

}



// 开始创建MxCAD对象前
MxFun.on("mxcadApplicationStartCreatingMxCADObject", (param) => {
    // mxdraw 绘图初始对象。
    let mxdraw: MxDrawObject = param.mxdraw;
    mxdraw.setViewMovementMethod(true);
    mxdraw.on("openFileComplete", () => {
        console.log("MxTip:openFileComplete ")
    });

    // 鼠标点事件响应.
    mxdraw.addControlsEvent("mousedown", (event) => {
        let x = event.offsetX;
        let y = event.offsetY;
        let pt = mxdraw.viewCoord2Cad(x, y, 0);
        console.log("mousedown:", pt);
        //MxFun.postMessageToParentFrame(pt);
        return 0;
    })


});

// MxCAD创建成功
MxFun.on("mxcadApplicationCreatedMxCADObject", (param) => {
    let mxcad: McObject = param.mxcad;

    //mxcad.setViewBackgroundColor(255, 255, 255);
    // 对象选择事件
    mxcad.on("selectChange", (ids: McObjectId[]) => {
        if (ids.length == 0) return;
        let id = ids[0];
        let mxent = id.getMxDbEntity();
        if (mxent !== null) {
            console.log(mxent.getTypeName());
            if (mxent instanceof MxDbRectBoxLeadComment) {
                let comment: MxDbRectBoxLeadComment = mxent;
                console.log(comment.text);
                //comment.text = "xxxx";
                //comment.setNeedUpdateDisplay();
            }
            //...
            return;
        }
        let ent = id.getMcDbEntity();
        if (ent !== null) {
            console.log(ent.objectName);
            if (ent instanceof McDbText) {
                let text: McDbText = ent;
                console.log(text.textString);
            }
            else if (ent instanceof McDbBlockReference) {
                let blkRef: McDbBlockReference = ent;
                let aryId = blkRef.getAllAttribute();
                aryId.forEach((id) => {
                    let attribt: McDbAttribute = id.getMcDbEntity() as any;
                    console.log(attribt.textString);
                    console.log(attribt.tag);
                })
            }
            //...
        }
    });
    // 属性界面上，得到对象属性事件。
    MxCpp.PropertiesWindow.onEvent_getProperties((id: McObjectId) => {
        let ent = id.getMcDbEntity();
        if (!ent) return [];
        let dn = ent.getxDataDouble("DN");
        let len = ent.getxDataDouble("LEN");
        let ret = [];

        if (dn.ret) {
            ret.push({
                sVarName: "DN",
                iVarType: MxPropertiesWindowCustomValueType.kDouble,
                val: dn.val,
                isOnlyRead: false
            });
        }

        if (len.ret) {
            ret.push({
                sVarName: "LEN",
                iVarType: MxPropertiesWindowCustomValueType.kDouble,
                val: len.val,
                isOnlyRead: false
            });
        }
        return ret;
    })

    // 属性界面上，对象属性被修改事件。
    MxCpp.PropertiesWindow.onEvent_setProperties((id: McObjectId, prop: any) => {
        let ent = id.getMcDbEntity();
        if (!ent) return;
        if (prop.sVarName == "DN") {
            ent.setxDataDouble("DN", prop.val);
        }
        else if (prop.sVarName == "LEN") {
            ent.setxDataDouble("LEN", prop.val);
        }
    });
    init();
});

function init() {
    MxFun.addCommand("My_PluginTest", My_PluginTest);
    MxFun.addCommand("My_Extool", My_Extool);
    MxFun.addCommand("Mx_Open_DemoCode", Mx_Open_DemoCode);
    MxFun.addCommand("Mx_Open_DevInstall", Mx_Open_DevInstall);
    MxFun.addCommand("Mx_Open_Map_gdslwzj", Mx_Open_Map_gdslwzj);
    MxFun.addCommand("Mx_Open_Map_gdyx", Mx_Open_Map_gdyx);
    MxFun.addCommand("Mx_Open_Map_tdtsl", Mx_Open_Map_tdtsl);
    MxFun.addCommand("Mx_Open_Map_bdsl", Mx_Open_Map_bdsl);
    MxFun.addCommand("Mx_Open_Map_geoq", Mx_Open_Map_geoq);
    MxFun.addCommand("Mx_Open_Map_googlecn", Mx_Open_Map_googlecn);


    MxFun.addCommand("Mx_ViewBackgroundColor", Mx_ViewBackgroundColor);
    MxFun.addCommand("Mx_TestExProp", Mx_TestExProp);
    MxFun.addCommand("Mx_Test_OpenFile", Mx_Test_OpenFile);
    MxFun.addCommand("Mx_Test_GetFile", Mx_Test_GetFile);
    MxFun.addCommand("Mx_TestExProp", Mx_TestExProp);
    MxFun.addCommand("Mx_SelectEntitHideLayer", Mx_SelectEntitHideLayer);
    MxFun.addCommand("MxTest_TestAddCurrentSelect", MxTest_TestAddCurrentSelect);
    MxFun.addCommand("MxTest_TestSetViewAngle", MxTest_TestSetViewAngle);
    MxFun.addCommand("MxText_ZoomCenter", MxText_ZoomCenter);
    MxFun.addCommand("MxTest_Map_Download", MxTest_Map_Download);
    MxFun.addCommand("Mx_Test_DrawImage", Mx_Test_DrawImage);
    MxFun.addCommand("Mx_Test_ModifyImage", Mx_Test_ModifyImage);

    MxFun.addCommand("Mx_Test_Draw3DPolyline", Mx_Test_Draw3DPolyline);
    MxFun.addCommand("MxTemp_Test", MxTemp_Test);
    MxFun.addCommand("Mx_Test_IntersectWith", Mx_Test_IntersectWith);


    commentinit();
    paramdrawinit();
    measureinit();
    interactiveinit();
    databaseinit();
    cadfileinit();
    findtextinit();
    makeblock();
    hatchinit();
    aiinit();
    init_userdemo();
    drawcustomtinit();
    init_gis_entity();
    toolsinit();
    textToolsinit();
    blockToolsinit();
    countToolsinit();
    drawToolsinit();
    if (mxcadui.mxmap) {
        //使用three.js 加载一个3d模型在地图上.
        mxtest_add_3d_model(MxFun.getCurrentDraw());
    }
}
