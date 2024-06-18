clear;
clc;
%--------------------------------------------------------------------------
%�������ģ�Ͷ��壬�����������β�������Ԫ���������ϲ������������ش�С��
%����λ���ù��ʵ�λ�ƻ�����λ�����ȵ�λ��m�����ĵ�λ��N��Ӧ����λ��Pa��
L = 10.0;%m ��������
H = 2.0;%m �����߶�
t=0.01; %m %��Ԫ���
ele_length = 0.1;%m ��Ԫ����
ele_height = 0.1;%m ��Ԫ�߶�
E=2.1e11; %Pa ���ϵ���ģ��
miu=0.3;   %���ɱ�
load_q=20000; %N/m ��������
node_load=load_q*ele_length; %��Ч������
%--------------------------------------------------------------------------
 
 
%--------------------------------------------------------------------------
%���񻮷�
ele_num_L = L/ele_length; %���ȷ���Ԫ����
ele_num_H = H/ele_height; %��ȷ���Ԫ����
node_num_L = ele_num_L + 1; %���ȷ���ڵ����
node_num_H = ele_num_H + 1; %��ȷ���ڵ����
node = [];  %����ڵ��б�
ele = []; %���嵥Ԫ�б�
%���ɽڵ��б� �ڵ��б�ṹΪ [�ڵ��� X���� Y���� Z���꣨ƽ�����⣬����Ϊ0��]
for j = 1:node_num_H
    for i = 1 : node_num_L
        node_new = [i+(j-1)*node_num_L ele_length*(i-1) ele_height*(j-1) 0];
        node = cat (1,node,node_new);
    end
end
%���ɵ�Ԫ�б� ��Ԫ�б�ṹΪ[��Ԫ��� ��һ����� �ڶ��ڵ��� �����ڵ���]�����½�Ϊ��㣬��ʱ��˳��
for j = 1:ele_num_H
    for i = 1 : ele_num_L
        ele_new_odd = [2*i-1+2*(j-1)*ele_num_L i+(j-1)*(ele_num_L+1) i+1+(j-1)*(ele_num_L+1) i+ node_num_L+1+(j-1)*(ele_num_L+1)];
        ele_new_even = [2*i+2*(j-1)*ele_num_L i+(j-1)*(ele_num_L+1) i+(j-1)*(ele_num_L+1)+ node_num_L+1 i+(j-1)*(ele_num_L+1)+ node_num_L];
        ele = cat (1,ele,ele_new_odd);
        ele = cat (1,ele,ele_new_even);
    end
end
 
%--------------------------------------------------------------------------
%���ɵ�Ԫ�նȾ���
%���������뵥Ԫ����
num_ele=size(ele,1);
n_ele=length(ele(:,1));  %��Ԫ��
dof=length(node(:,1))*2;   %���ɶȣ�����Ԫ��ÿ���ڵ���2�����ɶȣ�����λ�ƣ�����λ��
f=zeros(dof,1);     %��������ϵ�½ṹ��������ؾ���
f_loc=zeros(6,1);      %��Ԫ����ؾ��󣬾ֲ�����ϵ��
u=ones(dof,1);     %����λ��
K=zeros(dof);          %����նȾ���
stress=zeros(n_ele,1); %��ԪӦ������
%��������նȾ���
for i=1:n_ele
    k_ele=TriangleElementStiffness(E,miu,t,node(ele(i,2:4),2:4));
    K=assemTriangle(K,k_ele,ele(i,2),ele(i,3),ele(i,4));
end
 
%--------------------------------------------------------------------------
%����߽�����
%���߽�����
for i=node_num_L*(node_num_H-1): node_num_L*node_num_H
    f(2*i)=-node_load;%N ����
end
 f(2*node_num_L*(node_num_H-1)) = -node_load/2;%N ���ұ�Ե����
 f(2*node_num_L*(node_num_H)) = -node_load/2;%N ���ұ�Ե����
 % λ�Ʊ߽�������
u(1)=0;
u(2)=0;
%u(2*node_num_L-1)=0;
u(2*node_num_L)=0;
 
%--------------------------------------------------------------------------
%���
%���δ֪���ɶ�
index=[];   %δ֪���ɶ���
p=[];       %λ�����ɶȶ�Ӧ�Ľڵ�������matrix��
for i =1:dof
    if u(i)~=0
        index=[index,i];
        p=[p;f(i)];
    end
end
%���λ�ƾ���
u(index)=K(index,index)\p;   
%����ڵ���κ�λ�ã�Ϊ��ͼ���ԣ���λ�ƽ���20���Ŵ�
x1=node(:,2)+20*u(1:2:node_num_L*node_num_H*2);
y1=node(:,3)+20*u(2:2:node_num_L*node_num_H*2);
 
%--------------------------------------------------------------------------
%Ӧ����⼰��ͼ
stress=zeros(num_ele,3);
set(0,'defaultfigurecolor','w');

%����ͼ
figure;
for i=1:n_ele
    patch(node(ele(i,2:4),2),node(ele(i,2:4),3),'w','FaceColor','none','LineStyle','-')
    hold on;
end
set(gca,'FontName','Times New Roman','FontSize',14);
legend('\fontname{����}\fontsize{14}��ʼ��̬','\fontname{����}\fontsize{14}������̬');

