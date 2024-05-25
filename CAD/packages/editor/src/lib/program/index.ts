import vjmap from 'vjmap'
import type { Map } from 'vjmap'
import type MapApp from '@vjmap/common'
import vjcommon from '@vjmap/common'
export const onMapLoaded = async (map: Map, mapApp: MapApp, context?: any)=> {
    
    // 最后返回一个清空的函数
    return ()=> {
    }
}