import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

/**
 * 变电站数据接口
 */
export interface Substation {
  /** 变电站名称 */
  name: string
  /** 经纬度坐标 [经度, 纬度] */
  coord: number[]
}

/**
 * 输电线路数据接口
 */
export interface TransmissionLine {
  /** 起点坐标 */
  from: number[]
  /** 终点坐标 */
  to: number[]
  /** 负荷率数值 */
  load: number
}

/**
 * 地图显示模式类型
 */
export type MapMode = 'grid' | 'load' | 'alarm'

/**
 * 区域负荷数据记录类型
 */
export type DistrictLoadRecord = Record<string, number>

/**
 * 根据负荷率获取输电线路颜色
 *
 * @param load - 负荷率数值
 * @returns 对应的颜色值
 * @internal
 */
function getLineColor(load: number): string {
  if (load > 85) return '#ff4444'
  if (load > 70) return '#ff9500'
  return '#00d4ff'
}

/**
 * 根据负荷和显示模式获取区域颜色
 *
 * @param load - 区域负荷值
 * @param mode - 地图显示模式
 * @returns 对应的颜色渐变对象
 * @internal
 */
function getDistrictColor(load: number, mode: MapMode): string | echarts.graphic.LinearGradient {
  if (mode === 'alarm') {
    if (load > 350) return '#ff4444'
    if (load > 200) return '#ff9500'
    return '#00ff88'
  }
  if (mode === 'load') {
    if (load > 350) return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(255, 68, 68, 0.95)' },
      { offset: 1, color: 'rgba(100, 10, 10, 0.6)' }
    ])
    if (load > 200) return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(255, 149, 0, 0.95)' },
      { offset: 1, color: 'rgba(80, 40, 0, 0.6)' }
    ])
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(0, 212, 255, 0.9)' },
      { offset: 1, color: 'rgba(0, 50, 100, 0.6)' }
    ])
  }
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: 'rgba(0, 180, 255, 0.95)' },
    { offset: 1, color: 'rgba(0, 40, 100, 0.55)' }
  ])
}

/**
 * 地图配置参数接口
 */
export interface MapConfigParams {
  /** 地图显示模式 */
  mode: MapMode
  /** 500kV变电站列表 */
  substations500: Substation[]
  /** 220kV变电站列表 */
  substations220: Substation[]
  /** 110kV变电站列表 */
  substations110: Substation[]
  /** 输电线路列表 */
  transmissionLines: TransmissionLine[]
  /** 各区域负荷数据 */
  districtLoads: DistrictLoadRecord
}

/**
 * 生成北京电网态势感知3D地图的ECharts配置
 *
 * @param params - 地图配置参数
 * @param params.mode - 地图显示模式：'grid' | 'load' | 'alarm'
 * @param params.substations500 - 500kV变电站数据列表
 * @param params.substations220 - 220kV变电站数据列表
 * @param params.substations110 - 110kV变电站数据列表
 * @param params.transmissionLines - 输电线路数据列表
 * @param params.districtLoads - 各区域负荷数据记录
 * @returns 完整的ECharts 3D地图配置对象
 *
 * @example
 * ```ts
 * const option = getMapOption({
 *   mode: 'grid',
 *   substations500: [{ name: '顺义500kV', coord: [116.65, 40.13] }],
 *   substations220: [...],
 *   substations110: [...],
 *   transmissionLines: [...],
 *   districtLoads: { '朝阳区': 420, '海淀区': 388, ... }
 * })
 * chart.setOption(option)
 * ```
 */
