///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import {
  MxFun, Mxassembly
} from "mxdraw";
import { McCmColor, McDb, MxCpp } from "mxcad";

function Mx_Test_DrawLine() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();
  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;
  //把线型改成实线
  mxcad.drawLinetype = "";
  //设置线宽 4
  mxcad.drawLineWidth = 0;


  //创建一个图层,名为"LineLayer"
  mxcad.addLayer("LineLayer");
  //设置当前图层为"LineLayer"
  mxcad.drawLayer = "LineLayer";
  // 直接绘制一个实线
  // 参数一直线的开始点x坐标，参数二直线的开始点y坐标，参数三直线的结束点x坐标，参数四直线的结束点y坐标
  mxcad.drawLine(0, 0, 100, 0);
  // 绘制一个实斜线
  mxcad.drawLine(200, 0, 300, 100);


  //----------------------------------------------------------------------------------------------------------
  //绘制一个虚线
  //定义虚线数据据,"MyLineType"是线型名，"6,-8"是虚线的一个单位定义，6是实线长，-8是空格长。
  mxcad.addLinetype("MyLineType", "6,-10");
  //设计当前线型为"MyLineType"
  mxcad.drawLinetype = "MyLineType";
  // 绘制一个虚线
  mxcad.drawLine(0, 30, 100, 30);
  // 绘制一个斜虚线
  mxcad.drawLine(200, 30, 300, 130);

  //---------------------------------------------------------------------------------------------------------
  // 修改绘线的颜色为 16711680(蓝色),  16711680转成16进制是0xFF 00 00,其中，FF是蓝色，00是绿色，第个二00是红色。
  mxcad.drawColor = new McCmColor(0, 0, 255);
  // 绘制一个蓝色的虚线

  mxcad.drawLine(0, 60, 100, 60);
  // 绘制一个蓝色的斜虚线
  mxcad.drawLine(200, 60, 300, 160);
  //---------------------------------------------------------------------------------------------------------
  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;
  //把线型改成实线
  mxcad.drawLinetype = "";
  //设置线宽 4
  mxcad.drawLineWidth = 4;
  //绘制一个带宽度的直线。
  mxcad.drawLine(0, 90, 100, 90);
  // 绘制一个带宽度的斜线
  mxcad.drawLine(200, 90, 300, 190);

  //---------------------------------------------------------------------------------------------------------
  //绘制一个点划线虚线
  mxcad.addLinetype("MyLineType2", "10,-2,3,-2");
  //把线型改点划线
  mxcad.drawLinetype = "MyLineType2";
  // 修改绘线的颜色为 255(红色),  255转成16进制是0x00 00 FF,其中，00是蓝色，第个二00是绿色，FF是红色。
  mxcad.drawColor = new McCmColor(255, 0, 0);
  //绘制一个带宽度的红色点划线。
  mxcad.drawLine(0, 120, 100, 120);
  // 绘制一个带宽度红色点划斜线
  mxcad.drawLine(200, 120, 300, 220);
  //---------------------------------------------------------------------------------------------------------
  //增加一个带有形的线型
  mxcad.addTextStyle("MyLineTypeTextStyle", "txt.shx", "hztxt.shx", 1);
  mxcad.addLinetypeEx("MyLineType3", "(12.7,(\"T=MxDraw\",\"S=2.54\",\"L=-5.08\",\"R=0.0\",\"X=-2.54\",\"Y=-1.27\"),-10.08)", "MyLineTypeTextStyle");
  mxcad.drawLinetype = "MyLineType3";
  mxcad.drawLineWidth = 0;
  //绘制一个带宽度的红色点划线。
  mxcad.drawLine(350, 120, 600, 120);
  //---------------------------------------------------------------------------------------------------------
  //增加一个带有形的线型
  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;
  mxcad.drawLineWidth = 4;
  //绘制一个带宽度的红色点划线。
  mxcad.drawLine(350, 220, 600, 220);

  //把所有的实体都放到当前显示视区
  mxcad.zoomAll();
  //更新视区显示
  mxcad.updateDisplay();
}

