from django.shortcuts import render
from django import forms
from urllib.parse import quote

from utils.MySpider import spider


# Create your views here.

class SpiderForm(forms.Form):
    target = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'id': 'MyTarget', 'placeholder': "请输入"}),
        error_messages={"required": "该字段不能为空"},
        label='目标'
    )


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
