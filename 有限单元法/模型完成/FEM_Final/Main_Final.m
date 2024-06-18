clear;
clc;
%--------------------------------------------------------------------------
%程序计算模型定义，包括构件几何参数，单元参数，材料参数，均布荷载大小。
%程序单位采用国际单位制基本单位，长度单位：m，力的单位：N，应力单位：Pa。
L = 10.0;%m 构件长度
H = 2.0;%m 构件高度
t=0.01; %m %单元厚度
ele_length = 0.1;%m 单元长度
ele_height = 0.1;%m 单元高度
E=2.1e11; %Pa 材料弹性模量
miu=0.3;   %泊松比
load_q=20000; %N/m 均布荷载
node_load=load_q*ele_length; %等效结点荷载
%--------------------------------------------------------------------------
 
 
%--------------------------------------------------------------------------
%网格划分
ele_num_L = L/ele_length; %长度方向单元个数
ele_num_H = H/ele_height; %宽度方向单元个数
node_num_L = ele_num_L + 1; %长度方向节点个数
node_num_H = ele_num_H + 1; %宽度方向节点个数
node = [];  %定义节点列表
ele = []; %定义单元列表
%生成节点列表 节点列表结构为 [节点编号 X坐标 Y坐标 Z坐标（平面问题，该项为0）]
for j = 1:node_num_H
    for i = 1 : node_num_L
        node_new = [i+(j-1)*node_num_L ele_length*(i-1) ele_height*(j-1) 0];
        node = cat (1,node,node_new);
    end
end
%生成单元列表 单元列表结构为[单元编号 第一结点编号 第二节点编号 第三节点编号]（左下角为起点，逆时针顺序）
for j = 1:ele_num_H
    for i = 1 : ele_num_L
        ele_new_odd = [2*i-1+2*(j-1)*ele_num_L i+(j-1)*(ele_num_L+1) i+1+(j-1)*(ele_num_L+1) i+ node_num_L+1+(j-1)*(ele_num_L+1)];
        ele_new_even = [2*i+2*(j-1)*ele_num_L i+(j-1)*(ele_num_L+1) i+(j-1)*(ele_num_L+1)+ node_num_L+1 i+(j-1)*(ele_num_L+1)+ node_num_L];
        ele = cat (1,ele,ele_new_odd);
        ele = cat (1,ele,ele_new_even);
    end
end
 
%--------------------------------------------------------------------------
%生成单元刚度矩阵
%基础参数与单元定义
num_ele=size(ele,1);
n_ele=length(ele(:,1));  %单元数
dof=length(node(:,1))*2;   %自由度，梁单元的每个节点有2个自由度，横向位移，纵向位移
f=zeros(dof,1);     %整体坐标系下结构整体外荷载矩阵
f_loc=zeros(6,1);      %单元外荷载矩阵，局部坐标系下
u=ones(dof,1);     %矩阵位移
K=zeros(dof);          %总体刚度矩阵
stress=zeros(n_ele,1); %单元应力矩阵
%生成总体刚度矩阵
for i=1:n_ele
    k_ele=TriangleElementStiffness(E,miu,t,node(ele(i,2:4),2:4));
    K=assemTriangle(K,k_ele,ele(i,2),ele(i,3),ele(i,4));
end
 
%--------------------------------------------------------------------------
%定义边界条件
%力边界条件
for i=node_num_L*(node_num_H-1): node_num_L*node_num_H
    f(2*i)=-node_load;%N 顶部
end
 f(2*node_num_L*(node_num_H-1)) = -node_load/2;%N 左右边缘两点
 f(2*node_num_L*(node_num_H)) = -node_load/2;%N 左右边缘两点
 % 位移边界条件；
u(1)=0;
u(2)=0;
%u(2*node_num_L-1)=0;
u(2*node_num_L)=0;
 
%--------------------------------------------------------------------------
%求解
%求解未知自由度
index=[];   %未知自由度索
p=[];       %位置自由度对应的节点力矩阵matrix；
for i =1:dof
    if u(i)~=0
        index=[index,i];
        p=[p;f(i)];
    end
end
%求解位移矩阵
u(index)=K(index,index)\p;   
%计算节点变形后位置（为画图明显，对位移进行20倍放大
x1=node(:,2)+20*u(1:2:node_num_L*node_num_H*2);
y1=node(:,3)+20*u(2:2:node_num_L*node_num_H*2);
 
%--------------------------------------------------------------------------
%应力求解及画图
stress=zeros(num_ele,3);
set(0,'defaultfigurecolor','w');

%变形图
figure;
for i=1:n_ele
    patch(node(ele(i,2:4),2),node(ele(i,2:4),3),'w','FaceColor','none','LineStyle','-')
    hold on;
end
set(gca,'FontName','Times New Roman','FontSize',14);
legend('\fontname{宋体}\fontsize{14}初始形态','\fontname{宋体}\fontsize{14}加载形态');

