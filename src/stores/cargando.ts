import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCargandoStore = defineStore('cargando', () => {
  // State
  const cargando = ref(false)

  // Actions
  function activarCargando() {
    cargando.value = true
  }

  function desactivarCargando() {
    cargando.value = false
  }

  return {
    // State
    cargando,
    // Actions
    activarCargando,
    desactivarCargando,
  }
})
