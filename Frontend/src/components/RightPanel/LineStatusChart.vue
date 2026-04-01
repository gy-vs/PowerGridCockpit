<template>
  <div class="panel-card line-status-chart" role="region" aria-label="输电线路负荷率">
    <div class="card-title">
      <div class="title-icon" aria-hidden="true"></div>
      <span>输电线路负荷率</span>
      <span class="title-unit">实时监测</span>
    </div>
    <div ref="chartRef" class="chart-body"
      role="img" aria-label="输电线路负荷率水平柱状图"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { buildLineStatusOption } from '../configs/lineStatusConfig'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
let timer: ReturnType<typeof setInterval>

const LINES = [
  '昌顺220kV', '顺通110kV', '通兴220kV',
  '兴房110kV', '房密110kV', '密延110kV', '延石500kV'
]

function getLoadRates() {
  return LINES.map(() => Math.round(45 + Math.random() * 50))
}

function handleResize() { chart?.resize() }

onMounted(() => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildLineStatusOption({ rates: getLoadRates() }))
  timer = setInterval(() => {
    chart?.setOption(buildLineStatusOption({ rates: getLoadRates() }))
  }, 5000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.line-status-chart {
  flex: 0 0 auto;
  height: 210px;
  display: flex;
  flex-direction: column;
}

.chart-body {
  flex: 1;
  min-height: 0;
}
</style>
