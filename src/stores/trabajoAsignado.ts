import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useTrabajoAsignadoStore = defineStore('trabajoAsignado', () => {
  const idSubtareaSeleccionada = ref()
  const idTipoTrabajoSubtarea = ref()
  const subtarea = reactive(new Subtarea())

  return {
    idSubtareaSeleccionada,
    idTipoTrabajoSubtarea,
    subtarea,
  }
})
