import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

/**
 * 区域用电量数据接口
 */
export interface EnergyConsumptionData {
  /** 区域名称数组 */
  districts: string[]
  /** 对应区域的用电量数值数组，单位：万kWh */
  values: number[]
}

/**
 * 生成各区用电量统计柱状图的ECharts配置
 *
 * @param data - 用电量数据
 * @param data.districts - 区域名称数组
 * @param data.values - 对应区域用电量数值数组（单位：万kWh）
 * @returns 完整的ECharts配置对象
 *
 * @example
 * ```ts
 * const option = getEnergyConsumptionOption({
 *   districts: ['朝阳', '海淀', '丰台', '西城'],
 *   values: [420, 388, 310, 195]
 * })
 * chart.setOption(option)
 * ```
 */
export function getEnergyConsumptionOption({ districts, values }: EnergyConsumptionData): EChartsOption {
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
