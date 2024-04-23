import * as THREE from "three";

//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';


console.log(THREE);
//创建场景
const scene =  new THREE.Scene();

//创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

//设置相机位置
camera.position.set(0,0,10);
scene.add(camera);

//添加物体
//创建几何体
const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
//根据几何体和材质创建物体
const cube = new THREE.Mesh( geometry, material ); 
//将几何体添加到场景中
scene.add( cube );

//初始化渲染器
const renderer = new THREE.WebGLRenderer();
//设置渲染的尺寸和大小
renderer.setSize(window.innerWidth,window.innerHeight);
//console.log(renderer);
//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

//通过相机渲染场景
//renderer.render(scene,camera);

//创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement);

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
function render(){
    renderer.render(scene,camera);
//  渲染下一帧的时候调用render函数
    requestAnimationFrame(render);
}
render();

