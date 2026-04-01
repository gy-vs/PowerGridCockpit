import type { EChartsOption } from 'echarts'

/**
 * 发电能源结构数据项接口
 */
export interface GenerationItem {
  /** 能源类型名称 */
  name: string
  /** 发电量数值，单位：亿千瓦时 */
  value: number
  /** 显示颜色 */
  color: string
  /** 占比百分比 */
  pct: string
}

/**
 * 发电能源颜色配置
 */
export const GENERATION_COLORS = ['#00d4ff', '#00ff88', '#0080ff', '#ff9500', '#7b68ee', '#ff4444']

/**
 * 生成发电能源结构饼图的ECharts配置
 *
 * @param data - 发电能源数据数组
 * @returns 完整的ECharts配置对象
 *
 * @example
 * ```ts
 * const data = [
 *   { name: '火力发电', value: 9.2, color: '#00d4ff', pct: '35.2' },
 *   { name: '水力发电', value: 5.8, color: '#00ff88', pct: '22.1' }
 * ]
 * const option = getGenerationPieOption(data)
 * chart.setOption(option)
 * ```
 */
export function getGenerationPieOption(data: GenerationItem[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    series: [{
      type: 'pie',
      radius: ['38%', '68%'],
      center: ['50%', '50%'],
      data: data.map(d => ({ name: d.name, value: d.value })),
      itemStyle: {
        color: (params: { dataIndex: number }) => GENERATION_COLORS[params.dataIndex],
        borderColor: '#050a1a',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 212, 255, 0.5)'
        }
      }
    }]
  }
}
