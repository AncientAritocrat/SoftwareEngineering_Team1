
<script setup lang="ts">
import { useModalVisible } from './hooks';

const { isModalVisible, hideModal, modalOptions } = useModalVisible()

</script>
<template>
  <teleport to="body">
    <!-- Modal -->
    <div class="modal-wrapper" id="modal" v-if="isModalVisible">
      <div class="modal-body card">
        <div class="modal-header">
          <h2 class="heading">{{ modalOptions.title }}</h2>
          <a href="#!" @click="hideModal" role="button" class="close" aria-label="close this modal">
            <svg viewBox="0 0 24 24">
              <path
                d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
          </a>
        </div>
        <div style="overflow-y: auto; height: 500px;">
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Open_DemoCode')">下载开Demo代码</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Open_DevInstall')">下载开发包</button>
            <button class="button button2" @click="modalOptions.ondrawline">调用画圆线命令</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_DrawLine')">交互画直线</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('MxTest_AddLayer')">添加图层</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_GetAllLayer')">得到所有图层</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_GetAllTextStyle')">得到所有文字样式</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_GetAllBlock')">得到所有图块</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('MxTest_GetAllLinetype')">得到所有线型</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_WritexData')">写扩展数据</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_ReadxData')">读扩展数据</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_InsertBlock')">测试插入一个图块</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawLine')">绘直线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawArc')">绘圆弧</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawCircle')">绘圆</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawPolyline')">绘PL线</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawHatch')">绘填充</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawText')">绘文字</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_Ellipse')">绘椭圆</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_EllipseArc')">绘椭圆弧</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_MText')">绘制多行文字</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawTable')">绘制表格</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_QRCode')">绘制二维码</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_InsertStamp')">插入图章</button>
          </div>


          <div class="btn_box">
            <button class="button button2" @click="modalOptions.ongetallentity">得到所有对象</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_SelectEntity')">交互选择对象</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Export_MxWeb')">保存mxweb到服务器</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_GetSysVars')">得到系统变量</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('MxTest_NewFile')">新建图纸</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ViewBackgroundColor')">白色背景色</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_FindText')">文字查找定位</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_SelectEntitysToBlock')">选择实体做块</button>
          </div>
          <div class="btn_box">

            <button class="button button2" @click="modalOptions.docommand('Mx_Test_Text')">绘制单行文字</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_DrawHatchFormPoint')">选点填充</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_TestExProp')">设置扩展属性</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DimAligned')">绘制对齐标注</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawDimRotated')">绘性线标注</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawDimAngular')">角度标注</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_LineTypeTest')">修改对象线型</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_SelectEntitHideLayer')">选择隐藏对象层</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('MxTest_TestAddCurrentSelect')">添加到当前选择</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_TestSetViewAngle')">视区旋转</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_WriteXRecord')">写扩展记录</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_GetNamedObjectsDictionary')">得到命名字典</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('MxTest_AddTextStyleTable')">添加文字样式</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_DrawCustomEntity')">绘自定义实体</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_ChangeColor')">修改对象颜色</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_ChangeVisible')">修改对象不可见</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_ChangeEntityLayer')">修改对象层</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ChaneEntityDrawOrder')">修改对象显示顺序</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Export_Pdf')">指定范围输出pdf</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_DrawImage')">绘制image</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('MxTest_GetObjectExDictionaryData')">读取对象扩展字典</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_Draw3DPolyline')">绘制3DPolyline</button>
            <button class="button button2" @click="modalOptions.docommand('MxTest_LineText')">绘线文本自定义实体</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_IntersectWith')">计算交点</button>
          </div>

          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Test_TrueText')">修改文字样式</button>
          </div>

          

        </div>
      </div>

    </div>
  </teleport>
</template>
<style scoped lang="scss">
.heading {
  font-size: 1.5em;
  margin-bottom: 12px;
}

.card {
  background: #fff;
  color: #000;
  background-image: linear-gradient(48deg, #fff 0%, #e5efe9 100%);
  border-top-right-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: -20px 20px 35px 1px rgba(10, 49, 86, 0.18);
  display: flex;
  flex-direction: column;
  padding: 32px;
  margin: 40px;
  max-width: 400px;
  width: 100%;
}

.content-wrapper {
  font-size: 1.1em;
  margin-bottom: 44px;
}

.content-wrapper:last-child {
  margin-bottom: 0;
}

.button {
  align-items: center;
  background: #e5efe9;
  border: 1px solid #5a72b5;
  border-radius: 4px;
  color: #121943;
  cursor: pointer;
  display: flex;
  font-size: 1em;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  width: 180px;
}

.button:focus {
  border: 2px solid transparent;
  box-shadow: 0px 0px 0px 2px #121943;
  outline: solid 4px transparent;
}

.link {
  color: #121943;
}

.link:focus {
  box-shadow: 0px 0px 0px 2px #121943;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.input-wrapper .label {
  align-items: baseline;
  display: flex;
  font-weight: 700;
  justify-content: space-between;
  margin-bottom: 8px;
}

.input-wrapper .optional {
  color: #5a72b5;
  font-size: 0.9em;
}

.input-wrapper .input {
  border: 1px solid #5a72b5;
  border-radius: 4px;
  height: 40px;
  padding: 8px;
}

code {
  background: #e5efe9;
  border: 1px solid #5a72b5;
  border-radius: 4px;
  padding: 2px 4px;
}

.modal-header {
  align-items: baseline;
  display: flex;
  justify-content: space-between;
}

.close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  height: 16px;
  text-decoration: none;
  width: 16px;
}

.close svg {
  width: 16px;
}

.modal-wrapper {
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}

#modal {
  transition: opacity 0.25s ease-in-out;
}

#modal .modal-body {
  max-width: 830px;
  opacity: 1;
  transform: translateY(-100px);
  transition: opacity 0.25s ease-in-out;
  width: 100%;
  z-index: 1;
}

.outside-trigger {
  bottom: 0;
  cursor: default;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}

.button__link {
  text-decoration: none;
}

.button {
  background-color: #4CAF50;
  /* Green */
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s;
  /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
}

.button1 {
  background-color: white;
  color: black;
  border: 2px solid #4CAF50;
}

.button1:hover {
  background-color: #4CAF50;
  color: white;
}

.button2 {
  background-color: white;
  color: black;
  border: 2px solid #008CBA;
}

.button2:hover {
  background-color: #008CBA;
  color: white;
}

.btn_box {
  width: 100%;
  display: flex;
  justify-items: center;
  justify-content: start;
  align-items: start;
}
</style>