export function getMapOption({
  mode,
  substations500,
  substations220,
  substations110,
  transmissionLines,
  districtLoads
}: MapConfigParams): EChartsOption {
  const bar3DData = Object.entries(districtLoads).map(([name, baseLoad]) => {
    const load = baseLoad + Math.round((Math.random() - 0.5) * 20)
    return {
      name,
      value: load,
      itemStyle: { color: getDistrictColor(load, mode) }
    }
  })

  const scatter500 = substations500.map(s => ({
    name: s.name,
    value: [...s.coord, 80],
    symbolSize: 14,
    itemStyle: { color: '#00ff88' },
    label: { show: true, formatter: (p: { name: string }) => p.name, color: '#00ff88', fontSize: 9, distance: 5 }
  }))

  const scatter220 = substations220.map(s => ({
    name: s.name,
    value: [...s.coord, 60],
    symbolSize: 9,
    itemStyle: { color: '#00d4ff' },
    label: { show: false }
  }))

  const scatter110 = substations110.map(s => ({
    name: s.name,
    value: [...s.coord, 45],
    symbolSize: 7,
    itemStyle: { color: '#7b68ee' },
    label: { show: false }
  }))

  const lines3DData = transmissionLines.map(line => ({
    coords: [[...line.from, 20], [...line.to, 20]],
    lineStyle: {
      color: getLineColor(line.load + Math.round((Math.random() - 0.5) * 10)),
      width: 2,
      opacity: 0.85
    }
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      backgroundColor: 'rgba(0, 10, 35, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.6)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: '#ffffff', fontSize: 13 },
      formatter: (params: { name: string; value: number | number[] }) => {
        if (typeof params.value === 'number') {
          const load = params.value
          const status = load > 350
            ? '<span style="color:#ff6b6b;font-weight:700">● 高负荷</span>'
            : load > 200
              ? '<span style="color:#ffb347;font-weight:700">● 中负荷</span>'
              : '<span style="color:#00ff88;font-weight:700">● 正常</span>'
          return `<div style="color:#ffffff;font-weight:700;font-size:14px;margin-bottom:4px">${params.name}</div>`
            + `<div style="color:#d0eeff">用电量：<span style="color:#ffffff;font-weight:700">${load}</span> 万kWh</div>`
            + `<div style="margin-top:2px">状态：${status}</div>`
        }
        if (Array.isArray(params.value) && params.value[2]) {
          const kv = params.value[2] > 70 ? 500 : params.value[2] > 50 ? 220 : 110
          const kvColor = kv === 500 ? '#00ff88' : kv === 220 ? '#00d4ff' : '#9b8ffa'
          return `<div style="color:#ffffff;font-weight:700;font-size:14px;margin-bottom:4px">${params.name}</div>`
            + `<div style="color:#d0eeff">电压等级：<span style="color:${kvColor};font-weight:700">${kv} kV</span></div>`
        }
        return `<span style="color:#ffffff">${params.name}</span>`
      }
    },
    globe: undefined,
    geo3D: {
      map: 'beijing',
      regionHeight: 4,
      roam: true,
      boxWidth: 100,
      boxHeight: 10,
      boxDepth: 80,
      viewControl: {
        distance: 110,
        alpha: 42,
        beta: 2,
        minAlpha: 15,
        maxAlpha: 75,
        autoRotate: false,
        rotateSensitivity: 1,
        zoomSensitivity: 1
      },
      itemStyle: {
        color: 'rgba(0, 25, 70, 0.88)',
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 255, 0.55)'
      },
      emphasis: {
        itemStyle: {
          color: 'rgba(0, 80, 160, 0.95)',
          borderColor: '#00d4ff',
          borderWidth: 2
        },
        label: {
          show: true,
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 'bold',
          textStyle: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 10, 35, 0.88)',
            padding: [4, 10],
            borderRadius: 3
          }
        }
      },
      label: {
        show: false,
        color: '#ffffff',
        textStyle: { color: '#ffffff' }
      },
      light: {
        main: {
          intensity: 1.4,
          shadow: true,
          shadowQuality: 'high',
          alpha: 55,
          beta: 10
        },
        ambient: { intensity: 0.5 },
        ambientCubemap: {
          exposure: 1,
          diffuseIntensity: 0.5
        }
      },
      postEffect: {
        enable: true,
        bloom: { enable: true, bloomIntensity: 0.15 },
        SSAO: { enable: true, quality: 'medium', radius: 2 },
        temporalSuperSampling: { enable: true }
      },
      groundPlane: {
        show: true,
        color: 'rgba(0, 5, 20, 0.95)'
      }
    },
    series: [
      {
        type: 'bar3D',
        coordinateSystem: 'geo3D',
        data: bar3DData,
        bevelSize: 0.3,
        bevelSmoothness: 4,
        shading: 'realistic',
        realisticMaterial: {
          roughness: 0.4,
          metalness: 0.5
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            textStyle: {
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 'bold',
              backgroundColor: 'rgba(0, 10, 35, 0.85)',
              padding: [4, 8],
              borderRadius: 3
            }
          }
        }
      },
      {
        type: 'lines3D',
        coordinateSystem: 'geo3D',
        data: lines3DData,
        effect: {
          show: true,
          trailWidth: 2,
          trailLength: 0.25,
          trailOpacity: 1,
          trailColor: '#00d4ff'
        },
        blendMode: 'source-over',
        lineStyle: { width: 1.5, opacity: 0.7 },
        silent: true
      },
      {
        type: 'scatter3D',
        coordinateSystem: 'geo3D',
        data: scatter500,
        symbol: 'diamond',
        symbolSize: 14,
        itemStyle: { color: '#00ff88', opacity: 1 },
        label: {
          show: true,
          formatter: (p: { name: string }) => p.name,
          textStyle: {
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 20, 50, 0.82)',
            padding: [3, 6],
            borderRadius: 2,
            borderWidth: 1,
            borderColor: 'rgba(0, 255, 136, 0.5)'
          },
          distance: 8,
          position: 'top'
        }
      },
      {
        type: 'scatter3D',
        coordinateSystem: 'geo3D',
        data: scatter220,
        symbol: 'circle',
        symbolSize: 9,
        itemStyle: { color: '#00d4ff', opacity: 1 }
      },
      {
        type: 'scatter3D',
        coordinateSystem: 'geo3D',
        data: scatter110,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#7b68ee', opacity: 1 }
      }
    ]
  }
}
