from ultralytics import YOLO

def PicturePridict(image_path):
    ModelPath = "../plugins/best.pt"
    model = YOLO(ModelPath)
    save_path = "../../../../PredictedPicture"
    # 将在本文件文件夹下生成./runs/detect/{PicName}
    # 目前文件夹位置为djangoProject/IntegratedApp/PredictedPicture
    model.predict(image_path, save=True, name=save_path)

'''
path = r"D:\Documents\GitHub\SoftwareEngineering_Team1\SoftwareEngineering_Team1-LilyVon\1.jpg"
PicturePridict(path)
'''