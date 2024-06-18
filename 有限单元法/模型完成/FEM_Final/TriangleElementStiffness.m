function k_ele=TriangleElementStiffness(E,miu,t,node_ele)
% 三角单元刚度矩阵
x1=node_ele(1,1);
y1=node_ele(1,2);
x2=node_ele(2,1);
y2=node_ele(2,2);
x3=node_ele(3,1);
y3=node_ele(3,2);
% ---------------------------
A=(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2;  %单元面积
a1=x2*y3-y2*x3;
a2=y1*x3-x1*y3;
a3=x1*y2-y1*x2;
b1=y2-y3;
b2=y3-y1;
b3=y1-y2;
c1=x3-x2;
c2=x1-x3;
c3=x2-x1;
D=E/(1-miu^2)*[1 miu 0;
                miu 1 0;
                0 0 (1-miu)/2]; 
B1 = [b1 0;0 c1;c1 b1];
B2 = [b2 0;0 c2;c2 b2];
B3 = [b3 0;0 c3;c3 b3];
B_single_element = [B1 B2 B3]./2./A;
k_ele = B_single_element'*D*B_single_element.*t.*A;

