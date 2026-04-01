import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

/**
 * 电网负荷数据接口
 */
export interface PowerLoadData {
  /** 24小时负荷数据数组，单位：万千瓦 */
  loads: number[]
  /** 当前小时数（0-23） */
  currentHour?: number
}

/**
 * 生成实时电网负荷曲线的ECharts配置
 *
 * @param data - 负荷数据配置对象
 * @param data.loads - 24小时负荷数据数组
 * @param data.currentHour - 当前小时数，用于标记当前时间点
 * @returns 完整的ECharts配置对象
 *
 * @example
 * ```ts
 * const option = getPowerLoadOption({
 *   loads: [420, 385, 355, ...],
 *   currentHour: 14
 * })
 * chart.setOption(option)
 * ```
 */
export function getPowerLoadOption({ loads, currentHour }: PowerLoadData): EChartsOption {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
  const hour = currentHour ?? new Date().getHours()

  return {
    backgroundColor: 'transparent',
    grid: { top: 24, right: 12, bottom: 28, left: 52 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 15, 45, 0.92)',
      borderColor: 'rgba(0, 212, 255, 0.35)',
      borderWidth: 1,
      textStyle: { color: '#b0d4ff', fontSize: 11 },
      formatter: (params: unknown) => {
        if (Array.isArray(params) && params.length > 0) {
          const p = params[0] as { name: string; value: number }
          return `${p.name}<br/><span style="color:#00d4ff">●</span> 负荷：<b style="color:#00d4ff">${p.value}</b> 万kW`
        }
        return ''
      }
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.2)' } },
      axisLabel: { color: '#6aaabb', fontSize: 11, interval: 5 },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 200,
      axisLine: { show: false },
      axisLabel: { color: '#6aaabb', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0, 100, 150, 0.15)', type: 'dashed' } }
    },
    series: [
      {
        type: 'line',
        data: loads,
        smooth: 0.4,
        symbol: 'none',
        lineStyle: { width: 2, color: '#00d4ff', shadowColor: 'rgba(0,212,255,0.4)', shadowBlur: 8 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.25)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.01)' }
          ])
        }
      },
      {
        type: 'scatter',
        data: [[hour, loads[hour]]],
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#00ff88', shadowColor: '#00ff88', shadowBlur: 12 }
      }
    ]
  }
}
