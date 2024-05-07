var ContextMenuCreater = function(context) {
    this.context = context;
    if (context) {
        this.ul = context.children[0];
        this.ul.innerHTML = '';
    }
    this.enableMenu = true;
}
ContextMenuCreater.prototype.hide = function() {
    if (!this.ul) return;
    this.context.style.display = "none";
}
ContextMenuCreater.prototype.prepareMenu = function() {
    if (!this.ul) return;
    var selected = qmodel.get_selection_ids().length > 0;
    for (var i = 0; i < this.ul.children.length; i++) {
        var li = this.ul.children[i];
        if (li.getAttribute("needselected") == 'true') {
            li.style.display = selected ? "block" : "none";
        }
    }
}
ContextMenuCreater.prototype.createMenuItem = function(tagName, needselected, bindEvent) {
    if (!this.ul) return;
    var li = document.createElement('li');
    li.setAttribute("needselected", needselected);

    this.ul.append(li);
    var a = document.createElement('a');
    a.innerHTML = tagName;
    li.append(a);
    a.onclick = bindEvent;
};
ContextMenuCreater.prototype.bindIframeEvent = function(eventName) {
    window.parent.postMessage({
        cmd: eventName,
    }, '*');

};

ContextMenuCreater.prototype.createMenu = function() {
    let _this = this;
    if (!this.ul) return;
    this.createMenuItem('隐藏选中构件', true, function() {
        var ids = qmodel.get_selection_ids();
        console.log('当前选择的构件Id：' + ids);
        qmodel.set_comps_visiblity(ids, false);
        _this.hide();
    });

    this.createMenuItem('半透明选中构件', true, function() {
        var ids = qmodel.get_selection_ids();
        console.log('当前选择的构件Id：' + ids);
        qmodel.set_comps_transparency(ids, 0.5);
        _this.hide();
    });

    this.createMenuItem('冻结选中构件', true, function() {
        var ids = qmodel.get_selection_ids();
        console.log('当前选择的构件Id：' + ids);
        qmodel.set_comps_transparency(ids, 0.5, null, true);
        _this.hide();
    });

    this.createMenuItem('隔离选中构件(隐藏其他)', true, function() {
        var ids = qmodel.get_selection_ids();
        qmodel.set_all_comps_visiblity(false, false);
        qmodel.set_comps_visiblity(ids, true);
        qmodel.set_comps_selected(ids);
        _this.hide();
    });

    this.createMenuItem('隔离选中构件(冻结其他)', true, function() {
        var ids = qmodel.get_selection_ids();

        qmodel.set_all_comps_transparency(0.5, true, false);

        qmodel.set_comps_transparency(ids, 1);

        //      qmodel.set_comps_transparency(ids, 1);

        _this.hide();
    });

    this.createMenuItem('显示所有构件', false, function() {
        qmodel.set_all_comps_transparency(1, false, false);
        qmodel.set_all_comps_visiblity(true, false);
        _this.hide();

    });

    this.createMenuItem('聚焦选中构件', true, function() {
        var ids = qmodel.get_selection_ids();
        qmodel.lookat_comp(ids[0]);
        _this.hide();
    });

    this.createMenuItem('父级窗口事件', true, function() {
        _this.bindIframeEvent("showVueDiaglog");
        _this.hide();
    });

    this.createMenuItem('设备编辑', true, function() {
        var a = document.getElementById("property-extmodel-dialog");
        a.style.display = "block";
        qmodel.debugSetQmTransformOpen(true);
        var updateExtModelInfo = function() {
            var tf = qmodel.get_model_transform();
            if (tf) {
                document.getElementById("ext-v1").value = tf.x;
                document.getElementById("ext-v2").value = tf.y;
                document.getElementById("ext-v3").value = tf.z;
                document.getElementById("ext-v4").value = tf.anglez;
                document.getElementById("ext-v5").value = tf.angley;
                document.getElementById("ext-v6").value = tf.anglex;
            } else {
                console.log('未选择设备');
            }
        }
        qmodel.set_ext_model_update_callback(updateExtModelInfo);
        a.style.left = (document.body.clientWidth / 2 - 150).toString() + 'px';
        var tf = qmodel.get_model_transform();
        if (tf) {
            document.getElementById("ext-v1").value = tf.x;
            document.getElementById("ext-v2").value = tf.y;
            document.getElementById("ext-v3").value = tf.z;
            document.getElementById("ext-v4").value = tf.anglez;
            document.getElementById("ext-v5").value = tf.angley;
            document.getElementById("ext-v6").value = tf.anglex;
        } else {
            alert("请选择一个设备");
        }
        _this.hide();
    });

    return; //后面的 debug 用户自行选用

    this.createMenuItem('设置选中构件颜色', true, function() {
        var ids = qmodel.get_selection_ids();
        console.log('当前选择的构件Id：' + ids);
        qmodel.set_comps_color(ids, 0xff0000);
        _this.hide();
        //如果要还原颜色，颜色传入null,qmodel.setCompsColor(ids, null);
    });



    this.createMenuItem('获取相机', false, function() {
        _this.testJson = qmodel.get_camera_json();
        console.log(_this.testJson);
        alert(_this.testJson);
        _this.hide();
    });
    this.createMenuItem('恢复相机', false, function() {
        var json = _this.testJson;
        if (!json) {
            alert('您可以先点击获取相机，我会把相机序列化为JSON缓存下来用于测试。');
        }
        qmodel.set_camera_json(json);
        _this.hide();
    });
    this.createMenuItem('获取标记', false, function() {
        _this.testJson2 = qmodel.get_all_marks();
        console.log(_this.testJson2);
        alert(_this.testJson2);
        _this.hide();
    });
    this.createMenuItem('移除标记', false, function() {
        qmodel.remove_all_marks();
        _this.hide();
    });
    this.createMenuItem('恢复标记', false, function() {
        var json = _this.testJson2;
        if (!json) {
            alert('您可以先点击得到标记，我会把标记序列化为JSON缓存下来用于测试。');
        }
        qmodel.reset_marks(json);
        _this.hide();
    });

    this.createMenuItem('设备删除', true, function() {
        qmodel.delete_ext_model(null).then(e => {
            console.log("删除完成,id:", e);
        }).catch(e => {
            alert(e);
        });
        _this.hide();
    });
    this.createMenuItem('打开材质库', false, function() {
        document.getElementById("property-material").style.display = "block";
        qmodel.show_materials();
        _this.hide();
    });

};
