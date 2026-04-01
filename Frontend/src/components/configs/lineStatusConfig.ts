import * as echarts from 'echarts'

/**
 * 生成输电线路负荷率图表配置
 * @param rates - 各线路负荷率数组，范围 0-100
 * @param lines - 线路名称数组
 * @returns 完整的 ECharts option 配置对象
 */
export function getLineStatusConfig(rates: number[], lines: string[]): echarts.EChartsOption {
  const colors = rates.map(r =>
    r > 90 ? '#ff4444' : r > 75 ? '#ff9500' : '#00d4ff'
  )

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
      data: lines,
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
