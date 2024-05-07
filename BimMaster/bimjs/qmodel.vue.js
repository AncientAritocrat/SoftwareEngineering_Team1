function onframe_loaded(bindCallback, getmodels) {
    //frame加载时触发。预留
}
//用于VUE框架，设置设备插入成功后的回调。f=function(e)参数为e=设备id
function onframe_set_ext_model_insert_callback(f) {
    qmodel.set_ext_model_insert_callback(f);
}
//用于VUE框架，设置设备插入成功后的回调。点击设备时触发f=function(e)。参数e为{id:0,name:''}
function onframe_set_ext_model_click_callback(f) {
    qmodel.set_ext_model_click_callback(f);
}
//用于VUE框架，设置构件被选中时的操作。点击设备时触发f=function(e)。参数e为构件Uniqueid
function onframe_select_callback(f) {
    qmodel.set_select_callback(f);
}

//用于VUE框架，设置构件选择变化的时候触发。点击设备时触发f=function(e)。参数e为构件选择的数量。
function onframe_selected_callback(f) {
    qmodel.set_selected_callback(f);
}
//用于VUE框架，当标签被点击。参数是标签信息rid=构件ID, viewId=视口ID（有可能 为空）pngIndex=标签图片名称
function onframe_mark_callback(f) {
    qmodel.set_mark_click_callback(f);
}
//设置标签的移出移出事件。参数是标签信息rid=构件ID, viewId=视口ID（有可能 为空），pngIndex=标签图片名称，
function onframe_mark_mouse_callback(f) {
    qmodel.set_mark_mouse_callback(f);
}
//设置插入Mark的信息。[{"rid":"0^c15e57ae-56be-490a-ba2b-a6b7fccbfe64-0002f95f","position":[-21.14765167236328,-13.495732168527601,8.67607785860341],"pngNum":6}]
//其中pngNum为图片类型。
function onframe_mark_insert_callback(f) {
    qmodel.set_mark_insert_callback(f);
}
//用于VUE框架，当设备被删除时触发。
function onframe_delete_ext_callback(f) {
    qmodel.set_ext_model_delete_callback(f);
}

//用于VUE框架，需要预处理构件的透明度时使用。,其中f=function(option),option={cmpIds:[],categoryIds:[],transparency:0.5}
function onframe_defulat_transparent_callback(f) {
    //qmodel.getTransparentCmps = f;
    qmodel.set_default_material_option(f());
}
//用于VUE框架，设置模型加载完成之后 调用。
function onframe_after_model_loaded_callback(f) {
    //qmodel.getTransparentCmps = f;
    qmodel.set_after_model_loaded_callback(f);
}
//用于VUE框架，设置回调qmodel接收到的按键。
function onframe_keydown_callback(f) {
    qmodel.set_keydown_call(f);
}
//用于VUE框架，设置回调qmodel接收到的鼠标点击Event。
function onframe_mouseclick_callback(f) {
    qmodel.set_mouseclick_call(f);
}
//用于VUE框架，设置回调qmodel接收到的鼠标双击Event。
function onframe_mousedbclick_callback(f) {
    qmodel.set_mousedbclick_call(f);
}
//设置相机变化的回调：该方法仅在非漫游的时候生效。
function onframe_set_camera_change_callback(f) {
    qmodel.set_camera_change_callback(f);
}


//用于VUE框架，设置回调qmodel接收到的按键。
function onframe_dommove_callback(f) {
    qmodel.set_dommove_call(f);
}

