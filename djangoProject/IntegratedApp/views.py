from django.shortcuts import render, HttpResponse
from django import forms
from urllib.parse import quote
from django.conf import settings
import os

from IntegratedApp import models
from utils.MySpider import spider
from utils.MyYOLO import PicturePridict
from utils.MakeFileTime import mktime


# Create your views here.

class SpiderForm(forms.Form):
    target = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'id': 'MyTarget', 'placeholder': "请输入", 'class': 'form-control'}),
        error_messages={"required": "该字段不能为空"},
        label='目标'
    )


class PredictForm(forms.Form):
    target = forms.FileField(label='图片', widget=forms.FileInput(attrs={'class': 'form-control'}))


# 母版
def home(request):
    title = "集成式土木助手"
    return render(request, 'layout.html', {'title': title})


def calculate_max_change(data):
    max_change = {'date': None, 'segment': None, 'change': None}

    for i in range(1, len(data)):
        current_day = data[i]
        previous_day = data[i - 1]

        for segment, value in current_day.items():
            if segment != 'date':
                change = float(value) - float(previous_day[segment])
                if max_change['change'] is None or abs(change) > abs(max_change['change']):
                    max_change['date'] = current_day['date']
                    max_change['segment'] = segment
                    max_change['change'] = change

    return max_change


def calculate_max_subsidences(data):
    max_subsidences = {'date': None, 'segment': None, 'max_subsidence': None}

    for day_data in data:
        date = day_data['date']
        for segment, value in day_data.items():
            if segment != 'date':
                subsidence = float(value)
                abs_subsidence = abs(subsidence)
                if max_subsidences['max_subsidence'] is None or abs_subsidence > abs(max_subsidences['max_subsidence']):
                    max_subsidences['date'] = date
                    max_subsidences['segment'] = segment
                    max_subsidences['max_subsidence'] = subsidence

    return max_subsidences


def index(request):
    title = "数据分析可视化"
    if request.method == "GET":
        form_data = models.Subside.objects.values()
        if form_data:
            # 获取表头
            headers = list(form_data[0].keys())
            # 获取内容
            content = list(form_data.values())

            max_change = calculate_max_change(content)
            max_subside = calculate_max_subsidences(content)

            return render(request, 'index.html',
                          {'headers': headers, 'content': content, 'max_change': max_change, 'max_subside': max_subside,
                           'title': title})
        error_message = "数据库获取失败"
        return render(request, 'index.html', {"error_message": error_message, 'title': title})
    return render(request, 'index.html', {'title': title})


def run_spider(request):
    title = "爬虫"
    if request.method == 'GET':
        form = SpiderForm()
        return render(request, "spider.html", {"form": form, "title": title})
    elif request.method == 'POST':
        form = SpiderForm(request.POST)
        if form.is_valid():
            target = form.cleaned_data['target']
            url = f"https://cn.bing.com/images/search?q={quote(target)}"
            spider(target, url)
            return render(request, "spider.html", {"form": form, "title": title})
        else:
            form = SpiderForm()
            return render(request, "spider.html", {"form": form, "title": title})


def run_predict(request):
    title = "混凝土裂缝识别"
    imgPath = "/static/media/default/TongJi.jpg"  # WEB展示用图片地址
    if request.method == 'GET':
        form = PredictForm()
        return render(request, 'predict.html', {"form": form, "imgPath": imgPath, "title": title})

    elif request.method == 'POST':
        form = PredictForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            # print(form.cleaned_data)  ==> {'target': <InMemoryUploadedFile: test.jpg (image/jpeg)>}
            image_object = form.cleaned_data.get("target")
            # print(image_object) ==> test.jpg
            imgName, imgExt = image_object.name.split(".")  # ==》('test', 'jpg')
            imgName_new = imgName + '_' + mktime()  # 加上时间序列以区分 ==> test_20240414185208
            NewPath = imgName_new + '.' + imgExt  # ==> test_20240414185208.jpg
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
        return render(request, 'predict.html', {"form": form, "imgPath": imgPath, "title": title})


def run_BIM(request):
    title = "BIM"
    imgPath = "/static/media/BIM.png"
    return render(request, "BIM.html", {"title": title, "imgPath": imgPath})

def run_BimMaster(request):
    title = "BimMaster"
    imgPath = "/static/media/BIM.png"
    return render(request, "BimMaster.html", {"title": title, "imgPath": imgPath})

def run_CAD(request):
    title = "CAD"
    imgPath = "/static/media/CAD.png"
    return render(request, "CAD.html", {"title": title, "imgPath": imgPath})


def run_chat(request):
    title = "chat"
    return render(request, "layout.html", {"title": title})
