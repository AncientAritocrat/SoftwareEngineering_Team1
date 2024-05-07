# SoftwareEngineering_Team1
**软件工程课程第一组**

### 小组成员
丁春阳、冯祎欣、朱羽伦、张宇

### 工作进度
- 爬虫功能模板 
*已完成*
- 裂缝识别
*已完成*
- 神经网络训练集打包
*开发中*
- 交流论坛
*开发中*

### 文件目录
* ```djangoProject/templates``` 文件夹中为html文件
* ``djangoProject/result/images`` 文件夹中为爬虫结果
* ``djangoProject/IntegratedApp/static/utils`` 文件夹中为python功能文件
* ``djangoProject/IntegratedApp/static/plugins`` 文件夹中为CSS文件
* ``djangoProject/IntegratedApp/static/js`` 文件夹中为JS文件
* ``djangoProject/IntegratedApp/static/PredictedPicture`` 文件夹中为裂缝识别后保存图片结果
* ``djangoProject/IntegratedApp/static/media`` 文件夹中为裂缝识别上传图片副本

### 文件解释
* ```djangoProject/templates/spider.html``` 爬虫界面
* ``djangoProject/templates/predict.html`` 裂缝识别界面
* ``djangoProject/templates/layout.html`` 所有页面的模板
* ``djangoProject/templates/example.html`` layout引用方法
* ``djangoProject/templates/home.html`` 主页（旧）
* ``djangoProject/templates/BIM.html`` BIM展示页面
* ``djangoProject/templates/BimMaster.html`` qmodel单独界面
* ``djangoProject/templates/index.html`` 数据分析（首页）
* ``djangoProject/djangoProject/settings.py`` 设置文件
* ``djangoProject/djangoProject/urls.py`` 网址路径管理文件
* ``djangoProject/IntegratedApp/views.py`` 视图管理
* ``djangoProject/IntegratedApp/static/utils/GetFileName.py`` 从路径中获取文件名
* ``djangoProject/IntegratedApp/static/utils/MakeFileTime.py`` 创建文件名时间戳避免重名
* ``djangoProject/IntegratedApp/static/utils/MySpider.py`` 爬虫程序
* ``djangoProject/IntegratedApp/static/utils/MyYOLO.py`` 裂缝识别程序
* ``djangoProject/IntegratedApp/static/plugins/best.pt`` YOLO-V8模型文件
* ``djangoProject/IntegratedApp/static/plugins/bootstrap-5.3.0/css/bootstrap.css`` BOOTSTRAP模板文件
* ``djangoProject/IntegratedApp/static/media/Default`` 裂缝识别界面默认展示图片-校徽


### index页面
* 展示数据来源``subside.csv``
* 功能实现``echarts``

### 裂缝识别页面页面
* 模型``YOLO-V8``
* 数据``roboflow.com``

### BIM页面
* 隧道点云模型展示``modelviewer``
* 别墅BIM模型展示``qmodel``
* node.js启动方法
    ```commandline
    D:
    cd D:\Documents\GitHub\SoftwareEngineering_Team1\BimMaster
    http-server
    ```
* node.js接口 ``http://127.0.0.1:8080``