function Mx_Test_DrawArc() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();


  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;

  //把线型改成实线
  mxcad.drawLinetype = "";

  //设置线宽 4
  mxcad.drawLineWidth = 0;

  //创建一个图层,名为"ArcLayer"
  mxcad.addLayer("ArcLayer");

  //设置当前图层为"ArcLayer"
  mxcad.drawLayer = ("ArcLayer");

  //《---------------------------------------》
  //绘制一个实线黑色的圆弧
  mxcad.drawArc(0, 1000, 100, 30, 200);


  //《---------------------------------------》
  //绘制一个虚线线的圆弧
  mxcad.addLinetype("ArcLineType", "30,-5,7,-7");

  //设计当前线型为"ArcLineType"
  mxcad.drawLinetype = "ArcLineType";

  mxcad.drawColor = new McCmColor(255, 25, 0);

  mxcad.drawArc(300, 1000, 100, 30, 200);

  //《---------------------------------------》
  //绘制一个有宽度的虚线线的圆弧
  mxcad.drawLineWidth = 15;

  mxcad.drawColorIndex = 255;

  mxcad.drawArc(600, 1000, 100, 30, 200);


  //《---------------------------------------》
  //由圆弧上三个点绘制圆弧
  mxcad.drawArc2(800, 1000, 900, 1200, 1000, 900);

  //《---------------------------------------》
  //由圆弧上的开始点，结束度和凸度会圆弧
  mxcad.drawLinetype = "";
  mxcad.drawLineWidth = 40;
  mxcad.drawArc3(1200, 1000, 1400, 1000, 0.6);


  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}

function Mx_Test_DrawCircle() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  mxcad.drawColorIndex = 0;

  //把线型改成实线
  mxcad.drawLinetype = "";

  //设置线宽 4
  mxcad.drawLineWidth = 0;


  //创建一个图层,名为"CircleLayer"
  mxcad.addLayer("CircleLayer");

  //设置当前图层为"CircleLayer"
  mxcad.drawLayer = "CircleLayer";

  //《---------------------------------------》
  //绘制一个实线黑色的圆
  mxcad.drawCircle(0, 800, 120);

  //《---------------------------------------》
  //绘制一个虚线线的圆
  mxcad.addLinetype("CircleLineType", "30,-5,7,-7");

  //设计当前线型为"CircleLineType"
  mxcad.drawLinetype = ("CircleLineType");

  mxcad.drawColor = new McCmColor(0, 25, 255);

  mxcad.drawCircle(300, 800, 120);

  //《---------------------------------------》
  //绘制一个带有宽度的圆
  mxcad.addLinetype("CircleLineType", "30,-5,7,-7");

  //设计当前线型为"CircleLineType"
  mxcad.drawLinetype = ("CircleLineType");

  mxcad.drawLineWidth = 40;

  mxcad.drawCircle(600, 800, 120);

  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}


