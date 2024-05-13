///////////////////////////////////////////////////////////////////////////////
//版权所有（C）2002-2022，成都梦想凯德科技有限公司。
//本软件代码及其文档和相关资料归成都梦想凯德科技有限公司,应用包含本软件的程序必须包括以下版权声明
//此应用程序应与成都梦想凯德科技有限公司达成协议，使用本软件、其文档或相关材料
//https://www.mxdraw.com/
///////////////////////////////////////////////////////////////////////////////

import { McCmColor, McDb, McDbEntity, McDbLayerTableRecord, McGePoint3d, MxCpp } from "mxcad";
const namedColors = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
function parseColor(color: string): [number, number, number] | [] {

  // 如果是第一种形式，即 "255, 255, 0"
  if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
    return color.split(',').map(Number) as [number, number, number];
  }

  // 如果是第三种形式，即 "0x336666"
  else if (/^0x[0-9a-fA-F]{6}$/.test(color)) {
    const hexValue = parseInt(color, 16);
    return [
      (hexValue >> 16) & 255,
      (hexValue >> 8) & 255,
      hexValue & 255
    ];
  }

  // 如果是第二种形式，即 "#666666"
  else if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const hexValue = parseInt(color.slice(1), 16);
    return [
      (hexValue >> 16) & 255,
      (hexValue >> 8) & 255,
      hexValue & 255
    ];
  }
  else if (namedColors[color.toLowerCase()]) {
    const lowerCaseColor = color.toLowerCase();
    if (namedColors[lowerCaseColor]) {
      return namedColors[lowerCaseColor];
    }
  }
  else {
    const color = new McCmColor()
    color.setColorIndex(256)
    return [color.red, color.green, color.blue]
  }
}
/** 添加图层 */
const addLayer = (layerName: string)=> {
  const layerTable = MxCpp.getCurrentDatabase().layerTable
  if(layerTable.has(layerName)) {
    return
  }
  const layer = new McDbLayerTableRecord()
  layer.color = new McCmColor(0, 0, 0)
  layer.isFrozen = false
  layer.isLocked = false
  layer.isOff = false
  layer.lineWeight = McDb.LineWeight.kLnWtByLayer
  layer.name = layerName
  layerTable.add(layer)
}
export const baseParams = [
  {
    name: "color", description: "颜色", "type": "str", "required": true
  },
  {
    name: "layer", description: "图层", "type": "str", "required": true
  },
  {
    name: "lineweight", description: "线重", "type": "float", "required": true
  }
]
/** 根据参数和并entity 基本属性 */
export const mergeBaseMcDbEntityProps = (entity: McDbEntity | McDbEntity[], param: any) => {
  if (param.layer) {
    addLayer(param.layer)
  }
  const setMcDbEntityProps = (ent: McDbEntity) => {
    if (param.color) {
      ent.trueColor = new McCmColor(...parseColor(param.color))
    }else {
      ent.trueColor = new McCmColor(MxCpp.getCurrentDatabase().getCurrentlyDrawColor())
    }
    if (param.layer) {
      ent.layer = param.layer
    }else {
      ent.layer = MxCpp.getCurrentDatabase().getCurrentlyLayerName()
    }
    if(param.lineweight) {
      ent.lineweight = param.lineweight
    }
  }
  if (Array.isArray(entity)) {
    entity.forEach(setMcDbEntityProps)
  } else if(entity){
    setMcDbEntityProps(entity)
  }
}


export const parseParamPoints = (pointsStr: string) => {
  const pointsArr = pointsStr.split(',').map((i: string) => Number(i))
  const points: McGePoint3d[] = []
  let i = 0
  while (i < pointsArr.length) {
    const x = pointsArr[i]
    i++
    const y = pointsArr[i]
    i++
    if (typeof x === "undefined" || typeof y === "undefined") return points
    const point = new McGePoint3d(x, y)
    points.push(point)
  }
  return points
}


export const parsePoint = (point: string | [number, number] | { x: number, y: number }) => {
  if(typeof point === "object" && "x" in point && "y" in point) {
    return new McGePoint3d(point.x, point.y)
  }
  if(Array.isArray(point)) {
    return new McGePoint3d(point[0], point[1])
  }else if(typeof point === "string"){
    const [x, y] = point.split(",").map((i)=> Number(i))
    if(typeof x === "number" && typeof y === "number") {
      return new McGePoint3d(x, y)
    }
  }
}