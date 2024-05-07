const ID_TOKEN = 'id_token';
const USER_ID = 'user_id';
const TOKEN_TIME = 'TOKEN_TIME';
const IS_DEBUG = 0;


var ontToken = null;
var NetHandle = function(netOption) {
    this.option = netOption;
    this.CURRENT_PROJECT_ID = null;
    this.CURRENT_MODEL_NAME = null;
    this.SCENE_PARAM = null;
    this.CURRENT_PROJECT_IDs = new Map();
    this.CURRENT_MODEL_ID = null;
    this.CURRENT_MODEL_IDs = new Map();
    this.CURRENT_MODEL_PATH = null;
    this.CURRENT_MODEL_PATHs = new Map();
    this.CURRENT_FILE_CODES = new Map();
    this.queryModels = null;
    this.MDV = false;
    if (this.option.DefaultToken) {
        this.clear_TOKEN();
        this.WEB_TOKEN = this.option.DefaultToken;
        this.initByToken();
    } else if (localStorage.getItem(ID_TOKEN) != 'null') {
        var date1 = localStorage.getItem(TOKEN_TIME);

        if (date1) {
            var currentDate = new Date();
            var date = (currentDate.getTime() - new Date(date1).getTime());
            var hour = date / 1000 / 60 / 60;
            if (hour > 4)
                this.clear_TOKEN();
        } else {
            this.clear_TOKEN();
        }
        this.WEB_TOKEN = localStorage.getItem(ID_TOKEN);
        this.WEB_USER_ID = localStorage.getItem(USER_ID);
    }
}
var _ajax = (options) => {
    var opt = {
        url: '',
        type: 'get',
        data: {},
        success: function() {},
        error: function() {},
        token: null,
        contentType: 'application/json;charset=UTF-8',
        headers: null,
        progressevn: null
    };
    opt = Object.assign({}, opt, options);

    let xml = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    let arr = [];
    let data = opt.data;
    let jsonParam = opt.contentType.indexOf('application/json') > -1;
    if (!jsonParam)
        for (let i in data) {
            arr.push(i + '=' + data[i]);
        }
    if (opt.progressevn)
        xhr.upload.addEventListener('progress', opt.progressevn);

    if (opt.url) {
        let url = opt.url;

        if (opt.type == 'get' || opt.type == 'GET') {
            if (arr.length > 0)
                url = url + '?' + arr.join('&');
            xml.open('GET', url, true);
            if (opt.headers) {
                for (let i in opt.headers) {
                    xml.setRequestHeader(i, opt.headers[i]);
                }
            }
            if (opt.token)
                xml.setRequestHeader('Authorization', opt.token);
            xml.send();
        } else {
            xml.open(opt.type.toUpperCase(), url, true); //默认true异步
            xml.setRequestHeader('Content-Type', opt.contentType);
            if (opt.headers) {
                for (let i in opt.headers) {
                    xml.setRequestHeader(i, opt.headers[i]);
                }
            }
            if (opt.token)
                xml.setRequestHeader('Authorization', opt.token);
            if (jsonParam)
                xml.send(data);
            else
                xml.send(arr.join('&'));
        }

        let qcall = 0;
        xml.onreadystatechange = function() {
            let res;
            if (xml.status === 200 || xml.status === 201 || xml.status === 304) {
                qcall++;
                if (xml.readyState >= 4 && opt.success && opt.success instanceof Function) {
                    if (xml.response) {
                        res = JSON.parse(xml.response);
                        opt.success.call(xml, res);
                    } else {
                        res = '';
                        if (qcall == 2)
                            opt.success.call(xml, res);
                    }
                }

            } else {
                if (opt.error && opt.error instanceof Function) {
                    const errMessage = { //错误的处理
                        errStatus: xml.status,
                        errMsg: xml.statusText
                    }
                    opt.error.call(xml, errMessage)
                }

            }

        }
    }

}
var _ajaxfile = (options) => {
    var opt = {
        url: '',
        type: 'post',
        data: {},
        success: function () { },
        error: function () { },
        token: null,
        contentType: 'multipart/form-data',
        headers: null,
        progressevn: null
    };
    opt = Object.assign({}, opt, options);

    let xml = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    let data = opt.data;

    if (opt.progressevn)
        xhr.upload.addEventListener('progress', opt.progressevn);

    if (opt.url) {
        let url = opt.url;


        xml.open(opt.type.toUpperCase(), url, true); //默认true异步
        // xml.setRequestHeader('Content-Type', opt.contentType);
        if (opt.headers) {
            for (let i in opt.headers) {
                xml.setRequestHeader(i, opt.headers[i]);
            }
        }
        xml.send(data);

        //xml.send(data);



        let qcall = 0;
        xml.onreadystatechange = function () {
            let res;
            if (xml.status === 200 || xml.status === 201 || xml.status === 304) {
                qcall++;
                if (xml.readyState >= 4 && opt.success && opt.success instanceof Function) {
                    if (xml.response) {
                        res = JSON.parse(xml.response);
                        opt.success.call(xml, res);
                    } else {
                        res = '';
                        if (qcall == 2)
                            opt.success.call(xml, res);
                    }
                }

            } else {
                if (opt.error && opt.error instanceof Function) {
                    const errMessage = { //错误的处理
                        errStatus: xml.status,
                        errMsg: xml.statusText
                    }
                    opt.error.call(xml, errMessage)
                }

            }

        }
    }

}

