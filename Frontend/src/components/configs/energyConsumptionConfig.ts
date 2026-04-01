import * as echarts from 'echarts'

/**
 * 各区用电量统计配置参数
 */
export interface EnergyConsumptionConfigParams {
  /** 各区用电量数据数组，单位：万kWh */
  values: number[]
}

/**
 * 行政区名称列表
 */
const DISTRICTS = ['朝阳', '海淀', '丰台', '西城', '东城', '石景山', '顺义', '大兴']

/**
 * 构建各区用电量柱状图的 ECharts 配置
 *
 * @param params - 配置参数对象
 * @param params.values - 各区用电量数据数组，顺序与行政区列表对应
 * @returns 完整的 ECharts 配置对象
 */
export function buildEnergyConsumptionOption({ values }: EnergyConsumptionConfigParams): echarts.EChartsOption {
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
      data: DISTRICTS,
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
