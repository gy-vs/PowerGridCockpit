import * as echarts from 'echarts'

/**
 * 输电线路负荷率配置参数
 */
export interface LineStatusConfigParams {
  /** 各线路负荷率数组 */
  rates: number[]
}

/**
 * 输电线路名称列表
 */
const LINES = [
  '昌顺220kV', '顺通110kV', '通兴220kV',
  '兴房110kV', '房密110kV', '密延110kV', '延石500kV'
]

/**
 * 根据负荷率获取对应的颜色
 *
 * @param rate - 负荷率百分比
 * @returns 对应的颜色值
 */
function getRateColor(rate: number): string {
  return rate > 90 ? '#ff4444' : rate > 75 ? '#ff9500' : '#00d4ff'
}

/**
 * 构建输电线路负荷率水平柱状图的 ECharts 配置
 *
 * @param params - 配置参数对象
 * @param params.rates - 各线路负荷率数组，顺序与线路列表对应
 * @returns 完整的 ECharts 配置对象
 */
export function buildLineStatusOption({ rates }: LineStatusConfigParams): echarts.EChartsOption {
  const colors = rates.map(getRateColor)

  return {
    backgroundColor: 'transparent',
    grid: { top: 8, right: 60, bottom: 8, left: 72, containLabel: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: 'rgba(0, 15, 45, 0.92)',
      borderColor: 'rgba(0, 212, 255, 0.35)',
      textStyle: { color: '#b0d4ff', fontSize: 11 },
      formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
        if (Array.isArray(params)) {
          const p = params[0]
          return `${p.name}<br/>负荷率：<b style="color:#00d4ff">${p.value}%</b>`
        }
        return ''
      }
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0, 80, 120, 0.2)', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: LINES,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#7db8d4', fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: rates.map((v, i) => ({
        value: v,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: colors[i] + '55' },
            { offset: 1, color: colors[i] }
          ]),
          borderRadius: [0, 2, 2, 0]
        }
      })),
      barWidth: 10,
      label: {
        show: true,
        position: 'right',
        color: '#7db8d4',
        fontSize: 11,
        formatter: '{c}%'
      }
    }]
  }
}