function Mx_Test_DrawPolyline() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  mxcad.drawColorIndex = 0;

  //把线型改成实线
  mxcad.drawLinetype = "";

  //设置线宽 4
  mxcad.drawLineWidth = 0;

  //创建一个图层,名为"PolylineLayer"
  mxcad.addLayer("PolylineLayer");;

  //设置当前图层为"PolylineLayer"
  mxcad.drawLayer = "PolylineLayer";


  //《---------------------------------------》
  //用Plyline显示绘制矩形框

  //定义一个路径的开始点
  mxcad.pathMoveTo(0, 300);

  //路径的一下个点
  mxcad.pathLineTo(100, 300);

  //路径的一下个点
  mxcad.pathLineTo(100, 400);

  //路径的一下个点
  mxcad.pathLineTo(0, 400);

  //把路径设置成闭合
  mxcad.pathMakeClosed();


  //把路径闭合，生成一个矩形框
  mxcad.drawPathToPolyline();

  //《---------------------------------------》
  //绘制一个有宽度，带线型的矩形框
  //定义一个路径的开始点
  mxcad.pathMoveTo(200, 300);

  //路径的一下个点
  mxcad.pathLineTo(300, 300);

  //路径的一下个点
  mxcad.pathLineTo(300, 400);

  //路径的一下个点
  mxcad.pathLineTo(200, 400);

  //把路径设置成闭合
  mxcad.pathMakeClosed();

  mxcad.addLinetype("MyLineType3", "30,-10");

  mxcad.drawLinetype = "MyLineType3";

  mxcad.drawColorIndex = 255;

  mxcad.drawLineWidth = 5;

  mxcad.drawPathToPolyline();

  //《---------------------------------------》
  //绘制一个有宽度的矩形框
  //定义一个路径的开始点
  mxcad.pathMoveTo(400, 300);

  //路径的一下个点
  mxcad.pathLineTo(500, 300);

  //路径的一下个点
  mxcad.pathLineTo(500, 400);

  //路径的一下个点
  mxcad.pathLineTo(400, 400);

  //把路径设置成闭合
  mxcad.pathMakeClosed();

  mxcad.drawLinetype = ("");

  mxcad.drawColor = new McCmColor(0, 25, 255);

  mxcad.drawLineWidth = 10;

  mxcad.drawPathToPolyline();


  //《---------------------------------------》
  //绘制一个有宽度的矩形框
  //定义一个路径的开始点
  mxcad.pathMoveTo(400, 300);

  //路径的一下个点
  mxcad.pathLineTo(500, 300);

  //路径的一下个点
  mxcad.pathLineTo(500, 400);

  //路径的一下个点
  mxcad.pathLineTo(400, 400);

  //把路径设置成闭合
  mxcad.pathMakeClosed();

  mxcad.drawLinetype = "";

  mxcad.drawColor = new McCmColor(255, 25, 0);

  mxcad.drawLineWidth = 10;

  mxcad.drawPathToPolyline();

  //《---------------------------------------》
  //绘制一个有宽度的，不闭合的矩形框
  //定义一个路径的开始点
  mxcad.pathMoveTo(600, 300);

  //路径的一下个点
  mxcad.pathLineTo(700, 300);

  //路径的一下个点
  mxcad.pathLineTo(700, 400);

  //路径的一下个点
  mxcad.pathLineTo(600, 400);

  //把路径设置成闭合
  mxcad.drawLinetype = "";

  mxcad.drawColor = new McCmColor(0, 255, 0);

  mxcad.drawLineWidth = 10;

  mxcad.drawPathToPolyline();


  //《---------------------------------------》
  //绘制一个有宽度的，三角形
  //定义一个路径的开始点
  mxcad.pathMoveTo(800, 300);

  //路径的一下个点
  mxcad.pathLineTo(900, 300);

  //路径的一下个点
  mxcad.pathLineTo(900, 400);

  mxcad.pathMakeClosed();

  //把路径设置成闭合
  mxcad.drawLinetype = "";

  mxcad.drawColor = new McCmColor(25, 255, 0);

  mxcad.drawLineWidth = 10;

  mxcad.drawPathToPolyline();


  //《---------------------------------------》
  //绘制一个箭头
  mxcad.pathMoveToEx(1000, 300, 10, 10, 0);

  mxcad.pathLineToEx(1000, 500, 30, 0, 0);

  mxcad.pathLineTo(1000, 580);

  mxcad.drawPathToPolyline();


  //《---------------------------------------》
  //绘制一个虚线箭头
  mxcad.pathMoveToEx(1200, 300, 10, 10, 0);

  mxcad.pathLineToEx(1200, 500, 30, 0, 0);

  mxcad.pathLineTo(1200, 580);


  mxcad.drawColor = new McCmColor(25, 255, 0);

  mxcad.drawLinetype = ("MyLineType3");

  mxcad.drawPathToPolyline();

  //《---------------------------------------》
  //绘制一个圆弧箭头,-0.34是圆弧的凸度.

  //mxcad.pathMoveToEx 1400, 300, 10, 10, -0.34);
  mxcad.pathMoveToEx(1400, 300, 10, 10, -0.34);

  mxcad.pathLineToEx(1400, 500, 30, 0, 0.34);

  mxcad.pathLineTo(1400, 600);


  mxcad.drawColor = new McCmColor(255, 255, 25);

  mxcad.drawLinetype = "MyLineType3";

  mxcad.drawPathToPolyline();

  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}

