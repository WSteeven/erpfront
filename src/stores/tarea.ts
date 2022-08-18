import { Tarea } from 'pages/tareas/controlTareas/domain/Tarea'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useTareaStore = defineStore('tarea', () => {
  // State
  const tarea = reactive(new Tarea())

  // Actions
  return {
    // State
    tarea,
  }
})
