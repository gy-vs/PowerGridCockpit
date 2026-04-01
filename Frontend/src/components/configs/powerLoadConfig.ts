import * as echarts from 'echarts'

/**
 * 电力负荷图表配置参数
 */
export interface PowerLoadConfigParams {
  /** 24小时负荷数据数组，单位：万千瓦 */
  loads: number[]
}

/**
 * 构建实时电网负荷曲线的 ECharts 配置
 *
 * @param params - 配置参数对象
 * @param params.loads - 24小时负荷数据数组，单位：万千瓦
 * @returns 完整的 ECharts 配置对象
 */
export function buildPowerLoadOption({ loads }: PowerLoadConfigParams): echarts.EChartsOption {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
  const currentHour = new Date().getHours()

  return {
    backgroundColor: 'transparent',
    grid: { top: 24, right: 12, bottom: 28, left: 52 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 15, 45, 0.92)',
      borderColor: 'rgba(0, 212, 255, 0.35)',
      borderWidth: 1,
      textStyle: { color: '#b0d4ff', fontSize: 11 },
      formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
        if (Array.isArray(params)) {
          const p = params[0]
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
        data: [[currentHour, loads[currentHour]]],
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#00ff88', shadowColor: '#00ff88', shadowBlur: 12 }
      }
    ]
  }
}