function Mx_Test_DrawHatch() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();


  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;

  //把线型改成实线
  mxcad.drawLinetype = "";

  //设置线宽 4
  mxcad.drawLineWidth = 0;

  //创建一个图层,名为"HatchLayer"
  mxcad.addLayer("HatchLayer");

  //设置当前图层为"HatchLayer"
  mxcad.drawLayer = "HatchLayer";



  //《---------------------------------------》
  //绘制一个实心有圆弧边界填充.
  //定义一个路径的开始点
  mxcad.pathMoveToEx(200, 3300, 0, 0, 0.3);

  //路径的一下个点
  mxcad.pathLineTo(300, 3300);

  //路径的一下个点
  mxcad.pathLineTo(300, 3400);

  //路径的一下个点
  mxcad.pathLineTo(200, 3300);

  mxcad.drawColor = new McCmColor(25, 255, 0);


  //把路径变成一个填充
  mxcad.drawPathToHatch(1);


  //《---------------------------------------》
  //绘制一个实心三角形填充.

  //定义一个路径的开始点
  mxcad.pathMoveTo(150, 3300);

  //路径的一下个点
  mxcad.pathLineTo(250, 3300);

  //路径的一下个点
  mxcad.pathLineTo(250, 3400);

  //路径的一下个点
  mxcad.pathLineTo(150, 3300);

  //把路径拟合成一个样线
  mxcad.drawColor = new McCmColor(255, 0, 0);
  mxcad.drawPathToHatch(1);

  //《---------------------------------------》
  //绘制一个实心有圆弧边界填充,中间挖去一块.

  //定义一个路径的开始点
  mxcad.pathMoveToEx(440, 3310, 0, 0, 0);

  //路径的一下个点
  mxcad.pathLineTo(480, 3310);

  //路径的一下个点
  mxcad.pathLineTo(480, 3360);

  //路径的一下个点
  mxcad.pathLineTo(450, 3340);

  // 把上面定义的路径定义填充排除区域.
  mxcad.pathMakeExclude(true);



  //定义一个路径的开始点
  mxcad.pathMoveToEx(400, 3300, 0, 0, 0.3);

  //路径的一下个点
  mxcad.pathLineTo(500, 3300);

  //路径的一下个点
  mxcad.pathLineTo(500, 3400);

  //路径的一下个点
  mxcad.pathLineTo(400, 3300);


  mxcad.drawColor = new McCmColor(255, 25, 0);

  //把路径变成一个填充
  mxcad.drawPathToHatch(1);




  //《---------------------------------------》
  //绘制一个有图案的填充
  //angle, x-origin,y-origin, delta-x,delta-y,dash-1,dash-2, …
  //45 = angle 是图案线角度.
  //0 = x-origin 是第一个填充线经过的点位置X坐标
  //0 = y-origin 是第一个填充线经过的点位置Y坐标
  //0 = delta-x   是下一个填充线相对前一个线的X方向偏移
  //0.125 = delta-y   是下一个填充线相对前一个线的Y方向偏移


  mxcad.addPatternDefinition("MyHatchPattern1", "((45, 0,0, 0,0.125))");
  mxcad.drawPatternDefinition = "MyHatchPattern1";



  //定义一个路径的开始点
  mxcad.pathMoveToEx(600, 3300, 0, 0, 0.3);

  //路径的一下个点
  mxcad.pathLineTo(700, 3300);

  //路径的一下个点
  mxcad.pathLineTo(700, 3400);

  //路径的一下个点
  mxcad.pathLineTo(600, 3300);


  //把路径变成一个填充,80,是填充图案的缩放比例.
  mxcad.drawPathToHatch(100);


  //《---------------------------------------》
  //绘制另一个有图案的填充
  //45, 0,0, 0,.25
  //45, .176776695,0, 0,.25, .125,-.0625

  //{id: 'ANSI33', name: 'ANSI 青铜、黄铜和紫铜', value: '45, 0,0, 0,.2545, .176776695,0, 0,.25, .125,-.0625', imgPath: '/src/view/Dialogs/PatternFillingDialog/imgs/ANSI33.jpg'}

  mxcad.addPatternDefinition("MyHatchPattern2", "((45, 0,0, 0,0.25) (45, 0.176776695,0, 0,0.25, 0.125,-0.0625))");
  mxcad.drawPatternDefinition = "MyHatchPattern2"

  //定义一个路径的开始点
  mxcad.pathMoveToEx(800, 3300, 0, 0, 0.3);

  //路径的一下个点
  mxcad.pathLineTo(900, 3300);

  //路径的一下个点
  mxcad.pathLineTo(900, 3400);

  //路径的一下个点
  mxcad.pathLineTo(800, 3300);


  //把路径变成一个填充,80,是填充图案的缩放比例.
  mxcad.drawPathToHatch(100);


  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}

