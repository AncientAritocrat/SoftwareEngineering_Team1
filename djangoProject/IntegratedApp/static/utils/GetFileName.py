import os
def get_file_name(path):
    # 获取文件名（包含扩展名）
    filename_with_extension = os.path.basename(path)

    # 分割文件名和扩展名
    filename, extension = os.path.splitext(filename_with_extension)

    # 去掉文件扩展名
    filename_without_extension = filename

    return filename_without_extension