NetHandle.prototype = {

    get_TOKEN_HEAD: function() {
        // return { headers: { Authorization: 'Bearer ' + this.WEB_TOKEN, Accept: 'application/json' } };
        return 'Bearer ' + this.WEB_TOKEN;
    },
    get_VUE_TOKEN_HEAD: function() {
        return { headers: { Authorization: 'Bearer ' + this.WEB_TOKEN, Accept: 'application/json' } };
    },
    get_TOKEN: function() {
        // return { headers: { Authorization: 'Bearer ' + this.WEB_TOKEN, Accept: 'application/json' } };
        return this.WEB_TOKEN;
    },
    clear_TOKEN: function() {
        localStorage.removeItem(ID_TOKEN);
        localStorage.removeItem(USER_ID);

        this.WEB_TOKEN = null;
        this.WEB_USER_ID = null;
    },
    getFileId: function() {
        return this.CURRENT_PROJECT_ID;
    },
    getFileIds: function(modelName) {
        return this.CURRENT_PROJECT_IDs.get(modelName);
    },
    getFilePaths: function(modelName) {
        return this.option.FILE_SERVE_URL + this.CURRENT_MODEL_PATHs.get(modelName);
    },
    getFileCode: function(modelName) {
        var key = this.CURRENT_FILE_CODES.get(modelName);
        if (key)
            return key;
        else
            return shortmd5(modelName);
    },

    getPdfPath: function(model, files) {
        var fa = files.split(',');
        var rs = [];
        var path = this.option.FILE_SERVE_URL2 + model;
        for (var i = 0; i < fa.length; i++) {
            rs.push(path + '@' + fa[i]);
        }
        return rs;
    },
    getGltfPath2: function(model) {
        return this.option.FILE_SERVE_URL2 + model;
    },
    getGltfPath: function(model) {
        return this.option.FILE_SERVE_URL2 + model.substring(0, model.length - 4);
    },
    getModels: function(count) {
        //this.option.API_URL+'/rvt-files?page=0&size=10000'
        let _this = this;
        count = count ? count : 100;
        var urls = _this.option.API_URL + '/rvt-files-v2?page=0&size=' + count;
        return new Promise(function(resolve, reject) {
            _ajax({
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //    console.log(result);
                    var list = result;
                    _this.queryModels = new Map();
                    var showList = [];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].isDelete === 0) {
                            showList.push(list[i]);
                            _this.queryModels.set(list[i].id, list[i]);
                        }
                    };
                    resolve(showList);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    translateModel: function(id) {
        let _this = this;

        var obj = _this.queryModels.get(parseInt(id));
        if (!obj) return;
        if (!obj.ex1 || obj.ex1 == '1') return;
        obj.ex1 = null;
        obj.rvtDocDTOList = [];

        var urls = this.option.API_URL + '/rvt-files';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(obj),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    getDwgs: function(count) {
        //this.option.API_URL+'/rvt-files?page=0&size=10000'
        let _this = this;
        count = count ? count : 100;
        var urls = _this.option.API_URL + '/dwgfiles?page=0&size=' + count;
        return new Promise(function(resolve, reject) {
            _ajax({
                // //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //    console.log(result);
                    var list = result;
                    var showList = [];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].mark == 1)
                            showList.push(list[i]);
                    };
                    resolve(showList);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    getGltfs: function(count) {
        //this.option.API_URL+'/rvt-files?page=0&size=10000'
        let _this = this;
        count = count ? count : 100;
        var urls = this.option.API_URL + '/gltffiles?page=0&size=' + count;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //     console.log(result);
                    var list = result;
                    var showList = [];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].mark == 1)
                            showList.push(list[i]);
                    };
                    resolve(showList);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    initByToken: function() {

        let _this = this;
        localStorage.setItem(ID_TOKEN, _this.WEB_TOKEN);
        return new Promise(function(resolve, reject) {
            _ajax({
                // //cache: false,
                url: _this.option.API_URL + '/account',
                type: "GET",
                contentType: "application/json;charset=UTF-8",
                token: _this.get_TOKEN_HEAD(),
                success: function(result) {
                    localStorage.setItem(USER_ID, result.login);
                    _this.WEB_USER_ID = result.login;
                    localStorage.setItem(TOKEN_TIME, new Date());
                    resolve(_this);
                },
                error: function(xhr, textStatus, errorThrown) {
                    if (textStatus == 401)
                        alert('token无效');
                    reject(0);
                }
            });
        });
    },
    getToken: function(userName, password) {
        let _this = this;
        var _userName = localStorage.getItem(USER_ID);
        if (_userName && userName && (_userName != userName))
            this.clear_TOKEN();
        return new Promise(function(resolve, reject) {
            if (_this.WEB_TOKEN != null) {
                if (localStorage.getItem(USER_ID) == null)
                    localStorage.setItem(USER_ID, userName);
                resolve(1);
                return;
            }

            var users = {
                username: userName ? userName : _this.option.DemoUser,
                password: userName ? password : _this.option.DemoPwd,
                rememberMe: null
            };
            _ajax({
                // //cache: false,
                url: _this.option.API_URL + '/authenticate',
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(users),
                success: function(result) {
                    // console.log(result);
                    localStorage.setItem(ID_TOKEN, result.id_token);
                    _this.WEB_TOKEN = result.id_token;
                    localStorage.setItem(USER_ID, users.username);
                    _this.WEB_USER_ID = users.username;
                    localStorage.setItem(TOKEN_TIME, new Date());
                    resolve(_this);
                },
                error: function(xhr, textStatus, errorThrown) {
                    if (textStatus == 401)
                        alert('密码错误。');
                    reject(0);
                }
            });
        });
    },
    postFileInfo: function(fileName, filePath, fileSize, user_id, fileid) {

        var data = {
            expType: 1,
            fileName: fileName,
            filePath: filePath,
            fileSize: fileSize,
            fileId: fileid,
            id: 0,
            isDelete: 0,
            userId: 0,
        }
        let _this = this;

        var urls = this.option.API_URL + '/rvt-src-files';
        return new Promise(function(resolve, reject) {
            _ajax({
                // //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    uploadFileZip: function(file, event) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("service", 'App.Passion.UploadFile');
            var fileName = '/' + localStorage.getItem(USER_ID) + '/'
            var headers = {};
            headers["name"] = 'file';
            headers["filename"] = file.filename;
            var user = localStorage.getItem(USER_ID);
            user = user ? user : _this.option.DemoUser;
            _ajax({
                url: _this.option.FILE_SERVE_URL_UP + fileName + "&type=qmodel_zip&user=" + user,
                /*接口域名地址*/
                type: 'post',
                data: formData,
                contentType: false,
                processData: false,
                headers: headers,
                progressevn: event,
                // xhr: function() {
                //     var xhr = new XMLHttpRequest();
                //     //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                //     xhr.upload.addEventListener('progress', event)
                //     return xhr;
                // },
                success: function(res) {
                    console.log(res);
                    if (res.status == "success") {
                        resolve(res.result[0]);

                    } else {
                        resolve(0);
                    }


                }
            })
        });
    },
    uploadFile: function(file, event) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("service", 'App.Passion.UploadFile');
            var fileName = '/' + localStorage.getItem(USER_ID) + '/rvt/'
            var headers = {};
            // headers["Content-Type"] = 'application/octet-stream';
            // headers["Content-Disposition"] = 'form-data';
            headers["name"] = 'file';
            headers["filename"] = file.filename;
            //  formData.append("token", token);
            _ajax({
                url: _this.option.FILE_SERVE_URL_UP + fileName + '&needTimeStamp=1',
                /*接口域名地址*/
                type: 'post',
                data: formData,
                // contentType: false,
                // processData: false,
                headers: headers,
                progressevn: event,
                // xhr: function() {
                //     var xhr = new XMLHttpRequest();
                //     //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                //     xhr.upload.addEventListener('progress', event)
                //     return xhr;
                // },
                success: function(res) {
                    console.log(res);
                    if (res.status == "success") {
                        _this.postFileInfo(res.result[0].fileName, res.result[0].filePath, res.result[0].fileSize,
                            0, res.result[0].id).then(e => {
                            resolve(1);
                        })
                    } else {
                        resolve(0);
                    }


                }
            })
        });
    },
    postDwgFileInfo: function(fileName, filePath, fileSize, user_id, fileid) {

        var data = {

            dwgName: fileName,
            filePath: filePath,
            fileSize: fileSize,
            fileId: fileid,
            id: 0,


        }

        let _this = this;

        var urls = this.option.API_URL + '/dwgfiles';
        return new Promise(function(resolve, reject) {
            _ajax({
                // //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    postGltfFileInfo: function(fileName, filePath, fileSize, user_id, fileid) {

        var data = {

            gltfName: fileName,
            filePath: filePath,
            fileSize: fileSize,
            fileId: fileid,
            mark: 1,
            id: 0,


        }

        let _this = this;

        var urls = this.option.API_URL + '/gltffiles';
        return new Promise(function(resolve, reject) {
            _ajax({
                // //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    uploadGltfFile: function(file1, event) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("file1", file1);
            //   formData.append("file2", file2);
            formData.append("service", 'App.Passion.UploadFile');
            var strname = file1.name.substring(0, file1.name - 4);
            var fileName = '/' + localStorage.getItem(USER_ID) + '/gltf' + (new Date()).getTime().toString() + '/' + strname;
            var headers = {};
            // headers["Content-Type"] = 'application/octet-stream';
            // headers["Content-Disposition"] = 'form-data';
            headers["name"] = 'file';
            headers["filename"] = file1.filename;
            //  formData.append("token", token);
            _ajax({
                url: _this.option.FILE_SERVE_URL_UP + fileName + '&needTimeStamp=2',
                /*接口域名地址*/
                type: 'post',
                data: formData,
                // contentType: false,
                // processData: false,
                headers: headers,
                progressevn: event,
                // xhr: function() {
                //     var xhr = new XMLHttpRequest();
                //     //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                //     xhr.upload.addEventListener('progress', event)
                //     return xhr;
                // },
                success: function(res) {
                    console.log(res);
                    if (res.status == "success") {
                        _this.postGltfFileInfo(res.result[0].fileName, res.result[0].filePath, res.result[0].fileSize, localStorage.getItem(USER_ID),
                            res.result[0].id).then(e => {
                            resolve(1);
                        })
                    } else {
                        resolve(0);
                    }


                }
            })
        });
    },
    postIfcFileInfo: function(fileName, filePath, fileSize, user_id, fileid) {

        var data = {
            fileName: fileName,
            filePath: filePath,
            fileSize: fileSize,
            fileId: fileid,
            ex1: "1",
            id: 0,
            userId: user_id,
            rvtDocDTOList: [],
        }

        let _this = this;

        var urls = this.option.API_URL + '/rvt-files';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    uploadIfcFile: function(file1, event) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("file1", file1);
            //   formData.append("file2", file2);
            formData.append("service", 'App.Passion.UploadFile');
            var strname = file1.name.substring(0, file1.name - 4);
            var fileName = '/' + localStorage.getItem(USER_ID) + '/ifc' + (new Date()).getTime().toString() + '/' + strname;
            var headers = {};
            // headers["Content-Type"] = 'application/octet-stream';
            // headers["Content-Disposition"] = 'form-data';
            headers["name"] = 'file';
            headers["filename"] = file1.filename;
            //  formData.append("token", token);
            _ajax({
                url: _this.option.FILE_SERVE_URL_UP + fileName + '&needTimeStamp=2',
                /*接口域名地址*/
                type: 'post',
                data: formData,
                // contentType: false,
                // processData: false,
                headers: headers,
                progressevn: event,
                // xhr: function() {
                //     var xhr = new XMLHttpRequest();
                //     //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                //     xhr.upload.addEventListener('progress', event)
                //     return xhr;
                // },
                success: function(res) {
                    console.log(res);
                    if (res.status == "success") {
                        _this.postIfcFileInfo(res.result[0].fileName, res.result[0].filePath, res.result[0].fileSize, localStorage.getItem(USER_ID),
                            res.result[0].id).then(e => {
                            resolve(1);
                        })
                    } else {
                        resolve(0);
                    }


                }
            })
        });
    },
    uploadDwgFile: function(file, event) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("service", 'App.Passion.UploadFile');
            var fileName = '/' + localStorage.getItem(USER_ID) + '/dwg/'
            var headers = {};
            // headers["Content-Type"] = 'application/octet-stream';
            // headers["Content-Disposition"] = 'form-data';
            headers["name"] = 'file';
            headers["filename"] = file.filename;
            //  formData.append("token", token);
            _ajax({
                url: _this.option.FILE_SERVE_URL_UP + fileName + '&needTimeStamp=2',
                /*接口域名地址*/
                type: 'post',
                data: formData,
                // contentType: false,
                // processData: false,
                headers: headers,
                progressevn: event,
                // xhr: function() {
                //     var xhr = new XMLHttpRequest();
                //     //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                //     xhr.upload.addEventListener('progress', event)
                //     return xhr;
                // },
                success: function(res) {
                    console.log(res);
                    if (res.status == "success") {
                        _this.postDwgFileInfo(res.result[0].fileName, res.result[0].filePath, res.result[0].fileSize,
                            res.result[0].id).then(e => {
                            resolve(1);
                        })
                    } else {
                        resolve(0);
                    }


                }
            })
        });
    },
    getMaterial_new: function(pngName) {
        if (IS_DEBUG == 1)
            return this.option.FILE_SERVE_URL2 + '/' + this.WEB_USER_ID + '/' + this.CURRENT_PROJECT_ID + '/' + pngName;
        else
            return this.option.FILE_SERVE_URL + this.CURRENT_MODEL_PATH + '/' + pngName;
    },
    getMaterials: function(modelName, pngName) {
        return this.option.FILE_SERVE_URL + this.CURRENT_MODEL_PATHs.get(modelName) + '/' + pngName;
    },
    getPty: function(docId, uniqueId) {
        var data = {
            docId: docId,
            fileId: this.CURRENT_PROJECT_ID,
            uniqueId: uniqueId
        };
        let _this = this;
        var urls = this.option.API_URL + '/pty-saves-getone';
        return new Promise(function(resolve, reject) {
            _ajax({
                // //cache: false,
                url: urls,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(result.prmgs);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    getPtys: function(modelId, docId, uniqueId) {
        var data = {
            docId: docId,
            fileId: modelId ? modelId : this.CURRENT_MODEL_ID,
            uniqueId: uniqueId
        };
        let _this = this;
        var urls = this.option.API_URL + '/pty-saves-getone';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(result.prmgs);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    getFamilyType: function() {
        var data = {
            docId: 0,
            fileId: this.CURRENT_PROJECT_ID,
            uniqueId: "family_type"
        };
        let _this = this;
        var urls = this.option.API_URL + '/pty-saves-getone';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    var familyTypes = [];
                    var curType = null;
                    var prmgs = JSON.parse(result.prmgs);
                    if (prmgs.length > 2) {
                        for (var i = 1; i < prmgs.length; i++) {
                            var prmg = prmgs[i];
                            var spr = prmg.text.split('@');
                            if (spr.length < 2) continue;
                            prmg.text = spr[0];
                            if (curType == null) {
                                curType = { typeName: spr[spr.length - 1], prmgs: [prmg] };
                                familyTypes.push(curType);
                            } else {
                                if (spr[spr.length - 1] == curType.typeName)
                                    curType.prmgs.push(prmg);
                                else {
                                    curType = { typeName: spr[spr.length - 1], prmgs: [prmg] };
                                    familyTypes.push(curType);
                                }
                            }

                        }
                    }
                    resolve(familyTypes);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    getModel: function(modelName) {
        let _this = this;
        this.CURRENT_PROJECT_IDs = new Map();
        this.CURRENT_MODEL_IDs = new Map();
        this.CURRENT_MODEL_PATHs = new Map();
        this.CURRENT_FILE_CODES = new Map();
        var reg = new RegExp('#', "g")
        var newstr = modelName.replace(reg, '>_<');


        var urls = this.option.API_URL + '/rvt-files-byname/' + newstr;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //    console.log(result);
                    _this.CURRENT_PROJECT_ID = result.fileId;
                    _this.CURRENT_MODEL_NAME = modelName;
                    _this.CURRENT_PROJECT_IDs.set(modelName, _this.CURRENT_PROJECT_ID);
                    _this.CURRENT_MODEL_ID = _this.WEB_USER_ID + '->' + modelName;
                    _this.CURRENT_MODEL_IDs.set(modelName, _this.CURRENT_MODEL_ID);
                    _this.MDV = result.ex1 == "1";

                    _this.SCENE_PARAM = result.ex2;
                    _this.CURRENT_MODEL_PATH = result.filePath;
                    _this.CURRENT_MODEL_PATHs.set(modelName, result.filePath);
                    _this.CURRENT_FILE_CODES.set(modelName, result.fileCode);
                    resolve(_this.option.FILE_SERVE_URL + result.filePath);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getScene: function() {
        if (this.SCENE_PARAM) {
            var tf = JSON.parse(this.SCENE_PARAM);
            return tf;
        } else
            return null;
    },
    saveScene: function(scenejson) {
        if (!this.CURRENT_MODEL_NAME) return null;
        var data = {
            fileName: this.CURRENT_MODEL_NAME,
            ex2: scenejson,
            userId: 0,
        }
        let _this = this;

        var urls = this.option.API_URL + '/rvt-files-scene';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    deleteModel: function(modelName) {
        let _this = this;
        if (modelName == _this.CURRENT_MODEL_NAME) return false;
        if (!_this.CURRENT_PROJECT_IDs.has(modelName)) return false;
        _this.CURRENT_PROJECT_IDs.delete(modelName);
        _this.CURRENT_MODEL_IDs.delete(modelName);
        _this.CURRENT_MODEL_PATHs.delete(modelName);
        _this.CURRENT_FILE_CODES.delete(modelName);
        return true;
    },
    checkModelReAppend: function (modelName) {
        return this.CURRENT_PROJECT_IDs.has(modelName);
    },
    getModelAppend: function(modelName) {
        let _this = this;

        var reg = new RegExp('#', "g")
        var newstr = modelName.replace(reg, '>_<');


        var urls = this.option.API_URL + '/rvt-files-byname/' + newstr;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    if (result.ex1 == "1") {
                        _this.CURRENT_PROJECT_IDs.set(modelName, result.fileId);
                        _this.CURRENT_MODEL_IDs.set(modelName, _this.WEB_USER_ID + '->' + modelName);
                        _this.CURRENT_MODEL_PATHs.set(modelName, result.filePath);
                        _this.CURRENT_FILE_CODES.set(modelName, result.fileCode);
                        _this.MDV = result.ex1 == "1";
                    }
                    resolve(_this.option.FILE_SERVE_URL + result.filePath);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    saveSche: function(aName, aDate) {
        var data = {
            actPlanDate: aDate,
            actfinishDate: aDate,
            finishDate: aDate,
            planDate: aDate,
            rvtId: this.CURRENT_MODEL_ID,
            taskName: aName,
            id: 0
        };
        let _this = this;
        var urls = this.option.API_URL + '/task-mgrs';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    getSche: function() {
        let _this = this;
        var urls = this.option.API_URL + '/task-mgrs-by-fileid?fileid=' + this.CURRENT_MODEL_ID;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //  console.log(result);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    DelSche: function(id) {
        let _this = this;
        var urls = this.option.API_URL + '/task-mgrs/' + id;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "DELETE",
                contentType: "application/json;charset=UTF-8",
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    BangdingSche: function(aid, arr) {
        var data = [];
        arr.forEach(element => {
            data.push({
                id: 0,
                compId: element,
                taskId: aid,
                vtype: 0
            });
        });
        let _this = this;
        var urls = this.option.API_URL + '/task-and-comps-group';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    getBangdingSche: function(id) {
        let _this = this;
        var urls = this.option.API_URL + '/task-and-comps-group?taskId=' + id;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    saveViewAndImg: function(aName, vinfo, markinfo, blob) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            let jpg1 = `${new Date().getTime()}.jpg`;
            let file2 = new File([blob], jpg1, { type: 'image/jpg' });

            formData.append('file', file2);


            formData.append("service", 'App.Passion.UploadFile2');
            var fileName = '/' + _this.WEB_USER_ID + '/' + _this.CURRENT_PROJECT_ID + '/img/';
            var headers = {};
            // headers["Content-Type"] = 'application/octet-stream';
            // headers["Content-Disposition"] = 'form-data';
            headers["name"] = 'file';
            headers["filename"] = file2.filename;
            //  formData.append("token", token);
            _ajaxfile({
                url: _this.option.FILE_SERVE_URL_UP + fileName + '&needTimeStamp=1',
                /*接口域名地址*/
                type: 'post',
                data: formData,
                // contentType: false,
                // processData: false,
                headers: headers,
                success: function(res) {
                    console.log(res);
                    if (res.status == "success") {
                        _this.saveView(aName, vinfo, markinfo, res.result[0].filePath).then(e => {
                            resolve(e);
                        })
                    } else {
                        resolve(0);
                    }


                }
            })
        });
    },
    saveView: function(aName, vinfo, markinfo, _imageFilePath) {
        var data = {
            fileId: this.CURRENT_MODEL_ID,
            viewName: aName,
            viewInfo2: vinfo,
            markInfo: markinfo,
            imageFilePath: _imageFilePath,
            updateDate: new Date(),
            id: 0
        };
        let _this = this;
        var urls = this.option.API_URL + '/rvt-views';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    console.log(result.id);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    getView: function(modelId) {
        let _this = this;
        if (modelId)
            modelId = _this.WEB_USER_ID + '->' + modelId;
        else
            modelId = this.CURRENT_MODEL_ID;
        var urls = this.option.API_URL + '/rvt-views-byfileid?fileid=' + modelId;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    result = result.reverse().slice(0, 10);
                    // console.log(result);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getImg_v2: function(path) {
        return this.option.FILE_SERVE_URL + path;
    },
    getImg: function(modelId) {
        let _this = this;
        if (modelId)
            modelId = _this.WEB_USER_ID + '->' + modelId;
        else
            modelId = this.CURRENT_MODEL_ID;
        var urls = this.option.API_URL + '/rvt-firstviews-byfileid?fileid=' + modelId;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //    console.log(result);
                    if (result !== '0')
                        result = _this.option.FILE_SERVE_URL + result;
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getQmodelMaterials: function() {
        let _this = this;

        var urls = this.option.API_URL + '/materials';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {

                    for (var i = 0; i < result.length; i++)
                        result[i].filePath = _this.option.FILE_SERVE_URL + result[i].filePath;
                    //   console.log(result);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getDefaultView: function(modelId) {
        let _this = this;
        if (modelId)
            modelId = _this.WEB_USER_ID + '->' + modelId;
        else
            modelId = this.CURRENT_MODEL_ID;
        modelId = encodeURI(modelId);
        var urls = this.option.API_URL + '/rvt-defaultviews-byfileid?fileid=' + modelId;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    if (result) {
                        //     console.log(result);
                        resolve(result);
                    } else
                        reject(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getViewById: function(mid) {
        let _this = this;
        var urls = this.option.API_URL + '/rvt-views/' + mid;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    DelView: function(id) {
        let _this = this;
        var urls = this.option.API_URL + '/rvt-views/' + id;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "DELETE",
                contentType: "application/json;charset=UTF-8",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    saveExtModel: function(id, eid, name, transform, vinfo, markinfo) {
        var data = {
            equipmentId: eid,
            equipmentName: name,
            fileId: this.CURRENT_MODEL_ID,
            equipmentTransform: transform,
            viewInfo: vinfo,
            markInfo: markinfo,
            updateDate: new Date(),
            visibled: 1,
            id: id
        };
        let _this = this;
        var urls = this.option.API_URL + '/equipment-comps';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    console.log(result.id);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    getExtModel: function() {
        let _this = this;
        var modelId = this.CURRENT_MODEL_ID;
        var urls = this.option.API_URL + '/equipment-comps-byfileid?fileId=' + modelId;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    setExtModelColor: function(id, color) {
        var data = {
            equipmentId: 0,
            equipmentName: "",
            fileId: "",
            equipmentTransform: "",
            viewInfo: "",
            markInfo: color,
            updateDate: new Date(),
            visibled: 1,
            id: id
        };
        let _this = this;
        var urls = this.option.API_URL + '/equipment-comps-color';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    console.log(result.id);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });
    },
    delExtModel: function(id) {
        let _this = this;
        var urls = this.option.API_URL + '/equipment-comps/' + id;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "DELETE",
                contentType: "application/json;charset=UTF-8",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    //   console.log(result);
                    resolve(1);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    saveEquipmentFile(name, geometry) {

        var _this = this;
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            let jpg1 = `${new Date().getTime()}.json`;
            var blob = new Blob([geometry], { type: "text/plain;charset=utf-8" });
            let file2 = new File([blob], jpg1);

            formData.append('file', file2);


            formData.append("service", 'App.Passion.UploadFile2');
            var fileName = '/' + _this.WEB_USER_ID + '/' + _this.CURRENT_PROJECT_ID + '/equipment/';
            var headers = {};
            // headers["Content-Type"] = 'application/octet-stream';
            // headers["Content-Disposition"] = 'form-data';
            headers["name"] = 'file';
            headers["filename"] = file2.filename;
            //  formData.append("token", token);
            _ajax({
                url: _this.option.FILE_SERVE_URL_UP + fileName + '&needTimeStamp=1',
                /*接口域名地址*/
                type: 'post',
                data: formData,
                // contentType: false,
                // processData: false,
                token: _this.get_TOKEN_HEAD(),
                headers: headers,
                success: function(res) {
                    console.log(res);
                    if (res.status == "success") {
                        _this.saveEquipment(name, res.result[0].filePath).then(e => {
                            resolve(e);
                        })
                    } else {
                        resolve(0);
                    }


                }
            })
        });
    },
    saveEquipment: function(aName, _imageFilePath) {
        var data = {
            fileId: this.CURRENT_MODEL_ID,
            userId: this.WEB_USER_ID,
            equipmentName: aName,
            modelName: aName,
            equipmentImage: '',
            equipmentFile: _imageFilePath,
            updateDate: new Date(),
            id: 0
        };
        let _this = this;

        var urls = this.option.API_URL + '/equipments';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                //   dataType: "json",
                data: JSON.stringify(data),
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    console.log(result.id);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },
    getCmpPtyByElement: function(elementId, modelName) {
        let _this = this;

        var modelId = this.CURRENT_PROJECT_ID;
        if (modelName)
            modelId = this.CURRENT_MODEL_IDs.get(modelName);

        var urls = this.option.API_URL + '/pty-saves-fileid-and-elementId?fileid=' + modelId + '&elementId=' + elementId;
        return new Promise(function(resolve, reject) {
            _ajax({
                cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                success: function(result) {
                    if (result) {
                        //      console.log(result);
                        resolve(result);
                    } else
                        reject(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getCmpPtyPrm: function(param, value, modelName) {
        let _this = this;

        var modelId = this.CURRENT_PROJECT_ID;
        if (modelName)
            modelId = this.CURRENT_MODEL_IDs.get(modelName);

        var urls = this.option.API_URL + '/pty-saves-query-param?fileId=' + modelId + '&param=' + param + '&value=' + value;
        return new Promise(function(resolve, reject) {
            _ajax({
                cache: false,
                url: urls,
                type: "GET",
                //  headers: _this.get_TOKEN_HEAD(),
                token: _this.get_TOKEN_HEAD(),
                success: function(result) {
                    if (result) {
                        //      console.log(result);
                        resolve(result);
                    } else
                        reject(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getCmpPty: function(uniqueIds, param, modelName) {
        let _this = this;

        var modelId = this.CURRENT_PROJECT_ID;
        if (modelName)
            modelId = this.CURRENT_MODEL_IDs.get(modelName);

        var urls = this.option.API_URL + '/pty-saves-query?fileId=' + modelId + '&param=' + param + '&uniqueIds=' + encodeURI(uniqueIds) + '&value=0';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    if (result) {
                        //      console.log(result);
                        resolve(result);
                    } else
                        reject(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getAllPty: function(querysize, querypage, modelName) {
        let _this = this;
        var modelName1 = modelName ? modelName : this.CURRENT_MODEL_NAME;
        if (!querysize)
            querysize = 500;
        if (!querypage) querypage = 0;

        var urls = this.option.API_URL + '/pty-saves-byfilename?filename=' + modelName1 + '&size=' + querysize + '&page=' + querypage;
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                token: _this.get_TOKEN_HEAD(),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    if (result) {
                        //      console.log(result);
                        resolve(result);
                    } else
                        reject(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getServerKey: function() {
        let _this = this;
        var urls = this.option.API_URL + '/um';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                success: function(result) {
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    chkLicense: function() {
        let _this = this;
        var urls = this.option.API_URL + '/authorize_chk';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "GET",
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });

    },
    updateLicense: function(userName, key) {
        let _this = this;
        var data = {
            id: 0,
            logInfo: key,
            logType: 4,
            userName: userName
        };

        var urls = this.option.API_URL + '/authorize-logs';
        return new Promise(function(resolve, reject) {
            _ajax({
                //cache: false,
                url: urls,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('Authorization', _this.get_TOKEN_HEAD());
                // },
                success: function(result) {
                    console.log(result);
                    resolve(result);
                },
                error: function(xhr, textStatus, errorThrown) {
                    reject(0);
                }
            });
        });

    },

}

function shortmd5(a) {
    function b(a, b) {
        return a << b | a >>> 32 - b
    }

    function c(a, b) {
        var c, d, e, f, g;
        return e = 2147483648 & a,
            f = 2147483648 & b,
            c = 1073741824 & a,
            d = 1073741824 & b,
            g = (1073741823 & a) + (1073741823 & b),
            c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
    }

    function d(a, b, c) {
        return a & b | ~a & c
    }

    function e(a, b, c) {
        return a & c | b & ~c
    }

    function f(a, b, c) {
        return a ^ b ^ c
    }

    function g(a, b, c) {
        return b ^ (a | ~c)
    }

    function h(a, e, f, g, h, i, j) {
        return a = c(a, c(c(d(e, f, g), h), j)),
            c(b(a, i), e)
    }

    function i(a, d, f, g, h, i, j) {
        return a = c(a, c(c(e(d, f, g), h), j)),
            c(b(a, i), d)
    }

    function j(a, d, e, g, h, i, j) {
        return a = c(a, c(c(f(d, e, g), h), j)),
            c(b(a, i), d)
    }

    function k(a, d, e, f, h, i, j) {
        return a = c(a, c(c(g(d, e, f), h), j)),
            c(b(a, i), d)
    }

    function l(a) {
        for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)
            b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | a.charCodeAt(i) << h,
            i++;
        return b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | 128 << h,
            g[f - 2] = c << 3,
            g[f - 1] = c >>> 29,
            g
    }

    function m(a) {
        var b, c, d = "",
            e = "";
        for (c = 0; 3 >= c; c++)
            b = a >>> 8 * c & 255,
            e = "0" + b.toString(16),
            d += e.substr(e.length - 2, 2);
        return d
    }

    function n(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
                b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                b += String.fromCharCode(d >> 6 & 63 | 128),
                b += String.fromCharCode(63 & d | 128))
        }
        return b
    }

    var o, p, q, r, s, t, u, v, w, x = [],
        y = 7,
        z = 12,
        A = 17,
        B = 22,
        C = 5,
        D = 9,
        E = 14,
        F = 20,
        G = 4,
        H = 11,
        I = 16,
        J = 23,
        K = 6,
        L = 10,
        M = 15,
        N = 21;
    for (a = n(a),
        x = l(a),
        t = 1732584193,
        u = 4023233417,
        v = 2562383102,
        w = 271733878,
        o = 0; o < x.length; o += 16)
        p = t,
        q = u,
        r = v,
        s = w,
        t = h(t, u, v, w, x[o + 0], y, 3614090360),
        w = h(w, t, u, v, x[o + 1], z, 3905402710),
        v = h(v, w, t, u, x[o + 2], A, 606105819),
        u = h(u, v, w, t, x[o + 3], B, 3250441966),
        t = h(t, u, v, w, x[o + 4], y, 4118548399),
        w = h(w, t, u, v, x[o + 5], z, 1200080426),
        v = h(v, w, t, u, x[o + 6], A, 2821735955),
        u = h(u, v, w, t, x[o + 7], B, 4249261313),
        t = h(t, u, v, w, x[o + 8], y, 1770035416),
        w = h(w, t, u, v, x[o + 9], z, 2336552879),
        v = h(v, w, t, u, x[o + 10], A, 4294925233),
        u = h(u, v, w, t, x[o + 11], B, 2304563134),
        t = h(t, u, v, w, x[o + 12], y, 1804603682),
        w = h(w, t, u, v, x[o + 13], z, 4254626195),
        v = h(v, w, t, u, x[o + 14], A, 2792965006),
        u = h(u, v, w, t, x[o + 15], B, 1236535329),
        t = i(t, u, v, w, x[o + 1], C, 4129170786),
        w = i(w, t, u, v, x[o + 6], D, 3225465664),
        v = i(v, w, t, u, x[o + 11], E, 643717713),
        u = i(u, v, w, t, x[o + 0], F, 3921069994),
        t = i(t, u, v, w, x[o + 5], C, 3593408605),
        w = i(w, t, u, v, x[o + 10], D, 38016083),
        v = i(v, w, t, u, x[o + 15], E, 3634488961),
        u = i(u, v, w, t, x[o + 4], F, 3889429448),
        t = i(t, u, v, w, x[o + 9], C, 568446438),
        w = i(w, t, u, v, x[o + 14], D, 3275163606),
        v = i(v, w, t, u, x[o + 3], E, 4107603335),
        u = i(u, v, w, t, x[o + 8], F, 1163531501),
        t = i(t, u, v, w, x[o + 13], C, 2850285829),
        w = i(w, t, u, v, x[o + 2], D, 4243563512),
        v = i(v, w, t, u, x[o + 7], E, 1735328473),
        u = i(u, v, w, t, x[o + 12], F, 2368359562),
        t = j(t, u, v, w, x[o + 5], G, 4294588738),
        w = j(w, t, u, v, x[o + 8], H, 2272392833),
        v = j(v, w, t, u, x[o + 11], I, 1839030562),
        u = j(u, v, w, t, x[o + 14], J, 4259657740),
        t = j(t, u, v, w, x[o + 1], G, 2763975236),
        w = j(w, t, u, v, x[o + 4], H, 1272893353),
        v = j(v, w, t, u, x[o + 7], I, 4139469664),
        u = j(u, v, w, t, x[o + 10], J, 3200236656),
        t = j(t, u, v, w, x[o + 13], G, 681279174),
        w = j(w, t, u, v, x[o + 0], H, 3936430074),
        v = j(v, w, t, u, x[o + 3], I, 3572445317),
        u = j(u, v, w, t, x[o + 6], J, 76029189),
        t = j(t, u, v, w, x[o + 9], G, 3654602809),
        w = j(w, t, u, v, x[o + 12], H, 3873151461),
        v = j(v, w, t, u, x[o + 15], I, 530742520),
        u = j(u, v, w, t, x[o + 2], J, 3299628645),
        t = k(t, u, v, w, x[o + 0], K, 4096336452),
        w = k(w, t, u, v, x[o + 7], L, 1126891415),
        v = k(v, w, t, u, x[o + 14], M, 2878612391),
        u = k(u, v, w, t, x[o + 5], N, 4237533241),
        t = k(t, u, v, w, x[o + 12], K, 1700485571),
        w = k(w, t, u, v, x[o + 3], L, 2399980690),
        v = k(v, w, t, u, x[o + 10], M, 4293915773),
        u = k(u, v, w, t, x[o + 1], N, 2240044497),
        t = k(t, u, v, w, x[o + 8], K, 1873313359),
        w = k(w, t, u, v, x[o + 15], L, 4264355552),
        v = k(v, w, t, u, x[o + 6], M, 2734768916),
        u = k(u, v, w, t, x[o + 13], N, 1309151649),
        t = k(t, u, v, w, x[o + 4], K, 4149444226),
        w = k(w, t, u, v, x[o + 11], L, 3174756917),
        v = k(v, w, t, u, x[o + 2], M, 718787259),
        u = k(u, v, w, t, x[o + 9], N, 3951481745),
        t = c(t, p),
        u = c(u, q),
        v = c(v, r),
        w = c(w, s);
    //  var O = m(t) + m(u) + m(v) + m(w);
    var O = m(t) + m(w);
    return O.toLowerCase()
}
