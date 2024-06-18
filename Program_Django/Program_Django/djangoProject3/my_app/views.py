from django import forms
from django.http import JsonResponse
from django.shortcuts import render
from my_app import globalvar as gl
import os
from urllib.parse import quote

from utils.spider import spider


class SpiderForm(forms.Form):
    target = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'id': 'MyTarget', 'placeholder': "请输入"}),
        error_messages={"required": "该字段不能为空"},
        label='目标'
    )

target = gl.get_value("search_target")
url = gl.get_value("search_url")
def test_spider(request):
    if request.method == 'GET':
        form = SpiderForm()
        return render(request, "test_spider.html", {"form": form})
    elif request.method == 'POST':
        form = SpiderForm(request.POST)
        if form.is_valid():
            target = form.cleaned_data['target']
            gl.set_value("search_target", target)
            url = f"https://cn.bing.com/images/search?q={quote(target)}"
            gl.set_value("search_url", url)
            print(gl.get_all())
            print("views",target,url)
            spider(target, url)
            # os.system("python my_app/static/utils/spider.py")
        # new trial
        #     url = f"https://cn.bing.com/images/search?q={quote(target)}"
        #     print(url)
        #     header = {'Connection': 'close'}
        #     name = target  # 图片关键词
        #     path = '../result/images/' + name  # 图片保存路径
        #     countNum = 5  # 爬取数量
        #     key = urllib.parse.quote(name)
        #     first = 1
        #     loadNum = 10  # 加载数量
        #     sfx = 1
        #     count = 0
        #     rule = re.compile(r"\"murl\"\:\"http\S[^\"]+")
        #     if not os.path.exists(path):
        #         os.makedirs(path)
        #     while count < countNum:
        #         html = spider.getStartHtml(url, key, first, loadNum, sfx, header)
        #         count = spider.findImgUrlFromHtml(html, rule, url, key, first, loadNum, sfx,
        #                                           count)
        #         first = count + 1
        #         sfx += 1
            return render(request, "test_spider.html", {"form": form})
        else:
            form = SpiderForm()
            return render(request, "test_spider.html", {"form": form})
