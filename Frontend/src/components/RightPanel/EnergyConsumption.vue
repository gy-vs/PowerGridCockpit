<template>
  <div class="panel-card energy-consumption" role="region" aria-label="各区用电量统计">
    <div class="card-title">
      <div class="title-icon" aria-hidden="true"></div>
      <span>各区用电量统计</span>
      <span class="title-unit">单位：万kWh</span>
    </div>
    <div ref="chartRef" class="chart-body"
      role="img" aria-label="各区用电量柱状图，单位万千瓦时"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getEnergyConsumptionConfig } from '../configs/energyConsumptionConfig'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
let timer: ReturnType<typeof setInterval>

const DISTRICTS = ['朝阳', '海淀', '丰台', '西城', '东城', '石景山', '顺义', '大兴']
const BASE_VALUES = [420, 388, 310, 195, 172, 135, 285, 265]

function getConsumption() {
  return BASE_VALUES.map(v => Math.round(v + (Math.random() - 0.5) * 30))
}

function handleResize() { chart?.resize() }

onMounted(() => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(getEnergyConsumptionConfig(getConsumption(), DISTRICTS))
  timer = setInterval(() => {
    chart?.setOption(getEnergyConsumptionConfig(getConsumption(), DISTRICTS))
  }, 6000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.energy-consumption {
  flex: 0 0 auto;
  height: 185px;
  display: flex;
  flex-direction: column;
}

.chart-body {
  flex: 1;
  min-height: 0;
}
</style>
