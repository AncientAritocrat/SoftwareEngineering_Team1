// import './css/Bf.css'
// import './bimjs/view.css'

window.onbeforeunload = function(event) {
    if (qmodel)
        qmodel.destory_qmodel();
    console.log("clear!!");
};
window.onload = function() {
    var qmodel = new QModelX.QModel();
    //暴露到控制台一个qmodel对象，用于控制台的驱动接口程序。
    window.qmodel = qmodel;
    var viewerDemo = new QMViewer(qmodel);
    if (window.token)
        viewerDemo.token = window.token;
    var model = viewerDemo.getUrlParam('model');
    // var model = "路灯、摄像机合设.rvt";
    // var model = '/static/localmodel/167594419801656';
    // var type = 5;
    var type = null;
    if (model) {
        viewerDemo.loadModel(model, type);
    } else {
        viewerDemo.InitModelList();
    }
    window.addEventListener('resize', viewerDemo.updateClientRects, false);
    // window.removeEventListener('resize', viewerDemo.onWindowResize, false);
}
var QMViewer = function (qmodel, option) {
    qmodel.toolbarPluginInit();

    var hasGis = option ? option.hasGis : false;

    var ClipIndex = -1;
    var contextMenuCreater = null;
    var ThreeContainer = document.getElementById("container");
    var scope = this;
    this.token = null;

    var netOption = new QmodelOption();
    if (this.token)
        netOption.DefaultToken = this.token;
    this.netPlugin = new NetHandle(netOption);

    function displayByClass(className, value) {
        var objs = document.getElementsByClassName(className);
        for (var i = 0; i < objs.length; i++)

            objs[i].style.display = value;
    }

    function displayById(domId, value) {
        var obj = document.getElementById(domId);
        if (obj)
            obj.style.display = value;

    }

    function createDOM(tagName, classList) {
        var rs = document.createElement(tagName);
        // rs.classList.add(classList);
        rs.setAttribute("class", classList);
        return rs;
    }

    function bindEventBySelector(query, eventName, event) {
        //   var event = document.querySelectorAll(query);.
        var elements = document.querySelectorAll(query);
        elements.forEach(e => {
            e.addEventListener(eventName, event);
        });
    }

    function removeEventBySelector(query, eventName, event) {
        document.querySelector(query).removeEventListener(eventName);

    }

    function doForGis() {
        if (!hasGis) return;
        hideDiv("divTree");
        hideDiv("qmodel_model_btn");
        hideDiv("property-panel");
        hideDiv("qrcode1");
        var fff = function(b) {
            if (b) return "inline-block";
            else return "none";
        }
        displayByClass("qmd-home", fff(false));
        displayByClass("qmd-zoomrect", fff(false));
        displayByClass("qmd-measure", fff(false));
        displayByClass("qmd-section-axial", fff(false));
        displayByClass("qmd-walk", fff(false));
        displayByClass("qmd-dingweiM", fff(false));
        displayByClass("qmd-dingwei", fff(true));
        displayByClass("qmd-3D", fff(false));
        displayByClass("qmd-properties", fff(true));
        displayByClass("qmd-plan", fff(false));
        displayByClass("qmd-view", fff(false));
        displayByClass("qmd-extmodel", fff(false));
        displayByClass("qmd-information", fff(true));

    }
    //是否移动端判断
    function doForMobile(qmParams) {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        var isPC = true;
        if (window.innerWidth < 500 || bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            isPC = false;
        }

        if (qmParams.opToolbar)
        showdiv("qmodel_toolbar");
        else
            hideDiv("qmodel_toolbar");
        if (qmParams.opTree && qmParams.type !== 101)
            showdiv("qmodel_tree_btn");
        else
            hideDiv("qmodel_tree_btn");

        if (qmParams.opModelSelect)
            showdiv("qmodel_model_btn");
        else
            hideDiv("qmodel_model_btn");

        displayByClass("qmd-home", qmParams.opHome ? 'inline-block' : 'none');
        displayByClass("qmd-zoomrect", qmParams.opRectSelect && isPC && qmParams.type != 101 ? 'inline-block' : 'none');
        displayByClass("qmd-walk", qmParams.opWalk && isPC ? 'inline-block' : 'none');
        displayByClass("qmd-measure", qmParams.opMeasure && isPC ? 'inline-block' : 'none');
        displayByClass("qmd-map", qmParams.opMap && isPC ? 'inline-block' : 'none');
        displayByClass("qmd-section-axial", qmParams.opClip ? 'inline-block' : 'none');
        displayByClass("qmd-dingweiM", qmParams.opMark ? 'inline-block' : 'none');
        displayByClass("qmd-dingwei", qmParams.opMark2D ? 'inline-block' : 'none');
        displayByClass("qmd-3D", qmParams.opMark3D ? 'inline-block' : 'none');
        displayByClass("qmd-properties", qmParams.opProperty ? 'inline-block' : 'none');
        displayByClass("qmd-view", qmParams.opViewpoint ? 'inline-block' : 'none');
        displayByClass("qmd-material", qmParams.opMaterialSet && isPC ? 'inline-block' : 'none');
        displayByClass("qmd-information", qmParams.opInfo && isPC ? 'inline-block' : 'none');
        displayByClass("qmd-set", qmParams.opSetting && isPC ? 'inline-block' : 'none');
        displayByClass("qmd-extmodel", qmParams.showExt && isPC && qmParams.type != 101 ? 'inline-block' : 'none');
        // displayByClass("qmd-plan", qmParams.showExt && isPC? 'inline-block' : 'none');

            if (isPC) {
            if (qmParams.opProperty && qmParams.showPty) {
                    var btn = document.getElementsByClassName("qmd-properties");
                    if (btn.length > 0)
                        btn[0].classList.add('qm-checked');
                    displayById("property-panel", "block");
                }
                if (qmParams.type != 2) {
                if (qmParams.showTree && qmParams.opTree)
                        displayById("divTree", "block");
                }
                if (!qmParams.showCube)
                hideDiv('viewcube');;
                if (qmParams.showqrcode)
                    displayById("qrcode1", "block");

            } else {
                displayById("property-panel", "none");
                displayById("divTree", "none");
                displayById("qrcode1", "none");
            }



    }

    function setTheme(value) {
        var colorrgb, colorrgba, border, buttonfont, customfont;
        if (value == '1') { //黑色系
            colorrgb = "rgb(16,16,16)";
            colorrgba = "rgba(16, 16, 16, 0.66)";
            border = " rgb(100,100,100)";
            buttonfont = "rgb(174, 64, 64)";
            customfont = "rgb(255, 255, 255)";
        } else if (value == '2') { //深蓝色系
            colorrgb = "rgb(15,49,126)";
            colorrgba = "rgba(15,49,126, 0.66)";
            border = " rgb(160,160,200)";
            buttonfont = "rgb(15,49,126)";
            customfont = "rgb(255, 255, 255)";
        } else if (value == '3') { //深红色系
            colorrgb = "rgb(100,10,10)";
            colorrgba = "rgba(100,10,10, 0.66)";
            border = " rgb(200,160,160)";
            buttonfont = "rgb(100,10,10)";
            customfont = "rgb(255, 255, 255)";
        } else if (value == '4') { //天蓝色系
            colorrgb = "rgb(6,105,137)";
            colorrgba = "rgba(6,105,137, 0.66)";
            border = " rgb(83,172,181)";
            buttonfont = "rgb(6,105,137)";
            customfont = "rgb(255, 255, 255)";
        } else if (value == '5') { //橙色系
            colorrgb = "rgb(100,20,0)";
            colorrgba = "rgba(100,20,0, 0.66)";
            border = " rgb(171,114,99)";
            buttonfont = "rgb(100,20,0)";
            customfont = "rgb(255, 255, 255)";
        } else if (value == '6') { //白色系
            colorrgb = "rgb(200,200,200)";
            colorrgba = "rgba(255,255,255, 0.66)";
            border = " rgb(200,200,200)";
            buttonfont = "rgb(0,0,0)";
            customfont = "rgb(50, 50, 50)";
        }
        qmodel.set_theme(colorrgb, colorrgba, border, buttonfont, customfont);
    }

    //冒泡提示
    function qmodelShowTip(content, height, time) {
        //窗口的宽度 
        var setOpacity = function(ele, opacity) {
            if (ele.style.opacity != undefined) {
                ///兼容FF和GG和新版本IE
                ele.style.opacity = opacity / 100;

            } else {
                ///兼容老版本ie
                ele.style.filter = "alpha(opacity=" + opacity + ")";
            }
        }
        var fadeout = function(ele) {
            var opacity = 0;
            var speed = 12000;
            setOpacity(ele, 99);
            if (ele) {
                var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
                v < 1 && (v = v * 100);
                var count = speed / 1000;
                var avg = (100 - opacity) / count;
                var timer = null;
                timer = setInterval(function() {
                    if (v - avg > opacity) {
                        v -= avg;
                        setOpacity(ele, v);
                    } else {
                        setOpacity(ele, 0);
                        clearInterval(timer);
                    }
                }, 200);
            }
        }

        var windowWidth = document.body.clientWidth;
        if (windowWidth < 1000);
        windowWidth = 1000;
        console.log(content);
        var tipInfo1 = document.getElementById('tipInfo');
        if (tipInfo1) {
            tipInfo1.style.top = height + 'px';
            tipInfo1.style.left = (windowWidth / 2) - 300 / 2 + 'px';
            tipInfo1.style.display = 'block';
            tipInfo1.innerHTML = content;
            fadeout(tipInfo1);
        }
    }

    //页面设置初始化。整个Dom元素的事件绑定都集中在这，是个关键的方法。
    function initPage(params) {
        //initTree();
        doForGis();
        doForMobile(params);
        doBind();
        bindEventBySelector(".qm-title", 'mousedown', OnbfTitleClick.bind(this));
        bindEventBySelector(".qm-close", 'click', OnbfCloseClick.bind(this));
        bindEventBySelector(".qm-select-current", 'click', OnbfSelectionClick.bind(this));
        bindEventBySelector(".qm-select-option", 'click', OnbfSelectionOptionClick.bind(this));
        bindEventBySelector(".my-axial", 'click', OnbfSelectionOptionAxialClick.bind(this));
        //todo
        // $("#divProperty").preventScroll();
        // $("#divBfTree").preventScroll();
        //  document.querySelector("#divProperty").preventScroll();
        //  document.querySelector("#divBfTree").preventScroll();

        var dopreventScroll = function(doms) {
            var _scrollTop = 0;
            for (var i = 0; i < doms.length; i++) {
                var _this = doms[i];
                _this.addEventListener('DOMMouseScroll', function(e) {
                    _scrollTop += e.detail > 0 ? 60 : -60;
                    e.preventDefault();
                }, false);
                _this.onmousewheel = function(e) {
                    if (e.currentTarget != _this)
                        return;
                    e = e || window.event;
                    _scrollTop += e.wheelDelta > 0 ? -60 : 60;
                    e.returnValue = false;
                    e.preventDefault();
                    e.stopPropagation();
                };
                _this.onmousedown = function(e) {
                    e.returnValue = false;
                    e.preventDefault();
                    e.stopPropagation();
                };
                _this.onmouseup = function(e) {
                    e.returnValue = false;
                    e.preventDefault();
                    e.stopPropagation();
                };
                _this.onclick = function(e) {
                    e.returnValue = false;
                    e.preventDefault();
                    e.stopPropagation();
                };
            }
            return this;

        };
        //  dopreventScroll(document.querySelectorAll("#divProperty"));
        //   dopreventScroll(document.querySelectorAll("#divBfTree"));

        // $("#axial-progress").preventScroll();
        //   dopreventScroll(document.querySelectorAll("#axial-progress"));
        bindEventBySelector("#treeComponent", 'click', function() {
            qmodel.load_components_property(1);
        });
        bindEventBySelector("#treeAll", 'click', function() {
            qmodel.load_components_property(0);
        });
        bindEventBySelector("#treeLevel", 'click', function() {
            qmodel.load_components_property(2);
        });

        // document.querySelector("#myRange").addEventListener('input', function(evt) {
        //     applyScalar(value * 10)
        // });

        // function applyScalar(scalar) {
        //     applyScalar(scalar);
        // }

        bindEventBySelector("#qmodel_model_btn", 'click', function(e) {
            scope.InitModelList();
        });
        bindEventBySelector("#qmodel_tree_btn", 'click', function(e) {
            var a = document.getElementById("divTree");
            if (a)
                a.style.display = "block";
        });
        bindEventBySelector(".qmd-properties", 'click', function(e) {
            qmodel.toolbarPlugin.resetOperater('properties');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("property-panel").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                document.getElementById("property-panel").style.display = "block";
            }

        });

        bindEventBySelector(".qmd-plan", 'click', function(e) {
            qmodel.toolbarPlugin.resetOperater('plan');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("property-plan").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                document.getElementById("property-plan").style.display = "block";
                qmodel.toolbarPlugin.doRefreshSche();
            }

        });
        bindEventBySelector("#property-plan-add", 'click', function(e) {
            document.getElementById("property-plan-dialog").style.display = "block";

        });
        bindEventBySelector("#property-plan-play", 'click', function(e) {
            qmodel.toolbarPlugin.doPlaySche();
        });


        bindEventBySelector("#property-plan-add-save", 'click', function(e) {
            document.getElementById("property-plan-dialog").style.display = "none";
            qmodel.netPlugin.saveSche(inp1.value, inp2.value).then(
                function(r) {
                    if (r === 1) {
                        qmodel.toolbarPlugin.doRefreshSche();
                    }
                }
            );
        });

        bindEventBySelector(".qm-tabs-option", 'click', function(e) {


            document.getElementById("tab-zy").classList.remove('active');
            document.getElementById("tab-file").classList.remove('active');

            e.target.classList.add('active');
            if (e.target.id == "tab-file") {
                document.getElementById("divBfTree").style.display = "block";
                document.getElementById("divBfTree2").style.display = "none";
            } else {
                document.getElementById("divBfTree").style.display = "none";
                document.getElementById("divBfTree2").style.display = "block";
            }


        });
        bindEventBySelector(".qmd-view", 'click', function(e) {
            qmodel.toolbarPlugin.resetOperater('view');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("property-view").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                document.getElementById("property-view").style.display = "block";
                qmodel.toolbarPlugin.doRefreshView();
            }

        });
        bindEventBySelector(".qmd-extmodel", 'click', function(e) {
            qmodel.toolbarPlugin.resetOperater('extmodel');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("property-extmodel").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                document.getElementById("property-extmodel").style.display = "block";
                qmodel.toolbarPlugin.doRefreshExtModel();
            }

        });
        bindEventBySelector(".qmd-material", 'click', function(e) {

            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("property-material").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                document.getElementById("property-material").style.display = "block";
                qmodel.show_materials();
            }

        });

        bindEventBySelector("#property-view-add", 'click', function(e) {
            document.getElementById("property-view-dialog").style.display = "block";

        });
        bindEventBySelector("#property-view-addpoint", 'click', function(e) {
            qmodel.remove_all_marks();
            qmodel.toolbarPlugin.setAddMark(true, function() {
                qmodel.toolbarPlugin.setAddMark(false, null);
            });
        });
        bindEventBySelector("#property-view-openAll", 'click', function(e) {
            qmodel.remove_all_marks();
            qmodel.toolbarPlugin.loadAllViewMark();
        });

        bindEventBySelector(".qm-button-color", 'click', function(e) {
            console.log(e.target.attributes['value'].value);
            var value = e.target.attributes['value'].value;
            if (!value) return;
            localStorage.setItem("qmodel-theme", value);
            setTheme(value);
        });


        bindEventBySelector("#property-view-add-save", 'click', function(e) {
            document.getElementById("property-view-dialog").style.display = "none";

            var canvastmp = document.createElement('canvas');
            var context = canvastmp.getContext('2d');
            var maincanvas = document.getElementById("canvasmain");
            // 图片原始尺寸
            var originWidth = maincanvas.width;
            var originHeight = maincanvas.height;
            // 最大尺寸限制
            var maxWidth = 300,
                maxHeight = 300;
            // 目标尺寸
            var targetWidth = originWidth,
                targetHeight = originHeight;
            // 图片尺寸超过300x300的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
            }

            var image = new Image();
            image.onload = function() {
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    beforeWidth = originWidth,
                    beforeHeight = originHeight;
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                context.drawImage(image, 0, 0, beforeWidth, beforeHeight, 0, 0, targetWidth, targetHeight);
                canvas.toBlob(function(blob) {
                    qmodel.netPlugin.saveViewAndImg(inviewname ? inviewname.value : "", qmodel.get_camera_json(), qmodel.get_all_marks(), blob).then(
                        function(r) {
                            canvas = null;
                            if (r) {
                                qmodel.toolbarPlugin.doRefreshView();
                            }
                        }
                    );
                }); //, 'image/png', 0.2
                image.onload = null;
                image = null;
            };
            image.src = maincanvas.toDataURL('image/png', 0.5);




        });


        bindEventBySelector(".qmd-section-axial", 'click', function(e) {
            qmodel.toolbarPlugin.resetOperater('section-axial');
            var checked = e.target.classList.contains('qm-checked');

            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("axiDiv").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                document.getElementById("axiDiv").style.display = "block";
            }
        });
        bindEventBySelector(".qmd-information", 'click', function(e) {
            qmodel.toolbarPlugin.resetOperater('information');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("modalInfoDiv").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                var a = document.getElementById("modalInfoDiv");
                a.style.display = "block";
                //   a.style.left = (document.body.clientWidth / 2 - 150).toString() + 'px';
            }
        });



        bindEventBySelector(".qmd-lookat", 'click', function(e) {
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("myRange").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                document.getElementById("myRange").style.display = "block";
            }
        });



        bindEventBySelector(".qmd-zoomrect", 'click', onSelectRect);

        function onSelectRect(e) {
            qmodel.toolbarPlugin.resetOperater('selectRect');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
            } else {
                e.target.classList.add('qm-checked');
            }
            qmodel.toolbarPlugin.setSelectRect(!checked);
        }

        bindEventBySelector(".qmd-measure", 'click', onMeasure);

        function onMeasure(e) {
            qmodel.toolbarPlugin.resetOperater('measure');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
            } else {
                e.target.classList.add('qm-checked');
            }
            qmodel.toolbarPlugin.setMeasure(!checked);
        }


        bindEventBySelector(".qmd-circlelook", 'click', onCirclelook);

        function onCirclelook(e) {
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
            } else {
                e.target.classList.add('qm-checked');
            }
            qmodel.toolbarPlugin.setLookAtCenter(!checked);
        }

        bindEventBySelector(".qmd-set", 'click', function(e) {
            qmodel.toolbarPlugin.resetOperater('set');
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
                document.getElementById("property-set-dialog").style.display = "none";
            } else {
                e.target.classList.add('qm-checked');
                var jsons = localStorage.getItem('QMODEL_SET_V2');
                var tf = null;
                if (!jsons) {
                    tf = initQModelParam();
                    tf.color = tf.backgroundColor;
                    jsons = JSON.stringify(tf);
                    localStorage.setItem('QMODEL_SET_V2', jsons);
                } else
                    tf = JSON.parse(jsons);
                var a = null;
                document.getElementById("set-v1").value = tf.color;
                document.getElementById("set-ck1").checked = tf.autotransp;
                a = document.getElementById("set-ck7");
                if (a) a.checked = tf.yz;
                document.getElementById("set-v3").value = tf.lightlevel;
                document.getElementById("set-ck2").checked = tf.opendrlight;
                document.getElementById("set-v4").value = tf.lightdrlevel;
                document.getElementById("set-v5").value = tf.contrast;
                document.getElementById("set-ck3").checked = tf.showqrcode;
                document.getElementById("set-v6").value = tf.lookSpeed;
                document.getElementById("set-v7").value = tf.movementSpeed;
                document.getElementById("set-v8").value = tf.transpvalue;
                document.getElementById("set-v9").value = tf.shininess;
                document.getElementById("set-ck4").checked = tf.openPone;
                document.getElementById("set-ck5").checked = tf.showShadow;
                document.getElementById("set-ck6").checked = tf.transparentBg;
                document.getElementById("set-sel1").value = tf.skybox;
                document.getElementById("set-sel2").value = tf.bgImg;
                a = document.getElementById("set-mat");
                if (a && tf.luminanceOfReal != null) a.value = tf.luminanceOfReal;
                a = document.getElementById('sel-mat');
                if (a && tf.renderType != null) a.value = tf.renderType;
                a = document.getElementById('set-ck-clickCenter');
                if (a && tf.clickCenter != null)
                    a.checked = tf.clickCenter;
                a = document.getElementById("property-set-dialog");
                a.style.display = "block";
                a.style.left = (document.body.clientWidth / 2 - 150).toString() + 'px';
            }
        });

        bindEventBySelector(".qmd-map", 'click', function(e) {

            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
            } else {
                e.target.classList.add('qm-checked');
            }

            qmodel.show_map(null, !checked);
        });

        bindEventBySelector(".qmd-walk", 'click', onWalk);

        function onWalk(e) {
            qmodel.toolbarPlugin.resetOperater('walk');
            qmodel.set_stop_render(true);
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                e.target.classList.remove('qm-checked');
            } else {
                e.target.classList.add('qm-checked');
            }
            qmodel.toolbarPlugin.setWalk(!checked);

            qmodel.set_stop_render(false);
        }

        bindEventBySelector(".qmd-dingwei", 'click', function(e) {
            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                qmodelShowTip("已取消标签。", 30, 3);
                e.target.classList.remove('qm-checked');
            } else {
                qmodelShowTip("打开定位标签，请点击构件放置标签。", 30, 3);
                e.target.classList.add('qm-checked');
            }
            qmodel.toolbarPlugin.setAddMark(!checked);
        });


        bindEventBySelector(".qmd-floor", 'click', function(e) {
            var context = document.getElementById('context-map');

            context.style.display = "block";

            var mapdom = document.getElementById('property-map-dialog');


            context.style.left = mapdom.offsetLeft + 100 + "px";
            context.style.top = mapdom.offsetTop + 40 + "px";;
        });


        bindEventBySelector(".qmd-3D", 'click', function(e) {

            var checked = e.target.classList.contains('qm-checked');
            if (checked) {
                qmodelShowTip("已取消3D标签。", 30, 3);
                e.target.classList.remove('qm-checked');
            } else {
                qmodelShowTip("打开3D标签，请点击构件放置标签。", 30, 3);
                e.target.classList.add('qm-checked');
            }
            qmodel.toolbarPlugin.setClickforCSS3DMark(!checked);
        });
        //todo


        bindEventBySelector(".qmd-home", 'click', function() {
            qmodel.toolbarPlugin.resetOperater('home'); //allreset

            qmodel.lookat_center();
        });


        // bindEventBySelector('#axial-progress', 'input', function(e) {
        //     //触发效果 				
        //     console.log(e.target.value);
        //     onClipAdd(ClipIndex, e.target.value);
        // });
        bindEventBySelector(".qmd-hide-slice", 'click', function() {
            var resetRange = function(rangeName) {
                var aa = document.getElementById(rangeName);
                aa.value = "0,100";
                aa.range0.value = 0;
                aa.range1.value = 100;
            }
            resetRange('axial-progress1');
            resetRange('axial-progress2');
            resetRange('axial-progress3');
            for (var i = 0; i < 6; i++)
                qmodel.set_clip_persent(i, false);
        });
        document.getElementById('axial-progress1').addEventListener('input', function() {
            console.log(this.value);
            var values = this.value.split(',');
            if (values.length != 2) return;
            if (values[0] > 0) {
                qmodel.set_clip_persent(3, true, 100 - parseInt(values[0]));
            } else
                qmodel.set_clip_persent(3, false);

            if (parseInt(values[1]) < 100) {
                qmodel.set_clip_persent(0, true, 100 - parseInt(values[1]));
            } else
                qmodel.set_clip_persent(0, false);
        });
        document.getElementById('axial-progress2').addEventListener('input', function() {
            console.log(this.value);
            var values = this.value.split(',');
            if (values.length != 2) return;
            if (values[0] > 0) {
                qmodel.set_clip_persent(4, true, 100 - parseInt(values[0]));
            } else
                qmodel.set_clip_persent(4, false);

            if (parseInt(values[1]) < 100) {
                qmodel.set_clip_persent(1, true, 100 - parseInt(values[1]));
            } else
                qmodel.set_clip_persent(1, false);
        });
        document.getElementById('axial-progress3').addEventListener('input', function() {
            console.log(this.value);
            console.log(this.value);
            var values = this.value.split(',');
            if (values.length != 2) return;
            if (values[0] > 0) {
                qmodel.set_clip_persent(5, true, 100 - parseInt(values[0]));
            } else
                qmodel.set_clip_persent(5, false);

            if (parseInt(values[1]) < 100) {
                qmodel.set_clip_persent(2, true, 100 - parseInt(values[1]));
            } else
                qmodel.set_clip_persent(2, false);
        });


    }

    //剖面框开关
    function onClip(code) {
        if (ClipIndex != -1)
            qmodel.toolbarPlugin.SetClipVisible(code);
    }
    //剖面移动
    function onClipAdd(code, value) {
        qmodel.toolbarPlugin.onClipAdd(code, value);
    }



    //当构件属性被点击时触发
    //需要bind到document
    function onPtyModify(kv) {
        var value = kv.target.parentNode.parentNode.innerText;
        var svalue = value.split("\t");
        console.log(svalue);
    }

    //当查看显示计划关联的构件id时触发
    //需要bind到document
    function doSeeScheG(id) {
        qmodel.toolbarPlugin.doSeeSche(id);
    }
    //删除计划
    //需要bind到document
    function doDeleteScheG(id) {
        qmodel.toolbarPlugin.doDeleteSche(id);
    }
    //绑定计划
    //需要bind到document
    function doBandingScheG(id) {
        qmodel.toolbarPlugin.doBandingSche(id);
    }
    //查看视角id
    //需要bind到document
    function doSeeViewG(id) {
        qmodel.toolbarPlugin.doSeeView(id);
    }
    //删除视角
    //需要bind到document
    function doDeleteViewG(id) {
        qmodel.toolbarPlugin.doDeleteView(id);
    }
    //插入设备。id为设备表id
    //需要bind到document
    function doInsertExtmodelG(id) {
        qmodel.toolbarPlugin.insertExtModel(id);
    }

    //设置材质 此功能未实现
    //需要bind到document
    function doSetMaterial(id) {
        qmodel.toolbarPlugin.setSysMaterial(id);
    }
    //页面上的一些事件要绑定到document,在构造dom时有用。
    function doBind() {
        window.onPtyModify = onPtyModify;
        window.doSetMaterial = doSetMaterial;
        window.doInsertExtmodelG = doInsertExtmodelG;
        window.doDeleteViewG = doDeleteViewG;
        window.doBandingScheG = doBandingScheG;
        window.doDeleteScheG = doDeleteScheG;
        window.doSeeScheG = doSeeScheG;
        window.doSeeViewG = doSeeViewG;
    }


    //初始化结构树的根目录。暂停使用
    function initTree() {
        var a = document.getElementById("divBfTree");
        if (!a) return;
        var root = new TreeNode("全部分类1");
        a.appendChild(root.element);
        var node1 = new TreeNode("JModelByZhengtengzhou");
        root.addChildNode(node1);
    }
    //剖面位置点击，直接设置剖面值
    function setClipIndex(idx) {
        if (ClipIndex == -1) {
            ClipIndex = idx;
            onClip(ClipIndex);
        } else if (ClipIndex != idx) {
            onClip(ClipIndex);
            ClipIndex = idx;
            onClip(ClipIndex);
        } else {
            onClip(ClipIndex);
            ClipIndex = -1;
        }
    }
    //剖面的开关
    function OnbfSelectionOptionAxialClick(e) {
        if (e.target.innerHTML === "X轴") setClipIndex(0);
        if (e.target.innerHTML === "Y轴") setClipIndex(1);
        if (e.target.innerHTML === "Z轴") setClipIndex(2);
        if (e.target.innerHTML === "-X轴") setClipIndex(3);
        if (e.target.innerHTML === "-Y轴") setClipIndex(4);
        if (e.target.innerHTML === "-Z轴") setClipIndex(5);
        if (e.target.innerHTML === "关闭") setClipIndex(-1);
        var checked = e.target.classList.contains('axial-checked');
        if (checked)
            e.target.classList.remove('axial-checked');
        else
            e.target.classList.add('axial-checked');
    }
    //剖面的开关
    function OnbfSelectionOptionClick(e) {
        console.log(e.target);
        var elem = e.target.parentNode.parentNode;
        var cursel = elem.getElementsByClassName("qm-select-current");
        cursel[0].innerHTML = e.target.innerHTML;
        cursel[0].classList.remove("qm-open");
    }
    //剖面的开关
    function OnbfSelectionClick(e) {
        console.log(e.target);
        var elem = e.target;
        if (elem.classList.contains("qm-open"))
            elem.classList.remove("qm-open");
        else
            elem.classList.add("qm-open");
    }
    //所有浮动窗口的关闭
    function OnbfCloseClick(e) {
        // console.log(e.target);
        var elem = e.target.parentNode;
        elem.style.display = "none";
        if (elem.id == "property-map-dialog") {
            qmodel.show_map(null, false);
            document.querySelector(".qmd-map").classList.remove('qm-checked');
        } else if (elem.id == "property-panel") {
            document.querySelector(".qmd-properties").classList.remove('qm-checked');
        } else if (elem.id == "property-plan-dialog") {
            document.querySelector(".qmd-plan").classList.remove('qm-checked');
        } else if (elem.id == "property-view") {
            document.querySelector(".qmd-view").classList.remove('qm-checked');
        } else if (elem.id == "property-extmodel") {
            document.querySelector(".qmd-extmodel").classList.remove('qm-checked');
        } else if (elem.id == "modalInfoDiv") {
            document.querySelector(".qmd-information").classList.remove('qm-checked');
        } else if (elem.id == "property-set-dialog") {
            document.querySelector(".qmd-set").classList.remove('qm-checked');
        } else if (elem.id == "axiDiv") {
            qmodel.toolbarPlugin.resetOperater('section-axial');
            document.querySelector(".qmd-section-axial").classList.remove('qm-checked');
        }
    }
    //显示或隐藏一个div
    function showdiv(divName) {
        var a = document.getElementById(divName);
        if (a) a.style.display = "block";
    }

    function hideDiv(divName) {
        var a = document.getElementById(divName);
        if (a) a.style.display = "none";
    }

    function setDomHtml(domName, html) {
        var a = document.getElementById(domName);
        if (a)
            a.innerHTML = html;
    }

    //标题的点击事件
    function OnbfTitleClick(e) {
        if (e.target.tagName != 'DIV') return;

        var elem = e.target.parentNode;

        var deltaX = event.clientX - parseInt(elem.style.left);
        if (elem.style.left == "50%")
            deltaX = event.clientX - document.body.clientWidth * 0.5;
        if (elem.style.left == "")
            deltaX = event.clientX - parseInt(elem.offsetLeft);
        var deltaY = event.clientY - parseInt(elem.style.top);
        if (elem.style.top == "50%")
            deltaY = event.clientY - document.body.clientHeight * 0.5;
        if (elem.style.top == "")
            deltaY = event.clientY - parseInt(elem.offsetTop);
        document.addEventListener("mousemove", moveHandler); //attachEvent()为注册事件
        document.addEventListener("mouseup", upHandler);
        console.log("begin");
        event.cancelBubble = true; //阻止事件冒泡
        event.returnValue = false; //令返回值等于空
        function moveHandler(e) {
            if (!e)
                e = window.event;
            elem.style.left = (e.clientX - deltaX) + "px";
            elem.style.top = (e.clientY - deltaY) + "px";
            e.cancelBubble = true;
        }

        function upHandler(e) {
            console.log("end");
            if (!e)
                e = window.event;
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
            e.cancelBubble = true;
        }
    }
    //viewcube的初始化。
    function initbox(_1) {
        // viewcube
        var viewcubeElement = document.getElementById('viewcube');
        if (!viewcubeElement) return;
        // simple
        //var viewcube = new FOUR.Viewcube(viewcubeElement, camera);
        // extended
        viewcube = new FOUR.Viewcube({
            domElement: viewcubeElement,
            labelSize: 150,
            labelFontSize: 36,
            updateTween: false,
            display: {
                sceneAxis: true
                    //cameraAxis: true,
                    //controlAxis: true,
            },
            viewport: {
                camera: camera
            },
            viewer: _1
        });
        viewcube.enable();
        controls.addEventListener('change', function() {
            // sync viewcube with new camera rotation
            viewcube.updateOrientation();
        });

        viewcube.addEventListener('update', function(event) {
            //TODO: position and rotate camera around it's target
            var yawPitch = event.direction;
            var view = event.view;

            //                var q = new QMCore.QmQuaternion();
            //                q.setFromEuler(new QMCore.QmEuler(yawPitch.pitch, Math.PI+yawPitch.yaw, 0, "YXZ"));
            //                test_doll.quaternion.copy(q);

            ////////
            rotateQmodelCamera(camera, new QMCore.QmVector3(), yawPitch.yaw, yawPitch.pitch, true);
        });
    }

    function buildContextMenu() {
        contextMenuCreater = new ContextMenuCreater(document.getElementById('context'));
        contextMenuCreater.createMenu();
        contextMenuCreater.enableMenu = qmodelSceneOption.enableMenu;
        document.oncontextmenu = function(env) {
            if (env.target.id == "context")
                return false;
        };
        ThreeContainer.onclick = function() {
            var contextmenu = document.getElementById("context");
            if (contextmenu)
                contextmenu.style.display = "none";
        };
    }

    function getRenderRects() {
        var modelRect = null;

        var modeldiv = document.getElementById('qmodel-div');
        var pntdivrec = modeldiv.getClientRects();
        if (pntdivrec.length)
            modelRect = pntdivrec[0];


        var r = {};
        r.width = modelRect.width;
        r.height = modelRect.height;
        if (r.height == 0)
            r.height = window.innerHeight;
        r.left = modelRect.left + 0;
        r.top = modelRect.top + 0;
        return r;
        }

    function initQModelParam() {

        var qmParams = new QModelX.QmParams();

        //begin -- 每个框架对于偏移的设置方法不一样。
        var r = getRenderRects();
        document.getElementById('canvasmain').style.height = r.height;
        document.getElementById('canvasmain').style.width = r.width;
        qmParams.pageWidth = r.width;
        qmParams.pageHeight = r.height;
        qmParams.offsetLeft = r.left;
        qmParams.offsetTop = r.top;
        //end -- 每个框架对于偏移的设置方法不一样。。
        //把设置都搬过来
        qmParams.opToolbar = qmodelSceneOption.opToolbar;
        qmParams.opModelSelect = qmodelSceneOption.opModelSelect;
        qmParams.opTree = qmodelSceneOption.opTree;
        qmParams.opProperty = qmodelSceneOption.opProperty;
        qmParams.opHome = qmodelSceneOption.opHome;
        qmParams.opRectSelect = qmodelSceneOption.opRectSelect;
        qmParams.opMeasure = qmodelSceneOption.opMeasure;
        qmParams.opClip = qmodelSceneOption.opClip;
        qmParams.opWalk = qmodelSceneOption.opWalk;
        qmParams.opMap = qmodelSceneOption.opMap;
        qmParams.opMark = qmodelSceneOption.opMark;
        qmParams.opMark2D = qmodelSceneOption.opMark2D;
        qmParams.opMark3D = qmodelSceneOption.opMark3D;
        qmParams.opViewpoint = qmodelSceneOption.opViewpoint;
        qmParams.opMaterialSet = qmodelSceneOption.opMaterialSet;
        qmParams.opInfo = qmodelSceneOption.opInfo;
        qmParams.opSetting = qmodelSceneOption.opSetting;
        qmParams.showShadow = qmodelSceneOption.showShadow;
        qmParams.transpvalue = qmodelSceneOption.transpvalue;
        qmParams.shininess = qmodelSceneOption.shininess;
        qmParams.openPone = qmodelSceneOption.openPone;
        qmParams.contrast = qmodelSceneOption.contrast;
        qmParams.skybox = qmodelSceneOption.skybox;
        if (qmodelSceneOption.color.indexOf('#') == 0)
        qmParams.backgroundColor = parseInt('0x' + qmodelSceneOption.color.substr(1));
        else
            qmParams.backgroundColor = qmodelSceneOption.color;
        qmParams.autotransp = qmodelSceneOption.autotransp;
        qmParams.lightlevel = qmodelSceneOption.lightlevel;
        qmParams.opendrlight = qmodelSceneOption.opendrlight;
        qmParams.lightdrlevel = qmodelSceneOption.lightdrlevel;
        qmParams.showqrcode = qmodelSceneOption.showqrcode;
        qmParams.showPty = qmodelSceneOption.showPty;
        qmParams.showCube = qmodelSceneOption.showCube;
        qmParams.showTree = qmodelSceneOption.showTree;
        qmParams.openLog = qmodelSceneOption.openLog;
        qmParams.randerCount = null; //分段刷新长度   
        qmParams.openIns = true;
        qmParams.keepRender = qmodelSceneOption.keepRender;
        qmParams.openBloom = qmodelSceneOption.openBloom;
        qmParams.materialOffer = qmodelSceneOption.materialOffer;
        qmParams.loadDefaultviews = qmodelSceneOption.loadDefaultviews;
        qmParams.autoZoom = qmodelSceneOption.autoZoom;
        qmParams.zoomLock = qmodelSceneOption.zoomLock;
        qmParams.autoTarget = qmodelSceneOption.autoTarget;
        qmParams.noServer = false;
        qmParams.transparentBg = qmodelSceneOption.transparentBg ? true : false;
        qmParams.bgImg = qmodelSceneOption.bgImg ? qmodelSceneOption.bgImg : null;
        qmParams.markCulling = qmodelSceneOption.markCulling;
        qmParams.selectedEdge = qmodelSceneOption.selectedEdge;
        qmParams.modelLod = qmodelSceneOption.modelLod;
        qmParams.modelAutoClear = qmodelSceneOption.modelAutoClear;
        qmParams.merge = true; //默认合并
        qmParams.movementSpeed = qmodelSceneOption.movementSpeed;
        qmParams.lookSpeed = qmodelSceneOption.lookSpeed;
        qmParams.type = 2;
        qmParams.noServerKey = null;
        qmParams.clickCenter = qmodelSceneOption.clickCenter; //模型选中的时候是否自动定位到中心。        
        qmParams.renderType = 0; //切换渲染的类型。当提交的模型为真实，则允许切换“真实”和“着色”，=1是“着色”，=0是“真实”。当提交的模型是“着色”则此参数无效。
        qmParams.luminanceOfReal = 0.5; //贴图构件的明亮度，范围从0到1，控制亮度。1代表最亮。
        qmParams.showExt = qmodelSceneOption.showExt;
        qmParams.selectOnTop = qmodelSceneOption.selectOnTop;
        qmParams.mergeInstance = qmodelSceneOption.mergeInstance;
        qmParams.rayByOctree = qmodelSceneOption.rayByOctree;
        qmParams.hasGis = hasGis;
        return qmParams;
        //todo
    }

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var mm = window.location.href;
        mm = mm.substr(mm.lastIndexOf("?") + 1, 1024);
        var r = mm.match(reg); //匹配目标参数
        if (r != null) return unescape(decodeURI(r[2]));
        return null; //返回参数值
    }
    this.getUrlParam = getUrlParam;

    function initSettingDemo() {
        qmodel.set_mouseclick_call(function (event) {
            if (event.button != 2) return;
            if (contextMenuCreater.enableMenu == false) return;
            if (contextMenuCreater) contextMenuCreater.prepareMenu();
            var context = document.getElementById("context");
            if (!context)
                return;
            context.style.display = "block";

            var x = event.clientX;

            var y = event.clientY;
            if (scope.qmodeldvr) {
                x = x - scope.qmodeldvr.left;
                y = y - scope.qmodeldvr.top;
            }

            var w = window.innerWidth;
            var h = window.innerHeight;

            context.style.left = Math.min(w - 202, x) + 5 + "px";
            context.style.top = Math.min(h - 230, y) + 5 + "px";;

        });
        document.getElementById('property-set1').onclick = function() {
            this.classList.add('qm-checked');
            document.getElementById('property-set2').classList.remove('qm-checked');
            document.getElementById('set-table1').style.display = "block";
            document.getElementById('set-table2').style.display = "none";
        }
        document.getElementById('property-set2').onclick = function() {
                this.classList.add('qm-checked');
                document.getElementById('property-set1').classList.remove('qm-checked');
                document.getElementById('set-table1').style.display = "none";
                document.getElementById('set-table2').style.display = "block";
            }
            //以下实现实时改变环境效果。
        document.querySelector('#set-v3').addEventListener('change', function(e) {
            //触发效果 				
            console.log(e.target.value);
            qmodel.set_light(0xffffff, parseFloat(e.target.value));
        });


        document.querySelector('#set-v4').addEventListener('change', function(e) {
            //触发效果 				
            console.log(e.target.value);
            qmodel.set_dir_light(0xffffff, parseFloat(e.target.value));
        });
        document.querySelector('#set-ck5').addEventListener('click', function(e) {
            //触发效果 				
            console.log(e.target.value);
            if (e.target.checked)
                qmodel.add_shadow();
            else
                qmodel.remove_shadow();
        });

        document.querySelector('#set-v1').addEventListener('change', function(e) {
            //触发效果 				
            console.log(e.target.value);
            var color = "0x" + e.target.value.substr(1, 7);
            qmodel.set_background(parseInt(color));

        });

        document.querySelector('#set-ck6').addEventListener('change', function(e) {
            //触发效果 				
            if (e.target.checked)
                qmodel.set_background(-1);
            else {
                var color = "0x" + document.getElementById('set-v1').value.substr(1, 7);
                qmodel.set_background(parseInt(color));
            }
        });

        document.querySelector('#set-ck-clickCenter').addEventListener('change', function(e) {
            //触发效果 				
            if (e.target.checked)
                qmodel.set_clickCenter(true);
            else {
                qmodel.set_clickCenter(false);
            }
        });

        document.querySelector('#set-ck-zoomLock').addEventListener('change', function(e) {
            //触发效果 				
            if (e.target.checked)
                qmodel.set_zoomLock(true);
            else {
                qmodel.set_zoomLock(false);
            }
        });

        document.querySelector('#set-ck-damping').addEventListener('change', function(e) {
            //触发效果 				
            if (e.target.checked)
                qmodel.set_enable_damping(true);
            else {
                qmodel.set_enable_damping(false);
            }
        });


        document.querySelector('#set-sel2').addEventListener('change', function(e) {
            //触发效果 		
            if (!document.getElementById('set-ck6').checked) return;
            qmodel.set_background(-1, e.target.value);

        });





    }

    function initCallBackDemo() {

        document.getElementById("property-extmodel-edit-open").onclick = function() {
            if (renderer2)
                renderer2.domElement.style.display = "none";
            var a = document.getElementById("property-extmodel-edit-open");
            a.style.display = "none";
            var b = document.getElementById("property-extmodel-edit-exit");
            b.style.display = "inline-block";
            qmodel.set_ext_move_statu(true);
        }
        document.getElementById("property-extmodel-edit-exit").onclick = function() {
            if (renderer2)
                renderer2.domElement.style.display = "block";
            var a = document.getElementById("property-extmodel-edit-exit");
            a.style.display = "none";
            var b = document.getElementById("property-extmodel-edit-open");
            b.style.display = "inline-block";
            qmodel.set_ext_move_statu(false);
        }
        document.getElementById("property-extmodel-edit-close").onclick = function() {
            var a = document.getElementById("property-extmodel-dialog");
            a.style.display = "none";
            qmodel.debugSetQmTransformOpen(false);
        }


        document.getElementById("btn-setDefaultView").onclick = function() {
            qmodel.save_view("封面");
        }

        document.getElementById("property-set-save").onclick = function() {
            var e = document.querySelector(".qmd-set");
            e.classList.remove('qm-checked');

            var a = document.getElementById("property-set-dialog");
            var jsons = localStorage.getItem('QMODEL_SET_V2', jsons);
            var tf = JSON.parse(jsons);
            if (tf) {
                tf.color = document.getElementById("set-v1").value;
                tf.autotransp = document.getElementById("set-ck1").checked;
                tf.lightlevel = document.getElementById("set-v3").value;
                tf.opendrlight = document.getElementById("set-ck2").checked;
                tf.lightdrlevel = document.getElementById("set-v4").value;
                tf.contrast = document.getElementById("set-v5").value;
                tf.showqrcode = document.getElementById("set-ck3").checked;
                tf.lookSpeed = document.getElementById("set-v6").value;
                tf.luminanceOfReal = document.getElementById("set-mat").value;
                tf.renderType = document.getElementById('sel-mat').value;
                tf.clickCenter = document.getElementById('set-ck-clickCenter').checked;
                tf.movementSpeed = document.getElementById("set-v7").value;
                tf.transpvalue = document.getElementById("set-v8").value;
                tf.shininess = document.getElementById("set-v9").value;
                tf.openPone = document.getElementById("set-ck4").checked;
                tf.showShadow = document.getElementById("set-ck5").checked;
                tf.transparentBg = document.getElementById("set-ck6").checked;
                tf.skybox = document.getElementById('set-sel1').value;
                tf.bgImg = document.getElementById('set-sel2').value;
                tf.yz = document.getElementById('set-ck7').checked;
                if (tf.bgImg == "空")
                    tf.bgImg = null;
                var jsons = JSON.stringify(tf);
                localStorage.setItem('QMODEL_SET_V2', jsons);
                qmodel.save_scene(tf);

                    if (document.getElementById("set-table2").style.display == "block")
                        location.reload();
                    else
                        a.style.display = "none";


            } else {
                alert("ERROR!");
            }
        };


        document.getElementById("property-extmodel-edit-save").onclick = function() {
            var a = document.getElementById("property-extmodel-dialog");
            var tf = qmodel.get_model_transform();
            if (tf) {
                tf.x = document.getElementById("ext-v1").value;
                tf.y = document.getElementById("ext-v2").value;
                tf.z = document.getElementById("ext-v3").value;
                tf.anglez = document.getElementById("ext-v4").value;
                tf.angley = document.getElementById("ext-v5").value;
                tf.anglex = document.getElementById("ext-v6").value;
                if (qmodel.set_model_transform(tf))
                    alert("已保存");
                else
                    alert("请选择一个设备");
            } else {
                alert("请选择一个设备");
            }
        };
    }
    this.InitModelList = function() {
        window.onOpen = function(e) {
            console.log(e);
            //todo 请用户自己改造。
            var ln = document.URL.indexOf('?');
            if (ln < 1) ln = document.URL.length;
            var url1 = document.URL.substring(0, ln) + '?model=' + e;
            document.location.href = url1;
            //    location.reload();
        };
        window.translateModel = function(e) {
            console.log("todo");

        };
        var modeodiv = document.getElementById("div-modellist");
        modeodiv.style.display = "block";


        var net = this.netPlugin;
        var container = document.getElementById('model-container');
        container.innerHTML = "";
        net.getToken().then(e => {
            net.getModels(100).then(e => {
                console.log(e);
                e.forEach(element => {
                    var li1 = document.createElement("li");
                    li1.classList.add('model-title');
                    if (element.ex1 == 'try' || element.ex1 == '-1') {
                        var a2 = document.createElement("a");
                        // a2.style.position = 'absolute';
                        a2.style.color = '#ff0000';
                        li1.appendChild(a2);
                        a2.innerText = '转换失败，点击重试';
                        a2.setAttribute('onclick', 'translateModel("' + element.id + '")');
                    } else if (!element.ex1) {
                        var a2 = document.createElement("a");
                        //  a2.style.position = 'absolute';
                        a2.style.color = '#ff0000';
                        li1.appendChild(a2);
                        a2.innerText = '转换中';
                    }
                    var img = document.createElement("img");
                    li1.appendChild(img);
                    if (element.filePath) {
                        img.src = net.getImg_v2(element.filePath);
                    } else {
                        img.src = 'static/page/123.png'; //`${_123png}`; //'page/123.png';
                    }
                    img.setAttribute('onclick', 'onOpen("' + element.fileName + '")');




                    var a1 = document.createElement("a");
                    li1.appendChild(a1);
                    a1.setAttribute('onclick', 'onOpen("' + element.fileName + '")');

                    a1.innerText = element.fileName;
                    container.appendChild(li1);
                });
            });
        });
    };
    //模型初始化。
    this.loadModel = function (modelName, type) {
        //模型名称
        var model = modelName ? modelName : getUrlParam('model');
        if (!model) return;
        var _type = type ? type : getUrlParam('type');
        var _version = getUrlParam('version');
        //模型打开后预期定位目标
        var mark = getUrlParam('mark'); //在打开的时候
        var lookat = getUrlParam('lookat');

        if (!_type) {
            if ((model.indexOf('.rvt') > 0) || (model.indexOf('.RVT') > 0) || (model.indexOf('.rfa') > 0) || (model.indexOf('.tkl') > 0))
                _type = 0;
            else if (model.indexOf('.gltf') > 0)
                _type = 2;
            else if (model.indexOf('.ifc') > 0)
                _type = 101;
            else
                _type = 1;
        }

        var qmParams = initQModelParam(_type);
        qmParams.type = _type;
        //----------type=5按离线模型加载
        if (_type == 5) {
            //  model = 'http://www.qmodel.cn:9107/resourceHandle/file/downloadByPath/20191205/161899279759046';
            qmParams.noServerKey = model.substring(model.lastIndexOf('\\') + 1, 100);
            qmParams.noServer = true;
            model = window.location.origin + '/' + model;
            console.log('qmodel将以无后端服务版本运行。');
        }
        //----------type=2加载gltf
        if (_type == 2) {
            model = window.location.origin + '/' + model;
            console.log('qmodel打开gltf');
        }
        if (_version)
            qmParams.version = _version;
        buildContextMenu();
        //netOption 非离线版本不可为空，离线版本不需要

        //页面初始化
        var _this = this;
        initPage(qmParams);
        var languageOption = new Language(LanguageEnum.Chinese);
        qmodel.open_model(model, qmParams, _this.netPlugin, languageOption).then(e => {

            //初始化html绑定回调示例，不影响业务
            //页面调整
            initCallBackDemo();
            // changeStyle(1); 修改皮肤样式举例

            //初始化html示例的菜单
            initSettingDemo();
            if (mark)
                qmodel.goto_view(mark);

            //模型打开后调用一下回调，给业务预留位置。  
            if (_this.on_model_loaded_callback)
                _this.on_model_loaded_callback();
            if (lookat) {
                qmodel.lookat_comp(lookat);
            }
        });

    };
    //旧接口保留。新接口分离开页面设置和模型画布设置。为updateClientRects_div和updateClientRects_canvas
    this.updateClientRects = function(rect, force = true) {
        console.log('resize');
        var qmodeldvr = getRenderRects();
        var r = rect ? rect : qmodeldvr;
        var modeldiv = document.getElementById('qmodel-div');
        modeldiv.style.height = r.height + 'px';
        modeldiv.style.width = r.width + 'px';
        modeldiv.style.left = r.left + 'px';
        modeldiv.style.top = r.top + 'px';
        document.getElementById('canvasmain').style.height = r.height;
        document.getElementById('canvasmain').style.width = r.width;
        this.qmodeldvr = r;
        if (force) {
            qmodel.set_clientrects(qmodeldvr.left, qmodeldvr.top, qmodeldvr.width, qmodeldvr.height);
        }
    };
    this.updateClientRects_canvas = function (rect) {
        var qmodeldvr = rect ? rect : getRenderRects();
        qmodel.set_clientrects(qmodeldvr.left, qmodeldvr.top, qmodeldvr.width, qmodeldvr.height);

    };

    this.updateClientRects_div = function (rect) {
        var r = rect ? rect : getRenderRects();
        var modeldiv = document.getElementById('qmodel-div');
        modeldiv.style.height = r.height + 'px';
        modeldiv.style.width = r.width + 'px';
        modeldiv.style.left = r.left + 'px';
        modeldiv.style.top = r.top + 'px';
        document.getElementById('canvasmain').style.height = r.height;
        document.getElementById('canvasmain').style.width = r.width;
        this.qmodeldvr = r;
    };
    var themeDemoType = localStorage.getItem("qmodel-theme");
    if (themeDemoType)
        setTheme(themeDemoType);

}