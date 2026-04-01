import * as echarts from 'echarts'

/**
 * 生成各区用电量统计图表配置
 * @param values - 各区用电量数组，单位：万kWh
 * @param districts - 区域名称数组
 * @returns 完整的 ECharts option 配置对象
 */
export function getEnergyConsumptionConfig(values: number[], districts: string[]): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    grid: { top: 14, right: 12, bottom: 30, left: 36 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 15, 45, 0.92)',
      borderColor: 'rgba(0, 212, 255, 0.35)',
      textStyle: { color: '#b0d4ff', fontSize: 11 }
    },
    xAxis: {
      type: 'category',
      data: districts,
      axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.2)' } },
      axisLabel: { color: '#7db8d4', fontSize: 11 },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6aaabb', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0, 80, 120, 0.15)', type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({
        value: v,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: i < 3 ? '#00d4ff' : '#0080ff' },
            { offset: 1, color: i < 3 ? '#004488' : '#003366' }
          ]),
          borderRadius: [2, 2, 0, 0]
        }
      })),
      barWidth: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 212, 255, 0.4)'
        }
      }
    }]
  }
}
