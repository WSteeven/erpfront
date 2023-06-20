import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCargandoStore = defineStore('cargando', () => {
  // State
  const cargando = ref(false)
  const $q = ref()

  // Actions
  function activarCargando() {
    cargando.value = true
  }

  function desactivarCargando() {
    cargando.value = false
  }

  function setQuasar($instancia) {
    $q.value = $instancia
  }

  return {
    // State
    $q,
    cargando,
    // Actions
    activarCargando,
    desactivarCargando,
    setQuasar,
  }
})
