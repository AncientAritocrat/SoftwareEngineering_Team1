import type { Map } from 'vjmap'
export const toString = (num: number | string | undefined | null) => {
    if (typeof num == 'number') return num + '';
    if (!num) return '';
    return num;
}

export const isExprString = (val: any) => {
    if (!val) return false;
    if (typeof val == 'number') return false;
    if (typeof val == "string") {
        if (val.charAt(0) == '#') return false; // 颜色
        if (!isNaN(+val)) return false; // 如果能转成数字
        val = val.trim();
        if (val.charAt(0) == '{' || val.charAt(0) == '[' || val.length > 25) {
            return true;
        } else {
            return false;
        }
    }
    if (typeof val == 'object') return true;
    if (Array.isArray(val)) return true;
    return false;
}

export const isColorString = (val: any) => {
    if (typeof val == "string" && (val.substring(0, 3) == 'rgb' || (val.charAt(0) == '#' && val.length == 7 || val.length == 9))) {
        return true;
    }
    return false;
}

export const listMapImages = (map: Map) => {
    let result: any = map?.listImages()?.map(name => {
        return {
            label: name,
            value: name
        }
    }) || [];
    
    result = [
        {
            label: "",
            value: undefined
        },
        ...result
    ]
    return result
}