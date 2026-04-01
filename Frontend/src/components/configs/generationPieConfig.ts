import * as echarts from 'echarts'

/**
 * 发电能源结构饼图数据项接口
 */
export interface GenItem {
  name: string
  value: number
  color: string
  pct: string
}

/**
 * 生成发电能源结构饼图配置
 * @param data - 发电能源数据数组
 * @param colors - 颜色数组，用于区分不同能源类型
 * @returns 完整的 ECharts option 配置对象
 */
export function getGenerationPieConfig(data: GenItem[], colors: string[]): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    series: [{
      type: 'pie',
      radius: ['38%', '68%'],
      center: ['50%', '50%'],
      data: data.map(d => ({ name: d.name, value: d.value })),
      itemStyle: {
        color: (params: { dataIndex: number }) => colors[params.dataIndex],
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
