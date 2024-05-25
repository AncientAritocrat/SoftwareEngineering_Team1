import type MapApp from '~/MapApp';
export default (data: any, form: any, mapApp: MapApp): any => {
    return [
        {
            type: 'input',
            field: 'layerId',
            title: '图层id',
            value: data.layerId,
            collapse: "通用设置",
            props: {
                placeholder: '',
                disabled: true
            }
        },
        {
            type: 'input',
            field: 'sourceId',
            title: '数据源',
            collapse: "通用设置",
            value: data.sourceId,
            props: {
                placeholder: '',
                disabled: true
            }
        }
    ]
}