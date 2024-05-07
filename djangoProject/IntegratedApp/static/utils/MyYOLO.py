from ultralytics import YOLO
import os

from utils.GetFileName import get_file_name


def PicturePridict(image_path):
    ModelPath = "../IntegratedApp/static/plugins/best.pt"
    model = YOLO(ModelPath)
    picname = get_file_name(image_path)
    save_path = "../../IntegratedApp/static/PredictedPicture/"+picname
    # 默认将在本文件文件夹下生成./runs/detect/{PicName}
    # 目前文件夹位置为djangoProject/IntegratedApp/static/PredictedPicture
    model.predict(image_path, save=True, name=save_path)


# path = r"D:\Documents\GitHub\SoftwareEngineering_Team1\Train\1.jpg"
'''
path = r"D:\Documents\GitHub\SoftwareEngineering_Team1\djangoProject\test.jpg"
PicturePridict(path)
'''