function initVueFrame(_loadModel, _qmodel) {
    if (window.parent && window.parent.frame_token) {
        localStorage.setItem(ID_TOKEN, window.parent.frame_token);
        localStorage.setItem(USER_ID, window.parent.frame_user);
    }
    var loadModel = _loadModel;
    var qmodel = _qmodel;
    window.addEventListener("message", function(event) {
        var data = event.data;
        //  console.log('收到vue的数据：', data);
        switch (data.cmd) {
            case 'get_camera_json':
                window.parent.postMessage({
                    cmd: data.cmd,
                    camerajson: qmodel.get_camera_json()
                }, '*');
                break;

            case 'set_camera_json':
                qmodel.set_camera_json(data.camerajson);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'loadModel':
                loadModel();
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'get_all_marks':
                window.parent.postMessage({
                    cmd: data.cmd,
                    markjson: qmodel.get_all_marks(),
                }, '*');
                break;

            case 'get_selection_ids':
                window.parent.postMessage({
                    cmd: data.cmd,
                    ids: qmodel.get_selection_ids(),
                }, '*');
                break;

            case 'reset_marks':
                qmodel.reset_marks(data.markjson);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'save_view':
                qmodel.save_view(data.viewName).then(e => {
                    window.parent.postMessage({
                        cmd: data.cmd,
                        id: e,
                    }, '*');
                });
                break;

            case 'delete_view':
                qmodel.delete_view(data.id);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');

                break;
            case 'goto_view':
                qmodel.goto_view(data.id, data.mark, data.speed);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');

                break;

            case 'delete_ext_model':
                qmodel.delete_ext_model(data.id);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');

                break;
            case 'play_views':
                qmodel.play_views(data.pointInfo, data.walktime, data.delay);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'stop_play':
                qmodel.stop_play();
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'go_play':
                qmodel.go_play();
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'lookat_comp':
                qmodel.lookat_comp(data.id);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'set_comps_color':
                var ids = data.ids ? data.ids : qmodel.get_selection_ids();
                qmodel.set_comps_color(ids, data.color);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'reset_comps_color':
                var ids = data.ids ? data.ids : qmodel.get_selection_ids();
                qmodel.set_comps_color(ids, null);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'set_mark':
                qmodel.set_mark(data.markJson, data.markInfo);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'set_comps_transparency':
                var ids = data.ids ? data.ids : qmodel.get_selection_ids();
                qmodel.set_comps_transparency(ids, data.v, data.color, data.lock);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'set_all_comps_transparency':
                qmodel.set_all_comps_transparency(data.v, data.lock, false);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'set_all_comps_visiblity':
                qmodel.set_all_comps_visiblity(data.v, true);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'remove_all_marks':
                qmodel.remove_all_marks();
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'set_comps_visiblity':
                var ids = data.ids ? data.ids : qmodel.get_selection_ids();
                qmodel.set_comps_visiblity(ids, data.visibility);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'show_all_comps':
                qmodel.show_all_comps(data.visibility);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'get_select_mesh': // 读取选择的设备信息
                window.parent.postMessage({
                    cmd: data.cmd,
                    geometry: qmodel.get_select_mesh(),
                }, '*');
                break;

            case 'get_cmp_mesh': // 读取指定构件的几何信息
                window.parent.postMessage({
                    cmd: data.cmd,
                    mesh: qmodel.get_cmp_mesh(data.cmpId),
                }, '*');
                break;
            case 'load_ext_model': // 载入扩展设备数据
                qmodel.load_ext_model(data.data);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'insert_ext_model': // 开启设备插入模式，鼠标点击位置上插入
                qmodel.insert_ext_model(data.id);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'set_ext_model_color': //设置某个设备的着色。color支持从0到0xffffff
                qmodel.set_ext_model_color(data.id, data.color);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'insert_3d_Mark':
                //这是一个Dom例子，您可以根据您的平台风格做任何调整：data={point,normal,title,content}
                if (qmodel.css3dDomList == null)
                    qmodel.css3dDomList = new Map();
                if (qmodel.css3dDomList.has(data.id)) {
                    var doms = qmodel.css3dDomList.get(data.id);
                    doms.symbol.textContent = data.title;
                    doms.details.innerHTML = data.content;
                    return;
                }
                const element = document.createElement('div');
                element.className = 'element';
                element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

                const number = document.createElement('div');
                number.className = 'number';
                number.textContent = data.id;
                element.id = data.id;
                element.appendChild(number);
                element.onclick = function(target) {
                    var id = target.srcElement.id
                    if (!id)
                        id = target.srcElement.parentNode.id;
                    console.log("点击3D标签：" + id);
                }

                const symbol = document.createElement('div');
                symbol.className = 'symbol';
                symbol.textContent = data.title;
                element.appendChild(symbol);

                const details = document.createElement('div');
                details.className = 'details';
                details.innerHTML = data.content;
                element.appendChild(details);
                qmodel.css3dDomList.set(data.id, {
                    symbol: symbol,
                    details: details,
                });
                qmodel.insert_3d_Mark(JSON.parse(data.point), JSON.parse(data.normal), element);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'get_screenshot':
                var img = qmodel.get_screenshot();
                window.parent.postMessage({
                    cmd: data.cmd,
                    imageData: img,
                }, '*');
                break;
            case 'get_rooms':
                var rooms = qmodel.get_rooms();
                window.parent.postMessage({
                    cmd: data.cmd,
                    rooms: rooms,
                }, '*');
                break;
            case 'rotate_models':
                qmodel.rotate_models(data.x, data.y, data.z);
                window.parent.postMessage({
                    cmd: data.cmd,
                    imageData: img,
                }, '*');
                break;
            case 'get_qmodel_style':
                var styles = {
                    toolbar: " position: absolute;left: 50%;bottom: 20px;transform: translate(-50%, 0)",
                    tree: document.getElementById("divTree").style.cssText,
                    tree_button: "position: absolute;    left: 10px;    top: 10px",
                    property: document.getElementById("property-panel").style.cssText,
                    qrcode: "display:block;"
                };

                window.parent.postMessage({
                    cmd: data.cmd,
                    style: styles,
                }, '*');
                break;
            case 'set_qmodel_style':
                if (data.data.toolbar)
                    document.getElementById("qmodel_toolbar").style.cssText = data.data.toolbar;
                if (data.data.tree)
                    document.getElementById("divTree").style.cssText = data.data.tree;
                if (data.data.tree_button)
                    document.getElementById("qmodel_tree_btn").style.cssText = data.data.tree_button;
                if (data.data.property)
                    document.getElementById("property-panel").style.cssText = data.data.property;
                if (data.data.qrcode)
                    document.getElementById("qrcode1").style.cssText = data.data.qrcode;
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;

            case 'set_qmodel_toolbar':
                var fff = function(b) {
                    if (b) return "inline-block";
                    else return "none";
                }
                $(".qmd-home").css("display", fff(data.data.home));
                $(".qmd-zoomrect").css("display", fff(data.data.zoomrect));
                $(".qmd-measure").css("display", fff(data.data.measure));
                $(".qmd-section-axial").css("display", fff(data.data.axialculling));
                $(".qmd-walk").css("display", fff(data.data.walk));
                $(".qmd-dingweiM").css("display", fff(data.data.mark));
                $(".qmd-dingwei").css("display", fff(data.data.mark2d));
                $(".qmd-3D").css("display", fff(data.data.mark3d));
                $(".qmd-properties").css("display", fff(data.data.propertytable));
                $(".qmd-plan").css("display", fff(data.data.plantable));
                $(".qmd-view").css("display", fff(data.data.viewtable));
                $(".qmd-extmodel").css("display", fff(data.data.extmodel));
                $(".qmd-information").css("display", fff(data.data.info));
                $(".qmd-set").css("display", fff(data.data.set));

                break;

            case 'add_edge':
                qmodel.add_edge(data.pcount, data.linecolor);
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'remove_edge':
                qmodel.remove_edge();
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'set_keeprender':
                qmodel.set_keeprender(data.keeprender);
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'set_bloom':
                qmodel.set_bloom(data.cmdIds, data.color);
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'set_rotate':
                //设置旋转构件。其中rotateList为旋转构件列表。
                //参数格式：qmodel.set_rotate( ['{"cmpid":"0^9b57b02a-b8ef-4124-83e3-d1e51cbfc8dd-000016dd","point":{"x":8.096107006072998,"y":10.0212819717895,"z":0.653113983504021},"normal":{"x":-1,"y":0,"z":0}}']);
                qmodel.set_rotate(data.rotateList);
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'set_animation':
                /* var start = { "x": 4710.955654156055, "y": 928.5123784159819, "z": 7.105427357601002e-15 };
        var end = { "x": 3661.6203165072643, "y": 929.0908802703642, "z": 0 }
        var speed = 5;
        var isCircle = true;
        var cmpId = "0^d196dc04-120b-40cc-9493-65e054d455a8-001cff29";
        */
                qmodel.set_animation(data.start, data.end, data.speed, data.isCircle, data.cmpId);
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'close_bloom':
                qmodel.close_bloom(data.cmdIds);
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'set_bloom_open':
                qmodel.set_bloom_open();
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'set_bloom_glimmer':
                qmodel.set_bloom_glimmer();
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'add_shadow':
                qmodel.add_shadow();
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'remove_shadow':
                qmodel.remove_shadow();
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
            case 'remove_mark_byid':
                qmodel.remove_mark_byid(data.markId);
                window.parent.postMessage({
                    cmd: data.cmd

                }, '*');
                break;
                //imgUrl=图片Url,type=MeshPhongMaterial or MeshLambertMaterial ,transparency=透明度，color为颜色。一般，颜色会被贴图覆盖
            case 'set_cmp_material':

                if (data.imgUrl) { //有贴图的
                    new THREE.TextureLoader().load(data.imgUrl, function(texture) {
                        var _mtrtmp = null;
                        if (data.type == 'MeshPhongMaterial') {
                            _mtrtmp = new THREE.MeshPhongMaterial({ //创建材料
                                map: texture,
                                color: 0xf0f0f0,
                                vertexColors: THREE.NoColors,
                                transparent: true,
                                side: THREE.DoubleSide,
                            });
                            _mtrtmp.shininess = 80;
                        } else {
                            _mtrtmp = new THREE.MeshLambertMaterial({ //创建材料
                                map: texture,
                                color: 0xf0f0f0, //eclor,                  
                                vertexColors: THREE.NoColors,
                                transparent: true,
                                side: THREE.DoubleSide,
                                //    wrapAround: true
                            });
                        }
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping; //这里设置x和y超过了图片的像素之后进行的是重复绘制图片操作
                        texture.repeat = new THREE.Vector2(5, 5);
                        qmodel.set_cmp_material(data.cmpIds, _mtrtmp);
                        window.parent.postMessage({
                            cmd: data.cmd

                        }, '*');
                    });
                } else {
                    var _mtrtmp = null;
                    if (data.type == 'MeshPhongMaterial') {
                        _mtrtmp = new THREE.MeshPhongMaterial({ //创建材料
                            color: data.color,
                            vertexColors: THREE.FaceColors,
                            transparent: true,
                            side: THREE.DoubleSide,
                            //    wrapAround: true
                        });
                        _mtrtmp.shininess = 80;
                    } else {
                        _mtrtmp = new THREE.MeshLambertMaterial({ //创建材料
                            color: data.color,
                            vertexColors: THREE.FaceColors,
                            transparent: true,
                            side: THREE.DoubleSide,
                        });
                    }
                    qmodel.set_cmp_material(data.cmpIds, _mtrtmp);
                    window.parent.postMessage({
                        cmd: data.cmd

                    }, '*');
                }


                break;

            case 'get_cmps_box3':
                //通过Cmpids获取包围盒。
                var rs = qmodel.get_cmps_box3(data.ids);
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;

            case 'lookat_box':
                //通过包围盒聚焦box=THREE.Box3,可以使用get_cmps_box3得到,showBox=是否显示盒子辅助
                qmodel.lookat_box(data.box, data.showBox);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;

            case 'get_models':
                var net = new NetHandle(new QmodelOption());
                net.clear_TOKEN();
                net.getToken().then(e => {
                    net.getModels().then(e => {
                        var models = [];
                        e.forEach(element => {
                            models.push(element);
                        });
                        console.log(models);
                        window.parent.postMessage({
                            cmd: data.cmd,
                            models: models,
                        }, '*');
                    });

                });
                break;
                //设置渐进式渲染的参数。v=null或0为自动调度渲染批次。1~50000为每批渲染的物体数量。假如设置为50000，市面上的大多数模型就是一次性渲染。分批渲染的目的是在批次处理间隔提高鼠标响应速度。
            case 'set_light':
                qmodel.set_light(data.color, data.intensity);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'set_render_count':
                qmodel.set_render_count(data.v);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'set_comps_selected':
                if (data.ids)
                    qmodel.set_comps_selected(data.ids);
                else
                    qmodel.set_comps_selected([]);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'set_select_material':
                qmodel.set_select_material(data.color, data.opacity);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'show_map':
                qmodel.show_map(data.v);
                window.parent.postMessage({
                    cmd: data.cmd
                }, '*');
                break;
            case 'append_models':
                var promise = qmodel.append_models(data.modelNames);
                if (promise) {
                    promise.then(e => {
                        window.parent.postMessage({
                            cmd: data.cmd
                        }, '*');
                    });
                } else {
                    window.parent.postMessage({
                        cmd: data.cmd
                    }, '*');
                }
                break;
            case 'get_ass_byid':
                var rs = qmodel.get_ass_byid(data.cmpid);
                window.parent.postMessage({
                    cmd: data.cmd,
                    assInfo: rs
                }, '*');
                break;
            case "get_cmp_property_then":
                var promise = qmodel.get_cmp_property_then(data.cmpid);
                if (promise) {
                    promise.then(e => {
                        window.parent.postMessage({
                            cmd: data.cmd,
                            property: e
                        }, '*');
                    });
                } else {
                    window.parent.postMessage({
                        cmd: data.cmd,
                        assInfo: null
                    }, '*');
                }
                break;
            case 'get_ass_byid_then':
                var promise = qmodel.get_ass_byid_then(data.cmpid, data.param);
                if (promise) {
                    promise.then(e => {
                        window.parent.postMessage({
                            cmd: data.cmd,
                            assInfo: e
                        }, '*');
                    });
                } else {
                    window.parent.postMessage({
                        cmd: data.cmd,
                        assInfo: null
                    }, '*');
                }

                break;

                //设置背景透明度和颜色 color=-1,为透明
            case 'set_background':
                var rs = qmodel.set_background(data.color);
                window.parent.postMessage({
                    cmd: data.cmd,
                    assInfo: rs
                }, '*');
                break;
                //获取模型的树结构
            case 'get_model_tree':
                var rs = qmodel.get_model_tree();
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;

                //获取模型的构件id列表
            case 'get_cmp_list':
                var rs = qmodel.get_cmp_list();
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
            case 'rebuild_normal':
                qmodel.rebuild_normal();
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'set_clip':
                qmodel.set_clip(data.code, data.open, data.value);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'get_clip':
                var rs = qmodel.get_clip();
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
            case 'set_comps_locked':
                var rs = qmodel.set_comps_locked(data.ids, data.lock);
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
            case 'get_inner_comps':
                var rs = qmodel.get_inner_comps(data.id, data.categoryIds, data.fullIn);
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
            case 'get_hide_comps':
                var rs = qmodel.get_hide_comps();
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
            case 'get_transprant_comps':
                var rs = qmodel.get_transprant_comps(data.isLock);
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
            case 'set_walking_option':
                qmodel.set_walking_option(data.speed, data.gravity, data.collide);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'set_ssao_param':
                qmodel.set_ssao_param(data.kernelRadius, data.minDistance, data.maxDistance);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'set_ssao_open':
                qmodel.set_ssao_open(data.value);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'remove_dom_mark':
                qmodel.remove_dom_mark(data.id);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'add_dom_mark':
                var rs = qmodel.add_dom_mark(data.id, data.position); //返回一个二维坐标。
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
                //设置构件到顶层渲染，ids为构件的id数组。opacity=透明度。v接收从0.0到1.0，其中1.0为不透明。0为完全透明。meshColor为构件的颜色，lineColor=框线的颜色。格式0xffffff
            case 'add_cmps_toprender':
                qmodel.add_cmps_toprender(data.ids, data.opacity, data.meshColor, data.linecolor);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'remove_cmps_toprender':
                qmodel.remove_cmps_toprender(data.ids);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'set_camera':
                qmodel.set_camera(data.position, data.target);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;

            case 'create_3d_page':
                qmodel.create_3d_page(data.w, data.h, data.position, data.rotation, data.url, data.type);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'set_tree_visiblity':
                qmodel.set_tree_visiblity(data.docId, data.levelId, data.categoryId, data.visiblity);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'open_other_model':
                qmodel.open_other_model(data.modelName);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'dispose':
                qmodel.destory_qmodel();
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'set_zoomLock':
                qmodel.set_zoomLock(data.value);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'load_skybox':
                qmodel.load_skybox(data.boxIndex);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'start_transform_model':
                qmodel.start_transform_model(data.rvtName);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;
            case 'get_model_transform':
                var rs = qmodel.get_model_transform(data.rvtName);
                window.parent.postMessage({
                    cmd: data.cmd,
                    data: rs
                }, '*');
                break;
            case 'set_model_transform':
                qmodel.set_model_transform(data.rvtName, data.transform);
                window.parent.postMessage({
                    cmd: data.cmd,
                }, '*');
                break;



                //获取模型的构件的完整id树，层次与get_model_tree目录树对应。此接口带Mesh，暂时不支持传递到iframe外面 
                // case 'get_cmp_tree_full':
                //     var rs = qmodel.get_cmp_tree_full();
                //     window.parent.postMessage({
                //         cmd: data.cmd,
                //         data: rs
                //     }, '*');
                //     break;
        };
    });
}
