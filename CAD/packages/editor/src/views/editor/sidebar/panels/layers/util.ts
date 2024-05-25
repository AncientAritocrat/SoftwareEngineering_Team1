import type { MapApp } from '@vjmap/common';

export const getSources = (mapApp: MapApp, matchSource?: string | string[], tags?: any) => {
    const results = [];
    for (let i = 0; i < mapApp.sources.length; i++) {
      const mapSource = mapApp.sources[i];
      if (matchSource) {
        if (typeof matchSource == 'string' && mapSource.source.type != matchSource) {
          continue; // 如果数据源不匹配
        } else if (Array.isArray(matchSource) && matchSource.findIndex(s => s == mapSource.source.type) < 0) {
          continue; // 如果数据源不匹配
        }
      }
      let sourceTag = tags ? tags[mapSource.source.type + (mapSource.tag ? `_${mapSource.tag}` : '')] : "";
      let pointCount, lineCount, polyCount;
      if (mapSource.tag == 'static') {
        // 统计里面的点线面的个数
        // @ts-ignore
        const features = mapSource.source?.data?.features || [];
        for (let i = 0; i < features.length; i++) {
          const geometry = features[i].geometry;
          if (geometry.type == 'Point' || geometry.type == 'MultiPoint') {
            pointCount = pointCount ?? 0;
            pointCount++;
          } else if (geometry.type == 'LineString' || geometry.type == 'MultiLineString') {
            lineCount = lineCount ?? 0;
            lineCount++;
          } else if (geometry.type == 'Polygon' || geometry.type == 'MultiPolygon') {
            polyCount = polyCount ?? 0;
            polyCount++;
          }
        }
      }
      if (pointCount) {
        sourceTag += ` 点${pointCount}`
      }
      if (lineCount) {
        sourceTag += ` 线${lineCount}`
      }
      if (polyCount) {
        sourceTag += ` 面${polyCount}`
      }
      results.push({
        value: mapSource.id,
        label: mapSource.id,
        id: mapApp.sources[i].id,
        memo: mapSource.memo,
        tag: sourceTag,
        pointCount,
        lineCount,
        polyCount
      })
    }
    return results;
  }