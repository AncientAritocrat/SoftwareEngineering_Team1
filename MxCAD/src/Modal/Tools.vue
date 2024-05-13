
<script setup lang="ts">
import { useModalVisible } from './hooks';
import { reactive, ref } from 'vue';

const { isToolsVisible, hideModal, modalOptions } = useModalVisible()
const types = reactive([
  { name: '修改工具', id: 'fit' },
  { name: '文字工具', id: 'text' },
  { name: '绘图工具', id: 'draw' },
  { name: '块工具', id: 'block' },
  { name: '测量工具', id: 'count' },
])
const btn_id = ref<string>('fit')
</script>
<template>
  <teleport to="body">
    <!-- Modal -->
    <div class="modal-wrapper" id="modal" v-if="isToolsVisible">
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
        <div style="border-bottom:2px solid #008CBA; margin-bottom: 8px;">
          <button v-for="item in types" :key="item.id" @click="() => { btn_id = item.id }"
            :class="btn_id === item.id ? 'btn btn2' : 'btn'">{{ item.name }}</button>
        </div>
        <div style="overflow-y: auto; height: 500px;" v-show="btn_id === 'fit'">
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Multicopy')">多重复制</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ArcToCircle')">弧转圆</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_CopyRotation')">复制旋转</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_CricleTotoll')">圆转多边</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_ChangeColor')">修改颜色</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ArcToAngle')">圆弧切角</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_TemHiding')">临时隐藏</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BoxDel')">方框删除</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_AngleCopy')">角度复制</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_VertexRep')">顶点复制</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_IntersectBreak')">交点打断</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_DoubleOff')">双向偏移</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_EitCircle')">改圆大小</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_LayerTypeScale')">线型比例</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Telescoping')">伸缩</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ArcOrder')">按弧阵列</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_PlRoundCorners')">pl圆角</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_PlReverse')">pl线反向</button>
            <!-- <button class="button button2" @click="modalOptions.docommand('Mx_FillRatio')">填充比例</button> -->
            <!-- <button class="button button2" @click="modalOptions.docommand('Mx_InheritanceFill')">继承填充</button> -->
          </div>
        </div>
        <div style="overflow-y: auto; height: 500px;" v-show="btn_id === 'draw'">
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_DrawStart')">星形</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ConcavoVex')">凹凸线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ZigzagLine')">锯齿线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_CenterRect')">中心矩形</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_BreakLine')">折断线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_CCLine')">圆中心线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Piping')">管道</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_CutPipeline')">剖管符</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_PerpLine')">中垂线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_StairLine')">楼梯</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_SolidCircle')">实心圆</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_CottonInsulation')">保温棉</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_CenterLine')">中心线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_DoHole')">开洞</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Compass')">指北针</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_MassegeBox')">消息框</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_DatumSymbol')">基准符</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_WelLine')">焊缝线</button>
          </div>
        </div>
        <div style="overflow-y: auto; height: 500px;" v-show="btn_id === 'text'">
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_AlignByLine')">按线对齐</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_TextHeight')">改字高</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_TextWidth')">改字宽</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BrushCon')">刷内容</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_ReplaceCon')">换内容</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_AlignLeft')">左右对齐</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_AlignUp')">上下对齐</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_TextReversal')">文字反转</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_TextTraming')">文字加框</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Underline')">下划线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_TitleLine')">图名线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Case')">大小写</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_NumSum')">数字求和</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_SSWords')">选特定字</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Prefix')">前后缀</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ConnectText')">连接文字</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_TextTrim')">去空格</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_VerticalText')">文字竖向</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_AlignByArc')">按弧对齐</button>
          </div>
        </div>
        <div style="overflow-y: auto; height: 500px;" v-show="btn_id === 'block'">
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_ChangeBN')">改块名</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BushBlk')">刷块</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_ConBlk')">块连线</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkCenterLine')">块中心线</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkPt')">改块基点</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkColor')">改块颜色</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkRotate')">多块旋转</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkScale')">多块缩放</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkAngle')">刷块角度</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkSelect')">按块选择</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_BlkAllSelect')">按块全选</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_SSBlk')">统计单块</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_SMBlk')">统计多块</button>
          </div>
        </div>
        <div style="overflow-y: auto; height: 500px;" v-show="btn_id === 'count'">
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_StaLength')">长度</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_StaArea')">面积</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_StandardSlope')">标斜率</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_CoordAnnotation')">坐标标注</button>
          </div>
          <div class="btn_box">
            <button class="button button2" @click="modalOptions.docommand('Mx_Elevation')">智能标高</button>
            <button class="button button2" @click="modalOptions.docommand('Mx_Roughness')">粗糙度</button>
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

.btn {
  height: 40px;
  width: 100px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  font-weight: 700;
}

.btn2 {
  background-color: #008CBA;
  color:#fff;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
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
  height: 600px
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


