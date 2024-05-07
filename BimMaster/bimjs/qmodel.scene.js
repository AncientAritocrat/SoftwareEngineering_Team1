var qmodelSceneOption = {
    //以下参数管理初始化界面
    opToolbar: true, //显示工具栏
    opModelSelect: true, //显示模型选择按钮
    opTree: true, //显示模型目录树按钮
    opProperty: true, //显示工具栏的查看构件属性按钮
    opHome: true, //显示工具栏的恢复默认视角
    opRectSelect: true, //显示工具栏的框选
    opMeasure: true, //显示工具栏的测量
    opClip: true, //显示工具栏的剖切
    opWalk: true, //显示工具栏的漫游
    opMap: true, //显示工具栏的小地图
    opMark: true, //显示工具栏的标记
    opMark2D: true, //显示工具栏的2D标记
    opMark3D: true, //显示工具栏的3D标记
    opViewpoint: true, //显示工具栏的视口管理
    opMaterialSet: true, //显示工具栏的材质替换
    opInfo: true, //显示工具栏的模型信息
    opSetting: true, //显示工具栏的设置
    showTree: true, //默认显示目录树子窗口
    showCube: true, //默认显示视角盒子
    showPty: false, //是否默认显示属性子窗口
    showqrcode: false, //显示默认二维码
    //以下是默认的环境设置参数
    version: 2,
    color: '-1', //背景色。RGB,格式举例：'#404048'，也可以输入-1,默认渐变色
    openLog: true, //是否允许qmodel插件在控制台输出调试日志
    autotransp: false, //全部透明
    transpvalue: 0.6, //全部透明度
    shininess: 80, //反光材质的反光度
    openPone: false, //显示反光材质
    showShadow: false, //显示阴影
    skybox: 0, //显示天空盒。0=没有效果。1=大海，2=沙漠，3=天空，4=平原。可以替换page文件夹里面的素材，文件夹格式为:skybox_x,x为数字。GIS模式请设置为0
    lightlevel: 0.6, //亮度
    opendrlight: true, //打开直射光
    lightdrlevel: 0.8, //直射光亮度
    contrast: 6, //对比度
    lookSpeed: 0.3, //漫游相机旋转速度
    movementSpeed: 70, //漫游前进速度
    transparentBg: false, //背景透明
    bgImg: "5.jpg", //如果背景透明，呈现哪张图片
    //以下参数管理初始化设置   
    setWalk: false, //初始化完成后，直接进度漫游
    clickCenter: true, //点击模型时，自动lookat焦点击位置,并移到屏幕中心。
    loadDefaultviews: true, //在加载模型完成后，自动定位到封面视角
    materialOffer: false, //材质的偏移因子。开启后可以一定程度消除偏移，反复刷新模型可能会造成叠面闪烁。
    randerType: 0, //真实模式或着色模式（暂不支持）
    offtype: 2, //=1使用高深度。=2使用材质偏移。可用于调优模型闪烁的情况。
    keepRender: false, //持续渲染。目前在测试,使用旋转动画时必须开启。
    openBloom: false, //开Bloom泛光,keepRender必须要开。与skybox冲突，打开后将会关闭掉天空盒，效率降低。
    autoZoom: false, //点击时，自动缩放到合适的位置   
    zoomLock: false, //在室外，鼠标缩放时，以鼠标中心为锚点。会消耗算力，模型过大时会增加延迟
    markCulling: true, //标记如果被遮挡，会从视野中剔除。
    selectedEdge: true, //选中的时候显示透视效果
    modelLod: false, //会创建一个模型盒子。用盒子替换模型提升效率。 debugger 
    modelAutoClear: false, //当显示 盒子的时候，会强行释放掉模型的几何信息，直接下次加载，重新载入回来。//debugger error
    showExt: true, //显示设备编辑
    selectOnTop: true, //选中的构件是否在顶层显示。别选太多，选多了效率低。
    mergeInstance: 2, //请根据每个模型的特性去调优。值越大，内存消耗越大，但是合批越多，带来性能上的提升。不建议超过100。
    rayByOctree: false, //通过八叉树进行模型检测碰撞。小模型没关系，大模型的点击选中有一点提升。(bug1:合并后的构件，拆解后没有重置树。0607.rvt)
    enableMenu: true, //启用右键菜单。如果您不想用自带的右键菜单，而要自己实现，可以关闭此项。
};
