import os
import urllib
import re
from bs4 import BeautifulSoup
import time
from urllib.parse import quote

def spider(target, url):
    # target = gl.get_value("search_target")
    # url = gl.get_value("search_url")
    print("spider", target, url)
    header = {'Connection': 'close'}

    name = target  # 图片关键词
    global path
    path = "../result/images/" + name + '/'  # 图片保存路径（manage.py的上层文件夹中）
    countNum = 35  # 爬取数量 35的倍数
    key = urllib.parse.quote(name)
    first = 1
    loadNum = 35  # 加载数量(寄，控制不了，BING自动35)
    sfx = 1
    count = 0
    rule = re.compile(r"\"murl\"\:\"http\S[^\"]+")
    if not os.path.exists(path):
        os.makedirs(path)
    while count < countNum:
        html = getStartHtml(url, key, first, loadNum, sfx, header)
        count = findImgUrlFromHtml(html, rule, url, key, first, loadNum, sfx,
                                   count)
        first = count + 1
        sfx += 1

def getImage(url, count):
    '''从原图url中将原图保存到本地'''
    try:
        time.sleep(0.5)
        # urllib.request.urlretrieve(url, '../result/imgs' + search_query + str(count + 1) + '.jpg')
        urllib.request.urlretrieve(url, path + str(count + 1) + '.jpg')
    except Exception as e:
        time.sleep(1)
        print("本张图片获取异常，跳过...")
    else:
        print("图片+1,成功保存 " + str(count + 1) + " 张图")


def findImgUrlFromHtml(html, rule, url, key, first, loadNum, sfx, count):
    '''从缩略图列表页中找到原图的url，并返回这一页的图片数量'''
    soup = BeautifulSoup(html, "lxml")
    link_list = soup.find_all("a", class_="iusc")
    url = []
    for link in link_list:
        result = re.search(rule, str(link))
        # 将字符串"amp;"删除
        url = result.group(0)
        # 组装完整url
        url = url[8:len(url)]
        # 打开高清图片网址
        getImage(url, count)
        count += 1
    # 完成一页，继续加载下一页
    return count


def getStartHtml(url, key, first, loadNum, sfx, header):
    '''获取缩略图列表页'''
    page = urllib.request.Request(url.format(key, first, loadNum, sfx),
                                  headers=header)
    html = urllib.request.urlopen(page)
    return html