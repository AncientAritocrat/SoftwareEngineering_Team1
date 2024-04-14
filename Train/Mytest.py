from ultralytics import YOLO
# 导入训练好的模型 best.pt
ModelPath = "./runs/detect/train4/weights/best.pt"
model = YOLO(ModelPath)
# 测试数据
image_path = "./1.jpg"
save_path = "../pre"
model.predict(image_path, save=True, name=save_path)