function Mx_Test_DrawText() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();



  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;

  //创建一个图层,名为"TextLayer"
  mxcad.addLayer("TextLayer");

  //设置当前图层为"TextLayer"
  mxcad.drawLayer = "TextLayer";

  //《---------------------------------------》
  //写一个文字,0,1是左对齐.
  mxcad.drawText(0, 1900, "绘图控件文字测试", 100, 0, 0, 1);


  //《---------------------------------------》
  //写一个文字,2,1是右下对齐.
  mxcad.drawColor = new McCmColor(255, 25, 0);

  mxcad.drawText(3000, 2100, "绘图控件文字测试", 100, -20, 2, 1);

  //《---------------------------------------》
  //按指定样式绘制文字
  mxcad.addTextStyle("MyTextStyle", "italicc.shx", "gbcbig.shx", 0.7);
  mxcad.drawTextStyle = "MyTextStyle";

  mxcad.drawColor = new McCmColor(255, 0, 0);
  mxcad.drawText(0, 3000, "绘图控件文字测试", 100, 0, 0, 1);


  //《---------------------------------------》
  //绘制TrueType文字
  mxcad.AddTureTypeTextStyle("MyTrueTypeTextStyle");
  mxcad.drawTextStyle = "MyTrueTypeTextStyle";

  mxcad.drawColor = new McCmColor(200, 255, 50);
  mxcad.drawText(0, 3500, "绘图控件TrueType文字测试", 100, 0, 0, 1);

  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}


function Mx_Test_TrueText(){
    let mxcad = MxCpp.getCurrentMxCAD();
    //清空当前显示内容
    mxcad.newFile();
    MxCpp.App.loadFonts([], [], ["syadobe","simsun"], () => {

        // 添加一个黑体文字样式
        mxcad.AddTureTypeTextStyle("ht_style","syadobe");

        // 添加一个宋体文字样式
        mxcad.AddTureTypeTextStyle("st_style","simsun");

        // 设置当前样式为黑体
        mxcad.drawTextStyle = "ht_style";

        mxcad.drawColor = new McCmColor(200, 255, 50);
        let idText = mxcad.drawText(0, 3500, "绘图控件TrueType文字测试", 100, 0, 0, 1);
      
        let ent = idText.getMcDbEntity();
        // 修改文字样式为宋体
        if(ent) ent.textStyle = "st_style";
    
        mxcad.zoomAll();
        mxcad.regen();
        mxcad.updateDisplay();
    });
  

}


function Mx_Test_Ellipse() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;


  //把线型改成实线
  mxcad.drawLinetype = "";

  //设置线宽 4
  mxcad.drawLineWidth = 0;

  //创建一个图层,名为"LineLayer"
  mxcad.addLayer("LineLayer");

  //设置当前图层为"LineLayer"
  mxcad.drawLayer = "LineLayer";


  // 直接绘制一个椭圆
  mxcad.drawEllipse(0, 1400, 100, 0, 0.7);


  //《---------------------------------------》
  //绘制一个倾斜的椭圆

  mxcad.addLinetype("MyEllipseType", "6,-10");

  //设计当前线型为"MyEllipseType"
  mxcad.drawLinetype = ("MyEllipseType");

  mxcad.drawColor = new McCmColor(200, 0, 0);

  mxcad.drawEllipse(200, 1400, 80, 30, 0.5);

  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}



function Mx_Test_EllipseArc() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;

  //设置线宽 4
  mxcad.drawLineWidth = 0;

  //创建一个图层,名为"EllipseArcLayer"
  mxcad.addLayer("EllipseArcLayer");

  //设置当前图层为"EllipseArcLayer"
  mxcad.drawLayer = "EllipseArcLayer";


  // 直接绘制一个椭圆
  mxcad.drawEllipseArc(0, 1600, 80, 30, 0.4, 30, 200);


  //《---------------------------------------》
  mxcad.addLinetype("MyEllipseArcType", "6,-10");

  //设计当前线型为"MyEllipseType"
  mxcad.drawLinetype = ("MyEllipseArcType");

  mxcad.drawColor = new McCmColor(200, 200, 0);

  mxcad.drawEllipseArc(200, 1600, -80, 30, 0.5, 60, 300);


  //把线型改成实线
  mxcad.drawLinetype = "";

  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}




function Mx_Test_MText() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;

  mxcad.addLayer("MtextLayer");

  //设置当前图层为"MtextLayer"

  mxcad.drawLayer = "MtextLayer";

  mxcad.drawTextStyle = "";

  mxcad.drawMText(0, -100, "控件:\\P多行文字测试", 50, 400, 0, 1);

  mxcad.zoomAll();
  mxcad.regen();
  mxcad.updateDisplay();
}

function Mx_ParamDrawLine(data: any) {
  if (!data || !data.param) return;

  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();
  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;
  //把线型改成实线
  mxcad.drawLinetype = "";
  //设置线宽 4
  mxcad.drawLineWidth = 0;


  //创建一个图层,名为"LineLayer"
  mxcad.addLayer("LineLayer");
  //设置当前图层为"LineLayer"
  mxcad.drawLayer = "LineLayer";
  // 直接绘制一个实线
  mxcad.drawLine(data.param.x1, data.param.y1, data.param.x2, data.param.y2);

  mxcad.zoomAll();
  //更新视区显示
  mxcad.updateDisplay();

  MxFun.postMessageToParentFrame({ cmd: "Mx_ParamDrawLine", message: "ok" });

}

