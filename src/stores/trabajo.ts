import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrabajoStore = defineStore('trabajo', () => {
  /**
   * Niveles
   * Nivel 0: Tarea
   * Nivel 1: Subtarea
   * Nivel 2: Subtarea
   * ...
   */
  const nivelActual = ref(0)

  return {
    nivelActual
  }
})
