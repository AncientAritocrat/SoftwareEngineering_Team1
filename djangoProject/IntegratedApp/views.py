from django.shortcuts import render, HttpResponse
from django import forms
from urllib.parse import quote
from django.conf import settings
import os

from utils.MySpider import spider
from utils.MyYOLO import PicturePridict
from utils.MakeFileTime import mktime


# Create your views here.

class SpiderForm(forms.Form):
    target = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'id': 'MyTarget', 'placeholder': "请输入"}),
        error_messages={"required": "该字段不能为空"},
        label='目标'
    )


class PredictForm(forms.Form):
    target = forms.FileField(label='图片')


def run_spider(request):
    if request.method == 'GET':
        form = SpiderForm()
        return render(request, "spider.html", {"form": form})
    elif request.method == 'POST':
        form = SpiderForm(request.POST)
        if form.is_valid():
            target = form.cleaned_data['target']
            url = f"https://cn.bing.com/images/search?q={quote(target)}"
            spider(target, url)
            return render(request, "spider.html", {"form": form})
        else:
            form = SpiderForm()
            return render(request, "spider.html", {"form": form})


def run_predict(request):
    imgPath = "/static/media/default/TongJi.jpg"    #WEB展示用图片地址
    if request.method == 'GET':
        form = PredictForm()
        return render(request, 'predict.html', {"form":form, "imgPath":imgPath})

    elif request.method == 'POST':
        form = PredictForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            # print(form.cleaned_data)  ==> {'target': <InMemoryUploadedFile: test.jpg (image/jpeg)>}
            image_object = form.cleaned_data.get("target")
            # print(image_object) ==> test.jpg
            imgName, imgExt = image_object.name.split(".")  # ==》('test', 'jpg')
            imgName_new = imgName + '_' + mktime()    # 加上时间序列以区分 ==> test_20240414185208
            NewPath = imgName_new + '.' + imgExt    # ==> test_20240414185208.jpg
            # print(NewPath)
            db_file_path = os.path.join(settings.MEDIA_ROOT, NewPath)
            # print(db_file_path)   ==> \djangoProject\IntegratedApp\static\media\test_20240414185208.jpg
            # form.save()
            f = open(db_file_path, mode="wb")
            for chunk in image_object.chunks():
                f.write(chunk)
            f.close()
            PicturePridict(db_file_path)
        #     Results saved to runs\detect\..\..\..\IntegratedApp\static\PredictedPicture\test_20240414185208
            imgPath = "/static/PredictedPicture/" + imgName_new + '/' + NewPath
        # print(imgPath)    ==> /static/PredictedPicture/test_20240414191246/test_20240414191246.jpg
        return render(request, 'predict.html', {"form":form, "imgPath":imgPath})


