<template>
  <div class="panel-card power-load-chart" role="region" aria-label="实时电网负荷曲线">
    <div class="card-title">
      <div class="title-icon" aria-hidden="true"></div>
      <span>实时电网负荷曲线</span>
      <span class="title-unit">单位：万千瓦</span>
    </div>
    <div ref="chartRef" class="chart-body"
      role="img" aria-label="24小时电网负荷折线图，单位万千瓦"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getPowerLoadConfig } from '../configs/powerLoadConfig'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
let timer: ReturnType<typeof setInterval>

const BASE_LOADS = [
  420, 385, 355, 330, 318, 336, 495, 658,
  782, 856, 872, 845, 808, 825, 855, 874,
  892, 928, 882, 805, 724, 642, 562, 490
]

function getLoadData() {
  return BASE_LOADS.map(v => v + Math.round((Math.random() - 0.5) * 25))
}

function handleResize() { chart?.resize() }

onMounted(() => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(getPowerLoadConfig(getLoadData()))
  timer = setInterval(() => {
    chart?.setOption(getPowerLoadConfig(getLoadData()))
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
.power-load-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chart-body {
  flex: 1;
  min-height: 0;
}
</style>
