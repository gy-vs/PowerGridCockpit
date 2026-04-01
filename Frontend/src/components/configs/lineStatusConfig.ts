import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

/**
 * 输电线路负荷率数据接口
 */
export interface LineStatusData {
  /** 线路名称数组 */
  lineNames: string[]
  /** 对应线路的负荷率数组（0-100） */
  loadRates: number[]
}

/**
 * 根据负荷率获取颜色
 *
 * @param rate - 负荷率数值（0-100）
 * @returns 对应的颜色值
 * @internal
 */
function getLoadRateColor(rate: number): string {
  if (rate > 90) return '#ff4444'
  if (rate > 75) return '#ff9500'
  return '#00d4ff'
}

/**
 * 生成输电线路负荷率水平柱状图的ECharts配置
 *
 * @param data - 线路负荷率数据
 * @param data.lineNames - 输电线路名称数组
 * @param data.loadRates - 对应线路的负荷率数值数组（0-100）
 * @returns 完整的ECharts配置对象
 *
 * @example
 * ```ts
 * const option = getLineStatusOption({
 *   lineNames: ['昌顺220kV', '顺通110kV', '通兴220kV'],
 *   loadRates: [65, 88, 72]
 * })
 * chart.setOption(option)
 * ```
 */
export function getLineStatusOption({ lineNames, loadRates }: LineStatusData): EChartsOption {
  const colors = loadRates.map(getLoadRateColor)

  return {
    backgroundColor: 'transparent',
    grid: { top: 8, right: 60, bottom: 8, left: 72, containLabel: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: 'rgba(0, 15, 45, 0.92)',
      borderColor: 'rgba(0, 212, 255, 0.35)',
      textStyle: { color: '#b0d4ff', fontSize: 11 },
      formatter: (params: unknown) => {
        if (Array.isArray(params) && params.length > 0) {
          const p = params[0] as { name: string; value: number }
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
      data: lineNames,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#7db8d4', fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: loadRates.map((v, i) => ({
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
