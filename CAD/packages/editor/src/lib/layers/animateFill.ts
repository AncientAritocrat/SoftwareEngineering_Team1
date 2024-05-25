import vjmap from 'vjmap';
import type MapApp from '~/MapApp';
import { listMapImages } from '../utils';
import basic from './basic';
import common from './data'
import option  from './option';
import fill from './fill'
import animateLine from './animateLine'
export default {
    name: '动画多边形',
    title: '动画多边形设置',
    collapse: "面图层",
    matchSource: ['geojson', 'vector'], /* 匹配的数据源 */
    icon: `M879.243636 676.491636a28.485818 28.485818 0 1 1 25.506909 51.013819l-379.99709 189.998545a28.485818 28.485818 0 0 1-25.50691 0L119.249455 727.505455a28.485818 28.485818 0 1 1 25.506909-51.013819L512 860.16z m0-189.998545a28.485818 28.485818 0 0 1 25.506909 51.013818l-379.99709 189.998546a28.485818 28.485818 0 0 1-25.50691 0l-379.99709-189.998546a28.485818 28.485818 0 0 1 25.506909-51.013818L512 670.114909z m-379.997091-379.997091a28.485818 28.485818 0 0 1 25.50691 0l379.99709 189.998545a28.485818 28.485818 0 0 1 0 51.013819l-379.99709 189.998545a28.485818 28.485818 0 0 1-25.50691 0L119.249455 347.508364a28.485818 28.485818 0 0 1 0-51.013819zM512 163.886545L195.723636 322.001455 512 480.116364l316.276364-158.114909L512 163.886545z`,
    factory: (data: any, form: any, mapApp: MapApp): any => {
        const fillFactory = fill.factory(data, form, mapApp);
        const animateLineFactory = animateLine.factory(data, form, mapApp);
        return {
            option: {...option},
            expanded: ["通用设置", "动画设置", "绘制设置"],
            default: {
                fillColor: "#00ffff",
                fillOutlineColor: "#00ff00",
                animateImagesType: "arrow",
                animateImages_arrowFillColor: "#22B14C",
                animateImages_arrowStrokeColor: "#fff",
                animateImages_arrowStrokeWidth: 6,
                animateImages_canvasWidth: 128,
                animateImages_canvasHeight: 32,
                animateImages_arrowWidth: 16,
                animateImages_frameCount: 4,
                animateImages_fillColor1: "#f0fb",
                animateImages_fillColor2: "#0ffb"
            },
            rule: [
                ...basic(data, form, mapApp),
                ...common(data, form, mapApp),
                ...animateLineFactory.rule.filter((r: any) => (r.collapse == "动画设置")),
                ...fillFactory.rule.filter((r: any) => (r.collapse != "通用设置" && r.collapse != "数据设置")),
            ]
        }
    }
};