<template>
  <div class="row">
    <div
      class="col-12 q-pa-sm"
      :class="{ [border]: true, [background]: true }"
      :style="style"
    >
      <q-icon :name="icono" :color="color" class="q-mr-sm"></q-icon>
      <span v-html="mensaje" :class="{ 'text-black': $q.dark.isActive }"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const props = defineProps({
  mensaje: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    default: 'warning'
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

const border = ref('border-callout-info')
const background = ref('bg-blue-1')
const icono = ref('bi-info-circle')
const color = ref('info')
const $q = useQuasar()

switch (props.tipo) {
  case 'error':
    border.value = 'border-callout-error'
    break
  case 'success':
    border.value = 'border-callout-success'
    break
  case 'info':
    border.value = 'border-callout-info'
    break
  case 'warning':
    border.value = 'border-callout-warning'
    break
}

switch (props.tipo) {
  case 'error':
    icono.value = 'bi-dash-circle'
    break
  case 'success':
    icono.value = 'bi-check-circle'
    break
  case 'info':
    icono.value = 'bi-info-circle'
    break
  case 'warning':
    icono.value = 'bi-exclamation-octagon'
    break
}

switch (props.tipo) {
  case 'error':
    color.value = 'negative'
    break
  case 'success':
    color.value = 'positive'
    break
  case 'info':
    color.value = 'info'
    break
  case 'warning':
    color.value = 'warning'
    break
}

switch (props.tipo) {
  case 'error':
    background.value = 'bg-pink-1'
    break
  case 'success':
    background.value = 'bg-green-1'
    break
  case 'info':
    background.value = 'bg-blue-1'
    break
  case 'warning':
    background.value = 'bg-amber-1'
    break
}
</script>
