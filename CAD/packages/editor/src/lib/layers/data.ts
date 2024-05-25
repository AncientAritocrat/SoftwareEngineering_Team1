import type MapApp from '~/MapApp';
export default (data: any, form: any, mapApp: MapApp, disableSourceLayer?: boolean, disableTimerUpdate?: boolean): any => {
    const items: any = [
        {
            type: "InputNumber",
            field: 'minzoom',
            title: '最小级别',
            collapse: "数据设置",   
            value: data.minzoom,
            props: {
                min: 0,
                max: 24,
                placeholder: '请输入0-24级别中的一个级别',
            }
        },
        {
            type: "InputNumber",
            field: 'maxzoom',
            title: '最大级别',
            collapse: "数据设置",  
            value: data.maxzoom,
            props: {
                min: 0,
                max: 24,
                placeholder: '请输入0-24级别中的一个级别',
            }
        },
        {
            type: 'exprComp',
            field: 'filter',
            title: '数据过滤',
            collapse: "数据设置",
            value: data.filter,
            props: {
                childType: "Input",
                onlyExprInput: true,
                hideExprButton: true,
                placeholder: '',
            }
        }
    ]
    if (!disableTimerUpdate) {
        items.push({
            type: 'select',
            field: 'disableTimerUpdate',
            title: '不允许动态更新',
            collapse: "数据设置",
            value: data.disableTimerUpdate,
            options: [{
                label: "",
                value: undefined
            },{
                label: "是",
                value: true
            },{
                label: "否",
                value: false
            }],
        })
    }
    if (!disableSourceLayer) {
        items.push({
            type: 'input',
            field: 'sourceLayer',
            title: '数据源图层',
            collapse: "数据设置",  
            value: data.sourceLayer,
            props: {
                placeholder: '',
            }
        })
    }
    return items;
}
