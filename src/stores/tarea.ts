import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTareaStore = defineStore('tarea', () => {
  // State
  const tarea = ref()

  const mostrarFormulario = computed(() => Boolean(tarea.value))

  return {
    // State
    tarea,
    mostrarFormulario,
  }
})
