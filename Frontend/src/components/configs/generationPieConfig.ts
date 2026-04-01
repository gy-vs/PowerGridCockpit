import * as echarts from 'echarts'

/**
 * 发电能源数据项
 */
export interface GenItem {
  /** 能源类型名称 */
  name: string
  /** 发电量，单位：亿千瓦时 */
  value: number
  /** 图表颜色 */
  color: string
  /** 占比百分比 */
  pct: string
}

/**
 * 发电能源结构饼图配置参数
 */
export interface GenerationPieConfigParams {
  /** 发电能源数据数组 */
  data: GenItem[]
}

/**
 * 颜色配置数组，对应不同的能源类型
 */
const COLORS = ['#00d4ff', '#00ff88', '#0080ff', '#ff9500', '#7b68ee', '#ff4444']

/**
 * 构建发电能源结构饼图的 ECharts 配置
 *
 * @param params - 配置参数对象
 * @param params.data - 发电能源数据数组，包含名称、数值、颜色和占比
 * @returns 完整的 ECharts 配置对象
 */
export function buildGenerationPieOption({ data }: GenerationPieConfigParams): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    series: [{
      type: 'pie',
      radius: ['38%', '68%'],
      center: ['50%', '50%'],
      data: data.map(d => ({ name: d.name, value: d.value })),
      itemStyle: {
        color: (params: { dataIndex: number }) => COLORS[params.dataIndex],
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
