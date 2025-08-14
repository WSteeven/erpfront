<template>
  <VChart
      ref="chartRef"
      :option="internalOption"
      :theme="theme"
      :renderer="renderer"
      :autoresize="autoresize"
      :update-options="updateOptionsFinal"
      class="full-width"
      :style="chartStyle"
      @finished="onFinished"
      @click="onClick"
      @datazoom="onDataZoom"
      @legendselectchanged="onLegendChange"
  />
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, computed, watch } from 'vue'
import { LocalStorage } from 'quasar'

type UpdateOptions = {
  notMerge?: boolean
  replaceMerge?: string | string[]
  lazyUpdate?: boolean
  transition?: any
}

const props = defineProps<{
  option?: any
  labels?: (string | number)[]
  series?: any[]
  height?: string | number
  width?: string | number
  autoresize?: boolean
  theme?: string                 // ej: 'jpDark' | 'jpLight'
  renderer?: 'canvas' | 'svg'
  replaceOnUpdate?: boolean
  updateOptions?: UpdateOptions
}>()

const emit = defineEmits<{
  (e: 'finished'): void
  (e: 'click', payload: any): void
  (e: 'datazoom', payload: any): void
  (e: 'legendselectchanged', payload: any): void
}>()

const chartRef = ref<any>(null)

const autoresize = computed(() => props.autoresize ?? true)
const modoOscuro = ref(!!LocalStorage.getItem('dark'))
const theme = computed(() => {
  // usa el tema que te pasen o decide según dark mode
  return props.theme ?? (modoOscuro.value ? 'jpDark' : 'jpLight')
})
const renderer = computed(() => props.renderer ?? 'canvas')

const chartStyle = computed(() => {
  const h = typeof props.height === 'number' ? `${props.height}px` : (props.height ?? '420px')
  // si te pasan string sin unidad, corrige a porcentaje
  const hasUnit = typeof props.width === 'string' && /px|%|vh|vw|rem|em$/.test(props.width)
  const w = typeof props.width === 'number'
      ? `${props.width}px`
      : (hasUnit ? props.width! : (props.width ?? '100%'))
  return { height: h, width: w }
})

const baseDefaultOption = computed(() => ({
  animation: true,
  tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
  legend: { top: 10 },
  grid: { left: 40, right: 20, top: 40, bottom: 40, containLabel: true },
  xAxis: { type: 'category', data: props.labels ?? [], boundaryGap: false },
  yAxis: { type: 'value', scale: true, splitLine: { lineStyle: { type: 'dashed' } } },
  series: props.series?.length
      ? props.series
      : [
        {
          name: 'Serie 1',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.15 },
          data: []
        }
      ]
}))

function deepMerge(target: any, source: any) {
  if (Array.isArray(source)) return source.slice()
  const out: any = { ...(Array.isArray(target) ? {} : target) }
  for (const k of Object.keys(source ?? {})) {
    const sv = source[k], tv = (target ?? {})[k]
    out[k] = (sv && typeof sv === 'object' && !Array.isArray(sv))
        ? deepMerge(tv, sv)
        : sv
  }
  return out
}

const internalOption = computed(() => {
  // if (props.option && Object.keys(props.option).length) {
  //   return deepMerge(baseDefaultOption.value, props.option)
  // }
  // return baseDefaultOption.value
  return Object.keys(props.option ??{}).length? props.option :baseDefaultOption.value
})

const updateOptionsFinal = computed<UpdateOptions>(() => {
  if (props.updateOptions) return props.updateOptions
  if (props.replaceOnUpdate) return { notMerge: true, lazyUpdate: true }
  return { notMerge: false, lazyUpdate: true }
})

watch(
    () => [props.option, props.labels, props.series],
    () => {
      if (chartRef.value?.setOption) {
        chartRef.value.setOption(internalOption.value, updateOptionsFinal.value)
      }
    },
    { deep: true }
)

function setOption(next: any, opts?: UpdateOptions) {
  const final = deepMerge(baseDefaultOption.value, next ?? {})
  chartRef.value?.setOption?.(final, opts ?? updateOptionsFinal.value)
}
function getInstance() {
  return chartRef.value?.chart
}

function onFinished() { emit('finished') }
function onClick(e: any) { emit('click', e) }
function onDataZoom(e: any) { emit('datazoom', e) }
function onLegendChange(e: any) { emit('legendselectchanged', e) }

onBeforeUnmount(() => {
  try { chartRef.value?.dispose?.() } catch {}
})

defineExpose({ setOption, getInstance })
</script>

<style scoped>
.full-width { width: 100%; }
</style>