function Mx_Test_Text() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  // 绘制文字，左中对齐.
  //mxcad.drawText(100.1,200.45,"1.033",10,0,McDb.TextHorzMode.kTextLeft,McDb.TextVertMode.kTextVertMid);
  mxcad.drawText(
    350831.77,
    19405118.45,
    '1.034',
    10,
    0,
    McDb.TextHorzMode.kTextLeft,
    McDb.TextVertMode.kTextVertMid);

  mxcad.zoomAll();
  mxcad.regen(100);
}



function Mx_Test_DimAligned() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  mxcad.addDimStyle("MyDimStyle", "41,0.18,141,0.09,40,200", "77,1,271,3", "", "");
  mxcad.drawDimStyle = "MyDimStyle"

  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;

  //把线型改成实线
  mxcad.drawLinetype = "";

  //设置线宽
  mxcad.drawLineWidth = 0

  mxcad.drawDimAligned(0, 4000, 300, 4500, 150, 4600);

  //把所有的实体都放到当前显示视区
  mxcad.zoomAll();
  //更新视区显示
  mxcad.updateDisplay();
}

function Mx_Test_DrawDimRotated() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  mxcad.addDimStyle("MyDimStyle", "41,0.18,141,0.09,40,200", "77,1,271,3", "", "");
  mxcad.drawDimStyle = "MyDimStyle"

  //把颜色改回黑白色
  mxcad.drawColorIndex = 0;

  //把线型改成实线
  mxcad.drawLinetype = "";

  //设置线宽
  mxcad.drawLineWidth = 0

  mxcad.drawDimRotated(0, 7000, 600, 7000, 250, 7050, 0);

	mxcad.drawDimRotated(0, 7200, 0, 7600, 150, 7300, 0.771);

  //把所有的实体都放到当前显示视区
  mxcad.zoomAll();
  //更新视区显示
  mxcad.updateDisplay();
}

function Mx_Test_DrawDimAngular() {
  let mxcad = MxCpp.getCurrentMxCAD();
  //清空当前显示内容
  mxcad.newFile();

  mxcad.addDimStyle("MyDimStyle2", "41,0.18,141,0.09,40,200", "77,1,271,3", "", "");
  mxcad.drawDimStyle = "MyDimStyle2"

   //把颜色改回黑白色
   mxcad.drawColorIndex = 0;

  //把线型改成实线
  mxcad.drawLinetype = "";

   //设置线宽
   mxcad.drawLineWidth = 0


  mxcad.drawDimAngular(500, 5000, 0, 5500, 1000, 5500, 500, 5500);

  //把所有的实体都放到当前显示视区
  mxcad.zoomAll();
  //更新视区显示
  mxcad.updateDisplay();
}

export function init() {
  MxFun.addCommand("Mx_Test_DrawLine", Mx_Test_DrawLine);
  MxFun.addCommand("Mx_Test_DrawArc", Mx_Test_DrawArc);
  MxFun.addCommand("Mx_Test_DrawCircle", Mx_Test_DrawCircle);
  MxFun.addCommand("Mx_Test_DrawPolyline", Mx_Test_DrawPolyline);
  MxFun.addCommand("Mx_Test_DrawHatch", Mx_Test_DrawHatch);
  MxFun.addCommand("Mx_Test_DrawText", Mx_Test_DrawText);
  MxFun.addCommand("Mx_Test_Ellipse", Mx_Test_Ellipse);
  MxFun.addCommand("Mx_Test_EllipseArc", Mx_Test_EllipseArc);
  MxFun.addCommand("Mx_Test_MText", Mx_Test_MText);
  MxFun.addCommand("Mx_Test_Text", Mx_Test_Text);
  MxFun.addCommand("Mx_ParamDrawLine", Mx_ParamDrawLine);
  MxFun.addCommand("Mx_Test_DimAligned", Mx_Test_DimAligned);
  MxFun.addCommand("Mx_Test_DrawDimRotated", Mx_Test_DrawDimRotated);
  MxFun.addCommand("Mx_Test_DrawDimAngular", Mx_Test_DrawDimAngular);
  MxFun.addCommand("Mx_Test_TrueText", Mx_Test_TrueText);


}
