///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////
import { MxDrawObject, MxFun } from "mxdraw";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
export function mxtest_add_3d_model(mxdraw:MxDrawObject) {
  const loader = new GLTFLoader();
  loader.load(
    './gis/34M_17.gltf',
    (gltf) => {
      gltf.scene.position.set(116577.28779765591, 19632.646909285337,0);
      gltf.scene.rotateX(Math.PI / 2);
      gltf.scene.scale.set(2,2,2);
      mxdraw.addObject(gltf.scene);
    }
  );
}
