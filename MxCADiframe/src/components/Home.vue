<template>
  <div class="content">
    <div class="left">
      <div style="padding: 20px;">
        <h3>功能演示:</h3>
        <ul>
          <li v-for="(item, i) in list" :key="i" @click="onClick(item.cmd,item.type,item.param)">
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    <div id="myiframe"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Home,
  },
})
export default class Home extends Vue {
  public list: any = [
    {
      name: '插入图块',
      cmd: 'Mx_Insert',
      type:"sendStringToExecute"
    },
    {
      name: '画样条线',
      cmd: 'Mx_Spline',
      type:"sendStringToExecute"
    },
    
    {
      name: '画线',
      cmd: 'Mx_Line',
      type:"sendStringToExecute"
    },
    {
      name: '画圆',
      cmd: 'Mx_Circle',
      type:"sendStringToExecute"
    },
    {
      name: '测量距离',
      cmd: 'Mx_Linear',
      type:"sendStringToExecute"
    },
    {
      name: '参数绘制直线',
      cmd: 'Mx_ParamDrawLine',
      type:"sendStringToExecute",
      param:{x1:100,y1:100,x2:200,y2:300}
    },
    {
      name: '取消当前命令',
      cmd: '',
      type:"sendStringToExecute"
    }
  ];
  private iframe:any;
  // 点击事件
  public onClick(cmd: string, type:string,param:any) {
    this.iframe.contentWindow.postMessage(
        {
          cmd:cmd,
          type:type,
          param:param
        },
        '*'
    );
  }

  private getQueryString (name:string) :string{
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return  decodeURIComponent(r[2]);
        return '';
    }
  
  protected mounted() {
    var sDebug = this.getQueryString("debug");
    var isDebug  = false;
    if(sDebug != undefined && sDebug.toLowerCase() == "true") {
      isDebug = true;
    }

    
    let  src = "http://localhost:3000/mxcad";
    if(isDebug)
    {
      src = 'http://localhost:3366/?wasmtype=st';
      //src = 'http://localhost:3366/?wasmtype=st&file=tree.mxweb';
      //src = 'http://localhost:3000/mxcad/?wasmtype=st';
    }
    
    const iframe: any = document.createElement('iframe');
    this.iframe = iframe;
    const myiframe: any = document.getElementById('myiframe');
    this.$nextTick(() => {
      iframe.src = src;
      iframe.id = 'MXCAD';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      myiframe.append(iframe);
    });
    iframe.onload = () => {
    };
    window.addEventListener(
      'message',
      (event: any) => {
        console.log(event.data);
      },
      false
    );
  }
}
</script>
<style scoped>
body {
  background-color: #ccc;
}
.content {
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0 50px;
}
.left {
  margin-right: 30px;
  min-width: 200px;
  border: 4px solid #a5b6d2;
  background-color: #e9f7ff;
}
#myiframe {
  width: 100%;
  height: 80vh;
}
.left h3 {
  color: red;
}
ul,
li {
  list-style-type: none;
  padding: 0;
}
li {
  background-image: linear-gradient(#e7f4fc, #c9e8fa);
  width: 100%;
  height: 30px;
  line-height: 30px;
  border: 1px #a5b6d2 solid;
  color: #000;
  margin-top: 10px;
  text-align: center;
  cursor: pointer;
}
</style>
